import React from 'react';
import {
  Calendar,
  Sparkles,
  Sun,
  Moon,
  Clock,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { CalendarDay, Language } from '../types/calendar';
import { toDevanagari, NEPALI_MONTHS } from '../utils/nepaliNumbers';

interface MonthlySummaryCardProps {
  currentBsYear: number;
  currentBsMonth: number;
  calendarDays: CalendarDay[];
  language: Language;
  onOpenConverter: () => void;
  onOpenPanchang: () => void;
  onSelectDay: (day: CalendarDay) => void;
}

export const MonthlySummaryCard: React.FC<MonthlySummaryCardProps> = ({
  currentBsYear,
  currentBsMonth,
  calendarDays,
  language,
  onOpenConverter,
  onOpenPanchang,
  onSelectDay
}) => {
  const monthInfo = NEPALI_MONTHS[currentBsMonth - 1];
  const totalDays = calendarDays.length;
  const holidays = calendarDays.filter(d => d.isPublicHoliday);
  const festivals = calendarDays.filter(d => d.festivalNe);
  const weddingDays = calendarDays.filter(d => d.auspiciousMuhurat && d.auspiciousMuhurat.length > 0);

  // Today if present in this month
  const todayDay = calendarDays.find(d => d.isToday);

  return (
    <div className="space-y-4">
      
      {/* Today Spotlight Widget (if today is in this month or quick banner) */}
      {todayDay && (
        <div className="bg-gradient-to-br from-[#070235] to-[#1e1b4b] text-white p-5 rounded-2xl shadow-sm border border-indigo-900">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-[#bb0112] text-white px-2 py-0.5 rounded-full">
              {language === 'ne' ? 'आजको दिन' : 'Today'}
            </span>
            <span className="text-xs text-amber-300 font-mono">
              {todayDay.panchang.sunrise} ☀️
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-bold text-white">
              {language === 'ne' ? toDevanagari(todayDay.bsDay) : todayDay.bsDay}
            </span>
            <div>
              <div className="text-sm font-bold text-slate-100">
                {language === 'ne' ? `${monthInfo.nameNe} ${toDevanagari(todayDay.bsYear)}` : `${monthInfo.nameEn} ${todayDay.bsYear} BS`}
              </div>
              <div className="text-[11px] text-indigo-200">
                {language === 'ne' ? todayDay.panchang.tithi : todayDay.panchang.tithiEn}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-indigo-800/80 flex items-center justify-between text-xs">
            <span className="text-indigo-200 text-[11px] truncate">
              {language === 'ne' ? todayDay.panchang.nakshatra : todayDay.panchang.nakshatraEn} • {todayDay.panchang.sunSign}
            </span>
            <button
              onClick={() => onSelectDay(todayDay)}
              className="text-amber-300 hover:text-white font-semibold text-[11px] flex items-center gap-1 transition"
            >
              <span>{language === 'ne' ? 'विस्तृत' : 'Details'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Monthly Statistics Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-[#070235] mb-3 flex items-center gap-2 font-headline">
          <TrendingUp className="w-4 h-4 text-indigo-700" />
          <span>{language === 'ne' ? `${monthInfo.nameNe} महिनाको सारांश` : `${monthInfo.nameEn} Overview`}</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 block uppercase font-medium">{language === 'ne' ? 'कुल दिन' : 'Total Days'}</span>
            <span className="text-lg font-bold text-[#070235] mt-0.5 block">
              {language === 'ne' ? toDevanagari(totalDays) : totalDays}
            </span>
          </div>

          <div className="p-2.5 bg-red-50/70 rounded-xl border border-red-200/60">
            <span className="text-[10px] text-red-800 block uppercase font-medium">{language === 'ne' ? 'बिदाहरू' : 'Holidays'}</span>
            <span className="text-lg font-bold text-[#bb0112] mt-0.5 block">
              {language === 'ne' ? toDevanagari(holidays.length) : holidays.length}
            </span>
          </div>

          <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-200/60">
            <span className="text-[10px] text-indigo-800 block uppercase font-medium">{language === 'ne' ? 'चाडपर्व' : 'Festivals'}</span>
            <span className="text-lg font-bold text-indigo-950 mt-0.5 block">
              {language === 'ne' ? toDevanagari(festivals.length) : festivals.length}
            </span>
          </div>

          <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60">
            <span className="text-[10px] text-emerald-800 block uppercase font-medium">{language === 'ne' ? 'शुभ साइत' : 'Muhurats'}</span>
            <span className="text-lg font-bold text-emerald-900 mt-0.5 block">
              {language === 'ne' ? toDevanagari(weddingDays.length) : weddingDays.length}
            </span>
          </div>
        </div>

        {/* List of Key Festivals in this Month */}
        {festivals.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              {language === 'ne' ? 'यस महिनाका मुख्य चाडपर्व:' : 'Major Events this Month:'}
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {festivals.map((fDay) => (
                <div
                  key={fDay.bsDay}
                  onClick={() => onSelectDay(fDay)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-indigo-50/80 cursor-pointer text-xs transition border border-transparent hover:border-indigo-100"
                >
                  <span className="truncate font-semibold text-slate-800 max-w-[70%]">
                    {language === 'ne' ? fDay.festivalNe : (fDay.festivalEn || fDay.festivalNe)}
                  </span>
                  <span className="font-bold text-[#bb0112] shrink-0">
                    {language === 'ne' ? `${toDevanagari(fDay.bsDay)} गते` : `Day ${fDay.bsDay}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vedic Subhashita / Cultural Blessing */}
      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === 'ne' ? 'संस्कृत सुभाषित एवं सद्वाक्य' : 'Vedic Blessing'}</span>
        </div>
        <p className="font-devanagari italic text-[13px] leading-relaxed text-amber-900 font-medium">
          “सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥”
        </p>
        <p className="text-[10px] text-amber-700">
          {language === 'ne'
            ? 'सबै सुखी होऊन्, सबै निरोगी होऊन्, सबैले कल्याणकारी कुरा देख्न पाऊन्, कोही पनि दुःखी नहोस्।'
            : 'May all beings be happy, may all be free from illness, may all see what is auspicious, may no one suffer.'
          }
        </p>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenConverter}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left shadow-2xs hover:border-[#070235] transition"
        >
          <span className="text-xs font-bold text-[#070235] block">
            {language === 'ne' ? 'मिति रूपान्तरण' : 'Date Converter'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            BS ↔ AD Convert
          </span>
        </button>

        <button
          onClick={onOpenPanchang}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left shadow-2xs hover:border-[#070235] transition"
        >
          <span className="text-xs font-bold text-[#070235] block">
            {language === 'ne' ? 'पञ्चाङ्ग र साइत' : 'Panchang'}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Tithi & Muhurat
          </span>
        </button>
      </div>

    </div>
  );
};
