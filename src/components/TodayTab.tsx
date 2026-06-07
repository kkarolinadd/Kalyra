"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getDailyAstrology, type DailyAstrology } from "@/lib/astrology";
import { getRitual, getSpecialSectionContent, getTriggeredRituals } from "@/lib/ritualContent";
import { getProfile, saveProfile, getTodayCheckins, toggleCheckin, type CheckinKey } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import {
  IconSunrise, IconEvening, IconJournal, IconMirror,
  IconCrystalSection, IconGlamour, IconEnergy,
  CrystalIcon,
} from "@/components/icons";

// ─── Constants ────────────────────────────────────────────────────────────────

// CSS variables — values defined per mode in globals.css
const CARD_ACCENTS: Record<CheckinKey | "energy", string> = {
  morning: "var(--accent-morning)",
  evening: "var(--accent-evening)",
  journal: "var(--accent-journal)",
  mirror:  "var(--accent-mirror)",
  crystal: "var(--accent-crystal)",
  wear:    "var(--accent-wear)",
  energy:  "var(--accent-energy)",
};

const GLAMOUR_COLOR_MAP: Record<string, string> = {
  "Gold or amber":           "#C9A84C",
  "Silver or white":         "#C8D0D8",
  "Silver or pale yellow":   "#E0DC9A",
  "Rose pink or soft green": "#E8A0B0",
  "Red or orange":           "#C4622D",
  "Deep blue or purple":     "#4A3F7A",
  "Black, charcoal, or dark green": "#2A2A35",
};

const GLAMOUR_SWATCHES: Record<string, Array<{ name: string; hex: string }>> = {
  "Gold or amber":           [{ name: "Gold",       hex: "#C9A84C" }, { name: "Amber",       hex: "#D4813A" }],
  "Silver or white":         [{ name: "Silver",     hex: "#C8D0D8" }, { name: "White",       hex: "#EFEFEF" }],
  "Silver or pale yellow":   [{ name: "Silver",     hex: "#C8D0D8" }, { name: "Pale yellow", hex: "#E4DF9A" }],
  "Rose pink or soft green": [{ name: "Rose pink",  hex: "#E8A0B0" }, { name: "Soft green",  hex: "#A8C4A0" }],
  "Red or orange":           [{ name: "Red",        hex: "#C4622D" }, { name: "Orange",      hex: "#D4813A" }],
  "Deep blue or purple":     [{ name: "Deep blue",  hex: "#3A4A8A" }, { name: "Purple",      hex: "#6A3F8A" }],
  "Black, charcoal, or dark green": [
    { name: "Black",      hex: "#1A1A22" },
    { name: "Charcoal",   hex: "#404048" },
    { name: "Dark green", hex: "#2A4A32" },
  ],
};

const CRYSTAL_PROPERTIES: Record<string, string[]> = {
  "Citrine":          ["Confidence", "Abundance", "Sun"],
  "Moonstone":        ["Intuition", "Feeling",    "Moon"],
  "Blue Lace Agate":  ["Clarity",   "Expression", "Mercury"],
  "Rose Quartz":      ["Love",      "Beauty",     "Venus"],
  "Carnelian":        ["Courage",   "Action",     "Mars"],
  "Lapis Lazuli":     ["Wisdom",    "Expansion",  "Jupiter"],
  "Black Tourmaline": ["Protection","Grounding",  "Saturn"],
  "Amethyst":         ["Intuition", "Peace",      "Neptune"],
  "Obsidian":         ["Truth",     "Release",    "Pluto"],
};

const ZODIAC_SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;

const MOCK_AI_RITUAL = `The Moon moves through your sky with quiet certainty, and today she asks you to be equally unhurried. Begin your morning by placing both hands flat on a surface — desk, floor, earth — and breathing until you feel the solidity beneath you. You are here. This is real.

Your ritual today weaves the energy of the moon's current phase with the planetary ruler of this day. Write your one clearest desire at the top of a page, then spend ten minutes writing beneath it — not how you'll get there, but how it will feel when you're living it. Use the present tense. Use specificity. Not "I want abundance" but "I am the kind of woman who..."

Tonight, before sleep, read what you wrote aloud. Then place your crystal on top of it. Let your words and your intention be held while you rest. The work you've done today doesn't disappear in sleep — it deepens.`;

// ─── Ritual card state system ─────────────────────────────────────────────────

type RitualState = "active" | "done" | "upcoming" | "missed";

const RITUAL_WINDOWS: Record<CheckinKey, string[]> = {
  morning:  ["dawn"],
  journal:  ["dawn", "day", "dusk", "night"],  // zawsze dostępny
  mirror:   ["dawn", "day", "dusk", "night"],  // zawsze dostępny
  crystal:  ["dawn", "day", "dusk", "night"],  // zawsze dostępny
  wear:     ["dawn", "day", "dusk", "night"],  // zawsze dostępny
  evening:  ["dusk", "night"],                  // fix: wieczór + noc
};

const MODE_ORDER = ["dawn", "day", "dusk", "night"] as const;

const UPCOMING_MSGS: Partial<Record<CheckinKey, string>> = {
  morning: "Dawn holds this ritual. Return at sunrise.",
  journal: "Dawn holds this ritual. Return at sunrise.",
  mirror:  "Dawn holds this ritual. Return at sunrise.",
  wear:    "Dawn holds this ritual. Return at sunrise.",
  evening: "The evening will bring this ritual to you.",
};

const MISSED_MSGS: Partial<Record<CheckinKey, string>> = {
  morning: "This ritual lives in the morning. It will return tomorrow.",
  journal: "This ritual lives in the morning. It will return tomorrow.",
  mirror:  "This ritual lives in the morning. It will return tomorrow.",
  wear:    "This ritual lives in the morning. It will return tomorrow.",
  evening: "Some rituals belong to their hour. This one will meet you again.",
};

function getRitualState(key: CheckinKey, colorMode: string, checkedKeys: CheckinKey[]): RitualState {
  if (checkedKeys.includes(key)) return "done";
  const windows = RITUAL_WINDOWS[key];
  if (windows.includes(colorMode)) return "active";
  const currentIdx = MODE_ORDER.indexOf(colorMode as typeof MODE_ORDER[number]);
  const firstIdx   = MODE_ORDER.indexOf(windows[0] as typeof MODE_ORDER[number]);
  return currentIdx < firstIdx ? "upcoming" : "missed";
}

// ─── Energy of the Day Card ───────────────────────────────────────────────────

type DayMode = "begin" | "build" | "manifest" | "release" | "rest";

