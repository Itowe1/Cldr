import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Calendar,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Hourglass,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types/calendar';
import {
  convertBsToAd,
  convertAdToBs,
  getNepaliMonthDays,
  getPanchangForDate,
  calculateAge
} from '../utils/dateConverter';
import {
  toDevanagari,
  NEPALI_MONTHS,
  DAYS_OF_WEEK,
  GREGORIAN_MONTHS
} from '../utils/nepaliNumbers';

interface DateConverterProps {
  language: Language;
  todayBs: { year: number; month: number; day: number };
}

export const DateConverterModal: React.FC<DateConverterProps> = ({
  language,
  todayBs
}) => {
  // Mode: 'bs-to-ad' | 'ad-to-bs'
  const [conversionMode, setConversionMode] = useState<'bs-to-ad' | 'ad-to-bs'>('bs-to-ad');

  // BS Input state
  const [bsYear, setBsYear] = useState<number>(todayBs.year);
  const [bsMonth, setBsMonth] = useState<number>(todayBs.month);
  const [bsDay, setBsDay] = useState<number>(todayBs.day);

  // AD Input state
  const today = new Date();
  const [adYear, setAdYear] = useState<number>(today.getFullYear());
  const [adMonth, setAdMonth] = useState<number>(today.getMonth() + 1);
  const [adDay, setAdDay] = useState<number>(today.getDate());

  // Age Calculator toggle & state
  const [showAgeCalc, setShowAgeCalc] = useState(false);
  const [birthYear, setBirthYear] = useState<number>(2055);
  const [birthMonth, setBirthMonth] = useState<number>(1);
  const [birthDay, setBirthDay] = useState<number>(1);

  const [copied, setCopied] = useState(false);

  // Computed results based on current mode
  let resultAdDate: Date;
  let resultBsDate: { bsYear: number; bsMonth: number; bsDay: number };

  if (conversionMode === 'bs-to-ad') {
    resultAdDate = convertBsToAd(bsYear, bsMonth, bsDay);
    resultBsDate = { bsYear, bsMonth, bsDay };
  } else {
    const inputDate = new Date(Date.UTC(adYear, adMonth - 1, adDay));
    resultBsDate = convertAdToBs(inputDate);
    resultAdDate = inputDate;
  }

  const resultDayOfWeek = resultAdDate.getUTCDay();
  const dayInfo = DAYS_OF_WEEK[resultDayOfWeek];
  const panchang = getPanchangForDate(resultBsDate.bsYear, resultBsDate.bsMonth, resultBsDate.bsDay, resultAdDate);
  const monthInfo = NEPALI_MONTHS[resultBsDate.bsMonth - 1];

  // Maximum days for currently selected BS Month
  const maxBsDays = getNepaliMonthDays(bsYear, bsMonth);

  // Auto-clamp BS day when year or month changes
  useEffect(() => {
    const max = getNepaliMonthDays(bsYear, bsMonth);
    if (bsDay > max) {
      setBsDay(max);
    }
  }, [bsYear, bsMonth, bsDay]);

  // Auto-clamp AD day when year or month changes
  useEffect(() => {
    const max = new Date(Date.UTC(adYear, adMonth, 0)).getUTCDate();
    if (adDay > max) {
      setAdDay(max);
    }
  }, [adYear, adMonth, adDay]);

  // Swap direction
  const handleSwap = () => {
    if (conversionMode === 'bs-to-ad') {
      // Sync current converted AD to inputs
      setAdYear(resultAdDate.getUTCFullYear());
      setAdMonth(resultAdDate.getUTCMonth() + 1);
      setAdDay(resultAdDate.getUTCDate());
      setConversionMode('ad-to-bs');
    } else {
      // Sync current converted BS to inputs
      setBsYear(resultBsDate.bsYear);
      setBsMonth(resultBsDate.bsMonth);
      setBsDay(resultBsDate.bsDay);
      setConversionMode('bs-to-ad');
    }
  };

  const handleCopyResult = () => {
    const text = `${toDevanagari(resultBsDate.bsYear)} ${monthInfo.nameNe} ${toDevanagari(resultBsDate.bsDay)} BS = ${GREGORIAN_MONTHS[resultAdDate.getUTCMonth()]} ${resultAdDate.getUTCDate()}, ${resultAdDate.getUTCFullYear()} AD (${dayInfo.nameEn})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Age calculation output
  const ageResult = calculateAge(
    birthYear, birthMonth, birthDay,
    todayBs.year, todayBs.month, todayBs.day
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#070235] via-[#1e1b4b] to-[#070235] text-white p-6 rounded-2xl shadow-md border border-[#1e1b4b]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-600/30 border border-red-500/40 text-red-200 text-xs px-3 py-1 rounded-full font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ne' ? 'द्वि-दिशात्मक मिति रूपान्तरण' : 'Bidirectional Date Conversion'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline">
              {language === 'ne' ? 'नेपाली मिति रूपान्तरण (BS ↔ AD)' : 'Bikram Sambat ↔ Gregorian Converter'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {language === 'ne'
                ? 'विक्रम संवत् (BS) र इस्वी संवत् (AD) बीच सहज रूपान्तरण गर्नुहोस्। साथमा बार, तिथि, नक्षत्र र आयु गणना।'
                : 'Instantly convert any date between Nepali Bikram Sambat and Gregorian calendars with astronomical Panchang and age calculation.'
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBsYear(todayBs.year);
                setBsMonth(todayBs.month);
                setBsDay(todayBs.day);
                setAdYear(today.getFullYear());
                setAdMonth(today.getMonth() + 1);
                setAdDay(today.getDate());
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2 rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'आजमा फर्काउनुहोस्' : 'Reset to Today'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Side-by-Side Dual Converter Panels */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Panel A: Left Side (BS or AD depending on mode) */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            conversionMode === 'bs-to-ad'
              ? 'border-[#070235] bg-slate-50/70 shadow-xs'
              : 'border-slate-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#070235] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#bb0112]" />
                {conversionMode === 'bs-to-ad' ? 'विक्रम संवत् (BS) मिति' : 'इस्वी संवत् (AD) मिति'}
              </span>
              <span className="text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                {conversionMode === 'bs-to-ad' ? 'इनपुट (Input)' : 'नतिजा (Output)'}
              </span>
            </div>

            {conversionMode === 'bs-to-ad' ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* BS Year */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {language === 'ne' ? 'वर्ष (Year)' : 'Year'}
                  </label>
                  <select
                    value={bsYear}
                    onChange={(e) => setBsYear(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#070235]"
                  >
                    {Array.from({ length: 21 }, (_, i) => 2070 + i).map((y) => (
                      <option key={y} value={y}>
                        {language === 'ne' ? `${toDevanagari(y)} (${y})` : `${y} (${toDevanagari(y)})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BS Month */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {language === 'ne' ? 'महिना (Month)' : 'Month'}
                  </label>
                  <select
                    value={bsMonth}
                    onChange={(e) => setBsMonth(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#070235]"
                  >
                    {NEPALI_MONTHS.map((m) => (
                      <option key={m.bsMonth} value={m.bsMonth}>
                        {language === 'ne' ? `${m.nameNe} (${toDevanagari(m.bsMonth)})` : `${m.nameEn} (${m.nameNe})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BS Day */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {language === 'ne' ? 'गते (Day)' : 'Day'}
                  </label>
                  <select
                    value={bsDay}
                    onChange={(e) => setBsDay(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#070235]"
                  >
                    {Array.from({ length: maxBsDays }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {toDevanagari(i + 1)} ({i + 1})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              /* Converted BS Display */
              <div className="p-4 bg-indigo-50/70 border border-indigo-200/60 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-[#070235] font-devanagari">
                  {toDevanagari(resultBsDate.bsYear)} {monthInfo.nameNe} {toDevanagari(resultBsDate.bsDay)}
                </div>
                <div className="text-xs text-indigo-900 mt-1 font-medium">
                  {resultBsDate.bsYear} {monthInfo.nameEn} {resultBsDate.bsDay} BS • {dayInfo.nameNe}
                </div>
              </div>
            )}
          </div>

          {/* Center Swap Directional Button */}
          <div className="flex justify-center -my-3 md:my-0 md:absolute md:left-1/2 md:-translate-x-1/2 z-20">
            <button
              onClick={handleSwap}
              className="p-3.5 rounded-full bg-[#070235] hover:bg-[#bb0112] text-white shadow-lg transition-transform duration-200 active:scale-90 hover:rotate-180 border-2 border-white"
              title="Click to Swap Conversion Direction"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Panel B: Right Side (AD or BS depending on mode) */}
          <div className={`p-5 rounded-2xl border-2 transition-all ${
            conversionMode === 'ad-to-bs'
              ? 'border-[#070235] bg-slate-50/70 shadow-xs'
              : 'border-slate-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#070235] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-700" />
                {conversionMode === 'ad-to-bs' ? 'Gregorian (AD) Date' : 'इस्वी संवत् (AD) नतिजा'}
              </span>
              <span className="text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                {conversionMode === 'ad-to-bs' ? 'इनपुट (Input)' : 'नतिजा (Output)'}
              </span>
            </div>

            {conversionMode === 'ad-to-bs' ? (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* AD Year */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Year (AD)
                  </label>
                  <input
                    type="number"
                    min="2015"
                    max="2035"
                    value={adYear}
                    onChange={(e) => setAdYear(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#070235]"
                  />
                </div>

                {/* AD Month */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Month
                  </label>
                  <select
                    value={adMonth}
                    onChange={(e) => setAdMonth(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#070235]"
                  >
                    {GREGORIAN_MONTHS.map((m, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AD Day */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={adDay}
                    onChange={(e) => setAdDay(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#070235]"
                  />
                </div>
              </div>
            ) : (
              /* Converted AD Display */
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-[#070235]">
                  {GREGORIAN_MONTHS[resultAdDate.getUTCMonth()]} {resultAdDate.getUTCDate()}, {resultAdDate.getUTCFullYear()}
                </div>
                <div className="text-xs text-slate-600 mt-1 font-medium">
                  {dayInfo.nameEn} ({dayInfo.nameNe}) • ISO: {resultAdDate.toISOString().split('T')[0]}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Detailed Conversion Summary Card */}
        <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-indigo-50/70 via-white to-amber-50/70 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block">
              {language === 'ne' ? 'पूर्ण मिति तथा पञ्चाङ्ग विवरण:' : 'Complete Date & Astrological Summary:'}
            </span>
            <div className="text-base sm:text-lg font-bold text-[#070235]">
              {toDevanagari(resultBsDate.bsYear)} {monthInfo.nameNe} {toDevanagari(resultBsDate.bsDay)}, {dayInfo.nameNe}
            </div>
            <div className="text-xs text-slate-600 flex flex-wrap gap-2">
              <span className="font-semibold text-amber-800">{panchang.tithi}</span>
              <span>•</span>
              <span className="text-slate-700">{panchang.nakshatra} नक्षत्र</span>
              <span>•</span>
              <span className="text-slate-700">{panchang.sunSign}</span>
            </div>
          </div>

          <button
            onClick={handleCopyResult}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs transition flex items-center gap-1.5 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? (language === 'ne' ? 'कपी गरियो!' : 'Copied!') : (language === 'ne' ? 'नतिजा कपी गर्नुहोस्' : 'Copy Output')}</span>
          </button>
        </div>

        {/* Quick Date Presets Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block mb-2">
            {language === 'ne' ? 'द्रुत मिति चयन (Quick Presets):' : 'Quick Presets:'}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setConversionMode('bs-to-ad');
                setBsYear(todayBs.year);
                setBsMonth(todayBs.month);
                setBsDay(todayBs.day);
              }}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              {language === 'ne' ? 'आज (Today)' : 'Today'}
            </button>
            <button
              onClick={() => {
                setConversionMode('bs-to-ad');
                setBsYear(todayBs.year);
                setBsMonth(1);
                setBsDay(1);
              }}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              {language === 'ne' ? `नयाँ वर्ष ${toDevanagari(todayBs.year)}` : `New Year ${todayBs.year}`}
            </button>
            <button
              onClick={() => {
                setConversionMode('bs-to-ad');
                setBsYear(todayBs.year);
                setBsMonth(6);
                setBsDay(3);
              }}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              {language === 'ne' ? 'संविधान दिवस' : 'Constitution Day'}
            </button>
            <button
              onClick={() => {
                setConversionMode('bs-to-ad');
                setBsYear(todayBs.year);
                setBsMonth(6);
                setBsDay(24);
              }}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              {language === 'ne' ? 'विजया दशमी' : 'Dashain'}
            </button>
            <button
              onClick={() => {
                setConversionMode('bs-to-ad');
                setBsYear(todayBs.year);
                setBsMonth(7);
                setBsDay(14);
              }}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              {language === 'ne' ? 'भाइटीका' : 'Bhai Tika'}
            </button>
            <button
              onClick={() => {
                setConversionMode('bs-to-ad');
                setBsYear(todayBs.year);
                setBsMonth(10);
                setBsDay(1);
              }}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              {language === 'ne' ? 'माघे सङ्क्रान्ति' : 'Maghe Sankranti'}
            </button>
          </div>
        </div>

      </div>

      {/* Age & Day Counter Calculator Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-[#070235] font-headline">
              {language === 'ne' ? 'उमेर तथा दिन गणना यन्त्र (Age & Duration Calculator)' : 'Age & Duration Calculator'}
            </h3>
          </div>

          <button
            onClick={() => setShowAgeCalc(!showAgeCalc)}
            className="text-xs font-semibold text-[#070235] hover:text-[#bb0112] bg-slate-100 px-3 py-1.5 rounded-lg transition"
          >
            {showAgeCalc ? (language === 'ne' ? 'लुकाउनुहोस्' : 'Hide') : (language === 'ne' ? 'खोल्नुहोस्' : 'Calculate Age')}
          </button>
        </div>

        {showAgeCalc && (
          <div className="pt-2 space-y-4">
            <p className="text-xs text-slate-600">
              {language === 'ne'
                ? 'आफ्नो जन्म मिति (विक्रम संवत्) राख्नुहोस् र आजको दिनसम्मको पूर्ण उमेर थाहा पाउनुहोस्:'
                : 'Enter your Bikram Sambat date of birth to calculate exact age in years, months, and days:'
              }
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  जन्म वर्ष (BS)
                </label>
                <input
                  type="number"
                  min="2010"
                  max={todayBs.year}
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  जन्म महिना
                </label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none"
                >
                  {NEPALI_MONTHS.map((m) => (
                    <option key={m.bsMonth} value={m.bsMonth}>
                      {m.nameNe} ({m.bsMonth})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  जन्म गते
                </label>
                <input
                  type="number"
                  min="1"
                  max="32"
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Age output box */}
            {ageResult.isFuture ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-800 font-semibold">
                ⚠️ {language === 'ne' ? 'जन्म मिति वर्तमान मितिभन्दा पछिको (भविष्यको) हुन सक्दैन।' : 'Birth date cannot be in the future.'}
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-900 block font-devanagari">
                    {language === 'ne' ? toDevanagari(ageResult.years) : ageResult.years}
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">{language === 'ne' ? 'वर्ष (Years)' : 'Years'}</span>
                </div>

                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-900 block font-devanagari">
                    {language === 'ne' ? toDevanagari(ageResult.months) : ageResult.months}
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">{language === 'ne' ? 'महिना (Months)' : 'Months'}</span>
                </div>

                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-900 block font-devanagari">
                    {language === 'ne' ? toDevanagari(ageResult.days) : ageResult.days}
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">{language === 'ne' ? 'दिन (Days)' : 'Days'}</span>
                </div>

                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-900 block font-devanagari">
                    {language === 'ne' ? toDevanagari(ageResult.totalDays) : ageResult.totalDays}
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">{language === 'ne' ? 'कुल दिनहरू' : 'Total Days'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
