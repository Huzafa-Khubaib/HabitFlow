/**
 * Single service for all AdMob full-screen + lifecycle ads.
 * Never throws — failures are swallowed so the app keeps running.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AD_RULES, AD_UNIT_IDS } from '../config/ads';
import { loadGoogleMobileAds } from '../utils/adsNative';

const KEYS = {
  adsRemovedPermanent: '@habitflow/ads/removedPermanent',
  adsRemovedUntil: '@habitflow/ads/removedUntil',
  lastInterstitial: '@habitflow/ads/lastInterstitial',
  lastFullscreen: '@habitflow/ads/lastFullscreen',
  lastAppOpen: '@habitflow/ads/lastAppOpen',
  interstitialActionCount: '@habitflow/ads/interstitialActionCount',
  hasLaunchedBefore: '@habitflow/ads/hasLaunchedBefore',
  lastBackgroundAt: '@habitflow/ads/lastBackgroundAt',
} as const;

type AdsModule = typeof import('react-native-google-mobile-ads');

let ads: AdsModule | null = null;
let initialized = false;
let initializing: Promise<boolean> | null = null;

let interstitial: any = null;
let interstitialLoaded = false;
let rewarded: any = null;
let rewardedLoaded = false;
let appOpen: any = null;
let appOpenLoaded = false;

let showingFullscreen = false;

function loadNative(): AdsModule | null {
  if (ads) return ads;
  ads = loadGoogleMobileAds();
  return ads;
}

async function getNumber(key: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

async function setNumber(key: string, value: number): Promise<void> {
  try {
    await AsyncStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

async function getBool(key: string): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(key)) === '1';
  } catch {
    return false;
  }
}

async function setBool(key: string, value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value ? '1' : '0');
  } catch {
    // ignore
  }
}

/** True if permanent remove OR temporary 24h unlock is active */
export async function areAdsRemoved(): Promise<boolean> {
  try {
    if (await getBool(KEYS.adsRemovedPermanent)) return true;
    const until = await getNumber(KEYS.adsRemovedUntil);
    if (until > Date.now()) return true;
    if (until > 0) {
      await AsyncStorage.removeItem(KEYS.adsRemovedUntil);
    }
    return false;
  } catch {
    return false;
  }
}

export async function setAdsRemovedPermanent(value: boolean): Promise<void> {
  await setBool(KEYS.adsRemovedPermanent, value);
  if (value) {
    await AsyncStorage.removeItem(KEYS.adsRemovedUntil);
  }
}

export async function setAdsRemovedForMs(durationMs: number): Promise<void> {
  if (durationMs <= 0) {
    try {
      await AsyncStorage.removeItem(KEYS.adsRemovedUntil);
    } catch {
      // ignore
    }
    return;
  }
  await setNumber(KEYS.adsRemovedUntil, Date.now() + durationMs);
}

export async function getAdsRemovedUntil(): Promise<number | null> {
  const until = await getNumber(KEYS.adsRemovedUntil);
  return until > Date.now() ? until : null;
}

async function markFullscreenShown(): Promise<void> {
  await setNumber(KEYS.lastFullscreen, Date.now());
}

async function canShowFullscreen(): Promise<boolean> {
  if (showingFullscreen) return false;
  if (await areAdsRemoved()) return false;
  const last = await getNumber(KEYS.lastFullscreen);
  if (last && Date.now() - last < AD_RULES.fullscreenGapMs) return false;
  return true;
}

function preloadInterstitial(): void {
  const mod = loadNative();
  if (!mod) return;
  try {
    interstitialLoaded = false;
    interstitial = mod.InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
      requestNonPersonalizedAdsOnly: true,
    });
    const unsubLoad = interstitial.addAdEventListener(mod.AdEventType.LOADED, () => {
      interstitialLoaded = true;
    });
    const unsubErr = interstitial.addAdEventListener(mod.AdEventType.ERROR, () => {
      interstitialLoaded = false;
      setTimeout(() => preloadInterstitial(), 15_000);
    });
    const unsubClose = interstitial.addAdEventListener(mod.AdEventType.CLOSED, () => {
      interstitialLoaded = false;
      unsubLoad();
      unsubErr();
      unsubClose();
      preloadInterstitial();
    });
    interstitial.load();
  } catch {
    interstitial = null;
    interstitialLoaded = false;
  }
}

