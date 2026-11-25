import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import {
  requestNotificationPermissions,
  syncHabitReminders,
} from '../utils/notifications';

export function RemindersScreen() {
  const { habits } = useHabits();
  const { colors, typography, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState(true);
  const withReminders = habits.filter((h) => h.reminderTime);

  useEffect(() => {
    requestNotificationPermissions().then(setEnabled);
  }, []);

  const onToggle = async (value: boolean) => {
    if (value) {
      const ok = await requestNotificationPermissions();
      setEnabled(ok);
      if (ok) await syncHabitReminders(habits);
    } else {
      setEnabled(false);
      const { cancelAllReminders } = await import('../utils/notifications');
      await cancelAllReminders();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: spacing.margin }}>
        <View style={styles.headerLeft}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="infinite" size={18} color="#fff" />
          </View>
          <Text style={[typography.h3, { color: colors.text }]}>Alerts</Text>
        </View>
        <Text style={[typography.h1, { color: colors.text, marginTop: 16 }]}>Reminders</Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 6 }]}>
          Local notifications — no account required
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: spacing.margin,
          paddingBottom: 120,
        }}
      >
        <View
          style={[
            styles.card,
            shadows.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[typography.bodyBold, { color: colors.text }]}>
              Enable reminders
            </Text>
            <Text style={[typography.small, { color: colors.textSecondary, marginTop: 4 }]}>
              Allow HabitFlow to send daily habit alerts
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={onToggle}
            trackColor={{ true: colors.secondary, false: colors.border }}
          />
        </View>

        <Text style={[typography.h3, { color: colors.text, marginTop: 28, marginBottom: 12 }]}>
          Scheduled
        </Text>

        {!enabled ? (
          <EmptyState
            icon="notifications-off-outline"
            title="Reminders off"
            subtitle="Turn on notifications to get gentle habit nudges."
          />
        ) : withReminders.length === 0 ? (
          <EmptyState
            icon="alarm-outline"
            title="No reminders set"
            subtitle="Edit a habit and pick a reminder time."
          />
        ) : (
          withReminders.map((h) => (
            <View
              key={h.id}
              style={[
                styles.row,
                shadows.soft,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: `${h.color}22` }]}>
                <Ionicons
                  name={(h.icon as any) || 'alarm'}
                  size={20}
                  color={h.color}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[typography.bodyBold, { color: colors.text }]}>{h.name}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  Daily at {h.reminderTime}
                </Text>
              </View>
              <Ionicons name="notifications" size={18} color={colors.primary} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
