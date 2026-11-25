export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  /** Custom weekday numbers 0=Sun … 6=Sat when frequency is custom */
  customDays?: number[];
  reminderTime: string | null; // "HH:mm"
  createdAt: string; // ISO
  completedDates: string[]; // "YYYY-MM-DD"
}

export interface UserProfile {
  name: string;
  goals: string[];
  onboardingComplete: boolean;
  themePreference: 'light' | 'dark' | 'system';
  adsRemoved: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export type AchievementId =
  | 'first_habit'
  | 'streak_7'
  | 'streak_30'
  | 'checkins_100';

export interface AppState {
  habits: Habit[];
  profile: UserProfile;
  achievements: Achievement[];
  lastInterstitialAt: number | null;
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  ChooseGoals: undefined;
  NameSetup: { goals: string[] };
  MainTabs: undefined;
  AddHabit: undefined;
  EditHabit: { habitId: string };
  HabitDetail: { habitId: string };
  Achievements: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
  About: undefined;
  RemoveAds: undefined;
  Celebration: { title: string; subtitle?: string; habitId?: string };
  Reminders: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  RemindersTab: undefined;
  Profile: undefined;
};
