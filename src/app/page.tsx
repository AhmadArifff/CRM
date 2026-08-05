'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar, TabType } from '../components/layout/Sidebar';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { DealsKanban } from '../components/kanban/DealsKanban';
import { ContactsTable } from '../components/contacts/ContactsTable';
import { ActivityLogger } from '../components/activities/ActivityLogger';
import { PrdViewer } from '../components/prd/PrdViewer';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { CommandPalette } from '../components/ui/CommandPalette';
import { apiClient } from '../services/apiClient';
import {
  INITIAL_USERS,
  INITIAL_STAGES,
  INITIAL_DEALS,
  INITIAL_CONTACTS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';
import { User, Deal, Contact, Activity, StageId } from '../types/crm';

export default function CRMDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Core CRM Entities State
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);

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

  // Fetch initial state from API
  useEffect(() => {
    async function loadDataFromApi() {
      try {
        const [contactsRes, dealsRes, activitiesRes] = await Promise.all([
          apiClient.getContacts(),
          apiClient.getDeals(),
          apiClient.getActivities(),
        ]);

        if (contactsRes.success && contactsRes.data.length > 0) {
          setContacts(contactsRes.data);
        }
        if (dealsRes.success && dealsRes.data.length > 0) {
          setDeals(dealsRes.data);
        }
        if (activitiesRes.success && activitiesRes.data.length > 0) {
          setActivities(activitiesRes.data);
        }
      } catch (err) {
        console.warn('Backend API Sync Warning: Falling back to local state.', err);
      }
    }

    loadDataFromApi();
  }, []);

  const salesRepNames = INITIAL_USERS.map((u) => u.name);

  // API Integrated Handler: Move deal stage
  const handleMoveDeal = async (dealId: string, targetStage: StageId) => {
    const targetDeal = deals.find((d) => d.id === dealId);
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stageId: targetStage } : d))
    );

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
    setContacts((prev) => [createdTemp, ...prev]);
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
    addToast(`Log aktivitas "${newActData.subject}" berhasil disimpan!`);

    try {
      const res = await apiClient.createActivity(newActData);
      if (res.success) {
        setActivities((prev) => prev.map((a) => (a.id === createdTemp.id ? res.data : a)));
      }
    } catch (err) {
      console.error('Failed to save activity to API:', err);
    }
  };

  // API Integrated Handler: Toggle activity completed state
  const handleToggleActivity = async (activityId: string) => {
    const targetAct = activities.find((a) => a.id === activityId);
    setActivities((prev) =>
      prev.map((a) => (a.id === activityId ? { ...a, isCompleted: !a.isCompleted } : a))
    );

    const statusText = !targetAct?.isCompleted ? 'selesai' : 'ditandai belum selesai';
    addToast(`Task "${targetAct?.subject}" ${statusText}`);

    try {
      await apiClient.toggleActivityComplete(activityId);
    } catch (err) {
      console.error('Failed to sync activity status to API:', err);
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Executive Overview';
      case 'kanban':
        return 'Deals Pipeline (Kanban)';
      case 'contacts':
        return 'Leads & Customer Contacts';
      case 'activities':
        return 'Activity Logs & Task Tracker';
      case 'prd':
        return 'PRD & Architecture Specifications';
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-gray-100 overflow-hidden relative" suppressHydrationWarning>
      {/* Toast Notification Container (Mounted Only) */}
      {mounted && <ToastContainer toasts={toasts} onDismiss={removeToast} />}

      {/* Command Palette Modal (Mounted Only) */}
      {mounted && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={setActiveTab}
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
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">
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
