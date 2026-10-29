import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  CalendarDays,
  SunMedium,
  CheckSquare,
  Square
} from 'lucide-react';
import { CalendarDay, Language } from '../types/calendar';
import { toDevanagari, NEPALI_MONTHS, DAYS_OF_WEEK, GREGORIAN_MONTHS_SHORT } from '../utils/nepaliNumbers';

interface CalendarGridProps {
  currentBsYear: number;
  currentBsMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  calendarDays: CalendarDay[];
  onSelectDay: (day: CalendarDay) => void;
  selectedDay: CalendarDay | null;
  language: Language;
  filters: {
    showHolidays: boolean;
    showFestivals: boolean;
    showTithi: boolean;
    showEvents: boolean;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    showHolidays: boolean;
    showFestivals: boolean;
    showTithi: boolean;
    showEvents: boolean;
  }>>;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentBsYear,
  currentBsMonth,
  onPrevMonth,
  onNextMonth,
  onYearChange,
  onMonthChange,
  calendarDays,
  onSelectDay,
  selectedDay,
  language,
  filters,
  setFilters
}) => {
  const currentMonthInfo = NEPALI_MONTHS[currentBsMonth - 1];

  // Available BS years in data (2070 BS to 2090 BS)
  const availableYears = Array.from({ length: 21 }, (_, i) => 2070 + i);

  // Boundary checks
  const isAtMinMonth = currentBsYear === 2070 && currentBsMonth === 1;
  const isAtMaxMonth = currentBsYear === 2090 && currentBsMonth === 12;

  // Starting empty padding cells for day 1
  const startDayOfWeek = calendarDays[0]?.dayOfWeek ?? 0;
  const emptyPaddingCount = startDayOfWeek;

  // Gregorian range covered by this month
  const firstDayAd = calendarDays[0]?.adDate;
  const lastDayAd = calendarDays[calendarDays.length - 1]?.adDate;

  const gregorianRangeString = firstDayAd && lastDayAd
    ? `${GREGORIAN_MONTHS_SHORT[firstDayAd.getUTCMonth()]} ${firstDayAd.getUTCDate()} – ${GREGORIAN_MONTHS_SHORT[lastDayAd.getUTCMonth()]} ${lastDayAd.getUTCDate()}, ${lastDayAd.getUTCFullYear()}`
    : '';

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Month Navigator Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Main Month & Year Titles */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevMonth}
              disabled={isAtMinMonth}
              className={`p-2 sm:p-2.5 rounded-xl border border-slate-200 transition shadow-xs active:scale-95 ${
                isAtMinMonth
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-700'
              }`}
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#070235] font-headline">
                  {language === 'ne' ? currentMonthInfo.nameNe : currentMonthInfo.nameEn}
                </h2>
                <span className="text-xl sm:text-2xl font-semibold text-[#bb0112]">
                  {language === 'ne' ? toDevanagari(currentBsYear) : currentBsYear}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  (BS)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs sm:text-sm text-slate-600">
                <span className="font-medium text-slate-700">{gregorianRangeString}</span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-xs">
                  <SunMedium className="w-3 h-3 text-amber-600" />
                  {currentMonthInfo.season}
                </span>
              </div>
            </div>

            <button
              onClick={onNextMonth}
              disabled={isAtMaxMonth}
              className={`p-2 sm:p-2.5 rounded-xl border border-slate-200 transition shadow-xs active:scale-95 ml-auto sm:ml-0 ${
                isAtMaxMonth
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-700'
              }`}
              aria-label="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Year & Month Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Month Select */}
            <select
              value={currentBsMonth}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 shadow-xs focus:ring-2 focus:ring-[#070235] focus:outline-none"
            >
              {NEPALI_MONTHS.map((m) => (
                <option key={m.bsMonth} value={m.bsMonth}>
                  {language === 'ne' ? `${m.nameNe} (${toDevanagari(m.bsMonth)})` : `${m.nameEn} (${m.nameNe})`}
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={currentBsYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:ring-2 focus:ring-[#070235] focus:outline-none"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {language === 'ne' ? `${toDevanagari(yr)} (${yr} BS)` : `${yr} BS (${toDevanagari(yr)})`}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter Checkboxes Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'फिल्टरहरू:' : 'Filters:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <button
              onClick={() => toggleFilter('showHolidays')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium border ${
                filters.showHolidays
                  ? 'bg-red-50 text-[#bb0112] border-red-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filters.showHolidays ? <CheckSquare className="w-3.5 h-3.5 text-[#bb0112]" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              <span>{language === 'ne' ? 'सार्वजनिक बिदा' : 'Public Holidays'}</span>
            </button>

            <button
              onClick={() => toggleFilter('showFestivals')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium border ${
                filters.showFestivals
                  ? 'bg-indigo-50 text-[#070235] border-indigo-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filters.showFestivals ? <CheckSquare className="w-3.5 h-3.5 text-[#070235]" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              <span>{language === 'ne' ? 'चाडपर्व' : 'Festivals'}</span>
            </button>

            <button
              onClick={() => toggleFilter('showTithi')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium border ${
                filters.showTithi
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filters.showTithi ? <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              <span>{language === 'ne' ? 'तिथि / एकादशी / पूर्णिमा' : 'Tithi & Phases'}</span>
            </button>

            <button
              onClick={() => toggleFilter('showEvents')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium border ${
                filters.showEvents
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filters.showEvents ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
              <span>{language === 'ne' ? 'व्यक्तिगत रिमाइन्डर' : 'My Events'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Column Calendar Grid Matrix */}
      <div className="p-2 sm:p-4 md:p-6 bg-[#f7f9fb]">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {DAYS_OF_WEEK.map((day) => {
            const isSat = day.dayIndex === 6;
            return (
              <div
                key={day.dayIndex}
                className={`py-2 text-center rounded-lg font-semibold text-xs sm:text-sm tracking-wider uppercase transition ${
                  isSat
                    ? 'bg-red-50 text-[#bb0112] border border-red-200/60'
                    : 'bg-white text-[#070235] border border-slate-200/80 shadow-2xs'
                }`}
              >
                <span className="block font-bold">
                  {language === 'ne' ? day.nameNe : day.shortEn}
                </span>
                <span className="text-[10px] opacity-75 font-normal hidden sm:block">
                  {language === 'ne' ? day.shortEn : day.nameNe}
                </span>
              </div>
            );
          })}
        </div>

        {/* Date Cells Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty Padding Slots */}
          {Array.from({ length: emptyPaddingCount }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[75px] sm:min-h-[96px] md:min-h-[112px] bg-slate-100/50 rounded-xl border border-dashed border-slate-200 opacity-60"
            />
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day) => {
            const isSelected =
              selectedDay?.bsYear === day.bsYear &&
              selectedDay?.bsMonth === day.bsMonth &&
              selectedDay?.bsDay === day.bsDay;

            const isRedDay = day.isSaturday || (filters.showHolidays && day.isPublicHoliday);
            const hasFestival = filters.showFestivals && day.festivalNe;
            const hasLunarChip = filters.showTithi && (day.panchang.isPurnima || day.panchang.isAunshi || day.panchang.isEkadashi || day.panchang.isSankranti);
            const hasEvents = filters.showEvents && (day.eventsCount ?? 0) > 0;

            return (
              <div
                key={day.bsDay}
                onClick={() => onSelectDay(day)}
                className={`group relative flex flex-col justify-between p-1.5 sm:p-2.5 rounded-xl cursor-pointer transition-all duration-150 min-h-[75px] sm:min-h-[96px] md:min-h-[115px] select-none ${
                  day.isToday
                    ? 'bg-white ring-2 ring-[#bb0112] shadow-md z-10'
                    : isSelected
                    ? 'bg-indigo-50/90 ring-2 ring-[#070235] shadow-md z-10'
                    : 'bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Top Row: Dual Numbers (Large Devanagari BS & Small Gregorian AD) */}
                <div className="flex items-start justify-between">
                  {/* Bikram Sambat numeral (Bilingual) */}
                  <div className="flex flex-col">
                    <span
                      className={`text-lg sm:text-2xl md:text-3xl font-bold leading-none transition-colors ${
                        language === 'ne' ? 'font-devanagari' : 'font-sans'
                      } ${
                        day.isToday
                          ? 'text-[#bb0112]'
                          : isRedDay
                          ? 'text-[#bb0112]'
                          : 'text-[#070235] group-hover:text-indigo-950'
                      }`}
                    >
                      {language === 'ne' ? toDevanagari(day.bsDay) : day.bsDay}
                    </span>
                    {/* Bilingual secondary numeral */}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {language === 'ne' ? day.bsDay : toDevanagari(day.bsDay)}
                    </span>
                  </div>

                  {/* Gregorian (AD) Date */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 font-mono leading-none">
                      {GREGORIAN_MONTHS_SHORT[day.adMonth - 1]} {day.adDay}
                    </span>
                    {day.isToday && (
                      <span className="mt-0.5 text-[9px] bg-[#bb0112] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                        {language === 'ne' ? 'आज' : 'Today'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Content: Badges for Festivals, Holidays, Lunar Phases */}
                <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                  {/* Festival / Holiday Chip */}
                  {hasFestival && (
                    <div
                      className={`text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.5 rounded truncate ${
                        day.isPublicHoliday
                          ? 'bg-red-50 text-[#bb0112] border border-red-200/60'
                          : 'bg-indigo-50 text-[#070235] border border-indigo-100'
                      }`}
                      title={language === 'ne' ? day.festivalNe : day.festivalEn}
                    >
                      {language === 'ne' ? day.festivalNe : (day.festivalEn || day.festivalNe)}
                    </div>
                  )}

                  {/* Holiday title if not already shown via festival */}
                  {!hasFestival && day.isPublicHoliday && filters.showHolidays && !day.isSaturday && (
                    <div className="text-[9px] sm:text-[10px] font-semibold px-1 py-0.5 rounded bg-red-50 text-[#bb0112] truncate border border-red-200/60">
                      {language === 'ne' ? (day.holidayTitleNe || 'बिदा') : (day.holidayTitleEn || 'Holiday')}
                    </div>
                  )}

                  {/* Lunar Phase Badge (Purnima, Aunshi, Ekadashi, Sankranti) */}
                  {hasLunarChip && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {day.panchang.isPurnima && (
                        <span className="inline-flex items-center text-[9px] text-amber-800 bg-amber-100/80 px-1 py-0.2 rounded font-medium">
                          🌕 {language === 'ne' ? 'पूर्णिमा' : 'Purnima'}
                        </span>
                      )}
                      {day.panchang.isAunshi && (
                        <span className="inline-flex items-center text-[9px] text-slate-800 bg-slate-200 px-1 py-0.2 rounded font-medium">
                          🌑 {language === 'ne' ? 'औंशी' : 'Aunshi'}
                        </span>
                      )}
                      {day.panchang.isEkadashi && (
                        <span className="inline-flex items-center text-[9px] text-emerald-800 bg-emerald-100 px-1 py-0.2 rounded font-medium">
                          🌿 {language === 'ne' ? 'एकादशी' : 'Ekadashi'}
                        </span>
                      )}
                      {day.panchang.isSankranti && (
                        <span className="inline-flex items-center text-[9px] text-purple-800 bg-purple-100 px-1 py-0.2 rounded font-medium">
                          ☀️ {language === 'ne' ? 'सङ्क्रान्ति' : 'Sankranti'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Row: Tithi name and user event dot */}
                <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400">
                  <span className="truncate max-w-[80%] font-devanagari text-slate-500">
                    {language === 'ne' ? day.panchang.tithi.split(' ')[0] : day.panchang.tithiEn.split(' ')[0]}
                  </span>
                  
                  {hasEvents && (
                    <span className="flex items-center gap-0.5 text-emerald-600 font-bold" title={`${day.eventsCount} events`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[9px]">{day.eventsCount}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Bottom Legend & Summary */}
      <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span>{language === 'ne' ? 'सार्वजनिक बिदा / शनिबार' : 'Public Holiday / Saturday'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md ring-2 ring-[#bb0112] bg-white"></span>
            <span>{language === 'ne' ? 'आजको दिन (Today)' : 'Today'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🌕</span>
            <span>{language === 'ne' ? 'पूर्णिमा' : 'Purnima'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🌑</span>
            <span>{language === 'ne' ? 'औंशी' : 'Aunshi'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{language === 'ne' ? 'मेरो रिमाइन्डर' : 'My Event'}</span>
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          {language === 'ne'
            ? 'कुनै पनि दिनको पञ्चाङ्ग र शुभ साइत हेर्न मितिमा क्लिक गर्नुहोस्'
            : 'Click any date to view detailed Vedic Panchang, Tithi, & Muhurat'
          }
        </div>
      </div>
    </div>
  );
};
