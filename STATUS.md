# Kalyra — Project Status

**Last updated:** June 4, 2026
**Version:** 0.7.2 — Today tab polish
**Live URL:** https://kalyra-virid.vercel.app
**Repository:** https://github.com/kkarolinadd/Kalyra

---

## ✅ Done

### Infrastructure
- Next.js 15 (App Router, Turbopack) + React 19 + shadcn/ui + Tailwind CSS v4
- **PWA** — installable on iPhone/Android (manifest.json, icons, apple-touch-icon)
- **Vercel deployment** — auto-deploys on every push to `main`
- Mobile layout — phone frame on desktop, full screen on mobile (status bar hidden on real phone)
- **4-mode color system** — DAWN (6–11h) / DAY (11–16h) / DUSK (16–20h) / NIGHT (20–6h)
- Smooth 2s CSS transitions between modes, auto-switch every 5 min
- localStorage persistence (user profile, daily check-ins, streak)
- TypeScript — fully typed, zero errors
- GitHub CLI (`gh`) installed, auth via keychain

### Fonts & Design System
- **Cormorant Garamond** (headings, editorial serif) + **Inter** (body, UI labels)
- Gold `#C9A84C` (DAWN/DAY/NIGHT) / `#FFD97A` (DUSK) — per-mode accent
- `.kalyra-voice` class — italic Cormorant for Kalyra's persona text
- **Icon System v1.0** (`src/components/icons.tsx`) — all SVG linear icons, no emoji in UI
  - Nav bar (4 tabs): Today (half-moon), Moon (crescent), Learn (4-star), Profile (silhouette)
  - Section icons: Sunrise, Evening, Journal (quill), Mirror, Crystal, Glamour (3 stars), Energy (bolt)
  - Moon phases: 8 SVG icons, two-tone (#E8E0F0 lit / #1E1640 shadow), Full Moon with glow
  - Crystal shapes: 12 geometric per mineral (Carnelian teardrop, Amethyst hexagon, etc.)
  - Check-in: gold circle + checkmark / empty circle

### Onboarding
- 4-step flow: Welcome → Name → Birth date/time/city → Sign summary
- Sun sign + Moon sign calculated from birth date
- Rising sign shown if birth time provided (placeholder — V2 calculation)
- Skips on returning visits

### Today Tab — full redesign
- **Header** — centered: date, "Hello, Karo.", ☀️ Sun + 🌙 Moon sign pills (+ ↑ Rising if available)
- **Day card** — 3 equal columns: Moon phase SVG + tagline / ⚡ Planet + action / Crystal shape + "carry today"
- Morning Ritual, Journal Prompt, Mirror Reflection, Crystal of the Day, Glamour Magic, Evening Ritual
- **Section icons** — SVG linear, gold
- **Checkboxes** — 28px circular, gold fill on complete
- Ritual tags in card headers (e.g. "Meditation" tag on Evening card when triggered)
- Daily Check-in summary — alignment celebration
- Special event sections: Full Moon, New Moon, Blue Moon, Mercury Rx, Sun ingress, Eclipse, Conjunctions
- AI Ritual Generator — tap-on-card pattern (no button), mocked (1×/day limit); subtitle "Tap to generate · 1× per day"
- 12 Master Rituals with steps, phase-based assignment (max 3/day)
- **Dusk polish:** `card--collapsed` class on collapsed cards → `rgba(255,248,240,0.40)` bg; `card__sublabel` class on "How to use today" → `#6A2530`

### Moon Calendar Tab — full spec implementation
- Monthly grid, 7 columns, 80px cell height, 40px moon phase icons
- Two-tone moon SVGs — always readable on dark and light backgrounds
- TODAY: gold ring + gold date number
- Full Moon: gold date + subtle glow stroke
- **Event dots** — 5 tiers: gold (Full/New Moon), purple (Eclipse), teal (Sun ingress), gray (Retrograde), pink (Conjunction), max 3 per day; **5px in dusk** (4px elsewhere)
- Navigation: ‹ PREV / NEXT › arrows + swipe left/right
- **Bottom sheet** on day tap: phase + sign + traditional name (Strawberry Moon etc.) + illumination, planet ruler, crystal, Kalyra's voice quote, CTA
- Bottom sheet uses CSS variables — adapts to all 3 color modes
- Legend: half-moon icon + TODAY circle + eclipse dot + special dot; `.calendar-legend__label` class — dark in dusk `rgba(60,20,40,0.8)`

### Profile Tab
- **User Header** — gold initials avatar, name, birth date + city, "Edit →" button
- **Kalyra's Reading** — italic serif, gold left border, text per Sun×Moon combination (26 hardcoded + element fallback)
- **Sign Cards** — SUN / MOON / RISING with element color background, symbol, modality
- **Elemental Makeup** — dual gradient progress bar (Sun=40%, Moon=60%), same-element handled
- **Rising Sign locked/unlocked** — dashed card with "Add birth time →" CTA when no birth time
- **Top Rituals For You** — top 4 from ritual affinity matrix, gold bar + "natural gift / strong / medium" labels
- **Practice Stats** — 3 cards: day streak, rituals this cycle, moon cycles since birth
- **Settings** — notification toggles (Morning/Evening reminder, Full/New Moon), My Data, Sign out
- **Edit Profile modal** — bottom sheet: name, date, city, birth time, Sun sign, Moon sign dropdowns

### Learn Tab
- **Featured Today** — 200px gradient card, auto-selects article by moon phase + planet of day
- **Crystal Library** — 12 crystals, horizontal scroll, 100×130px cards with geometric icons
- **Crystal detail view** — full-screen overlay: properties, how-to-use (carry/place/meditate), moon phases, Kalyra quote
- **Explore Topics** — 5 gradient tiles (Moon/Planets/Glamour/Chakra/Rituals), tap → filtered article list
- **Recently Added** — 6 articles with color-coded left border per category
- **Ask Kalyra** — dashed box, rotating daily question, mocked AI response in Kalyra's voice
- **Article detail view** — full-screen: Kalyra intro, body text, key takeaways
- **13 articles** with full content in Kalyra's voice (spec target: 38)

### Design Docs in project folder
- `Glamour_Magic_PRD.md` — full PRD v1.0
- `PRD.md` — Kalyra tech PRD v1.1
- `Kalyra_Icon_System.md` — icon spec v1.0
- `Kalyra_MoonCalendar_Spec.md` — calendar spec v1.0
- `Kalyra_LearnTab_Spec.md` — Learn tab spec v1.1 (Crystal Library merged in, 4-tab nav)
- `Kalyra_ColorSystem_v2.md` — Color System v2.4 (4 sky modes, dusk: cards/collapsed/sublabel/legend/nav)

---

## 🔨 In Progress

Nothing currently in progress.

---

## 📋 Up Next

### High priority
- [x] **Profile tab** — ✅ done in v0.7.0
- [ ] **Live Claude API** — replace mocks (AI Ritual Generator + Ask Kalyra) with real `claude-sonnet-4-6`
- [ ] **Learn tab — expand content** — currently 13 articles, spec calls for 38

### Medium priority
- [ ] **Rising sign calculation** — Swiss Ephemeris or Astro API integration
- [ ] Kalyra as character — persona voice, onboarding screens 1 & 3

### Lower priority / V3
- [ ] Backend + user accounts (cross-device sync)
- [ ] Push notifications (morning ritual, Full Moon alert)
- [ ] Audio meditations
- [ ] Polish language version
- [ ] Social sharing (ritual card)
- [ ] Partner compatibility (synastry)

---

## 🗂 Key Files

| File | Purpose |
|---|---|
| `src/lib/astrology.ts` | Moon phase, moon sign, sun sign, day ruler, special events calendar |
| `src/lib/ritualContent.ts` | 56-combination ritual content + 12 Master Rituals + triggered ritual logic |
| `src/lib/storage.ts` | localStorage read/write helpers |
| `src/components/icons.tsx` | Full icon system — all SVG, 8 moon phases, 12 crystal shapes |
| `src/components/ProfileTab.tsx` | Profile screen — signs, elemental bar, ritual affinity, stats, settings, edit modal |
| `src/components/AppShell.tsx` | Phone frame, bottom nav, 4-mode color switching (dawn/day/dusk/night), stars animation |
| `src/components/TodayTab.tsx` | Main daily ritual screen |
| `src/components/CalendarTab.tsx` | Moon Calendar — grid, bottom sheet, event dots |
| `src/components/OnboardingFlow.tsx` | First-launch onboarding |
| `src/app/globals.css` | 4-mode CSS variables (dawn/day/dusk/night), glassmorphism, animations |
| `public/manifest.json` | PWA manifest |

---

## 🐛 Known Issues / Notes

- Moon sign calculation is simplified (sidereal approximation) — accuracy ±1 day near sign boundaries
- Rising sign requires birth time — shown as placeholder in onboarding, not yet calculated
- AI Ritual Generator is mocked — returns static example text, no live API call
- Vercel URL: `kalyra-virid.vercel.app` (rename possible in Vercel settings)
