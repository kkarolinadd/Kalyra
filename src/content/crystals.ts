// ─── Crystal Master Records ───────────────────────────────────────────────────
//
// ONE record per crystal. Every view (Energy card, Crystal card, Learn library)
// reads from this single source — no conflicting instructions possible.
//
// Architecture (spec v10.1 section 5):
//   Energy card   → name + brief
//   Crystal card  → name (in subtitle via brief) + meaning + properties + howToUse
//   Learn library → all fields
//
// Crystal selection: getCrystalOfDay(phase, ruler) in ritualContent.ts
//   → prefers ruler's crystal when phase-compatible
//   → falls back to phase primary when not compatible (fixes Citrine-on-Waning bug)

import type { MoonPhase, Planet } from "@/lib/astrology";

export interface CrystalRecord {
  name: string;
  brief: string;          // 3–6 words · Energy card + Crystal subtitle (same string, zero conflict)
  meaning: string;        // one sentence · Crystal card body
  properties: string[];   // chip tags · Crystal card body
  howToUse: string;       // carrying instruction · Crystal card body only
  colorHex: string;       // reference / future icon tinting
  phaseAffinity: MoonPhase[];  // phases where this crystal is energetically appropriate
  planetRuler: Planet | "Neptune" | "Pluto";
}

export const CRYSTALS: Record<string, CrystalRecord> = {
  "Citrine": {
    name: "Citrine",
    brief: "carry it close",
    meaning: "A stone of solar energy — confidence, abundance, and momentum. It amplifies what you're building.",
    properties: ["Confidence", "Abundance", "Sun"],
    howToUse: "Keep it in your pocket or near your workspace. Touch it when you need a push.",
    colorHex: "#E8C84A",
    phaseAffinity: ["Waxing Crescent", "First Quarter", "Waxing Gibbous"],
    planetRuler: "Sun",
  },
  "Moonstone": {
    name: "Moonstone",
    brief: "placed on your chest",
    meaning: "A stone of lunar wisdom — intuition, feeling, and the deep knowing that lives beneath thought.",
    properties: ["Intuition", "Feeling", "Moon"],
    howToUse: "Hold it against your chest or place it under your pillow for dream guidance.",
    colorHex: "#D8D4E8",
    phaseAffinity: ["New Moon", "Full Moon", "Waning Crescent"],
    planetRuler: "Moon",
  },
  "Blue Lace Agate": {
    name: "Blue Lace Agate",
    brief: "held while writing",
    meaning: "A stone of clear expression — it quiets noise and opens the channel between thought and word.",
    properties: ["Clarity", "Expression", "Mercury"],
    howToUse: "Hold it while writing or speaking. Touch it before a difficult conversation.",
    colorHex: "#A8C8E0",
    phaseAffinity: ["New Moon", "Waxing Crescent", "First Quarter"],
    planetRuler: "Mercury",
  },
  "Rose Quartz": {
    name: "Rose Quartz",
    brief: "worn close to the heart",
    meaning: "A stone of love — self-love first, then everything else. It softens the grip and opens reception.",
    properties: ["Love", "Beauty", "Venus"],
    howToUse: "Wear it near your heart. Place it on your chest before sleep.",
    colorHex: "#E8C0CC",
    phaseAffinity: ["Waxing Gibbous", "Full Moon", "Waning Gibbous"],
    planetRuler: "Venus",
  },
  "Carnelian": {
    name: "Carnelian",
    brief: "carried in the right hand",
    meaning: "A stone of action — it ignites courage, momentum, and the willingness to begin.",
    properties: ["Courage", "Action", "Mars"],
    howToUse: "Carry it in your dominant hand. Hold it before any act that requires bravery.",
    colorHex: "#D4683A",
    phaseAffinity: ["Waxing Crescent", "First Quarter", "Waxing Gibbous"],
    planetRuler: "Mars",
  },
  "Lapis Lazuli": {
    name: "Lapis Lazuli",
    brief: "touched before the threshold",
    meaning: "A stone of wisdom and expansion — it connects you to the larger truth beyond the immediate moment.",
    properties: ["Wisdom", "Expansion", "Jupiter"],
    howToUse: "Hold it before important decisions or creative work. Place it facing upward at your desk.",
    colorHex: "#2B4A8C",
    phaseAffinity: ["First Quarter", "Waxing Gibbous", "Full Moon"],
    planetRuler: "Jupiter",
  },
  "Black Tourmaline": {
    name: "Black Tourmaline",
    brief: "set at your threshold",
    meaning: "A stone of protection and grounding — it defines your boundary and holds it without effort.",
    properties: ["Protection", "Grounding", "Saturn"],
    howToUse: "Place it at the entrance of your space, or carry it when you need to hold a firm boundary.",
    colorHex: "#2A2A2A",
    phaseAffinity: ["Waning Gibbous", "Last Quarter", "Waning Crescent"],
    planetRuler: "Saturn",
  },
  "Amethyst": {
    name: "Amethyst",
    brief: "held loosely",
    meaning: "A stone of release and peace — it loosens the grip, quiets mental noise, and opens space for what's next.",
    properties: ["Calm", "Release", "Clarity"],
    howToUse: "Hold it loosely. Let it absorb tension. Place it on your chest and breathe into release.",
    colorHex: "#8B60B0",
    phaseAffinity: ["Waning Gibbous", "Last Quarter", "Waning Crescent"],
    planetRuler: "Neptune",
  },
  "Obsidian": {
    name: "Obsidian",
    brief: "placed at your feet",
    meaning: "A stone of shadow work and truth — it reflects what's ready to be seen, so it can finally be released.",
    properties: ["Truth", "Release", "Pluto"],
    howToUse: "Place it at your feet during meditation. Hold it when you're ready to face something honestly.",
    colorHex: "#1A1A1A",
    phaseAffinity: ["Waning Crescent", "New Moon"],
    planetRuler: "Pluto",
  },
};

