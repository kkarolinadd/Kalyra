# Kalyra — Project Status

**Last updated:** June 3, 2026
**Version:** 0.3.0 — Today Tab + Moon Calendar
**Live URL:** https://kalyra-virid.vercel.app
**Repository:** https://github.com/kkarolinadd/Kalyra

---

## ✅ Done

### Infrastructure
- Next.js 15 (App Router, Turbopack) + React 19 + shadcn/ui + Tailwind CSS v4
- **PWA** — installable on iPhone/Android (manifest.json, icons, apple-touch-icon)
- **Vercel deployment** — auto-deploys on every push to `main`
- Mobile layout — phone frame on desktop, full screen on mobile (status bar hidden on real phone)
- **3-mode color system** — Morning (cream, 6–11h) / Afternoon (amber, 11–18h) / Night (cosmic dark, 18–6h)
- Smooth 2s CSS transitions between modes, auto-switch every 5 min
- localStorage persistence (user profile, daily check-ins, streak)
- TypeScript — fully typed, zero errors
- GitHub CLI (`gh`) installed, auth via keychain

### Fonts & Design System
- **Cormorant Garamond** (headings, editorial serif) + **Inter** (body, UI labels)
- Gold `#C9A84C` — constant across all 3 modes
- `.kalyra-voice` class — italic Cormorant for Kalyra's persona text
- **Icon System v1.0** (`src/components/icons.tsx`) — all SVG linear icons, no emoji in UI
  - Nav bar: Today (half-moon), Moon (crescent), Crystals (gem), Learn (4-star), Profile (silhouette)
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
- AI Ritual Generator — UI complete, mocked (1×/day limit)
- 12 Master Rituals with steps, phase-based assignment (max 3/day)

### Moon Calendar Tab — full spec implementation
- Monthly grid, 7 columns, 80px cell height, 40px moon phase icons
- Two-tone moon SVGs — always readable on dark and light backgrounds
- TODAY: gold ring + gold date number
- Full Moon: gold date + subtle glow stroke
- **Event dots** — 5 tiers: gold (Full/New Moon), purple (Eclipse), teal (Sun ingress), gray (Retrograde), pink (Conjunction), max 3 per day
- Navigation: ‹ PREV / NEXT › arrows + swipe left/right
- **Bottom sheet** on day tap: phase + sign + traditional name (Strawberry Moon etc.) + illumination, planet ruler, crystal, Kalyra's voice quote, CTA
- Bottom sheet uses CSS variables — adapts to all 3 color modes
- Legend: half-moon icon + TODAY circle + eclipse dot + special dot

### Design Docs in project folder
- `Glamour_Magic_PRD.md` — full PRD v1.0
- `PRD.md` — Kalyra tech PRD v1.1
- `Kalyra_Icon_System.md` — icon spec v1.0
- `Kalyra_MoonCalendar_Spec.md` — calendar spec v1.0

---

## 🔨 In Progress

Nothing currently in progress.

---

## 📋 Up Next

### High priority
- [ ] **Crystals tab** — 30+ crystal cards, search + filter by intention / zodiac affinity
- [ ] **Profile tab** — elemental balance bar, Sun/Moon/Rising cards, streak history, settings
- [ ] **Live Claude API** — replace mock with real `claude-sonnet-4-6` call

### Medium priority
- [ ] **Learn tab** — Zodiac guide (12 signs), Mirror Principle (5-part course), 6 meditations
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
| `src/components/AppShell.tsx` | Phone frame, bottom nav, 3-mode color switching, stars animation |
| `src/components/TodayTab.tsx` | Main daily ritual screen |
| `src/components/CalendarTab.tsx` | Moon Calendar — grid, bottom sheet, event dots |
| `src/components/OnboardingFlow.tsx` | First-launch onboarding |
| `src/app/globals.css` | 3-mode CSS variables (morning/mid/dark), animations |
| `public/manifest.json` | PWA manifest |

---

## 🐛 Known Issues / Notes

- Moon sign calculation is simplified (sidereal approximation) — accuracy ±1 day near sign boundaries
- Rising sign requires birth time — shown as placeholder in onboarding, not yet calculated
- AI Ritual Generator is mocked — returns static example text, no live API call
- Vercel URL: `kalyra-virid.vercel.app` (rename possible in Vercel settings)
