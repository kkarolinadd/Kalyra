"use client";

import { useState, useEffect } from "react";
import { getProfile, saveProfile, getStreak } from "@/lib/storage";
import type { UserProfile } from "@/lib/storage";
import type { ZodiacSign } from "@/lib/astrology";

// ─── Sign data ────────────────────────────────────────────────────────────────

const signData: Record<ZodiacSign, { symbol: string; element: string; modality: string; elementClass: string }> = {
  Aries:       { symbol: "♈", element: "Fire",  modality: "Cardinal", elementClass: "fire"  },
  Taurus:      { symbol: "♉", element: "Earth", modality: "Fixed",    elementClass: "earth" },
  Gemini:      { symbol: "♊", element: "Air",   modality: "Mutable",  elementClass: "air"   },
  Cancer:      { symbol: "♋", element: "Water", modality: "Cardinal", elementClass: "water" },
  Leo:         { symbol: "♌", element: "Fire",  modality: "Fixed",    elementClass: "fire"  },
  Virgo:       { symbol: "♍", element: "Earth", modality: "Mutable",  elementClass: "earth" },
  Libra:       { symbol: "♎", element: "Air",   modality: "Cardinal", elementClass: "air"   },
  Scorpio:     { symbol: "♏", element: "Water", modality: "Fixed",    elementClass: "water" },
  Sagittarius: { symbol: "♐", element: "Fire",  modality: "Mutable",  elementClass: "fire"  },
  Capricorn:   { symbol: "♑", element: "Earth", modality: "Cardinal", elementClass: "earth" },
  Aquarius:    { symbol: "♒", element: "Air",   modality: "Fixed",    elementClass: "air"   },
  Pisces:      { symbol: "♓", element: "Water", modality: "Mutable",  elementClass: "water" },
};

// ─── Ritual matrix ────────────────────────────────────────────────────────────

type RitualKey =
  | "moonWater" | "candleMagic" | "crystalWork" | "bathRitual"
  | "journaling" | "scripting" | "mirrorWork" | "meditation"
  | "breathwork" | "dreamWork" | "manifestation" | "gratitude";

const ritualMatrix: Record<ZodiacSign, Record<RitualKey, number>> = {
  Aries:       { moonWater:3, candleMagic:3, crystalWork:1, bathRitual:2, journaling:1, scripting:2, mirrorWork:3, meditation:1, breathwork:3, dreamWork:1, manifestation:3, gratitude:2 },
  Taurus:      { moonWater:3, candleMagic:3, crystalWork:3, bathRitual:3, journaling:2, scripting:2, mirrorWork:3, meditation:3, breathwork:1, dreamWork:2, manifestation:3, gratitude:3 },
  Gemini:      { moonWater:2, candleMagic:2, crystalWork:2, bathRitual:1, journaling:3, scripting:3, mirrorWork:3, meditation:1, breathwork:3, dreamWork:2, manifestation:2, gratitude:2 },
  Cancer:      { moonWater:3, candleMagic:3, crystalWork:3, bathRitual:3, journaling:3, scripting:2, mirrorWork:2, meditation:3, breathwork:2, dreamWork:3, manifestation:3, gratitude:3 },
  Leo:         { moonWater:1, candleMagic:3, crystalWork:2, bathRitual:2, journaling:2, scripting:3, mirrorWork:3, meditation:2, breathwork:2, dreamWork:1, manifestation:3, gratitude:2 },
  Virgo:       { moonWater:2, candleMagic:2, crystalWork:3, bathRitual:3, journaling:3, scripting:3, mirrorWork:2, meditation:2, breathwork:3, dreamWork:2, manifestation:2, gratitude:3 },
  Libra:       { moonWater:3, candleMagic:3, crystalWork:3, bathRitual:3, journaling:2, scripting:2, mirrorWork:3, meditation:3, breathwork:3, dreamWork:2, manifestation:3, gratitude:3 },
  Scorpio:     { moonWater:3, candleMagic:3, crystalWork:3, bathRitual:3, journaling:3, scripting:2, mirrorWork:2, meditation:3, breathwork:1, dreamWork:3, manifestation:3, gratitude:2 },
  Sagittarius: { moonWater:2, candleMagic:3, crystalWork:2, bathRitual:2, journaling:2, scripting:3, mirrorWork:2, meditation:2, breathwork:3, dreamWork:1, manifestation:3, gratitude:3 },
  Capricorn:   { moonWater:2, candleMagic:2, crystalWork:3, bathRitual:2, journaling:3, scripting:3, mirrorWork:2, meditation:2, breathwork:2, dreamWork:1, manifestation:3, gratitude:2 },
  Aquarius:    { moonWater:2, candleMagic:2, crystalWork:2, bathRitual:1, journaling:3, scripting:3, mirrorWork:2, meditation:2, breathwork:3, dreamWork:2, manifestation:3, gratitude:2 },
  Pisces:      { moonWater:3, candleMagic:3, crystalWork:3, bathRitual:3, journaling:2, scripting:2, mirrorWork:2, meditation:3, breathwork:1, dreamWork:3, manifestation:3, gratitude:3 },
};

