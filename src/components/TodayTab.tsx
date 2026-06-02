"use client";

import { useEffect, useState } from "react";
import { getDailyAstrology, PLANET_SYMBOL, SIGN_SYMBOL, type DailyAstrology } from "@/lib/astrology";
// MOON_PHASE_EMOJI removed — replaced by MoonPhaseIcon2 SVG component
import { getRitual, getGreeting, getSpecialSectionContent, getTriggeredRituals, type MasterRitual } from "@/lib/ritualContent";
import { getProfile, getTodayCheckins, toggleCheckin, canUseAiRitual, markAiRitualUsed, type CheckinKey } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import {
  MoonPhaseIcon2,
  IconSunrise, IconEvening, IconJournal, IconMirror,
  IconCrystalSection, IconGlamour, IconEnergy,
  IconChecked, IconUnchecked,
  CrystalIcon,
} from "@/components/icons";

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
  Sun:     { label: "Sun rules today",     action: "Be seen"        },
  Moon:    { label: "Moon rules today",    action: "Trust feelings" },
  Mercury: { label: "Mercury rules today", action: "Speak clearly"  },
  Venus:   { label: "Venus rules today",   action: "Choose beauty"  },
  Mars:    { label: "Mars rules today",    action: "Bold moves only" },
  Jupiter: { label: "Jupiter rules today", action: "Think bigger"   },
  Saturn:  { label: "Saturn rules today",  action: "Do the work"    },
};

const CRYSTAL_COLOR: Record<string, string> = {
  Citrine:           "#F5A623",
  Moonstone:         "#C8D8E8",
  "Blue Lace Agate": "#89B4CC",
  "Rose Quartz":     "#F4A7B9",
  Carnelian:         "#C8472B",
  "Green Aventurine":"#4CAF70",
  "Black Tourmaline":"#2A2A2A",
  Labradorite:       "#7B8FA6",
  Amethyst:          "#9B59B6",
  Fluorite:          "#7EC8A4",
  "Clear Quartz":    "#E8E8F0",
  Obsidian:          "#1A1A1A",
  Selenite:          "#F0EDE8",
  Morganite:         "#F7C5B0",
  Rhodonite:         "#D4526A",
  Pyrite:            "#C9A84C",
};

const MOCK_AI_RITUAL = `The Moon moves through your sky with quiet certainty, and today she asks you to be equally unhurried. Begin your morning by placing both hands flat on a surface — desk, floor, earth — and breathing until you feel the solidity beneath you. You are here. This is real.

Your ritual today weaves the energy of the moon's current phase with the planetary ruler of this day. Write your one clearest desire at the top of a page, then spend ten minutes writing beneath it — not how you'll get there, but how it will feel when you're living it. Use the present tense. Use specificity. Not "I want abundance" but "I am the kind of woman who..."

Tonight, before sleep, read what you wrote aloud. Then place your crystal on top of it. Let your words and your intention be held while you rest. The work you've done today doesn't disappear in sleep — it deepens.`;

function SectionCard({
  icon: Icon,
  title,
  tag,
  checkinKey,
  checkedKeys,
  onToggle,
  children,
  accent,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  tag?: string;
  checkinKey?: CheckinKey;
  checkedKeys: CheckinKey[];
  onToggle?: (key: CheckinKey) => void;
  children: React.ReactNode;
  accent?: string;
}) {
  const checked = checkinKey ? checkedKeys.includes(checkinKey) : false;

  return (
    <div className="rounded-2xl p-5 space-y-4 fade-in"
      style={{
        background: "var(--card)",
        border: `1px solid ${checked ? "var(--primary)" : "var(--border)"}`,
        transition: "border-color 0.3s, background 2000ms ease-in-out",
      }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Icon size={20} color={accent ?? "var(--primary)"} />
          <h3 className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600,
              color: accent ?? "var(--primary)" }}>
            {title}
          </h3>
          {tag && (
            <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
              style={{
                fontFamily: "var(--font-inter)", fontWeight: 500,
                color: "var(--muted-foreground)",
                border: "1px solid var(--border)",
              }}>
              {tag}
            </span>
          )}
        </div>
        {checkinKey && onToggle && (
          <button
            onClick={() => onToggle(checkinKey)}
            className="shrink-0 transition-all active:scale-90"
            aria-label={checked ? "Mark incomplete" : "Mark complete"}
          >
            {checked
              ? <IconChecked size={28} color="var(--primary)" />
              : <IconUnchecked size={28} color="var(--muted-foreground)" />
            }
          </button>
        )}
      </div>
      <div style={{ color: "var(--foreground)" }}>{children}</div>
    </div>
  );
}

