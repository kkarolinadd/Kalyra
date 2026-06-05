"use client";

import { useState, useMemo, useRef } from "react";
import {
  getMoonPhaseData, getSpecialEvents, getMoonSign, getDayRuler,
  type MoonPhase, type SpecialEvent, PLANET_SYMBOL, SIGN_SYMBOL,
} from "@/lib/astrology";
import { getRitual } from "@/lib/ritualContent";
import { MoonPhaseIcon2, MoonFirstQuarter, IconMoon, IconCrystalSection, IconEnergy } from "@/components/icons";

// ─── Constants ────────────────────────────────────────────────────────────────

const MOON_LIT    = "#E8E0F0";
const MOON_SHADOW = "#1E1640";
const MOON_STROKE = "#4A3F7A";
const GOLD        = "#C9A84C";
const MOON_SIZE   = 40;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TRADITIONAL_MOON_NAMES: Record<number, string> = {
  0: "Wolf Moon", 1: "Snow Moon", 2: "Worm Moon", 3: "Pink Moon",
  4: "Flower Moon", 5: "Strawberry Moon", 6: "Buck Moon",
  7: "Sturgeon Moon", 8: "Harvest Moon", 9: "Hunter's Moon",
  10: "Beaver Moon", 11: "Cold Moon",
};

// Event dot colors per tier (spec section 6)
const EVENT_DOT_COLORS: Record<string, string> = {
  full_moon:               GOLD,
  blue_moon:               GOLD,
  new_moon:                GOLD,
  supermoon:               GOLD,
  micromoon:               GOLD,
  eclipse_solar:           "#6B3FA0",
  eclipse_lunar:           "#6B3FA0",
  sun_ingress:             "#4A9B8E",
  mercury_rx_start:        "#9B8BB8",
  mercury_rx_end:          "#9B8BB8",
  venus_rx_start:          "#9B8BB8",
  venus_rx_end:            "#9B8BB8",
  moon_conjunct_jupiter:   "#C4687A",
  moon_conjunct_venus:     "#C4687A",
};

// Priority for dot display (lower = higher priority)
const EVENT_PRIORITY: Record<string, number> = {
  eclipse_solar: 1, eclipse_lunar: 1,
  full_moon: 2, new_moon: 2, blue_moon: 2, supermoon: 2, micromoon: 2,
  sun_ingress: 3,
  mercury_rx_start: 4, mercury_rx_end: 4, venus_rx_start: 4, venus_rx_end: 4,
  moon_conjunct_jupiter: 5, moon_conjunct_venus: 5,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface DayData {
  date: Date;
  phase: MoonPhase;
  illumination: number;
  cycleDay: number;
  events: SpecialEvent[];
  moonSign: ReturnType<typeof getMoonSign>;
  dayRuler: ReturnType<typeof getDayRuler>;
  isFullMoon: boolean;
  isNewMoon: boolean;
}

function buildMonthData(year: number, month: number): DayData[] {
  const days = getDaysInMonth(year, month);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(year, month, i + 1, 12, 0, 0);
    const { phase, illumination, cycleDay } = getMoonPhaseData(date);
    const events = getSpecialEvents(date);
    const moonSign = getMoonSign(date);
    const dayRuler = getDayRuler(date);
    const isFullMoon = events.some(e => e.type === "full_moon" || e.type === "blue_moon");
    const isNewMoon  = events.some(e => e.type === "new_moon");
    return { date, phase, illumination, cycleDay, events, moonSign, dayRuler, isFullMoon, isNewMoon };
  });
}

