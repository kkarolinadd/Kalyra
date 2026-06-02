"use client";

import { useState, useMemo } from "react";
import { getMoonPhaseData, getSpecialEvents, type MoonPhase, type SpecialEvent } from "@/lib/astrology";
import { MoonPhaseIcon2 } from "@/components/icons";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

interface DayData {
  date: Date;
  phase: MoonPhase;
  illumination: number;
  events: SpecialEvent[];
}

function buildMonthData(year: number, month: number): DayData[] {
  const days = getDaysInMonth(year, month);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(year, month, i + 1, 12, 0, 0);
    const { phase, illumination } = getMoonPhaseData(date);
    const events = getSpecialEvents(date);
    return { date, phase, illumination, events };
  });
}

// Event dot colors per type
function getEventDot(events: SpecialEvent[]): { color: string; label: string } | null {
  for (const ev of events) {
    if (ev.type === "full_moon" || ev.type === "blue_moon")
      return { color: "#C9A84C", label: "full" };
    if (ev.type === "new_moon")
      return { color: "var(--foreground)", label: "new" };
    if (ev.type === "eclipse_solar" || ev.type === "eclipse_lunar")
      return { color: "#6B3FA0", label: "eclipse" };
    if (ev.type === "mercury_rx_start" || ev.type === "mercury_rx_end")
      return { color: "var(--muted-foreground)", label: "rx" };
    if (ev.type === "sun_ingress")
      return { color: "#4A9B8E", label: "ingress" };
  }
  return null;
}

// ─── Day Detail Panel ─────────────────────────────────────────────────────────

function DayDetail({ day, onClose }: { day: DayData; onClose: () => void }) {
  const dateLabel = day.date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });

  return (
    <div className="fade-in rounded-2xl p-5 space-y-4 mt-2"
      style={{ background: "var(--card)", border: "1px solid var(--primary)", }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MoonPhaseIcon2
            phase={day.phase} size={32}
            litColor="var(--foreground)" strokeColor="var(--primary)"
          />
          <div>
            <p className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
              {dateLabel}
            </p>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.2rem", fontWeight: 500, color: "var(--foreground)" }}>
              {day.phase}
            </p>
          </div>
        </div>
        <button onClick={onClose}
          style={{ color: "var(--muted-foreground)", fontSize: 20, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: "var(--background)" }}>
          <p className="text-xs tracking-widest uppercase mb-0.5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Illumination
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem", color: "var(--foreground)" }}>
            {day.illumination}%
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ background: "var(--background)" }}>
          <p className="text-xs tracking-widest uppercase mb-0.5"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Cycle day
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem", color: "var(--foreground)" }}>
            Day {Math.round((day.illumination / 100) * 14.77) + 1}
          </p>
        </div>
      </div>

      {day.events.length > 0 && (
        <div className="space-y-2">
          {day.events.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span style={{ color: "var(--primary)", fontSize: 14, marginTop: 2 }}>✦</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{ev.label}</p>
                {ev.description && (
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{ev.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarTab({ colorMode = "dark" }: { colorMode?: "morning" | "mid" | "dark" }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const monthData = useMemo(() => buildMonthData(viewYear, viewMonth), [viewYear, viewMonth]);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);

  const isMorning = colorMode === "morning";
  // In morning mode: dark icons on light background (like the screenshot)
  // In dark/mid mode: light icons on dark background
  const moonLitColor = isMorning ? "#1A1208" : "var(--foreground)";
  const moonStrokeColor = isMorning ? "#1A1208" : "var(--muted-foreground)";
  const todayStrokeColor = "#C9A84C";

  function prevMonth() {
    setSelectedDay(null);
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    setSelectedDay(null);
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const prevMonthName = MONTH_NAMES[viewMonth === 0 ? 11 : viewMonth - 1].slice(0, 3).toUpperCase();
  const nextMonthName = MONTH_NAMES[viewMonth === 11 ? 0 : viewMonth + 1].slice(0, 3).toUpperCase();

  // Build grid (pad with nulls for days before month start)
  const cells: (DayData | null)[] = [
    ...Array(firstDow).fill(null),
    ...monthData,
  ];
  // Pad end to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex flex-col min-h-full px-3 pt-4 pb-6">

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={prevMonth}
          className="flex items-center gap-1 active:opacity-60 transition-opacity"
          style={{ color: "var(--muted-foreground)" }}>
          <span style={{ fontSize: 14 }}>‹</span>
          <span className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}>
            {prevMonthName}
          </span>
        </button>

        <h2 style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "1.6rem", fontWeight: 400, fontStyle: "italic",
          color: "var(--foreground)",
        }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h2>

        <button onClick={nextMonth}
          className="flex items-center gap-1 active:opacity-60 transition-opacity"
          style={{ color: "var(--muted-foreground)" }}>
          <span className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}>
            {nextMonthName}
          </span>
          <span style={{ fontSize: 14 }}>›</span>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center text-xs tracking-widest"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)", paddingBottom: 6 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", marginBottom: 8 }} />

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 flex-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const isToday = isSameDay(day.date, today);
          const isSelected = selectedDay && isSameDay(day.date, selectedDay.date);
          const dot = getEventDot(day.events);

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className="flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all active:scale-90"
              style={{
                background: isSelected ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
              }}
            >
              {/* Moon phase icon */}
              <div className="relative">
                {isToday && (
                  <div className="absolute inset-0 rounded-full"
                    style={{
                      margin: -3,
                      border: `1.5px solid ${todayStrokeColor}`,
                      borderRadius: "50%",
                    }} />
                )}
                <MoonPhaseIcon2
                  phase={day.phase}
                  size={28}
                  litColor={isToday ? "#C9A84C" : moonLitColor}
                  strokeColor={isToday ? todayStrokeColor : moonStrokeColor}
                />
              </div>

              {/* Date number */}
              <span className="text-xs leading-none"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? "var(--primary)" : "var(--foreground)",
                  fontSize: 11,
                }}>
                {day.date.getDate()}
              </span>

              {/* Event dot */}
              {dot ? (
                <div className="w-1 h-1 rounded-full" style={{ background: dot.color }} />
              ) : (
                <div className="w-1 h-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail */}
      {selectedDay && (
        <DayDetail day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 mt-2"
        style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--foreground)" }} />
          <span className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Full / New
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full"
            style={{ border: "1.5px solid #C9A84C" }} />
          <span className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Today
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: "#6B3FA0" }} />
          <span className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Eclipse
          </span>
        </div>
      </div>
    </div>
  );
}
