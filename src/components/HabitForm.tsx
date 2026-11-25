import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import {
  FREQUENCY_OPTIONS,
  HABIT_ICONS,
  WEEKDAY_LABELS,
  WEEKDAY_VALUES,
} from '../config/constants';
import { HabitInput } from '../store/HabitContext';
import { habitColors, shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { HabitFrequency } from '../types';
import { Button } from './Button';

type Props = {
  initial?: Partial<HabitInput>;
  submitLabel: string;
  onSubmit: (input: HabitInput) => Promise<void>;
  onDelete?: () => void;
};

export function HabitForm({ initial, submitLabel, onSubmit, onDelete }: Props) {
  const { colors, typography, spacing, radius } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [icon, setIcon] = useState(initial?.icon ?? 'body');
  const [color, setColor] = useState(initial?.color ?? habitColors[0]);
  const [frequency, setFrequency] = useState<HabitFrequency>(
    initial?.frequency ?? 'daily',
  );
  const [customDays, setCustomDays] = useState<number[]>(
    initial?.customDays ?? [1, 2, 3, 4, 5, 6, 0],
  );
  const [reminderOn, setReminderOn] = useState(Boolean(initial?.reminderTime));
  const [reminderTime, setReminderTime] = useState(initial?.reminderTime ?? '08:00');
  const [saving, setSaving] = useState(false);

  const toggleDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    );
  };

  const presetTimes = ['07:00', '08:00', '09:00', '12:00', '18:00', '21:00'];

  const submit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        icon,
        color,
        frequency,
        customDays: frequency === 'custom' ? customDays : undefined,
        reminderTime: reminderOn ? reminderTime : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ paddingHorizontal: spacing.margin, paddingBottom: spacing.xxl }}>
      {/* Live preview */}
      <View
        style={[
          styles.preview,
          shadows.card,
          { backgroundColor: colors.surface, borderRadius: radius.lg },
        ]}
      >
        <Text style={[typography.labelSm, { color: colors.textMuted }]}>LIVE PREVIEW</Text>
        <View style={styles.previewRow}>
          <View style={[styles.previewIcon, { backgroundColor: `${color}22`, borderRadius: 12 }]}>
            <Ionicons
              name={(icon as keyof typeof Ionicons.glyphMap) || 'checkbox'}
              size={24}
              color={color}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[typography.bodyBold, { color: colors.text }]} numberOfLines={1}>
              {name || 'Your habit'}
            </Text>
            <Text style={[typography.small, { color: colors.textSecondary, marginTop: 2 }]}>
              {frequency === 'daily' ? 'Every day' : frequency}
              {reminderOn ? ` at ${reminderTime}` : ''}
            </Text>
          </View>
          <View style={[styles.day1, { backgroundColor: colors.amberSoft }]}>
            <Text style={{ fontSize: 11 }}>🔥</Text>
            <Text style={[typography.labelMd, { color: colors.accentDark, marginLeft: 2 }]}>
              Day 1
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.labelRow}>
        <Text style={[typography.h3, { color: colors.text }]}>Habit Name</Text>
        <Text style={[typography.small, { color: colors.textMuted }]}>
          {name.length}/40
        </Text>
      </View>
      <TextInput
        value={name}
        onChangeText={(t) => setName(t.slice(0, 40))}
        placeholder="e.g. Mindful Meditation"
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          typography.bodyBold,
          {
            backgroundColor: colors.surfaceAlt,
            color: colors.text,
            borderRadius: radius.md,
            borderColor: colors.primary,
            borderWidth: name ? 1.5 : 0,
          },
        ]}
      />

      <View style={[styles.labelRow, { marginTop: 24 }]}>
        <Text style={[typography.h3, { color: colors.text }]}>Select Icon</Text>
        <Text style={[typography.small, { color: colors.textMuted }]}>4×3 Quick Set</Text>
      </View>
      <View style={styles.wrap}>
        {HABIT_ICONS.slice(0, 12).map((ic) => (
          <Pressable
            key={ic}
            onPress={() => setIcon(ic)}
            style={[
              styles.iconBtn,
              {
                backgroundColor: icon === ic ? `${color}22` : colors.surfaceAlt,
                borderColor: icon === ic ? color : 'transparent',
                borderRadius: radius.md,
              },
            ]}
          >
            <Ionicons
              name={ic as keyof typeof Ionicons.glyphMap}
              size={22}
              color={icon === ic ? color : colors.textSecondary}
            />
            {icon === ic ? (
              <View style={[styles.iconCheck, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>

      <Text style={[typography.h3, { color: colors.text, marginTop: 24, marginBottom: 12 }]}>
        Theme Aura
      </Text>
      <View style={styles.colorRow}>
        {habitColors.slice(0, 6).map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.colorDot,
              {
                backgroundColor: c,
                borderWidth: color === c ? 3 : 0,
                borderColor: colors.text,
              },
            ]}
          >
            {color === c ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
          </Pressable>
        ))}
      </View>

      <Text style={[typography.h3, { color: colors.text, marginTop: 24, marginBottom: 12 }]}>
        Routine Frequency
      </Text>
      <View style={[styles.seg, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
        {FREQUENCY_OPTIONS.map((opt) => {
          const active = frequency === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setFrequency(opt.value)}
              style={[
                styles.segItem,
                active && {
                  backgroundColor: colors.surface,
                  borderRadius: radius.sm,
                  ...shadows.soft,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelMd,
                  { color: active ? colors.text : colors.textSecondary },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {(frequency === 'custom' || frequency === 'daily') && (
        <View style={[styles.daysRow, { marginTop: 14 }]}>
          {WEEKDAY_LABELS.map((label, i) => {
            const day = WEEKDAY_VALUES[i];
            const active =
              frequency === 'daily' ? true : customDays.includes(day);
            return (
              <Pressable
                key={`${label}-${i}`}
                onPress={() => frequency === 'custom' && toggleDay(day)}
                style={[
                  styles.dayBtn,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? '#fff' : colors.textSecondary,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Text style={[typography.h3, { color: colors.text, marginTop: 24, marginBottom: 12 }]}>
        Notification & Timing
      </Text>
      <View
        style={[
          styles.timeCard,
          shadows.soft,
          { backgroundColor: colors.surface, borderRadius: radius.lg },
        ]}
      >
        <View style={[styles.clockIcon, { backgroundColor: colors.primaryMuted }]}>
          <Ionicons name="alarm-outline" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[typography.bodyBold, { color: colors.text }]}>
            {reminderTime}
          </Text>
          <Text style={[typography.small, { color: colors.textSecondary }]}>
            Repeat alert {reminderOn ? 'enabled' : 'off'}
          </Text>
        </View>
        <Switch
          value={reminderOn}
          onValueChange={setReminderOn}
          trackColor={{ true: colors.secondary, false: colors.border }}
        />
      </View>

      {reminderOn ? (
        <View style={[styles.freqRow, { marginTop: 10 }]}>
          {presetTimes.map((t) => (
            <Pressable
              key={t}
              onPress={() => setReminderTime(t)}
              style={[
                styles.timeChip,
                {
                  backgroundColor:
                    reminderTime === t ? colors.primary : colors.surfaceAlt,
                  borderRadius: 999,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelMd,
                  { color: reminderTime === t ? '#fff' : colors.textSecondary },
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View
        style={[
          styles.motivate,
          { backgroundColor: colors.primaryMuted, borderRadius: radius.lg, marginTop: 24 },
        ]}
      >
        <Ionicons name="sparkles" size={16} color={colors.primary} />
        <Text style={[typography.bodyMd, { color: colors.primaryDark, marginLeft: 8, flex: 1 }]}>
          Building tiny rituals leads to lifelong transformations. You've got this!
        </Text>
      </View>

      <Button
        title={submitLabel}
        onPress={submit}
        disabled={!name.trim()}
        loading={saving}
        icon="add-circle"
        style={{ marginTop: 24 }}
      />

      {onDelete ? (
        <Button
          title="Delete Habit"
          onPress={onDelete}
          variant="danger"
          icon="trash"
          style={{ marginTop: 12 }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { padding: 16, marginBottom: 20 },
  previewRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  previewIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconBtn: {
    width: '22%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  iconCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seg: { flexDirection: 'row', padding: 4 },
  segItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  clockIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { paddingHorizontal: 12, paddingVertical: 8 },
  motivate: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
});