const ritualDisplayNames: Record<RitualKey, string> = {
  moonWater:     "Moon Water",
  candleMagic:   "Candle Magic",
  crystalWork:   "Crystal Work",
  bathRitual:    "Bath Ritual",
  journaling:    "Journaling",
  scripting:     "Scripting",
  mirrorWork:    "Mirror Work",
  meditation:    "Meditation",
  breathwork:    "Breathwork",
  dreamWork:     "Dream Work",
  manifestation: "Manifestation",
  gratitude:     "Gratitude Practice",
};

const RITUAL_LABELS: Record<number, { text: string; color: string } | null> = {
  6: { text: "natural gift", color: "#C9A84C" },
  5: { text: "strong",       color: "#4A9B8E" },
  4: { text: "medium",       color: "var(--muted-foreground)" },
  3: { text: "light",        color: "var(--muted-foreground)" },
  2: null,
};

// ─── Kalyra readings — Sun × Moon (partial coverage, fallback for missing) ───

const kalryaReadings: Partial<Record<string, string>> = {
  "Scorpio-Gemini": "Dives deep but needs air. Processes the darkest feelings through words — talking, writing, questioning. More intense than she appears, lighter than she feels.",
  "Scorpio-Scorpio": "Depths upon depths. Feels everything tenfold and trusts almost no one. When she loves, she transforms — herself and everyone around her.",
  "Scorpio-Cancer": "Water meeting water. Psychic, intuitive, protective. Her emotions are tidal — pull back before you drown, rest before you resurface.",
  "Scorpio-Pisces": "A mystic at heart. Dissolves boundaries between herself and others, dreams in symbols, heals through art and silence.",
  "Aries-Leo": "Built to lead and born to shine. Fears nothing — except being overlooked. Her fire is a gift; learn when to warm and when to step back.",
  "Aries-Aries": "Pure ignition. Acts before she thinks, loves before she plans. Her courage is real — her patience is the practice.",
  "Taurus-Virgo": "Earthy and exact. Builds beautiful things slowly and keeps them forever. Comfort is her language; quality is her love.",
  "Taurus-Capricorn": "Steady as stone, ambitious as mountains. She takes the long view on everything — love, work, self.",
  "Gemini-Aquarius": "A mind that never rests. Collects ideas the way others collect feelings. Needs freedom to think, space to reinvent herself endlessly.",
  "Gemini-Libra": "Charming, cerebral, always weighing. Struggles to commit not from indecision but from seeing every angle at once.",
  "Cancer-Pisces": "All feeling, no filter. Absorbs the world and needs gentle shores to return to. Her intuition is rarely wrong.",
  "Cancer-Cancer": "Pure nurture. Gives everything to those she loves — the practice is learning to give the same to herself.",
  "Leo-Leo": "Radiant center of every room. Her warmth is genuine; what she seeks in return is to be truly seen.",
  "Leo-Sagittarius": "Fire that adventures. She inspires everyone she meets and keeps moving — the horizon is always calling.",
  "Virgo-Capricorn": "Precise, purposeful, built for mastery. She doesn't chase — she prepares until the moment is undeniable.",
  "Virgo-Taurus": "Grounded and sensory. Notices everything: beauty, flaw, texture, meaning. Her discernment is a superpower.",
  "Libra-Gemini": "All elegance and ideas. She creates harmony wherever she goes — the hard part is not losing herself in the process.",
  "Libra-Aquarius": "Idealistic beauty-seeker. Believes the world can be better — and spends her life quietly making it so.",
  "Sagittarius-Aries": "Born moving. Lives for the next horizon, the next truth, the next fire to follow. Adventure is her meditation.",
  "Sagittarius-Leo": "Joyful philosopher-queen. Her enthusiasm is contagious; her honesty is sometimes startling — always healing.",
  "Capricorn-Virgo": "Discipline with depth. She builds empires in the dark, asking for no applause until the work is done.",
  "Capricorn-Taurus": "Patient architect of her own life. Values what lasts — legacy, loyalty, the slow beauty of things done well.",
  "Aquarius-Gemini": "Future-thinker, word-weaver. She sees patterns others miss and communicates them in ways that shift perception.",
  "Aquarius-Libra": "Visionary peacemaker. Balances ideals with reality — always asking what could be fairer, kinder, freer.",
  "Pisces-Cancer": "The deepest feeler. Lives in the subtle world of emotion, symbol, dream. Her sensitivity is her gift and her edge.",
  "Pisces-Scorpio": "Mystical depths. She sees beneath surfaces without trying. Her inner world is vast — give her time to surface.",
};

