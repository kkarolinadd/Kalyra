"use client";

import { useState } from "react";
import { getSunSign, getMoonSign, type ZodiacSign, SIGN_SYMBOL } from "@/lib/astrology";
import { saveProfile } from "@/lib/storage";
import { Button } from "@/components/ui/button";

interface Props {
  onComplete: () => void;
}

type Step = "welcome" | "name" | "birthdate" | "birthtime" | "summary";

const ZODIAC_ELEMENT: Record<ZodiacSign, string> = {
  Aries: "Fire", Taurus: "Earth", Gemini: "Air", Cancer: "Water",
  Leo: "Fire", Virgo: "Earth", Libra: "Air", Scorpio: "Water",
  Sagittarius: "Fire", Capricorn: "Earth", Aquarius: "Air", Pisces: "Water",
};

const ELEMENT_COLOR: Record<string, string> = {
  Fire: "#e87040",
  Earth: "#7a9e5f",
  Air: "#7ab3c9",
  Water: "#5f7abf",
};

export function OnboardingFlow({ onComplete }: Props) {
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");

  const next = (nextStep: Step) => setStep(nextStep);

  const sunSign = birthDate ? getSunSign(new Date(birthDate + "T12:00:00")) : null;
  const moonSign = birthDate ? getMoonSign(new Date(birthDate + "T12:00:00")) : null;

  const finish = () => {
    if (!sunSign || !moonSign) return;
    saveProfile({
      name: name.trim() || "friend",
      birth_date: birthDate,
      birth_time: birthTime || undefined,
      birth_city: birthCity || undefined,
      sun_sign: sunSign,
      moon_sign: moonSign,
    });
    onComplete();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "linear-gradient(180deg, #0d0e1a 0%, #111328 100%)" }}>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.7 ? 2 : 1,
              height: Math.random() > 0.7 ? 2 : 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm fade-in">
        {step === "welcome" && (
          <div className="text-center space-y-8">
            <div className="space-y-3">
              <div className="text-5xl">✦</div>
              <h1 className="font-[family-name:var(--font-cinzel)] text-3xl shimmer">
                Kalyra
              </h1>
              <p className="text-[#8a8ba0] text-base italic">
                Your daily ritual companion
              </p>
            </div>
            <p className="text-[#f5f0e8] text-lg leading-relaxed">
              Every morning, know exactly what to do, what to wear, which crystal to carry, and what to reflect on.
            </p>
            <p className="text-[#8a8ba0] text-sm">
              Guided by the moon. Personalized to you.
            </p>
            <Button onClick={() => next("name")} className="w-full mt-4" style={{
              background: "#c9a84c", color: "#0d0e1a", fontFamily: "var(--font-cinzel)",
              letterSpacing: "0.08em", fontWeight: 600,
            }}>
              Begin your journey
            </Button>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <p className="text-[#8a8ba0] text-sm font-[family-name:var(--font-cinzel)] tracking-widest uppercase">Step 1 of 3</p>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#f5f0e8]">
                What&apos;s your name?
              </h2>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              className="w-full px-4 py-3 rounded-xl text-lg text-[#f5f0e8] placeholder-[#8a8ba0] outline-none focus:ring-1 transition"
              style={{ background: "#13152a", border: "1px solid #1e2140", fontFamily: "inherit" }}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && name.trim() && next("birthdate")}
            />
            <Button onClick={() => next("birthdate")} disabled={!name.trim()} className="w-full" style={{
              background: name.trim() ? "#c9a84c" : "#1e2140",
              color: name.trim() ? "#0d0e1a" : "#8a8ba0",
              fontFamily: "var(--font-cinzel)", letterSpacing: "0.08em",
            }}>
              Continue
            </Button>
          </div>
        )}

        {step === "birthdate" && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <p className="text-[#8a8ba0] text-sm font-[family-name:var(--font-cinzel)] tracking-widest uppercase">Step 2 of 3</p>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#f5f0e8]">
                When were you born?
              </h2>
              <p className="text-[#8a8ba0] text-sm">This calculates your Sun and Moon signs</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[#8a8ba0] text-sm block mb-2">Date of birth</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-lg text-[#f5f0e8] outline-none"
                  style={{ background: "#13152a", border: "1px solid #1e2140", fontFamily: "inherit", colorScheme: "dark" }}
                />
              </div>
              <div>
                <label className="text-[#8a8ba0] text-sm block mb-1">
                  Time of birth <span className="italic">(optional — unlocks Rising sign)</span>
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-lg text-[#f5f0e8] outline-none"
                  style={{ background: "#13152a", border: "1px solid #1e2140", fontFamily: "inherit", colorScheme: "dark" }}
                />
              </div>
              <div>
                <label className="text-[#8a8ba0] text-sm block mb-1">
                  City of birth <span className="italic">(optional)</span>
                </label>
                <input
                  type="text"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  placeholder="e.g. Warsaw, London"
                  className="w-full px-4 py-3 rounded-xl text-lg text-[#f5f0e8] placeholder-[#8a8ba0] outline-none"
                  style={{ background: "#13152a", border: "1px solid #1e2140", fontFamily: "inherit" }}
                />
              </div>
            </div>
            <Button onClick={() => next("summary")} disabled={!birthDate} className="w-full" style={{
              background: birthDate ? "#c9a84c" : "#1e2140",
              color: birthDate ? "#0d0e1a" : "#8a8ba0",
              fontFamily: "var(--font-cinzel)", letterSpacing: "0.08em",
            }}>
              Calculate my signs
            </Button>
          </div>
        )}

        {step === "summary" && sunSign && moonSign && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <p className="text-[#8a8ba0] text-sm font-[family-name:var(--font-cinzel)] tracking-widest uppercase">Your birth chart</p>
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#f5f0e8]">
                Welcome, {name || "friend"} ✦
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { label: "Sun Sign", sign: sunSign, desc: "Your conscious identity and life force" },
                { label: "Moon Sign", sign: moonSign, desc: "Your emotional nature and inner world" },
              ].map(({ label, sign, desc }) => (
                <div key={label} className="rounded-xl p-4 flex items-center gap-4"
                  style={{ background: "#13152a", border: "1px solid #1e2140" }}>
                  <div className="text-3xl w-12 text-center"
                    style={{ color: ELEMENT_COLOR[ZODIAC_ELEMENT[sign]] }}>
                    {SIGN_SYMBOL[sign]}
                  </div>
                  <div>
                    <p className="text-[#8a8ba0] text-xs font-[family-name:var(--font-cinzel)] tracking-widest uppercase">{label}</p>
                    <p className="text-[#f5f0e8] text-xl font-[family-name:var(--font-cinzel)]">{sign}</p>
                    <p className="text-[#8a8ba0] text-sm italic">{desc}</p>
                  </div>
                </div>
              ))}

              {!birthTime && (
                <p className="text-[#8a8ba0] text-sm text-center italic px-4">
                  Without your birth time, I can&apos;t calculate your Rising sign. You can add it later in your profile.
                </p>
              )}
            </div>

            <Button onClick={finish} className="w-full" style={{
              background: "#c9a84c", color: "#0d0e1a",
              fontFamily: "var(--font-cinzel)", letterSpacing: "0.08em", fontWeight: 600,
            }}>
              Enter Kalyra ✦
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
