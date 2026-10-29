import { CalendarDay, PanchangInfo } from '../types/calendar';
import {
  BS_MONTH_DAYS,
  BS_TO_AD_REFERENCE,
  TITHI_LIST,
  NAKSHATRA_LIST,
  YOGA_LIST,
  KARANA_LIST,
  RASHI_NAMES,
  FESTIVALS_CATALOG,
  SAIT_MUHURAT_CATALOG
} from '../data/nepaliCalendarData';

export function getNepaliMonthDays(bsYear: number, bsMonth: number): number {
  const yearDays = BS_MONTH_DAYS[bsYear] || BS_MONTH_DAYS[2083];
  return yearDays[bsMonth - 1] || 30;
}

/**
 * Converts Bikram Sambat (BS) date to Gregorian Date object
 */
export function convertBsToAd(bsYear: number, bsMonth: number, bsDay: number): Date {
  const ref = BS_TO_AD_REFERENCE[bsYear] || BS_TO_AD_REFERENCE[2083];
  const refDate = new Date(Date.UTC(ref[0], ref[1], ref[2]));

  const monthDays = BS_MONTH_DAYS[bsYear] || BS_MONTH_DAYS[2083];
  let daysOffset = 0;
  for (let m = 0; m < bsMonth - 1; m++) {
    daysOffset += monthDays[m];
  }
  daysOffset += (bsDay - 1);

  const targetTime = refDate.getTime() + daysOffset * 86400000;
  return new Date(targetTime);
}

/**
 * Converts Gregorian Date to Bikram Sambat (BS) date
 */
export function convertAdToBs(adDate: Date): { bsYear: number; bsMonth: number; bsDay: number } {
  const targetUtc = Date.UTC(adDate.getFullYear(), adDate.getMonth(), adDate.getDate());

  // Find candidate BS year
  const years = Object.keys(BS_TO_AD_REFERENCE).map(Number).sort((a, b) => a - b);
  let matchedYear = years[years.length - 1];

  for (let i = 0; i < years.length; i++) {
    const yr = years[i];
    const ref = BS_TO_AD_REFERENCE[yr];
    const refUtc = Date.UTC(ref[0], ref[1], ref[2]);

    const nextYr = yr + 1;
    const nextRef = BS_TO_AD_REFERENCE[nextYr];
    const nextRefUtc = nextRef
      ? Date.UTC(nextRef[0], nextRef[1], nextRef[2])
      : refUtc + (BS_MONTH_DAYS[yr]?.reduce((a, b) => a + b, 0) || 365) * 86400000;

    if (targetUtc < refUtc && i === 0) {
      matchedYear = yr;
      break;
    }
    if (targetUtc >= refUtc && targetUtc < nextRefUtc) {
      matchedYear = yr;
      break;
    }
  }

  const ref = BS_TO_AD_REFERENCE[matchedYear] || BS_TO_AD_REFERENCE[2083];
  const refUtc = Date.UTC(ref[0], ref[1], ref[2]);
  let diffDays = Math.floor((targetUtc - refUtc) / 86400000);

  if (diffDays < 0) {
    diffDays = 0;
  }

  const monthDays = BS_MONTH_DAYS[matchedYear] || BS_MONTH_DAYS[2083];
  let bsMonth = 1;
  let bsDay = 1;

  for (let m = 0; m < 12; m++) {
    const daysInThisMonth = monthDays[m];
    if (diffDays < daysInThisMonth) {
      bsMonth = m + 1;
      bsDay = diffDays + 1;
      break;
    }
    diffDays -= daysInThisMonth;
    if (m === 11) {
      bsMonth = 12;
      bsDay = daysInThisMonth;
    }
  }

  return { bsYear: matchedYear, bsMonth, bsDay };
}

/**
 * Computes deterministic Vedic Panchang details for any given BS date
 */
