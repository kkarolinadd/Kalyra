"use client";

import { useState } from "react";
import { TodayTab } from "@/components/TodayTab";

type Tab = "today" | "calendar" | "crystals" | "learn" | "profile";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "today", icon: "✨", label: "Today" },
  { id: "calendar", icon: "📅", label: "Moon" },
  { id: "crystals", icon: "💎", label: "Crystals" },
  { id: "learn", icon: "🔮", label: "Learn" },
  { id: "profile", icon: "👤", label: "Profile" },
];

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8 min-h-[60vh]">
      <div className="text-5xl opacity-30">✦</div>
      <h2 className="font-[family-name:var(--font-cinzel)] text-xl text-[#c9a84c]">{name}</h2>
      <p className="text-[#8a8ba0] text-base italic">Coming in the next update.</p>
    </div>
  );
}

function StatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 shrink-0"
      style={{ background: "#0d0e1a" }}>
      <span className="text-xs font-semibold text-[#f5f0e8]" style={{ fontFamily: "system-ui, sans-serif" }}>
        {time}
      </span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <div className="flex items-end gap-0.5 h-3">
          {[40, 60, 80, 100].map((h, i) => (
            <div key={i} className="w-[3px] rounded-[1px]"
              style={{ height: `${h}%`, background: i < 3 ? "#f5f0e8" : "#8a8ba0" }} />
          ))}
        </div>
        {/* WiFi */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M7 7.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#f5f0e8"/>
          <path d="M4.2 5.3a3.9 3.9 0 0 1 5.6 0" stroke="#f5f0e8" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          <path d="M1.5 2.5a7.1 7.1 0 0 1 11 0" stroke="#f5f0e8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="rounded-[2px] border border-[#f5f0e8] p-[1.5px] w-[20px] h-[11px] flex items-center">
            <div className="rounded-[1px] h-full bg-[#f5f0e8]" style={{ width: "75%" }} />
          </div>
          <div className="rounded-r-[1px] w-[2px] h-[5px]" style={{ background: "#f5f0e8", opacity: 0.6 }} />
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("today");

  return (
    /* Full-page desktop background */
    <div className="min-h-dvh flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 60% 20%, #1a1035 0%, #080910 60%, #05060f 100%)",
      }}>

      {/* Subtle stars in desktop background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: 1,
              height: 1,
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              opacity: ((i * 17 + 5) % 4) * 0.1 + 0.05,
            }} />
        ))}
      </div>

      {/* Phone frame */}
      <div className="relative mx-auto"
        style={{
          width: "min(390px, 100vw)",
          height: "min(844px, 100dvh)",
          maxHeight: "100dvh",
        }}>

        {/* Phone chrome (only visible on larger screens) */}
        <div className="hidden sm:block absolute inset-0 rounded-[44px] pointer-events-none"
          style={{
            boxShadow: "0 0 0 1px #2a2d4a, 0 0 0 2px #13152a, 0 40px 80px rgba(0,0,0,0.7), inset 0 0 0 1px #1e2140",
          }} />

        {/* Dynamic island */}
        <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 z-50 rounded-full"
          style={{ width: 120, height: 34, background: "#000" }} />

        {/* Screen */}
        <div className="relative flex flex-col overflow-hidden"
          style={{
            background: "#0d0e1a",
            height: "100%",
            borderRadius: "min(44px, 0px)",
          }}
          // Only apply border-radius on larger screens
        >
          <style>{`
            @media (min-width: 640px) {
              .phone-screen { border-radius: 44px !important; overflow: hidden; }
            }
          `}</style>

          <div className="phone-screen flex flex-col" style={{ height: "100%", background: "#0d0e1a" }}>
            {/* Status bar */}
            <div className="hidden sm:block">
              <div style={{ height: 44 }} /> {/* Space for dynamic island */}
              <StatusBar />
            </div>
            <div className="sm:hidden">
              <StatusBar />
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 80 }}>
              {activeTab === "today" && <TodayTab />}
              {activeTab === "calendar" && <PlaceholderTab name="Moon Calendar" />}
              {activeTab === "crystals" && <PlaceholderTab name="Crystals" />}
              {activeTab === "learn" && <PlaceholderTab name="Learn" />}
              {activeTab === "profile" && <PlaceholderTab name="Profile" />}
            </main>

            {/* Bottom nav — with safe area padding */}
            <nav className="shrink-0 flex border-t"
              style={{ background: "#0d0e1a", borderColor: "#1e2140", paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
              {TABS.map((tab) => (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all active:scale-95"
                  style={{ opacity: activeTab === tab.id ? 1 : 0.4 }}>
                  <span className="text-[22px] leading-none">{tab.icon}</span>
                  <span className="text-[9px] font-[family-name:var(--font-cinzel)] tracking-widest uppercase"
                    style={{ color: activeTab === tab.id ? "#c9a84c" : "#8a8ba0" }}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="w-1 h-1 rounded-full" style={{ background: "#c9a84c" }} />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
