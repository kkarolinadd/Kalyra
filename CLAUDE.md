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
Today tab     (visual-heavy):   0.55  →  .dusk .card / .ritual-card
Crystal cards (małe, treściwe): 0.70  →  .dusk .crystal-card
Learn tab     (text-heavy):     0.65  →  .dusk .article-row / .ask-kalyra
Profile tab   (most text):      0.75  →  .dusk .profile-card
Sign/Stat cards (Profile):      0.70  →  .dusk .sign-card / .stat-card
Collapsed cards (Today):        0.40  →  .dusk .card--collapsed
```

**DUSK — 6 zasad (ściąga dla developera):**
```
1. Tekst wewnątrz karty   → ciemny (#2A1015 lub #8A5060)
2. Tekst na gradiencie    → biały (#FFFFFF lub rgba(255,255,255,0.9))
3. Akcent / CTA           → gold (#C9A84C lub #FFD97A)
4. Opacity kart           → 0.40–0.75 (wyżej = więcej tekstu)
5. Nav bar                → ciemny fiolet rgba(30,12,50,0.88)
6. Featured/topic cards   → zachowaj ciemne własne tła (biały tekst OK)
```

**DUSK — pełna tabela klas CSS** (źródło: `Kalyra_DuskMode_Overrides.md`):

*§1 Global*
| Klasa | Właściwość | Wartość |
|---|---|---|
| `.dusk .card` | background | `rgba(255,248,240,0.55)` + blur(16px) |
| `.dusk .page-title` | color | `#2A1015` |
| `.dusk .page-subtitle` | color | `rgba(42,16,21,0.55)` |
| `.dusk .section-label` | color | `rgba(42,16,21,0.65)` |

*§2 Today*
| Klasa | Właściwość | Wartość |
|---|---|---|
| `.dusk .ritual-card` | background | `rgba(255,248,240,0.55)` |
| `.dusk .card__header-label` | color | `#6A2530` |
| `.dusk .card__body-text` | color | `#3A1018` |
| `.dusk .card__subtext` | color | `#8A4550` |
| `.dusk .card__sublabel` | color | `#6A2530` |
| `.dusk .card__muted` | color | `#8A4550` |
| `.dusk .how-to-use-label` | color | `#7A2530` |
| `.dusk .step-number` | color | `#7A2530` |
| `.dusk .energy-card__title` | color | `#2A1015` |
| `.dusk .energy-card__subtitle` | color | `#8A4550` |
| `.dusk .card--collapsed` | background | `rgba(255,248,240,0.40)` |
| `.dusk .progress-counter` | background | `rgba(255,248,240,0.45)` |

*§3 Moon Calendar*
| Klasa | Właściwość | Wartość |
|---|---|---|
| `.dusk .day-number` | color | `rgba(42,16,21,0.75)` |
| `.dusk .month-nav` | color | `rgba(42,16,21,0.55)` |
| `.dusk .month-title` | color | `#2A1015` |
| `.dusk .calendar-legend__label` | color | `rgba(42,16,21,0.75)` |
| `.dusk .bottom-sheet` | background | `rgba(255,248,240,0.90)` + blur(20px) |
| `.dusk .bottom-sheet__title` | color | `#2A1015` |
| `.dusk .bottom-sheet__content` | color | `#6A3040` |

*§4 Learn*
| Klasa | Właściwość | Wartość |
|---|---|---|
| `.dusk .crystal-card` | background | `rgba(255,248,240,0.70)` |
| `.dusk .crystal-card__name` | color | `#2A1015` |
| `.dusk .crystal-card__keywords` | color | `#8A5060` |
| `.dusk .crystal-card__planet` | color | `#C9A84C` |
| `.dusk .article-row` | background | `rgba(255,248,240,0.65)` |
| `.dusk .article-row__title` | color | `#2A1015` |
| `.dusk .article-row__meta` | color | `#8A5060` |
| `.dusk .ask-kalyra` | background | `rgba(255,248,240,0.35)` |
| `.dusk .ask-kalyra__label` | color | `#2A1015` |
| `.dusk .crystal-detail__body` | color | `#3A1820` |
| `.dusk .article-view__body` | color | `#3A1820` |
| `.dusk .article-view__takeaway` | background | `rgba(255,248,240,0.70)` |

*§5 Profile*
| Klasa | Właściwość | Wartość |
|---|---|---|
| `.dusk .profile-header-card` | background | `rgba(255,248,240,0.65)` |
| `.dusk .profile-header__name` | color | `#2A1015` |
| `.dusk .profile-header__meta` | color | `#8A5060` |
| `.dusk .profile-card` | background | `rgba(255,248,240,0.75)` |
| `.dusk .sign-card` | background | `rgba(255,248,240,0.70)` |
| `.dusk .sign-card__name` | color | `#2A1015` |
| `.dusk .sign-card__traits` | color | `#8A5060` |
| `.dusk .elemental-card` | background | `rgba(255,248,240,0.65)` |
| `.dusk .elemental-value` | color | `#6A3040` |
| `.dusk .rising-locked` | border | `dashed rgba(201,168,76,0.45)` |
| `.dusk .rising-locked__title` | color | `#2A1015` |
| `.dusk .rising-locked__body` | color | `#8A5060` |
| `.dusk .rituals-card` | background | `rgba(255,248,240,0.70)` |
| `.dusk .ritual-row__name` | color | `#2A1015` |
| `.dusk .stat-card` | background | `rgba(255,248,240,0.65)` |
| `.dusk .stat-card__label` | color | `#8A5060` |
| `.dusk .settings-card` | background | `rgba(255,248,240,0.65)` |
| `.dusk .settings-section-label` | color | `rgba(42,16,21,0.60)` |
| `.dusk .settings-row__label` | color | `#2A1015` |
| `.dusk .settings-row__value` | color | `#8A5060` |
| `.dusk .kalyra-reading` | text-shadow | `0 1px 8px rgba(100,40,60,0.25)` |
| `.dusk .toggle--on` | background | `#C9A84C` |
| `.dusk .toggle--off` | background | `rgba(42,16,21,0.20)` |

**CSS class conventions (wszystkie taby):**
- `page-title / page-subtitle` — nagłówek i podtytuł ekranu na gradiencie
- `section-label` — sekcyjne nagłówki poza kartami
- `card__header-label` — etykiety w nagłówkach kart (SUN/MOON/RISING)
- `card__body-text` — główny tekst w kartach
- `card__muted / card__subtext` — drugi plan w kartach
- `card__sublabel` — małe uppercase labels (np. "How to use today")
- `card--collapsed` — dodaj do SectionCard gdy `collapsed=true`
- `kalyra-reading` — blok italic z cytatu Kalyry (ProfileTab)
- `ritual-card` — karty rytuałów (TodayTab)
- `energy-card__title/subtitle/divider` — karta energii (TodayTab)
- `progress-counter` — licznik ukończonych rytuałów
- `day-number / month-nav / month-title` — CalendarTab
- `bottom-sheet / bottom-sheet__*` — bottom sheet kalendarza
- `calendar-legend__label` — legenda kalendarza
- `crystal-card / crystal-card__*` — karty kryształów (LearnTab)
- `article-row / article-row__*` — wiersze artykułów (LearnTab)
- `ask-kalyra / ask-kalyra__*` — sekcja Ask Kalyra (LearnTab)
- `crystal-detail__* / article-view__*` — widoki detali (LearnTab)
- `profile-header-card / profile-header__*` — header użytkownika (ProfileTab)
- `profile-card` — główne karty ProfileTab (opacity 0.75)
- `sign-card / sign-card__*` — karty znaków zodiaku
- `elemental-card / elemental-value` — Elemental Makeup
- `rising-locked / rising-locked__*` — zablokowany Rising sign
- `rituals-card / ritual-row__*` — Top Rituals
- `stat-card / stat-card__label` — Practice Stats
- `settings-card / settings-section-label / settings-row__*` — Settings

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
- ✅ Color System v2.5 — 4 sky modes; DUSK fully specced per `Kalyra_DuskMode_Overrides.md` — all 5 tabs, 50+ CSS classes, opacity hierarchy table
- ✅ SVG Icon System v1.0 — planet icons per ruler, geometric crystals; NO emoji anywhere in UI
- ✅ 4-tab nav (TODAY / MOON / LEARN / PROFILE)
- ✅ Learn Tab — Featured Today, Crystal Library (12), Explore Topics (5), articles (13), Ask Kalyra
- ✅ PWA (installable, `kalyra-virid.vercel.app`)
- ✅ AI Ritual Generator — tap-on-card pattern (no button); Ask Kalyra (mocked)
- ✅ Profile tab dusk polish — full contrast pass, opacity hierarchy (0.75), all text classes, typographic zodiac symbols, SVG lock icon
- ✅ DUSK mode CSS — complete implementation of `Kalyra_DuskMode_Overrides.md`: Today/Calendar/Learn/Profile all tabs, classNames wired in components
- ✅ Moon Cycles stat — counts from first app use (earliest daily_checkin), not birth date
- ✅ Dev mode switcher (localhost only — DAWN/DAY/DUSK/NIGHT buttons)
- ✅ CalendarTab bottom sheet — fixed and correctly positioned:
  - Sits flush at bottom: 0 (native iOS feel), padding-bottom clears nav bar
  - Constrained to phone frame width on desktop: `margin-left/right: max(0px, (100vw - 390px) / 2)`
  - NOTE: never use `left: 50% + translateX(-50%)` on elements with fade-in class —
    the `fadeIn` animation (`transform: translateY`) overrides translateX and breaks centering
- ✅ Edit Profile modal — simplified and fixed:
  - Removed Sun Sign / Moon Sign dropdowns (auto-calculated from birth_date on save via getSunSign/getMoonSign)
  - Scrollable fields + Save button pinned outside scroll area, always visible
  - Save button padding-bottom: 80px + safe-area-inset to clear nav bar
  - Hint text under Date of Birth: "Sun & Moon sign are calculated automatically from this date."
  - Hint text under Time of Birth: "Used to calculate your Rising sign."
- ✅ UI Fixes Brief v1.0 (June 2026) — editorial luxury pass:
  - P0: Emoji → SVG gold glyphs in Sun/Moon pills (outline, stroke #C9A84C)
  - P0: Sacred geometry divider (gold diamond + 0.5px lines, opacity 0.45) between energy bar and ritual cards
  - P0: Kalyra sigil — circle + vertical line SVG replacing ✦ sparkle in Kalyra card
  - P1: Greeting headline weight 300→400, letter-spacing -0.01em
  - P1: Day mode quote-block tint #F0F4F8
  - P1: Dawn muted-foreground #6B5744→#9B88A8 (warm lila, no more brown)
  - P1: Dusk quote-block contrast rgba(0,0,0,0.18) (was 0.14)
  - P2: Progress indicator — 6 gold dots replacing ◐ emoji
  - P2: "Read aloud · in the mirror" → sentence case (no uppercase)
  - P2: Dusk gradient middle step #D46870→#C45878 (smoother transition)
- ✅ UI Fixes Brief v2.0 (June 2026) — ritual card state system:
  - 4 states: ACTIVE / DONE / UPCOMING / MISSED per card per colorMode
  - Time windows: morning/journal/mirror=dawn, crystal=all-day, wear=dawn+day, evening=dusk
  - Tap card = expand/collapse (whole surface); "Done" pill button = mark complete (ACTIVE only)
  - DONE: opacity 0.7, collapsed, "✓ Done" badge, tap to re-read
  - UPCOMING: opacity 0.5, pointer-events none, italic Kalyra message
  - MISSED: opacity 0.35, pointer-events none, border loses accent color, italic message
  - getRitualState(key, colorMode, checkedKeys) — MODE_ORDER=['dawn','day','dusk','night']
  - "Done" pill: 10px, font-weight 600, gold outline, replaces radio button pattern
  - Collapse bug fix: cards can be collapsed with ChevronUp (was one-directional before)

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
