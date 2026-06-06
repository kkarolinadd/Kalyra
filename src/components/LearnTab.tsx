"use client";

import { useState, useEffect } from "react";
import { getDailyAstrology } from "@/lib/astrology";
import { CrystalIcon, PlanetIcon, IconMoon, IconGlamour, IconEnergy } from "@/components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type TopicId = "moon" | "planets" | "glamour" | "chakra" | "rituals" | "crystals";

interface Crystal {
  id: string;
  name: string;
  keywords: string[];
  planet: string;
  planetSymbol: string;
  day: string;
  properties: string;
  howToUse: { carry: string; place: string; meditate: string };
  bestMoonPhases: string[];
  kalyraQuote: string;
}

interface Article {
  id: string;
  title: string;
  category: TopicId;
  topicColor: string;
  readTime: number;
  moonPhaseTags: string[];
  kalyraIntro: string;
  body: string;
  keyTakeaways: string[];
}

interface Topic {
  id: TopicId;
  name: string;
  description: string;
  gradient: string;
  articleCount: number;
  icon: "moon" | "planet" | "glamour" | "chakra" | "ritual";
}

// ─── Crystal Data ─────────────────────────────────────────────────────────────

const CRYSTALS: Crystal[] = [
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    keywords: ["love", "self-worth", "healing"],
    planet: "Venus", planetSymbol: "♀", day: "Friday",
    properties: "Rose Quartz opens the heart and supports self-love. It softens emotional wounds, dissolves defenses, and reminds you that you are worthy of receiving as much as you give.",
    howToUse: {
      carry: "In your pocket or near your heart",
      place: "By your bed or on your windowsill",
      meditate: "Hold in your left hand, breathe into your chest",
    },
    bestMoonPhases: ["New Moon", "Full Moon"],
    kalyraQuote: "Rose Quartz doesn't attract love from outside. It reminds you of the love that was always there.",
  },
  {
    id: "amethyst",
    name: "Amethyst",
    keywords: ["intuition", "calm", "clarity"],
    planet: "Jupiter", planetSymbol: "♃", day: "Thursday",
    properties: "Amethyst calms mental chatter and deepens intuition. It's the stone of the third eye — not dramatic visions, but a quiet knowing. Best used when you need clarity over noise.",
    howToUse: {
      carry: "Keep it where you do your thinking or journaling",
      place: "Near your workspace or on your nightstand",
      meditate: "Hold at your brow, breathe slowly, let thoughts settle",
    },
    bestMoonPhases: ["Full Moon", "Waning Gibbous"],
    kalyraQuote: "Amethyst doesn't give you answers. It quiets the noise long enough for you to hear your own.",
  },
  {
    id: "moonstone",
    name: "Moonstone",
    keywords: ["cycles", "intuition", "flow"],
    planet: "Moon", planetSymbol: "☽", day: "Monday",
    properties: "Moonstone attunes you to natural cycles — the moon, your body, your emotions. It softens rigidity and supports intuitive decision-making. Especially powerful during emotional transitions.",
    howToUse: {
      carry: "On days that feel emotionally complex",
      place: "On your altar or near running water",
      meditate: "Hold and breathe, let your body guide the session",
    },
    bestMoonPhases: ["New Moon", "Waxing Crescent", "Full Moon"],
    kalyraQuote: "Moonstone doesn't predict your cycles. It teaches you to stop fighting them.",
  },
  {
    id: "clear-quartz",
    name: "Clear Quartz",
    keywords: ["clarity", "amplify", "intention"],
    planet: "Sun", planetSymbol: "☉", day: "Sunday",
    properties: "Clear Quartz amplifies energy, intention, and the properties of stones near it. It's the most versatile crystal in any practice — a blank slate that holds and magnifies what you bring to it.",
    howToUse: {
      carry: "Alongside other crystals to amplify their energy",
      place: "In the center of your altar or workspace",
      meditate: "Hold and visualize your intention becoming crystal clear",
    },
    bestMoonPhases: ["New Moon", "Full Moon", "any"],
    kalyraQuote: "Clear Quartz is only as powerful as your intention. It holds what you give it.",
  },
  {
    id: "black-tourmaline",
    name: "Black Tourmaline",
    keywords: ["protection", "grounding", "boundaries"],
    planet: "Saturn", planetSymbol: "♄", day: "Saturday",
    properties: "Black Tourmaline creates an energetic boundary. It absorbs and transmutes dense energy, grounds scattered thoughts, and creates a sense of safety. Keep it near your front door or in your bag.",
    howToUse: {
      carry: "In your bag when you need energetic protection",
      place: "Near your front door or in the corners of a room",
      meditate: "Hold in both hands, feel roots growing from your feet",
    },
    bestMoonPhases: ["Waning Gibbous", "Last Quarter", "Waning Crescent"],
    kalyraQuote: "Black Tourmaline isn't about fear. It's about knowing where you end and the world begins.",
  },
  {
    id: "citrine",
    name: "Citrine",
    keywords: ["abundance", "joy", "motivation"],
    planet: "Sun", planetSymbol: "☉", day: "Sunday",
    properties: "Citrine carries the energy of sunlight — warmth, optimism, and forward momentum. It doesn't just attract abundance; it clears the inner belief that you don't deserve it.",
    howToUse: {
      carry: "In your wallet or pocket on Sundays",
      place: "In the wealth corner of your space (far left from your front door)",
      meditate: "Hold and visualize warmth spreading from your solar plexus",
    },
    bestMoonPhases: ["Waxing Crescent", "First Quarter", "Waxing Gibbous"],
    kalyraQuote: "Citrine doesn't bring you money. It shifts the part of you that believes you can't have it.",
  },
  {
    id: "labradorite",
    name: "Labradorite",
    keywords: ["magic", "transformation", "protection"],
    planet: "Uranus", planetSymbol: "♅", day: "Wednesday",
    properties: "Labradorite is the stone of magic and transformation. It strengthens intuition, reveals hidden truths, and protects your aura during periods of change. Its flash of color only appears in the right light — like magic itself.",
    howToUse: {
      carry: "When you're navigating major change or uncertainty",
      place: "On your altar when doing intuitive or ritual work",
      meditate: "Hold and let your mind go soft — notice what arises",
    },
    bestMoonPhases: ["Full Moon", "Waning Gibbous"],
    kalyraQuote: "Labradorite shows you the magic that was always there, hiding in plain sight.",
  },
  {
    id: "carnelian",
    name: "Carnelian",
    keywords: ["action", "courage", "creativity"],
    planet: "Mars", planetSymbol: "♂", day: "Tuesday",
    properties: "Carnelian activates the sacral chakra — the seat of creativity, desire, and action. It dissolves hesitation and connects you to your body's intelligence. Best used when you're stuck in your head.",
    howToUse: {
      carry: "When you need to act instead of overthink",
      place: "In your creative workspace",
      meditate: "Hold below your navel, breathe into your lower belly",
    },
    bestMoonPhases: ["Waxing Crescent", "First Quarter"],
    kalyraQuote: "Carnelian doesn't give you courage. It reminds your body of the courage it already has.",
  },
  {
    id: "blue-lace-agate",
    name: "Blue Lace Agate",
    keywords: ["communication", "calm", "truth"],
    planet: "Mercury", planetSymbol: "☿", day: "Wednesday",
    properties: "Blue Lace Agate soothes the throat chakra. It supports clear, calm communication — especially the kind that requires vulnerability. Good for difficult conversations, speaking your needs, or creative writing.",
    howToUse: {
      carry: "Before important conversations",
      place: "Near your phone or computer when doing communication work",
      meditate: "Hold at your throat, breathe in calm, breathe out tension",
    },
    bestMoonPhases: ["Waxing Gibbous", "Full Moon"],
    kalyraQuote: "Blue Lace Agate doesn't make you eloquent. It makes you honest.",
  },
  {
    id: "selenite",
    name: "Selenite",
    keywords: ["cleansing", "clarity", "light"],
    planet: "Moon", planetSymbol: "☽", day: "Monday",
    properties: "Selenite cleanses and charges other crystals. It brings mental clarity, dissolves energetic debris, and creates a high-vibration space. One of the few crystals that doesn't need cleansing — it self-clears.",
    howToUse: {
      carry: "Use to cleanse your other crystals — lay them on selenite overnight",
      place: "By your bed or at the entrance of a space you want to keep clear",
      meditate: "Hold and visualize white light clearing your energy field",
    },
    bestMoonPhases: ["Full Moon", "Waning Crescent"],
    kalyraQuote: "Selenite is the reset button. Use it when everything feels cloudy.",
  },
  {
    id: "green-aventurine",
    name: "Green Aventurine",
    keywords: ["luck", "opportunity", "growth"],
    planet: "Venus", planetSymbol: "♀", day: "Friday",
    properties: "Green Aventurine is the stone of new beginnings and opportunity. It doesn't just attract luck — it opens your eyes to the opportunities already around you. Especially powerful when starting something new.",
    howToUse: {
      carry: "When entering a new phase, project, or relationship",
      place: "Near plants or in spaces where you want growth",
      meditate: "Hold and breathe into a sense of openness and possibility",
    },
    bestMoonPhases: ["Waxing Crescent", "New Moon"],
    kalyraQuote: "Green Aventurine doesn't create luck. It opens the door you were already standing in front of.",
  },
  {
    id: "fluorite",
    name: "Fluorite",
    keywords: ["focus", "clarity", "order"],
    planet: "Mercury", planetSymbol: "☿", day: "Wednesday",
    properties: "Fluorite organizes chaotic energy. It supports focus, mental clarity, and the ability to think in systems. Excellent for study, detailed work, or any moment when your mind feels scattered.",
    howToUse: {
      carry: "During study or deep work sessions",
      place: "On your desk or in your workspace",
      meditate: "Hold and breathe slowly — visualize your thoughts becoming organized",
    },
    bestMoonPhases: ["First Quarter", "Waxing Gibbous"],
    kalyraQuote: "Fluorite doesn't make you smarter. It stops the noise long enough for your intelligence to work.",
  },
];

