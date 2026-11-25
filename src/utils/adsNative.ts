import { TurboModuleRegistry } from 'react-native';
import Constants from 'expo-constants';

/** True when running inside Expo Go (no custom native modules). */
export function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

function hasGoogleMobileAdsNativeModule(): boolean {
  try {
    return TurboModuleRegistry.get('RNGoogleMobileAdsModule') != null;
  } catch {
    return false;
  }
}

/**
 * Lazily load react-native-google-mobile-ads only when the native module exists.
 * Skipping the require avoids TurboModuleRegistry.getEnforcing crashes in Expo Go.
 */
export function loadGoogleMobileAds(): typeof import('react-native-google-mobile-ads') | null {
  if (isExpoGo() || !hasGoogleMobileAdsNativeModule()) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-google-mobile-ads');
  } catch {
    return null;
  }
}
