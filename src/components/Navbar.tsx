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
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">ExpenseTrack</h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                {syncStatus.isConfigured ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Google Sheets Sync
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <CloudOff className="w-3 h-3" />
                    โหมดเครื่อง (Local)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {syncStatus.isConfigured && (
              <button
                onClick={onSyncClick}
                disabled={syncStatus.isSyncing}
                title="ซิงก์ข้อมูลกับ Google Sheet"
                className="p-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${syncStatus.isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">ตั้งค่า & เชื่อมต่อ</span>
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <nav className="flex items-center gap-1 py-1.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onTabChange('today')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === 'today'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            วันนี้ (Today)
          </button>

          <button
            onClick={() => onTabChange('weekly')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === 'weekly'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            7 วันล่าสุด
          </button>

          <button
            onClick={() => onTabChange('monthly')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === 'monthly'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PieChart className="w-4 h-4" />
            ประจำเดือน
          </button>

          <button
            onClick={() => onTabChange('yearly')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              currentTab === 'yearly'
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            ประจำปี
          </button>
        </nav>
      </div>
    </header>
  );
};
