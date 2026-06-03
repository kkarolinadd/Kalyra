@AGENTS.md

# Kalyra — Claude Code Context

## What is this project?

Kalyra is a daily ritual companion web app (mobile-first) at the intersection of astrology, moon magic, and intentional self-care. Built with Next.js 15 + shadcn/ui. The full PRD lives at `../Glamour_Magic_PRD.md` (parent folder).

## How to run

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build
npx tsc --noEmit   # TypeScript check
```

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19 + shadcn/ui + Tailwind CSS v4 |
| Fonts | **Cormorant Garamond** (headings) + **Inter** (body) via next/font/google |
| State | useState / useReducer (client-side only) |
| Persistence | localStorage (no backend) |
| Astrology | All calculations client-side, no external API |
| Deploy | Vercel — auto-deploy on push to main |
| PWA | manifest.json + icons — installable on iPhone/Android |

## Color system — 3 modes (auto by time of day)

| Mode | Hours | Key colors |
|---|---|---|
| Morning (`:root`) | 6–11h | `#F5EDE0` bg, `#1A1208` text, cream |
| Afternoon (`.mid`) | 11–18h | `#2A1510` bg, `#F5EDE0` text, amber/sienna |
| Night (`.dark`) | 18–6h | `#0D0A1A` bg, `#F0EAF8` text, cosmic purple |
| Gold (all modes) | — | `#C9A84C` — always the same |

Use CSS variables everywhere: `var(--background)`, `var(--foreground)`, `var(--card)`, `var(--border)`, `var(--primary)`, `var(--muted-foreground)`. Never hardcode colors.

## Icon system (`src/components/icons.tsx`)

All icons are SVG linear, stroke-width 1.5, rounded caps — NO emoji in UI.
- Nav: `IconToday`, `IconMoon`, `IconCrystal`, `IconLearn`, `IconProfile`
- Sections: `IconSunrise`, `IconEvening`, `IconJournal`, `IconMirror`, `IconCrystalSection`, `IconGlamour`, `IconEnergy`
- Moon phases: `MoonPhaseIcon2` — two-tone (`#E8E0F0` lit / `#1E1640` shadow), never transparent
- Crystals: `CrystalIcon` — geometric shapes per mineral
- Check-in: `IconChecked`, `IconUnchecked`

## Project structure

```
src/
  app/
    layout.tsx            # Cormorant + Inter fonts, PWA meta tags
    page.tsx              # Entry: onboarding check → AppShell
    globals.css           # 3-mode CSS variables, animations, .kalyra-voice
  components/
    AppShell.tsx          # Phone frame, bottom nav, color mode switching, stars
    OnboardingFlow.tsx    # 4-step onboarding
    TodayTab.tsx          # Daily ritual screen — all sections
    CalendarTab.tsx       # Moon Calendar — grid, bottom sheet, event dots
    icons.tsx             # Full SVG icon library
    ui/                   # shadcn components
  lib/
    astrology.ts          # Moon phase, moon sign, sun sign, day ruler, events
    ritualContent.ts      # Ritual content + 12 Master Rituals + triggers
    storage.ts            # localStorage helpers
public/
  manifest.json           # PWA manifest
  icon.svg / icon-192.png / icon-512.png / apple-touch-icon.png
```

## Key functions

| Function | File | What it does |
|---|---|---|
| `getDailyAstrology(date)` | `astrology.ts` | Full daily astro data |
| `getRitual(phase, ruler)` | `ritualContent.ts` | All section content for the day |
| `getTriggeredRituals(phase, moonSign, ruler)` | `ritualContent.ts` | Up to 3 active rituals (PRD 9.6) |
| `getMoonPhaseData(date)` | `astrology.ts` | Phase, illumination, cycle day |
| `getSpecialEvents(date)` | `astrology.ts` | Events from hardcoded 2025–2030 calendar |
| `MoonPhaseIcon2` | `icons.tsx` | Correct two-tone SVG for any phase |
| `CrystalIcon` | `icons.tsx` | Geometric crystal shape per mineral |
| `toggleCheckin(key)` | `storage.ts` | Toggles checkbox + updates streak |

## What's built

- ✅ Onboarding (4 steps, Sun + Moon sign calculation)
- ✅ Today tab — full redesign with 3-column day card, SVG icons, ritual tags
- ✅ Moon Calendar — 40px two-tone icons, event dots, bottom sheet, swipe nav
- ✅ Special event sections (8 types)
- ✅ 12 Master Rituals with steps
- ✅ 3-mode color system (morning/mid/night, auto-switch)
- ✅ SVG Icon System v1.0
- ✅ PWA (installable, `kalyra-virid.vercel.app`)
- ✅ AI Ritual Generator (mocked)

## What's NOT built yet

- ❌ Crystals tab
- ❌ Learn tab
- ❌ Profile tab
- ❌ Live Claude API
- ❌ Rising sign calculation
- ❌ Backend / accounts

## Deployment

- Live: https://kalyra-virid.vercel.app
- Push: `git push origin main` → Vercel auto-deploys
- gh CLI authenticated via keychain (`gh auth status` to verify)
