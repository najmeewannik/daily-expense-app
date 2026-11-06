import React, { useState, useEffect, useMemo } from 'react';
import { Expense, BudgetConfig, ViewTab, SyncStatus } from './types/expense';
import {
  loadStoredExpenses,
  saveStoredExpenses,
  loadStoredBudget,
  saveStoredBudget,
  loadGSheetUrl,
  saveGSheetUrl,
} from './services/storage';
import {
  fetchRemoteData,
  syncAddExpense,
  syncDeleteExpense,
  syncBudgetConfig,
} from './services/googleSheetApi';
import { getTodayDateString } from './utils/formatters';

import { Navbar } from './components/Navbar';
import { BudgetMonitor } from './components/BudgetMonitor';
import { QuickExpenseForm } from './components/QuickExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { WeeklyReport } from './components/WeeklyReport';
import { MonthlyReport } from './components/MonthlyReport';
import { YearlyReport } from './components/YearlyReport';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(loadStoredExpenses);
  const [budget, setBudget] = useState<BudgetConfig>(loadStoredBudget);
  const [gSheetUrl, setGSheetUrl] = useState<string>(loadGSheetUrl);
  const [currentTab, setCurrentTab] = useState<ViewTab>('today');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConfigured: !!loadGSheetUrl(),
    isSyncing: false,
    lastSyncedAt: null,
    error: null,
  });

  // Calculate today & this month spending
  const todayStr = getTodayDateString();
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

  const todaySpent = useMemo(() => {
    return expenses
      .filter((e) => e.date === todayStr)
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses, todayStr]);

  const monthSpent = useMemo(() => {
    return expenses
      .filter((e) => e.date.startsWith(currentMonthStr))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses, currentMonthStr]);

  // Map of spending by category for the current month
  const categorySpentMap = useMemo(() => {
    const map: { [categoryName: string]: number } = {};
    expenses
      .filter((e) => e.date.startsWith(currentMonthStr))
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    return map;
  }, [expenses, currentMonthStr]);

  // Today's expense list
  const todayExpenses = useMemo(() => {
    return expenses.filter((e) => e.date === todayStr);
  }, [expenses, todayStr]);

  // Save to localStorage whenever expenses or budget change
  useEffect(() => {
    saveStoredExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveStoredBudget(budget);
  }, [budget]);

  // Initial Sync from Google Sheet if URL exists
  useEffect(() => {
    if (gSheetUrl) {
      handleSync();
    }
  }, []);

  const handleSync = async () => {
    if (!gSheetUrl) return;
    setSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));
    try {
      const remote = await fetchRemoteData(gSheetUrl);
      if (remote) {
        if (remote.expenses && remote.expenses.length > 0) {
          const mergedMap = new Map<string, Expense>();
          expenses.forEach((e) => mergedMap.set(e.id, e));
          remote.expenses.forEach((e) => mergedMap.set(e.id, e));
          const mergedList = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
          );
          setExpenses(mergedList);
        }
        if (remote.budget) {
          setBudget(remote.budget);
        }
      }
      setSyncStatus({
        isConfigured: true,
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString('th-TH'),
        error: null,
      });
    } catch (_) {
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        error: 'ไม่สามารถซิงก์ข้อมูลกับ Google Sheet ได้ (ทำงานแบบโหมดเครื่องแทน)',
      }));
    }
  };

  const handleAddExpense = async (data: { date: string; category: string; amount: number; note: string }) => {
    const newExpense: Expense = {
      id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      date: data.date,
      category: data.category,
      amount: data.amount,
      note: data.note,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update (Instant feedback)
    setExpenses((prev) => [newExpense, ...prev]);

    // Background sync to Google Sheet
    if (gSheetUrl) {
      syncAddExpense(gSheetUrl, newExpense);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    // Optimistic UI update
    setExpenses((prev) => prev.filter((e) => e.id !== id));

    // Background sync to Google Sheet
    if (gSheetUrl) {
      syncDeleteExpense(gSheetUrl, id);
    }
  };

  const handleSaveBudget = (newBudget: BudgetConfig) => {
    setBudget(newBudget);
    if (gSheetUrl) {
      syncBudgetConfig(gSheetUrl, newBudget);
    }
  };

  const handleSaveGSheetUrl = (url: string) => {
    setGSheetUrl(url);
    saveGSheetUrl(url);
    setSyncStatus((prev) => ({
      ...prev,
      isConfigured: !!url,
    }));
    if (url) {
      handleSync();
    }
  };

  const handleImportExpenses = (imported: Expense[]) => {
    setExpenses(imported);
    saveStoredExpenses(imported);
  };

  const handleClearAll = () => {
    setExpenses([]);
    localStorage.removeItem('daily_expenses_v1');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        syncStatus={syncStatus}
        onSyncClick={handleSync}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container with bottom padding on mobile for Bottom Navigation Bar */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 sm:pb-8">
        {/* Budget overview always visible */}
        <BudgetMonitor
          todaySpent={todaySpent}
          monthSpent={monthSpent}
          budget={budget}
          categorySpentMap={categorySpentMap}
          onEditBudget={() => setIsSettingsOpen(true)}
        />

        {/* Tab 1: Today View (Expense Form + Today's list) */}
        {currentTab === 'today' && (
          <div className="space-y-4 sm:space-y-6">
            <QuickExpenseForm
              onAddExpense={handleAddExpense}
              categorySpentMap={categorySpentMap}
              categoryBudgets={budget.categoryBudgets}
            />
            <ExpenseList
              expenses={todayExpenses}
              onDeleteExpense={handleDeleteExpense}
              title="รายการรายจ่ายวันนี้"
            />
          </div>
        )}

        {/* Tab 2: 7 Days / Weekly View */}
        {currentTab === 'weekly' && (
          <div className="space-y-4 sm:space-y-6">
            <WeeklyReport expenses={expenses} budget={budget} />
            <ExpenseList
              expenses={expenses.slice(0, 15)}
              onDeleteExpense={handleDeleteExpense}
              title="รายการรายจ่ายล่าสุด"
            />
          </div>
        )}

        {/* Tab 3: Monthly View */}
        {currentTab === 'monthly' && (
          <div className="space-y-4 sm:space-y-6">
            <MonthlyReport expenses={expenses} budget={budget} />
            <ExpenseList
              expenses={expenses.filter((e) => e.date.startsWith(currentMonthStr))}
              onDeleteExpense={handleDeleteExpense}
              title={`รายการรายจ่ายเดือนนี้ (${currentMonthStr})`}
            />
          </div>
        )}

        {/* Tab 4: Yearly View */}
        {currentTab === 'yearly' && (
          <div className="space-y-4 sm:space-y-6">
            <YearlyReport expenses={expenses} budget={budget} />
            <ExpenseList
              expenses={expenses.slice(0, 20)}
              onDeleteExpense={handleDeleteExpense}
              title="ประวัติรายการทั้งหมด (20 รายการล่าสุด)"
            />
          </div>
        )}
      </main>

      {/* Footer (Hidden on small mobile screens to save vertical space) */}
      <footer className="hidden sm:block border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>Daily Expense Tracker • 100% Free &amp; Personal • Powered by Google Sheets Database</p>
      </footer>

      {/* Settings & Connect Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        gSheetUrl={gSheetUrl}
        onSaveGSheetUrl={handleSaveGSheetUrl}
        budget={budget}
        onSaveBudget={handleSaveBudget}
        expenses={expenses}
        onImportExpenses={handleImportExpenses}
        onClearAll={handleClearAll}
      />
    </div>
  );
};
export default App;