const PHASE_TO_MODE: Record<string, DayMode> = {
  "New Moon":       "begin",
  "Waxing Crescent":"begin",
  "First Quarter":  "build",
  "Waxing Gibbous": "build",
  "Full Moon":      "manifest",
  "Waning Gibbous": "release",
  "Last Quarter":   "release",
  "Waning Crescent":"rest",
};

const MODE_CONFIG: Record<DayMode, { label: string; color: string }> = {
  begin:    { label: "A day to begin",    color: "#5BA89A" },
  build:    { label: "A day to build",    color: "#C9A84C" },
  manifest: { label: "A day to manifest", color: "#E89B5C" },
  release:  { label: "A day to release",  color: "#C06070" },
  rest:     { label: "A day to rest",     color: "#8B6EB0" },
};

interface EnergyContent {
  guidance: string;
  question: string;
  crystal: { name: string; detail: string };
}

const ENERGY_CONTENT: Record<DayMode, Record<string, EnergyContent>> = {
  begin: {
    Sun:     { guidance: "The Sun rises on new ground. Begin what you've been waiting to start.", question: "What am I ready to plant?", crystal: { name: "Citrine", detail: "held in the morning light" } },
    Moon:    { guidance: "The Moon begins her cycle with you. Trust what stirs beneath the surface.", question: "What intention wants to be born?", crystal: { name: "Moonstone", detail: "placed on your chest" } },
    Mercury: { guidance: "Mercury opens a channel. Write the first words before you're ready.", question: "What wants to be named?", crystal: { name: "Blue Lace Agate", detail: "held while writing" } },
    Venus:   { guidance: "Venus blesses what begins in beauty. Start with what you love.", question: "What am I beginning for love's sake?", crystal: { name: "Rose Quartz", detail: "worn close to the heart" } },
    Mars:    { guidance: "Mars ignites what you've hesitated to start. Act before you overthink.", question: "What am I ready to claim?", crystal: { name: "Carnelian", detail: "carried in the right hand" } },
    Jupiter: { guidance: "Jupiter opens the door wide. Step through.", question: "What would I begin if I knew I couldn't fail?", crystal: { name: "Lapis Lazuli", detail: "touched before the threshold" } },
    Saturn:  { guidance: "Saturn honors what begins with intention. Build the foundation first.", question: "What am I committed to?", crystal: { name: "Black Tourmaline", detail: "set at your desk" } },
  },
  build: {
    Sun:     { guidance: "The Sun amplifies your effort. What you build now shines.", question: "What am I building toward?", crystal: { name: "Citrine", detail: "kept near your work" } },
    Moon:    { guidance: "The Moon supports slow, steady growth. Trust the pace.", question: "What needs tending, not rushing?", crystal: { name: "Moonstone", detail: "in your pocket" } },
    Mercury: { guidance: "Mercury sharpens the mind. Refine before you expand.", question: "What needs clarity before the next step?", crystal: { name: "Blue Lace Agate", detail: "on your desk" } },
    Venus:   { guidance: "Venus softens the climb. What you've grown is almost ready — tend it.", question: "What is nearly ready to be shared?", crystal: { name: "Rose Quartz", detail: "warmed in the palm" } },
    Mars:    { guidance: "Mars fuels the push. This is the moment to act decisively.", question: "What decision am I ready to make?", crystal: { name: "Carnelian", detail: "in the active hand" } },
    Jupiter: { guidance: "Jupiter expands what you're building. Think one size larger.", question: "Where can I think bigger?", crystal: { name: "Lapis Lazuli", detail: "under the light" } },
    Saturn:  { guidance: "Saturn rewards sustained effort. Do the work without looking for shortcuts.", question: "What requires my full attention today?", crystal: { name: "Black Tourmaline", detail: "on your work surface" } },
  },
  manifest: {
    Sun:     { guidance: "The Sun and Moon align at their peak. Let yourself be seen.", question: "What am I ready to claim out loud?", crystal: { name: "Citrine", detail: "worn visibly" } },
    Moon:    { guidance: "The Full Moon is in her fullness. You are too. Receive.", question: "What has arrived that I haven't acknowledged?", crystal: { name: "Moonstone", detail: "charged in moonlight" } },
    Mercury: { guidance: "Mercury carries your words to their destination. Speak what matters.", question: "What truth am I ready to say?", crystal: { name: "Blue Lace Agate", detail: "held at the throat" } },
    Venus:   { guidance: "Venus at the peak. Beauty, love, and pleasure are yours to receive.", question: "What do I love about where I am?", crystal: { name: "Rose Quartz", detail: "near the heart" } },
    Mars:    { guidance: "Mars at the full moon: power meets courage. Take the leap.", question: "What bold move has been waiting?", crystal: { name: "Carnelian", detail: "gripped with intention" } },
    Jupiter: { guidance: "Jupiter amplifies the Full Moon. Something bigger than expected is arriving.", question: "What abundance am I ready to receive?", crystal: { name: "Lapis Lazuli", detail: "facing upward" } },
    Saturn:  { guidance: "Saturn at the Full Moon: results. The work you've done is showing.", question: "What am I proud of building?", crystal: { name: "Black Tourmaline", detail: "acknowledged, not carried" } },
  },
  release: {
    Sun:     { guidance: "The Sun begins its retreat. Release what no longer needs your full light.", question: "What am I ready to let go?", crystal: { name: "Citrine", detail: "set down, not carried" } },
    Moon:    { guidance: "The Moon releases. Your feelings know the way — let them move through.", question: "What emotion is ready to be felt and freed?", crystal: { name: "Moonstone", detail: "held loosely" } },
    Mercury: { guidance: "Mercury clears the channel. Let old stories go.", question: "What story am I finally done telling?", crystal: { name: "Blue Lace Agate", detail: "set aside" } },
    Venus:   { guidance: "Venus releases with grace. What you let go of, you honor.", question: "What am I releasing with love?", crystal: { name: "Rose Quartz", detail: "placed by an open window" } },
    Mars:    { guidance: "Mars releases what it can't control. Act on what's yours; release the rest.", question: "What am I trying to force that I can let go?", crystal: { name: "Carnelian", detail: "cleansed under water" } },
    Jupiter: { guidance: "Jupiter releases excess. Wisdom is knowing what to put down.", question: "What have I been carrying that isn't mine?", crystal: { name: "Lapis Lazuli", detail: "returned to earth" } },
    Saturn:  { guidance: "Saturn closes the cycle. Completion is the gift. Let this chapter end.", question: "What am I ready to finish?", crystal: { name: "Black Tourmaline", detail: "boundaries honored" } },
  },
  rest: {
    Sun:     { guidance: "The Sun prepares for its return. You are allowed to restore.", question: "What does rest look like today?", crystal: { name: "Citrine", detail: "set in the window" } },
    Moon:    { guidance: "The Moon rests in darkness. She asks you to do the same.", question: "What would I do if I needed nothing from myself?", crystal: { name: "Moonstone", detail: "under the pillow" } },
    Mercury: { guidance: "Mercury quiets. Less speaking, more listening.", question: "What do I hear when I go still?", crystal: { name: "Blue Lace Agate", detail: "beside the bed" } },
    Venus:   { guidance: "Venus in the quiet. Rest is its own form of beauty.", question: "How can I be gentle with myself today?", crystal: { name: "Rose Quartz", detail: "anywhere soft" } },
    Mars:    { guidance: "Mars rests. Stillness is strength replenishing itself.", question: "What would I do if being still were enough?", crystal: { name: "Carnelian", detail: "set down intentionally" } },
    Jupiter: { guidance: "Jupiter in contemplation. Great expansion begins in silence.", question: "What is quietly growing that I haven't noticed?", crystal: { name: "Lapis Lazuli", detail: "held still" } },
    Saturn:  { guidance: "Saturn honors rest as structure. Sleep is not laziness.", question: "What boundary am I setting to protect my rest?", crystal: { name: "Black Tourmaline", detail: "at the threshold" } },
  },
};

