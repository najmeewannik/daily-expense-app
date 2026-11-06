import React, { useState } from 'react';
import { Expense } from '../types/expense';
import { useApp } from '../context/AppContext';
import { getCategoryIcon, getCategoryName } from '../i18n/translations';
import { formatCurrency, formatDisplayDate } from '../utils/formatters';
import { Trash2, Search, Receipt } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  title?: string;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  title,
}) => {
  const { t, language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const displayTitle = title || t('todayListTitle');

  const filtered = expenses.filter((e) => {
    const q = searchTerm.toLowerCase();
    const catName = getCategoryName(e.category, language).toLowerCase();
    const origCat = e.category.toLowerCase();
    return (
      catName.includes(q) ||
      origCat.includes(q) ||
      (e.note && e.note.toLowerCase().includes(q)) ||
      String(e.amount).includes(q)
    );
  });

  const totalSum = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{displayTitle}</h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {filtered.length} {t('itemsCount')}
          </span>
        </div>

        {/* Search filter */}
        {expenses.length > 3 && (
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none w-full"
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 px-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-400 flex items-center justify-center mb-2">
            <Receipt className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">{t('noExpenses')}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{t('noExpensesSubtitle')}</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/70 dark:hover:bg-slate-700/40 px-1.5 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/70 flex items-center justify-center text-base flex-shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm truncate">
                      {getCategoryName(item.category, language)}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400">
                      • {formatDisplayDate(item.date, language)}
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-[200px] sm:max-w-xs">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-base">
                  -{formatCurrency(item.amount, language)}
                </span>
                <button
                  onClick={() => {
                    if (window.confirm(`${t('deleteConfirm')} "${getCategoryName(item.category, language)}" (${formatCurrency(item.amount, language)})`)) {
                      onDeleteExpense(item.id);
                    }
                  }}
                  className="opacity-75 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                  title={t('deleteConfirm')}
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Subtotal */}
          <div className="pt-2.5 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 px-1.5">
            <span>
              {t('totalSum')} ({filtered.length} {t('itemsCount')})
            </span>
            <span className="text-sm sm:text-base text-slate-900 dark:text-white">{formatCurrency(totalSum, language)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
