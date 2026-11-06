export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  amount: number;
  note: string;
  createdAt: string; // ISO string
}

export interface BudgetConfig {
  dailyBudget: number;
  monthlyBudget: number;
}

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type ViewTab = 'today' | 'weekly' | 'monthly' | 'yearly';

export interface SyncStatus {
  isConfigured: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}
