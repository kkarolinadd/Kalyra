"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getDailyAstrology, type DailyAstrology } from "@/lib/astrology";
import { getRitual, getGreeting, getSpecialSectionContent, getTriggeredRituals } from "@/lib/ritualContent";
import { getProfile, saveProfile, getTodayCheckins, toggleCheckin, canUseAiRitual, markAiRitualUsed, type CheckinKey } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import {
  MoonPhaseIcon2,
  IconSunrise, IconEvening, IconJournal, IconMirror,
  IconCrystalSection, IconGlamour, IconEnergy,
  IconChecked, IconUnchecked,
  CrystalIcon, PlanetIcon,
} from "@/components/icons";

// ─── Constants ────────────────────────────────────────────────────────────────

const MOON_PHASE_TAGLINE: Record<string, string> = {
  "New Moon":        "Set intentions",
  "Waxing Crescent": "Take first steps",
  "First Quarter":   "Push through",
  "Waxing Gibbous":  "Refine & build",
  "Full Moon":       "Release & celebrate",
  "Waning Gibbous":  "Time to release",
  "Last Quarter":    "Let it go",
  "Waning Crescent": "Rest & restore",
};

const DAY_RULER_TAGLINE: Record<string, { label: string; action: string }> = {
  Sun:     { label: "Sun rules today",     action: "Be seen"         },
  Moon:    { label: "Moon rules today",    action: "Trust feelings"  },
  Mercury: { label: "Mercury rules today", action: "Speak clearly"   },
  Venus:   { label: "Venus rules today",   action: "Choose beauty"   },
  Mars:    { label: "Mars rules today",    action: "Bold moves only" },
  Jupiter: { label: "Jupiter rules today", action: "Think bigger"    },
  Saturn:  { label: "Saturn rules today",  action: "Do the work"     },
};

const CARD_ACCENTS: Record<CheckinKey | "energy", string> = {
  morning: "#E8943A",
  evening: "#6B3FA0",
  journal: "#C9A84C",
  mirror:  "#C4687A",
  crystal: "#4A9B8E",
  wear:    "#D4927A",
  energy:  "#C9A84C",
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

const ZODIAC_SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
] as const;

const MOCK_AI_RITUAL = `The Moon moves through your sky with quiet certainty, and today she asks you to be equally unhurried. Begin your morning by placing both hands flat on a surface — desk, floor, earth — and breathing until you feel the solidity beneath you. You are here. This is real.

Your ritual today weaves the energy of the moon's current phase with the planetary ruler of this day. Write your one clearest desire at the top of a page, then spend ten minutes writing beneath it — not how you'll get there, but how it will feel when you're living it. Use the present tense. Use specificity. Not "I want abundance" but "I am the kind of woman who..."

Tonight, before sleep, read what you wrote aloud. Then place your crystal on top of it. Let your words and your intention be held while you rest. The work you've done today doesn't disappear in sleep — it deepens.`;

// ─── Collapsing logic ─────────────────────────────────────────────────────────

