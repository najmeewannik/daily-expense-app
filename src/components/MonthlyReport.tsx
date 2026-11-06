import React, { useState } from 'react';
import { Expense, BudgetConfig } from '../types/expense';
import { formatTHB, DEFAULT_CATEGORIES } from '../utils/formatters';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, Calendar, Coins, Target } from 'lucide-react';

interface MonthlyReportProps {
  expenses: Expense[];
  budget: BudgetConfig;
}

export const MonthlyReport: React.FC<MonthlyReportProps> = ({ expenses, budget }) => {
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  // Filter expenses for selected month
  const monthExpenses = expenses.filter((e) => e.date.startsWith(selectedMonth));
  const totalSpent = monthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget.monthlyBudget - totalSpent;

  // Calculate days remaining in current month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const y = parseInt(yearStr, 10);
  const m = parseInt(monthStr, 10);
  const totalDaysInMonth = new Date(y, m, 0).getDate();
  const todayDay = now.getDate();
  const isCurrentMonth = selectedMonth === currentMonthKey;
  const daysRemaining = isCurrentMonth ? Math.max(totalDaysInMonth - todayDay + 1, 1) : totalDaysInMonth;
  const recommendedDaily = remaining > 0 ? Math.round(remaining / daysRemaining) : 0;

  // Group by category
  const categoryBudgets = budget.categoryBudgets || {};
  const categoryMap: { [key: string]: { total: number; count: number; color: string; icon: string } } = {};
  DEFAULT_CATEGORIES.forEach((cat) => {
    categoryMap[cat.name] = { total: 0, count: 0, color: cat.color, icon: cat.icon };
  });

  monthExpenses.forEach((e) => {
    if (!categoryMap[e.category]) {
      categoryMap[e.category] = { total: 0, count: 0, color: '#94a3b8', icon: '📌' };
    }
    categoryMap[e.category].total += e.amount;
    categoryMap[e.category].count += 1;
  });

  const chartData = Object.entries(categoryMap)
    .filter(([_, data]) => data.total > 0)
    .map(([name, data]) => ({
      name,
      value: data.total,
      color: data.color,
      icon: data.icon,
      count: data.count,
      percent: totalSpent > 0 ? Math.round((data.total / totalSpent) * 100) : 0,
      budgetLimit: categoryBudgets[name] || 0,
    }))
    .sort((a, b) => b.value - a.value);

  // Month selector options (last 6 months)
  const monthOptions: { value: string; label: string }[] = [];
  const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  for (let i = 0; i < 6; i++) {
    const optDate = new Date();
    optDate.setMonth(optDate.getMonth() - i);
    const optY = optDate.getFullYear();
    const optM = String(optDate.getMonth() + 1).padStart(2, '0');
    const val = `${optY}-${optM}`;
    const lbl = `${thMonths[optDate.getMonth()]} ${optY + 543}`;
    monthOptions.push({ value: val, label: lbl });
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Month picker header */}
      <div className="flex items-center justify-between bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          <span className="font-bold text-slate-800 text-xs sm:text-sm">เลือกเดือนสรุปผล:</span>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl px-2.5 sm:px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1">
            <span>ยอดใช้จ่ายเดือนนี้</span>
            <Coins className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">
            {formatTHB(totalSpent)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block truncate">งบเดือน: {formatTHB(budget.monthlyBudget)}</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1">
            <span>คงเหลือในงบเดือน</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className={`text-lg sm:text-2xl font-black truncate ${remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {remaining >= 0 ? formatTHB(remaining) : `-${formatTHB(Math.abs(remaining))}`}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
            {remaining >= 0 ? `เหลือเวลา ${daysRemaining} วัน` : 'เกินงบประมาณแล้ว'}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1">
            <span>แนะนำใช้วันละไม่เกิน</span>
            <PieIcon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">
            {recommendedDaily > 0 ? formatTHB(recommendedDaily) : '฿0'}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block truncate">เพื่อให้ไม่เกินงบเดือน</span>
        </div>
      </div>

      {/* Category breakdown Chart & List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">สัดส่วนรายจ่าย & งบประมาณแยกหมวด</h3>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs sm:text-sm">
            ไม่มีรายการรายจ่ายในเดือนที่เลือก
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Donut Chart */}
            <div className="h-56 sm:h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [formatTHB(val), 'ยอดจ่าย']}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center px-2">
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">รวมเดือนนี้</span>
                <span className="text-sm sm:text-base font-black text-slate-800 truncate max-w-[110px]">
                  {formatTHB(totalSpent)}
                </span>
              </div>
            </div>

            {/* Category Ranking List with Budget Comparison */}
            <div className="space-y-2.5">
              {chartData.map((cat) => {
                const hasBudget = cat.budgetLimit > 0;
                const catPercent = hasBudget ? Math.min(Math.round((cat.value / cat.budgetLimit) * 100), 100) : 0;
                const isOver = hasBudget && cat.value > cat.budgetLimit;
                return (
                  <div key={cat.name} className="p-2 rounded-xl bg-slate-50/60 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm select-none">{cat.icon}</span>
                        <span className="font-semibold text-slate-800 truncate">{cat.name}</span>
                        <span className="text-[10px] text-slate-400">({cat.count})</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="font-bold text-slate-900">{formatTHB(cat.value)}</span>
                        {hasBudget && (
                          <span className="text-[10px] text-slate-400">/ {formatTHB(cat.budgetLimit)}</span>
                        )}
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white min-w-7 text-center"
                          style={{ backgroundColor: cat.color }}
                        >
                          {cat.percent}%
                        </span>
                      </div>
                    </div>

                    {/* Mini Budget Bar if budget set */}
                    {hasBudget && (
                      <div className="w-full bg-slate-200/80 rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${catPercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
