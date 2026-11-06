import React from 'react';
import { ViewTab, SyncStatus } from '../types/expense';
import { Wallet, Settings, RefreshCw, Calendar, BarChart3, PieChart, TrendingUp, CheckCircle2, CloudOff } from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  syncStatus: SyncStatus;
  onSyncClick: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  syncStatus,
  onSyncClick,
  onOpenSettings,
}) => {
  const tabs: { id: ViewTab; label: string; mobileLabel: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'วันนี้ (Today)', mobileLabel: 'วันนี้', icon: <Calendar className="w-4 h-4 sm:w-4 sm:h-4" /> },
    { id: 'weekly', label: '7 วันล่าสุด', mobileLabel: '7 วัน', icon: <BarChart3 className="w-4 h-4 sm:w-4 sm:h-4" /> },
    { id: 'monthly', label: 'ประจำเดือน', mobileLabel: 'เดือนนี้', icon: <PieChart className="w-4 h-4 sm:w-4 sm:h-4" /> },
    { id: 'yearly', label: 'ประจำปี', mobileLabel: 'ทั้งปี', icon: <TrendingUp className="w-4 h-4 sm:w-4 sm:h-4" /> },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Top Brand Bar */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white flex-shrink-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-slate-800 text-base sm:text-lg leading-tight truncate">
                  ExpenseTrack
                </h1>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  {syncStatus.isConfigured ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold truncate">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                      Google Sheets Sync
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600 font-medium truncate">
                      <CloudOff className="w-3 h-3 flex-shrink-0" />
                      โหมดเครื่อง (Local)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {syncStatus.isConfigured && (
                <button
                  onClick={onSyncClick}
                  disabled={syncStatus.isSyncing}
                  title="ซิงก์ข้อมูลกับ Google Sheet"
                  className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${syncStatus.isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              )}

              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors border border-slate-200 shadow-xs"
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                <span className="hidden sm:inline">ตั้งค่า &amp; เชื่อมต่อ</span>
                <span className="sm:hidden">ตั้งค่า</span>
              </button>
            </div>
          </div>

          {/* Desktop View Tabs (Hidden on Mobile) */}
          <nav className="hidden sm:flex items-center gap-1 py-1.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Visible only on <640px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-3 flex justify-around items-center shadow-lg pb-[max(0.25rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all min-w-[64px] ${
                isActive
                  ? 'text-emerald-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-emerald-50 scale-110' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5">{tab.mobileLabel}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
