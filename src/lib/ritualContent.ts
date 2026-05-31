import type { MoonPhase, Planet, ZodiacSign } from "./astrology";

export interface DailyRitual {
  morningRitual: string[];
  journalPrompt: string;
  mirrorReflection: string;
  crystal: {
    name: string;
    why: string;
    howToUse: string;
  };
  glamour: {
    color: string;
    suggestion: string;
  };
  eveningRitual: string[];
}

// Key: `${moonPhase}|${dayRuler}`
// We define content for all 8 phases × 7 rulers = 56 combinations.
// For brevity in MVP, we define representative content per phase,
// then layer in day-ruler adjustments.

function getRitual(phase: MoonPhase, ruler: Planet): DailyRitual {
  const phaseContent = PHASE_BASE[phase];
  const rulerLayer = RULER_LAYER[ruler];

  return {
    morningRitual: [...phaseContent.morning, rulerLayer.morningAdd],
    journalPrompt: phaseContent.journal,
    mirrorReflection: phaseContent.mirror,
    crystal: {
      name: rulerLayer.crystal,
      why: `${phaseContent.crystalWhy} ${rulerLayer.crystalWhy}`,
      howToUse: phaseContent.crystalUse,
    },
    glamour: {
      color: rulerLayer.color,
      suggestion: rulerLayer.glamour,
    },
    eveningRitual: phaseContent.evening,
  };
}

export { getRitual };

// ─── Phase base content ───────────────────────────────────────────────────────

const PHASE_BASE: Record<
  MoonPhase,
  {
    morning: string[];
    journal: string;
    mirror: string;
    crystalWhy: string;
    crystalUse: string;
    evening: string[];
  }
