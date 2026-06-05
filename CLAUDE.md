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

## Color system — 4 Sky Modes (auto by time of day)

| Mode | CSS class | Hours | Sky |
|---|---|---|---|
| DAWN | `:root` | 6–11h | Lavender-peach, white cards, dark text |
| DAY | `.day` | 11–16h | Subtle blue gradient, white cards, dark text |
| DUSK | `.dusk` | 16–20h | Amber→mauve gradient, glassmorphism cards, dark card text |
| NIGHT | `.night` | 20–6h | Cosmic navy `#0D0A1A→#2D1B69`, `#1A1238` cards, light text |

Key vars: `var(--bg-gradient)`, `var(--foreground)`, `var(--card)`, `var(--border)`, `var(--primary)`, `var(--muted-foreground)`, `var(--nav-bg)`, `var(--pill-bg)`.
Card accent colors: `var(--accent-morning)` etc. — defined per mode, luminous in DUSK.

**DUSK rules:**
- Text directly on gradient = white `#FFF5EE`
- Text on cards = dark `#3A1810` (via `.dusk .kalyra-card` CSS var override)

**DUSK — card opacity hierarchy** (im więcej tekstu, tym wyższa opacity):
```
Today tab  (visual-heavy):   0.55   →  .dusk .card
Learn tab  (text-heavy):     0.65   →  (todo)
Profile tab (most text):     0.75   →  .dusk .profile-card
Sign/Stat cards in Profile:  0.70   →  .dusk .sign-card, .dusk .stat-card
Collapsed cards (Today):     0.40   →  .dusk .card--collapsed
```

**DUSK — full color token table:**
| Class | Property | Value | Used on |
|---|---|---|---|
| `.dusk .card` | background | `rgba(255,248,240,0.55)` | Today cards |
| `.dusk .profile-card` | background | `rgba(255,248,240,0.75)` | Profile main cards |
| `.dusk .sign-card` | background | `rgba(255,248,240,0.70)` | Sign cards |
| `.dusk .stat-card` | background | `rgba(255,248,240,0.70)` | Stats cards |
| `.dusk .card--collapsed` | background | `rgba(255,248,240,0.40)` | Collapsed (Evening Ritual) |
| `.dusk .card__header-label` | color | `#6A2530` | SUN/MOON/RISING labels |
| `.dusk .card__body-text` | color | `#3A1018` | Primary text on cards |
| `.dusk .card__muted` | color | `#8A4550` | Muted text on cards |
| `.dusk .card__sublabel` | color | `#6A2530` | "How to use today" etc. |
| `.dusk .sign-name` | color | `#2A1015` | Sign name in SignCard |
| `.dusk .sign-label` | color | `#8A5060` | SUN/MOON/RISING label |
| `.dusk .sign-traits` | color | `#6A3040` | Element · Modality |
| `.dusk .elemental-value` | color | `#6A3040` | Elemental % text |
| `.dusk .stat-card__label` | color | `#8A5060` | DAY STREAK etc. |
| `.dusk .settings-section-label` | color | `rgba(42,16,21,0.60)` | MY DATA / ACCOUNT |
| `.dusk .settings-row__value` | color | `#8A5060` | Edit → / Sign out |
| `.dusk .settings-cta` | color | `#C9A84C` | Add → gold links |
| `.dusk .section-label` | color | `rgba(42,16,21,0.65)` | ELEMENTAL MAKEUP etc. |
| `.dusk .calendar-legend__label` | color | `rgba(60,20,40,0.8)` | Legend text |
| `.dusk .kalyra-reading` | text-shadow | `0 1px 6px rgba(255,255,255,0.4)` | Reading on gradient |

**CSS class conventions:**
- `profile-card` — main card containers in ProfileTab
- `sign-card` — individual sign card (SUN/MOON/RISING)
- `sign-name / sign-label / sign-traits` — text inside sign card
- `stat-card / stat-card__label` — Practice Stats cards
- `section-label` — uppercase section headings outside cards
- `settings-section-label / settings-row__value / settings-cta` — Settings rows
- `elemental-value` — percentage text in Elemental Makeup
- `card--collapsed` — add to SectionCard when `collapsed=true`
- `card__header-label` — section title labels inside cards
- `card__body-text` — primary body text inside cards
- `card__muted` — secondary/muted text inside cards
- `card__sublabel` — secondary uppercase labels (e.g. "How to use today")
- `calendar-legend__label` — legend text in CalendarTab
- `kalyra-reading` — Kalyra's Reading italic block in ProfileTab