function getRitualVisibility(): { morning: "expanded" | "collapsed"; evening: "expanded" | "collapsed" } {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12)  return { morning: "expanded", evening: "collapsed" };
  if (hour >= 12 && hour < 17) return { morning: "expanded", evening: "expanded" };
  return { morning: "collapsed", evening: "expanded" };
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
  checkedKeys,
  onToggle,
  children,
  accent,
  collapsed = false,
  onExpand,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  tag?: string;
  checkinKey?: CheckinKey;
  checkedKeys: CheckinKey[];
  onToggle?: (key: CheckinKey) => void;
  children: React.ReactNode;
  accent?: string;
  collapsed?: boolean;
  onExpand?: () => void;
}) {
  const checked = checkinKey ? checkedKeys.includes(checkinKey) : false;
  const [shimmerActive, setShimmerActive] = useState(false);
  const [bouncing, setBouncing]           = useState(false);

  const handleToggle = () => {
    if (!checkinKey || !onToggle) return;
    if (!checked) {
      setBouncing(true);
      setShimmerActive(true);
      setTimeout(() => setBouncing(false),    250);
      setTimeout(() => setShimmerActive(false), 450);
    }
    onToggle(checkinKey);
  };

  const accentColor = accent ?? "#C9A84C";

  return (
    <div
      className="fade-in kalyra-card"
      style={{
        background:   "var(--card)",
        borderRadius: 16,
        borderLeft:   `3px solid ${accentColor}`,
        marginBottom: 12,
        position:     "relative",
        overflow:     "hidden",
        opacity:      checked ? 0.65 : 1,
        transition:   "opacity 300ms ease",
        cursor:       collapsed ? "pointer" : "default",
        height:       collapsed ? 48 : undefined,
      }}
      onClick={collapsed ? onExpand : undefined}
    >
      {/* Gold shimmer sweep on check */}
      {shimmerActive && (
        <div
          style={{
            position:         "absolute",
            inset:            0,
            background:       "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 50%, transparent 100%)",
            backgroundSize:   "200% 100%",
            animation:        "shimmerOnce 400ms ease-out forwards",
            pointerEvents:    "none",
            zIndex:           2,
          }}
        />
      )}

      {/* Header row */}
      <div
        className="flex items-center justify-between gap-3"
        style={{
          padding: collapsed ? "0 16px 0 20px" : "16px 16px 0 20px",
          height:  collapsed ? 48 : undefined,
        }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Icon size={20} color={accentColor} />
          <h3
            style={{
              fontFamily:    "var(--font-inter), sans-serif",
              fontWeight:    600,
              fontSize:      11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color:         accentColor,
              margin:        0,
            }}
          >
            {title}
            {checked && (
              <span style={{ color: "var(--muted-foreground)", fontWeight: 500 }}>
                {" · done"}
              </span>
            )}
          </h3>
          {tag && !collapsed && (
            <span
              className="text-xs px-2 py-0.5 rounded-full shrink-0"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                color:      "var(--muted-foreground)",
                border:     "1px solid var(--border)",
              }}
            >
              {tag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {checkinKey && onToggle && !collapsed && (
            <button
              onClick={(e) => { e.stopPropagation(); handleToggle(); }}
              style={{
                background: "none",
                border:     "none",
                padding:    0,
                cursor:     "pointer",
                animation:  bouncing ? "checkBounce 250ms ease-out" : "none",
              }}
              aria-label={checked ? "Mark incomplete" : "Mark complete"}
            >
              {checked
                ? <IconChecked  size={24} color={accentColor} />
                : <IconUnchecked size={24} color="var(--muted-foreground)" />
              }
            </button>
          )}
          {collapsed && (
            <ChevronDown size={20} color="var(--muted-foreground)" />
          )}
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div style={{ padding: "12px 16px 16px 20px", color: "var(--foreground)" }}>
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
          <span style={{ color: "var(--muted-foreground)", fontSize: 18 }}>◐</span>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize:   14,
              color:      "var(--muted-foreground)",
            }}
          >
            {done} of {total} rituals completed
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
  const [aiState, setAiState]     = useState<"idle" | "loading" | "done">("idle");
  const [aiContent, setAiContent] = useState("");
  const [aiUsed, setAiUsed]       = useState(false);

  // Cards auto-collapsed after done (+ on load if already done today)
  const [autoCollapsed, setAutoCollapsed] = useState<Set<CheckinKey>>(new Set());
  // User-expanded overrides (reset on reload)
  const [userExpanded, setUserExpanded]   = useState<Set<string>>(new Set());

  // Upsell
  const [showUpsell, setShowUpsell] = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  const profile = getProfile();

  useEffect(() => {
    setAstro(getDailyAstrology());
    const loaded = getTodayCheckins();
    setCheckins(loaded);
    // Cards already done today start collapsed
    setAutoCollapsed(new Set(loaded));
    setAiUsed(!canUseAiRitual());
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

  const toggle = (key: CheckinKey) => {
    const next = toggleCheckin(key);
    setCheckins(next);
    if (next.includes(key)) {
      // Just checked → auto-collapse after 1.5s
      setTimeout(() => {
        setAutoCollapsed((prev) => new Set([...prev, key]));
        setUserExpanded((prev) => { const n = new Set(prev); n.delete(key); return n; });
      }, 1500);
    } else {
      // Unchecked → remove from auto-collapsed so it reopens
      setAutoCollapsed((prev) => { const n = new Set(prev); n.delete(key); return n; });
    }
  };

  const allCheckins: CheckinKey[] = ["morning", "journal", "mirror", "crystal", "wear", "evening"];
  const doneCount = checkins.length;

  // Collapse logic per card
  const isCardCollapsed = (key: CheckinKey): boolean => {
    if (userExpanded.has(key)) return false;              // user tapped to open
    if (autoCollapsed.has(key)) return true;              // done → auto-collapsed
    const hour = new Date().getHours();
    if (key === "morning") return hour >= 13;             // collapsed-late, no judgement
    if (key === "evening") return hour < 17;              // not yet evening
    return false;
  };

  const expand = (key: string) => {
    setUserExpanded((prev) => new Set([...prev, key]));
    setAutoCollapsed((prev) => { const n = new Set(prev); n.delete(key as CheckinKey); return n; });
  };

  // Moon phase colors — warm brown/beige on light bg, default on dark bg
  const isLightMode  = colorMode === "dawn" || colorMode === "day";
  const moonLitColor  = isLightMode ? "#8B7355"  : "var(--foreground)";
  const moonDarkColor = isLightMode ? "#E8E0D0"  : undefined;
  const moonStroke    = "var(--primary)";

  const handleGenerateRitual = async () => {
    setAiState("loading");
    await new Promise((r) => setTimeout(r, 1800));
    setAiContent(MOCK_AI_RITUAL);
    setAiState("done");
    markAiRitualUsed();
    setAiUsed(true);
  };

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
            style={{ fontSize: "clamp(2.4rem, 10vw, 3rem)", color: "var(--foreground)", fontWeight: 300 }}
          >
            Hello, {profile?.name ?? "friend"}.
          </h1>

          {profile && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ border: "1px solid var(--pill-border)", background: "var(--pill-bg)" }}
              >
                <span>☀️</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "var(--pill-text)" }}>
                  {profile.sun_sign}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ border: "1px solid var(--pill-border)", background: "var(--pill-bg)" }}
              >
                <span>🌙</span>
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

        {/* ── Energy Card (3 columns) ──────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden mb-3 kalyra-card"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="grid grid-cols-3">
            {/* Moon Phase */}
            <div
              className="flex flex-col items-center p-4 text-center"
              style={{ borderRight: "1px solid var(--border)" }}
            >
              <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <MoonPhaseIcon2
                  phase={astro.moonPhase}
                  size={24}
                  litColor={moonLitColor}
                  darkColor={moonDarkColor}
                  strokeColor={moonStroke}
                />
              </div>
              <span className="text-xs font-semibold leading-tight" style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}>
                {astro.moonPhase}
              </span>
              <span className="text-xs leading-tight mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "var(--primary)", fontWeight: 500 }}>
                {MOON_PHASE_TAGLINE[astro.moonPhase]}
              </span>
            </div>

            {/* Planet of the Day */}
            <div
              className="flex flex-col items-center p-4 text-center"
              style={{ borderRight: "1px solid var(--border)" }}
            >
              <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <PlanetIcon planet={astro.dayRuler} size={20} color="var(--primary)" />
              </div>
              <span className="text-xs font-semibold leading-tight" style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}>
                {DAY_RULER_TAGLINE[astro.dayRuler].label}
              </span>
              <span className="text-xs leading-tight mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "var(--primary)", fontWeight: 500 }}>
                {DAY_RULER_TAGLINE[astro.dayRuler].action}
              </span>
            </div>

            {/* Crystal */}
            <div className="flex flex-col items-center p-4 text-center">
              <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <CrystalIcon name={ritual.crystal.name} size={24} />
              </div>
              <span className="text-xs font-semibold leading-tight" style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}>
                {ritual.crystal.name}
              </span>
              <span className="text-xs leading-tight mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "var(--primary)", fontWeight: 500 }}>
                carry today
              </span>
            </div>
          </div>
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
            <SectionCard key={i} icon={IconEnergy} title={content.title}
              checkedKeys={checkins} accent={CARD_ACCENTS.energy}>
              <p className="text-base leading-relaxed">{content.body}</p>
            </SectionCard>
          );
        })}

        {/* 3. Morning Ritual */}
        <SectionCard
          icon={IconSunrise}
          title="Morning Ritual"
          checkinKey="morning"
          tag={cardTags["morning"]}
          checkedKeys={checkins}
          onToggle={toggle}
          accent={CARD_ACCENTS.morning}
          collapsed={isCardCollapsed("morning")}
          onExpand={() => expand("morning")}
        >
          <RitualList steps={ritual.morningRitual} />
        </SectionCard>

        {/* 4. Journal Prompt */}
        <SectionCard
          icon={IconJournal}
          title="Journal Prompt"
          checkinKey="journal"
          tag={cardTags["journal"]}
          checkedKeys={checkins}
          onToggle={toggle}
          accent={CARD_ACCENTS.journal}
        >
          <div className="quote-block">
            &ldquo;{ritual.journalPrompt}&rdquo;
          </div>
        </SectionCard>

        {/* 5. Mirror Reflection */}
        <SectionCard
          icon={IconMirror}
          title="Mirror Reflection"
          checkinKey="mirror"
          checkedKeys={checkins}
          onToggle={toggle}
          accent={CARD_ACCENTS.mirror}
        >
          <p className="read-aloud-label">Read aloud · in the mirror</p>
          <div className="quote-block" style={{ textAlign: "center" }}>
            &ldquo;{ritual.mirrorReflection}&rdquo;
          </div>
        </SectionCard>

        {/* 6. Crystal of the Day */}
        <SectionCard
          icon={IconCrystalSection}
          title="Crystal of the Day"
          checkinKey="crystal"
          checkedKeys={checkins}
          onToggle={toggle}
          accent={CARD_ACCENTS.crystal}
        >
          <div className="space-y-3">
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, fontSize: 20, color: "var(--primary)", margin: 0 }}>
              {ritual.crystal.name}
            </p>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0 }}>
              {ritual.crystal.why}
            </p>
            <div style={{ borderRadius: 10, background: "var(--secondary)", padding: "10px 12px" }}>
              <p
                style={{
                  fontFamily:    "var(--font-inter)",
                  fontWeight:    600,
                  fontSize:      10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color:         "var(--muted-foreground)",
                  marginBottom:  6,
                  margin:        "0 0 6px 0",
                }}
              >
                How to use today
              </p>
              <p style={{ fontSize: 14, margin: 0 }}>{ritual.crystal.howToUse}</p>
            </div>
          </div>
        </SectionCard>

        {/* 7. Glamour Magic */}
        <SectionCard
          icon={IconGlamour}
          title="Glamour Magic — What to Wear"
          checkinKey="wear"
          checkedKeys={checkins}
          onToggle={toggle}
          accent={CARD_ACCENTS.wear}
        >
          <div className="space-y-2">
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, fontSize: 20, color: "var(--primary)", margin: 0, display: "flex", alignItems: "center" }}>
              <GlamourChip colorName={glamourChipColor} />
              {ritual.glamour.color}
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{ritual.glamour.suggestion}</p>
          </div>
        </SectionCard>

        {/* 8. Evening Ritual */}
        <SectionCard
          icon={IconEvening}
          title="Evening Ritual"
          checkinKey="evening"
          tag={cardTags["evening"]}
          checkedKeys={checkins}
          onToggle={toggle}
          accent={CARD_ACCENTS.evening}
          collapsed={isCardCollapsed("evening")}
          onExpand={() => expand("evening")}
        >
          <RitualList steps={ritual.eveningRitual} />
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

        {/* AI Ritual Generator */}
        <div
          className="rounded-2xl p-5 space-y-4 mt-3 kalyra-card"
          style={{ background: "var(--card)", border: "1px dashed var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 22, color: "var(--primary)" }}>✦</span>
            <div>
              <h3
                className="text-sm tracking-widest uppercase"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}
              >
                Kalyra — Your Ritual
              </h3>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {aiUsed && aiState !== "done" ? "Used today — come back tomorrow" : "Personalized ritual · 1× per day"}
              </p>
            </div>
          </div>

          {aiState === "done" && (
            <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--background)" }}>
              <p className="text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--primary)" }}>
                Your personalized ritual
              </p>
              <p className="kalyra-voice text-base leading-relaxed whitespace-pre-line">{aiContent}</p>
            </div>
          )}

          {aiState !== "done" && (
            <button
              onClick={handleGenerateRitual}
              disabled={aiUsed || aiState === "loading"}
              className="w-full py-3 rounded-xl text-sm tracking-widest uppercase transition"
              style={{
                fontFamily:     "var(--font-inter)",
                fontWeight:     600,
                background:     aiUsed
                  ? "var(--secondary)"
                  : "linear-gradient(90deg, var(--gold-dim, #7a5e1f), var(--primary), var(--gold-dim, #7a5e1f))",
                color:          aiUsed ? "var(--muted-foreground)" : "var(--primary-foreground)",
                cursor:         aiUsed ? "not-allowed" : "pointer",
                backgroundSize: "200% auto",
                animation:      (!aiUsed && aiState === "idle") ? "shimmer 3s linear infinite" : "none",
                border:         "none",
              }}
            >
              {aiState === "loading" ? "Weaving your ritual..." : aiUsed ? "Come back tomorrow" : "Generate my ritual ✦"}
            </button>
          )}
        </div>

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