function getKalryaReading(sunSign: ZodiacSign, moonSign: ZodiacSign): string {
  const key = `${sunSign}-${moonSign}`;
  if (kalryaReadings[key]) return kalryaReadings[key]!;
  // Fallback: element-based reading
  const sunEl = signData[sunSign].element;
  const moonEl = signData[moonSign].element;
  if (sunEl === moonEl) {
    const desc: Record<string, string> = {
      Fire:  "Pure fire through and through. Passionate, direct, alive. The work is learning when to burn and when to glow.",
      Earth: "Rooted in the real. She builds, sustains, creates beauty from matter. Time is her greatest ally.",
      Air:   "Lives in the mind as naturally as others live in their bodies. Her thinking is her magic.",
      Water: "All depth and feeling. She navigates by intuition and heals through emotional truth.",
    };
    return desc[sunEl] ?? "A complex soul, layered and luminous. She grows into herself slowly, surely, magnificently.";
  }
  return "A soul of two natures — one outward, one hidden. The tension between them is where her power lives.";
}

// ─── Helper: calculate elemental makeup ──────────────────────────────────────

function getElementalMakeup(sunSign: ZodiacSign, moonSign: ZodiacSign) {
  const sunEl  = signData[sunSign].element;
  const moonEl = signData[moonSign].element;
  if (sunEl === moonEl) {
    return { same: true, element: sunEl, elementClass: signData[sunSign].elementClass };
  }
  return {
    same: false,
    primary:   { element: moonEl, percent: 60, elementClass: signData[moonSign].elementClass },
    secondary: { element: sunEl,  percent: 40, elementClass: signData[sunSign].elementClass },
  };
}

// ─── Helper: ritual scores ────────────────────────────────────────────────────

