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

/** Energy / Day Ruler — lightning bolt (generic fallback) */
export function IconEnergy({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <path d="M13 2 L4 13 L11 13 L11 22 L20 11 L13 11 Z" />
    </Svg>
  );
}

// ─── Planet Icons (unique per ruler) ─────────────────────────────────────────

/** Sun — circle with 8 rays */
export function IconPlanetSun({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"  x2="12" y2="5.5"  />
      <line x1="12" y1="18.5" x2="12" y2="22" />
      <line x1="2"  y1="12" x2="5.5"  y2="12" />
      <line x1="18.5" y1="12" x2="22" y2="12" />
      <line x1="4.9"  y1="4.9"  x2="7.2"  y2="7.2"  />
      <line x1="16.8" y1="16.8" x2="19.1" y2="19.1" />
      <line x1="19.1" y1="4.9"  x2="16.8" y2="7.2"  />
      <line x1="7.2"  y1="16.8" x2="4.9"  y2="19.1" />
    </Svg>
  );
}

/** Moon — crescent */
export function IconPlanetMoon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <path d="M20 13.5A9 9 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z" />
    </Svg>
  );
}

/** Mercury — circle with horns on top */
export function IconPlanetMercury({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="16.5" x2="12" y2="21" />
      <line x1="9" y1="19" x2="15" y2="19" />
      {/* horns */}
      <path d="M8 7.5 A4 4 0 0 1 16 7.5" fill="none" />
    </Svg>
  );
}

/** Venus — ♀ circle + cross below */
export function IconPlanetVenus({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <circle cx="12" cy="9" r="5" />
      <line x1="12" y1="14" x2="12" y2="21" />
      <line x1="9"  y1="18" x2="15" y2="18" />
    </Svg>
  );
}

/** Mars — ♂ circle + arrow up-right */
export function IconPlanetMars({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <circle cx="10" cy="13" r="5" />
      <line x1="14" y1="9" x2="21" y2="2" />
      <path d="M16 2 L21 2 L21 7" />
    </Svg>
  );
}

/** Jupiter — lightning bolt (ruler of expansion) */
export function IconPlanetJupiter({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      <path d="M13 2 L4 13 L11 13 L11 22 L20 11 L13 11 Z" />
    </Svg>
  );
}

/** Saturn — h with ring through it */
export function IconPlanetSaturn({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <Svg size={size} color={color}>
      {/* Vertical staff */}
      <line x1="9" y1="3" x2="9" y2="21" />
      {/* Curve to right */}
      <path d="M9 12 Q16 12 16 17 Q16 21 11 21" />
      {/* Ring cross-stroke */}
      <line x1="6" y1="7" x2="14" y2="7" />
    </Svg>
  );
}

/** Planet icon picker */
export function PlanetIcon({ planet, size = 20, color = "currentColor" }: { planet: string; size?: number; color?: string }) {
  const p = { size, color };
  switch (planet) {
    case "Sun":     return <IconPlanetSun     {...p} />;
    case "Moon":    return <IconPlanetMoon    {...p} />;
    case "Mercury": return <IconPlanetMercury {...p} />;
    case "Venus":   return <IconPlanetVenus   {...p} />;
    case "Mars":    return <IconPlanetMars    {...p} />;
    case "Jupiter": return <IconPlanetJupiter {...p} />;
    case "Saturn":  return <IconPlanetSaturn  {...p} />;
    default:        return <IconEnergy        {...p} />;
  }
}

// ─── Moon Phases ─────────────────────────────────────────────────────────────
//
// Each phase uses TWO visible colors — no transparency.
// Lit:    #E8E0F0 (soft white-lavender)
// Shadow: #1E1640 (dark violet — always visible against dark bg)
// Stroke: #4A3F7A (subtle outline)
//
// Crescent geometry: two arcs — outer circle arc + inner ellipse arc.
// This creates a proper crescent without clip paths.

interface MoonIconProps {
  size?: number;
  litColor?: string;
  darkColor?: string;
  strokeColor?: string;
}

const LIT    = "#E8E0F0";
const SHADOW = "#1E1640";
const STROKE = "#4A3F7A";

// New Moon — full shadow circle, no lit area
export function MoonNew({ size = 24, litColor = LIT, darkColor = SHADOW, strokeColor = STROKE }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={darkColor} stroke={strokeColor} strokeWidth={1.5} />
    </svg>
  );
}

