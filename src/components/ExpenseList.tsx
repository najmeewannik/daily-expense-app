import React, { useState } from 'react';
import { Expense } from '../types/expense';
import { formatTHB, DEFAULT_CATEGORIES, formatThaiDate } from '../utils/formatters';
import { Trash2, Search, Receipt } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  title?: string;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  title = 'รายการรายจ่ายวันนี้',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryIcon = (catName: string) => {
    const found = DEFAULT_CATEGORIES.find((c) => c.name === catName);
    return found ? found.icon : '📌';
  };

  const filtered = expenses.filter((e) => {
    const q = searchTerm.toLowerCase();
    return (
      e.category.toLowerCase().includes(q) ||
      (e.note && e.note.toLowerCase().includes(q)) ||
      String(e.amount).includes(q)
    );
  });

  const totalSum = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">{title}</h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {filtered.length} รายการ
          </span>
        </div>

        {/* Search filter */}
        {expenses.length > 3 && (
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาหมวดหมู่ / โน้ต..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-emerald-500 outline-none w-full"
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 px-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
            <Receipt className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600">ยังไม่มีรายการรายจ่าย</p>
          <p className="text-[11px] text-slate-400 mt-0.5">เริ่มบันทึกรายการแรกจากฟอร์มด้านบนได้เลยครับ</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50/70 px-1.5 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base flex-shrink-0">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • {formatThaiDate(item.date)}
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-[200px] sm:max-w-xs">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <span className="font-bold text-slate-900 text-xs sm:text-base">
                  -{formatTHB(item.amount)}
                </span>
                <button
                  onClick={() => {
                    if (window.confirm(`ลบรายการ "${item.category}" ${formatTHB(item.amount)} หรือไม่?`)) {
                      onDeleteExpense(item.id);
                    }
                  }}
                  className="opacity-75 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                  title="ลบรายการนี้"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Subtotal */}
          <div className="pt-2.5 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-700 px-1.5">
            <span>รวมทั้งหมด ({filtered.length} รายการ)</span>
            <span className="text-sm sm:text-base text-slate-900">{formatTHB(totalSum)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
