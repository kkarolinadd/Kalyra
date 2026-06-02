# Kalyra — Project Status

**Last updated:** June 2026  
**Version:** 0.1.0 — Today Tab MVP  
**Repository:** https://github.com/kkarolinadd/Kalyra

---

## ✅ Done

### Infrastructure
- Next.js 15 (App Router) + React 19 + shadcn/ui + Tailwind CSS v4
- Mobile-first layout — phone frame on desktop, full screen on mobile
- Custom dark celestial theme (navy `#0d0e1a`, gold `#c9a84c`, Cinzel + EB Garamond fonts)
- localStorage persistence (user profile, daily check-ins, streak)
- TypeScript — fully typed, zero errors
- GitHub repository: github.com/kkarolinadd/Kalyra

### Onboarding
- 4-step flow: Welcome → Name → Birth date/time/city → Sign summary
- Automatic Sun sign + Moon sign calculation from birth date
- Rising sign placeholder (requires birth time — marked as V2)
- Skips onboarding on returning visits

### Today Tab (core loop)
- Personalized greeting (name + moon sign + phase)
- **Cosmic Header** — moon phase, illumination %, moon sign, day ruler, special event badges
- **Morning Ritual** — 3–5 steps (phase × ruler combination)
- **Journal Prompt** — one focused question per day
- **Mirror Reflection** — affirmation card, meant to be read aloud
- **Crystal of the Day** — crystal name, why today, how to use
- **Glamour Magic** — color accent + wear suggestion per day ruler
- **Evening Ritual** — 2–4 wind-down steps
- **Daily Check-in** — checkboxes per section, alignment celebration message
- **Today's Rituals** — up to 3 phase-based ritual chips (expandable, full steps)
- **AI Ritual Generator** — button + loading state + result card (mocked, 1×/day limit)

### Special Event Sections
- Full Moon Ceremony
- New Moon Ritual
- Blue Moon: Rare Window
- Micromoon / Supermoon Cosmic Note
- Mercury Retrograde Alert / Mercury Direct
- New Solar Season Opens (Sun ingress)
- Abundance Window (Moon conjunct Jupiter/Venus)
- Solar / Lunar Eclipse Portal

### Ritual Content
- 12 Master Rituals with full step-by-step instructions (PRD section 9.4)
- Phase-based ritual assignment — max 3 active per day (PRD section 9.6)
- Special events calendar hardcoded 2025–2030

---

## 🔨 In Progress

Nothing currently in progress.

---

## 📋 Up Next (V2 priorities)

### High priority
- [ ] **Profile tab** — elemental balance bar, Sun/Moon/Rising cards, streak history, settings
- [ ] **PWA manifest** — make installable on iPhone/Android from browser
- [ ] **Live Claude API** — replace mock with real `claude-sonnet-4-6` call

### Medium priority
- [ ] **Moon Calendar tab** — interactive monthly calendar, tap any day for ritual preview
- [ ] **Crystals tab** — 30+ crystal cards, search + filter by intention / zodiac affinity
- [ ] **Learn tab** — Zodiac guide (12 signs), Mirror Principle (5-part course), 6 meditations

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
| `src/lib/astrology.ts` | All astrological calculations (moon phase, sign, ruler, special events) |
| `src/lib/ritualContent.ts` | Ritual content for all 56 day combinations + 12 Master Rituals |
| `src/lib/storage.ts` | localStorage helpers |
| `src/components/TodayTab.tsx` | Main screen — all ritual sections |
| `src/components/AppShell.tsx` | Phone frame + bottom navigation |
| `src/components/OnboardingFlow.tsx` | First-launch onboarding |
| `../Glamour_Magic_PRD.md` | Full product requirements document |
| `../PRD.md` | Kalyra-specific PRD (tech stack + scope decisions) |

---

## 🐛 Known Issues / Notes

- Moon sign calculation is simplified (sidereal approximation) — accuracy ±1 day near sign boundaries
- Rising sign not yet calculated (requires Swiss Ephemeris integration)
- AI Ritual Generator is mocked — returns static example text
- No dark/light mode toggle — always dark (by design)
