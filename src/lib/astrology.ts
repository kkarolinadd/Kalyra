// Astrological calculation engine — all client-side, no external API

export type MoonPhase =
  | "New Moon"
  | "Waxing Crescent"
  | "First Quarter"
  | "Waxing Gibbous"
  | "Full Moon"
  | "Waning Gibbous"
  | "Last Quarter"
  | "Waning Crescent";

export type ZodiacSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type Planet =
  | "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn";

export interface DailyAstrology {
  date: Date;
  moonPhase: MoonPhase;
  moonIllumination: number; // 0–100
  moonSign: ZodiacSign;
  dayRuler: Planet;
  sunSign: ZodiacSign;
  specialEvents: SpecialEvent[];
  phaseCycleDay: number; // 1–29
}

export interface SpecialEvent {
  type:
    | "new_moon" | "full_moon" | "blue_moon" | "supermoon" | "micromoon"
    | "eclipse_solar" | "eclipse_lunar"
    | "mercury_rx_start" | "mercury_rx_end"
    | "venus_rx_start" | "venus_rx_end"
    | "sun_ingress"
    | "moon_conjunct_jupiter" | "moon_conjunct_venus";
  label: string;
  description?: string;
}

// ─── Moon Phase ───────────────────────────────────────────────────────────────

const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z");
const SYNODIC_MONTH = 29.53059;

