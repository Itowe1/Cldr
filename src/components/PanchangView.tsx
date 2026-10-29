import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Heart,
  Home,
  Car,
  Award,
  Calendar,
  AlertTriangle,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { Language, SaitMuhuratItem } from '../types/calendar';
import { SAIT_MUHURAT_CATALOG } from '../data/nepaliCalendarData';
import { getPanchangForDate, convertBsToAd } from '../utils/dateConverter';
import { toDevanagari, NEPALI_MONTHS, DAYS_OF_WEEK } from '../utils/nepaliNumbers';

interface PanchangViewProps {
  language: Language;
  todayBs: { year: number; month: number; day: number };
}

export const PanchangView: React.FC<PanchangViewProps> = ({
  language,
  todayBs
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const todayAd = convertBsToAd(todayBs.year, todayBs.month, todayBs.day);
  const panchang = getPanchangForDate(todayBs.year, todayBs.month, todayBs.day, todayAd);
  const currentMonthInfo = NEPALI_MONTHS[todayBs.month - 1];
  const dayOfWeekInfo = DAYS_OF_WEEK[todayAd.getUTCDay()];

  const filteredMuhurats = selectedCategory === 'all'
    ? SAIT_MUHURAT_CATALOG
    : SAIT_MUHURAT_CATALOG.filter(m => m.type === selectedCategory);

  const categories = [
    { id: 'all', labelNe: 'सबै साइतहरू', labelEn: 'All Muhurats', icon: Sparkles },
    { id: 'wedding', labelNe: 'विवाह साइत', labelEn: 'Wedding', icon: Heart },
    { id: 'bratabandha', labelNe: 'व्रतबन्ध', labelEn: 'Bratabandha', icon: Award },
    { id: 'pasni', labelNe: 'पास्नी (अन्नप्राशन)', labelEn: 'Pasni', icon: Sparkles },
    { id: 'griha_prabesh', labelNe: 'गृह प्रवेश', labelEn: 'Griha Prabesh', icon: Home },
    { id: 'vehicle', labelNe: 'सवारी खरिद', labelEn: 'Vehicle Buy', icon: Car },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#070235] via-[#1e1b4b] to-[#070235] text-white p-6 rounded-2xl shadow-md border border-[#1e1b4b]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs px-3 py-1 rounded-full font-medium mb-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ne' ? 'वैदिक ज्योतिष तथा पञ्चाङ्ग' : 'Vedic Panchang & Muhurat'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline">
              {language === 'ne' ? 'दैनिक पञ्चाङ्ग र शुभ साइत' : 'Daily Vedic Panchang & Auspicious Muhurats'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {language === 'ne'
                ? `आजको मिति: ${toDevanagari(todayBs.year)} ${currentMonthInfo.nameNe} ${toDevanagari(todayBs.day)}, ${dayOfWeekInfo.nameNe}`
                : `Today: ${currentMonthInfo.nameEn} ${todayBs.day}, ${todayBs.year} BS (${dayOfWeekInfo.nameEn})`
              }
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
              {language === 'ne' ? 'वर्तमान तिथि' : 'Active Tithi'}
            </span>
            <span className="text-base sm:text-lg font-bold text-white font-devanagari block mt-0.5">
              {language === 'ne' ? panchang.tithi : panchang.tithiEn}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Section 1: Today's Full Panchang Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-[#070235] mb-4 flex items-center gap-2 font-headline">
          <Compass className="w-5 h-5 text-indigo-700" />
          <span>{language === 'ne' ? 'आजको सम्पूर्ण वैदिक पञ्चाङ्ग विवरण' : 'Today Vedic Ephemeris & Elements'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">{language === 'ne' ? 'तिथि (Tithi)' : 'Tithi'}</span>
            <span className="text-base font-bold text-[#070235] mt-1 block font-devanagari">
              {language === 'ne' ? panchang.tithi : panchang.tithiEn}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">{panchang.paksha} पक्ष</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">{language === 'ne' ? 'नक्षत्र (Nakshatra)' : 'Nakshatra'}</span>
            <span className="text-base font-bold text-slate-900 mt-1 block font-devanagari">
              {language === 'ne' ? panchang.nakshatra : panchang.nakshatraEn}
            </span>
            <span className="text-[11px] text-slate-500">२७ नक्षत्र मध्ये</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">{language === 'ne' ? 'योग (Yoga)' : 'Yoga'}</span>
            <span className="text-base font-bold text-slate-900 mt-1 block font-devanagari">
              {panchang.yoga}
            </span>
            <span className="text-[11px] text-slate-500">शुभ फलदायी योग</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">{language === 'ne' ? 'करण (Karana)' : 'Karana'}</span>
            <span className="text-base font-bold text-slate-900 mt-1 block font-devanagari">
              {panchang.karana}
            </span>
            <span className="text-[11px] text-slate-500">तिथि-अर्ध भाग</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">{language === 'ne' ? 'सूर्य राशि (Sun Sign)' : 'Sun Sign'}</span>
            <span className="text-base font-bold text-[#070235] mt-1 block">
              {panchang.sunSign}
            </span>
            <span className="text-[11px] text-slate-500">सौर मास गोचर</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">{language === 'ne' ? 'चन्द्र राशि (Moon Sign)' : 'Moon Sign'}</span>
            <span className="text-base font-bold text-[#070235] mt-1 block">
              {panchang.moonSign}
            </span>
            <span className="text-[11px] text-slate-500">दैनिक नामराशि</span>
          </div>

          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl">
            <span className="text-xs text-amber-900 block font-semibold">{language === 'ne' ? 'सूर्योदय (Sunrise)' : 'Sunrise'}</span>
            <span className="text-base font-bold text-slate-900 mt-1 block font-mono">
              {panchang.sunrise}
            </span>
            <span className="text-[11px] text-amber-700">काठमाडौं समय</span>
          </div>

          <div className="p-3.5 bg-orange-50/80 border border-orange-200 rounded-xl">
            <span className="text-xs text-orange-900 block font-semibold">{language === 'ne' ? 'सूर्यास्त (Sunset)' : 'Sunset'}</span>
            <span className="text-base font-bold text-slate-900 mt-1 block font-mono">
              {panchang.sunset}
            </span>
            <span className="text-[11px] text-orange-700">काठमाडौं समय</span>
          </div>
        </div>

        {/* Timings: Auspicious vs Inauspicious Sub-blocks */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Auspicious Timings */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ne' ? 'शुभ समय तथा मुहूर्त (Auspicious Timings)' : 'Auspicious Muhurats'}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="font-semibold text-slate-800">{language === 'ne' ? 'अभिजित मुहूर्त' : 'Abhijit Muhurat'}</span>
                <span className="font-mono font-bold text-emerald-700">{panchang.abhijitMuhurat}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="font-semibold text-slate-800">{language === 'ne' ? 'ब्रह्म मुहूर्त' : 'Brahma Muhurat'}</span>
                <span className="font-mono font-bold text-emerald-700">{panchang.brahmaMuhurat}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100">
                <span className="font-semibold text-slate-800">{language === 'ne' ? 'अमृत काल' : 'Amrit Kaal'}</span>
                <span className="font-mono font-bold text-emerald-700">०२:१५ PM - ०३:४८ PM</span>
              </div>
            </div>
          </div>

          {/* Inauspicious Timings */}
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>{language === 'ne' ? 'अशुभ समय (वर्जित काल)' : 'Inauspicious Timings'}</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-red-100">
                <span className="font-semibold text-slate-800">{language === 'ne' ? 'राहु काल (Rahu Kaal)' : 'Rahu Kaal'}</span>
                <span className="font-mono font-bold text-red-700">{panchang.rahuKaal}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-red-100">
                <span className="font-semibold text-slate-800">{language === 'ne' ? 'यमघण्ट (Yamaghanta)' : 'Yamaghanta'}</span>
                <span className="font-mono font-bold text-red-700">{panchang.yamaghanta}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-red-100">
                <span className="font-semibold text-slate-800">{language === 'ne' ? 'गुलिक काल (Gulika Kaal)' : 'Gulika Kaal'}</span>
                <span className="font-mono font-bold text-red-700">{panchang.gulikaKaal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section 2: Auspicious Muhurats & Sait Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#070235] font-headline">
              {language === 'ne' ? 'वार्षिक शुभ साइतहरू (लग्न तथा मुहूर्त)' : 'Auspicious Sait Directory (Wedding, Thread, House)'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ne'
                ? 'विवाह, व्रतबन्ध, अन्नप्राशन, गृहप्रवेश तथा नयाँ सवारी साधन खरिदका लागि प्रमाणित शुभ साइतहरू'
                : 'Approved astrological timings for marriages, thread ceremonies, housewarmings, and purchases'
              }
            </p>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-[#070235] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{language === 'ne' ? cat.labelNe : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Muhurat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMuhurats.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    {m.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">
                    {language === 'ne' ? m.titleNe : m.titleEn}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#bb0112] block">
                    {m.bsDate}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {m.adDate}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold">{m.timeRange}</span>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                {language === 'ne' ? m.descriptionNe : m.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