// Premium Moon SVG — warstwowy: poświata, kula, powierzchnia, rim light, cień fazy
function PremiumMoon({ phase }: { phase: string }) {
  // Pozycja cienia (cx) tworzy fazę — przesuwa okrąg cienia nad dyskiem
  const shadowCx: Record<string, number> = {
    "New Moon":       37,
    "Waxing Crescent":48,
    "First Quarter":  50,
    "Waxing Gibbous": 54,
    "Full Moon":      90,
    "Waning Gibbous": 20,
    "Last Quarter":   24,
    "Waning Crescent":26,
  };
  const cx = shadowCx[phase] ?? 90;
  const isNew = phase === "New Moon";
  const isFull = phase === "Full Moon";

  return (
    <svg width="74" height="74" viewBox="0 0 74 74" aria-hidden="true">
      <defs>
        <radialGradient id="pmSphere" cx="40%" cy="38%" r="68%">
          <stop offset="0%"   stopColor="#FDF6E4"/>
          <stop offset="60%"  stopColor="#EFE0C4"/>
          <stop offset="100%" stopColor="#CDB896"/>
        </radialGradient>
        <radialGradient id="pmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="50%"  stopColor="rgba(255,240,210,0.45)"/>
          <stop offset="100%" stopColor="rgba(255,240,210,0)"/>
        </radialGradient>
        {/* New Moon: ciemna kula */}
        <radialGradient id="pmNewSphere" cx="40%" cy="38%" r="68%">
          <stop offset="0%"   stopColor="#2A2440"/>
          <stop offset="100%" stopColor="#1A1228"/>
        </radialGradient>
        <filter id="pmCrater"><feGaussianBlur stdDeviation="1.0"/></filter>
        <filter id="pmTerminator"><feGaussianBlur stdDeviation="2.2"/></filter>
        <clipPath id="pmDisc"><circle cx="37" cy="37" r="26"/></clipPath>
      </defs>

      {/* 1. Atmosferyczna poświata */}
      {!isNew && <circle cx="37" cy="37" r="37" fill="url(#pmGlow)"/>}
      {isFull && <circle cx="37" cy="37" r="37" fill="rgba(255,240,210,0.15)"/>}

      {/* 2. Kula z cieniowaniem */}
      <circle cx="37" cy="37" r="26" fill={isNew ? "url(#pmNewSphere)" : "url(#pmSphere)"}/>

      {/* 3. Maria + kratery (tylko gdy widoczna powierzchnia) */}
      {!isNew && (
        <g clipPath="url(#pmDisc)" opacity="0.22">
          <ellipse cx="28" cy="26" rx="8"  ry="6"  fill="#A89070" filter="url(#pmCrater)"/>
          <ellipse cx="44" cy="34" rx="9"  ry="7"  fill="#9A8568" filter="url(#pmCrater)"/>
          <ellipse cx="31" cy="44" rx="5"  ry="5"  fill="#A89070" filter="url(#pmCrater)"/>
          <circle  cx="24" cy="37" r="2.5"         fill="#8A7558" filter="url(#pmCrater)"/>
          <circle  cx="38" cy="21" r="2"           fill="#8A7558" filter="url(#pmCrater)"/>
        </g>
      )}

      {/* 4. Rim light — jaśniejszy punkt w górnej-lewej krawędzi */}
      {!isNew && (
        <circle cx="29" cy="29" r="8" fill="rgba(255,255,255,0.25)"
          filter="url(#pmTerminator)" clipPath="url(#pmDisc)"/>
      )}

      {/* 5. Cień fazy — mocno rozmyty terminator */}
      {!isFull && (
        <g clipPath="url(#pmDisc)">
          <circle cx={cx} cy="37" r="26" fill={isNew ? "rgba(0,0,0,0)" : "#15101F"}
            filter={isNew ? undefined : "url(#pmTerminator)"}/>
        </g>
      )}

      {/* New Moon: subtelna krawędź */}
      {isNew && <circle cx="37" cy="37" r="25.5" fill="none" stroke="rgba(155,139,184,0.25)" strokeWidth="1"/>}
    </svg>
  );
}

