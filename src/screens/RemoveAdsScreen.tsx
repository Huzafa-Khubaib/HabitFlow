import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  areAdsRemoved,
  getAdsRemovedUntil,
  setAdsRemovedForMs,
  setAdsRemovedPermanent,
  showRewarded,
} from '../ads/AdManager';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { AD_RULES } from '../config/ads';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RemoveAds'>;

export function RemoveAdsScreen({ navigation }: Props) {
  const { updateProfile } = useHabits();
  const { colors, typography, spacing, radius } = useTheme();
  const [removed, setRemoved] = useState(false);
  const [until, setUntil] = useState<number | null>(null);
  const [loadingReward, setLoadingReward] = useState(false);

  const refresh = useCallback(async () => {
    setRemoved(await areAdsRemoved());
    setUntil(await getAdsRemovedUntil());
  }, []);

  useEffect(() => {
    refresh().catch(() => undefined);
  }, [refresh]);

  const purchase = () => {
    Alert.alert(
      'Coming soon',
      'Play Billing will be connected before release. Simulate permanent unlock?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate unlock',
          onPress: async () => {
            await setAdsRemovedPermanent(true);
            await updateProfile({ adsRemoved: true });
            await refresh();
          },
        },
      ],
    );
  };

  const watchRewarded = async () => {
    setLoadingReward(true);
    try {
      const ok = await showRewarded(async () => {
        await setAdsRemovedForMs(AD_RULES.rewardedRemoveAdsMs);
        await updateProfile({ adsRemoved: true });
      });
      await refresh();
      if (!ok) {
        Alert.alert(
          'Ad not ready',
          'The rewarded ad is still loading. Try again in a moment (dev build required).',
        );
      } else {
        Alert.alert('Ads paused', 'Ads are hidden for the next 24 hours. Thanks!');
      }
    } finally {
      setLoadingReward(false);
    }
  };

  const expiryLabel =
    until && until > Date.now()
      ? `Ads hidden until ${new Date(until).toLocaleString()}`
      : removed
        ? 'Ads permanently removed'
        : null;

  return (
    <Screen style={{ paddingHorizontal: spacing.margin }}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text }]}>Remove Ads</Text>
        <View style={{ width: 22 }} />
      </View>

      <View
        style={[
          styles.hero,
          { backgroundColor: colors.primaryMuted, borderRadius: radius.xl, marginTop: 24 },
        ]}
      >
        <Ionicons name="sparkles" size={40} color={colors.primary} />
      </View>

      <Text style={[typography.h1, { color: colors.text, marginTop: 20, textAlign: 'center' }]}>
        {removed ? 'Ads removed' : 'Go ad-free'}
      </Text>
      <Text
        style={[
          typography.body,
          { color: colors.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 24 },
        ]}
      >
        {expiryLabel ||
          'Watch a short ad to hide banners and interstitials for 24 hours, or purchase a lifetime unlock.'}
      </Text>

      <View
        style={[
          styles.priceCard,
          shadows.card,
          { backgroundColor: colors.surface, borderRadius: radius.xl, marginTop: 28 },
        ]}
      >
        <Ionicons name="diamond" size={28} color={colors.primary} />
        <Text style={[typography.h2, { color: colors.text, marginTop: 12 }]}>HabitFlow Pro</Text>
        <Text style={[typography.display, { color: colors.primary, marginTop: 8 }]}>$2.99</Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
          One-time · lifetime unlock
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      {!removed ? (
        <>
          <Button
            title="Watch ad to remove ads for 24 hours"
            onPress={watchRewarded}
            loading={loadingReward}
            icon="play-circle"
            style={{ marginBottom: 12 }}
          />
          <Button title="Purchase" onPress={purchase} variant="secondary" style={{ marginBottom: spacing.xl }} />
        </>
      ) : (
        <Button
          title="Restore ads (testing)"
          variant="ghost"
          onPress={async () => {
            await setAdsRemovedPermanent(false);
            await setAdsRemovedForMs(0);
            await updateProfile({ adsRemoved: false });
            await refresh();
          }}
          style={{ marginBottom: spacing.xl }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  hero: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  priceCard: {
    alignItems: 'center',
    padding: 28,
  },
});