> = {
  "New Moon": {
    morning: [
      "Light a white or black candle and sit in silence for 5 minutes.",
      "Write 3 intentions you are planting this lunar cycle.",
      "Place your hands on your heart and say: \"I am ready to begin.\"",
      "Set a glass of water in a window to charge with new moon energy.",
    ],
    journal:
      "The slate is clean. What do you most want to call in this lunar cycle? Write without filtering — let your truest desire speak.",
    mirror:
      "I am at the beginning. All is possible. I plant my intentions in fertile ground and trust they will grow.",
    crystalWhy: "New Moon energy amplifies intention-setting and new beginnings.",
    crystalUse:
      "Hold your crystal while writing your intentions. Place it on top of your written list overnight.",
    evening: [
      "Read your morning intentions aloud.",
      "Place your crystal on the windowsill to charge under the dark sky.",
      "Write one word that describes who you're becoming this cycle.",
    ],
  },

  "Waxing Crescent": {
    morning: [
      "Drink a full glass of water before anything else — hydration activates momentum.",
      "Write 3 words for who you're calling in this season.",
      "Hold your crystal and say your words aloud with conviction.",
    ],
    journal:
      "The story is beginning. What is one small, courageous step you can take today toward what you planted at the New Moon?",
    mirror:
      "I am open to what's beginning. My words create worlds. I welcome new versions of myself.",
    crystalWhy: "Waxing energy supports new growth and first steps.",
    crystalUse:
      "Carry your crystal in your pocket or bra today. Let it remind you of your intention every time you touch it.",
    evening: [
      "Review what you did today toward your intention — even the smallest step counts.",
      "Leave a glass of water on the windowsill tonight.",
      "Write: \"Tomorrow I will...\" — one concrete action.",
    ],
  },

  "First Quarter": {
    morning: [
      "Move your body for at least 10 minutes — walk, stretch, dance.",
      "Name one obstacle you've been avoiding. Write it down.",
      "Hold your crystal and ask: \"What does this challenge want to teach me?\"",
      "Make one decisive action before noon.",
    ],
    journal:
      "What obstacle has appeared on the path to your intention? Describe it honestly. Now ask: what would change if you saw this as an ally rather than a block?",
    mirror:
      "I am strong enough to meet what arises. Every challenge is here to refine me. I act with clarity and courage.",
    crystalWhy: "First Quarter energy demands action and decision-making.",
    crystalUse:
      "Place your crystal on your desk. Before any important decision today, hold it for 3 breaths and act from stillness.",
    evening: [
      "Name one decision you made today. Honor yourself for making it.",
      "Release any tension in your body with slow deep breaths.",
      "Write: \"I am proud that I...\" — complete the sentence.",
    ],
  },

  "Waxing Gibbous": {
    morning: [
      "Review what you set at the New Moon — how far have you come?",
      "Identify what needs one more honest push. Write it.",
      "Hold your crystal and say: \"I trust the process and my timing.\"",
    ],
    journal:
      "You are building toward the Full Moon. What is almost ready? What have you been quietly preparing that you haven't told anyone? What needs one more push?",
    mirror:
      "I am in refinement mode. Everything I am building is becoming more precise, more true. I trust the process and I trust my timing.",
    crystalWhy: "Waxing Gibbous supports refinement and building toward peak.",
    crystalUse:
      "Hold your crystal during focused work. It amplifies concentration and precision.",
    evening: [
      "Light a candle and sit quietly for 5 minutes.",
      "Add something beautiful to your space — Waxing Gibbous rewards beauty.",
      "Write a gratitude list for this lunar cycle so far.",
    ],
  },

  "Full Moon": {
    morning: [
      "Step outside and feel the air on your skin — the Full Moon peaked and the world is luminous.",
      "Write what arrived this lunar cycle since the New Moon.",
      "Hold your crystal and ask: \"What is ready to be released?\" Write without filtering.",
      "Set your moon water vessel outside before the day begins.",
    ],
    journal:
      "What belief, pattern, or story is ready to burn away tonight? Write it clearly. Then write the opposite truth — the version that is actually true for who you're becoming. Read it aloud three times.",
    mirror:
      "I am expansive. I release what is too small for me. I trust that what is meant for me cannot pass me by. I am the magic I've been seeking.",
    crystalWhy: "Full Moon energy amplifies and charges crystals for weeks.",
    crystalUse:
      "Place your crystal in direct moonlight tonight to charge it. Hold it during your release ritual.",
    evening: [
      "Full moon ceremony: arrange your altar with a candle, crystal, and moon water vessel.",
      "Write what you are releasing on paper. Read aloud, then burn or tear and release outside.",
      "Collect your moon water — charged with peak lunar energy.",
      "Optional: Full moon bath with Epsom salt and your crystal at the edge of the tub.",
    ],
  },

  "Waning Gibbous": {
    morning: [
      "Begin with gratitude — the peak has passed and it's time to harvest.",
      "Write 5 things this lunar cycle has taught you.",
      "Share something you've learned with someone you trust.",
    ],
    journal:
      "What did this lunar cycle teach you? What arrived that you didn't expect? What are you integrating?",
    mirror:
      "I receive the gifts of this cycle with gratitude. I integrate what I've learned. I share what I've grown.",
    crystalWhy: "Waning Gibbous supports gratitude, integration, and sharing wisdom.",
    crystalUse:
      "Place your crystal near something you're grateful for. Hold it when you feel called to share or teach.",
    evening: [
      "Write a short letter to your future self about what you're taking from this cycle.",
      "Cleanse your crystal — moonlight, sound, or smoke.",
      "Rest well. Waning Gibbous asks you to slow down.",
    ],
  },

  "Last Quarter": {
    morning: [
      "Declutter one small space — a drawer, a bag, your phone camera roll.",
      "Name what you are actively releasing this week. Write it.",
      "Hold your crystal and say: \"I release what no longer serves me. I make space for what is coming.\"",
    ],
    journal:
      "What are you releasing that no longer serves you? Be specific — name it, describe it, and then write why you are ready to let it go. What becomes possible when it's gone?",
    mirror:
      "I release with grace. I forgive freely. I trust that releasing makes space for something truer.",
    crystalWhy: "Last Quarter energy supports letting go, clearing, and forgiveness.",
    crystalUse:
      "Hold your crystal while doing any clearing task. It helps transmute what you're releasing.",
    evening: [
      "Take a cleansing bath or shower with intention — visualize what you're washing away.",
      "Write what you are forgiving — yourself, others, the situation.",
      "Sleep with your crystal under your pillow.",
    ],
  },

  "Waning Crescent": {
    morning: [
      "Rest. This is the dark of the cycle — surrender, don't push.",
      "Drink herbal tea or warm water with lemon before anything digital.",
      "Sit in silence for 5 minutes. No agenda. Just being.",
    ],
    journal:
      "The cycle is ending. What are you ready to begin again? What version of yourself is waiting to emerge at the New Moon? Write a love letter to that version of you.",
    mirror:
      "I rest without guilt. I surrender to the natural rhythms of my life. I am preparing for a beautiful beginning.",
    crystalWhy: "Waning Crescent energy supports rest, dream work, and quiet preparation.",
    crystalUse:
      "Place your crystal under your pillow tonight for dream guidance. Hold it while meditating.",
    evening: [
      "Go to sleep earlier than usual if you can.",
      "Write any dreams or intuitions from today.",
      "Set an intention for the New Moon coming soon.",
    ],
  },
};