// ─── Article Data ─────────────────────────────────────────────────────────────

const TOPIC_COLORS: Record<TopicId, string> = {
  moon:     "#4A2878",
  planets:  "#6B3A10",
  glamour:  "#8B2050",
  chakra:   "#6B1840",
  rituals:  "#4A3010",
  crystals: "#2A5048",
};

const ARTICLES: Article[] = [
  {
    id: "full-moon-release",
    title: "Full Moon: release, not just manifest",
    category: "moon",
    topicColor: TOPIC_COLORS.moon,
    readTime: 4,
    moonPhaseTags: ["Full Moon"],
    kalyraIntro: "Every Full Moon, we're told to manifest. Write lists, light candles, ask the universe. But that's only half the ritual.",
    body: `The Full Moon isn't just a time to ask — it's a time to let go. The moon has reached maximum illumination. What has been growing in the dark is now fully visible. And visibility requires honesty.\n\nLook at what you've been avoiding. What emotion have you been managing instead of feeling? What conversation have you been postponing? What part of yourself have you been too busy to look at?\n\nThis is the Full Moon's real invitation: not to manifest more, but to examine honestly. Manifestation without release creates accumulation. You add desires without addressing what's blocking them.\n\nThe ritual isn't complicated. Write what you're ready to release — not what you should release, what you actually feel ready to let go of. Burn it if you can. If not, tear it and dispose of it away from your home. Then, and only then, write what you're calling in.`,
    keyTakeaways: [
      "Full Moon energy is for releasing, not just manifesting",
      "Ask: what is now visible that I've been avoiding?",
      "Release ritual first, manifestation second",
      "Honesty is the active ingredient — not the ritual itself",
    ],
  },
  {
    id: "new-moon-intentions",
    title: "New Moon: setting intentions that actually work",
    category: "moon",
    topicColor: TOPIC_COLORS.moon,
    readTime: 3,
    moonPhaseTags: ["New Moon"],
    kalyraIntro: "Most intention-setting fails not because of bad intentions, but because we confuse wishing with deciding.",
    body: `The New Moon is the darkest night — and the most potent time to plant. But there's a difference between a wish and an intention.\n\nA wish says: "I want this to happen." An intention says: "I am orienting my energy toward this." One is passive. One is active.\n\nThe most effective New Moon intentions are specific, felt, and rooted in the present tense. Not "I want to find love" but "I am the kind of woman who is open to real connection." Not "I want more money" but "I am building the relationship with money that I was never taught."\n\nThe New Moon in each zodiac sign shifts the flavor of what's available. A New Moon in Taurus invites you to plant in the realm of body, material security, and slow-building pleasure. A New Moon in Scorpio invites depth, transformation, power. Read your moon sign alongside the sign of the current New Moon for the most personal reading.`,
    keyTakeaways: [
      "Intentions are decisions, not wishes",
      "Write in present tense: 'I am,' not 'I want'",
      "The zodiac sign of the New Moon shapes what to plant",
      "Specificity makes intentions actionable",
    ],
  },
  {
    id: "waning-gibbous-gratitude",
    title: "Waning Gibbous: gratitude as a practice",
    category: "moon",
    topicColor: TOPIC_COLORS.moon,
    readTime: 3,
    moonPhaseTags: ["Waning Gibbous"],
    kalyraIntro: "The Waning Gibbous is the moon's exhale. The peak has passed. What was built is now being integrated.",
    body: `In the days after the Full Moon, the invitation is to receive what the cycle gave you. Not to chase more, not to analyze — simply to receive.\n\nGratitude in this phase isn't the performative kind. It's not a list of things you're grateful for as a manifestation hack. It's something quieter: the act of actually noticing what is already here.\n\nThe Waning Gibbous asks: what did this cycle teach you? What arrived that you didn't expect? What became visible about yourself, your relationships, your work?\n\nJournaling is the natural partner of this phase. Not to process or analyze — just to notice. "This happened. I felt this. I learned this." The practice of honest witnessing is itself a form of gratitude.`,
    keyTakeaways: [
      "Waning Gibbous is for integrating, not building",
      "Practice noticing, not performing gratitude",
      "Journal without analysis — just witness what happened",
      "Ask: what did this cycle actually teach me?",
    ],
  },
  {
    id: "waxing-crescent-start",
    title: "Waxing Crescent: the best time to begin",
    category: "moon",
    topicColor: TOPIC_COLORS.moon,
    readTime: 3,
    moonPhaseTags: ["Waxing Crescent"],
    kalyraIntro: "The seed has been planted. The first light is returning. This is the moment when energy starts moving.",
    body: `After the dark of the New Moon, the Waxing Crescent brings the first sliver of returning light. And with it comes a particular kind of energy: the energy of beginning.\n\nThis isn't the moment for perfection. It's the moment for first steps. What small action can you take today that points toward your New Moon intention?\n\nThe Waxing Crescent teaches us something important about momentum: starts don't need to be dramatic. The smallest step counts. A ten-minute journal session. Sending one email. Making one decision you've been postponing.\n\nIf you wait for perfect conditions, you'll still be waiting at the Full Moon. The Waxing Crescent doesn't ask for readiness. It asks for motion.`,
    keyTakeaways: [
      "Waxing Crescent = the energy of beginning",
      "Take one small action toward your New Moon intention",
      "Momentum starts with imperfect starts",
      "Don't wait for readiness — start with motion",
    ],
  },
  {
    id: "mercury-retrograde",
    title: "Mercury Retrograde: what actually changes",
    category: "planets",
    topicColor: TOPIC_COLORS.planets,
    readTime: 4,
    moonPhaseTags: ["any"],
    kalyraIntro: "Three times a year, Mercury slows down. Here's what that actually means — and what to do with it.",
    body: `Mercury Retrograde gets blamed for everything from missed texts to broken relationships. But what's actually happening — astrologically and practically?\n\nMercury governs communication, thinking, travel, and technology. When it appears to move backward (from Earth's perspective), these areas become more prone to delays, misunderstandings, and revisiting.\n\nThe key word is revisiting. Mercury Retrograde is not a time when things break randomly. It's a time when things that were already fragile or unresolved become harder to ignore. The relationship that was strained before Retrograde becomes more strained. The project that lacked a clear foundation starts to show cracks.\n\nThis makes Mercury Retrograde a gift, if you approach it correctly. Use it to review, revise, and reconsider — not to launch, not to sign contracts, not to make final decisions if you can avoid it. The re- words are your guides: revisit, reconsider, review, reconnect, reflect.`,
    keyTakeaways: [
      "Mercury Retrograde reveals what was already fragile",
      "Use re- words: review, revise, revisit, reflect",
      "Avoid launching new projects or signing contracts",
      "Back up files, double-check communications",
    ],
  },
  {
    id: "venus-friday",
    title: "Friday / Venus: glamour, beauty, connection",
    category: "planets",
    topicColor: TOPIC_COLORS.planets,
    readTime: 4,
    moonPhaseTags: ["any"],
    kalyraIntro: "Venus doesn't just rule love. She rules your relationship with pleasure, beauty, and what you believe you deserve.",
    body: `Friday belongs to Venus. And Venus rules more than romance — she rules your entire relationship with receiving.\n\nIn practical terms, this means Friday is the day to: beautify your space, your body, your presence. Wear something that makes you feel alive. Invest in what brings you genuine pleasure. Say yes to connection.\n\nBut Venus also has a shadow: she rules the places where we decide we're not worthy. The way you negotiate your desires downward. The way you apologize for wanting beauty, pleasure, or love. Friday's invitation isn't just to enjoy — it's to notice where you're holding back from enjoyment.\n\nFor glamour rituals, Friday is the most powerful day. Dressing with intention, wearing scent deliberately, choosing jewelry that carries meaning — these are Venus practices. They're not vanity. They're a form of embodied magic.`,
    keyTakeaways: [
      "Friday = Venus = your relationship with receiving",
      "Notice where you negotiate your desires downward",
      "Best day for glamour rituals and beauty practices",
      "Connection, pleasure, and beauty are not luxuries",
    ],
  },
  {
    id: "saturn-saturday",
    title: "Saturday / Saturn: structure as a spiritual practice",
    category: "planets",
    topicColor: TOPIC_COLORS.planets,
    readTime: 3,
    moonPhaseTags: ["any"],
    kalyraIntro: "Saturn gets a bad reputation. But Saturn days are when real things get built.",
    body: `Saturn rules time, structure, discipline, and the long game. Saturday carries this energy — it's the day when the most meaningful work happens, because it's unglamorous work.\n\nThe Saturn lesson is this: freedom comes from structure, not despite it. The writer who writes every day, even badly, builds something. The woman who tends her practice consistently, even on uninspired days, accumulates real power.\n\nSaturn days are not for motivation. They're for commitment. Ask yourself: what is the one thing that, if done consistently, would change everything? Saturday is the day to do it. Not because you feel inspired, but because it's Saturday.`,
    keyTakeaways: [
      "Saturn days reward consistency, not inspiration",
      "Structure creates freedom — not the other way around",
      "Ask: what must be done, regardless of how I feel?",
      "Saturday is for long-game thinking and steady work",
    ],
  },
  {
    id: "what-is-glamour-magic",
    title: "What is glamour magic — the real definition",
    category: "glamour",
    topicColor: TOPIC_COLORS.glamour,
    readTime: 3,
    moonPhaseTags: ["any"],
    kalyraIntro: "Glamour magic is older than Instagram and more serious than a skincare routine. Here's what it actually is.",
    body: `The word "glamour" comes from a Scottish corruption of "grammar" — specifically, the grammar of magic. A glamour was originally a spell cast over an object or person to make them appear differently than they were.\n\nModern glamour magic reclaims this: the intentional crafting of your outer presentation as a form of energetic communication. What you wear, how you carry yourself, the scent you choose, the colors you select — these are not vanity. They are language.\n\nThe principle is simple: your exterior communicates something, whether you intend it to or not. Glamour magic is the practice of making that communication intentional.\n\nThis isn't about perfection. It isn't about performing beauty. It's about alignment — dressing in a way that resonates with who you are becoming, not just who you've been. The woman who wears red on a Mars day isn't following a rule. She's casting a small, consistent spell.`,
    keyTakeaways: [
      "Glamour = intentional presentation as energetic language",
      "Your appearance communicates whether you intend it to or not",
      "Dress for who you are becoming, not just who you've been",
      "Consistency is the real magic — small choices add up",
    ],
  },
  {
    id: "dressing-with-intention",
    title: "Dressing with intention: how it works",
    category: "glamour",
    topicColor: TOPIC_COLORS.glamour,
    readTime: 4,
    moonPhaseTags: ["any"],
    kalyraIntro: "Getting dressed is the first ritual of the day. Most of us do it unconsciously. You don't have to.",
    body: `Intentional dressing begins with a question: who is the woman I need to be today?\n\nNot who am I. Who do I need to be — for this meeting, this date, this day, this version of myself I'm trying to step into?\n\nFrom there, the decision becomes much easier. Color, fabric, silhouette, scent — all of these are tools. Red for courage and action. Blue for communication and calm. Gold for magnetism and confidence. Black for protection and formality.\n\nPlanetary correspondence makes this more precise. On Mercury days (Wednesday), you dress to communicate — silver, yellow, or pale blue. On Venus days (Friday), you dress for beauty and connection — rose, green, copper.\n\nThe practice doesn't require special clothing. It requires attention. Take two minutes before you get dressed. Breathe. Ask: what do I need to carry with me today? Then dress to hold that energy.`,
    keyTakeaways: [
      "Ask 'who do I need to be today?' before dressing",
      "Color is the most accessible glamour tool",
      "Planetary days give structure to color choices",
      "Two minutes of intention before dressing changes the whole day",
    ],
  },
  {
    id: "why-rituals-work",
    title: "Why rituals work — the science and the magic",
    category: "rituals",
    topicColor: TOPIC_COLORS.rituals,
    readTime: 4,
    moonPhaseTags: ["any"],
    kalyraIntro: "Rituals aren't superstition. They're one of the most well-documented ways humans change behavior and access inner states.",
    body: `Behavioral science has shown that rituals reduce anxiety, improve performance, and help people access states of focus and calm on demand. Athletes do it. Musicians do it. Surgeons do it.\n\nThe mechanism isn't mysterious: rituals signal to your nervous system that a transition is happening. By performing a sequence of intentional actions, you're telling your body-mind: this time is different. This matters. I am present.\n\nIn spiritual practice, this same principle operates at a deeper level. A morning ritual doesn't just change your mood — it changes your orientation to the day. You've begun with intention. You've reminded yourself of what matters. You've connected to something larger than the to-do list.\n\nThe specific actions matter less than you think. The candle, the crystal, the journal prompt — these are anchors for attention. The real ritual is the act of showing up to yourself, consistently, on purpose.`,
    keyTakeaways: [
      "Rituals signal to your nervous system: this is important",
      "The specific actions matter less than the consistency",
      "Morning rituals change your orientation to the entire day",
      "Showing up is the ritual — everything else is an anchor",
    ],
  },
  {
    id: "mirror-work",
    title: "Mirror work: what it is, how to start",
    category: "rituals",
    topicColor: TOPIC_COLORS.rituals,
    readTime: 4,
    moonPhaseTags: ["any"],
    kalyraIntro: "Looking yourself in the eye and speaking kindly is harder than it sounds. It's also one of the most direct paths to change.",
    body: `Mirror work — the practice of standing at a mirror, looking directly into your own eyes, and speaking affirmations or simply being present — was popularized by Louise Hay and remains one of the most powerful and underused practices in self-development.\n\nThe discomfort you feel doing this is the point. Most of us can't look at ourselves for more than a few seconds without criticism arising. Mirror work surfaces the inner commentary you carry every day — the one that's usually running below conscious awareness.\n\nYou don't need to start with affirmations. Start with presence. Look into your own eyes for thirty seconds. Let the discomfort be there. Don't look away. This alone is a profound practice.\n\nWhen you're ready for words, begin simply: "I see you. I'm here." From there, you can add what you need: "You are safe. You are enough." The voice matters — speak the way you would speak to someone you love.`,
    keyTakeaways: [
      "Discomfort in mirror work = the inner critic surfacing",
      "Start with presence, not affirmations",
      "Look into your eyes for 30 seconds without looking away",
      "Speak to yourself the way you'd speak to someone you love",
    ],
  },
  {
    id: "sacral-chakra-intro",
    title: "What is the sacral chakra",
    category: "chakra",
    topicColor: TOPIC_COLORS.chakra,
    readTime: 4,
    moonPhaseTags: ["any"],
    kalyraIntro: "The sacral chakra is where desire, creativity, and embodied feeling live. Most of us were taught to suppress it.",
    body: `The sacral chakra (Svadhisthana) sits about two inches below your navel. It governs: creativity, sensuality, desire, pleasure, emotion, and the ability to feel at home in your own body.\n\nWhen this energy center is open, you feel creative, fluid, and connected to what you want. You can receive pleasure without guilt. You can feel emotions without being overwhelmed by them.\n\nWhen it's blocked — as it often is for women who grew up being told their desires were too much, their feelings were dramatic, their needs were inconvenient — life feels flat. Creativity dries up. Pleasure becomes complicated. The body feels like a vehicle rather than a home.\n\nThe first step to working with the sacral chakra isn't a yoga pose or a crystal, though those help. It's permission. Permission to want what you want. Permission to feel what you feel. Permission to inhabit your body without explanation.`,
    keyTakeaways: [
      "Sacral chakra = creativity, desire, feeling, and pleasure",
      "Blocked sacral = flat creativity, complicated pleasure, body-disconnection",
      "Permission is the first and most important practice",
      "Carnelian, Moonstone, and Citrine all support this chakra",
    ],
  },
  {
    id: "rose-quartz-truth",
    title: "Rose Quartz: beyond the love crystal",
    category: "crystals",
    topicColor: TOPIC_COLORS.crystals,
    readTime: 3,
    moonPhaseTags: ["New Moon", "Full Moon"],
    kalyraIntro: "Everyone knows Rose Quartz is for love. But which love? That's where it gets interesting.",
    body: `Rose Quartz's reputation as a "love crystal" is accurate but incomplete. It does attract love — but the love it primarily cultivates is self-love, and it works on that level first.\n\nHere's what that means practically: if you're using Rose Quartz to attract a partner but haven't worked on your relationship with yourself, the crystal will turn your attention inward. This can feel like disruption — sudden clarity about patterns you've been avoiding, emotions surfacing from past relationships.\n\nThis isn't the crystal "not working." This is the crystal doing exactly what it does.\n\nThe principle: you can only receive the love you believe you deserve. Rose Quartz works on that belief directly. Use it during quiet moments, during journaling, during the Full Moon when you're releasing old relationship patterns. Let it do the deeper work, and the outer love follows.`,
    keyTakeaways: [
      "Rose Quartz works on self-love before romantic love",
      "If it brings up old patterns — that's it working",
      "Pair with journaling for maximum effect",
      "Best used during New Moon and Full Moon phases",
    ],
  },
];

