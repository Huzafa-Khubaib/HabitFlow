# HabitFlow AdMob — Test & Production Guide

Ads require a **development / production native build**. They do **not** work in Expo Go.

## Dev build commands

```bash
cd /Users/huzaifa/HabitFlow
npx expo prebuild
npx expo run:android
```

Then start Metro if needed:

```bash
npx expo start --dev-client
```

## Test checklist (real Android device + test IDs)

1. Install the app via `npx expo run:android` (not Expo Go).
2. Cold start → splash → home. **First ever launch:** no App Open ad.
3. Kill app, reopen → after splash, App Open **may** show (test ID).
4. Background app for a few seconds → foreground: App Open should **not** show (< 4h).
5. Home & Stats: adaptive **banner** visible above bottom tabs (if ads not removed).
6. Onboarding / Splash / Add Habit / Celebration: **no** banner.
7. Save a habit once → interstitial usually **skipped** (every 2nd action).
8. Save a habit again → interstitial **may** show if 3+ minutes since last one.
9. Immediately try another full-screen ad → blocked for **30 seconds**.
10. Remove Ads → “Watch ad to remove ads for 24 hours” → complete rewarded → banners/interstitials gone for 24h.
11. Toggle “Restore ads (testing)” → ads return.
12. Force airplane mode → app must not crash when ads fail.

## Where to put real AdMob IDs

### 1) App IDs — `app.json` (lines with the ads plugin)

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-XXXXXXXX~YYYYYYYY",
    "iosAppId": "ca-app-pub-XXXXXXXX~YYYYYYYY"
  }
]
```

### 2) Ad unit IDs — `src/config/ads.ts` → `PRODUCTION_IDS`

Replace every `REPLACE_WITH_REAL_ID` for:

- `appOpen.android` / `appOpen.ios`
- `banner.android` / `banner.ios`
- `interstitial.android` / `interstitial.ios`
- `rewarded.android` / `rewarded.ios`
- `native.android` / `native.ios` (optional)

## Switch test → production safely

1. Fill `PRODUCTION_IDS` + `app.json` App IDs with **real** units (never ship test App IDs).
2. Confirm `__DEV__` is false in release builds (Expo/EAS production does this).
3. In `__DEV__`, code still uses `TestIds` automatically — good for local testing.
4. Rebuild native binary after changing App IDs:

```bash
npx expo prebuild --clean
npx expo run:android
# or
eas build -p android --profile production
```

5. In AdMob console, add your test device if you need live units without invalid traffic.
6. Complete Play Console **Ads / Data safety** declarations before release.
