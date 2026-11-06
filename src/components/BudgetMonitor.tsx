import React from 'react';
import { BudgetConfig } from '../types/expense';
import { formatTHB } from '../utils/formatters';
import { AlertTriangle, CheckCircle, ShieldAlert, Sliders } from 'lucide-react';

interface BudgetMonitorProps {
  todaySpent: number;
  monthSpent: number;
  budget: BudgetConfig;
  onEditBudget: () => void;
}

export const BudgetMonitor: React.FC<BudgetMonitorProps> = ({
  todaySpent,
  monthSpent,
  budget,
  onEditBudget,
}) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Daily Budget Card */}
      <div className={`p-4 rounded-2xl border ${dailyTheme.border} ${dailyTheme.bg} transition-all shadow-sm`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              งบประมาณวันนี้
            </span>
            {isDailyOver ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                <ShieldAlert className="w-3 h-3" /> เกินงบ {formatTHB(Math.abs(dailyRemaining))}
              </span>
            ) : dailyPercent >= 70 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle className="w-3 h-3" /> ใกล้เต็มงบ
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle className="w-3 h-3" /> ควบคุมได้ดี
              </span>
            )}
          </div>
          <button
            onClick={onEditBudget}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-white/60 transition-colors"
            title="ปรับเปลี่ยนงบประมาณ"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatTHB(todaySpent)}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">
              / {formatTHB(budget.dailyBudget)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">
              {isDailyOver ? 'ใช้เกินไป' : 'คงเหลือวันนี้'}
            </span>
            <span className={`text-sm font-bold ${dailyTheme.text}`}>
              {isDailyOver ? `+${formatTHB(Math.abs(dailyRemaining))}` : formatTHB(dailyRemaining)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${dailyTheme.bar}`}
            style={{ width: `${dailyPercent}%` }}
          />
        </div>
      </div>

      {/* Monthly Budget Card */}
      <div className={`p-4 rounded-2xl border ${monthlyTheme.border} ${monthlyTheme.bg} transition-all shadow-sm`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              งบประมาณเดือนนี้
            </span>
            {isMonthlyOver ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                <ShieldAlert className="w-3 h-3" /> เกินงบเดือน
              </span>
            ) : monthlyPercent >= 70 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                <AlertTriangle className="w-3 h-3" /> ใช้ไป {monthlyPercent}%
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle className="w-3 h-3" /> ปกติ
              </span>
            )}
          </div>
          <button
            onClick={onEditBudget}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-white/60 transition-colors"
            title="ปรับเปลี่ยนงบประมาณ"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatTHB(monthSpent)}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">
              / {formatTHB(budget.monthlyBudget)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">
              {isMonthlyOver ? 'ใช้เกินไป' : 'คงเหลือเดือนนี้'}
            </span>
            <span className={`text-sm font-bold ${monthlyTheme.text}`}>
              {isMonthlyOver ? `+${formatTHB(Math.abs(monthlyRemaining))}` : formatTHB(monthlyRemaining)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${monthlyTheme.bar}`}
            style={{ width: `${monthlyPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