function getDotsForDay(events: SpecialEvent[]): { color: string; type: string }[] {
  const sorted = [...events].sort((a, b) =>
    (EVENT_PRIORITY[a.type] ?? 99) - (EVENT_PRIORITY[b.type] ?? 99)
  );
  const dots: { color: string; type: string }[] = [];
  for (const ev of sorted) {
    const color = EVENT_DOT_COLORS[ev.type];
    if (color && dots.length < 3) dots.push({ color, type: ev.type });
  }
  return dots;
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────

function BottomSheet({ day, onClose }: { day: DayData; onClose: () => void }) {
  const today = new Date();
  const isToday    = isSameDay(day.date, today);
  const isFuture   = day.date > today && !isToday;
  const isPast     = day.date < today && !isToday;

  const ritual = getRitual(day.phase, day.dayRuler);

  const dateLabel = day.date.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const specialLabel = (() => {
    for (const ev of day.events) {
      if (ev.type === "blue_moon")    return "Blue Moon";
      if (ev.type === "supermoon")    return "Supermoon";
      if (ev.type === "micromoon")    return "Micromoon";
      if (ev.type === "eclipse_lunar") return "Blood Moon";
    }
    return null;
  })();

  const traditionalName = TRADITIONAL_MOON_NAMES[day.date.getMonth()];

  // Kalyra's voice — phase-based
  const kalyraNotes: Partial<Record<MoonPhase, string>> = {
    "New Moon":        "The slate is clean. What do you want to call in?",
    "Full Moon":       "What arrived this cycle that surprised you?",
    "First Quarter":   "What obstacle is here to strengthen you?",
    "Last Quarter":    "What are you releasing that no longer serves you?",
    "Waxing Crescent": "What story are you ready to begin writing?",
    "Waxing Gibbous":  "What needs one more honest push?",
    "Waning Gibbous":  "What did this cycle teach you?",
    "Waning Crescent": "What are you ready to begin again?",
  };
  const kalyraVoice = kalyraNotes[day.phase] ?? null;

  const conjunctions = day.events.filter(e =>
    e.type === "moon_conjunct_jupiter" || e.type === "moon_conjunct_venus"
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose}
        style={{ background: "rgba(0,0,0,0.4)" }} />

      {/* Sheet — uses CSS variables, adapts to all color modes */}
      <div className="fixed inset-x-0 bottom-0 z-50 fade-in"
        style={{
          background: "var(--card)",
          borderTop: "1px solid var(--border)",
          borderRadius: "20px 20px 0 0",
          maxHeight: "65vh",
          overflowY: "auto",
          paddingBottom: "calc(64px + env(safe-area-inset-bottom, 8px))",
        }}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Date */}
          <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "var(--muted-foreground)" }}>
            {dateLabel}
          </p>

          {/* Moon phase + sign */}
          <div className="flex items-center gap-4">
            <MoonPhaseIcon2
              phase={day.phase} size={44}
              litColor={MOON_LIT} darkColor={MOON_SHADOW}
              strokeColor={day.isFullMoon ? GOLD : MOON_STROKE}
            />
            <div>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.35rem", fontWeight: 500, color: "var(--foreground)", lineHeight: 1.2 }}>
                {specialLabel ? `${specialLabel} in ${day.moonSign}` : `${day.phase} in ${day.moonSign}`}
                {specialLabel === "Blue Moon" && " ✦"}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {day.isFullMoon || day.isNewMoon ? traditionalName + " · " : ""}
                {day.illumination}% illuminated
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)" }} />

          {/* Day info — SVG icons, no emoji */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <IconEnergy size={18} color={GOLD} />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "var(--foreground)" }}>
                {day.dayRuler} rules today
              </span>
            </div>
            <div className="flex items-center gap-3">
              <IconCrystalSection size={18} color={GOLD} />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "var(--foreground)" }}>
                {ritual.crystal.name}
                <span style={{ color: "var(--muted-foreground)" }}> · carry today</span>
              </span>
            </div>
            {conjunctions.map((ev, i) => (
              <div key={i} className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1 L9.9 7.1 L16 9 L9.9 10.9 L9 17 L8.1 10.9 L2 9 L8.1 7.1 Z"
                    stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round" fill="none"/>
                </svg>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "var(--foreground)" }}>{ev.label}</span>
              </div>
            ))}
            {day.events.filter(e => e.type === "sun_ingress").map((ev, i) => (
              <div key={i} className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="4" stroke="#4A9B8E" strokeWidth={1.5} fill="none"/>
                  <line x1="9" y1="1" x2="9" y2="3.5" stroke="#4A9B8E" strokeWidth={1.5} strokeLinecap="round"/>
                  <line x1="9" y1="14.5" x2="9" y2="17" stroke="#4A9B8E" strokeWidth={1.5} strokeLinecap="round"/>
                  <line x1="1" y1="9" x2="3.5" y2="9" stroke="#4A9B8E" strokeWidth={1.5} strokeLinecap="round"/>
                  <line x1="14.5" y1="9" x2="17" y2="9" stroke="#4A9B8E" strokeWidth={1.5} strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "var(--foreground)" }}>{ev.label}</span>
              </div>
            ))}
            {day.events.filter(e => e.type.includes("_rx_")).map((ev, i) => (
              <div key={i} className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9 A5 5 0 1 1 9 14" stroke="#9B8BB8" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
                  <path d="M9 14 L6 17 M9 14 L12 17" stroke="#9B8BB8" strokeWidth={1.5} strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "var(--foreground)" }}>{ev.label}</span>
              </div>
            ))}
          </div>

          {/* Kalyra's voice */}
          {kalyraVoice && (
            <>
              <div style={{ height: 1, background: "var(--border)" }} />
              <p className="kalyra-voice text-lg leading-relaxed"
                style={{ color: GOLD }}>
                &ldquo;{kalyraVoice}&rdquo;
              </p>
            </>
          )}

          {/* CTA */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <button className="w-full flex items-center justify-between px-4 py-3 transition-opacity active:opacity-70"
              style={{ background: "var(--background)" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.85rem",
                color: "var(--foreground)", letterSpacing: "0.04em" }}>
                {isToday ? "SEE TODAY'S RITUAL" : isFuture ? `RITUAL AVAILABLE ${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "NO RITUAL RECORDED"}
              </span>
              {isToday && <span style={{ color: GOLD }}>→</span>}
            </button>
          </div>

          <div className="h-2" />
        </div>
      </div>
    </>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────

export function CalendarTab({ colorMode = "night" }: { colorMode?: "dawn" | "day" | "dusk" | "night" }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Swipe gesture
  const touchStartX = useRef<number | null>(null);

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

  const monthData = useMemo(() => buildMonthData(viewYear, viewMonth), [viewYear, viewMonth]);
  const firstDow  = getFirstDayOfWeek(viewYear, viewMonth);

  const cells: (DayData | null)[] = [
    ...Array(firstDow).fill(null),
    ...monthData,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonthName = MONTH_NAMES[viewMonth === 0  ? 11 : viewMonth - 1].slice(0, 3).toUpperCase();
  const nextMonthName = MONTH_NAMES[viewMonth === 11 ? 0  : viewMonth + 1].slice(0, 3).toUpperCase();

  return (
    <div className="flex flex-col min-h-full px-2 pt-4 pb-6"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) { dx < 0 ? nextMonth() : prevMonth(); }
        touchStartX.current = null;
      }}>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3 px-2">
        <button onClick={prevMonth}
          className="flex items-center gap-1.5 active:opacity-60 transition-opacity"
          style={{ color: "var(--muted-foreground)", minWidth: 60 }}>
          <span style={{ fontSize: 16 }}>‹</span>
          <span className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}>
            {prevMonthName}
          </span>
        </button>

        <h2 style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "1.7rem", fontWeight: 400, fontStyle: "italic",
          color: "var(--foreground)", textAlign: "center",
        }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h2>

        <button onClick={nextMonth}
          className="flex items-center gap-1.5 active:opacity-60 transition-opacity"
          style={{ color: "var(--muted-foreground)", minWidth: 60, justifyContent: "flex-end" }}>
          <span className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}>
            {nextMonthName}
          </span>
          <span style={{ fontSize: 16 }}>›</span>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: 11,
              color: "var(--muted-foreground)", paddingBottom: 4, letterSpacing: "0.05em" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", marginBottom: 6 }} />

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} style={{ height: 80 }} />;

          const isToday    = isSameDay(day.date, today);
          const isSelected = selectedDay ? isSameDay(day.date, selectedDay.date) : false;
          const dots       = getDotsForDay(day.events);

          return (
            <button key={i}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className="flex flex-col items-center justify-start active:scale-90 transition-transform rounded-xl"
              style={{ height: 80, paddingTop: 4,
                background: isSelected ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent",
              }}>
              {/* Moon icon */}
              <div className="relative flex items-center justify-center"
                style={{ width: MOON_SIZE + 8, height: MOON_SIZE + 8 }}>
                {isToday && (
                  <div className="absolute inset-0 rounded-full"
                    style={{ border: `1.5px solid ${GOLD}` }} />
                )}
                <MoonPhaseIcon2
                  phase={day.phase}
                  size={MOON_SIZE}
                  litColor={MOON_LIT}
                  darkColor={MOON_SHADOW}
                  strokeColor={
                    isToday      ? GOLD       :
                    day.isFullMoon ? "#C9A84C50" :
                    MOON_STROKE
                  }
                />
              </div>

              {/* Date number */}
              <span style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12,
                fontWeight: isToday || day.isFullMoon ? 600 : 400,
                color: isToday || day.isFullMoon ? GOLD : "var(--foreground)",
                lineHeight: 1,
              }}>
                {day.date.getDate()}
              </span>

              {/* Event dots — max 3, 4px (5px in dusk) */}
              <div className="flex items-center gap-[3px] mt-1" style={{ minHeight: 8 }}>
                {dots.map((dot, di) => (
                  <div key={di}
                    style={{ width: colorMode === "dusk" ? 5 : 4, height: colorMode === "dusk" ? 5 : 4, borderRadius: "50%", background: dot.color }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-2 pt-4 mt-auto"
        style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-1.5">
          <MoonFirstQuarter size={13} litColor={MOON_LIT} darkColor={MOON_SHADOW} strokeColor={MOON_STROKE} />
          <span className="calendar-legend__label text-[10px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Full / New
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 13, height: 13, borderRadius: "50%", border: `1.5px solid ${GOLD}` }} />
          <span className="calendar-legend__label text-[10px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Today
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#6B3FA0" }} />
          <span className="calendar-legend__label text-[10px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Eclipse
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#9B8BB8" }} />
          <span className="calendar-legend__label text-[10px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Special
          </span>
        </div>
      </div>

      {/* Bottom sheet */}
      {selectedDay && (
        <BottomSheet day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </div>
  );
}
