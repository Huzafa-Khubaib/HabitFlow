import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';
import { getTotalCheckIns } from '../utils/streaks';

type Props = NativeStackScreenProps<RootStackParamList, 'Achievements'>;

const FILTERS = ['All', 'Streaks', 'Milestones', 'Consistency'] as const;

export function AchievementsScreen({ navigation }: Props) {
  const { achievements, habits } = useHabits();
  const { colors, typography, spacing, radius } = useTheme();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const unlocked = achievements.filter((a) => a.unlockedAt).length;
  const xp = getTotalCheckIns(habits) * 10;

  return (
    <Screen scroll style={{ paddingHorizontal: spacing.margin }}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text }]}>Achievements</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
      </View>

      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { borderRadius: radius.xl, marginTop: 16 }]}
      >
        <View style={styles.heroTop}>
          <View style={styles.levelPill}>
            <Ionicons name="star" size={12} color="#fff" />
            <Text style={[typography.labelSm, { color: '#fff', marginLeft: 4 }]}>
              LEVEL {Math.max(1, Math.floor(unlocked) + 1)} ALCHEMIST
            </Text>
          </View>
          <View style={styles.xpPill}>
            <Ionicons name="flash" size={12} color="#fff" />
            <Text style={[typography.labelMd, { color: '#fff', marginLeft: 4 }]}>
              {xp.toLocaleString()} XP
            </Text>
          </View>
        </View>
        <Text style={[typography.h1, { color: '#fff', marginTop: 16 }]}>
          Achievement Showcase
        </Text>
        <Text style={[typography.small, { color: 'rgba(255,255,255,0.8)', marginTop: 12 }]}>
          {unlocked} of {achievements.length} Unlocked
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${achievements.length ? (unlocked / achievements.length) * 100 : 0}%`,
                backgroundColor: colors.secondaryContainer,
              },
            ]}
          />
        </View>
      </LinearGradient>

      <ScrollFilters filter={filter} setFilter={setFilter} colors={colors} typography={typography} />

      <View style={styles.grid}>
        {achievements.map((a) => {
          const unlockedAt = a.unlockedAt;
          return (
            <View
              key={a.id}
              style={[
                styles.card,
                shadows.card,
                {
                  backgroundColor: unlockedAt ? colors.surface : colors.surfaceAlt,
                  borderRadius: radius.lg,
                  opacity: unlockedAt ? 1 : 0.85,
                },
              ]}
            >
              <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: unlockedAt ? colors.primaryMuted : colors.surfaceHigh,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Ionicons
                    name={(a.icon as any) || 'ribbon'}
                    size={28}
                    color={unlockedAt ? colors.primary : colors.textMuted}
                  />
                </View>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: unlockedAt ? colors.secondary : colors.textMuted,
                    },
                  ]}
                >
                  <Ionicons
                    name={unlockedAt ? 'checkmark' : 'lock-closed'}
                    size={10}
                    color="#fff"
                  />
                </View>
              </View>
              <Text style={[typography.bodyBold, { color: colors.text, marginTop: 12 }]}>
                {a.title}
              </Text>
              <Text style={[typography.small, { color: colors.textSecondary, marginTop: 4 }]}>
                {a.description}
              </Text>
              {unlockedAt ? (
                <View
                  style={[
                    styles.unlockedBtn,
                    { backgroundColor: colors.primarySoft, marginTop: 12 },
                  ]}
                >
                  <Text style={[typography.labelSm, { color: colors.primary }]}>
                    Unlocked {new Date(unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              ) : (
                <Text style={[typography.small, { color: colors.textMuted, marginTop: 12 }]}>
                  Keep going to unlock
                </Text>
              )}
            </View>
          );
        })}
      </View>

      <View
        style={[
          styles.tip,
          {
            backgroundColor: `${colors.secondary}22`,
            borderColor: colors.secondaryContainer,
            borderRadius: radius.lg,
            marginBottom: 32,
          },
        ]}
      >
        <Ionicons name="leaf" size={18} color={colors.secondaryDark} />
        <Text style={[typography.bodyMd, { color: colors.secondaryDark, marginLeft: 10, flex: 1 }]}>
          Keep logging rituals to unlock secret tier badges!
        </Text>
      </View>
    </Screen>
  );
}

function ScrollFilters({
  filter,
  setFilter,
  colors,
  typography,
}: {
  filter: string;
  setFilter: (f: any) => void;
  colors: any;
  typography: any;
}) {
  return (
    <View style={styles.filters}>
      {FILTERS.map((f) => (
        <Pressable
          key={f}
          onPress={() => setFilter(f)}
          style={[
            styles.filterChip,
            {
              backgroundColor: filter === f ? colors.primary : colors.surfaceAlt,
            },
          ]}
        >
          <Text
            style={[
              typography.labelMd,
              { color: filter === f ? '#fff' : colors.textSecondary },
            ]}
          >
            {f}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  hero: { padding: 20 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: 4 },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    padding: 14,
  },
  iconWrap: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginTop: 20,
  },
});
