import { useState, useMemo } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function JobCalendar({ jobs }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const eventsByDay = useMemo(() => {
    const map = {};
    jobs.forEach(job => {
      const addEvent = (dateStr, type, label) => {
        if (!dateStr) return;
        const d = new Date(dateStr);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const day = d.getDate();
          if (!map[day]) map[day] = [];
          map[day].push({ type, label: `${job.companyName}: ${label}` });
        }
      };
      addEvent(job.interviewDate, 'interview', 'Interview');
      addEvent(job.applicationDeadline, 'deadline', 'Deadline');
    });
    return map;
  }, [jobs, year, month]);

  const EVENT_STYLES = {
    interview: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    deadline: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - firstDay + 1;
    return dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null;
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            ‹
          </button>
          <button onClick={nextMonth} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            ›
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4 text-xs">
        <span className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
          <span className="text-gray-500 dark:text-gray-400">Interview</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="text-gray-500 dark:text-gray-400">Deadline</span>
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
        ))}
        {days.map((day, i) => {
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const events = day ? (eventsByDay[day] || []) : [];
          return (
            <div
              key={i}
              className={`min-h-[64px] rounded-lg p-1 text-xs transition-colors ${
                day ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
              }`}
            >
              {day && (
                <>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-1 ${isToday ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {events.slice(0, 2).map((ev, j) => (
                      <div key={j} className={`rounded px-1 py-0.5 text-xs truncate ${EVENT_STYLES[ev.type]}`} title={ev.label}>
                        {ev.label}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-gray-400 px-1">+{events.length - 2} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