function preloadRewarded(): void {
  const mod = loadNative();
  if (!mod) return;
  try {
    rewardedLoaded = false;
    rewarded = mod.RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded, {
      requestNonPersonalizedAdsOnly: true,
    });
    const unsubLoad = rewarded.addAdEventListener(mod.AdEventType.LOADED, () => {
      rewardedLoaded = true;
    });
    // Also listen for rewarded loaded via RewardedAdEventType
    const unsubRewardedLoad = rewarded.addAdEventListener(
      mod.RewardedAdEventType.LOADED,
      () => {
        rewardedLoaded = true;
      },
    );
    const unsubErr = rewarded.addAdEventListener(mod.AdEventType.ERROR, () => {
      rewardedLoaded = false;
      setTimeout(() => preloadRewarded(), 15_000);
    });
    const unsubClose = rewarded.addAdEventListener(mod.AdEventType.CLOSED, () => {
      rewardedLoaded = false;
      unsubLoad();
      unsubRewardedLoad();
      unsubErr();
      unsubClose();
      preloadRewarded();
    });
    rewarded.load();
  } catch {
    rewarded = null;
    rewardedLoaded = false;
  }
}

function preloadAppOpen(): void {
  const mod = loadNative();
  if (!mod) return;
  try {
    appOpenLoaded = false;
    appOpen = mod.AppOpenAd.createForAdRequest(AD_UNIT_IDS.appOpen, {
      requestNonPersonalizedAdsOnly: true,
    });
    const unsubLoad = appOpen.addAdEventListener(mod.AdEventType.LOADED, () => {
      appOpenLoaded = true;
    });
    const unsubErr = appOpen.addAdEventListener(mod.AdEventType.ERROR, () => {
      appOpenLoaded = false;
      setTimeout(() => preloadAppOpen(), 15_000);
    });
    const unsubClose = appOpen.addAdEventListener(mod.AdEventType.CLOSED, () => {
      appOpenLoaded = false;
      unsubLoad();
      unsubErr();
      unsubClose();
      preloadAppOpen();
    });
    appOpen.load();
  } catch {
    appOpen = null;
    appOpenLoaded = false;
  }
}

async function gatherConsent(): Promise<void> {
  const mod = loadNative();
  if (!mod?.AdsConsent) return;
  try {
    await mod.AdsConsent.gatherConsent();
  } catch {
    try {
      const info = await mod.AdsConsent.requestInfoUpdate();
      if (info.isConsentFormAvailable && info.status === mod.AdsConsentStatus.REQUIRED) {
        await mod.AdsConsent.showForm();
      }
    } catch {
      // continue without blocking ads in regions that don't require consent
    }
  }
}

/**
 * Consent (UMP) → initialize Mobile Ads SDK → preload full-screen units.
 * Safe to call multiple times.
 */
export async function initAds(): Promise<boolean> {
  if (initialized) return true;
  if (initializing) return initializing;

  initializing = (async () => {
    try {
      const mod = loadNative();
      if (!mod) return false;

      await gatherConsent();

      const mobileAds = mod.default;
      await mobileAds().initialize();

      if (!(await areAdsRemoved())) {
        preloadInterstitial();
        preloadRewarded();
        preloadAppOpen();
      }

      initialized = true;
      return true;
    } catch {
      return false;
    } finally {
      initializing = null;
    }
  })();

  return initializing;
}

/**
 * Interstitial after eligible actions (e.g. habit saved).
 * Rules: ads not removed, 3 min cooldown, every 2nd action, 30s gap from other FS ads.
 * Never blocks — returns false if not shown.
 */
