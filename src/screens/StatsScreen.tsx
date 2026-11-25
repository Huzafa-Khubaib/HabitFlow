import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AdBanner } from '../components/AdBanner';
import { EmptyState } from '../components/EmptyState';
import { ProgressRing } from '../components/ProgressRing';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';
import { lastNDateKeys } from '../utils/dates';
import {
  getCurrentStreak,
  getDailyProgress,
  getLongestCurrentStreak,
  getTotalCheckIns,
} from '../utils/streaks';

const RANGES = ['Week', 'Month', 'Year'] as const;

export function StatsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { habits, profile } = useHabits();
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<(typeof RANGES)[number]>('Week');
  const progress = getDailyProgress(habits);
  const total = getTotalCheckIns(habits);
  const bestStreak = getLongestCurrentStreak(habits);
  const width = Dimensions.get('window').width - spacing.margin * 2 - 16;

  const chart = useMemo(() => {
    const keys = lastNDateKeys(7);
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const data = keys.map((k) => {
      if (habits.length === 0) return 0;
      return Math.round(
        (habits.filter((h) => h.completedDates.includes(k)).length / habits.length) *
          100,
      );
    });
    return { labels, datasets: [{ data: data.some((n) => n > 0) ? data : [0, 0, 0, 0, 0, 0, 0] }] };
  }, [habits]);

  const topStreaks = [...habits]
    .sort((a, b) => getCurrentStreak(b) - getCurrentStreak(a))
    .slice(0, 4);

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
          <Text style={[typography.h3, { color: colors.text }]}>Stats</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          <View
            style={[
              styles.avatarBtn,
              { backgroundColor: colors.primary, marginLeft: 10 },
            ]}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {(profile.name || 'H').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: spacing.margin,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h1, { color: colors.text }]}>
              Statistics & Insights
            </Text>
            <Text style={[typography.bodyMd, { color: colors.textSecondary, marginTop: 4 }]}>
              Momentum is looking strong this cycle.
            </Text>
          </View>
          <View style={[styles.trendBtn, { backgroundColor: colors.secondaryContainer }]}>
            <Ionicons name="trending-up" size={20} color={colors.secondaryDark} />
          </View>
        </View>

        <View style={[styles.seg, { backgroundColor: colors.surfaceAlt, borderRadius: radius.full, marginTop: 16 }]}>
          {RANGES.map((r) => (
            <Pressable
              key={r}
              onPress={() => setRange(r)}
              style={[
                styles.segItem,
                range === r && {
                  backgroundColor: colors.primary,
                  borderRadius: 999,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelMd,
                  { color: range === r ? '#fff' : colors.textSecondary },
                ]}
              >
                {r}
              </Text>
            </Pressable>
          ))}
        </View>

        {habits.length === 0 ? (
          <EmptyState title="No data yet" subtitle="Add habits and check in to see insights." />
        ) : (
          <>
            <View style={styles.metricRow}>
              <View
                style={[
                  styles.metricCard,
                  shadows.card,
                  { backgroundColor: colors.surface, borderRadius: radius.lg },
                ]}
              >
                <ProgressRing percentage={progress.percentage} size={64} strokeWidth={7} />
                <Text style={[typography.small, { color: colors.secondary, marginTop: 4 }]}>
                  Completion
                </Text>
              </View>
              <View
                style={[
                  styles.metricCard,
                  shadows.card,
                  { backgroundColor: colors.surface, borderRadius: radius.lg, flex: 1.2 },
                ]}
              >
                <Text style={[typography.h2, { color: colors.primary }]}>
                  {progress.completed}/{Math.max(progress.total, 1)}
                </Text>
                <Text style={[typography.small, { color: colors.textSecondary }]}>
                  Habits Done
                </Text>
                <View
                  style={[
                    styles.barTrack,
                    { backgroundColor: colors.progressTrack, marginTop: 8 },
                  ]}
                >
                  <View
                    style={{
                      width: `${progress.percentage}%`,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.primary,
                    }}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.metricCard,
                  shadows.card,
                  { backgroundColor: colors.surface, borderRadius: radius.lg },
                ]}
              >
                <Ionicons name="star" size={22} color={colors.accentDark} />
                <Text style={[typography.h3, { color: colors.text, marginTop: 4 }]}>
                  {Math.min(bestStreak, 7)} Days
                </Text>
                <Text style={[typography.small, { color: colors.textSecondary }]}>
                  Perfect
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.chartCard,
                shadows.card,
                { backgroundColor: colors.surface, borderRadius: radius.lg, marginTop: 16 },
              ]}
            >
              <View style={styles.chartHead}>
                <Text style={[typography.h3, { color: colors.text }]}>Weekly Performance</Text>
                <View style={[styles.peak, { backgroundColor: `${colors.secondary}22` }]}>
                  <Text style={[typography.labelSm, { color: colors.secondaryDark }]}>
                    Peak week
                  </Text>
                </View>
              </View>
              <Text style={[typography.small, { color: colors.textSecondary, marginBottom: 8 }]}>
                Daily completion against your routine.
              </Text>
              <BarChart
                data={chart}
                width={width}
                height={200}
                yAxisLabel=""
                yAxisSuffix="%"
                chartConfig={{
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(108, 92, 231, ${opacity})`,
                  labelColor: () => colors.textSecondary,
                  propsForBackgroundLines: { stroke: colors.borderSoft },
                  barPercentage: 0.55,
                }}
                fromZero
                showValuesOnTopOfBars
                style={{ borderRadius: 12, marginLeft: -8 }}
              />
            </View>

            <Text style={[typography.h3, { color: colors.text, marginTop: 24, marginBottom: 12 }]}>
              Top Streaks
            </Text>
            {topStreaks.map((h) => (
              <Pressable
                key={h.id}
                onPress={() => navigation.navigate('HabitDetail', { habitId: h.id })}
                style={[
                  styles.streakRow,
                  shadows.soft,
                  { backgroundColor: colors.surface, borderRadius: radius.lg },
                ]}
              >
                <View style={[styles.iconSq, { backgroundColor: `${h.color}22` }]}>
                  <Ionicons
                    name={(h.icon as keyof typeof Ionicons.glyphMap) || 'flame'}
                    size={18}
                    color={h.color}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[typography.bodyBold, { color: colors.text }]}>{h.name}</Text>
                  <Text style={[typography.small, { color: colors.textSecondary }]}>
                    {h.completedDates.length} check-ins total
                  </Text>
                </View>
                <View style={[styles.streakPill, { backgroundColor: colors.amberSoft }]}>
                  <Text style={{ fontSize: 12 }}>🔥</Text>
                  <Text style={[typography.labelMd, { color: colors.accentDark, marginLeft: 4 }]}>
                    {getCurrentStreak(h)} days
                  </Text>
                </View>
              </Pressable>
            ))}

            <Text style={[typography.small, { color: colors.textMuted, marginTop: 8 }]}>
              {total} lifetime check-ins
            </Text>
          </>
        )}
      </ScrollView>
      <View style={{ marginBottom: 72 }}>
        <AdBanner />
      </View>
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
  titleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  trendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seg: { flexDirection: 'row', padding: 4 },
  segItem: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  metricRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  metricCard: { flex: 1, padding: 12, alignItems: 'center' },
  barTrack: { width: '100%', height: 6, borderRadius: 3, overflow: 'hidden' },
  chartCard: { padding: 16 },
  chartHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  peak: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
  },
  iconSq: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
