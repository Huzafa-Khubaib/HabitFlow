# HabitFlow — EAS Build & Play Store Guide

## 1. Run on your phone (development)

AdMob and some native modules **do not work in Expo Go**. Use a development build:

```bash
cd HabitFlow
npx expo start
```

### Option A — Expo Go (UI only, ads may no-op)
1. Install **Expo Go** from Play Store / App Store
2. Scan the QR code from `npx expo start`
3. Habit CRUD, streaks, theme, and navigation work offline

### Option B — Development build (full AdMob + notifications)
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile development
```
Install the APK on your phone, then:
```bash
npx expo start --dev-client
```

---

## 2. Real AdMob IDs

1. Create an app at https://apps.admob.google.com
2. Create **Banner** and **Interstitial** ad units (Android)
3. Edit `src/config/ads.ts`:

```ts
export const ADMOB_APP_IDS = {
  android: 'ca-app-pub-XXXXXXXX~YYYYYYYY',
  ios: 'ca-app-pub-XXXXXXXX~YYYYYYYY',
};

export const AD_UNIT_IDS = {
  banner: {
    android: 'ca-app-pub-XXXXXXXX/BBBBBBBB',
    ios: 'ca-app-pub-XXXXXXXX/BBBBBBBB',
  },
  interstitial: {
    android: 'ca-app-pub-XXXXXXXX/IIIIIIII',
    ios: 'ca-app-pub-XXXXXXXX/IIIIIIII',
  },
};
```

4. Update `app.json` plugin:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-XXXXXXXX~YYYYYYYY",
    "iosAppId": "ca-app-pub-XXXXXXXX~YYYYYYYY"
  }
]
```

5. Rebuild with EAS — AdMob IDs are baked into the native binary.

---

## 3. Production AAB (Play Store)

```bash
# One-time
eas login
eas build:configure

# Update extra.eas.projectId in app.json after configure

# Production Android App Bundle
eas build -p android --profile production
```

Download the `.aab` from the EAS dashboard when the build finishes.

Optional submit:
```bash
eas submit -p android --profile production --latest
```

---

## 4. Play Console checklist

1. Create app in [Google Play Console](https://play.google.com/console)
2. Complete **Store listing**: title (HabitFlow), short/full description, screenshots (phone), icon 512×512, feature graphic 1024×500
3. **Content rating** questionnaire
4. **Target audience** / Data safety form:
   - Data stored on device
   - AdMob collects advertising ID (declare)
5. **Privacy policy** URL (host the text from Privacy Policy screen)
6. Upload AAB under **Production** or **Internal testing** first
7. Set countries, pricing (free), and review

### Suggested store description
> HabitFlow helps you build lasting routines with streaks, reminders, and achievements — fully offline. Track habits, celebrate wins, and stay consistent without an account.

---

## 5. Icons & splash

Replace files in `/assets`:
- `icon.png` (1024×1024)
- `splash-icon.png`
- `android-icon-foreground.png` / `background.png` / `monochrome.png`

Splash background is `#0D9488` in `app.json`.

---

## 6. Version bumps

Before each release, bump in `app.json`:
- `version` (user-facing, e.g. `1.0.1`)
- `android.versionCode` (integer, must increase every upload)
