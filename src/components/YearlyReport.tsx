import React, { useState } from 'react';
import { Expense, BudgetConfig } from '../types/expense';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { TrendingUp, Award, Calendar } from 'lucide-react';

interface YearlyReportProps {
  expenses: Expense[];
  budget: BudgetConfig;
}

export const YearlyReport: React.FC<YearlyReportProps> = ({ expenses, budget }) => {
  const { t, language, isDark } = useApp();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const thMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const enMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const months = language === 'en' ? enMonths : thMonths;

  const monthData = months.map((mName, idx) => {
    const monthKey = `${selectedYear}-${String(idx + 1).padStart(2, '0')}`;
    const monthlyItems = expenses.filter((e) => e.date.startsWith(monthKey));
    const spent = monthlyItems.reduce((acc, curr) => acc + curr.amount, 0);
    return {
      monthKey,
      monthName: mName,
      spent,
      count: monthlyItems.length,
    };
  });

  const totalYearly = monthData.reduce((acc, curr) => acc + curr.spent, 0);
  const activeMonths = monthData.filter((m) => m.spent > 0).length || 1;
  const averageMonthly = Math.round(totalYearly / activeMonths);

  const maxMonth = monthData.reduce((prev, curr) => (curr.spent > prev.spent ? curr : prev), monthData[0]);

  const yearDisplay = (yr: number) => (language === 'en' ? `${yr}` : `${yr + 543}`);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Year Picker Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-colors">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
            {t('selectYear')}
          </span>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm rounded-xl px-2.5 sm:px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value={currentYear}>{language === 'en' ? `Year ${currentYear} (Current)` : `ปี ${currentYear + 543} (ปัจจุบัน)`}</option>
          <option value={currentYear - 1}>{language === 'en' ? `Year ${currentYear - 1}` : `ปี ${currentYear - 1 + 543}`}</option>
          <option value={currentYear - 2}>{language === 'en' ? `Year ${currentYear - 2}` : `ปี ${currentYear - 2 + 543}`}</option>
        </select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs font-semibold mb-1">
            <span>{t('totalYear')} ({yearDisplay(selectedYear)})</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {formatCurrency(totalYearly, language)}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block truncate">
            {t('tabYearly')}: {formatCurrency(budget.monthlyBudget * 12, language)}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs font-semibold mb-1">
            <span>{t('monthlyAverage')}</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {formatCurrency(averageMonthly, language)}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block truncate">
            {averageMonthly <= budget.monthlyBudget
              ? `🟢 ${language === 'en' ? 'Under monthly budget' : 'ต่ำกว่างบต่อเดือน'}`
              : `🔴 ${language === 'en' ? 'Exceeds monthly budget' : 'เกินงบต่อเดือน'}`}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs font-semibold mb-1">
            <span>{t('highestMonth')}</span>
            <span className="text-rose-500 font-bold text-xs">Peak</span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {maxMonth.spent > 0 ? formatCurrency(maxMonth.spent, language) : '฿0'}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block truncate">
            {maxMonth.spent > 0 ? maxMonth.monthName : language === 'en' ? 'No data' : 'ยังไม่มีข้อมูล'}
          </span>
        </div>
      </div>

      {/* 12-Month Bar Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs overflow-hidden transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              {t('monthlySpendingBar')}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('budgetLine')} ({formatCurrency(budget.monthlyBudget, language)})
            </p>
          </div>
        </div>

        <div className="h-60 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
              <XAxis dataKey="monthName" tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [formatCurrency(val, language), t('spent')]}
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#1e293b',
                  border: isDark ? '1px solid #334155' : 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <ReferenceLine y={budget.monthlyBudget} stroke="#f43f5e" strokeDasharray="3 3" />
              <Bar dataKey="spent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
