'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar, TabType } from '../components/layout/Sidebar';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { DealsKanban } from '../components/kanban/DealsKanban';
import { ProjectTaskBoard } from '../components/projects/ProjectTaskBoard';
import { ContactsTable } from '../components/contacts/ContactsTable';
import { ActivityLogger } from '../components/activities/ActivityLogger';
import { PrdViewer } from '../components/prd/PrdViewer';
import { LandingPage } from '../components/landing/LandingPage';
import { AuthModal } from '../components/auth/AuthModal';
import { NotificationsDrawer, AppNotification } from '../components/notifications/NotificationsDrawer';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { CommandPalette } from '../components/ui/CommandPalette';
import { apiClient } from '../services/apiClient';
import {
  INITIAL_USERS,
  INITIAL_STAGES,
} from '../data/mockData';
import { User, Deal, Contact, Activity, StageId, UserRole, Project, ProjectTask, TaskColumnStatus } from '../types/crm';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    title: 'Deal Stage Diperbarui',
    message: 'Deal "Pengadaan Server Data Center PT Telkom" dipindahkan ke Negotiation oleh Ahmad.',
    timestamp: '10 menit yang lalu',
    isRead: false,
    type: 'deal',
  },
  {
    id: 'n-2',
    title: 'Lead Baru Ditugaskan',
    message: 'Lead baru "Ir. Budi Santoso (PT Solusi Digital)" ditugaskan kepada Anda.',
    timestamp: '1 jam yang lalu',
    isRead: false,
    type: 'contact',
  },
  {
    id: 'n-3',
    title: 'Pengingat Task Meeting',
    message: 'Meeting demo produk dengan VP Engineering Bank Mandiri dijadwalkan pukul 14:00 WIB.',
    timestamp: '2 jam yang lalu',
    isRead: true,
    type: 'task',
  },
];

