import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../assets/images';
import { AdBanner } from '../components/AdBanner';
import { EmptyState } from '../components/EmptyState';
import { HabitCard } from '../components/HabitCard';
import { ProgressRing } from '../components/ProgressRing';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';
import { addDays, greetingForNow, toDateKey } from '../utils/dates';
import { getDailyProgress } from '../utils/streaks';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { habits, profile, toggleComplete } = useHabits();
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(toDateKey());
  const progress = useMemo(() => getDailyProgress(habits), [habits]);

  const weekDays = useMemo(() => {
    const today = new Date();
    const start = addDays(today, -today.getDay() + 1); // Monday start-ish; adjust
    // Show Mon-Sun around today
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = addDays(today, -mondayOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(monday, i);
      return {
        key: toDateKey(d),
        label: DAY_LABELS[d.getDay()],
        day: d.getDate(),
        done: habits.some((h) => h.completedDates.includes(toDateKey(d))),
      };
    });
  }, [habits]);

  const monthLabel = new Date().toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const ritual =
    new Date().getHours() < 12
      ? 'Morning Ritual'
      : new Date().getHours() < 17
        ? 'Afternoon Focus'
        : 'Evening Wind-down';

  const onToggle = async (id: string) => {
    const completed = await toggleComplete(id);
    if (completed && progress.total > 0 && progress.completed + 1 >= progress.total) {
      navigation.navigate('Celebration', {
        title: `Great job${profile.name ? `, ${profile.name}` : ''}! 🎉`,
        subtitle: 'You completed all your habits for today!',
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Glass header */}
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
          <View style={[styles.logo, { backgroundColor: colors.primary }, shadows.soft]}>
            <Ionicons name="infinite" size={20} color="#fff" />
          </View>
          <Text style={[typography.h3, { color: colors.text }]}>Home</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            onPress={() => navigation.navigate('Reminders')}
            style={styles.iconBtn}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('MainTabs')}
            style={[styles.avatarBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              {(profile.name || 'H').charAt(0).toUpperCase()}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.margin,
          paddingTop: 12,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.ritualRow}>
              <Ionicons name="sunny" size={16} color={colors.accentDark} />
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.accentDark, marginLeft: 4, textTransform: 'uppercase' },
                ]}
              >
                {ritual}
              </Text>
            </View>
            <Text style={[typography.h1, { color: colors.text, marginTop: 2 }]}>
              {greetingForNow()}
              {profile.name ? `, ${profile.name}!` : '!'}
            </Text>
          </View>
          <View style={styles.avatarWrap}>
            <Image source={images.avatarAlex} style={styles.bigAvatar} />
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: colors.secondary, borderColor: colors.background },
              ]}
            />
          </View>
        </View>

        {/* Week strip */}
        <View style={{ marginTop: 16 }}>
          <View style={styles.weekHeader}>
            <Text style={[typography.labelMd, { color: colors.textSecondary }]}>
              {monthLabel}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[typography.labelSm, { color: colors.primary }]}>This Week</Text>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={colors.primary}
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
          <View style={styles.weekRow}>
            {weekDays.map((d) => {
              const active = d.key === selectedDate;
              return (
                <Pressable
                  key={d.key}
                  onPress={() => setSelectedDate(d.key)}
                  style={[
                    styles.dayCell,
                    shadows.soft,
                    {
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSm,
                      { color: active ? 'rgba(255,255,255,0.8)' : colors.textSecondary },
                    ]}
                  >
                    {d.label}
                  </Text>
                  <Text
                    style={[
                      typography.h3,
                      { color: active ? '#fff' : colors.text, marginTop: 2 },
                    ]}
                  >
                    {d.day}
                  </Text>
                  {d.done ? (
                    <View
                      style={[
                        styles.dayDot,
                        { backgroundColor: active ? '#fff' : colors.secondary },
                      ]}
                    />
                  ) : (
                    <View style={{ height: 4, marginTop: 4 }} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Daily progress */}
        <View
          style={[
            styles.progressCard,
            shadows.card,
            { backgroundColor: colors.surface, borderRadius: radius.lg, marginTop: 16 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.progressBadge}>
              <Ionicons name="sparkles" size={14} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.primary, marginLeft: 4 }]}>
                Daily Progress
              </Text>
            </View>
            <Text style={[typography.h2, { color: colors.text, marginTop: 8 }]}>
              {progress.completed} of {progress.total} habits done
            </Text>
            <Text style={[typography.bodyMd, { color: colors.textSecondary, marginTop: 4 }]}>
              Keep the momentum going!
            </Text>
            <View style={styles.chipRow}>
              <View style={[styles.chip, { backgroundColor: `${colors.secondary}22` }]}>
                <View style={[styles.chipDot, { backgroundColor: colors.secondary }]} />
                <Text style={[typography.small, { color: colors.secondaryDark }]}>
                  {progress.completed} done
                </Text>
              </View>
              <View style={[styles.chip, { backgroundColor: colors.surfaceAlt }]}>
                <View style={[styles.chipDot, { backgroundColor: colors.textMuted }]} />
                <Text style={[typography.small, { color: colors.textSecondary }]}>
                  {Math.max(progress.total - progress.completed, 0)} left
                </Text>
              </View>
            </View>
          </View>
          <ProgressRing
            percentage={progress.percentage}
            size={96}
            strokeWidth={9}
            color={colors.primary}
            label="score"
          />
        </View>

        {/* Habits section */}
        <View style={styles.sectionHead}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[typography.h3, { color: colors.text }]}>Today's Habits</Text>
            <View
              style={[
                styles.countPill,
                { backgroundColor: colors.primarySoft, marginLeft: 8 },
              ]}
            >
              <Text style={[typography.labelMd, { color: colors.primary }]}>
                {habits.length} total
              </Text>
            </View>
          </View>
          <Pressable style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color={colors.textSecondary} />
            <Text style={[typography.labelMd, { color: colors.textSecondary, marginLeft: 4 }]}>
              Filter
            </Text>
          </Pressable>
        </View>

        {habits.length === 0 ? (
          <EmptyState
            icon="add-circle-outline"
            title="No habits yet"
            subtitle="Tap + to create your first ritual and start building streaks."
            actionLabel="Add habit"
            onAction={() => navigation.navigate('AddHabit')}
          />
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
              onToggle={() => onToggle(habit.id)}
            />
          ))
        )}

        {/* Mindful tip — Stitch photo card */}
        <ImageBackground
          source={images.tipHome}
          style={[styles.tipCard, shadows.card, { borderRadius: radius.lg, marginTop: 8 }]}
          imageStyle={{ borderRadius: radius.lg }}
        >
          <View style={styles.tipOverlay}>
            <Text style={[typography.labelSm, { color: colors.accent }]}>MINDFUL TIP</Text>
            <Text style={[typography.h3, { color: '#fff', marginTop: 8 }]}>
              "Small deeds done are better than great deeds planned."
            </Text>
            <Text style={[typography.small, { color: 'rgba(255,255,255,0.85)', marginTop: 6 }]}>
              — Peter Marshall
            </Text>
          </View>
        </ImageBackground>

        {/* Premium / ad strip UI (real BannerAd below) */}
        {!profile.adsRemoved ? (
          <View
            style={[
              styles.adStrip,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                marginTop: 12,
                borderColor: colors.borderSoft,
              },
            ]}
          >
            <View style={[styles.adBadge, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[typography.labelSm, { color: colors.textMuted }]}>AD</Text>
            </View>
            <Text style={[typography.bodyMd, { color: colors.text, flex: 1, marginHorizontal: 10 }]}>
              Mindful Premium — Try 7 Days Free
            </Text>
            <Pressable
              onPress={() => navigation.navigate('RemoveAds')}
              style={[styles.claimBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[typography.labelMd, { color: '#fff' }]}>Claim</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
      {/* Banner sits above floating tab bar */}
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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
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
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ritualRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  bigAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  tipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 29, 31, 0.55)',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'flex-end',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  weekRow: { flexDirection: 'row', gap: 6 },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  progressBadge: { flexDirection: 'row', alignItems: 'center' },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  filterBtn: { flexDirection: 'row', alignItems: 'center' },
  tipCard: { height: 160, overflow: 'hidden' },
  adStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
  },
  adBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  claimBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