// ─── Topic Data ───────────────────────────────────────────────────────────────

const TOPICS: Topic[] = [
  { id: "moon", name: "Moon Phases", description: "Understand each phase", gradient: "linear-gradient(135deg, #1A0D35, #4A2878)", articleCount: 8, icon: "moon" },
  { id: "planets", name: "Planets & Days", description: "Ruling energies explained", gradient: "linear-gradient(135deg, #2A1508, #6B3A10)", articleCount: 7, icon: "planet" },
  { id: "glamour", name: "Glamour Magic", description: "Intentional dressing", gradient: "linear-gradient(135deg, #3A0820, #8B2050)", articleCount: 5, icon: "glamour" },
  { id: "chakra", name: "Sacral Chakra", description: "Energy, flow, healing", gradient: "linear-gradient(135deg, #1A0820, #6B1840)", articleCount: 4, icon: "chakra" },
  { id: "rituals", name: "Rituals", description: "Why rituals work", gradient: "linear-gradient(135deg, #1A1208, #4A3010)", articleCount: 4, icon: "ritual" },
];

const EXAMPLE_QUESTIONS = [
  "What does Mercury Retrograde mean for my relationships?",
  "How do I use Carnelian during Waning Gibbous?",
  "What should I focus on during a New Moon in Pisces?",
  "Why is my energy low when the moon is waning?",
  "What does it mean if my Moon sign is Scorpio?",
  "How do I start a glamour ritual?",
  "What crystals help with anxiety?",
  "How does the sacral chakra affect my creativity?",
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getFeaturedArticle(moonPhase: string, dayRuler: string): Article {
  const phaseMap: Record<string, string> = {
    "Full Moon": "full-moon-release",
    "New Moon": "new-moon-intentions",
    "Waning Gibbous": "waning-gibbous-gratitude",
    "Waxing Crescent": "waxing-crescent-start",
  };
  const planetMap: Record<string, string> = {
    "Mercury": "mercury-retrograde",
    "Venus": "venus-friday",
    "Saturn": "saturn-saturday",
  };
  const id = phaseMap[moonPhase] ?? planetMap[dayRuler] ?? "why-rituals-work";
  return ARTICLES.find((a) => a.id === id) ?? ARTICLES[0];
}

function getDailyQuestion(moonPhase: string): string {
  const seed = new Date().getDay() + new Date().getDate();
  return EXAMPLE_QUESTIONS[seed % EXAMPLE_QUESTIONS.length];
}

function getRecentlyAdded(): Article[] {
  return ARTICLES.filter((a) => a.id !== "full-moon-release").slice(0, 6);
}

// ─── Topic Icon SVGs ──────────────────────────────────────────────────────────

function TopicIconSvg({ icon, size = 24 }: { icon: Topic["icon"]; size?: number }) {
  const stroke = "rgba(255,255,255,0.75)";
  const sw = 1.5;
  if (icon === "moon") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
  if (icon === "planet") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 L4 13 L11 13 L11 22 L20 11 L13 11 Z" />
    </svg>
  );
  if (icon === "glamour") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L12.8 9.2 L19 10 L12.8 10.8 L12 17 L11.2 10.8 L5 10 L11.2 9.2 Z" />
      <path d="M19 3 L19.4 5.6 L22 6 L19.4 6.4 L19 9 L18.6 6.4 L16 6 L18.6 5.6 Z" />
    </svg>
  );
  if (icon === "chakra") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="8" strokeOpacity="0.4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
  // ritual — flame
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A3.5 3.5 0 0 0 12 18a3.5 3.5 0 0 0 3.5-3.5c0-2-1.5-3-2-5-.5 2-1.5 3-3 3.5z" />
      <path d="M12 22 L12 18" />
      <path d="M10 22 L14 22" />
    </svg>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