export default function CRMDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Core CRM Entities & Notification State (Loaded dynamically from Supabase API)
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Toast System State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Hydration safety flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut listener for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial state directly from Supabase REST API
  useEffect(() => {
    async function loadDataFromApi() {
      try {
        const [contactsRes, dealsRes, activitiesRes, projectsRes] = await Promise.all([
          apiClient.getContacts(currentUser.role === 'ADMIN' ? undefined : currentUser.id),
          apiClient.getDeals(currentUser.role === 'ADMIN' ? undefined : currentUser.id),
          apiClient.getActivities(currentUser.role === 'ADMIN' ? undefined : currentUser.id),
          apiClient.getProjects(),
        ]);

        if (contactsRes.success) setContacts(contactsRes.data);
        if (dealsRes.success) setDeals(dealsRes.data);
        if (activitiesRes.success) setActivities(activitiesRes.data);
        if (projectsRes.success && projectsRes.data.length > 0) {
          setProjects(projectsRes.data);
          const firstProjId = projectsRes.data[0].id;
          setSelectedProjectId(firstProjId);
          const tasksRes = await apiClient.getProjectTasks(firstProjId);
          if (tasksRes.success) setProjectTasks(tasksRes.data);
        }
      } catch (err) {
        console.error('Error syncing Supabase API data:', err);
      }
    }

    loadDataFromApi();
  }, [currentUser]);

  // Load project tasks when selected project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    async function loadTasks() {
      try {
        const tasksRes = await apiClient.getProjectTasks(selectedProjectId);
        if (tasksRes.success) setProjectTasks(tasksRes.data);
      } catch (err) {
        console.error('Error loading project tasks:', err);
      }
    }
    loadTasks();
  }, [selectedProjectId]);

  const salesRepNames = INITIAL_USERS.map((u) => u.name);

  // Authentication Handlers
  const handleAuthSuccess = (userData: { name: string; email: string; role: UserRole }) => {
    const loggedUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dealsClosedThisMonth: 0,
    };
    setCurrentUser(loggedUser);
    setIsAuthenticated(true);
    setShowLanding(false);
    addToast(`Selamat datang kembali, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLanding(true);
    addToast('Anda telah berhasil keluar dari akun ApexCRM.', 'info');
  };

  // Interactive Action Handlers (State + Supabase REST API Sync)

  // API Integrated Handler: Move deal stage
  const handleMoveDeal = async (dealId: string, targetStage: StageId) => {
    const targetDeal = deals.find((d) => d.id === dealId);

    setDeals((prevDeals) =>
      prevDeals.map((d) => (d.id === dealId ? { ...d, stageId: targetStage } : d))
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Stage Deal Berubah',
      message: `Deal "${targetDeal?.title || 'Proyek'}" dipindahkan ke stage ${targetStage}.`,
      timestamp: 'Baru saja',
      isRead: false,
      type: 'deal',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(`Deal "${targetDeal?.title || 'Proyek'}" dipindahkan ke stage ${targetStage}`);

    try {
      await apiClient.updateDealStage(dealId, targetStage);
    } catch (err) {
      console.error('Failed to sync deal stage update to API:', err);
    }
  };

  // API Integrated Handler: Add new deal
  const handleAddDeal = async (newDealData: Omit<Deal, 'id' | 'createdAt'>) => {
    const createdTemp: Deal = {
      ...newDealData,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDeals((prev) => [createdTemp, ...prev]);
    addToast(`Berhasil menambahkan Deal "${newDealData.title}"!`);

    try {
      const res = await apiClient.createDeal(newDealData);
      if (res.success) {
        setDeals((prev) => prev.map((d) => (d.id === createdTemp.id ? res.data : d)));
      }
    } catch (err) {
      console.error('Failed to save deal to API:', err);
    }
  };

  // API Integrated Handler: Add new contact/lead
  const handleAddContact = async (
    newContactData: Omit<Contact, 'id' | 'createdAt' | 'notesCount'>
  ) => {
    const createdTemp: Contact = {
      ...newContactData,
      id: `cnt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      notesCount: 0,
    };
    setContacts((prev) => [...prev, createdTemp]);
    addToast(`Lead baru "${newContactData.name}" berhasil disimpan!`);

    try {
      const res = await apiClient.createContact(newContactData);
      if (res.success) {
        setContacts((prev) => prev.map((c) => (c.id === createdTemp.id ? res.data : c)));
      }
    } catch (err) {
      console.error('Failed to save contact to API:', err);
    }
  };

  // API Integrated Handler: Add new activity
  const handleAddActivity = async (newActData: Omit<Activity, 'id'>) => {
    const createdTemp: Activity = {
      ...newActData,
      id: `act-${Date.now()}`,
    };
    setActivities((prev) => [createdTemp, ...prev]);
    addToast(`Aktivitas task "${newActData.subject}" berhasil dicatat!`);

    try {
      const res = await apiClient.createActivity(newActData);
      if (res.success) {
        setActivities((prev) => prev.map((a) => (a.id === createdTemp.id ? res.data : a)));
      }
    } catch (err) {
      console.error('Failed to save activity to API:', err);
    }
  };

  // API Integrated Handler: Toggle activity complete status
  const handleToggleActivity = async (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === activityId ? { ...a, isCompleted: !a.isCompleted } : a))
    );

    try {
      await apiClient.toggleActivityComplete(activityId);
    } catch (err) {
      console.error('Failed to toggle activity state in API:', err);
    }
  };

  // Trello Project Tasks Handlers
  const handleMoveProjectTask = async (taskId: string, newStatus: TaskColumnStatus) => {
    setProjectTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    addToast(`Status Trello Task dipindahkan ke ${newStatus}!`);

    try {
      await apiClient.updateProjectTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task status in API:', err);
    }
  };

  const handleAddProjectTask = async (
    newTaskData: Omit<ProjectTask, 'id' | 'createdAt' | 'projectId'>
  ) => {
    if (!selectedProjectId) return;
    const tempTask: ProjectTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      projectId: selectedProjectId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProjectTasks((prev) => [tempTask, ...prev]);
    addToast(`Trello Task Card "${newTaskData.title}" berhasil ditambahkan!`);

    try {
      const res = await apiClient.createProjectTask(selectedProjectId, newTaskData);
      if (res.success) {
        setProjectTasks((prev) => prev.map((t) => (t.id === tempTask.id ? res.data : t)));
      }
    } catch (err) {
      console.error('Failed to create project task in API:', err);
    }
  };

  // Notification Drawer Handlers
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('Semua notifikasi ditandai sudah dibaca.');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    addToast('Daftar notifikasi dibersihkan.');
  };

  const handleNotificationClick = (id: string) => {
    const targetNotif = notifications.find((n) => n.id === id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    if (targetNotif?.type === 'deal') setActiveTab('kanban');
    if (targetNotif?.type === 'contact') setActiveTab('contacts');
    if (targetNotif?.type === 'task') setActiveTab('activities');
  };

  // Helper title for active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Executive Overview & KPI Dashboard';
      case 'kanban':
        return 'Deals Pipeline Kanban Board';
      case 'projects':
        return 'Project Tasks & Trello Board';
      case 'contacts':
        return 'Leads & Contact Management';
      case 'activities':
        return 'Sales Activity Logs & Schedule';
      case 'prd':
        return 'PRD & System Architecture Specs';
      default:
        return 'ApexCRM Enterprise System';
    }
  };

  // Render Public Landing Page View
  if (showLanding || !isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => setAuthModal({ isOpen: true, mode: 'login' })}
          onOpenRegister={() => setAuthModal({ isOpen: true, mode: 'register' })}
          onExploreDemo={() => {
            setIsAuthenticated(true);
            setShowLanding(false);
            addToast('Mengakses mode Demo Aplikasi CRM', 'info');
          }}
        />
        <AuthModal
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onSuccess={handleAuthSuccess}
          onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b0f19] text-gray-100 overflow-hidden relative" suppressHydrationWarning>
      {/* Toast Notification Container */}
      {mounted && <ToastContainer toasts={toasts} onDismiss={removeToast} />}

      {/* Command Palette Modal */}
      {mounted && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={setActiveTab}
        />
      )}

      {/* Notifications Drawer */}
      {mounted && (
        <NotificationsDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllRead}
          onClearAll={handleClearNotifications}
          onNotificationClick={handleNotificationClick}
        />
      )}

      {/* Mobile Drawer & Responsive Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Responsive Header */}
        <Header
          currentUser={currentUser}
          onUserChange={async (selectedUser) => {
            setCurrentUser(selectedUser);
            addToast(`Persona berganti ke ${selectedUser.name} (${selectedUser.role})`, 'info');
            try {
              await apiClient.login(selectedUser.email, selectedUser.role);
            } catch (err) {
              console.error('Auth sync failed:', err);
            }
          }}
          users={INITIAL_USERS}
          onOpenAddModal={() => setActiveTab('kanban')}
          activeTabTitle={getTabTitle()}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          unreadNotificationCount={notifications.filter((n) => !n.isRead).length}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onLogout={handleLogout}
          onGoToLanding={() => setShowLanding(true)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewTab
              deals={deals}
              activities={activities}
              onNavigateToKanban={() => setActiveTab('kanban')}
            />
          )}

          {activeTab === 'kanban' && (
            <DealsKanban
              deals={deals}
              stages={INITIAL_STAGES}
              onMoveDeal={handleMoveDeal}
              onAddDeal={handleAddDeal}
              salesReps={salesRepNames}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectTaskBoard
              projects={projects}
              tasks={projectTasks}
              onMoveTask={handleMoveProjectTask}
              onAddTask={handleAddProjectTask}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              salesReps={salesRepNames}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsTable
              contacts={contacts}
              onAddContact={handleAddContact}
              salesReps={salesRepNames}
            />
          )}

          {activeTab === 'activities' && (
            <ActivityLogger
              activities={activities}
              onToggleComplete={handleToggleActivity}
              onAddActivity={handleAddActivity}
            />
          )}

          {activeTab === 'prd' && <PrdViewer />}
        </main>
      </div>
    </div>
  );
}
