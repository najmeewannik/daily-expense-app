import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../i18n/translations';
import { getTodayDateString, getYesterdayDateString, formatCurrency } from '../utils/formatters';
import { PlusCircle, Check, Info } from 'lucide-react';

interface QuickExpenseFormProps {
  onAddExpense: (data: { date: string; category: string; amount: number; note: string }) => void;
  categorySpentMap?: { [categoryName: string]: number };
  categoryBudgets?: { [categoryName: string]: number };
}

export const QuickExpenseForm: React.FC<QuickExpenseFormProps> = ({
  onAddExpense,
  categorySpentMap = {},
  categoryBudgets = {},
}) => {
  const { t, language } = useApp();

  const [amount, setAmount] = useState<string>('');
  const [selectedCatId, setSelectedCatId] = useState<string>(CATEGORIES_DATA[0].id);
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      amountInputRef.current?.focus();
      return;
    }

    // Always store standardized category name (Thai canonical for database consistency)
    const foundCat = CATEGORIES_DATA.find((c) => c.id === selectedCatId);
    const categoryNameToStore = foundCat ? foundCat.nameTh : selectedCatId;

    onAddExpense({
      date,
      category: categoryNameToStore,
      amount: num,
      note: note.trim(),
    });

    // Reset amount & note for rapid continuous logging
    setAmount('');
    setNote('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);

    // Re-focus amount input for the next entry
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 50);
  };

  // Selected category budget info
  const foundCat = CATEGORIES_DATA.find((c) => c.id === selectedCatId);
  const catKeyForBudget = foundCat ? foundCat.nameTh : selectedCatId;
  const selectedCatBudget = categoryBudgets[catKeyForBudget] || 0;
  const selectedCatSpent = categorySpentMap[catKeyForBudget] || 0;
  const catRemaining = selectedCatBudget - selectedCatSpent;
  const isCatOver = selectedCatSpent > selectedCatBudget && selectedCatBudget > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
          <span>{t('quickExpenseTitle')}</span>
        </h2>
        {justSaved && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full animate-fade-in">
            <Check className="w-3.5 h-3.5" /> {t('savedBadge')}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t('amountLabel')}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-xl sm:text-2xl font-black text-slate-400 dark:text-slate-500 select-none">
              ฿
            </span>
            <input
              ref={amountInputRef}
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-3 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/70 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-900 text-xl sm:text-2xl font-black text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Quick Category Chips */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('categoryLabel')}
            </label>
            {selectedCatBudget > 0 && (
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  isCatOver ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Info className="w-3 h-3 flex-shrink-0" />
                {t('catBudgetMonthly')}{' '}
                {isCatOver
                  ? `${t('overBy')} +${formatCurrency(Math.abs(catRemaining), language)}`
                  : `${t('leftBudget')} ${formatCurrency(catRemaining, language)}`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {CATEGORIES_DATA.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              const displayName = language === 'en' ? cat.nameEn : cat.nameTh;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left border cursor-pointer select-none ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <span className="text-base flex-shrink-0">{cat.icon}</span>
                  <span className="truncate leading-tight">{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note & Date Fields - Explicit min-w-0 for mobile responsive fix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 min-w-0">
          <div className="sm:col-span-2 min-w-0">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 truncate">
              {t('noteLabel')}
            </label>
            <input
              type="text"
              placeholder={t('notePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-10 px-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/70 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                {t('dateLabel')}
              </label>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDate(getTodayDateString())}
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors ${
                    date === getTodayDateString()
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {t('todayBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => setDate(getYesterdayDateString())}
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors ${
                    date === getYesterdayDateString()
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {t('yesterdayBtn')}
                </button>
              </div>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full min-w-0 max-w-full box-border h-10 px-2.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/70 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{t('saveExpenseBtn')}</span>
        </button>
      </form>
    </div>
  );
};
