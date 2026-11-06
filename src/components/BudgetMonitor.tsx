import React, { useState } from 'react';
import { BudgetConfig } from '../types/expense';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../i18n/translations';
import { formatCurrency } from '../utils/formatters';
import { AlertTriangle, CheckCircle, ShieldAlert, Sliders, ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface BudgetMonitorProps {
  todaySpent: number;
  monthSpent: number;
  budget: BudgetConfig;
  categorySpentMap: { [categoryName: string]: number };
  onEditBudget: () => void;
}

export const BudgetMonitor: React.FC<BudgetMonitorProps> = ({
  todaySpent,
  monthSpent,
  budget,
  categorySpentMap,
  onEditBudget,
}) => {
  const { t, language } = useApp();
  const [showCategoryBudgets, setShowCategoryBudgets] = useState(false);

  const dailyPercent = Math.min(Math.round((todaySpent / (budget.dailyBudget || 1)) * 100), 100);
  const dailyRemaining = budget.dailyBudget - todaySpent;
  const isDailyOver = todaySpent > budget.dailyBudget;

  const monthlyPercent = Math.min(Math.round((monthSpent / (budget.monthlyBudget || 1)) * 100), 100);
  const monthlyRemaining = budget.monthlyBudget - monthSpent;
  const isMonthlyOver = monthSpent > budget.monthlyBudget;

  const getStatusColor = (percent: number, isOver: boolean) => {
    if (isOver || percent >= 90) {
      return {
        bar: 'bg-rose-500',
        text: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/20',
        border: 'border-rose-200 dark:border-rose-900/50',
        badge: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      };
    }
    if (percent >= 70) {
      return {
        bar: 'bg-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        border: 'border-amber-200 dark:border-amber-900/50',
        badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      };
    }
    return {
      bar: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
    };
  };

  const dailyTheme = getStatusColor(dailyPercent, isDailyOver);
  const monthlyTheme = getStatusColor(monthlyPercent, isMonthlyOver);

  // Category budgets list
  const categoryBudgets = budget.categoryBudgets || {};
  const activeCategoryBudgets = CATEGORIES_DATA.map((cat) => {
    // Check both Thai canonical and ID
    const allocated = categoryBudgets[cat.nameTh] || categoryBudgets[cat.id] || 0;
    const spent = (categorySpentMap[cat.nameTh] || 0) + (categorySpentMap[cat.id] || 0) + (categorySpentMap[cat.nameEn] || 0);
    const percent = allocated > 0 ? Math.min(Math.round((spent / allocated) * 100), 100) : 0;
    const remaining = allocated - spent;
    const isOver = spent > allocated;
    return {
      cat,
      allocated,
      spent,
      percent,
      remaining,
      isOver,
    };
  }).filter((item) => item.allocated > 0);

  return (
    <div className="space-y-3">
      {/* Overview Cards (Daily & Monthly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Daily Budget Card */}
        <div className={`p-4 rounded-2xl border ${dailyTheme.border} ${dailyTheme.bg} transition-all shadow-xs`}>
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="flex items-center flex-wrap gap-1.5 min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('dailyBudgetTitle')}
              </span>
              {isDailyOver ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 animate-pulse">
                  <ShieldAlert className="w-3 h-3 flex-shrink-0" /> {t('overBudget')} {formatCurrency(Math.abs(dailyRemaining), language)}
                </span>
              ) : dailyPercent >= 70 ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {t('statusWarning')}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-3 h-3 flex-shrink-0" /> {t('statusSafe')}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onEditBudget}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors flex-shrink-0"
              title={t('settingsTitle')}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate block">
                {formatCurrency(todaySpent, language)}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block -mt-0.5">
                {t('tabToday')}: {formatCurrency(budget.dailyBudget, language)}
              </span>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                {isDailyOver ? t('overBudget') : t('remaining')}
              </span>
              <span className={`text-sm sm:text-base font-bold ${dailyTheme.text}`}>
                {isDailyOver ? `+${formatCurrency(Math.abs(dailyRemaining), language)}` : formatCurrency(dailyRemaining, language)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${dailyTheme.bar}`}
              style={{ width: `${dailyPercent}%` }}
            />
          </div>
        </div>

        {/* Monthly Budget Card */}
        <div className={`p-4 rounded-2xl border ${monthlyTheme.border} ${monthlyTheme.bg} transition-all shadow-xs`}>
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="flex items-center flex-wrap gap-1.5 min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('monthlyBudgetTitle')}
              </span>
              {isMonthlyOver ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 animate-pulse">
                  <ShieldAlert className="w-3 h-3 flex-shrink-0" /> {t('statusDanger')}
                </span>
              ) : monthlyPercent >= 70 ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {monthlyPercent}%
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle className="w-3 h-3 flex-shrink-0" /> {t('statusSafe')}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onEditBudget}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors flex-shrink-0"
              title={t('settingsTitle')}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate block">
                {formatCurrency(monthSpent, language)}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block -mt-0.5">
                {t('tabMonthly')}: {formatCurrency(budget.monthlyBudget, language)}
              </span>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                {isMonthlyOver ? t('overBudget') : t('remaining')}
              </span>
              <span className={`text-sm sm:text-base font-bold ${monthlyTheme.text}`}>
                {isMonthlyOver ? `+${formatCurrency(Math.abs(monthlyRemaining), language)}` : formatCurrency(monthlyRemaining, language)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${monthlyTheme.bar}`}
              style={{ width: `${monthlyPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Accordion / Toggle */}
      {activeCategoryBudgets.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden transition-colors">
          <button
            type="button"
            onClick={() => setShowCategoryBudgets(!showCategoryBudgets)}
            className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {t('categoryBudgetsHeader')} ({activeCategoryBudgets.length})
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{showCategoryBudgets ? t('hideCategoryBudgets') : t('viewCategoryBudgets')}</span>
              {showCategoryBudgets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showCategoryBudgets && (
            <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-700/60 divide-y divide-slate-100 dark:divide-slate-700/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {activeCategoryBudgets.map(({ cat, allocated, spent, percent, remaining, isOver }) => {
                  const theme = getStatusColor(percent, isOver);
                  const displayName = language === 'en' ? cat.nameEn : cat.nameTh;
                  return (
                    <div
                      key={cat.id}
                      className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm select-none">{cat.icon}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {displayName}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold ${isOver ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}`}>
                          {formatCurrency(spent, language)} / {formatCurrency(allocated, language)}
                        </span>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${theme.bar}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-400">
                        <span>{percent}%</span>
                        <span className={`font-semibold ${isOver ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                          {isOver
                            ? `+${formatCurrency(Math.abs(remaining), language)}`
                            : `${t('remaining')} ${formatCurrency(remaining, language)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