function SectionHeader({ label, onSeeAll }: { label: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
        {label}
      </span>
      {onSeeAll && (
        <button onClick={onSeeAll} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.04em" }}>
          See all →
        </button>
      )}
    </div>
  );
}

function FeaturedCard({ article, moonPhase, moonSign, onTap }: {
  article: Article; moonPhase: string; moonSign: string; onTap: () => void;
}) {
  const gradientMap: Record<TopicId, string> = {
    moon: "linear-gradient(135deg, #1A0D35 0%, #4A2878 60%, #6B3A90 100%)",
    planets: "linear-gradient(135deg, #2A1508 0%, #6B3A10 60%, #8B4A18 100%)",
    glamour: "linear-gradient(135deg, #3A0820 0%, #8B2050 60%, #A03060 100%)",
    chakra: "linear-gradient(135deg, #1A0820 0%, #6B1840 60%, #8B2050 100%)",
    rituals: "linear-gradient(135deg, #1A1208 0%, #4A3010 60%, #6B4818 100%)",
    crystals: "linear-gradient(135deg, #0A2020 0%, #2A5048 60%, #3A6858 100%)",
  };

  const tagLabel: Record<TopicId, string> = {
    moon: "Moon · Today", planets: "Planets · Today",
    glamour: "Glamour", chakra: "Chakra", rituals: "Ritual",
    crystals: "Crystals",
  };

  return (
    <button onClick={onTap} className="w-full text-left fade-in" style={{ border: "none", padding: 0, background: "none", cursor: "pointer" }}>
      <div style={{
        height: 200, borderRadius: 16, padding: 20, position: "relative",
        overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end",
        background: gradientMap[article.category],
      }}>
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 6, fontFamily: "var(--font-inter)", fontWeight: 600 }}>
            {tagLabel[article.category]}
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20, fontWeight: 400, color: "#FFFFFF", lineHeight: 1.3, marginBottom: 8 }}>
            {article.title}
          </h2>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 10 }}>
            &ldquo;{article.kalyraIntro.slice(0, 80)}&hellip;&rdquo;
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)" }}>
            {article.readTime} min read · {moonPhase}
          </p>
        </div>
      </div>
    </button>
  );
}

