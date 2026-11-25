import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../assets/images';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';
import {
  getLongestCurrentStreak,
  getTotalCheckIns,
} from '../utils/streaks';

export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, habits, achievements } = useHabits();
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const unlocked = achievements.filter((a) => a.unlockedAt);
  const total = getTotalCheckIns(habits);
  const best = getLongestCurrentStreak(habits);
  const level = Math.max(1, Math.floor(total / 50) + 1);
  const xp = total % 50;
  const xpTarget = 50;

  const rows = [
    {
      icon: 'settings-outline' as const,
      color: colors.textSecondary,
      bg: colors.surfaceAlt,
      label: 'Settings',
      sub: 'App theme, reminders & sound',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'diamond-outline' as const,
      color: colors.accentDark,
      bg: colors.amberSoft,
      label: 'Manage Subscription',
      sub: 'Upgrade to HabitFlow Pro',
      badge: profile.adsRemoved ? 'Pro' : 'Free Plan',
      onPress: () => navigation.navigate('RemoveAds'),
    },
    {
      icon: 'document-text-outline' as const,
      color: colors.secondaryDark,
      bg: `${colors.secondary}22`,
      label: 'Privacy Policy',
      sub: 'How we handle your data',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      icon: 'information-circle-outline' as const,
      color: colors.primary,
      bg: colors.primaryMuted,
      label: 'About',
      sub: 'Version & credits',
      onPress: () => navigation.navigate('About'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.glass,
            borderBottomColor: colors.borderSoft,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="infinite" size={18} color="#fff" />
          </View>
          <Text style={[typography.h3, { color: colors.text }]}>Profile</Text>
        </View>
        <View style={[styles.avatarBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            {(profile.name || 'H').charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.margin, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.avatarRing}
          >
            <Image source={images.avatarProfile} style={styles.avatarInner} />
          </LinearGradient>
          <Text style={[typography.h2, { color: colors.text, marginTop: 12 }]}>
            {profile.name || 'HabitFlow user'}
          </Text>
          <Text style={[typography.caption, { color: colors.primary, marginTop: 2 }]}>
            @{((profile.name || 'user').toLowerCase().replace(/\s+/g, ''))}
          </Text>
          <View
            style={[
              styles.memberPill,
              { backgroundColor: colors.surfaceAlt, marginTop: 10 },
            ]}
          >
            <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
            <Text style={[typography.small, { color: colors.textSecondary, marginLeft: 4 }]}>
              Member since {new Date().getFullYear()}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {[
            { icon: 'layers-outline', label: 'Total Habits', value: `${habits.length} Active`, tint: colors.primary },
            { icon: 'flame', label: 'Best Streak', value: `${best} Days`, tint: colors.accentDark },
            { icon: 'checkmark-circle', label: 'Completions', value: `${total} Checks`, tint: colors.secondary },
            { icon: 'trophy', label: 'Rank Level', value: `Lvl ${level}`, tint: colors.primaryLight },
          ].map((s) => (
            <View
              key={s.label}
              style={[
                styles.statCard,
                shadows.soft,
                { backgroundColor: colors.surface, borderRadius: radius.lg },
              ]}
            >
              <Ionicons name={s.icon as any} size={18} color={s.tint} />
              <Text style={[typography.h3, { color: colors.text, marginTop: 8 }]}>{s.value}</Text>
              <Text style={[typography.small, { color: colors.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.xpCard,
            shadows.card,
            { backgroundColor: colors.surface, borderRadius: radius.lg, marginTop: 8 },
          ]}
        >
          <View style={styles.xpHead}>
            <Text style={[typography.bodyBold, { color: colors.text }]}>
              Next Goal · Level {level + 1}
            </Text>
            <Text style={[typography.labelMd, { color: colors.primary }]}>
              {xp * 8} / {xpTarget * 8} XP
            </Text>
          </View>
          <View style={[styles.xpTrack, { backgroundColor: colors.progressTrack }]}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: `${(xp / xpTarget) * 100}%`, height: 10, borderRadius: 5 }}
            />
          </View>
        </View>

        <View
          style={[
            styles.inspire,
            shadows.soft,
            { backgroundColor: colors.surface, borderRadius: radius.lg, marginTop: 16 },
          ]}
        >
          <Image source={images.tipJournal} style={styles.inspireImg} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[typography.bodyBold, { color: colors.text }]} numberOfLines={2}>
              Consistency turns small steps into lasting change.
            </Text>
            <Text style={[typography.small, { color: colors.textSecondary, marginTop: 4 }]}>
              Keep your momentum alive today.
            </Text>
          </View>
        </View>

        <View style={styles.achHead}>
          <Text style={[typography.h3, { color: colors.text }]}>Achievements</Text>
          <Pressable onPress={() => navigation.navigate('Achievements')}>
            <Text style={[typography.caption, { color: colors.primary }]}>View All ›</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {achievements.map((a) => (
            <View
              key={a.id}
              style={[
                styles.achCard,
                shadows.soft,
                {
                  backgroundColor: a.unlockedAt ? colors.surface : colors.surfaceAlt,
                  borderRadius: radius.lg,
                  opacity: a.unlockedAt ? 1 : 0.7,
                },
              ]}
            >
              <Ionicons
                name={(a.icon as any) || 'ribbon'}
                size={28}
                color={a.unlockedAt ? colors.primary : colors.textMuted}
              />
              <Text
                style={[typography.labelMd, { color: colors.text, marginTop: 8, textAlign: 'center' }]}
                numberOfLines={2}
              >
                {a.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ marginTop: 20 }}>
          {rows.map((row) => (
            <Pressable
              key={row.label}
              onPress={row.onPress}
              style={[
                styles.row,
                shadows.soft,
                { backgroundColor: colors.surface, borderRadius: radius.lg },
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: row.bg }]}>
                <Ionicons name={row.icon} size={18} color={row.color} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[typography.bodyBold, { color: colors.text }]}>{row.label}</Text>
                <Text style={[typography.small, { color: colors.textSecondary }]}>{row.sub}</Text>
              </View>
              {'badge' in row && row.badge ? (
                <View style={[styles.badge, { backgroundColor: colors.amberSoft }]}>
                  <Text style={[typography.labelSm, { color: colors.accentDark }]}>
                    {row.badge}
                  </Text>
                </View>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Text
          style={[
            typography.small,
            { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
          ]}
        >
          HabitFlow v1.0.0 · {unlocked.length} badges unlocked
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 24,
  },
  statCard: {
    width: '47%',
    padding: 14,
  },
  xpCard: { padding: 16 },
  xpHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  xpTrack: { height: 10, borderRadius: 5, overflow: 'hidden' },
  inspire: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  inspireImg: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  achHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  achCard: {
    width: 100,
    padding: 14,
    marginRight: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginRight: 6,
  },
});
