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
| DUSK | `.dusk` | 16–20h | "Jasny Zachód" — light peach→coral→rose gradient, dark text, light nav, cream cards |
| NIGHT | `.night` | 20–6h | Cosmic navy `#0D0A1A→#2D1B69`, `#1A1238` cards, light text |

Key vars: `var(--bg-gradient)`, `var(--foreground)`, `var(--card)`, `var(--border)`, `var(--primary)`, `var(--muted-foreground)`, `var(--nav-bg)`, `var(--pill-bg)`.
Card accent colors: `var(--accent-morning)` etc. — defined per mode, luminous in DUSK.

**DUSK v6.0 "Jasny Zachód" rules:**
- Gradient: `#F5C8A0 → #F0B0A0 → #E8A8B8` (light peach→coral→rose — pale like Dawn)
- Text ON gradient = dark `#3A2530` — same logic as Dawn/Day, NO text-shadow
- Text ON cards = dark `#2A1820` (via `.dusk .kalyra-card` CSS var override)
- Cards: solid gradient `linear-gradient(160deg, #FFFBF7 0%, #FBF2EA 100%)` — NO glassmorphism
- Gold: single `#C9A84C` everywhere (no more dual gold #FFD97A / #C9A84C)
- Nav bar: light warm `rgba(245,235,230,0.92)` — matches light background
- `--muted-foreground`: `#A89090` (dark muted, same on gradient and cards)

**DUSK — 4 zasady (ściąga dla developera):**
```
1. Tekst NA gradiencie     → ciemny #3A2530 (identyczna logika jak Dawn/Day)
2. Tekst NA kartach        → ciemny #2A1820 (via .dusk .kalyra-card CSS vars override)
3. Karty bez glassmorphism → backdrop-filter: none, solidny gradient wewnętrzny
4. Sign cards !important   → elementBg inline style wygrywa, potrzeba background: ... !important
```

**DUSK — kluczowe kolory:**
```
Gradient:        #F5C8A0 → #F0B0A0 → #E8A8B8
Gradient text:   #3A2530
Gradient muted:  #8B6B6B
Karta text:      #2A1820
Karta muted:     #8B6B5A
Gold (wszędzie): #C9A84C
Nav bg:          rgba(245,235,230,0.92)
Quote bg:        rgba(58,30,48,0.05)
Quote text:      #4A2838
```

**DUSK v6.0 — kluczowe klasy CSS:**

Wszystkie karty = `linear-gradient(160deg, #FFFBF7 0%, #FBF2EA 100%)`, brak blur/glassmorphism.
Tekst na gradiencie = `#3A2530`. Tekst na kartach = `#2A1820` (via CSS var override).

| Klasa | Kluczowa właściwość | Uwaga |
|---|---|---|
| `.dusk .card / .ritual-card` | gradient bg + shadow + inset highlight | luxury depth |
| `.dusk .kalyra-card` | `--foreground: #2A1820`, `--muted-foreground: #8B6B5A` | CSS var scope |
| `.dusk .sign-card` | `background: gradient !important` | override inline elementBg |
| `.dusk .profile-header-card` | + `--foreground: #2A1820` (nie ma kalyra-card klasy) | wymagane |
| `.dusk .page-title / .page-subtitle` | `color: #3A2530` (NA jasnym gradiencie) | — |
| `.dusk .section-label` | `#8B6B6B` (NA jasnym gradiencie) | — |
| `.dusk .quote-block` | `rgba(58,30,48,0.05)`, text `#4A2838` | — |
| `--pill-border` | `rgba(201,168,76,0.3)` — złoty | standard |
| `--nav-bg` | `rgba(245,235,230,0.92)` | jasny ciepły |

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
  - DONE: opacity 0.7, "✓ Done" badge, tap to re-read (NOT auto-collapsed)
  - UPCOMING: opacity 0.5, pointer-events none, italic Kalyra message
  - MISSED: opacity 0.35, pointer-events none, border loses accent color, italic message
  - getRitualState(key, colorMode, checkedKeys) — MODE_ORDER=['dawn','day','dusk','night']
  - "Done" pill: 10px, font-weight 600, gold outline, replaces radio button pattern
- ✅ UI Fixes Brief v3.0 (June 2026) — content density + card interaction polish:
  - All cards collapsed by default (`defaultExpanded = false`) — no card auto-expands on load
  - Session state: card stays open if user expanded it, resets on new session
  - Glance lines under each collapsed card header (static + dynamic for Crystal/Glamour)
  - Done button does NOT auto-collapse card after marking complete
  - Header alignment fixed: `items-start` (was `items-center`) — title doesn't jump on expand
  - Waning Gibbous morning ritual: 3 steps shortened ("Begin with gratitude. The peak has passed." etc.)
  - Saturn morningAdd: removed "Saturn honors follow-through." second sentence
- ✅ UI Fixes Brief v3.1 (June 2026) — rich card widgets:
  - `MorningRitualBody` — vertical dashed timeline (numbered circles + dashed connector line)
  - `JournalBody` — lined paper background (horizontal rules), Cormorant italic, "Start writing…" hint
  - `MirrorBody` — affirmation + ghost reflection (opacity 0.06, max-height 36px, gradient mask)
  - `CrystalBody` — large crystal icon + name + "Carry it close today" + property chips [Protection][Grounding][Saturn] + instruction with separator
  - `GlamourBody` — 64×64px color swatches + labels + shortened copy (first sentence only)
  - Evening Ritual uses same dashed timeline as Morning Ritual
  - CRYSTAL_PROPERTIES lookup table for 9 crystals (in TodayTab.tsx)
  - GLAMOUR_SWATCHES map with per-color hex breakdowns (in TodayTab.tsx)
  - CrystalCardSmall in LearnTab: added `kalyra-card crystal-card` className for dusk CSS var inheritance
- ✅ Energy of the Day Card v5.0 (June 2026) — portal widget replacing 3-tile grid:
  - Always-dark cosmic card (`#0D0A1A → #1A0D35 → #241540`) — same in all 4 sky modes
  - Moon phase rendered via `PremiumMoon` SVG component (5 layers — see v6.0 below)
  - 5-layer architecture: top label → moon → phase name → day mode → guidance+question → crystal
  - Day mode = moon phase × planetary ruler synthesis (5 modes: Begin/Build/Manifest/Release/Rest)
  - `PHASE_TO_MODE` maps 8 phases to 5 modes; `ENERGY_CONTENT` = 35 entries (5×7)
  - Each entry (mode, planet) has: guidance, question to carry, crystal + detail — all in Kalyra voice
  - Mode glyphs: inline SVG per mode (seed, arrow-up, sun-rays, arrow-down, crescent)
  - Mode color: teal(Begin) / gold(Build) / amber(Manifest) / rose(Release) / violet(Rest)
  - 10 static star positions with twinkle animation inside card
  - No "Done" circle — energy of the day is experienced, not checked off
  - Removed: old 3-tile grid, MOON_PHASE_TAGLINE, DAY_RULER_TAGLINE, MoonPhaseIcon2/PlanetIcon imports
- ✅ Visual Polish v6.0 (June 2026) — Dusk Jasny Zachód + Premium Moon + Night Energy card:
  - Dusk "Jasny Zachód": light gradient `#F5C8A0 → #F0B0A0 → #E8A8B8`, dark text (like Dawn), single gold `#C9A84C`, light warm nav
  - `PremiumMoon` SVG component: 5-layer rendering — atmospheric glow, sphere radial gradient, maria/craters (opacity 0.22), rim light, soft blurred terminator (`feGaussianBlur stdDeviation="2.2"`)
  - Shadow cx offset per phase creates moon phase shape; `isNew`/`isFull` special cases
  - Night Energy card: `border: 0.5px solid rgba(201,168,76,0.2)` + gold glow so card reads against dark bg
- ✅ Visual Polish v6.1 (June 2026) — Divider & Energy card halo per mode:
  - Sacred divider uses `currentColor` (line + SVG stroke) — color set per mode via CSS class
  - Dawn: lila `rgba(123,104,144,0.7)` · Day: blue `rgba(90,110,140,0.7)` · Dusk: warm brown `rgba(160,100,90,0.8)` · Night: gold `rgba(201,168,76,0.8)`
  - Energy card adaptive glow: dawn=lila, day=blue, dusk=warm orange, night=gold border+glow
  - Principle: dark portal card stays constant, only its frame (divider + shadow) adapts per mode

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
