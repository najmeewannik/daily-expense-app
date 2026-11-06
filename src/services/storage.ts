import { Expense, BudgetConfig } from '../types/expense';

const EXPENSES_KEY = 'daily_expenses_v1';
const BUDGET_KEY = 'daily_budget_config_v1';
const GSHEET_URL_KEY = 'google_sheet_webapp_url_v1';

export const loadStoredExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses to localStorage:', err);
  }
};

export const loadStoredBudget = (): BudgetConfig => {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    return raw ? JSON.parse(raw) : { dailyBudget: 500, monthlyBudget: 15000 };
  } catch {
    return { dailyBudget: 500, monthlyBudget: 15000 };
  }
};

export const saveStoredBudget = (config: BudgetConfig): void => {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save budget config:', err);
  }
};

export const loadGSheetUrl = (): string => {
  return localStorage.getItem(GSHEET_URL_KEY) || '';
};

export const saveGSheetUrl = (url: string): void => {
  localStorage.setItem(GSHEET_URL_KEY, url.trim());
};

export const exportExpensesJSON = (expenses: Expense[]): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(expenses, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `expenses_backup_${new Date().toISOString().split('T')[0]}.json`);
  dlAnchor.click();
};

export const exportExpensesCSV = (expenses: Expense[]): void => {
  const headers = ['ID', 'Date', 'Category', 'Amount', 'Note', 'CreatedAt'];
  const rows = expenses.map(e => [
    `"${e.id}"`,
    `"${e.date}"`,
    `"${e.category}"`,
    e.amount,
    `"${(e.note || '').replace(/"/g, '""')}"`,
    `"${e.createdAt}"`
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', url);
  dlAnchor.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  dlAnchor.click();
};
