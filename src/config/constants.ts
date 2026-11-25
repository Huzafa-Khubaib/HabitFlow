export const STORAGE_KEYS = {
  habits: '@habitflow/habits',
  profile: '@habitflow/profile',
  achievements: '@habitflow/achievements',
  lastInterstitial: '@habitflow/lastInterstitial',
} as const;

export const HABIT_ICONS = [
  'fitness',
  'water',
  'book',
  'body',
  'laptop-outline',
  'nutrition',
  'moon',
  'color-palette',
  'musical-notes',
  'medkit',
  'create',
  'leaf',
  'sunny',
  'bicycle',
  'walk',
  'cafe',
  'heart',
  'flame',
  'alarm',
  'bed',
] as const;

export const GOAL_OPTIONS = [
  { id: 'health', label: 'Health', desc: 'Hydration & diet', icon: 'heart', count: 14 },
  { id: 'fitness', label: 'Fitness', desc: 'Move every day', icon: 'fitness', count: 12 },
  { id: 'study', label: 'Study', desc: 'Focus & learning', icon: 'book', count: 9 },
  { id: 'mindfulness', label: 'Mindfulness', desc: 'Calm & breath', icon: 'leaf', count: 8 },
  { id: 'work', label: 'Work', desc: 'Deep focus blocks', icon: 'briefcase', count: 11 },
  { id: 'finance', label: 'Finance', desc: 'Save & budget', icon: 'wallet', count: 6 },
  { id: 'sleep', label: 'Sleep', desc: 'Rest routines', icon: 'moon', count: 7 },
  { id: 'hobbies', label: 'Hobbies', desc: 'Creative play', icon: 'color-palette', count: 10 },
] as const;

export const FREQUENCY_OPTIONS = [
  { value: 'daily' as const, label: 'Daily' },
  { value: 'weekdays' as const, label: 'Weekly' },
  { value: 'custom' as const, label: 'Custom Days' },
];

export const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const WEEKDAY_VALUES = [1, 2, 3, 4, 5, 6, 0]; // Mon→Sun mapping for custom
