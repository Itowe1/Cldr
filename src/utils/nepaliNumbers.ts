/**
 * Utilities for Nepali Devanagari numerals, day names, and month formatting
 */

export const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toDevanagari(val: number | string): string {
  const str = String(val);
  return str.replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[parseInt(digit, 10)]);
}

export function fromDevanagari(str: string): string {
  const devanagariMap: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  };
  return str.replace(/[०-९]/g, (char) => devanagariMap[char] || char);
}

export const NEPALI_MONTHS = [
  { bsMonth: 1, nameNe: 'बैशाख', nameEn: 'Baisakh', shortEn: 'Bai', adEquivalentNe: 'अप्रिल / मे', adEquivalentEn: 'Apr / May', season: 'वसन्त (Spring)' },
  { bsMonth: 2, nameNe: 'जेठ', nameEn: 'Jestha', shortEn: 'Jes', adEquivalentNe: 'मे / जुन', adEquivalentEn: 'May / Jun', season: 'ग्रीष्म (Summer)' },
  { bsMonth: 3, nameNe: 'असार', nameEn: 'Ashadh', shortEn: 'Ash', adEquivalentNe: 'जुन / जुलाई', adEquivalentEn: 'Jun / Jul', season: 'ग्रीष्म (Summer)' },
  { bsMonth: 4, nameNe: 'साउन', nameEn: 'Shrawan', shortEn: 'Shr', adEquivalentNe: 'जुलाई / अगस्ट', adEquivalentEn: 'Jul / Aug', season: 'वर्षा (Monsoon)' },
  { bsMonth: 5, nameNe: 'भदौ', nameEn: 'Bhadra', shortEn: 'Bha', adEquivalentNe: 'अगस्ट / सेप्टेम्बर', adEquivalentEn: 'Aug / Sep', season: 'वर्षा (Monsoon)' },
  { bsMonth: 6, nameNe: 'असोज', nameEn: 'Ashwin', shortEn: 'Aso', adEquivalentNe: 'सेप्टेम्बर / अक्टोबर', adEquivalentEn: 'Sep / Oct', season: 'शरद (Autumn)' },
  { bsMonth: 7, nameNe: 'कात्तिक', nameEn: 'Kartik', shortEn: 'Kar', adEquivalentNe: 'अक्टोबर / नोभेम्बर', adEquivalentEn: 'Oct / Nov', season: 'शरद (Autumn)' },
  { bsMonth: 8, nameNe: 'मंसिर', nameEn: 'Mangsir', shortEn: 'Man', adEquivalentNe: 'नोभेम्बर / डिसेम्बर', adEquivalentEn: 'Nov / Dec', season: 'हेमन्त (Pre-winter)' },
  { bsMonth: 9, nameNe: 'पुष', nameEn: 'Poush', shortEn: 'Pou', adEquivalentNe: 'डिसेम्बर / जनवरी', adEquivalentEn: 'Dec / Jan', season: 'हेमन्त (Pre-winter)' },
  { bsMonth: 10, nameNe: 'माघ', nameEn: 'Magh', shortEn: 'Mag', adEquivalentNe: 'जनवरी / फेब्रुअरी', adEquivalentEn: 'Jan / Feb', season: 'शिशिर (Winter)' },
  { bsMonth: 11, nameNe: 'फागुन', nameEn: 'Falgun', shortEn: 'Fal', adEquivalentNe: 'फेब्रुअरी / मार्च', adEquivalentEn: 'Feb / Mar', season: 'शिशिर (Winter)' },
  { bsMonth: 12, nameNe: 'चैत', nameEn: 'Chaitra', shortEn: 'Cha', adEquivalentNe: 'मार्च / अप्रिल', adEquivalentEn: 'Mar / Apr', season: 'वसन्त (Spring)' },
];

export const DAYS_OF_WEEK = [
  { dayIndex: 0, nameNe: 'आइतवार', shortNe: 'आइत', nameEn: 'Sunday', shortEn: 'Sun', isWeekend: false },
  { dayIndex: 1, nameNe: 'सोमवार', shortNe: 'सोम', nameEn: 'Monday', shortEn: 'Mon', isWeekend: false },
  { dayIndex: 2, nameNe: 'मङ्गलवार', shortNe: 'मङ्गल', nameEn: 'Tuesday', shortEn: 'Tue', isWeekend: false },
  { dayIndex: 3, nameNe: 'बुधवार', shortNe: 'बुध', nameEn: 'Wednesday', shortEn: 'Wed', isWeekend: false },
  { dayIndex: 4, nameNe: 'बिहीवार', shortNe: 'बिही', nameEn: 'Thursday', shortEn: 'Thu', isWeekend: false },
  { dayIndex: 5, nameNe: 'शुक्रवार', shortNe: 'शुक्र', nameEn: 'Friday', shortEn: 'Fri', isWeekend: false },
  { dayIndex: 6, nameNe: 'शनिवार', shortNe: 'शनि', nameEn: 'Saturday', shortEn: 'Sat', isWeekend: true },
];

export const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const GREGORIAN_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