export function getMoonPhaseData(date: Date): {
  phase: MoonPhase;
  illumination: number;
  cycleDay: number;
} {
  const elapsed =
    (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
  const cycleDay = ((elapsed % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const angle = (cycleDay / SYNODIC_MONTH) * 360;
  const illumination = Math.round(
    ((1 - Math.cos((angle * Math.PI) / 180)) / 2) * 100
  );

  let phase: MoonPhase;
  if (cycleDay < 1.85) phase = "New Moon";
  else if (cycleDay < 7.38) phase = "Waxing Crescent";
  else if (cycleDay < 9.22) phase = "First Quarter";
  else if (cycleDay < 13.5) phase = "Waxing Gibbous";
  else if (cycleDay < 16.0) phase = "Full Moon";
  else if (cycleDay < 22.15) phase = "Waning Gibbous";
  else if (cycleDay < 23.99) phase = "Last Quarter";
  else phase = "Waning Crescent";

  return { phase, illumination, cycleDay: Math.floor(cycleDay) + 1 };
}

// ─── Moon Sign (simplified ephemeris — approx 2024–2030) ─────────────────────

const MOON_SIGN_CYCLE: ZodiacSign[] = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

// Moon moves through all 12 signs in ~27.3 days (sidereal month)
// Each sign ≈ 2.275 days
const SIDEREAL_MONTH = 27.321661;
const MOON_SIGN_REF = new Date("2000-01-06T18:14:00Z"); // Moon in Scorpio at ref
const MOON_SIGN_REF_INDEX = 7; // Scorpio

export function getMoonSign(date: Date): ZodiacSign {
  const elapsed =
    (date.getTime() - MOON_SIGN_REF.getTime()) / (1000 * 60 * 60 * 24);
  const signProgress = elapsed / (SIDEREAL_MONTH / 12);
  const index =
    ((Math.floor(signProgress) + MOON_SIGN_REF_INDEX) % 12 + 12) % 12;
  return MOON_SIGN_CYCLE[index];
}

// ─── Sun Sign ─────────────────────────────────────────────────────────────────

export function getSunSign(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

// ─── Day Ruler ────────────────────────────────────────────────────────────────

const DAY_RULERS: Planet[] = [
  "Sun",     // Sunday = 0
  "Moon",    // Monday = 1
  "Mars",    // Tuesday = 2
  "Mercury", // Wednesday = 3
  "Jupiter", // Thursday = 4
  "Venus",   // Friday = 5
  "Saturn",  // Saturday = 6
];

export function getDayRuler(date: Date): Planet {
  return DAY_RULERS[date.getDay()];
}

// ─── Special Events Calendar (hardcoded 2025–2030) ────────────────────────────

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  events: SpecialEvent[];
}

const SPECIAL_EVENTS_CALENDAR: CalendarEvent[] = [
  // 2026
  { date: "2026-01-03", events: [{ type: "full_moon", label: "Full Moon in Cancer" }] },
  { date: "2026-01-18", events: [{ type: "new_moon", label: "New Moon in Capricorn" }] },
  { date: "2026-02-01", events: [{ type: "full_moon", label: "Full Moon in Leo" }] },
  { date: "2026-02-17", events: [{ type: "new_moon", label: "New Moon in Aquarius" }] },
  { date: "2026-03-03", events: [{ type: "full_moon", label: "Full Moon in Virgo" }] },
  { date: "2026-03-18", events: [{ type: "new_moon", label: "New Moon in Pisces" }] },
  { date: "2026-04-02", events: [{ type: "full_moon", label: "Full Moon in Libra" }] },
  { date: "2026-04-17", events: [{ type: "new_moon", label: "New Moon in Aries" }] },
  { date: "2026-05-01", events: [{ type: "full_moon", label: "Full Moon in Scorpio" }] },
  { date: "2026-05-16", events: [{ type: "new_moon", label: "New Moon in Taurus" }] },
  { date: "2026-05-31", events: [
    { type: "full_moon", label: "Full Moon in Sagittarius" },
    { type: "blue_moon", label: "Blue Moon", description: "Second Full Moon in May — rare window every ~2.5 years" },
    { type: "micromoon", label: "Micromoon", description: "Moon near apogee — subtle, introspective energy" },
  ]},
  { date: "2026-06-15", events: [{ type: "new_moon", label: "New Moon in Gemini" }] },
  // Mercury Retrograde periods 2026
  { date: "2026-01-25", events: [{ type: "mercury_rx_start", label: "Mercury Retrograde begins", description: "Review, revise, reconnect — avoid launching new projects" }] },
  { date: "2026-02-14", events: [{ type: "mercury_rx_end", label: "Mercury Retrograde ends" }] },
  { date: "2026-05-29", events: [{ type: "mercury_rx_start", label: "Mercury Retrograde begins", description: "Review, revise, reconnect — avoid launching new projects" }] },
  { date: "2026-06-22", events: [{ type: "mercury_rx_end", label: "Mercury Retrograde ends" }] },
  // Sun ingresses 2026
  { date: "2026-01-20", events: [{ type: "sun_ingress", label: "Sun enters Aquarius" }] },
  { date: "2026-02-18", events: [{ type: "sun_ingress", label: "Sun enters Pisces" }] },
  { date: "2026-03-20", events: [{ type: "sun_ingress", label: "Sun enters Aries — Spring Equinox" }] },
  { date: "2026-04-20", events: [{ type: "sun_ingress", label: "Sun enters Taurus" }] },
  { date: "2026-05-20", events: [{ type: "sun_ingress", label: "Sun enters Gemini" }] },
  { date: "2026-06-21", events: [{ type: "sun_ingress", label: "Sun enters Cancer — Summer Solstice" }] },
];

export function getSpecialEvents(date: Date): SpecialEvent[] {
  const dateStr = date.toISOString().slice(0, 10);
  const entry = SPECIAL_EVENTS_CALENDAR.find((e) => e.date === dateStr);
  return entry?.events ?? [];
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function getDailyAstrology(date: Date = new Date()): DailyAstrology {
  const { phase, illumination, cycleDay } = getMoonPhaseData(date);
  return {
    date,
    moonPhase: phase,
    moonIllumination: illumination,
    moonSign: getMoonSign(date),
    dayRuler: getDayRuler(date),
    sunSign: getSunSign(date),
    specialEvents: getSpecialEvents(date),
    phaseCycleDay: cycleDay,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const MOON_PHASE_EMOJI: Record<MoonPhase, string> = {
  "New Moon": "🌑",
  "Waxing Crescent": "🌒",
  "First Quarter": "🌓",
  "Waxing Gibbous": "🌔",
  "Full Moon": "🌕",
  "Waning Gibbous": "🌖",
  "Last Quarter": "🌗",
  "Waning Crescent": "🌘",
};

export const PLANET_SYMBOL: Record<Planet, string> = {
  Sun: "☀️",
  Moon: "🌙",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
};

export const SIGN_SYMBOL: Record<ZodiacSign, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};
