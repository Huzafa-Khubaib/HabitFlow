import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { showAppOpenIfReady } from '../ads/AdManager';
import { images } from '../assets/images';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { ready, profile } = useHabits();
  const { colors, typography } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.35, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity, scale, pulse]);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      if (!profile.onboardingComplete) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('MainTabs');
        // After splash finishes (not first launch — AdManager enforces rules)
        setTimeout(() => {
          showAppOpenIfReady().catch(() => undefined);
        }, 600);
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [ready, profile.onboardingComplete, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Ambient glow spheres — Stitch splash */}
      <View style={[styles.glowTL, { backgroundColor: colors.primaryLight }]} />
      <View style={[styles.glowBR, { backgroundColor: colors.secondaryContainer }]} />
      <View style={[styles.glowCenter, { backgroundColor: colors.primary }]} />

      <Animated.View
        style={[styles.center, { opacity, transform: [{ scale }] }]}
      >
        <View style={styles.emblemWrap}>
          {/* Diffused aura */}
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.aura}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={[styles.iconCard, shadows.fab, { backgroundColor: colors.surface }]}>
            <Image source={images.appIcon} style={styles.iconImg} resizeMode="cover" />
          </View>
          {/* Amber playful badge — Stitch */}
          <View style={[styles.sparkBadge, { backgroundColor: '#FFDEA7' }]}>
            <Ionicons name="arrow-back" size={12} color="#271900" />
          </View>
        </View>

        <Text style={[typography.display, { color: colors.text, marginTop: 32 }]}>
          HabitFlow
        </Text>
        <Text
          style={[
            typography.body,
            {
              color: colors.textSecondary,
              marginTop: 8,
              textAlign: 'center',
              maxWidth: 260,
            },
          ]}
        >
          Build habits that stick.
        </Text>

        <View
          style={[
            styles.readyPill,
            shadows.soft,
            { backgroundColor: colors.surface, marginTop: 24 },
          ]}
        >
          <View style={[styles.readyDot, { backgroundColor: colors.secondary }]} />
          <Text style={[typography.labelMd, { color: colors.textSecondary }]}>
            Ready for day 1
          </Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={[styles.dotsPill, { backgroundColor: colors.surfaceLow }]}>
          <Animated.View
            style={[styles.dotSm, { backgroundColor: colors.primary, opacity: pulse }]}
          />
          <View style={[styles.dotSm, { backgroundColor: colors.primary }]} />
          <Animated.View
            style={[styles.dotSm, { backgroundColor: colors.primary, opacity: pulse }]}
          />
        </View>
        <Text
          style={[
            typography.labelSm,
            {
              color: colors.textMuted,
              marginTop: 14,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            },
          ]}
        >
          Version 1.0.4 • Mindful Rituals
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glowTL: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.28,
  },
  glowBR: {
    position: 'absolute',
    bottom: -90,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.35,
  },
  glowCenter: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.06,
  },
  center: { alignItems: 'center', zIndex: 2 },
  emblemWrap: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aura: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 36,
    opacity: 0.35,
  },
  iconCard: {
    width: 96,
    height: 96,
    borderRadius: 28,
    padding: 8,
    overflow: 'hidden',
  },
  iconImg: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  sparkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 8,
  },
  readyDot: { width: 8, height: 8, borderRadius: 4 },
  footer: { position: 'absolute', bottom: 48, alignItems: 'center' },
  dotsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  dotSm: { width: 6, height: 6, borderRadius: 3 },
});