function CrystalCardSmall({ crystal, onTap }: { crystal: Crystal; onTap: () => void }) {
  return (
    <button onClick={onTap} className="kalyra-card crystal-card" style={{
      width: 100, minHeight: 130, borderRadius: 14, flexShrink: 0,
      background: "var(--card)", border: "0.5px solid var(--border)",
      padding: "12px 10px", display: "flex", flexDirection: "column",
      alignItems: "center", textAlign: "center", cursor: "pointer",
    }}>
      <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, flexShrink: 0 }}>
        <CrystalIcon name={crystal.name} size={32} />
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.3, marginBottom: 3, fontFamily: "var(--font-inter)" }}>
        {crystal.name}
      </p>
      <p style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4, marginBottom: 5, fontFamily: "var(--font-inter)" }}>
        {crystal.keywords.slice(0, 2).join(" · ")}
      </p>
      <p style={{ fontSize: 10, color: "var(--primary)", fontFamily: "var(--font-inter)" }}>
        {crystal.planetSymbol} {crystal.day}
      </p>
    </button>
  );
}

function TopicCard({ topic, onTap }: { topic: Topic; onTap: () => void }) {
  return (
    <button onClick={onTap} style={{
      width: 140, height: 160, borderRadius: 14, flexShrink: 0,
      background: topic.gradient, padding: "16px 14px",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      position: "relative", overflow: "hidden", cursor: "pointer", border: "none",
    }}>
      <div style={{ position: "absolute", top: 16, left: 14 }}>
        <TopicIconSvg icon={topic.icon} size={24} />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", marginBottom: 3, fontFamily: "var(--font-inter)", textAlign: "left" }}>
          {topic.name}
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.4, marginBottom: 7, fontFamily: "var(--font-inter)", textAlign: "left" }}>
          {topic.description}
        </p>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", fontFamily: "var(--font-inter)", textAlign: "left" }}>
          {topic.articleCount} articles →
        </p>
      </div>
    </button>
  );
}

