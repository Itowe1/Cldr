import React, { useState } from 'react';
import {
  BookmarkCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Tag
} from 'lucide-react';
import { Language, UserEvent } from '../types/calendar';
import { toDevanagari, NEPALI_MONTHS } from '../utils/nepaliNumbers';
import { convertBsToAd, getNepaliMonthDays } from '../utils/dateConverter';

interface EventsViewProps {
  language: Language;
  userEvents: UserEvent[];
  onAddEvent: (event: Omit<UserEvent, 'id' | 'createdAt'>) => void;
  onDeleteEvent: (id: string) => void;
  onToggleEvent: (id: string) => void;
  todayBs: { year: number; month: number; day: number };
}

export const EventsView: React.FC<EventsViewProps> = ({
  language,
  userEvents,
  onAddEvent,
  onDeleteEvent,
  onToggleEvent,
  todayBs
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<UserEvent['category']>('personal');
  const [bsYear, setBsYear] = useState<number>(todayBs.year);
  const [bsMonth, setBsMonth] = useState<number>(todayBs.month);
  const [bsDay, setBsDay] = useState<number>(todayBs.day);
  const [time, setTime] = useState('');
  const [desc, setDesc] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const maxDays = getNepaliMonthDays(bsYear, bsMonth);
    const clampedDay = Math.min(Math.max(1, bsDay), maxDays);
    const bsDateString = `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
    
    // Accurate Gregorian conversion for this specific BS date
    const adDate = convertBsToAd(bsYear, bsMonth, clampedDay);
    const adDateString = `${adDate.getUTCFullYear()}-${String(adDate.getUTCMonth() + 1).padStart(2, '0')}-${String(adDate.getUTCDate()).padStart(2, '0')}`;

    onAddEvent({
      title: title.trim(),
      category,
      bsDateString,
      adDateString,
      time: time || undefined,
      description: desc || undefined,
      completed: false
    });

    setTitle('');
    setDesc('');
    setTime('');
    setShowModal(false);
  };

  const filteredEvents = userEvents.filter((evt) => {
    if (filterCategory === 'all') return true;
    return evt.category === filterCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => a.bsDateString.localeCompare(b.bsDateString));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#070235] via-[#1e1b4b] to-[#070235] text-white p-6 rounded-2xl shadow-md border border-[#1e1b4b]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs px-3 py-1 rounded-full font-medium mb-2">
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ne' ? 'व्यक्तिगत तालिका' : 'Personal Reminders'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline">
              {language === 'ne' ? 'व्यक्तिगत घटना र रिमाइन्डर' : 'My Calendar Events & Reminders'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {language === 'ne'
                ? 'जन्मदिन, विशेष पूजा, पारिवारिक भेटघाट तथा व्यक्तिगत कार्यहरू नेपाली पात्रोमा सुरक्षित राख्नुहोस्।'
                : 'Keep your important life milestones, ceremonies, pujas, and appointments organized on Bikram Sambat dates.'
              }
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#bb0112] hover:bg-[#a00110] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 active:scale-95 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ne' ? 'नयाँ रिमाइन्डर थप्नुहोस्' : 'Create Reminder'}</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', labelNe: 'सबै (All)', labelEn: 'All' },
          { id: 'birthday', labelNe: 'जन्मदिन (Birthdays)', labelEn: 'Birthdays' },
          { id: 'puja', labelNe: 'पूजा तथा व्रत', labelEn: 'Pujas & Fasting' },
          { id: 'meeting', labelNe: 'बैठक / भेटघाट', labelEn: 'Meetings' },
          { id: 'personal', labelNe: 'व्यक्तिगत', labelEn: 'Personal' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterCategory === cat.id
                ? 'bg-[#070235] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {language === 'ne' ? cat.labelNe : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-700">
              {language === 'ne' ? 'कुनै पनि रिमाइन्डर फेला परेन' : 'No reminders found'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {language === 'ne'
                ? 'माथिको "नयाँ रिमाइन्डर थप्नुहोस्" बटनमा थिचेर वा पात्रोको कुनै पनि दिनमा क्लिक गरेर नयाँ नोट थप्न सक्नुहुन्छ।'
                : 'Add a new reminder by clicking the button above or selecting any date in the calendar grid.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEvents.map((evt) => {
              const [y, m, d] = evt.bsDateString.split('-').map(Number);
              const mInfo = NEPALI_MONTHS[m - 1];

              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    evt.completed
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleEvent(evt.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                      title="Toggle completion"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 ${
                          evt.completed ? 'text-emerald-600 fill-emerald-100' : ''
                        }`}
                      />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {evt.category}
                        </span>
                        {evt.time && (
                          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {evt.time}
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold text-slate-900 mt-1 ${evt.completed ? 'line-through text-slate-400' : ''}`}>
                        {evt.title}
                      </h4>

                      {evt.description && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#bb0112] font-devanagari block">
                        {toDevanagari(y)} {mInfo?.nameNe} {toDevanagari(d)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {evt.bsDateString} BS
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteEvent(evt.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Event Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-[#070235] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {language === 'ne' ? 'नयाँ रिमाइन्डर थप्नुहोस्' : 'Create New Calendar Reminder'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-300 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {language === 'ne' ? 'शीर्षक / घटना नाम' : 'Title / Event'} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'ne' ? 'जस्तै: बुबाको मुख हेर्ने दिन, बैठक...' : 'e.g. Birthday, Meeting, Puja...'}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#070235]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    वर्ष (BS)
                  </label>
                  <select
                    value={bsYear}
                    onChange={(e) => setBsYear(Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    {Array.from({ length: 21 }, (_, i) => 2070 + i).map((y) => (
                      <option key={y} value={y}>{language === 'ne' ? toDevanagari(y) : y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    महिना
                  </label>
                  <select
                    value={bsMonth}
                    onChange={(e) => setBsMonth(Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    {NEPALI_MONTHS.map((m) => (
                      <option key={m.bsMonth} value={m.bsMonth}>{language === 'ne' ? m.nameNe : m.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    गते (Day)
                  </label>
                  <select
                    value={bsDay}
                    onChange={(e) => setBsDay(Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    {Array.from({ length: getNepaliMonthDays(bsYear, bsMonth) }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {language === 'ne' ? toDevanagari(i + 1) : i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    प्रकार (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as UserEvent['category'])}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="personal">{language === 'ne' ? 'व्यक्तिगत' : 'Personal'}</option>
                    <option value="birthday">{language === 'ne' ? 'जन्मदिन' : 'Birthday'}</option>
                    <option value="puja">{language === 'ne' ? 'पूजा तथा व्रत' : 'Puja & Fasting'}</option>
                    <option value="meeting">{language === 'ne' ? 'बैठक' : 'Meeting'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    समय (Time)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  थप विवरण (Description)
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder={language === 'ne' ? 'थप टिपोट...' : 'Additional notes...'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {language === 'ne' ? 'रद्द' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-[#070235] hover:bg-[#1e1b4b] text-white font-semibold rounded-xl shadow-xs"
                >
                  {language === 'ne' ? 'सुरक्षित गर्नुहोस्' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
