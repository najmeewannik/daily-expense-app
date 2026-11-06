import React, { useState } from 'react';
import { BudgetConfig } from '../types/expense';
import { formatTHB, DEFAULT_CATEGORIES } from '../utils/formatters';
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
        text: 'text-rose-600',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-700',
      };
    }
    if (percent >= 70) {
      return {
        bar: 'bg-amber-500',
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-700',
      };
    }
    return {
      bar: 'bg-emerald-500',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-100',
      badge: 'bg-emerald-100 text-emerald-700',
    };
  };

  const dailyTheme = getStatusColor(dailyPercent, isDailyOver);
  const monthlyTheme = getStatusColor(monthlyPercent, isMonthlyOver);

  // Category budgets list
  const categoryBudgets = budget.categoryBudgets || {};
  const activeCategoryBudgets = DEFAULT_CATEGORIES.map((cat) => {
    const allocated = categoryBudgets[cat.name] || 0;
    const spent = categorySpentMap[cat.name] || 0;
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                งบวันนี้
              </span>
              {isDailyOver ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                  <ShieldAlert className="w-3 h-3" /> เกิน {formatTHB(Math.abs(dailyRemaining))}
                </span>
              ) : dailyPercent >= 70 ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  <AlertTriangle className="w-3 h-3" /> ใกล้เต็ม
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle className="w-3 h-3" /> ปกติ
                </span>
              )}
            </div>
            <button
              onClick={onEditBudget}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-white/60 transition-colors flex-shrink-0"
              title="ปรับเปลี่ยนงบประมาณ"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate block">
                {formatTHB(todaySpent)}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 block -mt-0.5">
                จากงบ {formatTHB(budget.dailyBudget)}
              </span>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
              <span className="text-[11px] text-slate-500 block">
                {isDailyOver ? 'ใช้เกินไป' : 'คงเหลือวันนี้'}
              </span>
              <span className={`text-sm sm:text-base font-bold ${dailyTheme.text}`}>
                {isDailyOver ? `+${formatTHB(Math.abs(dailyRemaining))}` : formatTHB(dailyRemaining)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                งบเดือนนี้
              </span>
              {isMonthlyOver ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                  <ShieldAlert className="w-3 h-3" /> เกินงบเดือน
                </span>
              ) : monthlyPercent >= 70 ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  <AlertTriangle className="w-3 h-3" /> ใช้ไป {monthlyPercent}%
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle className="w-3 h-3" /> ปกติ
                </span>
              )}
            </div>
            <button
              onClick={onEditBudget}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-white/60 transition-colors flex-shrink-0"
              title="ปรับเปลี่ยนงบประมาณ"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate block">
                {formatTHB(monthSpent)}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 block -mt-0.5">
                จากงบ {formatTHB(budget.monthlyBudget)}
              </span>
            </div>
            <div className="text-right flex-shrink-0 pl-2">
              <span className="text-[11px] text-slate-500 block">
                {isMonthlyOver ? 'ใช้เกินไป' : 'คงเหลือเดือนนี้'}
              </span>
              <span className={`text-sm sm:text-base font-bold ${monthlyTheme.text}`}>
                {isMonthlyOver ? `+${formatTHB(Math.abs(monthlyRemaining))}` : formatTHB(monthlyRemaining)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${monthlyTheme.bar}`}
              style={{ width: `${monthlyPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Accordion / Toggle */}
      {activeCategoryBudgets.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setShowCategoryBudgets(!showCategoryBudgets)}
            className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                งบประมาณแยกตามหมวดหมู่ ({activeCategoryBudgets.length} หมวด)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{showCategoryBudgets ? 'ซ่อน' : 'ดูรายละเอียด'}</span>
              {showCategoryBudgets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showCategoryBudgets && (
            <div className="p-3.5 pt-0 border-t border-slate-100 divide-y divide-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                {activeCategoryBudgets.map(({ cat, allocated, spent, percent, remaining, isOver }) => {
                  const theme = getStatusColor(percent, isOver);
                  return (
                    <div key={cat.id} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm select-none">{cat.icon}</span>
                          <span className="font-semibold text-slate-800 truncate">{cat.name}</span>
                        </div>
                        <span className={`text-[11px] font-bold ${isOver ? 'text-rose-600' : 'text-slate-600'}`}>
                          {formatTHB(spent)} / {formatTHB(allocated)}
                        </span>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${theme.bar}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>ใช้ไป {percent}%</span>
                        <span className={`font-semibold ${isOver ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                          {isOver ? `เกินงบ +${formatTHB(Math.abs(remaining))}` : `เหลือ ${formatTHB(remaining)}`}
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
