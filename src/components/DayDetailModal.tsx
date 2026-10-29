import React, { useState } from 'react';
import {
  X,
  Calendar,
  Sun,
  Moon,
  Clock,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Tag,
  Sunrise,
  Sunset
} from 'lucide-react';
import { CalendarDay, Language, UserEvent } from '../types/calendar';
import { toDevanagari, NEPALI_MONTHS, DAYS_OF_WEEK, GREGORIAN_MONTHS } from '../utils/nepaliNumbers';

interface DayDetailModalProps {
  day: CalendarDay | null;
  onClose: () => void;
  language: Language;
  userEvents: UserEvent[];
  onAddEvent: (event: Omit<UserEvent, 'id' | 'createdAt'>) => void;
  onDeleteEvent: (id: string) => void;
  onToggleEvent: (id: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  onClose,
  language,
  userEvents,
  onAddEvent,
  onDeleteEvent,
  onToggleEvent
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<UserEvent['category']>('personal');
  const [eventTime, setEventTime] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  if (!day) return null;

  const monthInfo = NEPALI_MONTHS[day.bsMonth - 1];
  const dayOfWeekInfo = DAYS_OF_WEEK[day.dayOfWeek];
  const dateKey = `${day.bsYear}-${String(day.bsMonth).padStart(2, '0')}-${String(day.bsDay).padStart(2, '0')}`;
  const dayEvents = userEvents.filter(e => e.bsDateString === dateKey);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    onAddEvent({
      title: eventTitle.trim(),
      category: eventCategory,
      bsDateString: dateKey,
      adDateString: day.adDate.toISOString().split('T')[0],
      time: eventTime || undefined,
      description: eventDesc || undefined,
      completed: false
    });

    setEventTitle('');
    setEventDesc('');
    setEventTime('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#070235] to-[#1e1b4b] text-white flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold bg-[#bb0112] text-white px-2.5 py-0.5 rounded-full">
                {day.isSaturday ? (language === 'ne' ? 'शनिवार बिदा' : 'Saturday') : (day.isPublicHoliday ? (language === 'ne' ? 'सार्वजनिक बिदा' : 'Public Holiday') : (language === 'ne' ? 'कार्यदिन' : 'Workday'))}
              </span>
              {day.isToday && (
                <span className="text-xs font-bold bg-amber-400 text-[#070235] px-2 py-0.5 rounded-full">
                  {language === 'ne' ? 'आज' : 'Today'}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <h3 className="text-3xl sm:text-4xl font-bold font-devanagari">
                {toDevanagari(day.bsDay)}
              </h3>
              <div>
                <div className="text-lg sm:text-xl font-bold text-slate-100">
                  {language === 'ne' ? monthInfo.nameNe : monthInfo.nameEn} {toDevanagari(day.bsYear)} BS
                </div>
                <div className="text-xs sm:text-sm text-indigo-200 font-medium">
                  {dayOfWeekInfo.nameNe} ({dayOfWeekInfo.nameEn}) • {GREGORIAN_MONTHS[day.adMonth - 1]} {day.adDay}, {day.adYear} AD
                </div>
              </div>
            </div>

            {/* Festival / Holiday Banner */}
            {(day.festivalNe || day.holidayTitleNe) && (
              <div className="mt-3 inline-flex items-center gap-2 bg-red-950/70 border border-red-500/40 text-red-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  {language === 'ne'
                    ? (day.festivalNe || day.holidayTitleNe)
                    : (day.festivalEn || day.holidayTitleEn || day.festivalNe)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Section 1: Vedic Panchang Key Metrics Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#070235] mb-3 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{language === 'ne' ? 'दैनिक पञ्चाङ्ग विवरण' : 'Vedic Panchang Details'}</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{language === 'ne' ? 'तिथि (Tithi)' : 'Tithi'}</span>
                <span className="text-sm font-bold text-[#070235] font-devanagari mt-0.5 block">
                  {language === 'ne' ? day.panchang.tithi : day.panchang.tithiEn}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{language === 'ne' ? 'पक्ष (Paksha)' : 'Paksha'}</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {language === 'ne' ? `${day.panchang.paksha} पक्ष` : `${day.panchang.pakshaEn} Paksha`}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{language === 'ne' ? 'नक्षत्र (Nakshatra)' : 'Nakshatra'}</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {language === 'ne' ? day.panchang.nakshatra : day.panchang.nakshatraEn}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{language === 'ne' ? 'योग (Yoga)' : 'Yoga'}</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {day.panchang.yoga}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{language === 'ne' ? 'करण (Karana)' : 'Karana'}</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {day.panchang.karana}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{language === 'ne' ? 'चन्द्र राशि (Moon Sign)' : 'Moon Sign'}</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                  {day.panchang.moonSign}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Solar & Lunar Ephemeris Timings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#070235] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{language === 'ne' ? 'सूर्योदय, सूर्यास्त र काल समय' : 'Solar & Timings'}</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-2.5">
                <Sunrise className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-[10px] text-amber-800 block uppercase font-medium">{language === 'ne' ? 'सूर्योदय' : 'Sunrise'}</span>
                  <span className="text-xs font-bold text-slate-900">{day.panchang.sunrise}</span>
                </div>
              </div>

              <div className="p-2.5 bg-orange-50/70 border border-orange-200/80 rounded-xl flex items-center gap-2.5">
                <Sunset className="w-5 h-5 text-orange-600" />
                <div>
                  <span className="text-[10px] text-orange-800 block uppercase font-medium">{language === 'ne' ? 'सूर्यास्त' : 'Sunset'}</span>
                  <span className="text-xs font-bold text-slate-900">{day.panchang.sunset}</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-emerald-800 block uppercase font-medium">{language === 'ne' ? 'अभिजित मुहूर्त' : 'Abhijit'}</span>
                  <span className="text-xs font-bold text-slate-900">{day.panchang.abhijitMuhurat}</span>
                </div>
              </div>

              <div className="p-2.5 bg-red-50/70 border border-red-200/80 rounded-xl flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <span className="text-[10px] text-red-800 block uppercase font-medium">{language === 'ne' ? 'राहु काल' : 'Rahu Kaal'}</span>
                  <span className="text-xs font-bold text-slate-900">{day.panchang.rahuKaal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Auspicious Muhurats on this day if any */}
          {day.auspiciousMuhurat && day.auspiciousMuhurat.length > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ne' ? 'यस दिनका विशेष शुभ साइतहरू' : 'Auspicious Muhurats on this date'}</span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-emerald-800">
                {day.auspiciousMuhurat.map((muhurat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span className="font-semibold">{muhurat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 4: Personal Notes & Reminders on this Day */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#070235] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#bb0112]" />
                <span>{language === 'ne' ? 'व्यक्तिगत रिमाइन्डर र नोटहरू' : 'Personal Reminders & Notes'}</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.2 rounded-full">
                  {dayEvents.length}
                </span>
              </h4>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-semibold text-[#070235] hover:text-[#bb0112] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ne' ? 'नयाँ नोट थप्नुहोस्' : 'Add Note'}</span>
              </button>
            </div>

            {/* Add note inline form */}
            {showAddForm && (
              <form onSubmit={handleCreateEvent} className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl mb-4 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    {language === 'ne' ? 'शीर्षक / घटना' : 'Title / Event'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder={language === 'ne' ? 'जस्तै: जन्मदिन, पूजा, बैठक...' : 'e.g. Birthday, Meeting, Puja...'}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#070235]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      {language === 'ne' ? 'प्रकार (Category)' : 'Category'}
                    </label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value as UserEvent['category'])}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
                    >
                      <option value="personal">{language === 'ne' ? 'व्यक्तिगत (Personal)' : 'Personal'}</option>
                      <option value="birthday">{language === 'ne' ? 'जन्मदिन (Birthday)' : 'Birthday'}</option>
                      <option value="puja">{language === 'ne' ? 'पूजा / धर्म (Puja)' : 'Puja'}</option>
                      <option value="fasting">{language === 'ne' ? 'व्रत (Fasting)' : 'Fasting'}</option>
                      <option value="meeting">{language === 'ne' ? 'बैठक (Meeting)' : 'Meeting'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      {language === 'ne' ? 'समय (ऐच्छिक)' : 'Time (Optional)'}
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    {language === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-[#070235] hover:bg-[#1e1b4b] text-white font-semibold rounded-lg shadow-xs"
                  >
                    {language === 'ne' ? 'सुरक्षित गर्नुहोस्' : 'Save Event'}
                  </button>
                </div>
              </form>
            )}

            {/* List of existing events */}
            {dayEvents.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                {language === 'ne' ? 'यस दिन कुनै व्यक्तिगत रिमाइन्डर छैन।' : 'No personal reminders set for this day.'}
              </p>
            ) : (
              <div className="space-y-2">
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                      evt.completed
                        ? 'bg-slate-100/60 border-slate-200 text-slate-400 line-through'
                        : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => onToggleEvent(evt.id)}
                        className="text-slate-400 hover:text-emerald-600 transition"
                      >
                        <CheckCircle2 className={`w-4 h-4 ${evt.completed ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                      </button>
                      <div>
                        <span className="font-semibold block">{evt.title}</span>
                        {evt.time && <span className="text-[10px] text-slate-500 font-mono">{evt.time}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            ID: BS-{day.bsYear}-{day.bsMonth}-{day.bsDay}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#070235] hover:bg-[#1e1b4b] text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
