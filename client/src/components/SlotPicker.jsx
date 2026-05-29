import React, { useMemo } from 'react';
import { Sun, CloudSun, Moon } from 'lucide-react';

function parseHour(timeStr) {
  if (!timeStr) return 12;
  const parts = timeStr.split(':');
  return parseInt(parts[0], 10);
}

export default function SlotPicker({ slots, selectedSlot, onSlotSelect, loading }) {
  const grouped = useMemo(() => {
    if (!slots || slots.length === 0) return { morning: [], afternoon: [], evening: [] };
    const morning = [];
    const afternoon = [];
    const evening = [];
    for (const slot of slots) {
      const hour = parseHour(slot);
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    }
    return { morning, afternoon, evening };
  }, [slots]);

  if (loading) {
    return (
      <div className="slot-picker">
        <div className="slot-picker-section">
          <div className="slot-picker-section-title">Loading slots...</div>
          <div className="slot-picker-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton slot-skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="slot-picker">
        <div className="slot-picker-empty">
          <p>No available slots for this date. Please select another date.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { key: 'morning', label: 'Morning', icon: <Sun size={20} color="#f59e0b" />, items: grouped.morning },
    { key: 'afternoon', label: 'Afternoon', icon: <CloudSun size={20} color="#0066ff" />, items: grouped.afternoon },
    { key: 'evening', label: 'Evening', icon: <Moon size={20} color="#6f42c1" />, items: grouped.evening },
  ];

  return (
    <div className="slot-picker">
      {sections.map(
        (section) =>
          section.items.length > 0 && (
            <div key={section.key} className="slot-picker-section">
              <div className="slot-picker-section-title">
                <span style={{ display: 'flex', alignItems: 'center' }}>{section.icon}</span>
                <span>{section.label}</span>
              </div>
              <div className="slot-picker-grid">
                {section.items.map((time) => (
                  <button
                    key={time}
                    className={`slot-btn${selectedSlot === time ? ' selected' : ''}`}
                    onClick={() => onSlotSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
