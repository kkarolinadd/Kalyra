/**
 * Kalyra Icon System v1.0
 * Linear icons, stroke-width 1.5, rounded caps, no fill (except moon phases)
 * Base: Lucide React + custom SVGs for moon phases, crystals, sections
 */

import {
  BookOpen,
  User,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ─── Global icon style ────────────────────────────────────────────────────────

const BASE = {
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

function Svg({ size = 24, color = "currentColor", children, className, style }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      stroke={color} fill="none"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}
    >
      {children}
    </svg>
  );
}

// ─── Nav Bar Icons ────────────────────────────────────────────────────────────

/** TODAY — half moon (first quarter), left half filled */
export function IconToday({ size = 24, color = "currentColor", active = false }: IconProps & { active?: boolean }) {
  const fill = active ? color : "none";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer circle */}
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} fill="none" />
      {/* Left half fill (active state) */}
      {active && (
        <path d="M12 3 A9 9 0 0 0 12 21 Z" fill={color} stroke="none" />
      )}
      {!active && (
        <path d="M12 3 A9 9 0 0 0 12 21 Z" fill={color} fillOpacity={0.25} stroke="none" />
      )}
      {/* Center dividing line */}
      <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

/** MOON — crescent, open to the right */
export function IconMoon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
  );
}

/** CRYSTALS — geometric gem with facets */
export function IconCrystal({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      {/* Crown */}
      <path d="M8 8 L12 3 L16 8" />
      {/* Body */}
      <path d="M4 8 L8 8 L12 20 L16 8 L20 8" />
      <path d="M4 8 L12 20 L20 8" />
      {/* Facet lines */}
      <line x1="8" y1="8" x2="12" y2="20" />
      <line x1="16" y1="8" x2="12" y2="20" />
    </Svg>
  );
}

/** LEARN — 4-pointed star / iskra */
export function IconLearn({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </Svg>
  );
}

/** YOU / PROFILE — silhouette */
export function IconProfile({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20 C4 16 8 13 12 13 C16 13 20 16 20 20" />
    </Svg>
  );
}

// ─── Section Icons (20×20, gold) ─────────────────────────────────────────────

/** Morning Ritual — sunrise with rays */
export function IconSunrise({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      {/* Horizon */}
      <line x1="2" y1="17" x2="22" y2="17" />
      {/* Sun half-circle */}
      <path d="M7 17 A5 5 0 0 1 17 17" />
      {/* Rays */}
      <line x1="12" y1="4" x2="12" y2="7" />
      <line x1="5.5" y1="6.5" x2="7.5" y2="8.5" />
      <line x1="18.5" y1="6.5" x2="16.5" y2="8.5" />
      <line x1="3" y1="12" x2="5.5" y2="12" />
      <line x1="21" y1="12" x2="18.5" y2="12" />
    </Svg>
  );
}

/** Evening Ritual — crescent + star */
export function IconEvening({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <path d="M18 13A7 7 0 1 1 9 4a5 5 0 0 0 9 9z" />
      <path d="M17 3 L17.5 4.5 L19 5 L17.5 5.5 L17 7 L16.5 5.5 L15 5 L16.5 4.5 Z" />
    </Svg>
  );
}

/** Journal Prompt — quill pen */
export function IconJournal({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <path d="M20 4 C16 4 8 8 5 20" />
      <path d="M20 4 C20 8 16 12 5 20" />
      <path d="M5 20 L7 15 L9 17 Z" />
      <path d="M14 7 L17 10" />
    </Svg>
  );
}

/** Mirror Reflection — oval mirror with handle */
export function IconMirror({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <ellipse cx="12" cy="9" rx="6" ry="7.5" />
      <line x1="12" y1="16.5" x2="12" y2="21" />
      <line x1="9.5" y1="20" x2="14.5" y2="20" />
      {/* Reflection glint */}
      <line x1="9" y1="6" x2="9" y2="9" strokeOpacity="0.5" />
    </Svg>
  );
}

/** Crystal of the Day — gem (same as nav, 20px) */
export function IconCrystalSection({ size = 20, color = "currentColor" }: IconProps) {
  return <IconCrystal size={size} color={color} />;
}

/** Glamour Magic — 3 sparkle stars */
export function IconGlamour({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      {/* Main star */}
      <path d="M12 3 L12.8 9.2 L19 10 L12.8 10.8 L12 17 L11.2 10.8 L5 10 L11.2 9.2 Z" />
      {/* Small stars */}
      <path d="M19 3 L19.4 5.6 L22 6 L19.4 6.4 L19 9 L18.6 6.4 L16 6 L18.6 5.6 Z" />
      <path d="M4 15 L4.3 17 L6 17.3 L4.3 17.6 L4 20 L3.7 17.6 L2 17.3 L3.7 17 Z" />
    </Svg>
  );
}

