export type Language = 'ne' | 'en';

export interface NepaliMonthInfo {
  bsMonth: number; // 1 - 12 (1: Baisakh)
  nameNe: string;
  nameEn: string;
  adEquivalentNe: string;
  adEquivalentEn: string;
  daysCount: number;
}

export interface PanchangInfo {
  tithi: string;
  tithiEn: string;
  paksha: 'शुक्ल' | 'कृष्ण';
  pakshaEn: 'Shukla' | 'Krishna';
  nakshatra: string;
  nakshatraEn: string;
  yoga: string;
  karana: string;
  sunSign: string;
  moonSign: string;
  sunrise: string;
  sunset: string;
  moonrise?: string;
  moonset?: string;
  abhijitMuhurat: string;
  brahmaMuhurat: string;
  rahuKaal: string;
  yamaghanta: string;
  gulikaKaal: string;
  isPurnima?: boolean;
  isAunshi?: boolean;
  isEkadashi?: boolean;
  isSankranti?: boolean;
  sankrantiName?: string;
}

export interface CalendarDay {
  bsYear: number;
  bsMonth: number;
  bsDay: number;
  adDate: Date;
  adYear: number;
  adMonth: number; // 1-12
  adDay: number;
  dayOfWeek: number; // 0: Sunday, 6: Saturday
  isToday: boolean;
  isSaturday: boolean;
  isPublicHoliday: boolean;
  holidayTitleNe?: string;
  holidayTitleEn?: string;
  festivalNe?: string;
  festivalEn?: string;
  panchang: PanchangInfo;
  auspiciousMuhurat?: string[];
  eventsCount?: number;
}

export interface FestivalItem {
  id: string;
  nameNe: string;
  nameEn: string;
  bsMonth: number;
  bsDay: number;
  bsYear?: number;
  category: 'national' | 'cultural' | 'religious' | 'women' | 'jayanti';
  isHoliday: boolean;
  descriptionNe: string;
  descriptionEn: string;
  significance: string;
}

export interface SaitMuhuratItem {
  id: string;
  type: 'wedding' | 'bratabandha' | 'pasni' | 'griha_prabesh' | 'vehicle';
  titleNe: string;
  titleEn: string;
  bsYear?: number;
  bsMonth?: number;
  bsDay?: number;
  bsDate: string;
  adDate: string;
  timeRange: string;
  descriptionNe: string;
  descriptionEn: string;
}

export interface RashiItem {
  id: string;
  nameNe: string;
  nameEn: string;
  symbol: string;
  letters: string;
  element: string;
  ruler: string;
  dailyPredictionNe: string;
  dailyPredictionEn: string;
  luckyNumber: number;
  luckyColor: string;
  careerRating: number; // 1 - 5
  loveRating: number;   // 1 - 5
  healthRating: number; // 1 - 5
}

export interface UserEvent {
  id: string;
  title: string;
  category: 'festival' | 'birthday' | 'meeting' | 'puja' | 'fasting' | 'personal';
  bsDateString: string; // "2083-07-15"
  adDateString: string; // "2026-10-31"
  time?: string;
  description?: string;
  completed?: boolean;
  createdAt: number;
}
