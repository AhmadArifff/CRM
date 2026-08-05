'use client';

import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  Users,
  CalendarCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  X,
} from 'lucide-react';

export type TabType = 'overview' | 'kanban' | 'projects' | 'contacts' | 'activities' | 'prd';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'overview' as TabType, label: 'Overview & KPI', icon: LayoutDashboard },
    { id: 'kanban' as TabType, label: 'Deals Pipeline (Kanban)', icon: Kanban },
    { id: 'projects' as TabType, label: 'Project Tasks (Trello)', icon: Sparkles, badge: 'Sprint' },
    { id: 'contacts' as TabType, label: 'Leads & Contacts', icon: Users },
    { id: 'activities' as TabType, label: 'Activity Logs & Tasks', icon: CalendarCheck },
    { id: 'prd' as TabType, label: 'PRD & Architecture Specs', icon: FileText, highlight: true },
  ];

  const handleSelectTab = (tab: TabType) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* 1. MOBILE BACKDROP OVERLAY (< 1024px) */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* 2. SIDEBAR DRAWER (Responsive: Drawer on Mobile/Tablet <1024px, Fixed on Desktop 1024px+) */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 glass-panel border-r border-white/10 flex flex-col transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0 w-72 sm:w-80' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-white/10 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  Apex<span className="text-indigo-400">CRM</span>
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Mobile & Tablet Optimized</span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden touch-target text-gray-400 hover:text-white"
            aria-label="Close sidebar drawer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors hidden lg:block"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3.5 rounded-xl text-xs font-semibold transition-all group relative touch-target justify-start ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                    : item.highlight
                    ? 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/60 border border-purple-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.highlight ? 'text-purple-400' : 'text-gray-400'
                  }`}
                />

                {(!isCollapsed || isMobileOpen) && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && !item.badge && (
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-white/10">
          {(!isCollapsed || isMobileOpen) && (
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-gray-300">
                <span>Responsive View</span>
                <span className="text-emerald-400 font-bold">Mobile & Tablet 1st</span>
              </div>
              <p className="text-[11px] text-gray-400">Touch Target &gt;= 44px</p>
            </div>
          )}
        </div>
      </aside>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Handphone < 640px) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 flex items-center justify-around py-2 px-2 lg:hidden mobile-bottom-bar bg-slate-950/90 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-semibold transition-all touch-target flex-1 ${
                isActive
                  ? 'text-indigo-400 font-extrabold bg-indigo-500/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-indigo-400 scale-110' : ''}`} />
              <span className="truncate max-w-[64px] text-center">{item.id.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
