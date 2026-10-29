import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CalendarGrid } from './components/CalendarGrid';
import { DayDetailModal } from './components/DayDetailModal';
import { DateConverterModal } from './components/DateConverterModal';
import { PanchangView } from './components/PanchangView';
import { FestivalsView } from './components/FestivalsView';
import { RashifalView } from './components/RashifalView';
import { EventsView } from './components/EventsView';
import { MonthlySummaryCard } from './components/MonthlySummaryCard';
import { CalendarDay, Language, UserEvent } from './types/calendar';
import { convertAdToBs, generateCalendarDays } from './utils/dateConverter';
import { NEPALI_MONTHS, DAYS_OF_WEEK } from './utils/nepaliNumbers';

// Default starter seed events
const DEFAULT_EVENTS: UserEvent[] = [
  {
    id: 'evt-1',
    title: 'दीपावली (लक्ष्मी पूजा) विशेष पारिवारिक जमघट',
    category: 'festival',
    bsDateString: '2083-07-12',
    adDateString: '2026-10-28',
    time: '18:30',
    description: 'घरमा दियो बाल्ने र महालक्ष्मीको सामूहिक आराधना।',
    completed: false,
    createdAt: Date.now() - 100000
  },
  {
    id: 'evt-2',
    title: 'आमाबुबाको स्वास्थ्य परीक्षण भेट',
    category: 'personal',
    bsDateString: '2083-07-16',
    adDateString: '2026-11-01',
    time: '10:00',
    description: 'नियमित स्वास्थ्य जाँच तथा डाक्टर परामर्श।',
    completed: false,
    createdAt: Date.now() - 50000
  }
];

export default function App() {
  const [language, setLanguage] = useState<Language>('ne');
  const [activeTab, setActiveTab] = useState<'calendar' | 'converter' | 'panchang' | 'festivals' | 'rashifal' | 'events'>('calendar');

  // Compute Today's BS date based on current real-time
  const todayBs = useMemo(() => {
    return convertAdToBs(new Date());
  }, []);

  const [currentBsYear, setCurrentBsYear] = useState<number>(todayBs.bsYear);
  const [currentBsMonth, setCurrentBsMonth] = useState<number>(todayBs.bsMonth);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  // Filters state
  const [filters, setFilters] = useState({
    showHolidays: true,
    showFestivals: true,
    showTithi: true,
    showEvents: true
  });

  // User events state persisted in localStorage
  const [userEvents, setUserEvents] = useState<UserEvent[]>(() => {
    try {
      const saved = localStorage.getItem('nepali_calendar_events');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_EVENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('nepali_calendar_events', JSON.stringify(userEvents));
    } catch {
      // handle error
    }
  }, [userEvents]);

  // Map of event counts by date key ("YYYY-MM-DD")
  const eventsCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const evt of userEvents) {
      map[evt.bsDateString] = (map[evt.bsDateString] || 0) + 1;
    }
    return map;
  }, [userEvents]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentBsYear, currentBsMonth, eventsCountMap);
  }, [currentBsYear, currentBsMonth, eventsCountMap]);

  // Navigation handlers (Full supported range: 2070 to 2090 BS)
  const handlePrevMonth = () => {
    if (currentBsYear === 2070 && currentBsMonth === 1) return;
    if (currentBsMonth === 1) {
      setCurrentBsYear(prev => Math.max(2070, prev - 1));
      setCurrentBsMonth(12);
    } else {
      setCurrentBsMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentBsYear === 2090 && currentBsMonth === 12) return;
    if (currentBsMonth === 12) {
      setCurrentBsYear(prev => Math.min(2090, prev + 1));
      setCurrentBsMonth(1);
    } else {
      setCurrentBsMonth(prev => prev + 1);
    }
  };

  const handleTodayClick = () => {
    setCurrentBsYear(todayBs.bsYear);
    setCurrentBsMonth(todayBs.bsMonth);
    const today = calendarDays.find(d => d.isToday);
    if (today) {
      setSelectedDay(today);
    }
    setActiveTab('calendar');
  };

  const handleAddEvent = (eventData: Omit<UserEvent, 'id' | 'createdAt'>) => {
    const newEvent: UserEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      createdAt: Date.now()
    };
    setUserEvents(prev => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    setUserEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleToggleEvent = (id: string) => {
    setUserEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const todayMonthInfo = NEPALI_MONTHS[todayBs.bsMonth - 1];
  const todayDayOfWeek = DAYS_OF_WEEK[new Date().getDay()];

  const todayBsString = {
    year: todayBs.bsYear,
    month: todayBs.bsMonth,
    day: todayBs.bsDay,
    monthNameNe: todayMonthInfo?.nameNe || '',
    monthNameEn: todayMonthInfo?.nameEn || '',
    dayNe: todayDayOfWeek.nameNe,
    dayEn: todayDayOfWeek.nameEn
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-body selection:bg-[#1e1b4b] selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onTodayClick={handleTodayClick}
        onPrintClick={handlePrint}
        todayBsString={todayBsString}
      />

      {/* Main Body Content View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8-9 Cols: 7-Column Calendar Grid Matrix */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-4">
              <CalendarGrid
                currentBsYear={currentBsYear}
                currentBsMonth={currentBsMonth}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onYearChange={setCurrentBsYear}
                onMonthChange={setCurrentBsMonth}
                calendarDays={calendarDays}
                onSelectDay={setSelectedDay}
                selectedDay={selectedDay}
                language={language}
                filters={filters}
                setFilters={setFilters}
              />
            </div>

            {/* Right 3-4 Cols: Monthly Summary & Live Panchang Card */}
            <div className="lg:col-span-4 xl:col-span-3">
              <MonthlySummaryCard
                currentBsYear={currentBsYear}
                currentBsMonth={currentBsMonth}
                calendarDays={calendarDays}
                language={language}
                onOpenConverter={() => setActiveTab('converter')}
                onOpenPanchang={() => setActiveTab('panchang')}
                onSelectDay={setSelectedDay}
              />
            </div>
          </div>
        )}

        {activeTab === 'converter' && (
          <DateConverterModal
            language={language}
            todayBs={{ year: todayBs.bsYear, month: todayBs.bsMonth, day: todayBs.bsDay }}
          />
        )}

        {activeTab === 'panchang' && (
          <PanchangView
            language={language}
            todayBs={{ year: todayBs.bsYear, month: todayBs.bsMonth, day: todayBs.bsDay }}
          />
        )}

        {activeTab === 'festivals' && (
          <FestivalsView
            language={language}
            todayBs={{ year: todayBs.bsYear, month: todayBs.bsMonth, day: todayBs.bsDay }}
            onNavigateToMonth={(m) => {
              setCurrentBsMonth(m);
              setActiveTab('calendar');
            }}
          />
        )}

        {activeTab === 'rashifal' && (
          <RashifalView language={language} />
        )}

        {activeTab === 'events' && (
          <EventsView
            language={language}
            userEvents={userEvents}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onToggleEvent={handleToggleEvent}
            todayBs={{ year: todayBs.bsYear, month: todayBs.bsMonth, day: todayBs.bsDay }}
          />
        )}
      </main>

      {/* Selected Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
          language={language}
          userEvents={userEvents}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
          onToggleEvent={handleToggleEvent}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#070235]">Nepali Calendar System</span>
            <span>•</span>
            <span>वि.सं. तथा ई.सं. क्यालेन्डर र वैदिक पञ्चाङ्ग</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Bikram Sambat Era</span>
            <span>•</span>
            <span>Kathmandu, Nepal (UTC+5:45)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