/** Energy / Day Ruler — lightning bolt */
export function IconEnergy({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <path d="M13 2 L4 13 L11 13 L11 22 L20 11 L13 11 Z" />
    </Svg>
  );
}

// ─── Moon Phases (for calendar & today card) ─────────────────────────────────

interface MoonIconProps {
  size?: number;
  litColor?: string;   // fill for illuminated part
  darkColor?: string;  // fill for dark part
  strokeColor?: string;
}

function MoonPhaseIcon({ size = 24, litColor, darkColor = "transparent", strokeColor, children }: MoonIconProps & { children?: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {children}
      <circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth={1.5} fill="none" />
    </svg>
  );
}

export function MoonNew({ size = 24, litColor = "#F0EAF8", strokeColor = "currentColor" }: MoonIconProps) {
  return <MoonPhaseIcon size={size} strokeColor={strokeColor}><circle cx="12" cy="12" r="9" fill={litColor} stroke={strokeColor} strokeWidth={1.5} /></MoonPhaseIcon>;
}

export function MoonWaxingCrescent({ size = 24, litColor = "#F0EAF8", strokeColor = "currentColor" }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth={1.5} fill="none" />
      <path d="M12 3 A9 9 0 0 1 12 21 A5 5 0 0 0 12 3 Z" fill={litColor} stroke="none" />
    </svg>
  );
}

export function MoonFirstQuarter({ size = 24, litColor = "#F0EAF8", strokeColor = "currentColor" }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth={1.5} fill="none" />
      <path d="M12 3 A9 9 0 0 1 12 21 Z" fill={litColor} stroke="none" />
      <line x1="12" y1="3" x2="12" y2="21" stroke={strokeColor} strokeWidth={1.5} />
    </svg>
  );
}

export function MoonWaxingGibbous({ size = 24, litColor = "#F0EAF8", strokeColor = "currentColor" }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={litColor} stroke={strokeColor} strokeWidth={1.5} />
      <path d="M12 3 A9 9 0 0 0 12 21 A4 4 0 0 1 12 3 Z" fill="none" stroke="none" />
    </svg>
  );
}

export function MoonFull({ size = 24, litColor = "#F0EAF8", strokeColor = "#C9A84C" }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={litColor} stroke={strokeColor} strokeWidth={2} />
    </svg>
  );
}

export function MoonWaningGibbous({ size = 24, litColor = "#F0EAF8", strokeColor = "currentColor" }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={litColor} stroke={strokeColor} strokeWidth={1.5} />
      <path d="M12 3 A9 9 0 0 1 12 21 A4 4 0 0 0 12 3 Z" fill="none" stroke="none" />
    </svg>
  );
}

export function MoonLastQuarter({ size = 24, litColor = "#F0EAF8", strokeColor = "currentColor" }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth={1.5} fill="none" />
      <path d="M12 3 A9 9 0 0 0 12 21 Z" fill={litColor} stroke="none" />
      <line x1="12" y1="3" x2="12" y2="21" stroke={strokeColor} strokeWidth={1.5} />
    </svg>
  );
}

export function MoonWaningCrescent({ size = 24, litColor = "#F0EAF8", strokeColor = "currentColor" }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth={1.5} fill="none" />
      <path d="M12 3 A9 9 0 0 0 12 21 A5 5 0 0 1 12 3 Z" fill={litColor} stroke="none" />
    </svg>
  );
}

// ─── Moon phase picker helper ─────────────────────────────────────────────────

import type { MoonPhase } from "@/lib/astrology";

export function MoonPhaseIcon2({ phase, size = 24, litColor, strokeColor }: { phase: MoonPhase } & MoonIconProps) {
  const props = { size, litColor, strokeColor };
  switch (phase) {
    case "New Moon":        return <MoonNew {...props} />;
    case "Waxing Crescent": return <MoonWaxingCrescent {...props} />;
    case "First Quarter":   return <MoonFirstQuarter {...props} />;
    case "Waxing Gibbous":  return <MoonWaxingGibbous {...props} />;
    case "Full Moon":       return <MoonFull {...props} />;
    case "Waning Gibbous":  return <MoonWaningGibbous {...props} />;
    case "Last Quarter":    return <MoonLastQuarter {...props} />;
    case "Waning Crescent": return <MoonWaningCrescent {...props} />;
  }
}

// ─── Check-in icon ────────────────────────────────────────────────────────────

export function IconChecked({ size = 24, color = "#C9A84C" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={color} />
      <path d="M7 12 L10 15 L17 8" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUnchecked({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} fill="none" />
    </svg>
  );
}

// Re-export Lucide icons used in the app
export { BookOpen, User, Settings, ChevronRight, Sparkles };