// ─── Ruler layer (adjusts crystal, color, glamour, +1 morning step) ───────────

const RULER_LAYER: Record<
  Planet,
  { crystal: string; crystalWhy: string; color: string; glamour: string; morningAdd: string }
> = {
  Sun: {
    crystal: "Citrine",
    crystalWhy: "Sun energy amplifies confidence, visibility, and life force.",
    color: "Gold or amber",
    glamour:
      "Gold or amber. Citrine if you have it. Wear something that makes you feel powerful — the Sun rewards visibility.",
    morningAdd:
      "Step into sunlight for at least 2 minutes this morning. Let the Sun see you.",
  },
  Moon: {
    crystal: "Moonstone",
    crystalWhy: "Moon days amplify intuition, emotion, and lunar connection.",
    color: "Silver or white",
    glamour:
      "Silver or pearl white. Something soft and flowing. Let yourself be luminous today.",
    morningAdd:
      "Notice your emotional tone this morning without judgment. The Moon asks you to feel, not fix.",
  },
  Mercury: {
    crystal: "Blue Lace Agate",
    crystalWhy: "Mercury rules communication — this crystal supports clarity of thought and expression.",
    color: "Silver or pale yellow",
    glamour:
      "Silver or pale yellow. Something that allows you to move freely — Mercury days are for ideas in motion.",
    morningAdd:
      "Write or speak 3 ideas that have been waiting in your mind. Mercury days reward communication.",
  },
  Venus: {
    crystal: "Rose Quartz",
    crystalWhy: "Venus rules love and beauty — Rose Quartz amplifies both.",
    color: "Rose pink or soft green",
    glamour:
      "Rose pink, blush, or soft green. Wear something you feel beautiful in. Venus days are for pleasure and connection.",
    morningAdd:
      "Do one thing that is purely for beauty or pleasure today — it doesn't need to be productive.",
  },
  Mars: {
    crystal: "Carnelian",
    crystalWhy: "Mars rules action and drive — Carnelian amplifies courage and momentum.",
    color: "Red or orange",
    glamour:
      "Red or burnt orange. Wear something bold. Mars days are for decisive action, not hesitation.",
    morningAdd:
      "Name one thing you've been putting off. Mars gives you energy today — begin it.",
  },
  Jupiter: {
    crystal: "Green Aventurine",
    crystalWhy: "Jupiter rules expansion and abundance — Aventurine amplifies luck and opportunity.",
    color: "Deep blue or purple",
    glamour:
      "Deep royal blue or violet. Something that makes you feel expansive and deserving. Jupiter days invite you to think bigger.",
    morningAdd:
      "Write one thing you would do if you knew it would succeed. Jupiter days support big vision.",
  },
  Saturn: {
    crystal: "Black Tourmaline",
    crystalWhy: "Saturn rules structure and protection — Black Tourmaline grounds and shields.",
    color: "Black, charcoal, or dark green",
    glamour:
      "Black or charcoal. Classic, structured, intentional. Saturn days reward discipline and long-term thinking.",
    morningAdd:
      "Write one commitment you are making to yourself this week. Saturn honors follow-through.",
  },
};

// ─── Special section content ──────────────────────────────────────────────────

export interface SpecialSectionContent {
  title: string;
  icon: string;
  body: string;
}