// Mode glyph icons
function ModeGlyph({ mode, color }: { mode: DayMode; color: string }) {
  const p = { width: 18, height: 18, fill: "none", xmlns: "http://www.w3.org/2000/svg" };
  if (mode === "begin") return (
    <svg {...p} viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="3" fill={color} />
      <circle cx="9" cy="9" r="6.5" stroke={color} strokeWidth="0.75" opacity="0.4" />
    </svg>
  );
  if (mode === "build") return (
    <svg {...p} viewBox="0 0 18 18">
      <path d="M9 14V4M5 8l4-4 4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (mode === "manifest") return (
    <svg {...p} viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="3" fill={color} />
      {[0,45,90,135,180,225,270,315].map((a, i) => (
        <line key={i}
          x1={9 + Math.cos(a * Math.PI / 180) * 5.5} y1={9 + Math.sin(a * Math.PI / 180) * 5.5}
          x2={9 + Math.cos(a * Math.PI / 180) * 7.5} y2={9 + Math.sin(a * Math.PI / 180) * 7.5}
          stroke={color} strokeWidth="1" strokeLinecap="round"
        />
      ))}
    </svg>
  );
  if (mode === "release") return (
    <svg {...p} viewBox="0 0 18 18">
      <path d="M9 4v10M5 10l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  // rest
  return (
    <svg {...p} viewBox="0 0 18 18">
      <path d="M11.5 5A6 6 0 0 0 6 14a6 6 0 0 0 8-5.5A4 4 0 0 1 11.5 5z" stroke={color} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

// Static star positions — deterministic, no hydration mismatch
const CARD_STARS = [
  { top: "12%", left: "8%",  size: 1.5, opacity: 0.5,  delay: "0s"   },
  { top: "20%", left: "85%", size: 1,   opacity: 0.3,  delay: "0.8s" },
  { top: "35%", left: "15%", size: 1,   opacity: 0.4,  delay: "1.5s" },
  { top: "8%",  left: "55%", size: 2,   opacity: 0.6,  delay: "0.3s" },
  { top: "60%", left: "88%", size: 1,   opacity: 0.35, delay: "2.1s" },
  { top: "75%", left: "6%",  size: 1.5, opacity: 0.4,  delay: "1.1s" },
  { top: "45%", left: "92%", size: 1,   opacity: 0.3,  delay: "1.8s" },
  { top: "88%", left: "40%", size: 1,   opacity: 0.25, delay: "0.6s" },
  { top: "15%", left: "38%", size: 1,   opacity: 0.35, delay: "2.5s" },
  { top: "55%", left: "22%", size: 1.5, opacity: 0.4,  delay: "1.3s" },
];

function EnergyCard({ moonPhase, dayRuler }: { moonPhase: string; dayRuler: string }) {
  const mode = PHASE_TO_MODE[moonPhase] ?? "manifest";
  const modeConfig = MODE_CONFIG[mode];
  const content = ENERGY_CONTENT[mode][dayRuler] ?? ENERGY_CONTENT[mode]["Sun"];
  const isFullMoon = moonPhase === "Full Moon";

  return (
    <div className="energy-card" style={{
      background: "linear-gradient(180deg, #0D0A1A 0%, #1A0D35 70%, #241540 100%)",
      borderRadius: 18,
      padding: "22px 20px 24px",
      boxShadow: "0 8px 30px rgba(20, 10, 40, 0.4)",
      position: "relative",
      overflow: "hidden",
      marginBottom: 12,
    }}>
      {/* Stars */}
      {CARD_STARS.map((s, i) => (
        <div key={i} aria-hidden="true" style={{
          position: "absolute", top: s.top, left: s.left,
          width: s.size, height: s.size,
          background: "#FFFFFF", borderRadius: "50%",
          opacity: s.opacity,
          animation: `twinkle 2s ${s.delay} ease-in-out infinite alternate`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Top label */}
      <p style={{
        fontFamily: "var(--font-inter)", fontSize: 9,
        letterSpacing: "0.18em", color: "#9B8BB8",
        textTransform: "uppercase", textAlign: "center",
        margin: "0 0 18px",
      }}>
        Energy of the Day
      </p>

      {/* Moon — Premium SVG warstwowy */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14,
        filter: isFullMoon ? "drop-shadow(0 0 12px rgba(245,232,208,0.5))" : undefined }}>
        <PremiumMoon phase={moonPhase} />
      </div>

      {/* Phase name */}
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 24, fontWeight: 400,
        color: "#F0EAF8", textAlign: "center",
        margin: "0 0 10px", lineHeight: 1.1,
      }}>
        {moonPhase}
      </p>

      {/* Day mode */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 14 }}>
        <ModeGlyph mode={mode} color={modeConfig.color} />
        <span style={{
          fontFamily: "var(--font-inter)", fontSize: 12,
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: modeConfig.color, fontWeight: 500,
        }}>
          {modeConfig.label}
        </span>
      </div>

      {/* Guidance */}
      <p style={{
        fontFamily: "var(--font-inter)", fontSize: 13,
        color: "#C8B8D8", textAlign: "center",
        lineHeight: 1.55, margin: "0 8px",
      }}>
        {content.guidance}
      </p>

      {/* Gold divider */}
      <div style={{
        width: 30, height: 0.5,
        background: "rgba(201,168,76,0.4)",
        margin: "16px auto",
      }} />

      {/* Question */}
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 15, fontStyle: "italic",
        color: "#E8DCC8", textAlign: "center",
        lineHeight: 1.4, margin: "0 8px 14px",
      }}>
        &ldquo;{content.question}&rdquo;
      </p>

      {/* Crystal detail */}
      <p style={{
        fontFamily: "var(--font-inter)", fontSize: 11,
        color: "#9B8BB8", textAlign: "center",
        letterSpacing: "0.02em", margin: 0,
      }}>
        <strong style={{ color: "#C9A899", fontWeight: 400 }}>{content.crystal.name}</strong>
        {" · "}{content.crystal.detail}
      </p>
    </div>
  );
}

// ─── Glance line helpers ──────────────────────────────────────────────────────

function truncateWords(text: string, max: number): string {
  const words = text.split(" ");
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ") + "…";
}

// ─── Upsell localStorage helpers ─────────────────────────────────────────────

function getUpsellVisible(): boolean {
  if (typeof window === "undefined") return false;
  const until = localStorage.getItem("kalyra_upsell_until");
  if (until && new Date(until) > new Date()) return false;
  return true;
}

function recordUpsellDismiss(): void {
  const count = parseInt(localStorage.getItem("kalyra_upsell_count") ?? "0") + 1;
  localStorage.setItem("kalyra_upsell_count", String(count));
  if (count >= 3) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    localStorage.setItem("kalyra_upsell_until", d.toISOString().slice(0, 10));
    localStorage.setItem("kalyra_upsell_count", "0");
  }
}

function calculateRoughRising(sunSign: string, birthTime: string): string {
  const hour = parseInt(birthTime.split(":")[0] ?? "12");
  const sunIdx = ZODIAC_SIGNS.indexOf(sunSign as typeof ZODIAC_SIGNS[number]);
  if (sunIdx === -1) return "Libra";
  const risingIdx = ((sunIdx + Math.round(hour / 2)) % 12 + 12) % 12;
  return ZODIAC_SIGNS[risingIdx];
}