// Waxing Crescent — shadow circle + thin lit crescent on right
// Crescent = outer right arc + inner offset arc
export function MoonWaxingCrescent({ size = 24, litColor = LIT, darkColor = SHADOW, strokeColor = STROKE }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={darkColor} stroke={strokeColor} strokeWidth={1.5} />
      {/* Thin lit crescent on right: outer right arc + inner leftward arc */}
      <path d="M12 3 A9 9 0 0 1 12 21 A6.5 9 0 0 0 12 3 Z" fill={litColor} />
    </svg>
  );
}

// First Quarter — left half shadow, right half lit
export function MoonFirstQuarter({ size = 24, litColor = LIT, darkColor = SHADOW, strokeColor = STROKE }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Shadow left half */}
      <path d="M12 3 A9 9 0 0 0 12 21 Z" fill={darkColor} />
      {/* Lit right half */}
      <path d="M12 3 A9 9 0 0 1 12 21 Z" fill={litColor} />
      <circle cx="12" cy="12" r="9" fill="none" stroke={strokeColor} strokeWidth={1.5} />
    </svg>
  );
}

// Waxing Gibbous — mostly lit, thin shadow crescent on left
export function MoonWaxingGibbous({ size = 24, litColor = LIT, darkColor = SHADOW, strokeColor = STROKE }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={litColor} stroke={strokeColor} strokeWidth={1.5} />
      {/* Shadow crescent on left: outer left arc + inner rightward arc */}
      <path d="M12 3 A9 9 0 0 0 12 21 A5.5 9 0 0 1 12 3 Z" fill={darkColor} />
    </svg>
  );
}

// Full Moon — all lit, gold stroke, subtle glow via filter
export function MoonFull({ size = 24, litColor = LIT, darkColor = SHADOW, strokeColor = "#C9A84C" }: MoonIconProps) {
  const id = `glow-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="12" cy="12" r="9" fill={litColor} stroke={strokeColor} strokeWidth={2} filter={`url(#${id})`} />
    </svg>
  );
}

// Waning Gibbous — mostly lit, thin shadow crescent on right
export function MoonWaningGibbous({ size = 24, litColor = LIT, darkColor = SHADOW, strokeColor = STROKE }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={litColor} stroke={strokeColor} strokeWidth={1.5} />
      {/* Shadow crescent on right: outer right arc + inner leftward arc */}
      <path d="M12 3 A9 9 0 0 1 12 21 A5.5 9 0 0 0 12 3 Z" fill={darkColor} />
    </svg>
  );
}

// Last Quarter — right half shadow, left half lit
export function MoonLastQuarter({ size = 24, litColor = LIT, darkColor = SHADOW, strokeColor = STROKE }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Lit left half */}
      <path d="M12 3 A9 9 0 0 0 12 21 Z" fill={litColor} />
      {/* Shadow right half */}
      <path d="M12 3 A9 9 0 0 1 12 21 Z" fill={darkColor} />
      <circle cx="12" cy="12" r="9" fill="none" stroke={strokeColor} strokeWidth={1.5} />
    </svg>
  );
}

// Waning Crescent — shadow circle + thin lit crescent on left
export function MoonWaningCrescent({ size = 24, litColor = LIT, darkColor = SHADOW, strokeColor = STROKE }: MoonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={darkColor} stroke={strokeColor} strokeWidth={1.5} />
      {/* Thin lit crescent on left: outer left arc + inner rightward arc */}
      <path d="M12 3 A9 9 0 0 0 12 21 A6.5 9 0 0 1 12 3 Z" fill={litColor} />
    </svg>
  );
}

// ─── Moon phase picker helper ─────────────────────────────────────────────────

import type { MoonPhase } from "@/lib/astrology";

export function MoonPhaseIcon2({ phase, size = 24, litColor, darkColor, strokeColor }: { phase: MoonPhase } & MoonIconProps) {
  const props = { size, litColor, darkColor, strokeColor };
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

// ─── Crystal shapes (geometric, colored per mineral) ─────────────────────────

interface CrystalProps {
  size?: number;
  fillColor?: string;
  strokeColor?: string;
}

// Carnelian — teardrop/point
function CrystalCarnelian({ size = 28, fillColor = "#B5451B", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 3 L22 16 Q14 26 6 16 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="14" y1="3" x2="14" y2="22" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
    </svg>
  );
}

// Moonstone — oval with horizontal lines
function CrystalMoonstone({ size = 28, fillColor = "#C8D4E8", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="14" rx="8" ry="11" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} />
      <line x1="7" y1="11" x2="21" y2="11" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
      <line x1="6" y1="14" x2="22" y2="14" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
      <line x1="7" y1="17" x2="21" y2="17" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
    </svg>
  );
}

