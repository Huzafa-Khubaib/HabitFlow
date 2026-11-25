# PRD: HabitFlow - Habit Tracker App

## Goal
Simple React Native (Expo + TypeScript) habit tracker for Google Play, monetized with AdMob. Fully offline, no backend, no paid services.

## Tech Stack
- Expo (managed + development build), TypeScript
- React Navigation (stack + bottom tabs)
- AsyncStorage for all data
- react-native-google-mobile-ads (AdMob)
- expo-notifications (habit reminders)
- react-native-svg / react-native-chart-kit (stats charts)
- react-native-calendars (habit calendar)

## Screens
Splash, Onboarding (3), Choose Goals, Name Setup, Home, Add Habit, Edit Habit, Habit Detail, Stats, Reminders, Profile, Achievements, Settings, Privacy Policy, About, Remove Ads, Celebration.

## Core Logic
- Habit: id, name, icon, color, frequency, reminderTime, createdAt, completedDates[]
- Streak calculation (current + best)
- Daily progress percentage
- Achievements unlock automatically (7 day, 30 day, first habit, 100 check-ins)
- Dark/light theme with context

## Ads
- Banner on Home and Stats
- Interstitial after saving a habit (max once every 3 minutes)
- Test IDs in /src/config/ads.ts
- Remove Ads screen: UI only for now (billing placeholder)

## Structure
/src/screens, /components, /navigation, /store, /utils, /theme, /config
