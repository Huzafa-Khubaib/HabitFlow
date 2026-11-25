/**
 * Central AdMob unit IDs.
 *
 * In __DEV__: uses Google TestIds from react-native-google-mobile-ads.
 * In production builds: replace REPLACE_WITH_REAL_ID values below, then rebuild.
 *
 * Also keep app.json plugin androidAppId / iosAppId in sync with your AdMob App IDs.
 */

import { Platform } from 'react-native';

type AdSlot = 'appOpen' | 'banner' | 'interstitial' | 'rewarded' | 'native';

/** Production placeholders — replace before Play Store release */
const PRODUCTION_IDS: Record<AdSlot, { android: string; ios: string }> = {
  appOpen: {
    android: 'REPLACE_WITH_REAL_ID',
    ios: 'REPLACE_WITH_REAL_ID',
  },
  banner: {
    android: 'REPLACE_WITH_REAL_ID',
    ios: 'REPLACE_WITH_REAL_ID',
  },
  interstitial: {
    android: 'REPLACE_WITH_REAL_ID',
    ios: 'REPLACE_WITH_REAL_ID',
  },
  rewarded: {
    android: 'REPLACE_WITH_REAL_ID',
    ios: 'REPLACE_WITH_REAL_ID',
  },
  native: {
    android: 'REPLACE_WITH_REAL_ID',
    ios: 'REPLACE_WITH_REAL_ID',
  },
};

function platformId(slot: AdSlot): string {
  const ids = PRODUCTION_IDS[slot];
  return Platform.OS === 'ios' ? ids.ios : ids.android;
}

function resolveUnitId(slot: AdSlot, testId: string): string {
  if (__DEV__) return testId;
  return platformId(slot);
}

/**
 * Google sample TestIds (hardcoded — never require the native package here).
 * Requiring react-native-google-mobile-ads in Expo Go crashes TurboModuleRegistry.
 */
const GOOGLE_TEST_IDS: Record<string, string> = {
  APP_OPEN: 'ca-app-pub-3940256099942544/9257395921',
  ADAPTIVE_BANNER: 'ca-app-pub-3940256099942544/9214589741',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  NATIVE: 'ca-app-pub-3940256099942544/2247696110',
};

function getTestIds(): Record<string, string> {
  return GOOGLE_TEST_IDS;
}

export const AD_UNIT_IDS = {
  get appOpen() {
    return resolveUnitId('appOpen', getTestIds().APP_OPEN);
  },
  get banner() {
    return resolveUnitId(
      'banner',
      getTestIds().ADAPTIVE_BANNER || getTestIds().BANNER,
    );
  },
  get interstitial() {
    return resolveUnitId('interstitial', getTestIds().INTERSTITIAL);
  },
  get rewarded() {
    return resolveUnitId('rewarded', getTestIds().REWARDED);
  },
  get native() {
    return resolveUnitId('native', getTestIds().NATIVE);
  },
};

/** Timing rules (ms) */
export const AD_RULES = {
  interstitialCooldownMs: 3 * 60 * 1000,
  interstitialEveryNthAction: 2,
  appOpenMinBackgroundMs: 4 * 60 * 60 * 1000,
  fullscreenGapMs: 30 * 1000,
  rewardedRemoveAdsMs: 24 * 60 * 60 * 1000,
};

/**
 * HOW TO SWITCH TO REAL IDs (before release):
 * 1. Replace every REPLACE_WITH_REAL_ID in PRODUCTION_IDS above
 * 2. Update app.json → plugins → react-native-google-mobile-ads androidAppId / iosAppId
 * 3. Ship a production build (not __DEV__) so TestIds are not used
 * 4. Rebuild: npx expo prebuild --clean && npx expo run:android
 */
export const PRODUCTION_AD_IDS = PRODUCTION_IDS;