function getRitualScores(sunSign: ZodiacSign, moonSign: ZodiacSign) {
  const keys = Object.keys(ritualMatrix[sunSign]) as RitualKey[];
  return keys
    .map((ritual) => {
      const score   = ritualMatrix[sunSign][ritual] + ritualMatrix[moonSign][ritual];
      const percent = Math.round((score - 2) / 4 * 100);
      const label   = RITUAL_LABELS[score];
      return { ritual, score, percent, label };
    })
    .filter((r) => r.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

// ─── Elemental bar gradient map ───────────────────────────────────────────────

const elementBarGradient: Record<string, string> = {
  Fire:  "linear-gradient(90deg, #E8943A, #E84A1A)",
  Earth: "linear-gradient(90deg, #2E8B57, #1A5C35)",
  Air:   "linear-gradient(90deg, #9B59B6, #6C3483)",
  Water: "linear-gradient(90deg, #2E86C1, #1A5276)",
};

// ─── Format birth date ─────────────────────────────────────────────────────────

function formatBirthDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

// ─── Moon cycles since birth ──────────────────────────────────────────────────

function moonCyclesSinceBirth(birthDate: string): number {
  const birth = new Date(birthDate);
  const now   = new Date();
  const days  = (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24);
  return Math.floor(days / 29.53);
}

// ─── Edit Profile Modal ────────────────────────────────────────────────────────

const ZODIAC_SIGNS: ZodiacSign[] = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

function EditProfileModal({ profile, onSave, onClose }: {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...profile });

  const field = (key: keyof UserProfile, label: string, type = "text") => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 4, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
        {label}
      </label>
      <input
        type={type}
        value={(form[key] as string) ?? ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 8,
          border: "1px solid var(--border)", background: "var(--input)",
          color: "var(--foreground)", fontSize: 15, outline: "none",
          fontFamily: "Inter, sans-serif",
        }}
      />
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end",
    }}
      onClick={onClose}
    >
      <div style={{
        width: "100%", maxWidth: 390, margin: "0 auto",
        background: "var(--card)", borderRadius: "20px 20px 0 0",
        padding: "24px 20px 36px",
      }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "var(--foreground)", margin: 0 }}>
            Edit Profile
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: 22, lineHeight: 1 }}>✕</button>
        </div>

        {field("name", "Name")}
        {field("birth_date", "Date of birth", "date")}
        {field("birth_city", "City of birth")}
        {field("birth_time", "Time of birth (optional)", "time")}

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 4, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            Sun Sign
          </label>
          <select
            value={form.sun_sign}
            onChange={(e) => setForm({ ...form, sun_sign: e.target.value as ZodiacSign })}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--input)", color: "var(--foreground)", fontSize: 15, fontFamily: "Inter, sans-serif" }}
          >
            {ZODIAC_SIGNS.map((s) => <option key={s} value={s}>{signData[s].symbol} {s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 4, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
            Moon Sign
          </label>
          <select
            value={form.moon_sign}
            onChange={(e) => setForm({ ...form, moon_sign: e.target.value as ZodiacSign })}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--input)", color: "var(--foreground)", fontSize: 15, fontFamily: "Inter, sans-serif" }}
          >
            {ZODIAC_SIGNS.map((s) => <option key={s} value={s}>{signData[s].symbol} {s}</option>)}
          </select>
        </div>

        <button
          onClick={() => { onSave(form); onClose(); }}
          style={{
            width: "100%", padding: "14px", borderRadius: 12,
            background: "#C9A84C", color: "#1A1208",
            fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif",
            border: "none", cursor: "pointer",
          }}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

// ─── Sign Card ────────────────────────────────────────────────────────────────

const elementBg: Record<string, string> = {
  water: "rgba(74, 144, 226, 0.1)",
  fire:  "rgba(230, 126, 34, 0.1)",
  earth: "rgba(46, 139, 87, 0.1)",
  air:   "rgba(155, 89, 182, 0.1)",
};

function SignCard({ type, sign }: { type: "SUN" | "MOON" | "RISING"; sign: ZodiacSign }) {
  const data = signData[sign];
  return (
    <div style={{
      flex: 1,
      background: elementBg[data.elementClass] ?? "var(--card)",
      borderRadius: 14,
      padding: "14px 12px",
      border: "0.5px solid var(--divider)",
    }}>
      <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", marginBottom: 8, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
        {type}
      </div>
      <div style={{ fontSize: 24, marginBottom: 4 }}>{data.symbol}</div>
      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "var(--foreground)", marginBottom: 4 }}>
        {sign}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
        {data.element} · {data.modality}
      </div>
    </div>
  );
}

// ─── Settings Toggle ──────────────────────────────────────────────────────────

function SettingsToggle({ label, sub, defaultOn }: { label: string; sub?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? true);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: "0.5px solid var(--divider)" }}>
      <div>
        <div style={{ fontSize: 15, color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginTop: 1 }}>{sub}</div>}
      </div>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
          background: on ? "#C9A84C" : "var(--muted)",
          position: "relative", transition: "background 200ms", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: on ? 21 : 3,
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          transition: "left 200ms", display: "block",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );
}

// ─── Main ProfileTab ──────────────────────────────────────────────────────────