function ArticleRow({ article, onTap }: { article: Article; onTap: () => void }) {
  return (
    <button onClick={onTap} className="w-full text-left kalyra-card" style={{
      background: "var(--card)", borderRadius: 12, borderLeft: `4px solid ${article.topicColor}`,
      padding: "14px 16px 14px 18px", marginBottom: 8, cursor: "pointer", border: `none`,
      borderLeftColor: article.topicColor, borderLeftWidth: 4, borderLeftStyle: "solid",
      display: "block",
    }}>
      <div style={{ background: "var(--card)", borderRadius: 12, borderLeft: `4px solid ${article.topicColor}`, padding: "14px 16px 14px 18px" }}>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 15, color: "var(--foreground)", lineHeight: 1.4, marginBottom: 8 }}>
          {article.title}
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-inter)", fontWeight: 600 }}>
            {article.category}
          </span>
          <span style={{ color: "var(--muted-foreground)", fontSize: 10 }}>·</span>
          <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-inter)" }}>
            {article.readTime} min
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Crystal Detail View ──────────────────────────────────────────────────────

function CrystalDetailView({ crystal, onClose }: { crystal: Crystal; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--background)", zIndex: 50, overflowY: "auto" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 60px" }}>
        {/* Back */}
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--primary)", fontFamily: "var(--font-inter)", fontSize: 14, marginBottom: 24, padding: 0 }}>
          ← Back
        </button>

        {/* Crystal icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CrystalIcon name={crystal.name} size={72} />
          </div>
        </div>

        {/* Name + keywords */}
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 28, fontWeight: 400, color: "var(--foreground)", textAlign: "center", marginBottom: 6 }}>
          {crystal.name}
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "var(--muted-foreground)", textAlign: "center", marginBottom: 24 }}>
          {crystal.keywords.join(" · ")}
        </p>

        <div style={{ height: 1, background: "var(--divider)", marginBottom: 20 }} />

        {/* Planetary ruler */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-inter)", fontWeight: 700, marginBottom: 8 }}>
            Planetary Ruler
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlanetIcon planet={crystal.planet} size={20} color="var(--primary)" />
            </div>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 600, color: "var(--foreground)" }}>
              {crystal.planet} · {crystal.day}
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--divider)", marginBottom: 20 }} />

        {/* Properties */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-inter)", fontWeight: 700, marginBottom: 8 }}>
            Properties
          </p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.7, color: "var(--foreground)" }}>
            {crystal.properties}
          </p>
        </div>

        {/* How to use */}
        <div style={{ background: "var(--card)", borderRadius: 12, overflow: "hidden", marginBottom: 20, border: "0.5px solid var(--border)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-inter)", fontWeight: 700, padding: "12px 16px 0" }}>
            How to Use
          </p>
          {[
            { label: "CARRY", text: crystal.howToUse.carry },
            { label: "PLACE", text: crystal.howToUse.place },
            { label: "MEDITATE", text: crystal.howToUse.meditate },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ padding: "12px 16px", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
              <p style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--primary)", fontFamily: "var(--font-inter)", fontWeight: 700, marginBottom: 4 }}>
                {row.label}
              </p>
              <p style={{ fontSize: 14, color: "var(--foreground)", fontFamily: "var(--font-inter)", lineHeight: 1.5 }}>
                {row.text}
              </p>
            </div>
          ))}
        </div>

        {/* Best moon phases */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-inter)", fontWeight: 700, marginBottom: 10 }}>
            Best Moon Phases
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {crystal.bestMoonPhases.map((phase) => (
              <span key={phase} style={{ padding: "4px 12px", borderRadius: 20, border: "1px solid var(--border)", fontSize: 12, color: "var(--foreground)", fontFamily: "var(--font-inter)" }}>
                {phase}
              </span>
            ))}
          </div>
        </div>

        {/* Kalyra says */}
        <div style={{ background: "rgba(201,168,76,0.08)", borderLeft: "3px solid var(--primary)", borderRadius: "0 10px 10px 0", padding: "14px 16px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--primary)", fontFamily: "var(--font-inter)", fontWeight: 700, marginBottom: 8 }}>
            Kalyra says
          </p>
          <p className="kalyra-voice" style={{ fontSize: 16, lineHeight: 1.6, color: "var(--foreground)" }}>
            &ldquo;{crystal.kalyraQuote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Article Detail View ──────────────────────────────────────────────────────

function ArticleDetailView({ article, moonPhase, onClose }: { article: Article; moonPhase: string; onClose: () => void }) {
  const categoryLabel: Record<TopicId, string> = {
    moon: "Moon Phases", planets: "Planets & Days",
    glamour: "Glamour Magic", chakra: "Sacral Chakra",
    rituals: "Rituals", crystals: "Crystals",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--background)", zIndex: 50, overflowY: "auto" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>
        {/* Back */}
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--primary)", fontFamily: "var(--font-inter)", fontSize: 14, marginBottom: 24, padding: 0 }}>
          ← Back
        </button>

        {/* Tag + read time */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: article.topicColor, fontFamily: "var(--font-inter)", fontWeight: 700 }}>
            {categoryLabel[article.category]}
          </span>
          <span style={{ color: "var(--muted-foreground)", fontSize: 10 }}>·</span>
          <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-inter)" }}>
            {article.readTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 26, fontWeight: 400, lineHeight: 1.25, color: "var(--foreground)", margin: "12px 0 20px" }}>
          {article.title}
        </h1>

        <div style={{ height: 1, background: "var(--divider)", marginBottom: 16 }} />

        {/* Context */}
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-inter)", marginBottom: 16 }}>
          {moonPhase} · Kalyra's guide
        </p>

        <div style={{ height: 1, background: "var(--divider)", marginBottom: 20 }} />

        {/* Kalyra intro */}
        <div style={{ background: "rgba(201,168,76,0.08)", borderLeft: "3px solid var(--primary)", borderRadius: "0 10px 10px 0", padding: "14px 16px", margin: "0 0 24px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--primary)", fontFamily: "var(--font-inter)", fontWeight: 700, marginBottom: 8 }}>
            Kalyra says
          </p>
          <p className="kalyra-voice" style={{ fontSize: 16, lineHeight: 1.6, color: "var(--foreground)" }}>
            &ldquo;{article.kalyraIntro}&rdquo;
          </p>
        </div>

        {/* Body */}
        {article.body.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontFamily: "var(--font-inter)", fontSize: 15, lineHeight: 1.75, color: "var(--foreground)", marginBottom: 16 }}>
            {para}
          </p>
        ))}

        {/* Key takeaways */}
        <div style={{ background: "var(--card)", borderRadius: 12, padding: 16, margin: "24px 0", border: "0.5px solid var(--border)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-foreground)", fontFamily: "var(--font-inter)", fontWeight: 700, marginBottom: 12 }}>
            Key Takeaways
          </p>
          {article.keyTakeaways.map((item, i) => (
            <div key={i} style={{ paddingLeft: 16, paddingBottom: 6, position: "relative" }}>
              <span style={{ position: "absolute", left: 4, color: "var(--primary)", fontSize: 16 }}>·</span>
              <p style={{ fontSize: 14, color: "var(--foreground)", lineHeight: 1.6, fontFamily: "var(--font-inter)" }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Ask Kalyra ───────────────────────────────────────────────────────────────

function AskKalyra({ moonPhase }: { moonPhase: string }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const example = getDailyQuestion(moonPhase);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setAnswer(`The question you're asking — "${question}" — is one that arrives at the right moment. The moon is in ${moonPhase}, which means the energy right now supports reflection more than action. Whatever answer comes, let it come quietly. Don't force clarity. Sit with the question a little longer, and notice what surfaces when you stop trying to solve it.`);
    setLoading(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full text-left" style={{
        border: "1.5px dashed rgba(201,168,76,0.35)", borderRadius: 12,
        padding: 16, margin: "4px 0 16px", background: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ color: "var(--primary)", fontSize: 16 }}>◐</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-inter)" }}>Ask Kalyra</span>
        </div>
        <p className="kalyra-voice" style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.5 }}>
          &ldquo;{example}&rdquo;
        </p>
        <span style={{ fontSize: 12, color: "var(--primary)", float: "right", marginTop: 8, fontFamily: "var(--font-inter)" }}>↗</span>
      </button>
    );
  }

  return (
    <div style={{ border: "1.5px dashed rgba(201,168,76,0.35)", borderRadius: 12, padding: 16, margin: "4px 0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--primary)", fontSize: 16 }}>◐</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-inter)" }}>Ask Kalyra</span>
        </div>
        <button onClick={() => { setOpen(false); setAnswer(""); setQuestion(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: 18 }}>×</button>
      </div>

      {!answer ? (
        <>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={example}
            rows={3}
            style={{
              width: "100%", borderRadius: 10, border: "1px solid var(--border)",
              background: "var(--card)", color: "var(--foreground)",
              fontFamily: "var(--font-cormorant), serif", fontStyle: "italic",
              fontSize: 15, padding: "10px 12px", resize: "none",
              lineHeight: 1.5, boxSizing: "border-box", marginBottom: 10,
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!question.trim() || loading}
            style={{
              width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
              background: question.trim() ? "var(--primary)" : "var(--secondary)",
              color: question.trim() ? "var(--primary-foreground)" : "var(--muted-foreground)",
              fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: 13,
              cursor: question.trim() ? "pointer" : "not-allowed",
              letterSpacing: "0.04em",
            }}
          >
            {loading ? "Kalyra is thinking..." : "Ask ✦"}
          </button>
        </>
      ) : (
        <div>
          <p className="kalyra-voice" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--foreground)", marginBottom: 14 }}>
            {answer}
          </p>
          <button onClick={() => { setAnswer(""); setQuestion(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontFamily: "var(--font-inter)", fontSize: 12, padding: 0 }}>
            Ask another question →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Topic Articles View (overlay) ───────────────────────────────────────────

function TopicArticlesView({ topic, articles, onSelectArticle, onClose }: {
  topic: Topic;
  articles: Article[];
  onSelectArticle: (a: Article) => void;
  onClose: () => void;
}) {
  const topicArticles = articles.filter((a) => a.category === topic.id);
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--background)", zIndex: 50, overflowY: "auto" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--primary)", fontFamily: "var(--font-inter)", fontSize: 14, marginBottom: 20, padding: 0 }}>
          ← Back
        </button>

        {/* Topic header */}
        <div style={{ height: 80, borderRadius: 14, background: topic.gradient, display: "flex", alignItems: "center", padding: "0 20px", marginBottom: 20, gap: 14 }}>
          <TopicIconSvg icon={topic.icon} size={24} />
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 20, color: "#FFFFFF", fontWeight: 400, margin: 0 }}>{topic.name}</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)", margin: 0 }}>{topic.description}</p>
          </div>
        </div>

        {topicArticles.length > 0 ? topicArticles.map((a) => (
          <ArticleRow key={a.id} article={a} onTap={() => onSelectArticle(a)} />
        )) : (
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: 16, color: "var(--muted-foreground)", textAlign: "center", marginTop: 40 }}>
            More articles coming soon.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── LearnTab ─────────────────────────────────────────────────────────────────