export function getPanchangForDate(bsYear: number, bsMonth: number, bsDay: number, adDate: Date): PanchangInfo {
  // Deterministic seed based on day offset
  const seed = (bsYear * 365 + bsMonth * 30 + bsDay) % 360;
  const tithiIndex = (bsDay - 1) % 15;
  const isShukla = bsDay <= 15;
  const paksha: 'शुक्ल' | 'कृष्ण' = isShukla ? 'शुक्ल' : 'कृष्ण';
  const pakshaEn: 'Shukla' | 'Krishna' = isShukla ? 'Shukla' : 'Krishna';

  let tithiNe = TITHI_LIST[tithiIndex].ne;
  let tithiEn = TITHI_LIST[tithiIndex].en;

  const isPurnima = isShukla && bsDay === 15;
  const isAunshi = !isShukla && (bsDay === 30 || bsDay === 29);
  const isEkadashi = bsDay === 11 || bsDay === 26;

  if (isPurnima) {
    tithiNe = 'पूर्णिमा';
    tithiEn = 'Purnima';
  } else if (isAunshi) {
    tithiNe = 'औंशी (अमावस्या)';
    tithiEn = 'Aunshi (Amavasya)';
  }

  const nakshatraObj = NAKSHATRA_LIST[(seed * 3 + bsDay) % NAKSHATRA_LIST.length];
  const yoga = YOGA_LIST[(seed + bsDay * 2) % YOGA_LIST.length];
  const karana = KARANA_LIST[(seed + bsDay) % KARANA_LIST.length];

  const sunSign = RASHI_NAMES[(bsMonth - 1) % 12].ne;
  const moonSign = RASHI_NAMES[(seed + bsDay) % 12].ne;

  // Approximate sunrise & sunset for Kathmandu (Lat 27.7°N, Lon 85.3°E)
  const sunriseMinutes = 360 + Math.floor(Math.sin((bsMonth - 1) * (Math.PI / 6)) * 40);
  const sunsetMinutes = 1080 - Math.floor(Math.sin((bsMonth - 1) * (Math.PI / 6)) * 45);

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hrs >= 12 ? 'PM' : 'AM';
    const h12 = hrs > 12 ? hrs - 12 : (hrs === 0 ? 12 : hrs);
    return `${h12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const sunrise = formatTime(sunriseMinutes);
  const sunset = formatTime(sunsetMinutes);

  // Rahu Kaal by day of week
  const dayOfWeek = adDate.getUTCDay();
  const rahuKaalRanges = [
    '04:30 PM - 06:00 PM', // Sun
    '07:30 AM - 09:00 AM', // Mon
    '03:00 PM - 04:30 PM', // Tue
    '12:00 PM - 01:30 PM', // Wed
    '01:30 PM - 03:00 PM', // Thu
    '10:30 AM - 12:00 PM', // Fri
    '09:00 AM - 10:30 AM', // Sat
  ];

  return {
    tithi: `${tithiNe} (${paksha} पक्ष)`,
    tithiEn: `${tithiEn} (${pakshaEn} Paksha)`,
    paksha,
    pakshaEn,
    nakshatra: nakshatraObj.ne,
    nakshatraEn: nakshatraObj.en,
    yoga,
    karana,
    sunSign: `${sunSign} राशि`,
    moonSign: `${moonSign} राशि`,
    sunrise,
    sunset,
    abhijitMuhurat: '11:38 AM - 12:24 PM',
    brahmaMuhurat: '04:32 AM - 05:20 AM',
    rahuKaal: rahuKaalRanges[dayOfWeek] || '01:30 PM - 03:00 PM',
    yamaghanta: '07:15 AM - 08:45 AM',
    gulikaKaal: '08:45 AM - 10:15 AM',
    isPurnima,
    isAunshi,
    isEkadashi,
    isSankranti: bsDay === 1,
    sankrantiName: bsDay === 1 ? `${RASHI_NAMES[(bsMonth - 1) % 12].ne} सङ्क्रान्ति` : undefined
  };
}

/**
 * Generates all days of the month with Gregorian mapping and festivals
 */
export function generateCalendarDays(bsYear: number, bsMonth: number, userEvents: Record<string, number> = {}): CalendarDay[] {
  const daysInMonth = getNepaliMonthDays(bsYear, bsMonth);
  const days: CalendarDay[] = [];

  const today = new Date();
  const todayUtcMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  for (let d = 1; d <= daysInMonth; d++) {
    const adDate = convertBsToAd(bsYear, bsMonth, d);
    const dayOfWeek = adDate.getUTCDay(); // 0 is Sun, 6 is Sat
    const adYear = adDate.getUTCFullYear();
    const adMonth = adDate.getUTCMonth() + 1;
    const adDay = adDate.getUTCDate();

    const adTime = Date.UTC(adYear, adMonth - 1, adDay);
    const isToday = adTime === todayUtcMidnight;
    const isSaturday = dayOfWeek === 6;

    // Check festival catalog
    const festival = FESTIVALS_CATALOG.find(f => f.bsMonth === bsMonth && f.bsDay === d);
    const isPublicHoliday = isSaturday || (festival ? festival.isHoliday : false);

    const panchang = getPanchangForDate(bsYear, bsMonth, d, adDate);

    // Auspicious muhurat matching
    const muhurats = SAIT_MUHURAT_CATALOG
      .filter(m => (m.bsYear === undefined || m.bsYear === bsYear) && m.bsMonth === bsMonth && m.bsDay === d)
      .map(m => m.titleNe);

    const dateKey = `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const eventsCount = userEvents[dateKey] || 0;

    days.push({
      bsYear,
      bsMonth,
      bsDay: d,
      adDate,
      adYear,
      adMonth,
      adDay,
      dayOfWeek,
      isToday,
      isSaturday,
      isPublicHoliday,
      holidayTitleNe: festival?.isHoliday ? festival.nameNe : (isSaturday ? 'शनिबारीय बिदा' : undefined),
      holidayTitleEn: festival?.isHoliday ? festival.nameEn : (isSaturday ? 'Saturday Weekend' : undefined),
      festivalNe: festival?.nameNe,
      festivalEn: festival?.nameEn,
      panchang,
      auspiciousMuhurat: muhurats.length > 0 ? muhurats : undefined,
      eventsCount
    });
  }

  return days;
}

function bsDayString(d: number): string {
  return d < 10 ? `०${d}` : String(d);
}

/**
 * Calculates exact age in BS/AD years, months, days
 */
export function calculateAge(
  birthYear: number, birthMonth: number, birthDay: number,
  currentYear: number, currentMonth: number, currentDay: number
) {
  const isFuture =
    birthYear > currentYear ||
    (birthYear === currentYear && (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay > currentDay)));

  if (isFuture) {
    return { years: 0, months: 0, days: 0, totalDays: 0, isFuture: true };
  }

  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;
  let days = currentDay - birthDay;

  if (days < 0) {
    months -= 1;
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getNepaliMonthDays(prevYear, prevMonth);
    days += daysInPrevMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.max(0, years * 365 + months * 30 + days);

  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days), totalDays, isFuture: false };
}
