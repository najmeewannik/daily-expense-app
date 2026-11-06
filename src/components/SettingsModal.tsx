import React, { useState } from 'react';
import { BudgetConfig, Expense } from '../types/expense';
import { testGoogleSheetConnection } from '../services/googleSheetApi';
import { exportExpensesJSON, exportExpensesCSV } from '../services/storage';
import { DEFAULT_CATEGORIES } from '../utils/formatters';
import { X, Check, AlertCircle, Download, FileSpreadsheet, Sliders, Database, Trash2, Layers } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gSheetUrl: string;
  onSaveGSheetUrl: (url: string) => void;
  budget: BudgetConfig;
  onSaveBudget: (budget: BudgetConfig) => void;
  expenses: Expense[];
  onImportExpenses: (imported: Expense[]) => void;
  onClearAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  gSheetUrl,
  onSaveGSheetUrl,
  budget,
  onSaveBudget,
  expenses,
  onImportExpenses,
  onClearAll,
}) => {
  const [urlInput, setUrlInput] = useState(gSheetUrl);
  const [dailyBudgetInput, setDailyBudgetInput] = useState(budget.dailyBudget.toString());
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(budget.monthlyBudget.toString());
  const [categoryBudgetsInput, setCategoryBudgetsInput] = useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    DEFAULT_CATEGORIES.forEach((cat) => {
      initial[cat.name] = (budget.categoryBudgets?.[cat.name] || cat.defaultMonthlyBudget || 1000).toString();
    });
    return initial;
  });

  const [testStatus, setTestStatus] = useState<{ testing: boolean; message: string | null; success: boolean | null }>({
    testing: false,
    message: null,
    success: null,
  });
  const [budgetSaved, setBudgetSaved] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus({ testing: true, message: 'กำลังทดสอบเชื่อมต่อ...', success: null });
    const res = await testGoogleSheetConnection(urlInput.trim());
    setTestStatus({ testing: false, message: res.message, success: res.success });
    if (res.success) {
      onSaveGSheetUrl(urlInput.trim());
    }
  };

  const handleCategoryBudgetChange = (catName: string, value: string) => {
    setCategoryBudgetsInput((prev) => ({
      ...prev,
      [catName]: value,
    }));
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseFloat(dailyBudgetInput) || 500;
    const m = parseFloat(monthlyBudgetInput) || 15000;

    const parsedCategoryBudgets: { [key: string]: number } = {};
    Object.entries(categoryBudgetsInput).forEach(([catName, valStr]) => {
      parsedCategoryBudgets[catName] = parseFloat(valStr) || 0;
    });

    onSaveBudget({
      dailyBudget: d,
      monthlyBudget: m,
      categoryBudgets: parsedCategoryBudgets,
    });
    setBudgetSaved(true);
    setTimeout(() => setBudgetSaved(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportExpenses(json);
          alert(`นำเข้าข้อมูลสำเร็จ ${json.length} รายการ!`);
        } else {
          alert('ไฟล์ JSON ไม่ถูกต้องตามรูปแบบ');
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">การตั้งค่าระบบ</h3>
              <p className="text-[11px] text-slate-500">จัดการฐานข้อมูล &amp; คุมงบประมาณรายหมวด</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Budget Settings (Daily, Monthly, Category) */}
        <form onSubmit={handleSaveBudget} className="space-y-4 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>ตั้งค่างบประมาณรวม (Overall Budget)</span>
            </h4>
            {budgetSaved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> บันทึกแล้ว
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">งบต่อวัน (บาท)</label>
              <input
                type="number"
                min="0"
                step="10"
                value={dailyBudgetInput}
                onChange={(e) => setDailyBudgetInput(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">งบต่อเดือน (บาท)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={monthlyBudgetInput}
                onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Section 1.5: Category Budgets */}
          <div className="pt-2 border-t border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>งบประมาณแยกตามหมวดหมู่ (ต่อเดือน)</span>
              </h5>
              <span className="text-[10px] text-slate-400">(ใส่ 0 หากไม่ต้องการจำกัด)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEFAULT_CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between gap-2 p-1.5 px-2 bg-white rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm select-none">{cat.icon}</span>
                    <span className="text-xs font-medium text-slate-700 truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-400">฿</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={categoryBudgetsInput[cat.name] || ''}
                      onChange={(e) => handleCategoryBudgetChange(cat.name, e.target.value)}
                      className="w-20 px-1.5 py-1 text-xs font-bold text-right text-slate-800 bg-slate-50 rounded-lg border border-slate-200 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            บันทึกงบประมาณทั้งหมด
          </button>
        </form>

        {/* Section 2: Google Sheet Database */}
        <div className="space-y-2.5 bg-emerald-50/60 p-3.5 sm:p-4 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">เชื่อมต่อ Google Sheets Database</h4>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            นำ URL ของ Google Apps Script Web App จาก Google Sheet ของคุณมาวางเพื่อซิงก์ข้อมูลอัตโนมัติ
          </p>

          <div className="space-y-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-mono"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus.testing || !urlInput}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                {testStatus.testing ? 'กำลังทดสอบ...' : 'ทดสอบ & บันทึกการเชื่อมต่อ'}
              </button>
              {urlInput && (
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('');
                    onSaveGSheetUrl('');
                    setTestStatus({ testing: false, message: 'สลับกลับเป็นโหมดเครื่อง (Local) แล้ว', success: true });
                  }}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  ล้างค่า (ใช้โหมดเครื่อง)
                </button>
              )}
            </div>

            {testStatus.message && (
              <div
                className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-lg ${
                  testStatus.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {testStatus.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{testStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Backup & Export */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">สำรองข้อมูล &amp; นำเข้า (Backup &amp; Export)</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => exportExpensesCSV(expenses)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>ส่งออก Excel</span>
            </button>
            <button
              onClick={() => exportExpensesJSON(expenses)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>สำรอง JSON</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="text-slate-600 font-medium cursor-pointer hover:text-emerald-600">
              📥 นำเข้าไฟล์สำรอง (JSON)
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
            <button
              onClick={() => {
                if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลรายจ่ายทั้งหมดในเครื่อง?')) {
                  onClearAll();
                }
              }}
              className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> ล้างข้อมูลทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
