"use client";

import { useEffect, useState } from "react";
import { getDailyAstrology, MOON_PHASE_EMOJI, PLANET_SYMBOL, SIGN_SYMBOL, type DailyAstrology } from "@/lib/astrology";
import { getRitual, getGreeting, getSpecialSectionContent, getTriggeredRituals, type MasterRitual } from "@/lib/ritualContent";
import { getProfile, getTodayCheckins, toggleCheckin, canUseAiRitual, markAiRitualUsed, type CheckinKey } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const DAY_RULER_KEYWORD: Record<string, string> = {
  Sun:     "visibility",
  Moon:    "intuition",
  Mercury: "clarity",
  Venus:   "beauty",
  Mars:    "action",
  Jupiter: "expansion",
  Saturn:  "discipline",
};

const MOCK_AI_RITUAL = `The Moon moves through your sky with quiet certainty, and today she asks you to be equally unhurried. Begin your morning by placing both hands flat on a surface — desk, floor, earth — and breathing until you feel the solidity beneath you. You are here. This is real.

Your ritual today weaves the energy of the moon's current phase with the planetary ruler of this day. Write your one clearest desire at the top of a page, then spend ten minutes writing beneath it — not how you'll get there, but how it will feel when you're living it. Use the present tense. Use specificity. Not "I want abundance" but "I am the kind of woman who..."

Tonight, before sleep, read what you wrote aloud. Then place your crystal on top of it. Let your words and your intention be held while you rest. The work you've done today doesn't disappear in sleep — it deepens.`;

function SectionCard({
  icon,
  title,
  checkinKey,
  checkedKeys,
  onToggle,
  children,
  accent,
}: {
  icon: string;
  title: string;
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
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600,
              color: accent ?? "var(--primary)" }}>
            {title}
          </h3>
        </div>
        {checkinKey && onToggle && (
          <div className="flex items-center gap-2 shrink-0">
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggle(checkinKey)}
              className="border-[--primary] data-[state=checked]:bg-[--primary] data-[state=checked]:border-[--primary]"
            />
          </div>
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
  const greeting = profile
    ? getGreeting(profile.name, astro.moonSign, astro.moonPhase)
    : `Welcome. ${MOON_PHASE_EMOJI[astro.moonPhase]} ${astro.moonPhase} in ${astro.moonSign} today.`;

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
      <div className="rounded-2xl p-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="grid grid-cols-3 divide-x" style={{ borderColor: "var(--border)" }}>
          {/* Moon Phase */}
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <span className="text-2xl">{MOON_PHASE_EMOJI[astro.moonPhase]}</span>
            <span className="text-xs tracking-widest uppercase leading-tight"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--foreground)" }}>
              {astro.moonPhase}
            </span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {astro.moonIllumination}%
            </span>
          </div>

          {/* Day Ruler */}
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <span className="text-2xl">{PLANET_SYMBOL[astro.dayRuler]}</span>
            <span className="text-xs tracking-widest uppercase leading-tight"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--foreground)" }}>
              {astro.dayRuler}
            </span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {DAY_RULER_KEYWORD[astro.dayRuler]}
            </span>
          </div>

          {/* Crystal */}
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <span className="text-2xl">💎</span>
            <span className="text-xs tracking-widest uppercase leading-tight"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--foreground)" }}>
              {ritual.crystal.name}
            </span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              crystal
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

      {/* Today's Rituals */}
      {triggeredRituals.length > 0 && (
        <div className="space-y-3 fade-in">
          <p className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--muted-foreground)" }}>
            Today&apos;s Rituals
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {triggeredRituals.map((r: MasterRitual) => (
              <button key={r.id}
                onClick={() => setExpandedRitual(expandedRitual === r.id ? null : r.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all active:scale-95 shrink-0"
                style={{
                  background: expandedRitual === r.id
                    ? "color-mix(in srgb, var(--primary) 15%, transparent)"
                    : "var(--card)",
                  border: `1px solid ${expandedRitual === r.id ? "var(--primary)" : "var(--border)"}`,
                  color: expandedRitual === r.id ? "var(--primary)" : "var(--foreground)",
                }}>
                <span>{r.icon}</span>
                <span className="text-xs tracking-wide" style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}>{r.name}</span>
              </button>
            ))}
          </div>

          {expandedRitual && (() => {
            const r = triggeredRituals.find((x: MasterRitual) => x.id === expandedRitual);
            if (!r) return null;
            return (
              <div className="rounded-2xl p-5 space-y-4 fade-in"
                style={{ background: "var(--card)", border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.icon}</span>
                  <h3 className="text-sm tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter)", fontWeight: 600, color: "var(--primary)" }}>
                    {r.name}
                  </h3>
                </div>
                <RitualList steps={r.steps} />
              </div>
            );
          })()}
        </div>
      )}

      {/* Special event sections */}
      {astro.specialEvents.map((ev, i) => {
        const content = getSpecialSectionContent(ev.type);
        if (!content) return null;
        return (
          <SectionCard key={i} icon={content.icon} title={content.title}
            checkedKeys={checkins} accent="var(--accent-warm, #a78bfa)">
            <p className="text-base leading-relaxed">{content.body}</p>
          </SectionCard>
        );
      })}

      {/* Morning Ritual */}
      <SectionCard icon="🌅" title="Morning Ritual" checkinKey="morning"
        checkedKeys={checkins} onToggle={toggle}>
        <RitualList steps={ritual.morningRitual} />
      </SectionCard>

      {/* Journal Prompt */}
      <SectionCard icon="📖" title="Journal Prompt" checkinKey="journal"
        checkedKeys={checkins} onToggle={toggle}>
        <blockquote className="border-l-2 pl-4 italic text-base leading-relaxed"
          style={{ borderColor: "var(--primary)" }}>
          &ldquo;{ritual.journalPrompt}&rdquo;
        </blockquote>
      </SectionCard>

      {/* Mirror Reflection */}
      <SectionCard icon="🪞" title="Mirror Reflection" checkinKey="mirror"
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
      <SectionCard icon="💎" title="Crystal of the Day" checkinKey="crystal"
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
      <SectionCard icon="✨" title="Glamour Magic — What to Wear" checkinKey="wear"
        checkedKeys={checkins} onToggle={toggle}>
        <div className="space-y-2">
          <p className="text-lg" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 600, color: "var(--primary)" }}>
            {ritual.glamour.color}
          </p>
          <p className="text-base leading-relaxed">{ritual.glamour.suggestion}</p>
        </div>
      </SectionCard>

      {/* Evening Ritual */}
      <SectionCard icon="🌙" title="Evening Ritual" checkinKey="evening"
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
