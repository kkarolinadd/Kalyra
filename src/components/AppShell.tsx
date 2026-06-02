"use client";

import { useState, useEffect } from "react";
import { TodayTab } from "@/components/TodayTab";

type Tab = "today" | "calendar" | "crystals" | "learn" | "profile";
type ColorMode = "morning" | "mid" | "dark";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "today",    icon: "✨", label: "Today"   },
  { id: "calendar", icon: "📅", label: "Moon"    },
  { id: "crystals", icon: "💎", label: "Crystals"},
  { id: "learn",    icon: "🔮", label: "Learn"   },
  { id: "profile",  icon: "👤", label: "Profile" },
];

function getColorMode(hour: number): ColorMode {
  if (hour >= 6  && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "mid";
  return "dark";
}

function applyColorMode(mode: ColorMode) {
  const html = document.documentElement;
  html.classList.remove("mid", "dark");
  if (mode === "mid")  html.classList.add("mid");
  if (mode === "dark") html.classList.add("dark");
}

// Stars — generated once, rendered in Night mode only
const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left:    `${((i * 37 + 13) % 100).toFixed(1)}%`,
  top:     `${((i * 53 + 7)  % 100).toFixed(1)}%`,
  size:    i % 5 === 0 ? 2 : 1,
  opacity: (((i * 17 + 5) % 6) * 0.1 + 0.2).toFixed(2),
  delay:   `${((i * 0.37) % 4).toFixed(2)}s`,
}));

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8 min-h-[60vh]">
      <div className="text-5xl opacity-20">✦</div>
      <h2 className="text-xl" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--primary)" }}>
        {name}
      </h2>
      <p className="text-base italic" style={{ color: "var(--muted-foreground)" }}>
        Coming in the next update.
      </p>
    </div>
  );
}

function StatusBar({ mode }: { mode: ColorMode }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  const textColor = mode === "morning" ? "#1A1208" : "var(--foreground)";

  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 shrink-0">
      <span className="text-xs font-semibold" style={{ fontFamily: "system-ui, sans-serif", color: textColor }}>
        {time}
      </span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-0.5 h-3">
          {[40, 60, 80, 100].map((h, i) => (
            <div key={i} className="w-[3px] rounded-[1px]"
              style={{ height: `${h}%`, background: i < 3 ? textColor : `${textColor}60` }} />
          ))}
        </div>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M7 7.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill={textColor}/>
          <path d="M4.2 5.3a3.9 3.9 0 0 1 5.6 0" stroke={textColor} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          <path d="M1.5 2.5a7.1 7.1 0 0 1 11 0" stroke={textColor} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
        </svg>
        <div className="flex items-center gap-0.5">
          <div className="rounded-[2px] border p-[1.5px] w-[20px] h-[11px] flex items-center"
            style={{ borderColor: textColor }}>
            <div className="rounded-[1px] h-full" style={{ width: "75%", background: textColor }} />
          </div>
          <div className="rounded-r-[1px] w-[2px] h-[5px]" style={{ background: textColor, opacity: 0.6 }} />
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const [activeTab, setActiveTab]   = useState<Tab>("today");
  const [colorMode, setColorMode]   = useState<ColorMode>("dark");
  const [mounted,   setMounted]     = useState(false);

  // Set mode on mount + every hour
  useEffect(() => {
    const update = () => {
      const mode = getColorMode(new Date().getHours());
      setColorMode(mode);
      applyColorMode(mode);
    };
    update();
    setMounted(true);

    // Check every 5 minutes (smooth transition handles visual)
    const id = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const isNight    = colorMode === "dark";
  const isMorning  = colorMode === "morning";
  const bgGrad     = colorMode === "mid"
    ? "linear-gradient(180deg, #E8943A 0%, #C4687A 50%, #2A1510 100%)"
    : "var(--background)";

  // Desktop surround background
  const desktopBg = isNight
    ? "radial-gradient(ellipse at 60% 20%, #1a1035 0%, #080910 60%, #05060f 100%)"
    : isMorning
    ? "radial-gradient(ellipse at 40% 10%, #e8d5bb 0%, #c8b090 100%)"
    : "radial-gradient(ellipse at 50% 0%, #8B3A1A 0%, #1A0800 100%)";

  const navBg       = colorMode === "morning" ? "var(--card)"       : "var(--background)";
  const navBorder   = "var(--border)";
  const activeColor = "var(--primary)";
  const inactiveColor = "var(--muted-foreground)";

  if (!mounted) return (
    <div className="min-h-dvh flex items-center justify-center" style={{ background: "#0D0A1A" }}>
      <div className="shimmer text-3xl" style={{ fontFamily: "var(--font-cormorant), serif" }}>✦</div>
    </div>
  );

  return (
    <div className="min-h-dvh flex items-center justify-center mode-transition" style={{ background: desktopBg }}>

      {/* Desktop background stars (Night only) */}
      {isNight && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {STARS.slice(0, 40).map((s) => (
            <div key={s.id} className="star"
              style={{ left: s.left, top: s.top, width: s.size, height: s.size,
                "--delay": s.delay, "--star-base-opacity": s.opacity } as React.CSSProperties} />
          ))}
        </div>
      )}

      {/* Phone frame */}
      <div className="relative mx-auto"
        style={{ width: "min(390px, 100vw)", height: "min(844px, 100dvh)", maxHeight: "100dvh" }}>

        {/* Phone chrome — desktop only */}
        <div className="hidden sm:block absolute inset-0 rounded-[44px] pointer-events-none"
          style={{ boxShadow: "0 0 0 1px #2a2d4a, 0 0 0 2px #13152a, 0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)" }} />

        {/* Dynamic Island */}
        <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 z-50 rounded-full"
          style={{ width: 120, height: 34, background: "#000" }} />

        {/* Screen */}
        <div className="flex flex-col overflow-hidden mode-transition"
          style={{ background: bgGrad, height: "100%", borderRadius: "clamp(0px, 44px, 44px)" }}>

          {/* Status bar */}
          <div className="hidden sm:block" style={{ height: 44 }} />
          <StatusBar mode={colorMode} />

          {/* Stars inside phone — Night mode */}
          {isNight && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[44px]">
              {STARS.slice(40, 100).map((s) => (
                <div key={s.id} className="star"
                  style={{ left: s.left, top: s.top, width: s.size, height: s.size,
                    "--delay": s.delay, "--star-base-opacity": s.opacity } as React.CSSProperties} />
              ))}
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 overflow-y-auto relative z-10" style={{ paddingBottom: 80 }}>
            {activeTab === "today"    && <TodayTab colorMode={colorMode} />}
            {activeTab === "calendar" && <PlaceholderTab name="Moon Calendar" />}
            {activeTab === "crystals" && <PlaceholderTab name="Crystals" />}
            {activeTab === "learn"    && <PlaceholderTab name="Learn" />}
            {activeTab === "profile"  && <PlaceholderTab name="Profile" />}
          </main>

          {/* Bottom nav */}
          <nav className="shrink-0 flex border-t relative z-10"
            style={{ background: navBg, borderColor: navBorder,
              paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all active:scale-95"
                  style={{ opacity: isActive ? 1 : 0.45 }}>
                  <span className="text-[22px] leading-none">{tab.icon}</span>
                  <span className="text-[9px] tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600,
                      color: isActive ? activeColor : inactiveColor }}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <div className="w-1 h-1 rounded-full" style={{ background: activeColor }} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