export function getSpecialSectionContent(
  eventType: string
): SpecialSectionContent | null {
  const content: Record<string, SpecialSectionContent> = {
    new_moon: {
      title: "New Moon Ritual",
      icon: "🌑",
      body: "This is your most potent manifesting window of the month. Write your intentions as if they have already happened — in the present tense. Place your crystal on top of your written intentions overnight. Light a candle and sit with your desires for 10 minutes. What you plant tonight grows for the next 28 days.",
    },
    full_moon: {
      title: "Full Moon Ceremony",
      icon: "🌕",
      body: "Tonight the moon is at her peak. Set out a bowl of water under the moonlight to charge it with full moon energy. Write what you are releasing on a piece of paper, then burn it safely or tear it and release outside. Draw yourself a bath with Epsom salt and place your crystal at the edge of the tub. You are luminous.",
    },
    blue_moon: {
      title: "Blue Moon: Rare Window",
      icon: "✦",
      body: "A Blue Moon occurs approximately every 2–3 years. The energy is amplified and the window is long — set one big, audacious intention that you want to have lived into by the next Blue Moon. Blue Moon–charged crystals hold their energy for weeks. Do not play small tonight. What does the most expansive version of your life look like?",
    },
    micromoon: {
      title: "Cosmic Note: Micromoon",
      icon: "🔭",
      body: "The Moon is near apogee today — slightly farther from Earth than usual. The energy is subtler, more introspective. This is an ideal time for quiet ritual, dream work, and inner reflection rather than outward action. Honor the quiet.",
    },
    supermoon: {
      title: "Cosmic Note: Supermoon",
      icon: "🌟",
      body: "The Moon is near perigee — closer to Earth than usual. Emotions and intuition are amplified. You may feel more sensitive or intense than usual. Channel this heightened energy into ritual, creativity, or deep conversation.",
    },
    mercury_rx_start: {
      title: "Mercury Retrograde Alert",
      icon: "☿",
      body: "Mercury stations retrograde today. For the next ~3 weeks: avoid signing contracts or launching new projects if possible. Do review, revise, and reconnect. Back up your devices. Reach out to people from your past — retrograde often brings meaningful reunions. Communication may be slower or more easily misunderstood — add extra clarity to everything you send.",
    },
    mercury_rx_end: {
      title: "Mercury Direct",
      icon: "☿",
      body: "Mercury stations direct today. The fog is lifting. Give it 2–3 days before launching anything significant — the energy is still integrating. Review what came up during retrograde: what needed to be revisited? What insights did the slow-down reveal?",
    },
    sun_ingress: {
      title: "New Solar Season Opens",
      icon: "☀️",
      body: "The Sun moves into a new sign today, opening a new energetic season. Write a letter to your future self describing who you will have become by the time the Sun moves into this sign again next year. Seal it. Perform a small ritual to welcome this new solar energy — light a candle, step outside, or set one seasonal intention.",
    },
    moon_conjunct_jupiter: {
      title: "Abundance Window",
      icon: "♃",
      body: "The Moon meets Jupiter today — one of the most auspicious transits of the month. This is a potent window for manifestation and abundance work. Write your financial or expansion intentions. Hold Green Aventurine if you have it. Say aloud: \"I am open to unexpected blessings.\" The energy is available — meet it with specificity.",
    },
    moon_conjunct_venus: {
      title: "Love & Beauty Window",
      icon: "♀",
      body: "The Moon meets Venus today — the sky's most tender combination. This is a day for self-love practices, connection, beauty rituals, and pleasure without guilt. Write a love letter to yourself. Wear something that makes you feel beautiful. Say yes to softness today.",
    },
    eclipse_solar: {
      title: "Solar Eclipse Portal",
      icon: "🌑",
      body: "Solar eclipses are portals of accelerated change. What is ending or beginning in your life right now is likely fated — trust the rearrangement, even if it feels disruptive. Avoid making irreversible decisions on eclipse day itself. Instead, observe, journal, and let the energy move through you. What you set in motion near eclipses often anchors for 6 months or longer.",
    },
    eclipse_lunar: {
      title: "Lunar Eclipse Portal",
      icon: "🌕",
      body: "Lunar eclipses are Full Moons amplified — emotional revelations, completions, and culminations that have been building for months. You may feel intense. This is a time to release what the eclipse illuminates, not to force. Journal what surfaces. What has been in the shadows? What is the Moon showing you tonight?",
    },
  };

  return content[eventType] ?? null;
}

// ─── Personalized greeting ────────────────────────────────────────────────────

export function getGreeting(
  name: string,
  moonSign: ZodiacSign,
  moonPhase: MoonPhase
): string {
  const hour = new Date().getHours();
  const timeOfDay =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const phaseMessages: Record<MoonPhase, string> = {
    "New Moon": `New Moon in ${moonSign} — your intentions are seeds. Plant them well.`,
    "Waxing Crescent": `Moon growing in ${moonSign} — your momentum is building.`,
    "First Quarter": `First Quarter in ${moonSign} — take decisive action today.`,
    "Waxing Gibbous": `Moon building in ${moonSign} — you're almost at the peak.`,
    "Full Moon": `Full Moon in ${moonSign} — your emotions are your compass.`,
    "Waning Gibbous": `Moon waning in ${moonSign} — harvest and integrate.`,
    "Last Quarter": `Last Quarter in ${moonSign} — release what no longer serves you.`,
    "Waning Crescent": `Moon resting in ${moonSign} — honor the quiet. Rest is magic.`,
  };

  return `${timeOfDay}, ${name}. ${phaseMessages[moonPhase]}`;
}