export async function showInterstitialIfReady(): Promise<boolean> {
  try {
    await initAds();
    if (!(await canShowFullscreen())) return false;

    const count = (await getNumber(KEYS.interstitialActionCount)) + 1;
    await setNumber(KEYS.interstitialActionCount, count);
    if (count % AD_RULES.interstitialEveryNthAction !== 0) return false;

    const last = await getNumber(KEYS.lastInterstitial);
    if (last && Date.now() - last < AD_RULES.interstitialCooldownMs) return false;

    if (!interstitial || !interstitialLoaded) {
      preloadInterstitial();
      return false;
    }

    showingFullscreen = true;
    await interstitial.show();
    await setNumber(KEYS.lastInterstitial, Date.now());
    await markFullscreenShown();
    showingFullscreen = false;
    return true;
  } catch {
    showingFullscreen = false;
    interstitialLoaded = false;
    preloadInterstitial();
    return false;
  }
}

/**
 * App Open on cold start (after splash) or resume after 4+ hours background.
 * Skips first-ever launch and 30s fullscreen gap.
 */
export async function showAppOpenIfReady(): Promise<boolean> {
  try {
    await initAds();
    if (!(await canShowFullscreen())) return false;

    const launchedBefore = await getBool(KEYS.hasLaunchedBefore);
    if (!launchedBefore) {
      await setBool(KEYS.hasLaunchedBefore, true);
      return false;
    }

    // On resume: require 4h background. On cold path after splash, lastBackground may be 0 —
    // allow if lastAppOpen is stale / never shown this session via background check.
    const lastBg = await getNumber(KEYS.lastBackgroundAt);
    const awayLongEnough =
      lastBg === 0 || Date.now() - lastBg >= AD_RULES.appOpenMinBackgroundMs;

    // After splash on subsequent launches, lastBg is often 0 (process start). Treat as eligible.
    if (lastBg > 0 && !awayLongEnough) return false;

    if (!appOpen || !appOpenLoaded) {
      preloadAppOpen();
      return false;
    }

    showingFullscreen = true;
    await appOpen.show();
    await setNumber(KEYS.lastAppOpen, Date.now());
    await markFullscreenShown();
    // Clear background marker so we don't re-fire until next background
    await AsyncStorage.removeItem(KEYS.lastBackgroundAt);
    showingFullscreen = false;
    return true;
  } catch {
    showingFullscreen = false;
    appOpenLoaded = false;
    preloadAppOpen();
    return false;
  }
}

/** Call from AppState when app goes to background */
export async function markAppBackgrounded(): Promise<void> {
  await setNumber(KEYS.lastBackgroundAt, Date.now());
}

/**
 * Rewarded ad. Invokes onReward only when the user earns the reward.
 */
export async function showRewarded(
  onReward: () => void | Promise<void>,
): Promise<boolean> {
  try {
    await initAds();
    if (await areAdsRemoved()) {
      // Already removed — still allow reward callback for testing UX if desired; skip ad
      return false;
    }
    if (!(await canShowFullscreen())) return false;

    if (!rewarded || !rewardedLoaded) {
      preloadRewarded();
      return false;
    }

    const mod = loadNative();
    if (!mod) return false;

    let earned = false;
    const unsubEarned = rewarded.addAdEventListener(
      mod.RewardedAdEventType.EARNED_REWARD,
      () => {
        earned = true;
      },
    );

    showingFullscreen = true;
    await rewarded.show();
    unsubEarned();
    await markFullscreenShown();
    showingFullscreen = false;

    if (earned) {
      await onReward();
      return true;
    }
    return false;
  } catch {
    showingFullscreen = false;
    rewardedLoaded = false;
    preloadRewarded();
    return false;
  }
}

/** Convenience for UI — is rewarded currently loaded */
export function isRewardedReady(): boolean {
  return rewardedLoaded && !!rewarded;
}
