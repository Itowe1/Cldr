import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Compass,
  Heart,
  Briefcase,
  Activity,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Language, RashiItem } from '../types/calendar';
import { RASHI_DATA } from '../data/nepaliCalendarData';
import { toDevanagari } from '../utils/nepaliNumbers';

interface RashifalViewProps {
  language: Language;
}

export const RashifalView: React.FC<RashifalViewProps> = ({ language }) => {
  const [selectedRashiId, setSelectedRashiId] = useState<string>('mesh');

  const selectedRashi = RASHI_DATA.find(r => r.id === selectedRashiId) || RASHI_DATA[0];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#070235] via-[#1e1b4b] to-[#070235] text-white p-6 rounded-2xl shadow-md border border-[#1e1b4b]">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs px-3 py-1 rounded-full font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ne' ? 'ज्योतिषीय भविष्यवाणी' : 'Daily Vedic Horoscope'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-headline">
            {language === 'ne' ? 'दैनिक राशिफल (Horoscope)' : 'Daily Rashifal & Astrological Insights'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {language === 'ne'
              ? '१२ वटै राशिको आजको दिनको शुभ फल, नामाक्षर, भाग्यशाली रङ्ग, अङ्क तथा पेशा र स्वास्थ्य विश्लेषण।'
              : 'Daily astrological forecasts for all 12 zodiac signs with auspicious numbers, colors, and planetary analysis.'
            }
          </p>
        </div>
      </div>

      {/* 12 Rashi Selection Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
        {RASHI_DATA.map((rashi) => {
          const isSelected = rashi.id === selectedRashiId;
          return (
            <button
              key={rashi.id}
              onClick={() => setSelectedRashiId(rashi.id)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${
                isSelected
                  ? 'bg-[#070235] text-white border-[#070235] shadow-md ring-2 ring-indigo-400'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <span className="text-2xl sm:text-3xl block leading-none">{rashi.symbol}</span>
              <span className="font-bold text-xs sm:text-sm block mt-1">
                {language === 'ne' ? rashi.nameNe : rashi.nameEn}
              </span>
              <span className={`text-[10px] block ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {language === 'ne' ? rashi.nameEn : rashi.nameNe}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Rashi Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Rashi Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-900 to-[#070235] text-white flex items-center justify-center text-3xl shadow-md border border-indigo-700">
              {selectedRashi.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#070235] font-headline">
                  {language === 'ne' ? `${selectedRashi.nameNe} राशि` : `${selectedRashi.nameEn} (${selectedRashi.nameNe})`}
                </h3>
                <span className="text-xs bg-indigo-50 text-indigo-900 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {selectedRashi.element}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ne' ? 'नामाक्षरहरू: ' : 'Letters: '}
                <span className="font-semibold text-slate-700">{selectedRashi.letters}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-[10px] text-amber-800 font-bold block uppercase">{language === 'ne' ? 'शुभ अङ्क' : 'Lucky No.'}</span>
              <span className="text-lg font-bold text-amber-900 font-devanagari">
                {toDevanagari(selectedRashi.luckyNumber)}
              </span>
            </div>

            <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">{language === 'ne' ? 'स्वामी ग्रह' : 'Ruler'}</span>
              <span className="text-sm font-bold text-[#070235] block">
                {selectedRashi.ruler}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Prediction Text */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {language === 'ne' ? 'आजको फलादेश (Today Horoscope)' : 'Daily Horoscope Forecast'}
          </h4>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm sm:text-base leading-relaxed">
            {language === 'ne' ? selectedRashi.dailyPredictionNe : selectedRashi.dailyPredictionEn}
          </div>
        </div>

        {/* Life Aspects Ratings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>{language === 'ne' ? 'पेशा तथा व्यवसाय' : 'Career & Business'}</span>
              </span>
              {renderStars(selectedRashi.careerRating)}
            </div>
            <span className="text-xs text-slate-500">
              {selectedRashi.careerRating >= 4
                ? (language === 'ne' ? 'अत्यन्त सकारात्मक र फलदायी' : 'Highly productive')
                : (language === 'ne' ? 'सामान्य एवं मध्यम फल' : 'Moderate progress')
              }
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{language === 'ne' ? 'प्रेम तथा सम्बन्ध' : 'Love & Family'}</span>
              </span>
              {renderStars(selectedRashi.loveRating)}
            </div>
            <span className="text-xs text-slate-500">
              {selectedRashi.loveRating >= 4
                ? (language === 'ne' ? 'पारिवारिक सुख र सद्भाव' : 'Loving & harmonious')
                : (language === 'ne' ? 'धैर्य राख्नु उपयुक्त' : 'Requires patience')
              }
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ne' ? 'स्वास्थ्य स्थिति' : 'Health & Vitality'}</span>
              </span>
              {renderStars(selectedRashi.healthRating)}
            </div>
            <span className="text-xs text-slate-500">
              {selectedRashi.healthRating >= 4
                ? (language === 'ne' ? 'स्फूर्ति र आरोग्य कायम' : 'Vibrant energy')
                : (language === 'ne' ? 'खानपानमा विशेष ध्यान दिनुहोस्' : 'Watch your diet')
              }
            </span>
          </div>
        </div>

        {/* Lucky Color & Advice */}
        <div className="p-4 bg-gradient-to-r from-amber-50/70 to-indigo-50/70 rounded-xl border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{language === 'ne' ? 'भाग्यशाली रङ्ग:' : 'Lucky Color:'}</span>
            <span className="font-semibold text-indigo-950 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              {selectedRashi.luckyColor}
            </span>
          </div>

          <div className="text-slate-600 italic">
            {language === 'ne'
              ? 'सकारात्मक सोचका साथ आफ्नो काममा अघि बढ्नुहोला।'
              : 'Approach your day with optimistic dedication.'
            }
          </div>
        </div>

      </div>

    </div>
  );
};
