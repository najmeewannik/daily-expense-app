import React, { useState, useRef } from 'react';
import { DEFAULT_CATEGORIES, getTodayDateString, formatTHB } from '../utils/formatters';
import { PlusCircle, Check, Info } from 'lucide-react';

interface QuickExpenseFormProps {
  onAddExpense: (data: { date: string; category: string; amount: number; note: string }) => void;
  categorySpentMap?: { [categoryName: string]: number };
  categoryBudgets?: { [categoryName: string]: number };
}

export const QuickExpenseForm: React.FC<QuickExpenseFormProps> = ({
  onAddExpense,
  categorySpentMap = {},
  categoryBudgets = {},
}) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0].name);
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [justSaved, setJustSaved] = useState<boolean>(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      amountInputRef.current?.focus();
      return;
    }

    onAddExpense({
      date,
      category,
      amount: num,
      note: note.trim(),
    });

    // Reset amount & note for rapid continuous logging
    setAmount('');
    setNote('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);

    // Re-focus amount input for the next entry
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 50);
  };

  // Selected category budget info
  const selectedCatBudget = categoryBudgets[category] || 0;
  const selectedCatSpent = categorySpentMap[category] || 0;
  const catRemaining = selectedCatBudget - selectedCatSpent;
  const isCatOver = selectedCatSpent > selectedCatBudget && selectedCatBudget > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
          <span>⚡ จดรายจ่ายด่วน (Quick Entry)</span>
        </h2>
        {justSaved && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-fade-in">
            <Check className="w-3.5 h-3.5" /> บันทึกแล้ว!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            จำนวนเงิน (บาท)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-xl sm:text-2xl font-black text-slate-400 select-none">฿</span>
            <input
              ref={amountInputRef}
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-3 py-2.5 sm:py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xl sm:text-2xl font-black text-slate-900 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Quick Category Chips */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              หมวดหมู่
            </label>
            {selectedCatBudget > 0 && (
              <span className={`text-[11px] font-semibold flex items-center gap-1 ${isCatOver ? 'text-rose-600' : 'text-slate-500'}`}>
                <Info className="w-3 h-3" />
                งบหมวดนี้เดือนนี้: {isCatOver ? `เกิน +${formatTHB(Math.abs(catRemaining))}` : `เหลือ ${formatTHB(catRemaining)}`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {DEFAULT_CATEGORIES.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left border cursor-pointer select-none ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base flex-shrink-0">{cat.icon}</span>
                  <span className="truncate leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note & Date Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              โน้ต / รายละเอียด (ถ้ามี)
            </label>
            <input
              type="text"
              placeholder="เช่น กาแฟอเมซอน, ข้าวมันไก่, ค่าน้ำมัน..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              วันที่
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-2.5 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>บันทึกรายการ (กด Enter เพื่อจดต่อ)</span>
        </button>
      </form>
    </div>
  );
};
