import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ArrowLeftRight,
  Sun,
  Sparkles,
  PartyPopper,
  BookmarkCheck,
  Globe,
  Clock,
  Printer
} from 'lucide-react';
import { toDevanagari } from '../utils/nepaliNumbers';
import { Language } from '../types/calendar';

interface HeaderProps {
  activeTab: 'calendar' | 'converter' | 'panchang' | 'festivals' | 'rashifal' | 'events';
  setActiveTab: (tab: 'calendar' | 'converter' | 'panchang' | 'festivals' | 'rashifal' | 'events') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onTodayClick: () => void;
  onPrintClick: () => void;
  todayBsString: { year: number; month: number; day: number; monthNameNe: string; monthNameEn: string; dayNe: string; dayEn: string };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onTodayClick,
  onPrintClick,
  todayBsString
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'calendar', labelNe: 'पात्रो', labelEn: 'Patro Calendar', icon: CalendarIcon },
    { id: 'converter', labelNe: 'मिति रूपान्तरण', labelEn: 'Date Converter', icon: ArrowLeftRight },
    { id: 'panchang', labelNe: 'पञ्चाङ्ग र साइत', labelEn: 'Panchang & Muhurat', icon: Sun },
    { id: 'festivals', labelNe: 'चाडपर्व र बिदा', labelEn: 'Festivals & Holidays', icon: PartyPopper },
    { id: 'rashifal', labelNe: 'दैनिक राशिफल', labelEn: 'Horoscope (Rashifal)', icon: Sparkles },
    { id: 'events', labelNe: 'रिमाइन्डर', labelEn: 'My Reminders', icon: BookmarkCheck },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#070235] text-white shadow-md border-b border-[#1e1b4b]">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('calendar')}>
            <div className="w-10 h-10 rounded-xl bg-[#bb0112] flex items-center justify-center shadow-lg shadow-red-950/40 text-white font-bold text-xl border border-red-400/30">
              🇳🇵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 font-headline">
                  <span>नेपाली पात्रो</span>
                  <span className="text-xs bg-[#1e1b4b] text-[#c4c1fb] px-2 py-0.5 rounded-full font-medium border border-[#312e81]">
                    {language === 'ne' ? toDevanagari(todayBsString.year) : todayBsString.year} BS
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Nepali Calendar System & Vedic Panchang
              </p>
            </div>
          </div>

          {/* Center Date & Live Clock Ticker */}
          <div className="hidden md:flex items-center bg-[#1e1b4b]/80 border border-indigo-900/50 rounded-xl px-4 py-1.5 gap-4 shadow-inner">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-white">
                {language === 'ne'
                  ? `${toDevanagari(todayBsString.year)} ${todayBsString.monthNameNe} ${toDevanagari(todayBsString.day)}, ${todayBsString.dayNe}`
                  : `${todayBsString.monthNameEn} ${todayBsString.day}, ${todayBsString.year} BS (${todayBsString.dayEn})`
                }
              </span>
            </div>
            <div className="h-4 w-px bg-indigo-700/60"></div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{time}</span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Today Button */}
            <button
              onClick={onTodayClick}
              className="bg-[#bb0112] hover:bg-[#a00110] text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
              title="Jump to Today's Date"
            >
              <span>{language === 'ne' ? 'आज' : 'Today'}</span>
            </button>

            {/* Print / Export Button */}
            <button
              onClick={onPrintClick}
              className="hidden lg:flex items-center gap-1.5 bg-[#1e1b4b] hover:bg-indigo-900 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-indigo-700/50 transition-colors"
              title="Print Monthly Calendar"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'प्रिन्ट' : 'Print'}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#1e1b4b] rounded-lg p-0.5 border border-indigo-800 text-xs">
              <button
                onClick={() => setLanguage('ne')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  language === 'ne'
                    ? 'bg-[#bb0112] text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                नेपाली
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  language === 'en'
                    ? 'bg-[#bb0112] text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar border-t border-indigo-900/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-[#070235] font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-[#1e1b4b]/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#bb0112]' : 'text-slate-400'}`} />
                <span>{language === 'ne' ? item.labelNe : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
