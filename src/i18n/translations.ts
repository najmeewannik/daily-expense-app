export type Language = 'th' | 'en';

export interface CategoryTranslation {
  id: string;
  nameTh: string;
  nameEn: string;
  icon: string;
  color: string;
  defaultMonthlyBudget: number;
}

export const CATEGORIES_DATA: CategoryTranslation[] = [
  { id: 'food', nameTh: 'อาหาร & เครื่องดื่ม', nameEn: 'Food & Drinks', icon: '🍔', color: '#f59e0b', defaultMonthlyBudget: 6000 },
  { id: 'transport', nameTh: 'การเดินทาง', nameEn: 'Transport', icon: '🚗', color: '#3b82f6', defaultMonthlyBudget: 2500 },
  { id: 'shopping', nameTh: 'ช้อปปิ้ง', nameEn: 'Shopping', icon: '🛍️', color: '#ec4899', defaultMonthlyBudget: 2000 },
  { id: 'bills', nameTh: 'บิล & ค่าน้ำค่าไฟ', nameEn: 'Bills & Utilities', icon: '💡', color: '#ef4444', defaultMonthlyBudget: 3500 },
  { id: 'personal', nameTh: 'ของใช้ส่วนตัว', nameEn: 'Personal Care', icon: '📦', color: '#8b5cf6', defaultMonthlyBudget: 1000 },
  { id: 'entertainment', nameTh: 'บันเทิง & พักผ่อน', nameEn: 'Entertainment', icon: '🎬', color: '#06b6d4', defaultMonthlyBudget: 1000 },
  { id: 'health', nameTh: 'สุขภาพ & ยา', nameEn: 'Health & Medical', icon: '💊', color: '#10b981', defaultMonthlyBudget: 1000 },
  { id: 'other', nameTh: 'อื่นๆ', nameEn: 'Others', icon: '📌', color: '#64748b', defaultMonthlyBudget: 1000 },
];

export const getCategoryName = (identifier: string, lang: Language): string => {
  const found = CATEGORIES_DATA.find(
    (c) => c.id === identifier || c.nameTh === identifier || c.nameEn === identifier
  );
  if (!found) return identifier;
  return lang === 'en' ? found.nameEn : found.nameTh;
};

export const getCategoryIcon = (identifier: string): string => {
  const found = CATEGORIES_DATA.find(
    (c) => c.id === identifier || c.nameTh === identifier || c.nameEn === identifier
  );
  return found ? found.icon : '📌';
};