export function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [streak, setStreak]   = useState({ current: 0, longest: 0, last_checkin: "" });

  useEffect(() => {
    setProfile(getProfile());
    setStreak(getStreak());
  }, []);

  const handleSave = (p: UserProfile) => {
    saveProfile(p);
    setProfile(p);
  };

  if (!profile) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--muted-foreground)", fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 18 }}>
          Complete onboarding to see your profile.
        </p>
      </div>
    );
  }

  const { sun_sign, moon_sign, rising_sign, name, birth_date, birth_city, birth_time } = profile;
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const reading  = getKalryaReading(sun_sign, moon_sign);
  const elemental = getElementalMakeup(sun_sign, moon_sign);
  const rituals   = getRitualScores(sun_sign, moon_sign);
  const moonCycles = birth_date ? moonCyclesSinceBirth(birth_date) : 0;

  // Rituals this cycle: sum checkins across this 29-day window (mocked from streak)
  const ritualsThisCycle = Math.min(streak.current * 2 + 3, 60);

  const sectionLabel = (text: string) => (
    <div style={{
      fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
      color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif",
      fontWeight: 600, marginBottom: 12,
    }}>
      {text}
    </div>
  );

  return (
    <>
      <div style={{ padding: "20px 20px 8px" }}>

        {/* ── Section 3: User Header ─────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "16px", background: "var(--card)",
          borderRadius: 16, border: "0.5px solid var(--divider)",
          marginBottom: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "#C9A84C", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 500, color: "#FFFFFF",
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: "var(--foreground)", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {name}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", marginTop: 2 }}>
              {birth_date && formatBirthDate(birth_date)}{birth_city ? ` · ${birth_city}` : ""}
            </div>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#C9A84C", fontSize: 13, fontFamily: "Inter, sans-serif",
              fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            Edit →
          </button>
        </div>

        {/* ── Section 4: Kalyra's Reading ────────────────────────────────────── */}
        <div style={{
          borderLeft: "3px solid #C9A84C",
          padding: "14px 16px",
          fontFamily: "Cormorant Garamond, serif",
          fontStyle: "italic",
          fontSize: 17,
          lineHeight: 1.7,
          color: "var(--foreground)",
          marginBottom: 20,
        }}>
          "{reading}"
        </div>

        {/* ── Section 5: Sun + Moon Sign Cards ───────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          {sectionLabel("Your Signs")}
          <div style={{ display: "flex", gap: 10 }}>
            <SignCard type="SUN"  sign={sun_sign}  />
            <SignCard type="MOON" sign={moon_sign} />
            {rising_sign && <SignCard type="RISING" sign={rising_sign} />}
          </div>
        </div>

        {/* ── Section 6: Elemental Makeup ────────────────────────────────────── */}
        <div style={{
          background: "var(--card)", borderRadius: 16,
          padding: "16px", border: "0.5px solid var(--divider)",
          marginBottom: 16,
        }}>
          {sectionLabel("Elemental Makeup")}
          {elemental.same ? (
            <>
              <div style={{ height: 6, borderRadius: 3, overflow: "hidden", background: "var(--muted)", marginBottom: 8 }}>
                <div style={{ height: "100%", width: "100%", background: elementBarGradient[elemental.element], borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                {elemental.element} · 100%
              </div>
            </>
          ) : (
            <>
              <div style={{ height: 6, borderRadius: 3, overflow: "hidden", background: "var(--muted)", marginBottom: 8, position: "relative" }}>
                <div style={{
                  height: "100%",
                  width: `${elemental.secondary!.percent}%`,
                  background: elementBarGradient[elemental.secondary!.element],
                  borderRadius: 3,
                  position: "absolute", left: 0, top: 0,
                  zIndex: 1,
                }} />
                <div style={{
                  height: "100%",
                  width: `${elemental.primary!.percent}%`,
                  background: elementBarGradient[elemental.primary!.element],
                  borderRadius: 3,
                  position: "absolute", right: 0, top: 0,
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                  {elemental.secondary!.element} ({sun_sign}) {elemental.secondary!.percent}%
                </span>
                <span style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                  {elemental.primary!.element} ({moon_sign}) {elemental.primary!.percent}%
                </span>
              </div>
            </>
          )}
        </div>

        {/* ── Section 7: Rising Sign ──────────────────────────────────────────── */}
        {!rising_sign && !birth_time && (
          <div style={{
            border: "1px dashed rgba(201,168,76,0.4)",
            borderRadius: 14, padding: "16px",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div>
                <div style={{ fontSize: 15, color: "var(--foreground)", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>
                  Your Rising sign is hidden
                </div>
                <div style={{ fontSize: 13, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", lineHeight: 1.5 }}>
                  Add your birth time and Kalyra will calculate your Ascendant — the mask you show the world.
                </div>
                <button
                  onClick={() => setEditOpen(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#C9A84C", fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: 500, padding: 0, marginTop: 10 }}
                >
                  Add birth time →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Section 8: Top Rituals For You ─────────────────────────────────── */}
        <div style={{
          background: "var(--card)", borderRadius: 16,
          padding: "16px", border: "0.5px solid var(--divider)",
          marginBottom: 16,
        }}>
          {sectionLabel("Top Rituals For You")}
          {rituals.map(({ ritual, percent, label }) => (
            <div key={ritual} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid var(--divider)" }}>
              <div style={{ fontSize: 14, color: "var(--foreground)", fontFamily: "Inter, sans-serif", minWidth: 120, flexShrink: 0 }}>
                {ritualDisplayNames[ritual]}
              </div>
              <div style={{ flex: 1, height: 4, background: "var(--muted)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  background: "#C9A84C",
                  width: `${percent}%`,
                  transition: "width 600ms ease-out",
                }} />
              </div>
              {label && (
                <div style={{ fontSize: 11, fontFamily: "Inter, sans-serif", minWidth: 80, textAlign: "right", flexShrink: 0, color: label.color }}>
                  {label.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Section 9: Practice Stats ───────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          {sectionLabel("My Practice")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { number: streak.current, label: "day\nstreak" },
              { number: ritualsThisCycle, label: "rituals\nthis cycle" },
              { number: moonCycles, label: "moon\ncycles" },
            ].map(({ number, label }) => (
              <div key={label} style={{
                background: "var(--card)", borderRadius: 14,
                padding: "14px 10px", textAlign: "center",
                border: "0.5px solid var(--divider)",
              }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#C9A84C", lineHeight: 1, marginBottom: 6 }}>
                  {number}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.3, fontFamily: "Inter, sans-serif", whiteSpace: "pre-line" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 10: Settings ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          {sectionLabel("Settings")}

          <div style={{ background: "var(--card)", borderRadius: 16, padding: "0 16px", border: "0.5px solid var(--divider)", marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", fontWeight: 600, padding: "14px 0 4px" }}>
              Notifications
            </div>
            <SettingsToggle label="Morning ritual reminder" sub="8:00 AM" defaultOn />
            <SettingsToggle label="Evening ritual reminder" sub="9:00 PM" defaultOn />
            <SettingsToggle label="Full Moon alert" defaultOn />
            <SettingsToggle label="New Moon alert" defaultOn />
          </div>

          <div style={{ background: "var(--card)", borderRadius: 16, padding: "0 16px", border: "0.5px solid var(--divider)", marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", fontWeight: 600, padding: "14px 0 4px" }}>
              My Data
            </div>
            <button onClick={() => setEditOpen(true)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "0.5px solid var(--divider)", background: "none", border: "none", cursor: "pointer", borderBottom: "0.5px solid var(--divider)" as string }}>
              <span style={{ fontSize: 15, color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}>Birth details</span>
              <span style={{ fontSize: 13, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>Edit →</span>
            </button>
            {!birth_time && (
              <button onClick={() => setEditOpen(true)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", background: "none", border: "none", cursor: "pointer" }}>
                <span style={{ fontSize: 15, color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}>Birth time</span>
                <span style={{ fontSize: 13, color: "#C9A84C", fontFamily: "Inter, sans-serif" }}>Add →</span>
              </button>
            )}
          </div>

          <div style={{ background: "var(--card)", borderRadius: 16, padding: "0 16px", border: "0.5px solid var(--divider)" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", fontWeight: 600, padding: "14px 0 4px" }}>
              Account
            </div>
            <button style={{ width: "100%", textAlign: "left", padding: "13px 0", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
              Sign out
            </button>
          </div>
        </div>

      </div>

      {editOpen && (
        <EditProfileModal
          profile={profile}
          onSave={handleSave}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