// ─── SectionCard ──────────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  tag,
  checkinKey,
  state = "active",
  onMarkComplete,
  children,
  accent,
  defaultExpanded = false,
  glanceLine,
  stateMessage,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  tag?: string;
  checkinKey?: CheckinKey;
  state?: RitualState;
  onMarkComplete?: () => void;
  children: React.ReactNode;
  accent?: string;
  defaultExpanded?: boolean;
  glanceLine?: string;
  stateMessage?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(state === "active" ? defaultExpanded : false);
  const [shimmerActive, setShimmerActive] = useState(false);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (prevStateRef.current === state) return;
    if (state === "done") {
      // do NOT auto-collapse — user may still want to read
    } else if (state === "active") {
      setIsExpanded(defaultExpanded);
    } else {
      setIsExpanded(false);
    }
    prevStateRef.current = state;
  }, [state, defaultExpanded]);

  const handleMarkComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShimmerActive(true);
    setTimeout(() => setShimmerActive(false), 450);
    onMarkComplete?.();
  };

  const canToggle   = state === "active" || state === "done";
  const accentColor = state === "missed" ? "var(--divider)" : (accent ?? "#C9A84C");
  const iconColor   = state === "upcoming" || state === "missed" ? "var(--muted-foreground)" : accentColor;

  return (
    <div
      className={`fade-in kalyra-card ritual-card--${state}`}
      style={{
        background:   "var(--card)",
        borderRadius: 16,
        borderLeft:   `3px solid ${accentColor}`,
        marginBottom: 12,
        position:     "relative",
        overflow:     "hidden",
        transition:   "opacity 300ms ease",
        cursor:       canToggle ? "pointer" : "default",
      }}
      onClick={canToggle ? () => setIsExpanded((v) => !v) : undefined}
    >
      {/* Gold shimmer on mark complete */}
      {shimmerActive && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmerOnce 400ms ease-out forwards",
          pointerEvents: "none", zIndex: 2,
        }} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3" style={{ padding: "14px 16px 14px 20px" }}>
        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
          <div className="flex items-center gap-2.5">
            <Icon size={18} color={iconColor} />
            <h3 style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600, fontSize: 11,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: state === "upcoming" || state === "missed" ? "var(--muted-foreground)" : accentColor,
              margin: 0,
            }}>
              {title}
            </h3>
            {tag && state === "active" && (
              <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{
                fontFamily: "var(--font-inter)", fontWeight: 500,
                color: "var(--muted-foreground)", border: "1px solid var(--border)",
              }}>
                {tag}
              </span>
            )}
          </div>

          {/* State messages */}
          {(state === "upcoming" || state === "missed") && stateMessage && (
            <p style={{
              fontFamily: "var(--font-inter)", fontSize: 12,
              color: "var(--muted-foreground)", margin: 0,
              fontStyle: "italic", lineHeight: 1.4,
            }}>
              {stateMessage}
            </p>
          )}

          {/* Subtitle — persists in both collapsed and expanded state (spec v9.1) */}
          {glanceLine && state !== "upcoming" && state !== "missed" && (
            <p className="rcard-glance" style={{
              fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 400,
              color: "var(--muted-foreground)", margin: "2px 0 0 0",
              lineHeight: 1.4, letterSpacing: "0.01em",
            }}>
              {glanceLine}
            </p>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {state === "active" && onMarkComplete && (
            <button className="btn-mark-complete" onClick={handleMarkComplete}>
              Done
            </button>
          )}
          {state === "done" && (
            <span style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600, color: "var(--primary)" }}>
              ✓ Done
            </span>
          )}
          {canToggle && (
            isExpanded
              ? <ChevronUp   size={16} color="var(--muted-foreground)" />
              : <ChevronDown size={16} color="var(--muted-foreground)" />
          )}
        </div>
      </div>

      {/* Body — only when expanded and interactive */}
      {isExpanded && canToggle && (
        <div
          style={{ padding: "0 16px 16px 20px", color: "var(--foreground)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── RitualList ───────────────────────────────────────────────────────────────

function RitualList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span
            className="shrink-0 flex items-center justify-center"
            style={{
              width:        24,
              height:       24,
              borderRadius: "50%",
              background:   "var(--secondary)",
              color:        "var(--primary)",
              fontSize:     12,
              fontWeight:   600,
              fontFamily:   "var(--font-inter)",
            }}
          >
            {i + 1}
          </span>
          <span className="text-base leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

// ─── Rich card bodies ─────────────────────────────────────────────────────────

/** Morning/Evening Ritual — sekwencja rytuału, nie checklista (spec v9) */
function MorningRitualBody({ steps }: { steps: string[] }) {
  const ROMAN = ["i","ii","iii","iv","v","vi","vii","viii","ix","x"];
  return (
    <div>
      {steps.map((step, i) => (
        <div key={i} style={{
          display: "flex", gap: 14,
          padding: "11px 0",
          alignItems: "flex-start",
          borderTop: i > 0 ? "0.5px solid rgba(201,168,76,0.15)" : "none",
        }}>
          <span style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle: "italic",
            fontSize: 19,
            color: "var(--primary)",
            flexShrink: 0,
            width: 20,
            textAlign: "center",
            lineHeight: 1.35,
          }}>
            {ROMAN[i] ?? String(i + 1)}
          </span>
          <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--foreground)" }}>{step}</span>
        </div>
      ))}
    </div>
  );
}

/** Journal Prompt — lined paper with prompt */
function JournalBody({ prompt }: { prompt: string }) {
  const LINE_COUNT = 5;
  return (
    <div style={{
      position: "relative", borderRadius: 10,
      background: "var(--secondary)", padding: "14px 14px 18px",
      overflow: "hidden",
    }}>
      {/* Horizontal ruled lines */}
      {Array.from({ length: LINE_COUNT }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: 14, right: 14,
          top: 46 + i * 28, height: "0.5px",
          background: "var(--border)", opacity: 0.55,
          pointerEvents: "none",
        }} />
      ))}
      {/* Prompt */}
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 17, fontStyle: "italic", lineHeight: 1.7,
        color: "var(--foreground)", margin: 0, position: "relative", zIndex: 1,
      }}>
        &ldquo;{prompt}&rdquo;
      </p>
      {/* Start writing hint */}
      <p style={{
        fontFamily: "var(--font-inter)", fontSize: 11,
        color: "var(--muted-foreground)", margin: "10px 0 0",
        fontStyle: "italic", opacity: 0.5, position: "relative", zIndex: 1,
      }}>
        Start writing…
      </p>
    </div>
  );
}

/** Mirror Reflection — affirmation + mirror echo feature (spec v9.1: no "read aloud" label, controlled reflection) */
function MirrorBody({ reflection }: { reflection: string }) {
  return (
    <div>
      {/* Affirmation — "Read aloud · in the mirror" is already in subtitle */}
      <div className="quote-block" style={{ textAlign: "center", marginBottom: 0 }}>
        &ldquo;{reflection}&rdquo;
      </div>
      {/* Mirror echo — intentional feature: the reflection in the mirror */}
      <div
        aria-hidden="true"
        style={{
          maxHeight: 40,
          overflow: "hidden",
          transform: "scaleY(-1)",
          opacity: 0.10,
          filter: "blur(0.5px)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 55%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 55%)",
          pointerEvents: "none", userSelect: "none",
          fontFamily: "var(--font-cormorant), serif",
          fontSize: 17, fontStyle: "italic", lineHeight: 1.7,
          color: "var(--foreground)", textAlign: "center",
          marginTop: 4, padding: "0 4px",
        }}
      >
        &ldquo;{reflection}&rdquo;
      </div>
    </div>
  );
}

