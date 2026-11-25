# HabitFlow

Offline habit tracker built with Expo + TypeScript. Streaks, reminders, achievements, AdMob (test IDs), dark/light theme.

## Quick start

```bash
cd HabitFlow
npm install
npx expo start
```

See [PLAY_STORE.md](./PLAY_STORE.md) for device builds, AdMob, and Play Store publishing.

## Project structure

```
src/
  screens/      # All app screens
  components/   # Shared UI
  navigation/   # Stack + tabs
  store/        # HabitContext + AsyncStorage
  utils/        # Streaks, ads, notifications
  theme/        # Light/dark tokens + context
  config/       # Ads + constants
  types/        # Shared TypeScript types
```