**Zodiac symbols — typographic rendering rule:**
All zodiac symbols (♈–♓) must render as text glyphs, NOT as platform emoji.
Two layers of protection required:
1. Append `︎` (variation selector-15) to the symbol string in `signData`
2. Set `font-variant-emoji: text` + `font-family: serif` on the container element
Example: `{ symbol: "♊︎" }` + `style={{ fontVariantEmoji: "text", fontFamily: "serif" }}`

**No emoji in UI — rule:**
Replace any emoji with inline SVG or typographic character.
Lock icon: `<rect x="5" y="11" w="14" h="10" rx="2"/>` + `<path d="M8 11V7a4 4 0 0 1 8 0v4"/>`, stroke `#C9A84C`, strokeWidth 1.5.

**Nav bar active state rule:** gold icon + label + dot only — never a background rectangle.
`nav button { background: none !important; outline: none !important; }` enforced globally.

Never hardcode colors — always use CSS variables.

## Nav bar — 4 tabs (Crystals merged into Learn)

```
TODAY  |  MOON  |  LEARN  |  PROFILE
```

Crystal Library is a section inside Learn tab (spec: `Kalyra_LearnTab_Spec.md`).

## Icon system (`src/components/icons.tsx`)

All icons are SVG linear, stroke-width 1.5, rounded caps — NO emoji in UI.
- Nav (4 tabs): `IconToday`, `IconMoon`, `IconLearn`, `IconProfile`
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
    globals.css           # 4-mode CSS variables (dawn/day/dusk/night), glassmorphism, animations
  components/
    AppShell.tsx          # Phone frame, bottom nav, color mode switching, stars
    OnboardingFlow.tsx    # 4-step onboarding
    TodayTab.tsx          # Daily ritual screen — all sections
    CalendarTab.tsx       # Moon Calendar — grid, bottom sheet, event dots
    LearnTab.tsx          # Learn tab — Featured, Crystal Library, Topics, Articles, Ask Kalyra
    ProfileTab.tsx        # Profile tab — signs, elemental bar, ritual affinity, stats, settings
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
- ✅ Today Tab v1.1 — checkboxes + animations, color accents per card, auto-collapse, upsell, progress counter
- ✅ Moon Calendar — 40px two-tone icons, event dots, bottom sheet, swipe nav
- ✅ Special event sections (8 types)
- ✅ 12 Master Rituals with steps
- ✅ Color System v2.4 — 4 sky modes, glassmorphism in DUSK, full card contrast system (header/body/muted/collapsed/sublabel), legend fix, unified nav
- ✅ SVG Icon System v1.0 — planet icons per ruler, geometric crystals; NO emoji anywhere in UI
- ✅ 4-tab nav (TODAY / MOON / LEARN / PROFILE)
- ✅ Learn Tab — Featured Today, Crystal Library (12), Explore Topics (5), articles (13), Ask Kalyra
- ✅ PWA (installable, `kalyra-virid.vercel.app`)
- ✅ AI Ritual Generator — tap-on-card pattern (no button); Ask Kalyra (mocked)
- ✅ Profile tab dusk polish — full contrast pass, opacity hierarchy (0.75), all text classes, typographic zodiac symbols, SVG lock icon
- ✅ Moon Cycles stat — counts from first app use (earliest daily_checkin), not birth date
- ✅ Dev mode switcher (localhost only — DAWN/DAY/DUSK/NIGHT buttons)

## What's NOT built yet

- ✅ Profile tab v1.0 — signs, elemental bar, ritual affinity, stats, settings, edit modal
- ❌ Live Claude API (two mocks: AI Ritual Generator + Ask Kalyra)
- ❌ Learn — remaining 25 articles (13/38 done)
- ❌ Rising sign calculation
- ❌ Backend / accounts

## Deployment

- Live: https://kalyra-virid.vercel.app
- Push: `git push origin main` → Vercel auto-deploys
- gh CLI authenticated via keychain (`gh auth status` to verify)
