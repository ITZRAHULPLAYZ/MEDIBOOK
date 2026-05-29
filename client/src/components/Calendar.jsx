import React, { useState, useMemo } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Calendar({ selectedDate, onDateSelect, availableDates }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      return { month: d.getMonth(), year: d.getFullYear() };
    }
    return { month: today.getMonth(), year: today.getFullYear() };
  });

  const availableSet = useMemo(() => {
    if (!availableDates) return null;
    return new Set(availableDates.map((d) => d));
  }, [availableDates]);

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  }

  function formatDateStr(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  function prevMonth() {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { month: prev.month - 1, year: prev.year };
    });
  }

  function nextMonth() {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { month: prev.month + 1, year: prev.year };
    });
  }

  const daysInMonth = getDaysInMonth(viewDate.month, viewDate.year);
  const firstDay = getFirstDayOfMonth(viewDate.month, viewDate.year);

  const calendarCells = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push({ type: 'empty', key: `empty-${i}` });
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateStr(viewDate.year, viewDate.month, day);
    const cellDate = new Date(viewDate.year, viewDate.month, day);
    cellDate.setHours(0, 0, 0, 0);
    const isPast = cellDate < today;
    const isToday = cellDate.getTime() === today.getTime();
    const isSelected = selectedDate === dateStr;
    const isAvailable = availableSet ? availableSet.has(dateStr) : false;

    calendarCells.push({
      type: 'day',
      day,
      dateStr,
      isPast,
      isToday,
      isSelected,
      isAvailable,
      key: `day-${day}`,
    });
  }

  // Fill remaining cells to complete 6 rows
  const remaining = 42 - calendarCells.length;
  for (let i = 0; i < remaining; i++) {
    calendarCells.push({ type: 'empty', key: `empty-end-${i}` });
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3>
          {MONTH_NAMES[viewDate.month]} {viewDate.year}
        </h3>
        <div className="calendar-nav">
          <button onClick={prevMonth} aria-label="Previous month">
            ‹
          </button>
          <button onClick={nextMonth} aria-label="Next month">
            ›
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="calendar-weekday">
            {wd}
          </div>
        ))}
      </div>

      <div className="calendar-days">
        {calendarCells.map((cell) => {
          if (cell.type === 'empty') {
            return <div key={cell.key} className="calendar-day empty" />;
          }

          let className = 'calendar-day';
          if (cell.isPast) className += ' disabled';
          if (cell.isToday) className += ' today';
          if (cell.isSelected) className += ' selected';
          if (cell.isAvailable && !cell.isPast) className += ' available';

          return (
            <button
              key={cell.key}
              className={className}
              disabled={cell.isPast}
              onClick={() => {
                if (!cell.isPast) {
                  onDateSelect(cell.dateStr);
                }
              }}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