function RitualList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600,
              background: "var(--secondary)", color: "var(--primary)" }}>
            {i + 1}
          </span>
          <span className="text-base leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function TodayTab({ colorMode = "dark" }: { colorMode?: "morning" | "mid" | "dark" }) {
  const [astro, setAstro] = useState<DailyAstrology | null>(null);
  const [checkins, setCheckins] = useState<CheckinKey[]>([]);
  const [aiState, setAiState] = useState<"idle" | "loading" | "done">("idle");
  const [aiContent, setAiContent] = useState("");
  const [aiUsed, setAiUsed] = useState(false);
  const [expandedRitual, setExpandedRitual] = useState<string | null>(null);

  const profile = getProfile();

  useEffect(() => {
    setAstro(getDailyAstrology());
    setCheckins(getTodayCheckins());
    setAiUsed(!canUseAiRitual());
  }, []);

  if (!astro) return null;

  const ritual = getRitual(astro.moonPhase, astro.dayRuler);
  const triggeredRituals = getTriggeredRituals(astro.moonPhase, astro.moonSign, astro.dayRuler);

  // Map triggered rituals to section cards
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
  const greeting = profile
    ? getGreeting(profile.name, astro.moonSign, astro.moonPhase)
    : `Welcome. ${astro.moonPhase} in ${astro.moonSign} today.`;

  const toggle = (key: CheckinKey) => {
    setCheckins(toggleCheckin(key));
  };

  const allCheckins: CheckinKey[] = ["morning", "journal", "mirror", "crystal", "wear", "evening"];
  const doneCount = checkins.length;
  const isFullAlignment = doneCount === allCheckins.length;
  const isMostlyDone = doneCount >= 4;

  const handleGenerateRitual = async () => {
    setAiState("loading");
    await new Promise((r) => setTimeout(r, 1800)); // simulate API call
    setAiContent(MOCK_AI_RITUAL);
    setAiState("done");
    markAiRitualUsed();
    setAiUsed(true);
  };

  const dateStr = astro.date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4 space-y-5">

      {/* ── USER SECTION — centered ───────────────────── */}
      <div className="text-center space-y-4 px-1 pt-2">
        {/* Date + streak */}
        <div className="flex items-center justify-center gap-3">
          <p className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            {astro.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
            {" · "}
            {astro.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
          </p>
          {checkins.length > 0 && (
            <div className="flex items-center gap-1">
              <span style={{ color: "var(--primary)", fontSize: 12 }}>✦</span>
              <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-inter)", color: "var(--muted-foreground)" }}>
                {checkins.length}
              </span>
            </div>
          )}
        </div>

        {/* Hello */}
        <h1 className="kalyra-voice leading-none"
          style={{ fontSize: "clamp(2.4rem, 10vw, 3rem)", color: "var(--foreground)", fontWeight: 300 }}>
          Hello, {profile?.name ?? "friend"}.
        </h1>

        {/* Sign pills — ☀ Sun + 🌙 Moon (+ ↑ Rising if available) */}
        {profile && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
              <span>☀️</span>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground)" }}>
                {profile.sun_sign}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
              <span>🌙</span>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground)" }}>
                {profile.moon_sign}
              </span>
            </div>
            {profile.rising_sign && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 700, color: "var(--primary)" }}>↑</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground)" }}>
                  {profile.rising_sign}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* ── DAY SECTION — 3 equal columns ────────────── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-3">
          {/* Moon Phase */}
          <div className="flex flex-col items-center gap-1 p-4 text-center"
            style={{ borderRight: "1px solid var(--border)" }}>
            <MoonPhaseIcon2 phase={astro.moonPhase} size={28} litColor="var(--foreground)" strokeColor="var(--primary)" />
            <span className="text-xs font-semibold mt-1 leading-tight"
              style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}>
              {astro.moonPhase}
            </span>
            <span className="text-xs leading-tight"
              style={{ fontFamily: "var(--font-inter)", color: "var(--primary)", fontWeight: 500 }}>
              {MOON_PHASE_TAGLINE[astro.moonPhase]}
            </span>
          </div>

          {/* Day Ruler */}
          <div className="flex flex-col items-center gap-1 p-4 text-center"
            style={{ borderRight: "1px solid var(--border)" }}>
            <IconEnergy size={28} color="var(--primary)" />
            <span className="text-xs font-semibold mt-1 leading-tight"
              style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}>
              {DAY_RULER_TAGLINE[astro.dayRuler].label}
            </span>
            <span className="text-xs leading-tight"
              style={{ fontFamily: "var(--font-inter)", color: "var(--primary)", fontWeight: 500 }}>
              {DAY_RULER_TAGLINE[astro.dayRuler].action}
            </span>
          </div>

          {/* Crystal */}
          <div className="flex flex-col items-center gap-1 p-4 text-center">
            <CrystalIcon name={ritual.crystal.name} size={28} />
            <span className="text-xs font-semibold mt-1 leading-tight"
              style={{ fontFamily: "var(--font-inter)", color: "var(--foreground)" }}>
              {ritual.crystal.name}
            </span>
            <span className="text-xs leading-tight"
              style={{ fontFamily: "var(--font-inter)", color: "var(--primary)", fontWeight: 500 }}>
              carry today
            </span>
          </div>
        </div>
      </div>

      {/* Special event badges */}
      {astro.specialEvents.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {astro.specialEvents.map((ev, i) => (
            <Badge key={i} className="text-xs"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 600,
                background: "color-mix(in srgb, var(--primary) 15%, transparent)",
                color: "var(--primary)", border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)" }}>
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
            checkedKeys={checkins} accent="var(--accent-warm, #a78bfa)">
            <p className="text-base leading-relaxed">{content.body}</p>
          </SectionCard>
        );
      })}

      {/* Morning Ritual */}
      <SectionCard icon={IconSunrise} title="Morning Ritual" checkinKey="morning"
        tag={cardTags["morning"]}
        checkedKeys={checkins} onToggle={toggle}>
        <RitualList steps={ritual.morningRitual} />
      </SectionCard>

      {/* Journal Prompt */}
      <SectionCard icon={IconJournal} title="Journal Prompt" checkinKey="journal"
        tag={cardTags["journal"]}
        checkedKeys={checkins} onToggle={toggle}>
        <blockquote className="border-l-2 pl-4 italic text-base leading-relaxed"
          style={{ borderColor: "var(--primary)" }}>
          &ldquo;{ritual.journalPrompt}&rdquo;
        </blockquote>
      </SectionCard>

      {/* Mirror Reflection */}
      <SectionCard icon={IconMirror} title="Mirror Reflection" checkinKey="mirror"
        checkedKeys={checkins} onToggle={toggle}>
        <div className="rounded-xl p-4 text-center space-y-2"
          style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
          <p className="text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Read aloud · in the mirror
          </p>
          <p className="kalyra-voice text-lg leading-relaxed" style={{ color: "var(--primary)" }}>
            &ldquo;{ritual.mirrorReflection}&rdquo;
          </p>
        </div>
      </SectionCard>

      {/* Crystal of the Day */}
      <SectionCard icon={IconCrystalSection} title="Crystal of the Day" checkinKey="crystal"
        checkedKeys={checkins} onToggle={toggle}>
        <div className="space-y-3">
          <p className="text-xl" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, color: "var(--primary)" }}>
            {ritual.crystal.name}
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{ritual.crystal.why}</p>
          <div className="rounded-xl p-3" style={{ background: "var(--background)" }}>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>How to use today</p>
            <p className="text-base">{ritual.crystal.howToUse}</p>
          </div>
        </div>
      </SectionCard>

      {/* Glamour Magic */}
      <SectionCard icon={IconGlamour} title="Glamour Magic — What to Wear" checkinKey="wear"
        checkedKeys={checkins} onToggle={toggle}>
        <div className="space-y-2">
          <p className="text-lg" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, color: "var(--primary)" }}>
            {ritual.glamour.color}
          </p>
          <p className="text-base leading-relaxed">{ritual.glamour.suggestion}</p>
        </div>
      </SectionCard>

      {/* Evening Ritual */}
      <SectionCard icon={IconEvening} title="Evening Ritual" checkinKey="evening"
        tag={cardTags["evening"]}
        checkedKeys={checkins} onToggle={toggle}>
        <RitualList steps={ritual.eveningRitual} />
      </SectionCard>

      {/* Daily Check-in Summary */}
      {doneCount > 0 && (
        <div className="rounded-2xl p-5 text-center space-y-2 fade-in"
          style={{
            background: isFullAlignment
              ? "color-mix(in srgb, var(--primary) 10%, var(--card))"
              : "var(--card)",
            border: `1px solid ${isFullAlignment ? "var(--primary)" : "var(--border)"}`,
          }}>
          <p className="text-3xl">{isFullAlignment ? "🌟" : isMostlyDone ? "✨" : "🌙"}</p>
          <p className="text-base" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, color: "var(--primary)" }}>
            {isFullAlignment
              ? "You're in full alignment today"
              : isMostlyDone
              ? "Moon-powered. Keep going."
              : `${doneCount} of ${allCheckins.length} rituals complete`}
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {allCheckins.map((key) => (
              <div key={key} className="w-2 h-2 rounded-full"
                style={{ background: checkins.includes(key) ? "var(--primary)" : "var(--border)" }} />
            ))}
          </div>
        </div>
      )}

      {/* AI Ritual Generator */}
      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: "var(--card)", border: "1px dashed var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">✦</span>
          <div>
            <h3 className="text-sm tracking-widest uppercase"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
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
              fontFamily: "var(--font-inter)", fontWeight: 600,
              background: aiUsed ? "var(--secondary)" : "linear-gradient(90deg, var(--gold-dim, #7a5e1f), var(--primary), var(--gold-dim, #7a5e1f))",
              color: aiUsed ? "var(--muted-foreground)" : "var(--primary-foreground)",
              cursor: aiUsed ? "not-allowed" : "pointer",
              backgroundSize: "200% auto",
              animation: (!aiUsed && aiState === "idle") ? "shimmer 3s linear infinite" : "none",
            }}>
            {aiState === "loading" ? "Weaving your ritual..." : aiUsed ? "Come back tomorrow" : "Generate my ritual ✦"}
          </button>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}