export const translations = {
  th: {
    // Brand & Sync
    appName: 'ExpenseTrack',
    googleSync: 'Google Sheets Sync',
    localMode: 'โหมดเครื่อง (Local)',
    syncTooltip: 'ซิงก์ข้อมูลกับ Google Sheet',
    settingsBtn: 'ตั้งค่า & เชื่อมต่อ',
    settingsShort: 'ตั้งค่า',

    // Navigation Tabs
    tabToday: 'วันนี้ (Today)',
    tabTodayShort: 'วันนี้',
    tabWeekly: '7 วันล่าสุด',
    tabWeeklyShort: '7 วัน',
    tabMonthly: 'ประจำเดือน',
    tabMonthlyShort: 'เดือนนี้',
    tabYearly: 'ประจำปี',
    tabYearlyShort: 'ทั้งปี',

    // Budget Monitor
    dailyBudgetTitle: 'งบประมาณวันนี้',
    monthlyBudgetTitle: 'งบประมาณประจำเดือน',
    spent: 'ใช้ไปแล้ว',
    remaining: 'คงเหลือ',
    overBudget: 'เกินงบ',
    statusSafe: 'ปลอดภัย สบายใจ',
    statusWarning: 'ใกล้แตะเพดานงบ',
    statusDanger: 'เกินงบที่ตั้งไว้!',
    categoryBudgetsHeader: 'งบประมาณแยกตามหมวดหมู่ (ต่อเดือน)',
    viewCategoryBudgets: 'ดูรายละเอียดงบรายหมวด',
    hideCategoryBudgets: 'ซ่อนรายละเอียด',
    noCategoryLimit: 'ไม่ได้จำกัดงบ',

    // Quick Expense Form
    quickExpenseTitle: '⚡ จดรายจ่ายด่วน (Quick Entry)',
    savedBadge: 'บันทึกแล้ว!',
    amountLabel: 'จำนวนเงิน (บาท)',
    categoryLabel: 'หมวดหมู่',
    noteLabel: 'โน้ต / รายละเอียด (ถ้ามี)',
    notePlaceholder: 'เช่น กาแฟอเมซอน, ข้าวมันไก่, ค่าน้ำมัน...',
    dateLabel: 'วันที่',
    todayBtn: 'วันนี้',
    yesterdayBtn: 'เมื่อวาน',
    saveExpenseBtn: 'บันทึกรายการ (กด Enter เพื่อจดต่อ)',
    catBudgetMonthly: 'งบหมวดนี้เดือนนี้:',
    overBy: 'เกิน',
    leftBudget: 'เหลือ',

    // Expense List
    todayListTitle: 'รายการรายจ่ายวันนี้',
    recentListTitle: 'รายการรายจ่ายล่าสุด',
    monthlyListTitle: 'รายการรายจ่ายเดือนนี้',
    allHistoryTitle: 'ประวัติรายการทั้งหมด (20 รายการล่าสุด)',
    itemsCount: 'รายการ',
    totalSum: 'รวมทั้งหมด',
    searchPlaceholder: 'ค้นหาหมวดหมู่ / โน้ต...',
    noExpenses: 'ยังไม่มีรายการรายจ่าย',
    noExpensesSubtitle: 'เริ่มบันทึกรายการแรกจากฟอร์มด้านบนได้เลยครับ',
    deleteConfirm: 'ลบรายการนี้หรือไม่?',

    // Weekly Report
    weeklyReportTitle: 'สรุปรายจ่าย 7 วันล่าสุด',
    total7Days: 'รวม 7 วันล่าสุด',
    budget7Days: 'งบ 7 วัน',
    dailyAverage: 'เฉลี่ยวันละ',
    highestDay: 'ใช้วันสูงสุด',
    dailyTrendChart: 'กราฟรายจ่ายรายวัน (เทียบเส้นงบประมาณต่อวัน)',
    budgetLine: 'เส้นงบต่อวัน',

    // Monthly Report
    monthlyReportTitle: 'รายงานประจำเดือน',
    selectMonth: 'เลือกเดือน:',
    totalMonth: 'รายจ่ายรวมทั้งเดือน',
    monthlyBudgetStatus: 'สถานะงบประจำเดือน',
    recommendedDaily: 'งบที่แนะนำให้ใช้ต่อวัน',
    daysRemaining: 'เหลืออีก {days} วัน',
    categoryProportion: 'สัดส่วนรายจ่ายตามหมวดหมู่',
    budgetVsActual: 'เปรียบเทียบงบประมาณแต่ละหมวด',
    usedOfBudget: 'ใช้ไป {spent} จากงบ {budget}',

    // Yearly Report
    yearlyReportTitle: 'รายงานสรุปประจำปี',
    selectYear: 'เลือกปีสรุปผล:',
    totalYear: 'รายจ่ายรวมทั้งปี',
    monthlyAverage: 'เฉลี่ยเดือนละ',
    highestMonth: 'เดือนที่ใช้จ่ายสูงสุด',
    activeMonthsCount: 'จาก {count} เดือนที่มีข้อมูล',
    monthlySpendingBar: 'แนวโน้มรายจ่ายแต่ละเดือน (บาท)',
    yearlyCategoryShare: 'สัดส่วนรายจ่ายตลอดทั้งปี',

    // Settings Modal
    settingsTitle: 'การตั้งค่าระบบ',
    settingsSubtitle: 'จัดการธีม, ภาษา, ฐานข้อมูล และงบประมาณ',
    appearanceSection: 'รูปลักษณ์ & ภาษา (Appearance & Language)',
    themeLabel: 'ธีมการแสดงผล:',
    themeLight: 'สว่าง',
    themeDark: 'มืด',
    themeSystem: 'ตามระบบ',
    languageLabel: 'ภาษา (Language):',
    langTh: 'ภาษาไทย (TH)',
    langEn: 'English (EN)',
    overallBudgetTitle: 'ตั้งค่างบประมาณรวม (Overall Budget)',
    dailyBudgetInput: 'งบต่อวัน (บาท)',
    monthlyBudgetInput: 'งบต่อเดือน (บาท)',
    categoryBudgetsTitle: 'งบประมาณแยกตามหมวดหมู่ (ต่อเดือน)',
    categoryBudgetsTip: '(ใส่ 0 หากไม่ต้องการจำกัด)',
    saveAllBudgetsBtn: 'บันทึกงบประมาณทั้งหมด',
    budgetSavedSuccess: 'บันทึกแล้ว',
    googleSheetSection: 'เชื่อมต่อ Google Sheets Database',
    googleSheetDesc: 'นำ URL ของ Google Apps Script Web App จาก Google Sheet ของคุณมาวางเพื่อซิงก์ข้อมูลอัตโนมัติ',
    testAndSaveBtn: 'ทดสอบ & บันทึกการเชื่อมต่อ',
    testingBtn: 'กำลังทดสอบ...',
    clearLocalBtn: 'ล้างค่า (ใช้โหมดเครื่อง)',
    backupSection: 'สำรองข้อมูล & นำเข้า (Backup & Export)',
    exportExcel: 'ส่งออก Excel',
    backupJson: 'สำรอง JSON',
    importJson: '📥 นำเข้าไฟล์สำรอง (JSON)',
    clearAllData: 'ล้างข้อมูลทั้งหมด',
    confirmClearAll: 'คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลรายจ่ายทั้งหมดในเครื่อง?',
    importSuccess: 'นำเข้าข้อมูลสำเร็จ {count} รายการ!',
    importInvalidJson: 'ไฟล์ JSON ไม่ถูกต้องตามรูปแบบ',
    importError: 'เกิดข้อผิดพลาดในการอ่านไฟล์ JSON',

    // Footer
    footerText: 'Daily Expense Tracker • 100% ฟรีและเป็นส่วนตัว • เชื่อมต่อ Google Sheets',
  },
  en: {
    // Brand & Sync
    appName: 'ExpenseTrack',
    googleSync: 'Google Sheets Sync',
    localMode: 'Local Mode',
    syncTooltip: 'Sync with Google Sheet',
    settingsBtn: 'Settings & Sync',
    settingsShort: 'Settings',

    // Navigation Tabs
    tabToday: 'Today',
    tabTodayShort: 'Today',
    tabWeekly: '7 Days',
    tabWeeklyShort: '7 Days',
    tabMonthly: 'Monthly',
    tabMonthlyShort: 'Month',
    tabYearly: 'Yearly',
    tabYearlyShort: 'Year',

    // Budget Monitor
    dailyBudgetTitle: 'Daily Budget',
    monthlyBudgetTitle: 'Monthly Budget',
    spent: 'Spent',
    remaining: 'Remaining',
    overBudget: 'Over budget',
    statusSafe: 'Safe & On Track',
    statusWarning: 'Near Budget Limit',
    statusDanger: 'Budget Exceeded!',
    categoryBudgetsHeader: 'Category Budgets (Monthly)',
    viewCategoryBudgets: 'View Category Details',
    hideCategoryBudgets: 'Hide Details',
    noCategoryLimit: 'No limit set',

    // Quick Expense Form
    quickExpenseTitle: '⚡ Quick Entry',
    savedBadge: 'Saved!',
    amountLabel: 'Amount (THB)',
    categoryLabel: 'Category',
    noteLabel: 'Note / Details (Optional)',
    notePlaceholder: 'e.g. Starbucks, Lunch, Petrol...',
    dateLabel: 'Date',
    todayBtn: 'Today',
    yesterdayBtn: 'Yesterday',
    saveExpenseBtn: 'Save Expense (Press Enter to continue)',
    catBudgetMonthly: 'Category budget this month:',
    overBy: 'Over',
    leftBudget: 'Left',

    // Expense List
    todayListTitle: "Today's Expenses",
    recentListTitle: 'Recent Expenses',
    monthlyListTitle: "This Month's Expenses",
    allHistoryTitle: 'Full History (Latest 20 Items)',
    itemsCount: 'items',
    totalSum: 'Total',
    searchPlaceholder: 'Search category or note...',
    noExpenses: 'No expenses logged yet',
    noExpensesSubtitle: 'Start logging your first expense above!',
    deleteConfirm: 'Delete this expense item?',

    // Weekly Report
    weeklyReportTitle: '7-Day Expense Summary',
    total7Days: '7-Day Total',
    budget7Days: '7-Day Budget',
    dailyAverage: 'Daily Average',
    highestDay: 'Peak Day',
    dailyTrendChart: 'Daily Spending Trend (vs Daily Budget)',
    budgetLine: 'Daily Budget Line',

    // Monthly Report
    monthlyReportTitle: 'Monthly Report',
    selectMonth: 'Select Month:',
    totalMonth: 'Total Month Spending',
    monthlyBudgetStatus: 'Monthly Budget Status',
    recommendedDaily: 'Recommended Daily Spend',
    daysRemaining: '{days} days remaining',
    categoryProportion: 'Category Distribution',
    budgetVsActual: 'Budget vs Actual by Category',
    usedOfBudget: 'Used {spent} of {budget}',

    // Yearly Report
    yearlyReportTitle: 'Yearly Report',
    selectYear: 'Select Year:',
    totalYear: 'Total Annual Spending',
    monthlyAverage: 'Monthly Average',
    highestMonth: 'Peak Month',
    activeMonthsCount: 'from {count} active months',
    monthlySpendingBar: 'Monthly Spending Trend (THB)',
    yearlyCategoryShare: 'Annual Category Distribution',

    // Settings Modal
    settingsTitle: 'System Settings',
    settingsSubtitle: 'Manage theme, language, database and budgets',
    appearanceSection: 'Appearance & Language',
    themeLabel: 'Theme:',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    languageLabel: 'Language:',
    langTh: 'Thai (ไทย)',
    langEn: 'English (EN)',
    overallBudgetTitle: 'Overall Budget Settings',
    dailyBudgetInput: 'Daily Budget (THB)',
    monthlyBudgetInput: 'Monthly Budget (THB)',
    categoryBudgetsTitle: 'Monthly Category Budgets',
    categoryBudgetsTip: '(Set 0 for unconstrained)',
    saveAllBudgetsBtn: 'Save All Budgets',
    budgetSavedSuccess: 'Saved',
    googleSheetSection: 'Connect Google Sheets Database',
    googleSheetDesc: 'Paste your Google Apps Script Web App URL to enable cloud synchronization',
    testAndSaveBtn: 'Test & Save Connection',
    testingBtn: 'Testing...',
    clearLocalBtn: 'Reset (Use Local Mode)',
    backupSection: 'Backup & Export',
    exportExcel: 'Export Excel',
    backupJson: 'Backup JSON',
    importJson: '📥 Import Backup (JSON)',
    clearAllData: 'Clear All Data',
    confirmClearAll: 'Are you sure you want to clear all stored expense records?',
    importSuccess: 'Successfully imported {count} items!',
    importInvalidJson: 'Invalid JSON file format',
    importError: 'Error reading JSON file',

    // Footer
    footerText: 'Daily Expense Tracker • 100% Free & Personal • Powered by Google Sheets',
  },
};

export type TranslationKey = keyof typeof translations.th;
