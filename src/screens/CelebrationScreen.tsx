import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';
import { getLongestCurrentStreak, isCompletedToday } from '../utils/streaks';

type Props = NativeStackScreenProps<RootStackParamList, 'Celebration'>;

export function CelebrationScreen({ navigation, route }: Props) {
  const { colors, typography, spacing, radius } = useTheme();
  const { habits, newlyUnlocked, clearNewlyUnlocked, profile } = useHabits();
  const scale = useRef(new Animated.Value(0.6)).current;
  const { title, subtitle } = route.params;
  const streak = getLongestCurrentStreak(habits);
  const doneToday = habits.filter(isCompletedToday);

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Screen scroll style={{ paddingHorizontal: spacing.margin }}>
      <View style={styles.topBar}>
        <Ionicons
          name="arrow-back"
          size={22}
          color={colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={[typography.h3, { color: colors.text }]}>Celebration</Text>
        <Ionicons
          name="close"
          size={22}
          color={colors.text}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Confetti dots */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {[
          { t: 40, l: 30, c: colors.primary },
          { t: 80, l: 300, c: colors.secondary },
          { t: 120, l: 80, c: colors.accent },
          { t: 60, l: 200, c: colors.primaryLight },
          { t: 160, l: 260, c: colors.secondary },
        ].map((d, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: d.t,
              left: d.l,
              width: 8,
              height: 8,
              borderRadius: i % 2 ? 2 : 4,
              backgroundColor: d.c,
              opacity: 0.7,
            }}
          />
        ))}
      </View>

      <Animated.View style={{ transform: [{ scale }], alignItems: 'center', marginTop: 24 }}>
        <View style={[styles.badge, { backgroundColor: colors.amberSoft }]}>
          <Ionicons name="star" size={56} color={colors.accentDark} />
        </View>
        <View
          style={[
            styles.donePill,
            { backgroundColor: colors.secondaryDark, marginTop: 16 },
          ]}
        >
          <Ionicons name="checkmark" size={14} color="#fff" />
          <Text style={[typography.labelMd, { color: '#fff', marginLeft: 6 }]}>
            100% DONE
          </Text>
        </View>
        <Text style={[typography.h1, { color: colors.text, marginTop: 16, textAlign: 'center' }]}>
          {title || `Great job${profile.name ? `, ${profile.name}` : ''}! 🎉`}
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
          ]}
        >
          {subtitle || 'You completed all your habits for today!'}
        </Text>
      </Animated.View>

      <View
        style={[
          styles.streakCard,
          shadows.card,
          { backgroundColor: colors.surface, borderRadius: radius.lg, marginTop: 28 },
        ]}
      >
        <View style={styles.streakTop}>
          <View style={[styles.flameBox, { backgroundColor: colors.amberSoft }]}>
            <Text style={{ fontSize: 22 }}>🔥</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[typography.h3, { color: colors.text }]}>
                {streak} Day Streak!
              </Text>
              <View style={[styles.topPill, { backgroundColor: colors.amberSoft, marginLeft: 8 }]}>
                <Text style={[typography.labelSm, { color: colors.accentDark }]}>Top 5%</Text>
              </View>
            </View>
            <Text style={[typography.small, { color: colors.textSecondary, marginTop: 4 }]}>
              Keep the fire burning — consistency compounds.
            </Text>
          </View>
        </View>
        {newlyUnlocked[0] ? (
          <View style={[styles.xpRow, { borderTopColor: colors.borderSoft }]}>
            <Ionicons name="flash" size={16} color={colors.accentDark} />
            <Text style={[typography.bodyMd, { color: colors.text, marginLeft: 8, flex: 1 }]}>
              Achievement: {newlyUnlocked[0].title}
            </Text>
            <Text style={[typography.labelMd, { color: colors.accentDark }]}>+XP</Text>
          </View>
        ) : null}
      </View>

      {doneToday.length > 0 ? (
        <>
          <View style={styles.listHead}>
            <Text style={[typography.h3, { color: colors.text }]}>Daily Rituals Unlocked</Text>
            <View style={[styles.countPill, { backgroundColor: `${colors.secondary}22` }]}>
              <Text style={[typography.labelSm, { color: colors.secondaryDark }]}>
                {doneToday.length} completed
              </Text>
            </View>
          </View>
          {doneToday.map((h) => (
            <View
              key={h.id}
              style={[
                styles.habitRow,
                shadows.soft,
                { backgroundColor: colors.surface, borderRadius: radius.md },
              ]}
            >
              <View style={[styles.iconSq, { backgroundColor: `${h.color}22` }]}>
                <Ionicons
                  name={(h.icon as any) || 'checkbox'}
                  size={18}
                  color={h.color}
                />
              </View>
              <Text style={[typography.bodyBold, { color: colors.text, flex: 1, marginLeft: 12 }]}>
                {h.name}
              </Text>
              <Ionicons name="checkmark-circle" size={22} color={colors.secondary} />
            </View>
          ))}
        </>
      ) : null}

      <Button
        title="Continue"
        onPress={() => {
          clearNewlyUnlocked();
          const habitId = route.params.habitId;
          if (habitId) {
            navigation.replace('HabitDetail', { habitId });
          } else {
            navigation.goBack();
          }
        }}
        iconRight="arrow-forward"
        style={{ marginTop: 28 }}
      />
      <Button
        title="Share Achievement"
        variant="secondary"
        icon="share-outline"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 10, marginBottom: 32 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  badge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  streakCard: { padding: 16 },
  streakTop: { flexDirection: 'row', alignItems: 'flex-start' },
  flameBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  listHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 12,
  },
  countPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  iconSq: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
