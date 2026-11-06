import { CategoryOption } from '../types/expense';
import { CATEGORIES_DATA, Language } from '../i18n/translations';

export const DEFAULT_CATEGORIES: CategoryOption[] = CATEGORIES_DATA.map((c) => ({
  id: c.id,
  name: c.nameTh,
  icon: c.icon,
  color: c.color,
  defaultMonthlyBudget: c.defaultMonthlyBudget,
}));

export const formatTHB = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCurrency = (amount: number, lang: Language = 'th'): string => {
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (amount: number, lang: Language = 'th'): string => {
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'th-TH', {
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

export const getYesterdayDateString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr: string, lang: Language = 'th'): string => {
  if (!dateStr) return '';
  const today = getTodayDateString();
  if (dateStr === today) return lang === 'en' ? 'Today' : 'วันนี้';

  const yesterday = getYesterdayDateString();
  if (dateStr === yesterday) return lang === 'en' ? 'Yesterday' : 'เมื่อวาน';

  const [year, month, day] = dateStr.split('-');
  const mIndex = parseInt(month, 10) - 1;

  if (lang === 'en') {
    const enMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${enMonths[mIndex] || month} ${parseInt(day, 10)}, ${year}`;
  }

  const thMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const thYear = parseInt(year, 10) + 543;
  return `${parseInt(day, 10)} ${thMonths[mIndex] || month} ${thYear}`;
};

export const formatThaiDate = (dateStr: string): string => {
  return formatDisplayDate(dateStr, 'th');
};
