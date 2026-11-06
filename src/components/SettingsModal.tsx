import React, { useState } from 'react';
import { BudgetConfig, Expense } from '../types/expense';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../i18n/translations';
import { testGoogleSheetConnection } from '../services/googleSheetApi';
import { exportExpensesJSON, exportExpensesCSV } from '../services/storage';
import {
  X,
  Check,
  AlertCircle,
  Download,
  FileSpreadsheet,
  Sliders,
  Database,
  Trash2,
  Layers,
  Palette,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';

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
  const { t, language, setLanguage, theme, setTheme } = useApp();

  const [urlInput, setUrlInput] = useState(gSheetUrl);
  const [dailyBudgetInput, setDailyBudgetInput] = useState(budget.dailyBudget.toString());
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(budget.monthlyBudget.toString());
  const [categoryBudgetsInput, setCategoryBudgetsInput] = useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    CATEGORIES_DATA.forEach((cat) => {
      // Look up by Thai canonical or ID
      const val = budget.categoryBudgets?.[cat.nameTh] ?? budget.categoryBudgets?.[cat.id] ?? cat.defaultMonthlyBudget;
      initial[cat.nameTh] = val.toString();
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
    setTestStatus({ testing: true, message: t('testingBtn'), success: null });
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
          alert(t('importSuccess', { count: json.length }));
        } else {
          alert(t('importInvalidJson'));
        }
      } catch (err) {
        alert(t('importError'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-700 p-4 sm:p-6 space-y-5 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
                {t('settingsTitle')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('settingsSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 0: Appearance & Language */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
            <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('appearanceSection')}</span>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {t('themeLabel')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  theme === 'light'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-transparent hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{t('themeLight')}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-transparent hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t('themeDark')}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  theme === 'system'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-transparent hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{t('themeSystem')}</span>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {t('languageLabel')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('th')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  language === 'th'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-transparent hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <span>🇹🇭</span>
                <span>{t('langTh')}</span>
              </button>

              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-transparent hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <span>🇬🇧</span>
                <span>{t('langEn')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Budget Settings (Daily, Monthly, Category) */}
        <form onSubmit={handleSaveBudget} className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('overallBudgetTitle')}</span>
            </h4>
            {budgetSaved && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {t('budgetSavedSuccess')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {t('dailyBudgetInput')}
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={dailyBudgetInput}
                onChange={(e) => setDailyBudgetInput(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                {t('monthlyBudgetInput')}
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={monthlyBudgetInput}
                onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Section 1.5: Category Budgets */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t('categoryBudgetsTitle')}</span>
              </h5>
              <span className="text-[10px] text-slate-400 dark:text-slate-400">{t('categoryBudgetsTip')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES_DATA.map((cat) => {
                const displayName = language === 'en' ? cat.nameEn : cat.nameTh;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between gap-2 p-1.5 px-2 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/70"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm select-none">{cat.icon}</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                        {displayName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs font-bold text-slate-400">฿</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={categoryBudgetsInput[cat.nameTh] || ''}
                        onChange={(e) => handleCategoryBudgetChange(cat.nameTh, e.target.value)}
                        className="w-20 px-1.5 py-1 text-xs font-bold text-right text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {t('saveAllBudgetsBtn')}
          </button>
        </form>

        {/* Section 2: Google Sheet Database */}
        <div className="space-y-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 sm:p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
              {t('googleSheetSection')}
            </h4>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('googleSheetDesc')}
          </p>

          <div className="space-y-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none font-mono"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus.testing || !urlInput}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                {testStatus.testing ? t('testingBtn') : t('testAndSaveBtn')}
              </button>
              {urlInput && (
                <button
                  type="button"
                  onClick={() => {
                    setUrlInput('');
                    onSaveGSheetUrl('');
                    setTestStatus({ testing: false, message: t('localMode'), success: true });
                  }}
                  className="px-2.5 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium"
                >
                  {t('clearLocalBtn')}
                </button>
              )}
            </div>

            {testStatus.message && (
              <div
                className={`flex items-center gap-1.5 text-xs font-medium p-2 rounded-lg ${
                  testStatus.success
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
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
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
            {t('backupSection')}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => exportExpensesCSV(expenses)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('exportExcel')}</span>
            </button>
            <button
              onClick={() => exportExpensesJSON(expenses)}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('backupJson')}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="text-slate-600 dark:text-slate-300 font-medium cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400">
              {t('importJson')}
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
            <button
              onClick={() => {
                if (window.confirm(t('confirmClearAll'))) {
                  onClearAll();
                }
              }}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> {t('clearAllData')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