/** Crystal of the Day — icon + phase meaning + chips + how to use (spec v9.1: no name/carry repetition) */
function CrystalBody({ name, why, howToUse }: { name: string; why: string; howToUse: string }) {
  const chips = CRYSTAL_PROPERTIES[name] ?? [];
  return (
    <div>
      {/* Icon centered — name is already in subtitle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <CrystalIcon name={name} size={52} />
      </div>
      {/* Phase connection — the why */}
      <p style={{
        fontFamily: "var(--font-inter)", fontSize: 13,
        color: "var(--muted-foreground)", lineHeight: 1.5,
        margin: "0 0 12px",
      }}>
        {why.split(".")[0]}.
      </p>
      {/* Property chips */}
      {chips.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 0 }}>
          {chips.map((chip) => (
            <span key={chip} style={{
              fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500,
              color: "var(--muted-foreground)",
              border: "1px solid var(--border)", borderRadius: 20,
              padding: "3px 9px",
            }}>
              {chip}
            </span>
          ))}
        </div>
      )}
      {/* How to use */}
      {howToUse && (
        <p style={{
          fontFamily: "var(--font-inter)", fontSize: 13,
          color: "var(--muted-foreground)", lineHeight: 1.5,
          marginTop: 12, paddingTop: 12, marginBottom: 0,
          borderTop: "0.5px solid var(--border)",
        }}>
          {truncateWords(howToUse, 20)}
        </p>
      )}
    </div>
  );
}

// Intention per color — zamienia "co założyć" na "dlaczego" (spec v9 opcja B)
const GLAMOUR_INTENTIONS: Record<string, string> = {
  "Gold or amber":           "Carry the Sun's color today.",
  "Silver or white":         "Wear the light of reflection.",
  "Silver or pale yellow":   "Dress in clarity and calm.",
  "Rose pink or soft green": "Wear what opens the heart.",
  "Red or orange":           "Dress as the fire you're calling in.",
  "Deep blue or purple":     "Wear the depth of what you know.",
  "Black, charcoal, or dark green": "Dress as the earth that holds you.",
};

/** Glamour Magic — jewel swatches + ritual intention (spec v9) */
function GlamourBody({ colorName }: { colorName: string }) {
  const swatches = GLAMOUR_SWATCHES[colorName]
    ?? [{ name: colorName, hex: GLAMOUR_COLOR_MAP[colorName] ?? "#C9A84C" }];
  const intention = GLAMOUR_INTENTIONS[colorName] ?? "Dress as the energy you're calling in.";

  return (
    <div>
      {/* Swatches — smaller, with gold border (bijouterie feel) */}
      <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-end" }}>
        {swatches.map((s) => (
          <div key={s.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: s.hex,
              border: "1px solid rgba(201,168,76,0.5)",
              boxShadow: "0 2px 8px rgba(120,60,40,0.15)",
            }} />
            <span style={{
              fontFamily: "var(--font-inter)", fontSize: 11,
              color: "var(--muted-foreground)", textAlign: "center",
            }}>
              {s.name}
            </span>
          </div>
        ))}
      </div>
      {/* Intention — rytuał, nie lista kolorów */}
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontSize: 15,
        color: "var(--foreground)", lineHeight: 1.5,
        margin: 0,
      }}>
        {intention}
      </p>
    </div>
  );
}

// ─── GlamourChip ──────────────────────────────────────────────────────────────

function GlamourChip({ colorName }: { colorName: string }) {
  const css = GLAMOUR_COLOR_MAP[colorName] ?? "#C9A84C";
  return (
    <span
      style={{
        display:       "inline-block",
        width:         12,
        height:        12,
        borderRadius:  "50%",
        background:    css,
        marginRight:   6,
        verticalAlign: "middle",
        border:        "1px solid rgba(0,0,0,0.1)",
        flexShrink:    0,
      }}
    />
  );
}

// ─── SacredDivider ────────────────────────────────────────────────────────────

function SacredDivider() {
  return (
    <div className="sacred-divider">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacred-divider__glyph">
        <path d="M5 0.5L9.5 5L5 9.5L0.5 5L5 0.5Z" stroke="currentColor" strokeWidth="0.75" fill="none"/>
      </svg>
    </div>
  );
}

// ─── ProgressCounter ──────────────────────────────────────────────────────────

function ProgressCounter({ done, total }: { done: number; total: number }) {
  const isFull = done === total;
  const [burst, setBurst] = useState(false);
  const prevDone = useRef(done);

  useEffect(() => {
    if (done === total && prevDone.current !== total) setBurst(true);
    prevDone.current = done;
  }, [done, total]);

  return (
    <div className="progress-counter kalyra-card" style={{ position: "relative", overflow: "hidden" }}>
      {burst && (
        <>
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * 360;
            const tx = Math.cos((angle * Math.PI) / 180) * 40;
            const ty = Math.sin((angle * Math.PI) / 180) * 40;
            return (
              <span
                key={i}
                style={{
                  position:   "absolute",
                  left:       "50%",
                  top:        "50%",
                  width:      6,
                  height:     6,
                  borderRadius: "50%",
                  background: "#C9A84C",
                  // @ts-expect-error css custom properties
                  "--tx":     `${tx}px`,
                  "--ty":     `${ty}px`,
                  animation:  "particleBurst 600ms ease-out forwards",
                  animationDelay: `${i * 30}ms`,
                }}
                onAnimationEnd={() => i === 9 && setBurst(false)}
              />
            );
          })}
        </>
      )}

      {isFull ? (
        <>
          <span style={{ color: "#C9A84C", fontSize: 18 }}>✦</span>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 600,
              fontSize:   14,
              color:      "var(--foreground)",
            }}
          >
            Full alignment today
          </span>
        </>
      ) : (
        <>
          <div className="ritual-progress-dots">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`progress-dot${i < done ? " progress-dot--filled" : ""}`}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize:   14,
              color:      "var(--muted-foreground)",
            }}
          >
            {done} of {total}
          </span>
        </>
      )}
    </div>
  );
}

// ─── UpsellCard ───────────────────────────────────────────────────────────────

