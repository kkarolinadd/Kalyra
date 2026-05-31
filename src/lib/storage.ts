import type { ZodiacSign } from "./astrology";

export interface UserProfile {
  name: string;
  birth_date: string; // YYYY-MM-DD
  birth_time?: string; // HH:MM
  birth_city?: string;
  sun_sign: ZodiacSign;
  moon_sign: ZodiacSign;
  rising_sign?: ZodiacSign;
}

export interface StreakData {
  current: number;
  longest: number;
  last_checkin: string; // YYYY-MM-DD
}

export type CheckinKey =
  | "morning"
  | "journal"
  | "mirror"
  | "crystal"
  | "wear"
  | "evening";

export interface StorageSchema {
  user_profile: UserProfile | null;
  daily_checkin: Record<string, CheckinKey[]>;
  streak_data: StreakData;
  preferences: {
    language: string;
    onboarding_complete: boolean;
    ai_ritual_used_today: string | null;
  };
}

const DEFAULT_STORAGE: StorageSchema = {
  user_profile: null,
  daily_checkin: {},
  streak_data: { current: 0, longest: 0, last_checkin: "" },
  preferences: {
    language: "en",
    onboarding_complete: false,
    ai_ritual_used_today: null,
  },
};

function getStorage(): StorageSchema {
  if (typeof window === "undefined") return DEFAULT_STORAGE;
  try {
    const raw = localStorage.getItem("kalyra");
    if (!raw) return { ...DEFAULT_STORAGE };
    return { ...DEFAULT_STORAGE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STORAGE };
  }
}

function setStorage(data: StorageSchema): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("kalyra", JSON.stringify(data));
}

export function getProfile(): UserProfile | null {
  return getStorage().user_profile;
}

export function saveProfile(profile: UserProfile): void {
  const s = getStorage();
  s.user_profile = profile;
  s.preferences.onboarding_complete = true;
  setStorage(s);
}

export function isOnboardingComplete(): boolean {
  return getStorage().preferences.onboarding_complete;
}

export function getTodayCheckins(): CheckinKey[] {
  const s = getStorage();
  const today = todayStr();
  return s.daily_checkin[today] ?? [];
}

export function toggleCheckin(key: CheckinKey): CheckinKey[] {
  const s = getStorage();
  const today = todayStr();
  const current = s.daily_checkin[today] ?? [];
  const updated = current.includes(key)
    ? current.filter((k) => k !== key)
    : [...current, key];
  s.daily_checkin[today] = updated;

  // Update streak
  if (updated.length > 0) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    if (s.streak_data.last_checkin === yesterdayStr) {
      s.streak_data.current += 1;
    } else if (s.streak_data.last_checkin !== today) {
      s.streak_data.current = 1;
    }
    s.streak_data.last_checkin = today;
    s.streak_data.longest = Math.max(
      s.streak_data.longest,
      s.streak_data.current
    );
  }

  setStorage(s);
  return updated;
}

export function getStreak(): StreakData {
  return getStorage().streak_data;
}

export function canUseAiRitual(): boolean {
  const s = getStorage();
  return s.preferences.ai_ritual_used_today !== todayStr();
}

export function markAiRitualUsed(): void {
  const s = getStorage();
  s.preferences.ai_ritual_used_today = todayStr();
  setStorage(s);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