// ─── Phase primary crystals — fallback when ruler's crystal isn't phase-compatible ──

export const PHASE_CRYSTAL_PRIMARY: Record<MoonPhase, string> = {
  "New Moon":        "Moonstone",
  "Waxing Crescent": "Citrine",
  "First Quarter":   "Carnelian",
  "Waxing Gibbous":  "Lapis Lazuli",
  "Full Moon":       "Moonstone",
  "Waning Gibbous":  "Amethyst",
  "Last Quarter":    "Black Tourmaline",
  "Waning Crescent": "Obsidian",
};

// ─── Ruler-to-crystal map ─────────────────────────────────────────────────────

export const RULER_CRYSTAL: Record<Planet, string> = {
  Sun:     "Citrine",
  Moon:    "Moonstone",
  Mercury: "Blue Lace Agate",
  Venus:   "Rose Quartz",
  Mars:    "Carnelian",
  Jupiter: "Lapis Lazuli",    // fixed: was Green Aventurine in old RULER_LAYER
  Saturn:  "Black Tourmaline",
};

// ─── Crystal selection — phase-compatible ruler preference ───────────────────
//
// Rule: use ruler's crystal if it's energetically appropriate for the current
// phase. Otherwise fall back to the phase's primary crystal.
//
// Example — Sunday + Waning Gibbous:
//   ruler=Sun → Citrine, Citrine.phaseAffinity=[Waxing…] → NOT compatible
//   → fallback → Amethyst  ✓  (fixes the Citrine-on-Waning bug)
//
// Example — Sunday + Waxing Crescent:
//   ruler=Sun → Citrine, phaseAffinity includes "Waxing Crescent" → Citrine ✓

export function getCrystalOfDay(phase: MoonPhase, ruler: Planet): CrystalRecord {
  const rulerCrystalName = RULER_CRYSTAL[ruler];
  const rulerRecord = CRYSTALS[rulerCrystalName];

  if (rulerRecord && rulerRecord.phaseAffinity.includes(phase)) {
    return rulerRecord;
  }

  const primaryName = PHASE_CRYSTAL_PRIMARY[phase];
  return CRYSTALS[primaryName] ?? CRYSTALS["Moonstone"];
}
