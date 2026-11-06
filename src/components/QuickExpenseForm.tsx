import React, { useState, useRef } from 'react';
import { DEFAULT_CATEGORIES, getTodayDateString } from '../utils/formatters';
import { PlusCircle, Check } from 'lucide-react';

interface QuickExpenseFormProps {
  onAddExpense: (data: { date: string; category: string; amount: number; note: string }) => void;
}

export const QuickExpenseForm: React.FC<QuickExpenseFormProps> = ({ onAddExpense }) => {
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>⚡ จดรายจ่ายด่วน (Quick Entry)</span>
        </h2>
        {justSaved && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-fade-in">
            <Check className="w-3.5 h-3.5" /> บันทึกแล้ว!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            จำนวนเงิน (บาท)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-2xl font-bold text-slate-400 select-none">฿</span>
            <input
              ref={amountInputRef}
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-2xl sm:text-3xl font-black text-slate-900 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Quick Category Chips */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            หมวดหมู่
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEFAULT_CATEGORIES.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left border ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20 font-semibold scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base select-none">{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note & Date Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              โน้ต / รายละเอียด (ถ้ามี)
            </label>
            <input
              type="text"
              placeholder="เช่น กาแฟอเมซอน, ข้าวมันไก่, ค่าน้ำมัน..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              วันที่
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-base rounded-xl shadow-md shadow-emerald-500/25 active:scale-[0.99] transition-all cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>บันทึกรายการ (กด Enter เพื่อจดต่อ)</span>
        </button>
      </form>
    </div>
  );
};
