import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { GOAL_OPTIONS } from '../config/constants';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseGoals'>;

export function ChooseGoalsScreen({ navigation }: Props) {
  const { colors, typography, spacing, radius } = useTheme();
  const [selected, setSelected] = useState<string[]>(['health', 'fitness', 'work', 'sleep']);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const balance =
    selected.length >= 4 ? 'BALANCED' : selected.length >= 2 ? 'FOCUSED' : 'PICK MORE';

  return (
    <Screen scroll style={{ paddingHorizontal: spacing.margin, paddingTop: spacing.sm }}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={[styles.circleBtn, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={[styles.stepPill, { backgroundColor: colors.primaryMuted }]}>
          <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
          <Text style={[typography.labelSm, { color: colors.primary, marginLeft: 6 }]}>
            STEP 1 OF 2
          </Text>
        </View>
        <Text
          onPress={() => navigation.navigate('NameSetup', { goals: selected })}
          style={[typography.caption, { color: colors.textMuted }]}
        >
          Skip
        </Text>
      </View>

      <Text style={[typography.labelSm, { color: colors.primary, marginTop: 20 }]}>
        YOUR JOURNEY
      </Text>
      <Text style={[typography.h1, { color: colors.text, marginTop: 8 }]}>
        What do you want to achieve?
      </Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
        Select the areas you want to focus on to personalize your habit experience.
      </Text>

      <View
        style={[
          styles.statusBar,
          { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, marginTop: 16 },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
          <Text style={[typography.bodyMd, { color: colors.text, marginLeft: 8 }]}>
            {selected.length} focus areas selected
          </Text>
        </View>
        <View style={[styles.balancePill, { backgroundColor: `${colors.secondary}22` }]}>
          <Text style={[typography.labelSm, { color: colors.secondaryDark }]}>{balance}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {GOAL_OPTIONS.map((goal) => {
          const active = selected.includes(goal.id);
          return (
            <Pressable
              key={goal.id}
              onPress={() => toggle(goal.id)}
              style={[
                styles.chip,
                shadows.soft,
                {
                  backgroundColor: active ? colors.primaryMuted : colors.surface,
                  borderColor: active ? colors.primary : colors.borderSoft,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <View style={styles.chipTop}>
                <View
                  style={[
                    styles.iconSq,
                    {
                      backgroundColor: active ? colors.primarySoft : colors.surfaceAlt,
                      borderRadius: 12,
                    },
                  ]}
                >
                  <Ionicons
                    name={goal.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={active ? colors.primary : colors.textSecondary}
                  />
                </View>
                <View
                  style={[
                    styles.check,
                    {
                      backgroundColor: active ? colors.secondaryDark : 'transparent',
                      borderColor: active ? colors.secondaryDark : colors.border,
                    },
                  ]}
                >
                  {active ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
                </View>
              </View>
              <Text style={[typography.bodyBold, { color: colors.text, marginTop: 12 }]}>
                {goal.label}
              </Text>
              <Text style={[typography.small, { color: colors.textSecondary, marginTop: 2 }]}>
                {goal.desc}
              </Text>
              <Text style={[typography.labelMd, { color: colors.primary, marginTop: 10 }]}>
                {goal.count} habits
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={[
          styles.note,
          { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, marginBottom: 16 },
        ]}
      >
        <Ionicons name="settings-outline" size={16} color={colors.textMuted} />
        <Text style={[typography.small, { color: colors.textSecondary, marginLeft: 8, flex: 1 }]}>
          You can change or refine these anytime in your Profile settings.
        </Text>
      </View>

      <Button
        title="Continue"
        onPress={() => navigation.navigate('NameSetup', { goals: selected })}
        disabled={selected.length === 0}
        iconRight="arrow-forward"
        style={{ marginBottom: 24 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stepDot: { width: 6, height: 6, borderRadius: 3 },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  balancePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 20,
  },
  chip: {
    width: '47%',
    padding: 14,
    borderWidth: 1.5,
  },
  chipTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconSq: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
});
