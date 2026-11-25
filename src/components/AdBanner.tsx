import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { areAdsRemoved } from '../ads/AdManager';
import { AD_UNIT_IDS } from '../config/ads';
import { loadGoogleMobileAds } from '../utils/adsNative';

/**
 * Adaptive banner for Home & Stats only.
 * Hides entirely when ads are removed, Expo Go, or load fails (no empty gap).
 */
export function AdBanner() {
  const [visible, setVisible] = useState(false);
  const [removed, setRemoved] = useState(true);
  const [Banner, setBanner] = useState<React.ComponentType<any> | null>(null);
  const [size, setSize] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const hide = await areAdsRemoved();
      if (!mounted) return;
      setRemoved(hide);
      if (hide) return;

      const ads = loadGoogleMobileAds();
      if (!mounted) return;
      if (!ads?.BannerAd || !ads.BannerAdSize) {
        setVisible(false);
        return;
      }

      setBanner(() => ads.BannerAd);
      setSize(ads.BannerAdSize.ANCHORED_ADAPTIVE_BANNER);
      setVisible(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onFail = useCallback(() => setVisible(false), []);

  if (removed || !visible || !Banner || !size) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <Banner
        unitId={AD_UNIT_IDS.banner}
        size={size}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => setVisible(true)}
        onAdFailedToLoad={onFail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 8,
    minHeight: 0,
  },
});
