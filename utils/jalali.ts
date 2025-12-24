
/**
 * ابزارهای مدیریت تاریخ جلالی و تبدیل اعداد به فارسی
 */

export const toPersianDigits = (n: number | string): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

export const getTodayJalali = (): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const parts = new Intl.DateTimeFormat('fa-IR', options).format(now).split('/');
  return parts.join('/');
};

export const formatPrice = (amount: number): string => {
  return toPersianDigits(amount.toLocaleString('fa-IR'));
};

/**
 * مقایسه دو تاریخ شمسی به فرمت YYYY/MM/DD
 * بازگرداندن عدد: 1 (بزرگتر)، -1 (کوچکتر)، 0 (مساوی)
 */
export const compareJalaliDates = (date1: string, date2: string): number => {
  if (!date1 || !date2) return 0;
  // تبدیل اعداد فارسی به انگلیسی برای مقایسه صحیح
  const d1Str = date1.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  const d2Str = date2.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  
  if (d1Str > d2Str) return 1;
  if (d1Str < d2Str) return -1;
  return 0;
};
