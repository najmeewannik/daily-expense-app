import React from 'react';
import { Expense, BudgetConfig } from '../types/expense';
import { formatTHB } from '../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { CalendarRange, TrendingUp, Flame } from 'lucide-react';

interface WeeklyReportProps {
  expenses: Expense[];
  budget: BudgetConfig;
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({ expenses, budget }) => {
  // Generate last 7 days keys
  const days: { dateStr: string; label: string; spent: number }[] = [];
  const thDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dayNum}`;
    const dayLabel = `${thDays[d.getDay()]} ${parseInt(dayNum, 10)}`;

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
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>รวม 7 วันล่าสุด</span>
            <CalendarRange className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatTHB(totalWeekly)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">งบ 7 วัน: {formatTHB(budget.dailyBudget * 7)}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>เฉลี่ยวันละ</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatTHB(averageDaily)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {averageDaily <= budget.dailyBudget ? '🟢 ต่ำกว่างบต่อวัน' : '🔴 เกินงบเฉลี่ยต่อวัน'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>วันที่ใช้จ่ายสูงสุด</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
            {maxDay.spent > 0 ? formatTHB(maxDay.spent) : '฿0'}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {maxDay.spent > 0 ? maxDay.label : 'ยังไม่มีการใช้จ่าย'}
          </span>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">กราฟรายจ่าย 7 วันย้อนหลัง</h3>
            <p className="text-xs text-slate-500 mt-0.5">เส้นประสีแดงคืองบประมาณต่อวัน ({formatTHB(budget.dailyBudget)})</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [formatTHB(val), 'ยอดจ่าย']}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <ReferenceLine y={budget.dailyBudget} stroke="#f43f5e" strokeDasharray="3 3" />
              <Bar
                dataKey="spent"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