export function LearnTab({ colorMode = "night" }: { colorMode?: "dawn" | "day" | "dusk" | "night" }) {
  const [moonPhase, setMoonPhase]       = useState("Waning Gibbous");
  const [moonSign, setMoonSign]         = useState("Scorpio");
  const [dayRuler, setDayRuler]         = useState("Mercury");

  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedTopic, setSelectedTopic]     = useState<Topic | null>(null);

  useEffect(() => {
    const astro = getDailyAstrology();
    setMoonPhase(astro.moonPhase);
    setMoonSign(astro.moonSign);
    setDayRuler(astro.dayRuler);
  }, []);

  const featured    = getFeaturedArticle(moonPhase, dayRuler);
  const recentArticles = getRecentlyAdded();

  // If a detail view is open, render it
  if (selectedCrystal) return <CrystalDetailView crystal={selectedCrystal} onClose={() => setSelectedCrystal(null)} />;
  if (selectedArticle) return <ArticleDetailView article={selectedArticle} moonPhase={moonPhase} onClose={() => setSelectedArticle(null)} />;
  if (selectedTopic)   return <TopicArticlesView topic={selectedTopic} articles={ARTICLES} onSelectArticle={(a) => { setSelectedTopic(null); setSelectedArticle(a); }} onClose={() => setSelectedTopic(null)} />;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">

      {/* ── Section Header ────────────────────── */}
      <div className="mb-5">
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem, 8vw, 2.2rem)", fontWeight: 300, color: "var(--foreground)", marginBottom: 2 }}>
          Learn
        </h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "var(--muted-foreground)" }}>
          {moonPhase} in {moonSign}
        </p>
      </div>

      {/* ── Featured Today ────────────────────── */}
      <div className="mb-5">
        <SectionHeader label="Featured Today" />
        <FeaturedCard
          article={featured}
          moonPhase={moonPhase}
          moonSign={moonSign}
          onTap={() => setSelectedArticle(featured)}
        />
      </div>

      {/* ── Crystal Library ───────────────────── */}
      <div className="mb-5">
        <SectionHeader label="Crystal Library" />
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {CRYSTALS.map((c) => (
            <CrystalCardSmall key={c.id} crystal={c} onTap={() => setSelectedCrystal(c)} />
          ))}
        </div>
      </div>

      {/* ── Explore Topics ────────────────────── */}
      <div className="mb-5">
        <SectionHeader label="Explore Topics" />
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {TOPICS.map((t) => (
            <TopicCard key={t.id} topic={t} onTap={() => setSelectedTopic(t)} />
          ))}
        </div>
      </div>

      {/* ── Recently Added ────────────────────── */}
      <div className="mb-5">
        <SectionHeader label="Recently Added" />
        {recentArticles.map((a) => (
          <ArticleRow key={a.id} article={a} onTap={() => setSelectedArticle(a)} />
        ))}
      </div>

      {/* ── Ask Kalyra ────────────────────────── */}
      <AskKalyra moonPhase={moonPhase} />

      <div className="h-4" />
    </div>
  );
}
