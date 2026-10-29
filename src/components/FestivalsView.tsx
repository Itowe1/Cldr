import React, { useState } from 'react';
import {
  PartyPopper,
  Search,
  Sparkles,
  Calendar,
  Flame,
  Award,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { FestivalItem, Language } from '../types/calendar';
import { FESTIVALS_CATALOG } from '../data/nepaliCalendarData';
import { toDevanagari, NEPALI_MONTHS } from '../utils/nepaliNumbers';

interface FestivalsViewProps {
  language: Language;
  todayBs: { year: number; month: number; day: number };
  onNavigateToMonth?: (month: number) => void;
}

export const FestivalsView: React.FC<FestivalsViewProps> = ({
  language,
  todayBs,
  onNavigateToMonth
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = all months

  // Major festivals for countdown spotlight
  const upcomingSpotlights = [
    { nameNe: 'बडा दशैं (विजया दशमी)', nameEn: 'Dashain (Vijaya Dashami)', month: 6, day: 24, icon: '🌸' },
    { nameNe: 'तिहार (लक्ष्मी पूजा तथा भाइटीका)', nameEn: 'Tihar (Deepawali & Bhai Tika)', month: 7, day: 14, icon: '🪔' },
    { nameNe: 'छठ पर्व (सूर्य उपासना)', nameEn: 'Chhath Puja', month: 7, day: 18, icon: '☀️' },
    { nameNe: 'माघे सङ्क्रान्ति', nameEn: 'Maghe Sankranti', month: 10, day: 1, icon: '🍯' },
    { nameNe: 'महाशिवरात्रि', nameEn: 'Maha Shivaratri', month: 11, day: 17, icon: '🔱' },
    { nameNe: 'फागु पूर्णिमा (होली)', nameEn: 'Fagu Purnima (Holi)', month: 11, day: 29, icon: '🎨' },
  ];

  const filteredFestivals = FESTIVALS_CATALOG.filter((f) => {
    // Search match
    const matchesSearch =
      f.nameNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.descriptionNe.toLowerCase().includes(searchQuery.toLowerCase());

    // Category match
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'holiday' ? f.isHoliday : f.category === selectedCategory);

    // Month match
    const matchesMonth = selectedMonth === 0 || f.bsMonth === selectedMonth;

    return matchesSearch && matchesCategory && matchesMonth;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#070235] via-[#1e1b4b] to-[#070235] text-white p-6 rounded-2xl shadow-md border border-[#1e1b4b]">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-600/30 border border-red-500/40 text-red-200 text-xs px-3 py-1 rounded-full font-medium mb-2">
            <PartyPopper className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ne' ? 'नेपाली चाडपर्व तथा उत्सवहरू' : 'Festivals of Nepal'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-headline">
            {language === 'ne' ? 'चाडपर्व तथा सार्वजनिक बिदाहरू' : 'Nepali Festivals & Gazetted Holidays'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {language === 'ne'
              ? 'दशैं, तिहार, छठ, ल्होसार, होली तथा राष्ट्रिय बिदाहरूको सम्पूर्ण आधिकारिक विवरण र सांस्कृतिक महत्त्व।'
              : 'Complete directory of national holidays, major festivals, and cultural traditions throughout the Bikram Sambat year.'
            }
          </p>
        </div>
      </div>

      {/* Spotlight: Major Festivals Cards */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#bb0112]" />
          <span>{language === 'ne' ? 'प्रमुख राष्ट्रिय चाडपर्वहरू' : 'Key National Celebrations'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {upcomingSpotlights.map((spot, i) => {
            const mInfo = NEPALI_MONTHS[spot.month - 1];
            return (
              <div
                key={i}
                onClick={() => onNavigateToMonth?.(spot.month)}
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#bb0112] transition flex flex-col justify-between cursor-pointer active:scale-95 group"
                title={language === 'ne' ? 'पात्रोमा यो महिना हेर्नुहोस्' : 'Click to view in Calendar'}
              >
                <div>
                  <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{spot.icon}</span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#bb0112]">
                    {language === 'ne' ? spot.nameNe : spot.nameEn}
                  </h4>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{language === 'ne' ? mInfo.nameNe : mInfo.shortEn}</span>
                  <span className="font-bold text-[#bb0112]">
                    {language === 'ne' ? toDevanagari(spot.day) : spot.day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Directory & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Search and Month Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ne' ? 'चाडपर्व वा बिदा खोज्नुहोस् (जस्तै: दशैं, तिहार, छठ...)' : 'Search festivals or holidays (e.g. Dashain, Tihar)...'}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#070235] focus:bg-white"
            />
          </div>

          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#070235]"
          >
            <option value={0}>{language === 'ne' ? 'सबै महिनाहरू (All Months)' : 'All Months'}</option>
            {NEPALI_MONTHS.map((m) => (
              <option key={m.bsMonth} value={m.bsMonth}>
                {m.nameNe} ({m.nameEn})
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          {[
            { id: 'all', labelNe: 'सबै (All)', labelEn: 'All' },
            { id: 'holiday', labelNe: 'सार्वजनिक बिदा मात्र', labelEn: 'Public Holidays Only' },
            { id: 'national', labelNe: 'राष्ट्रिय दिवस', labelEn: 'National Days' },
            { id: 'religious', labelNe: 'धार्मिक उत्सव', labelEn: 'Religious' },
            { id: 'cultural', labelNe: 'सांस्कृतिक चाड', labelEn: 'Cultural' },
            { id: 'women', labelNe: 'महिला पर्व', labelEn: 'Women Festivals' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-[#070235] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ne' ? cat.labelNe : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-500 font-medium">
          {language === 'ne'
            ? `फेला परेका चाडपर्व तथा बिदाहरू: ${toDevanagari(filteredFestivals.length)} वटा`
            : `Showing ${filteredFestivals.length} festivals & holidays`
          }
        </div>

        {/* Festivals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFestivals.map((f) => {
            const mInfo = NEPALI_MONTHS[f.bsMonth - 1];
            return (
              <div
                key={f.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {f.isHoliday ? (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-red-100 text-[#bb0112] px-2 py-0.5 rounded-md border border-red-200">
                            {language === 'ne' ? 'सार्वजनिक बिदा' : 'Public Holiday'}
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                            {f.category}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2">
                        {language === 'ne' ? f.nameNe : f.nameEn}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-[#bb0112] font-devanagari">
                        {mInfo.nameNe} {toDevanagari(f.bsDay)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {mInfo.shortEn} {f.bsDay}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {language === 'ne' ? f.descriptionNe : f.descriptionEn}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="italic truncate max-w-[80%]">{f.significance}</span>
                  {onNavigateToMonth && (
                    <button
                      onClick={() => onNavigateToMonth(f.bsMonth)}
                      className="text-xs font-semibold text-indigo-700 hover:underline shrink-0"
                    >
                      {language === 'ne' ? 'पात्रोमा हेर्नुहोस्' : 'View in Patro'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
