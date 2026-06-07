// ─── Planetary Days — Glamour System ─────────────────────────────────────────
//
// Source of truth for Glamour Magic colors and intentions.
// Two-layer output (spec v10.1 section 1):
//   COLOR  = planet of the day (weekday-based, constant)
//   INTENT = planetary base + moon phase modifier (dynamic)
//
// Usage: buildGlamourContent(ruler, phase) → { swatches, intention, instruction }

import type { MoonPhase, Planet } from "@/lib/astrology";

export interface PlanetaryDay {
  planet: Planet;
  symbol: string;
  colorName: string;                              // spoken color name for copy
  swatches: Array<{ name: string; hex: string }>; // 1–3 swatches for the card
  baseIntention: string;                          // planet-layer sentence
}

export const PLANETARY_DAYS: Record<Planet, PlanetaryDay> = {
  Sun: {
    planet: "Sun",
    symbol: "☉",
    colorName: "gold",
    swatches: [{ name: "Gold", hex: "#C9A84C" }, { name: "Amber", hex: "#D4813A" }],
    baseIntention: "Shine and be visible. A day to take up space.",
  },
  Moon: {
    planet: "Moon",
    symbol: "☽",
    colorName: "silver",
    swatches: [{ name: "Silver", hex: "#C8CDD8" }, { name: "Pearl", hex: "#E8ECF4" }],
    baseIntention: "Receive and sense. A day to soften into what's arriving.",
  },
  Mercury: {
    planet: "Mercury",
    symbol: "☿",
    colorName: "yellow",
    swatches: [{ name: "Yellow", hex: "#D4B84A" }, { name: "Champagne", hex: "#E8D478" }],
    baseIntention: "Speak and think clearly. A day to be heard.",
  },
  Venus: {
    planet: "Venus",
    symbol: "♀",
    colorName: "green",
    swatches: [{ name: "Sage", hex: "#4A7C59" }, { name: "Rose", hex: "#D4828C" }],
    baseIntention: "Soften and attract. A day to draw beauty close.",
  },
  Mars: {
    planet: "Mars",
    symbol: "♂",
    colorName: "red",
    swatches: [{ name: "Red", hex: "#8B1C2C" }, { name: "Scarlet", hex: "#B83040" }],
    baseIntention: "Act with courage. A day to be seen in your power.",
  },
  Jupiter: {
    planet: "Jupiter",
    symbol: "♃",
    colorName: "blue",
    swatches: [{ name: "Royal blue", hex: "#2B4A8C" }, { name: "Violet", hex: "#5B4090" }],
    baseIntention: "Expand and trust. A day to step into more.",
  },
  Saturn: {
    planet: "Saturn",
    symbol: "♄",
    colorName: "black",
    swatches: [
      { name: "Black",   hex: "#1A1A22" },
      { name: "Charcoal", hex: "#404048" },
    ],
    baseIntention: "Hold your boundary. A day to protect what matters.",
  },
};

// ─── Phase modifiers — second layer of glamour copy ──────────────────────────

const PHASE_MODIFIERS: Record<MoonPhase, string> = {
  "New Moon":        "Plant it quietly. Wear this color as a seed — not yet declared, already growing.",
  "Waxing Crescent": "Let it build. Wear this color to call in what you're reaching for.",
  "First Quarter":   "Let this color fuel your momentum — there's still ground to cover.",
  "Waxing Gibbous":  "Almost there. Wear this color to carry your effort forward with grace.",
  "Full Moon":       "Be seen completely. Wear this color at full power — let it speak for you.",
  "Waning Gibbous":  "Release with it. Wear this color to integrate, not to push.",
  "Last Quarter":    "Wear this color to release what no longer serves. Let it be your letting go.",
  "Waning Crescent": "Rest in it. Wear this color as softness for the inward — to protect, not to perform.",
};

// ─── buildGlamourContent — compose two layers into card output ───────────────

export interface GlamourContent {
  colorName: string;
  swatches: Array<{ name: string; hex: string }>;
  intention: string;   // base + phase modifier — replaces old "suggestion"
  instruction: string; // tactile reminder, always the same structure
}

export function buildGlamourContent(ruler: Planet, phase: MoonPhase): GlamourContent {
  const day = PLANETARY_DAYS[ruler];
  const modifier = PHASE_MODIFIERS[phase];

  return {
    colorName: day.colorName,
    swatches: day.swatches,
    intention: `${day.baseIntention} ${modifier}`,
    instruction: `One ${day.colorName} thing on your skin — clothing, a stone, a thread. Let it remind you all day.`,
  };
}
