import React, { useState } from 'react';
import { Expense, BudgetConfig } from '../types/expense';
import { formatTHB } from '../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { TrendingUp, Award, Calendar } from 'lucide-react';

interface YearlyReportProps {
  expenses: Expense[];
  budget: BudgetConfig;
}

export const YearlyReport: React.FC<YearlyReportProps> = ({ expenses, budget }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const thMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const monthData = thMonths.map((mName, idx) => {
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

  return (
    <div className="space-y-4">
      {/* Year Picker Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-slate-800 text-sm">เลือกปีสรุปผล:</span>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value={currentYear}>ปี {currentYear + 543} (ปัจจุบัน)</option>
          <option value={currentYear - 1}>ปี {currentYear - 1 + 543}</option>
          <option value={currentYear - 2}>ปี {currentYear - 2 + 543}</option>
        </select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>รวมรายจ่ายทั้งปี {selectedYear + 543}</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatTHB(totalYearly)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">งบทั้งปี: {formatTHB(budget.monthlyBudget * 12)}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>เฉลี่ยเดือนละ</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatTHB(averageMonthly)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {averageMonthly <= budget.monthlyBudget ? '🟢 ต่ำกว่างบต่อเดือน' : '🔴 เกินงบต่อเดือน'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>เดือนที่จ่ายสูงสุด</span>
            <span className="text-rose-500 font-bold text-xs">High</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">
            {maxMonth.spent > 0 ? formatTHB(maxMonth.spent) : '฿0'}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {maxMonth.spent > 0 ? `เดือน ${maxMonth.monthName}` : 'ยังไม่มีข้อมูล'}
          </span>
        </div>
      </div>

      {/* 12-Month Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">เปรียบเทียบรายจ่ายทั้ง 12 เดือน</h3>
            <p className="text-xs text-slate-500 mt-0.5">เส้นประสีแดงคืองบประมาณต่อเดือน ({formatTHB(budget.monthlyBudget)})</p>
          </div>
        </div>

        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val: number) => [formatTHB(val), 'ยอดจ่าย']}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <ReferenceLine y={budget.monthlyBudget} stroke="#f43f5e" strokeDasharray="3 3" />
              <Bar
                dataKey="spent"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
