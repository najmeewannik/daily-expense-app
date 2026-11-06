import { CategoryOption } from '../types/expense';

export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'food', name: 'อาหาร & เครื่องดื่ม', icon: '🍔', color: '#f59e0b', defaultMonthlyBudget: 6000 },
  { id: 'transport', name: 'การเดินทาง', icon: '🚗', color: '#3b82f6', defaultMonthlyBudget: 2500 },
  { id: 'shopping', name: 'ช้อปปิ้ง', icon: '🛍️', color: '#ec4899', defaultMonthlyBudget: 2000 },
  { id: 'bills', name: 'บิล & ค่าน้ำค่าไฟ', icon: '💡', color: '#ef4444', defaultMonthlyBudget: 3500 },
  { id: 'personal', name: 'ของใช้ส่วนตัว', icon: '📦', color: '#8b5cf6', defaultMonthlyBudget: 1000 },
  { id: 'entertainment', name: 'บันเทิง & พักผ่อน', icon: '🎬', color: '#06b6d4', defaultMonthlyBudget: 1000 },
  { id: 'health', name: 'สุขภาพ & ยา', icon: '💊', color: '#10b981', defaultMonthlyBudget: 1000 },
  { id: 'other', name: 'อื่นๆ', icon: '📌', color: '#64748b', defaultMonthlyBudget: 1000 },
];

export const formatTHB = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatThaiDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const today = getTodayDateString();
  if (dateStr === today) return 'วันนี้';

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yYear = yesterdayDate.getFullYear();
  const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterdayDate.getDate()).padStart(2, '0');
  if (dateStr === `${yYear}-${yMonth}-${yDay}`) return 'เมื่อวาน';

  const [year, month, day] = dateStr.split('-');
  const thMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const mIndex = parseInt(month, 10) - 1;
  const thYear = parseInt(year, 10) + 543;
  return `${parseInt(day, 10)} ${thMonths[mIndex] || month} ${thYear}`;
};
