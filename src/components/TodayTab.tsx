"use client";

import { useEffect, useState } from "react";
import { getDailyAstrology, MOON_PHASE_EMOJI, PLANET_SYMBOL, SIGN_SYMBOL, type DailyAstrology } from "@/lib/astrology";
import { getRitual, getGreeting, getSpecialSectionContent } from "@/lib/ritualContent";
import { getProfile, getTodayCheckins, toggleCheckin, canUseAiRitual, markAiRitualUsed, type CheckinKey } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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
        background: "#13152a",
        border: `1px solid ${checked ? "#c9a84c40" : "#1e2140"}`,
        transition: "border-color 0.3s",
      }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-[family-name:var(--font-cinzel)] text-sm tracking-widest uppercase"
            style={{ color: accent ?? "#c9a84c" }}>
            {title}
          </h3>
        </div>
        {checkinKey && onToggle && (
          <div className="flex items-center gap-2 shrink-0">
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggle(checkinKey)}
              className="border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
            />
          </div>
        )}
      </div>
      <div className="text-[#f5f0e8]">{children}</div>
    </div>
  );
}

function RitualList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-[family-name:var(--font-cinzel)]"
            style={{ background: "#1e2140", color: "#c9a84c" }}>
            {i + 1}
          </span>
          <span className="text-base leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function TodayTab() {
  const [astro, setAstro] = useState<DailyAstrology | null>(null);
  const [checkins, setCheckins] = useState<CheckinKey[]>([]);
  const [aiState, setAiState] = useState<"idle" | "loading" | "done">("idle");
  const [aiContent, setAiContent] = useState("");
  const [aiUsed, setAiUsed] = useState(false);

  const profile = getProfile();

  useEffect(() => {
    setAstro(getDailyAstrology());
    setCheckins(getTodayCheckins());
    setAiUsed(!canUseAiRitual());
  }, []);

  if (!astro) return null;

  const ritual = getRitual(astro.moonPhase, astro.dayRuler);
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
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Greeting */}
      <div className="text-center space-y-1 pt-2">
        <p className="text-[#8a8ba0] text-sm italic">{dateStr}</p>
        <p className="text-[#f5f0e8] text-lg leading-snug">{greeting}</p>
      </div>

      {/* Cosmic Header */}
      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: "linear-gradient(135deg, #13152a 0%, #0f1126 100%)", border: "1px solid #1e2140" }}>
        <div className="flex items-center justify-between">
          <h1 className="shimmer font-[family-name:var(--font-cinzel)] text-2xl">
            Kalyra
          </h1>
          <span className="text-3xl">{MOON_PHASE_EMOJI[astro.moonPhase]}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: "#0d0e1a" }}>
            <p className="text-[#8a8ba0] text-xs font-[family-name:var(--font-cinzel)] tracking-widest uppercase mb-1">Moon Phase</p>
            <p className="text-[#f5f0e8] font-[family-name:var(--font-cinzel)] text-sm">{astro.moonPhase}</p>
            <p className="text-[#8a8ba0] text-xs">{astro.moonIllumination}% illuminated · day {astro.phaseCycleDay}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: "#0d0e1a" }}>
            <p className="text-[#8a8ba0] text-xs font-[family-name:var(--font-cinzel)] tracking-widest uppercase mb-1">Moon Sign</p>
            <p className="text-[#f5f0e8] font-[family-name:var(--font-cinzel)] text-sm">
              {SIGN_SYMBOL[astro.moonSign]} {astro.moonSign}
            </p>
            <p className="text-[#8a8ba0] text-xs">Sun in {SIGN_SYMBOL[astro.sunSign]} {astro.sunSign}</p>
          </div>
          <div className="rounded-xl p-3 col-span-2" style={{ background: "#0d0e1a" }}>
            <p className="text-[#8a8ba0] text-xs font-[family-name:var(--font-cinzel)] tracking-widest uppercase mb-1">Day Ruler</p>
            <p className="text-[#f5f0e8] font-[family-name:var(--font-cinzel)] text-sm">
              {PLANET_SYMBOL[astro.dayRuler]} {astro.dayRuler}
            </p>
          </div>
        </div>

        {astro.specialEvents.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {astro.specialEvents.map((ev, i) => (
              <Badge key={i} className="text-xs font-[family-name:var(--font-cinzel)]"
                style={{ background: "#c9a84c20", color: "#c9a84c", border: "1px solid #c9a84c40" }}>
                ✦ {ev.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Special event sections */}
      {astro.specialEvents.map((ev, i) => {
        const content = getSpecialSectionContent(ev.type);
        if (!content) return null;
        return (
          <SectionCard key={i} icon={content.icon} title={content.title}
            checkedKeys={checkins} accent="#a78bfa">
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
          style={{ borderColor: "#c9a84c" }}>
          &ldquo;{ritual.journalPrompt}&rdquo;
        </blockquote>
      </SectionCard>

      {/* Mirror Reflection */}
      <SectionCard icon="🪞" title="Mirror Reflection" checkinKey="mirror"
        checkedKeys={checkins} onToggle={toggle}>
        <div className="rounded-xl p-4 text-center space-y-2"
          style={{ background: "#0d0e1a", border: "1px solid #1e2140" }}>
          <p className="text-[#8a8ba0] text-xs font-[family-name:var(--font-cinzel)] tracking-widest uppercase">Read aloud · in the mirror</p>
          <p className="text-lg italic leading-relaxed" style={{ color: "#f5e09a" }}>
            &ldquo;{ritual.mirrorReflection}&rdquo;
          </p>
        </div>
      </SectionCard>

      {/* Crystal of the Day */}
      <SectionCard icon="💎" title="Crystal of the Day" checkinKey="crystal"
        checkedKeys={checkins} onToggle={toggle}>
        <div className="space-y-3">
          <p className="font-[family-name:var(--font-cinzel)] text-xl" style={{ color: "#c9a84c" }}>
            {ritual.crystal.name}
          </p>
          <p className="text-sm" style={{ color: "#8a8ba0" }}>{ritual.crystal.why}</p>
          <div className="rounded-xl p-3" style={{ background: "#0d0e1a" }}>
            <p className="text-xs font-[family-name:var(--font-cinzel)] tracking-widest uppercase mb-1" style={{ color: "#8a8ba0" }}>How to use today</p>
            <p className="text-base">{ritual.crystal.howToUse}</p>
          </div>
        </div>
      </SectionCard>

      {/* Glamour Magic */}
      <SectionCard icon="✨" title="Glamour Magic — What to Wear" checkinKey="wear"
        checkedKeys={checkins} onToggle={toggle}>
        <div className="space-y-2">
          <p className="font-[family-name:var(--font-cinzel)] text-lg" style={{ color: "#c9a84c" }}>
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
            background: isFullAlignment ? "linear-gradient(135deg, #1a1a0d, #1a150a)" : "#13152a",
            border: `1px solid ${isFullAlignment ? "#c9a84c" : "#1e2140"}`,
          }}>
          <p className="text-3xl">{isFullAlignment ? "🌟" : isMostlyDone ? "✨" : "🌙"}</p>
          <p className="font-[family-name:var(--font-cinzel)] text-base" style={{ color: "#c9a84c" }}>
            {isFullAlignment
              ? "You're in full alignment today"
              : isMostlyDone
              ? "Moon-powered. Keep going."
              : `${doneCount} of ${allCheckins.length} rituals complete`}
          </p>
          <div className="flex justify-center gap-1 mt-2">
            {allCheckins.map((key) => (
              <div key={key} className="w-2 h-2 rounded-full"
                style={{ background: checkins.includes(key) ? "#c9a84c" : "#1e2140" }} />
            ))}
          </div>
        </div>
      )}

      {/* AI Ritual Generator */}
      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: "#13152a", border: "1px dashed #1e2140" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-[family-name:var(--font-cinzel)] text-sm tracking-widest uppercase" style={{ color: "#8a8ba0" }}>
              AI Ritual Generator
            </h3>
            <p className="text-xs" style={{ color: "#8a8ba0" }}>
              {aiUsed && aiState !== "done" ? "Used today — come back tomorrow" : "Personalized ritual · 1× per day"}
            </p>
          </div>
        </div>

        {aiState === "done" && (
          <div className="rounded-xl p-4 space-y-3" style={{ background: "#0d0e1a" }}>
            <p className="text-xs font-[family-name:var(--font-cinzel)] tracking-widest uppercase" style={{ color: "#c9a84c" }}>
              Your personalized ritual
            </p>
            <p className="text-base leading-relaxed whitespace-pre-line">{aiContent}</p>
          </div>
        )}

        {aiState !== "done" && (
          <button
            onClick={handleGenerateRitual}
            disabled={aiUsed || aiState === "loading"}
            className="w-full py-3 rounded-xl font-[family-name:var(--font-cinzel)] text-sm tracking-widest uppercase transition"
            style={{
              background: aiUsed ? "#1e2140" : "linear-gradient(90deg, #7a5e1f, #c9a84c, #7a5e1f)",
              color: aiUsed ? "#8a8ba0" : "#0d0e1a",
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