function UpsellCard({ onAddBirthTime, onDismiss }: { onAddBirthTime: () => void; onDismiss: () => void }) {
  return (
    <div className="card--upsell">
      <p
        style={{
          fontFamily:  "var(--font-inter)",
          fontSize:    13,
          color:       "var(--muted-foreground)",
          lineHeight:  1.6,
          margin:      0,
        }}
      >
        <span style={{ color: "var(--primary)", marginRight: 6 }}>◐</span>
        <strong style={{ color: "var(--foreground)" }}>Kalyra knows your Sun &amp; Moon.</strong>
        <br />
        Add your birth time and she'll know your Rising too — and personalize your rituals completely.
      </p>
      <button className="upsell-cta" onClick={onAddBirthTime}>
        Add birth time →
      </button>
      <button
        onClick={onDismiss}
        style={{
          background:   "none",
          border:       "none",
          cursor:       "pointer",
          padding:      0,
          marginTop:    8,
          display:      "block",
          fontFamily:   "var(--font-inter)",
          fontSize:     12,
          color:        "var(--muted-foreground)",
        }}
      >
        Not now
      </button>
    </div>
  );
}

// ─── BirthTimeModal ───────────────────────────────────────────────────────────

function BirthTimeModal({
  onSave,
  onClose,
}: {
  onSave: (time: string) => void;
  onClose: () => void;
}) {
  const [time, setTime] = useState("12:00");

  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(0,0,0,0.6)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         100,
        padding:        24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background:   "var(--card)",
          borderRadius: 20,
          padding:      28,
          width:        "100%",
          maxWidth:     360,
          boxShadow:    "0 8px 32px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize:   22,
            fontWeight: 400,
            color:      "var(--foreground)",
            marginBottom: 8,
          }}
        >
          What time were you born?
        </h2>
        <p
          style={{
            fontFamily:   "var(--font-inter)",
            fontSize:     13,
            color:        "var(--muted-foreground)",
            marginBottom: 20,
            lineHeight:   1.5,
          }}
        >
          Your rising sign changes every 2 hours. Even an approximate time helps.
        </p>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            width:        "100%",
            padding:      "12px 16px",
            borderRadius: 10,
            border:       "1px solid var(--border)",
            background:   "var(--background)",
            color:        "var(--foreground)",
            fontFamily:   "var(--font-inter)",
            fontSize:     16,
            marginBottom: 16,
            boxSizing:    "border-box",
          }}
        />
        <div className="flex gap-3">
          <button
            onClick={() => onSave(time)}
            style={{
              flex:         1,
              padding:      "12px 0",
              borderRadius: 10,
              background:   "#C9A84C",
              color:        "#1A1208",
              border:       "none",
              fontFamily:   "var(--font-inter)",
              fontWeight:   600,
              fontSize:     14,
              cursor:       "pointer",
            }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            style={{
              padding:      "12px 16px",
              borderRadius: 10,
              background:   "var(--secondary)",
              color:        "var(--muted-foreground)",
              border:       "none",
              fontFamily:   "var(--font-inter)",
              fontSize:     14,
              cursor:       "pointer",
            }}
          >
            I don't know
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fade-in"
      style={{
        position:     "fixed",
        bottom:       90,
        left:         "50%",
        transform:    "translateX(-50%)",
        background:   "#C9A84C",
        color:        "#1A1208",
        padding:      "12px 20px",
        borderRadius: 24,
        fontFamily:   "var(--font-inter)",
        fontWeight:   600,
        fontSize:     14,
        zIndex:       200,
        whiteSpace:   "nowrap",
        boxShadow:    "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      {message}
    </div>
  );
}

// ─── TodayTab ─────────────────────────────────────────────────────────────────

export function TodayTab({ colorMode = "night" }: { colorMode?: "dawn" | "day" | "dusk" | "night" }) {
  const [astro, setAstro]         = useState<DailyAstrology | null>(null);
  const [checkins, setCheckins]   = useState<CheckinKey[]>([]);

  // Upsell
  const [showUpsell, setShowUpsell] = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  const profile = getProfile();

  useEffect(() => {
    setAstro(getDailyAstrology());
    setCheckins(getTodayCheckins());
    if (!profile?.birth_time) setShowUpsell(getUpsellVisible());
    const interval = setInterval(() => setAstro(getDailyAstrology()), 3600000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!astro) return null;

  const ritual = getRitual(astro.moonPhase, astro.dayRuler);
  const triggeredRituals = getTriggeredRituals(astro.moonPhase, astro.moonSign, astro.dayRuler);

  const RITUAL_TO_CARD: Record<string, CheckinKey> = {
    scripting: "morning", manifestation: "morning", moon_water: "morning", candle_magic: "morning",
    gratitude: "evening", meditation: "evening", dream_work: "evening",
    breathwork: "journal", bath_ritual: "evening",
  };
  const cardTags: Partial<Record<CheckinKey, string>> = {};
  triggeredRituals.forEach((r) => {
    const card = RITUAL_TO_CARD[r.id];
    if (card && !cardTags[card]) cardTags[card] = r.name;
  });

  const markComplete = (key: CheckinKey) => {
    const next = toggleCheckin(key);
    setCheckins(next);
  };

  const allCheckins: CheckinKey[] = ["morning", "journal", "mirror", "crystal", "wear", "evening"];
  const doneCount = checkins.length;

  const cardState = (key: CheckinKey) => getRitualState(key, colorMode, checkins);


  const handleSaveBirthTime = (time: string) => {
    if (!profile) return;
    const rising = calculateRoughRising(profile.sun_sign, time);
    saveProfile({ ...profile, birth_time: time, rising_sign: rising as typeof ZODIAC_SIGNS[number] });
    setShowModal(false);
    setShowUpsell(false);
    setToast(`Your Rising sign is ${rising}. Rituals updated.`);
    // Force re-render
    setAstro(getDailyAstrology());
  };

  const handleDismissUpsell = () => {
    recordUpsellDismiss();
    setShowUpsell(false);
  };

  const glamourChipColor = ritual.glamour.color;

  return (
    <>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-4">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="text-center space-y-4 px-1 pt-2 mb-5">
          <div className="flex items-center justify-center gap-3">
            <p
              className="header-date text-xs tracking-widest uppercase"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}
            >
              {astro.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
              {" · "}
              {astro.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
            </p>
          </div>

          <h1
            className="header-greeting kalyra-voice leading-none"
            style={{ fontSize: "clamp(2.4rem, 10vw, 3rem)", color: "var(--foreground)", fontWeight: 400, letterSpacing: "-0.01em" }}
          >
            Hello, {profile?.name ?? "friend"}.
          </h1>

          {profile && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ border: "1px solid var(--pill-border)", background: "var(--pill-bg)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="2.8" stroke="#C9A84C" strokeWidth="1"/>
                  <line x1="7" y1="0.5" x2="7" y2="2" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="7" y1="12" x2="7" y2="13.5" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="0.5" y1="7" x2="2" y2="7" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="12" y1="7" x2="13.5" y2="7" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="2.4" y1="2.4" x2="3.4" y2="3.4" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="10.6" y1="10.6" x2="11.6" y2="11.6" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="11.6" y1="2.4" x2="10.6" y2="3.4" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="3.4" y1="10.6" x2="2.4" y2="11.6" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "var(--pill-text)" }}>
                  {profile.sun_sign}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ border: "1px solid var(--pill-border)", background: "var(--pill-bg)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M9.5 2.5A5 5 0 0 0 4.5 7.5a5 5 0 0 0 5 4.5A5.5 5.5 0 0 1 4 7 5.5 5.5 0 0 1 9.5 2.5z" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "var(--pill-text)" }}>
                  {profile.moon_sign}
                </span>
              </div>
              {profile.rising_sign && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ border: "1px solid var(--pill-border)", background: "var(--pill-bg)" }}
                >
                  <span style={{ fontFamily: "var(--font-inter)", fontWeight: 700, color: "var(--primary)" }}>↑</span>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "var(--pill-text)" }}>
                    {profile.rising_sign}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ height: 1, background: "var(--divider)", marginBottom: 20 }} />

        {/* ── Energy of the Day Card ───────────────────────── */}
        <div className="energy-section">
          <div className="atmosphere-pool" aria-hidden="true" />
          <div className="aurora" aria-hidden="true" />
          <EnergyCard moonPhase={astro.moonPhase} dayRuler={astro.dayRuler} />
        </div>

        {/* Special event badges */}
        {astro.specialEvents.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {astro.specialEvents.map((ev, i) => (
              <Badge
                key={i}
                className="text-xs"
                style={{
                  fontFamily: "var(--font-inter)", fontWeight: 600,
                  background: "color-mix(in srgb, var(--primary) 15%, transparent)",
                  color: "var(--primary)",
                  border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
                }}
              >
                ✦ {ev.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Special event sections */}
        {astro.specialEvents.map((ev, i) => {
          const content = getSpecialSectionContent(ev.type);
          if (!content) return null;
          return (
            <SectionCard key={i} icon={IconEnergy} title={content.title} accent={CARD_ACCENTS.energy}>
              <p className="text-base leading-relaxed">{content.body}</p>
            </SectionCard>
          );
        })}

        <SacredDivider />

        {/* 3. Morning Ritual */}
        <SectionCard
          icon={IconSunrise}
          title="Morning Ritual"
          checkinKey="morning"
          tag={cardTags["morning"]}
          state={cardState("morning")}
          onMarkComplete={() => markComplete("morning")}
          accent={CARD_ACCENTS.morning}
          glanceLine={`A morning sequence · ${ritual.morningRitual.length} gestures`}
          stateMessage={
            cardState("morning") === "upcoming" ? UPCOMING_MSGS.morning :
            cardState("morning") === "missed"   ? MISSED_MSGS.morning   : undefined
          }
        >
          <MorningRitualBody steps={ritual.morningRitual} />
        </SectionCard>

        {/* 4. Journal Prompt */}
        <SectionCard
          icon={IconJournal}
          title="Journal Prompt"
          checkinKey="journal"
          tag={cardTags["journal"]}
          state={cardState("journal")}
          onMarkComplete={() => markComplete("journal")}
          accent={CARD_ACCENTS.journal}
          glanceLine="A question to sit with"
          stateMessage={
            cardState("journal") === "upcoming" ? UPCOMING_MSGS.journal :
            cardState("journal") === "missed"   ? MISSED_MSGS.journal   : undefined
          }
        >
          <JournalBody prompt={ritual.journalPrompt} />
        </SectionCard>

        {/* 5. Mirror Reflection */}
        <SectionCard
          icon={IconMirror}
          title="Mirror Reflection"
          checkinKey="mirror"
          state={cardState("mirror")}
          onMarkComplete={() => markComplete("mirror")}
          accent={CARD_ACCENTS.mirror}
          glanceLine="Read aloud · in the mirror"
          stateMessage={
            cardState("mirror") === "upcoming" ? UPCOMING_MSGS.mirror :
            cardState("mirror") === "missed"   ? MISSED_MSGS.mirror   : undefined
          }
        >
          <MirrorBody reflection={ritual.mirrorReflection} />
        </SectionCard>

        {/* 6. Crystal of the Day */}
        <SectionCard
          icon={IconCrystalSection}
          title="Crystal of the Day"
          checkinKey="crystal"
          state={cardState("crystal")}
          onMarkComplete={() => markComplete("crystal")}
          accent={CARD_ACCENTS.crystal}
          glanceLine={`${ritual.crystal.name} · carry it close`}
        >
          <CrystalBody
            name={ritual.crystal.name}
            why={ritual.crystal.why}
            howToUse={ritual.crystal.howToUse}
          />
        </SectionCard>

        {/* 7. Glamour Magic */}
        <SectionCard
          icon={IconGlamour}
          title="Glamour Magic — What to Wear"
          checkinKey="wear"
          state={cardState("wear")}
          onMarkComplete={() => markComplete("wear")}
          accent={CARD_ACCENTS.wear}
          glanceLine="Wear the day's color"
          stateMessage={
            cardState("wear") === "upcoming" ? UPCOMING_MSGS.wear :
            cardState("wear") === "missed"   ? MISSED_MSGS.wear   : undefined
          }
        >
          <GlamourBody colorName={ritual.glamour.color} />
        </SectionCard>

        {/* 8. Evening Ritual */}
        <SectionCard
          icon={IconEvening}
          title="Evening Ritual"
          checkinKey="evening"
          tag={cardTags["evening"]}
          state={cardState("evening")}
          onMarkComplete={() => markComplete("evening")}
          accent={CARD_ACCENTS.evening}
          glanceLine={`An evening sequence · ${ritual.eveningRitual.length} gestures`}
          stateMessage={
            cardState("evening") === "upcoming" ? UPCOMING_MSGS.evening :
            cardState("evening") === "missed"   ? MISSED_MSGS.evening   : undefined
          }
        >
          <MorningRitualBody steps={ritual.eveningRitual} />
        </SectionCard>

        {/* 9. Upsell */}
        {showUpsell && !profile?.birth_time && (
          <UpsellCard
            onAddBirthTime={() => setShowModal(true)}
            onDismiss={handleDismissUpsell}
          />
        )}

        {/* 10. Progress counter */}
        {doneCount > 0 && (
          <ProgressCounter done={doneCount} total={allCheckins.length} />
        )}

        <div className="h-4" />
      </div>

      {/* Birth time modal */}
      {showModal && (
        <BirthTimeModal
          onSave={handleSaveBirthTime}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
