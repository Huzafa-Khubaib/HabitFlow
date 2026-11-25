import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { Habit } from '../types';
import { getCurrentStreak, isCompletedToday } from '../utils/streaks';

type Props = {
  habit: Habit;
  onPress: () => void;
  onToggle: () => void;
  category?: string;
};

export function HabitCard({ habit, onPress, onToggle, category = 'Habit' }: Props) {
  const { colors, typography, radius } = useTheme();
  const done = isCompletedToday(habit);
  const streak = getCurrentStreak(habit);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        shadows.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          opacity: pressed ? 0.96 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: `${habit.color}1A`, borderRadius: 12 },
        ]}
      >
        <Ionicons
          name={(habit.icon as keyof typeof Ionicons.glyphMap) || 'checkbox'}
          size={22}
          color={habit.color}
        />
      </View>

      <View style={styles.meta}>
        <Text style={[typography.bodyBold, { color: colors.text }]} numberOfLines={1}>
          {habit.name}
        </Text>
        <View style={styles.row}>
          <Text style={[typography.small, { color: colors.textMuted }]}>{category}</Text>
          <View style={[styles.streakPill, { backgroundColor: colors.amberSoft }]}>
            <Text style={{ fontSize: 11 }}>🔥</Text>
            <Text style={[typography.labelMd, { color: colors.accentDark, marginLeft: 3 }]}>
              {streak} days
            </Text>
          </View>
          {habit.reminderTime && !done ? (
            <Text style={[typography.small, { color: colors.textMuted, marginLeft: 6 }]}>
              {habit.reminderTime}
            </Text>
          ) : null}
        </View>
      </View>

      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          onToggle();
        }}
        hitSlop={8}
        style={[
          styles.check,
          {
            backgroundColor: done ? colors.secondary : 'transparent',
            borderColor: done ? colors.secondary : colors.border,
          },
        ]}
      >
        {done ? <Ionicons name="checkmark" size={18} color="#fff" /> : null}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    marginHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
