import React from 'react';
import { Expense, BudgetConfig } from '../types/expense';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { CalendarRange, TrendingUp, Flame } from 'lucide-react';

interface WeeklyReportProps {
  expenses: Expense[];
  budget: BudgetConfig;
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({ expenses, budget }) => {
  const { t, language, isDark } = useApp();

  // Generate last 7 days keys
  const days: { dateStr: string; label: string; spent: number }[] = [];
  const thDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNames = language === 'en' ? enDays : thDays;

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dayNum}`;
    const dayLabel = `${dayNames[d.getDay()]} ${parseInt(dayNum, 10)}`;

    const spent = expenses
      .filter((e) => e.date === dateStr)
      .reduce((acc, curr) => acc + curr.amount, 0);

    days.push({
      dateStr,
      label: dayLabel,
      spent,
    });
  }

  const totalWeekly = days.reduce((acc, curr) => acc + curr.spent, 0);
  const averageDaily = Math.round(totalWeekly / 7);
  const maxDay = days.reduce((prev, curr) => (curr.spent > prev.spent ? curr : prev), days[0]);

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('total7Days')}</span>
            <CalendarRange className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(totalWeekly, language)}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            {t('budget7Days')}: {formatCurrency(budget.dailyBudget * 7, language)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('dailyAverage')}</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(averageDaily, language)}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            {averageDaily <= budget.dailyBudget
              ? `🟢 ${language === 'en' ? 'Under daily budget' : 'ต่ำกว่างบต่อวัน'}`
              : `🔴 ${language === 'en' ? 'Exceeds daily budget' : 'เกินงบเฉลี่ยต่อวัน'}`}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>{t('highestDay')}</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {maxDay.spent > 0 ? formatCurrency(maxDay.spent, language) : '฿0'}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            {maxDay.spent > 0 ? maxDay.label : language === 'en' ? 'No expenses' : 'ยังไม่มีการใช้จ่าย'}
          </span>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{t('dailyTrendChart')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('budgetLine')} ({formatCurrency(budget.dailyBudget, language)})
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [formatCurrency(val, language), t('spent')]}
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#1e293b',
                  border: isDark ? '1px solid #334155' : 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <ReferenceLine y={budget.dailyBudget} stroke="#f43f5e" strokeDasharray="3 3" />
              <Bar dataKey="spent" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
