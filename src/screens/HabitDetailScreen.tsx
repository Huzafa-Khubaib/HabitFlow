import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';
import { toDateKey } from '../utils/dates';
import { getBestStreak, getCurrentStreak, isCompletedToday } from '../utils/streaks';

type Props = NativeStackScreenProps<RootStackParamList, 'HabitDetail'>;

export function HabitDetailScreen({ navigation, route }: Props) {
  const { colors, typography, spacing, radius } = useTheme();
  const { habits, toggleComplete, deleteHabit } = useHabits();
  const habit = habits.find((h) => h.id === route.params.habitId);

  const marked = useMemo(() => {
    if (!habit) return {};
    const marks: Record<string, object> = {};
    habit.completedDates.forEach((d) => {
      marks[d] = { selected: true, selectedColor: colors.primary };
    });
    const today = toDateKey();
    if (!marks[today]) {
      marks[today] = {
        selected: true,
        selectedColor: colors.secondary,
      };
    } else {
      marks[today] = {
        selected: true,
        selectedColor: colors.secondary,
      };
    }
    return marks;
  }, [habit, colors.primary, colors.secondary]);

  if (!habit) {
    return (
      <Screen>
        <Text style={{ padding: 24, color: colors.text }}>Habit not found.</Text>
      </Screen>
    );
  }

  const current = getCurrentStreak(habit);
  const best = getBestStreak(habit);
  const done = isCompletedToday(habit);
  const consistency =
    habit.completedDates.length === 0
      ? 0
      : Math.min(
          100,
          Math.round((habit.completedDates.length / 30) * 100),
        );

  return (
    <Screen scroll style={{ paddingHorizontal: spacing.margin }}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text }]}>Habit Detail</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View
        style={[
          styles.hero,
          shadows.card,
          { backgroundColor: colors.surface, borderRadius: radius.lg, marginTop: 12 },
        ]}
      >
        <View style={styles.heroTop}>
          <View style={[styles.iconBig, { backgroundColor: `${habit.color}22` }]}>
            <Ionicons
              name={(habit.icon as any) || 'checkbox'}
              size={28}
              color={habit.color}
            />
          </View>
          <Pressable
            onPress={() => toggleComplete(habit.id)}
            style={[
              styles.bigCheck,
              {
                backgroundColor: done ? colors.secondary : colors.surfaceAlt,
                borderColor: done ? colors.secondary : colors.border,
              },
            ]}
          >
            {done ? <Ionicons name="checkmark" size={28} color="#fff" /> : null}
          </Pressable>
        </View>
        <View style={[styles.catPill, { backgroundColor: colors.primaryMuted, marginTop: 12 }]}>
          <Text style={[typography.labelSm, { color: colors.primary }]}>
            • {habit.frequency}
          </Text>
        </View>
        <Text style={[typography.h1, { color: colors.text, marginTop: 8 }]}>{habit.name}</Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={[typography.small, { color: colors.textSecondary, marginLeft: 4 }]}>
            {habit.reminderTime ? `Daily at ${habit.reminderTime}` : 'No reminder set'}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View
          style={[
            styles.statBox,
            shadows.soft,
            { backgroundColor: colors.surface, borderRadius: radius.lg },
          ]}
        >
          <Text style={[typography.labelSm, { color: colors.textMuted }]}>CURRENT STREAK</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 }}>
            <Text style={[typography.h1, { color: colors.text }]}>{current}</Text>
            <Text style={[typography.bodyMd, { color: colors.textSecondary, marginLeft: 4, marginBottom: 4 }]}>
              Days
            </Text>
            <View style={[styles.miniIcon, { backgroundColor: colors.amberSoft, marginLeft: 8 }]}>
              <Text>🔥</Text>
            </View>
          </View>
          <Text style={[typography.small, { color: colors.secondary, marginTop: 8 }]}>
            📈 Keep it up!
          </Text>
        </View>
        <View
          style={[
            styles.statBox,
            shadows.soft,
            { backgroundColor: colors.surface, borderRadius: radius.lg },
          ]}
        >
          <Text style={[typography.labelSm, { color: colors.textMuted }]}>BEST STREAK</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 }}>
            <Text style={[typography.h1, { color: colors.text }]}>{best}</Text>
            <Text style={[typography.bodyMd, { color: colors.textSecondary, marginLeft: 4, marginBottom: 4 }]}>
              Days
            </Text>
            <View style={[styles.miniIcon, { backgroundColor: colors.primaryMuted, marginLeft: 8 }]}>
              <Ionicons name="trophy" size={14} color={colors.primary} />
            </View>
          </View>
          <Text style={[typography.small, { color: colors.primary, marginTop: 8 }]}>
            🏆 Personal best
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.consistency,
          shadows.soft,
          { backgroundColor: colors.surface, borderRadius: radius.lg },
        ]}
      >
        <Ionicons name="analytics" size={22} color={colors.secondary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[typography.bodyBold, { color: colors.text }]}>Consistency Score</Text>
          <Text style={[typography.small, { color: colors.textSecondary }]}>
            Last 30 rolling calendar days
          </Text>
        </View>
        <View style={[styles.scorePill, { backgroundColor: `${colors.secondary}22` }]}>
          <Text style={[typography.h3, { color: colors.secondaryDark }]}>{consistency}%</Text>
        </View>
      </View>

      <Text style={[typography.h3, { color: colors.text, marginTop: 24, marginBottom: 12 }]}>
        Calendar
      </Text>
      <View
        style={[
          shadows.card,
          {
            borderRadius: radius.lg,
            overflow: 'hidden',
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Calendar
          markedDates={marked}
          onDayPress={async (day: DateData) => {
            await toggleComplete(habit.id, day.dateString);
          }}
          theme={{
            backgroundColor: colors.surface,
            calendarBackground: colors.surface,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#fff',
            todayTextColor: colors.secondaryDark,
            dayTextColor: colors.text,
            monthTextColor: colors.text,
            arrowColor: colors.primary,
            textDisabledColor: colors.textMuted,
          }}
          enableSwipeMonths
        />
        <View style={[styles.legend, { borderTopColor: colors.borderSoft }]}>
          <LegendDot color={colors.primary} label="Completed" colors={colors} typography={typography} />
          <LegendDot color={colors.secondary} label="Today" colors={colors} typography={typography} />
          <LegendDot color={colors.border} label="Missed" colors={colors} typography={typography} />
        </View>
      </View>

      <View
        style={[
          styles.quote,
          { backgroundColor: colors.primaryMuted, borderRadius: radius.lg, marginTop: 16 },
        ]}
      >
        <Ionicons name="bulb-outline" size={18} color={colors.primary} />
        <Text
          style={[
            typography.bodyMd,
            { color: colors.primaryDark, marginLeft: 10, flex: 1, fontStyle: 'italic' },
          ]}
        >
          "Small deeds done are better than great deeds planned."
        </Text>
      </View>

      <Button
        title="Edit Habit"
        icon="create-outline"
        onPress={() => navigation.navigate('EditHabit', { habitId: habit.id })}
        style={{ marginTop: 24 }}
      />
      <Button
        title="Delete Habit"
        variant="danger"
        icon="trash-outline"
        onPress={() =>
          Alert.alert('Delete habit?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                await deleteHabit(habit.id);
                navigation.popToTop();
              },
            },
          ])
        }
        style={{ marginTop: 10, marginBottom: 32 }}
      />
    </Screen>
  );
}

function LegendDot({
  color,
  label,
  colors,
  typography,
}: {
  color: string;
  label: string;
  colors: any;
  typography: any;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={[typography.small, { color: colors.textSecondary, marginLeft: 6 }]}>
        {label}
      </Text>
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
  hero: { padding: 16 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBig: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCheck: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  statBox: { flex: 1, padding: 14 },
  miniIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  consistency: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginTop: 10,
  },
  scorePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  legend: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  quote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
});
