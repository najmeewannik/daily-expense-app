import { Expense, BudgetConfig } from '../types/expense';

export interface RemoteData {
  expenses: Expense[];
  budget: BudgetConfig;
}

export const fetchRemoteData = async (webAppUrl: string): Promise<RemoteData | null> => {
  if (!webAppUrl) return null;
  try {
    const res = await fetch(webAppUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch from Google Sheet:', err);
    throw err;
  }
};

export const syncAddExpense = async (webAppUrl: string, expense: Expense): Promise<boolean> => {
  if (!webAppUrl) return false;
  try {
    await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Google Apps Script handles text/plain with JSON body without triggering preflight OPTIONS
      },
      body: JSON.stringify({
        action: 'add_expense',
        expense,
      }),
      redirect: 'follow',
    });
    return true;
  } catch (err) {
    console.error('Failed to sync addExpense to Google Sheet:', err);
    return false;
  }
};

export const syncDeleteExpense = async (webAppUrl: string, id: string): Promise<boolean> => {
  if (!webAppUrl) return false;
  try {
    await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'delete_expense',
        id,
      }),
      redirect: 'follow',
    });
    return true;
  } catch (err) {
    console.error('Failed to sync deleteExpense to Google Sheet:', err);
    return false;
  }
};

export const syncBudgetConfig = async (webAppUrl: string, config: BudgetConfig): Promise<boolean> => {
  if (!webAppUrl) return false;
  try {
    await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'set_budget',
        dailyBudget: config.dailyBudget,
        monthlyBudget: config.monthlyBudget,
      }),
      redirect: 'follow',
    });
    return true;
  } catch (err) {
    console.error('Failed to sync budget config to Google Sheet:', err);
    return false;
  }
};

export const testGoogleSheetConnection = async (webAppUrl: string): Promise<{ success: boolean; message: string }> => {
  if (!webAppUrl) return { success: false, message: 'กรุณาระบุ Web App URL' };
  try {
    const res = await fetch(webAppUrl, {
      method: 'GET',
    });
    if (!res.ok) {
      return { success: false, message: `เชื่อมต่อไม่ได้ (HTTP ${res.status})` };
    }
    const json = await res.json();
    if (json.success) {
      return { success: true, message: 'เชื่อมต่อ Google Sheet สำเร็จ!' };
    }
    return { success: false, message: json.error || 'ตอบกลับไม่สำเร็จ' };
  } catch (err: unknown) {
    return { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + (err instanceof Error ? err.message : String(err)) };
  }
};
