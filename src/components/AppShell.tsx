"use client";

import { useState, useEffect } from "react";
import { TodayTab } from "@/components/TodayTab";
import { CalendarTab } from "@/components/CalendarTab";
import { IconToday, IconMoon, IconLearn, IconProfile } from "@/components/icons";

// 4 tabs — Crystals merged into Learn (LearnTab spec v1.1)
type Tab = "today" | "calendar" | "learn" | "profile";
type ColorMode = "dawn" | "day" | "dusk" | "night";

// Nav tab definitions with SVG icon components
type TabDef = { id: Tab; label: string; Icon: React.ComponentType<{ size?: number; color?: string; active?: boolean }> };
const TABS: TabDef[] = [
  { id: "today",    label: "Today",   Icon: IconToday   },
  { id: "calendar", label: "Moon",    Icon: IconMoon    },
  { id: "learn",    label: "Learn",   Icon: IconLearn   },
  { id: "profile",  label: "Profile", Icon: IconProfile },
];

function getColorMode(hour: number): ColorMode {
  if (hour >= 6  && hour < 11) return "dawn";
  if (hour >= 11 && hour < 16) return "day";
  if (hour >= 16 && hour < 20) return "dusk";
  return "night";
}

function applyColorMode(mode: ColorMode) {
  const html = document.documentElement;
  html.classList.remove("day", "dusk", "night");
  if (mode === "day")   html.classList.add("day");
  if (mode === "dusk")  html.classList.add("dusk");
  if (mode === "night") html.classList.add("night");
  // dawn = no extra class (uses :root defaults)
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

  const textColor =
    mode === "dawn" || mode === "day" ? "#1A1208" :
    mode === "dusk"                   ? "#7A2A18" :
    "var(--foreground)";

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
  const [activeTab,    setActiveTab]   = useState<Tab>("today");
  const [colorMode,    setColorMode]   = useState<ColorMode>("night");
  const [mounted,      setMounted]     = useState(false);
  const [devMode,      setDevMode]     = useState(false);
  const [manualMode,   setManualMode]  = useState<ColorMode | null>(null);

  // Set mode on mount + every 5 min (unless manually overridden)
  useEffect(() => {
    const isDev = typeof window !== "undefined" &&
      (window.location.search.includes("dev") || window.location.hostname === "localhost");
    setDevMode(isDev);

    const update = () => {
      if (manualMode) return; // don't override manual selection
      const mode = getColorMode(new Date().getHours());
      setColorMode(mode);
      applyColorMode(mode);
    };
    update();
    setMounted(true);

    const id = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply manual override
  const switchMode = (mode: ColorMode) => {
    setManualMode(mode);
    setColorMode(mode);
    applyColorMode(mode);
  };

  const isNight = colorMode === "night";

  // Use CSS variable for gradient — defined per mode in globals.css
  const bgGrad = "var(--bg-gradient)";

  // Desktop surround background (outside phone frame)
  const desktopBg =
    colorMode === "night"
      ? "radial-gradient(ellipse at 60% 20%, #1a1035 0%, #080910 60%, #05060f 100%)"
      : colorMode === "dusk"
      ? "radial-gradient(ellipse at 50% 0%, #F0C890 0%, #A878A8 50%, #784868 100%)"
      : colorMode === "day"
      ? "radial-gradient(ellipse at 40% 0%, #C8D8EC 0%, #DDE8F0 60%, #EEE8E0 100%)"
      : "radial-gradient(ellipse at 40% 0%, #E2D4F0 0%, #F0D4C8 60%, #F5EDE0 100%)";

  const navBg     = "var(--nav-bg)";
  const navBorder = "var(--nav-border)";
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

          {/* Status bar — desktop only (phone has its own system status bar) */}
          <div className="hidden sm:block">
            <div style={{ height: 44 }} />
            <StatusBar mode={colorMode} />
          </div>

          {/* Dev mode switcher — visible on localhost or ?dev */}
          {devMode && (
            <div className="flex items-center justify-center gap-1 py-1.5 shrink-0"
              style={{ borderBottom: "1px solid var(--divider)" }}>
              {(["dawn","day","dusk","night"] as ColorMode[]).map((m) => (
                <button key={m} onClick={() => switchMode(m)}
                  style={{
                    padding: "2px 10px",
                    borderRadius: 20,
                    fontSize: 10,
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    border: "1px solid var(--divider)",
                    background: colorMode === m ? "var(--primary)" : "transparent",
                    color: colorMode === m ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    transition: "all 200ms",
                  }}>
                  {m}
                </button>
              ))}
            </div>
          )}
          {/* Safe area spacer for iPhone notch/Dynamic Island */}
          <div className="sm:hidden" style={{ height: "env(safe-area-inset-top, 0px)" }} />

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
            {activeTab === "calendar" && <CalendarTab colorMode={colorMode} />}
            {/* crystals tab removed — Crystal Library is now inside Learn tab (spec v1.1) */}
            {activeTab === "learn"    && <PlaceholderTab name="Learn" />}
            {activeTab === "profile"  && <PlaceholderTab name="Profile" />}
          </main>

          {/* Bottom nav */}
          <nav className="shrink-0 flex border-t relative z-10"
            style={{ background: navBg, borderColor: navBorder,
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const iconColor = isActive ? "var(--primary)" : "var(--icon-inactive, #6B5E8A)";
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all active:scale-95">
                  <tab.Icon size={24} color={iconColor} active={isActive} />
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
