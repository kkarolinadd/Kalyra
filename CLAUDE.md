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
| Fonts | Cinzel (headings) + EB Garamond (body) via next/font/google |
| State | useState / useReducer (client-side only) |
| Persistence | localStorage (no backend) |
| Astrology | All calculations client-side, no external API |

## Color palette

| Token | Value |
|---|---|
| Background | `#0d0e1a` (deep navy) |
| Gold accent | `#c9a84c` |
| Text primary | `#f5f0e8` (warm white) |
| Text muted | `#8a8ba0` |
| Card bg | `#13152a` |
| Card border | `#1e2140` |

## Project structure

```
src/
  app/
    layout.tsx          # Cinzel + EB Garamond fonts, dark metadata
    page.tsx            # Entry point: onboarding check → AppShell
    globals.css         # CSS variables, dark theme, shimmer animation
  components/
    AppShell.tsx        # Phone frame layout + bottom nav (5 tabs)
    OnboardingFlow.tsx  # 4-step onboarding: welcome → name → birthdate → summary
    TodayTab.tsx        # Main daily ritual screen (all sections)
    ui/                 # shadcn components
  lib/
    astrology.ts        # Moon phase, moon sign, sun sign, day ruler, special events
    ritualContent.ts    # 8-phase × 7-ruler ritual content + 12 Master Rituals
    storage.ts          # localStorage read/write helpers
```

## Key functions

| Function | File | What it does |
|---|---|---|
| `getDailyAstrology(date)` | `astrology.ts` | Full daily astro data for any date |
| `getRitual(phase, ruler)` | `ritualContent.ts` | Morning/journal/mirror/crystal/glamour/evening content |
| `getTriggeredRituals(phase, moonSign, ruler)` | `ritualContent.ts` | Up to 3 active rituals per PRD 9.6 |
| `getSpecialSectionContent(eventType)` | `ritualContent.ts` | Content for special events |
| `toggleCheckin(key)` | `storage.ts` | Toggles checkbox + updates streak |

## What's built (MVP)

- ✅ Onboarding (4 steps)
- ✅ Today tab — 7 fixed sections + checkboxes + streak
- ✅ Special event sections (Full Moon, Blue Moon, Mercury Rx, etc.)
- ✅ Today's Rituals chips (phase-based, max 3, expandable)
- ✅ AI Ritual Generator (mocked — UI complete, no live API yet)
- ✅ Mobile layout: phone frame, status bar, bottom nav

## What's NOT built yet (V2)

- ❌ Moon Calendar tab
- ❌ Crystals tab (30+ crystal cards)
- ❌ Learn tab (Zodiac guide, Mirror Principle, meditations)
- ❌ Profile tab (elemental bar, streak history, settings)
- ❌ Live Claude API integration
- ❌ PWA manifest (installable on phone)
- ❌ Backend / accounts

## GitHub

Repository: https://github.com/kkarolinadd/Kalyra
Push: `git push origin main` (authenticated via gh CLI)
