import React, { useState } from 'react';
import { BudgetConfig, Expense } from '../types/expense';
import { testGoogleSheetConnection } from '../services/googleSheetApi';
import { exportExpensesJSON, exportExpensesCSV } from '../services/storage';
import { X, Check, AlertCircle, Download, FileSpreadsheet, Sliders, Database, Trash2 } from 'lucide-react';

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

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseFloat(dailyBudgetInput) || 500;
    const m = parseFloat(monthlyBudgetInput) || 15000;
    onSaveBudget({ dailyBudget: d, monthlyBudget: m });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">การตั้งค่าระบบ</h3>
              <p className="text-xs text-slate-500">จัดการฐานข้อมูล Google Sheets & คุมงบประมาณ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Google Sheet Database */}
        <div className="space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <h4 className="font-bold text-slate-800 text-sm">เชื่อมต่อ Google Sheets Database (ฟรี 100%)</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            นำ URL ของ Google Apps Script Web App จาก Google Sheet ของคุณมาวาง เพื่อให้ระบบบันทึกแถวข้อมูลลงใน Google Drive ของคุณโดยอัตโนมัติ
          </p>

          <div className="space-y-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-mono"
            />

            <div className="flex items-center gap-2">
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

          <details className="text-xs text-slate-600 border-t border-emerald-200/60 pt-2 cursor-pointer">
            <summary className="font-semibold text-emerald-700 select-none">
              👉 วิธีสร้าง Google Apps Script ภายใน 2 นาที (คลิกเพื่อดู)
            </summary>
            <ol className="list-decimal list-inside space-y-1.5 mt-2 text-slate-600 pl-1 leading-relaxed">
              <li>สร้าง Google Sheet เปล่าใน Google Drive ของคุณ</li>
              <li>ไปที่เมนู <b>ส่วนขยาย (Extensions) &gt; Apps Script</b></li>
              <li>คัดลอกโค้ดจากโฟลเดอร์ <code>google-apps-script/Code.gs</code> ไปวางทับ</li>
              <li>กดปุ่ม <b>Deploy (ทำให้ใช้งานได้) &gt; New deployment (การทำให้ใช้งานได้ใหม่)</b></li>
              <li>เลือกประเภทเป็น <b>Web app</b> และตั้งค่า <i>Who has access (ผู้มีสิทธิ์เข้าถึง)</i> เป็น <b>Anyone (ทุกคน)</b></li>
              <li>กด Deploy แล้วคัดลอก Web App URL มาวางที่ช่องด้านบน</li>
            </ol>
          </details>
        </div>

        {/* Section 2: Budget Setting */}
        <form onSubmit={handleSaveBudget} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm">ตั้งค่างบประมาณ (Budget Limits)</h4>
            {budgetSaved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> บันทึกงบแล้ว
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">งบประมาณต่อวัน (บาท)</label>
              <input
                type="number"
                min="0"
                step="10"
                value={dailyBudgetInput}
                onChange={(e) => setDailyBudgetInput(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">งบประมาณต่อเดือน (บาท)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={monthlyBudgetInput}
                onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            บันทึกงบประมาณ
          </button>
        </form>

        {/* Section 3: Backup & Export */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 text-sm">สำรองข้อมูล & นำเข้า (Backup & Export)</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => exportExpensesCSV(expenses)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>ส่งออก Excel (CSV)</span>
            </button>
            <button
              onClick={() => exportExpensesJSON(expenses)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>สำรองข้อมูล (JSON)</span>
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