// Amethyst — tall hexagon
function CrystalAmethyst({ size = 28, fillColor = "#7B4FA6", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 2 L20 7 L20 21 L14 26 L8 21 L8 7 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="14" y1="2" x2="14" y2="26" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.35} />
    </svg>
  );
}

// Citrine — diamond with top point
function CrystalCitrine({ size = 28, fillColor = "#E8A020", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 2 L22 12 L14 26 L6 12 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="6" y1="12" x2="22" y2="12" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
    </svg>
  );
}

// Rose Quartz — heart with facets
function CrystalRoseQuartz({ size = 28, fillColor = "#E8A0B0", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 24 C14 24 4 16 4 10 A5 5 0 0 1 14 8 A5 5 0 0 1 24 10 C24 16 14 24 14 24 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} />
      <line x1="14" y1="8" x2="14" y2="22" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.35} />
    </svg>
  );
}

// Black Tourmaline — tall rectangle with lines
function CrystalBlackTourmaline({ size = 28, fillColor = "#2A2A35", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M10 3 L18 3 L20 25 L8 25 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="10" y1="9" x2="18.5" y2="9" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
      <line x1="9" y1="15" x2="19" y2="15" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
      <line x1="8.5" y1="21" x2="19.5" y2="21" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
    </svg>
  );
}

// Labradorite — irregular polygon
function CrystalLabradorite({ size = 28, fillColor = "#4A6070", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 3 L23 9 L21 22 L14 25 L7 20 L5 8 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="14" y1="3" x2="14" y2="25" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.3} />
      <line x1="5" y1="8" x2="23" y2="9" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.3} />
    </svg>
  );
}

// Green Aventurine — regular hexagon
function CrystalGreenAventurine({ size = 28, fillColor = "#3A8A50", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 3 L22 8 L22 20 L14 25 L6 20 L6 8 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="6" y1="8" x2="22" y2="8" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.35} />
      <line x1="6" y1="20" x2="22" y2="20" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.35} />
    </svg>
  );
}

// Fluorite — regular hexagon (flat top)
function CrystalFluorite({ size = 28, fillColor = "#5BA898", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M6 9 L14 4 L22 9 L22 19 L14 24 L6 19 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="14" y1="4" x2="14" y2="24" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.35} />
    </svg>
  );
}

// Clear Quartz — hexagon with top point
function CrystalClearQuartz({ size = 28, fillColor = "#E8E8F4", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M14 2 L19 7 L19 21 L14 26 L9 21 L9 7 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="9" y1="7" x2="19" y2="7" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
      <line x1="9" y1="14" x2="19" y2="14" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.3} />
    </svg>
  );
}

// Selenite — long wand with wave
function CrystalSelenite({ size = 28, fillColor = "#F0EDE8", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M10 3 L18 3 L18 25 L10 25 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M10 12 Q14 9 18 12" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} fill="none" />
      <path d="M10 17 Q14 14 18 17" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} fill="none" />
    </svg>
  );
}

// Default fallback — generic gem
function CrystalDefault({ size = 28, fillColor = "#C9A84C", strokeColor = "#C9A84C" }: CrystalProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M8 8 L14 3 L20 8 L14 25 Z" fill={fillColor} stroke={strokeColor} strokeWidth={1.5} strokeLinejoin="round" />
      <line x1="8" y1="8" x2="20" y2="8" stroke={strokeColor} strokeWidth={1} strokeOpacity={0.4} />
    </svg>
  );
}

const CRYSTAL_COMPONENTS: Record<string, React.ComponentType<CrystalProps>> = {
  "Carnelian":           CrystalCarnelian,
  "Moonstone":           CrystalMoonstone,
  "Amethyst":            CrystalAmethyst,
  "Citrine":             CrystalCitrine,
  "Rose Quartz":         CrystalRoseQuartz,
  "Black Tourmaline":    CrystalBlackTourmaline,
  "Labradorite":         CrystalLabradorite,
  "Green Aventurine":    CrystalGreenAventurine,
  "Fluorite":            CrystalFluorite,
  "Clear Quartz":        CrystalClearQuartz,
  "Selenite":            CrystalSelenite,
  "Blue Lace Agate":     CrystalClearQuartz,  // similar hexagonal shape
  "Rhodonite":           CrystalRoseQuartz,   // similar heart shape
  "Morganite":           CrystalRoseQuartz,
  "Pyrite":              CrystalCitrine,
  "Obsidian":            CrystalLabradorite,
};

export function CrystalIcon({ name, size = 28 }: { name: string; size?: number }) {
  const Component = CRYSTAL_COMPONENTS[name] ?? CrystalDefault;
  return <Component size={size} />;
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
