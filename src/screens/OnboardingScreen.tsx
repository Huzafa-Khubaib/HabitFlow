import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { images } from '../assets/images';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: '1',
    image: images.onboarding1,
    badge: 'Consistent',
    streak: '5-Day Streak',
    title: 'Track Daily Habits',
    subtitle:
      'Log your daily routines with a single tap and build positive momentum effortlessly.',
  },
  {
    key: '2',
    image: images.onboarding2,
    badge: 'On Fire',
    streak: '21-Day Streak',
    title: 'Build Streaks',
    subtitle:
      'Watch your consistency grow. Streaks and badges keep you motivated every day.',
  },
  {
    key: '3',
    image: images.onboarding3,
    badge: 'Reminded',
    streak: 'Never Miss',
    title: 'Stay Motivated',
    subtitle:
      'Gentle local reminders help you show up — fully offline, no account needed.',
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const { colors, typography, spacing } = useTheme();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      navigation.navigate('ChooseGoals');
    }
  };

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View style={[styles.topRow, { paddingHorizontal: spacing.margin }]}>
        <View style={[styles.stepPill, { backgroundColor: colors.primaryMuted }]}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
          <Text style={[typography.labelMd, { color: colors.primary, marginLeft: 6 }]}>
            Step {index + 1} of 3
          </Text>
        </View>
        <Text
          onPress={() => navigation.navigate('ChooseGoals')}
          style={[typography.caption, { color: colors.textMuted }]}
        >
          Skip
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width, paddingHorizontal: spacing.margin }]}>
            <View
              style={[
                styles.illust,
                shadows.card,
                { backgroundColor: colors.surface, borderRadius: 28 },
              ]}
            >
              <View style={[styles.badge, { backgroundColor: `${colors.secondary}22` }]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.secondary} />
                <Text style={[typography.labelMd, { color: colors.secondaryDark, marginLeft: 4 }]}>
                  {item.badge}
                </Text>
              </View>
              <Image source={item.image} style={styles.heroImg} resizeMode="contain" />
              <View style={[styles.streakBadge, { backgroundColor: colors.amberSoft }]}>
                <Text style={{ fontSize: 14 }}>🔥</Text>
                <Text style={[typography.labelMd, { color: colors.accentDark, marginLeft: 4 }]}>
                  {item.streak}
                </Text>
              </View>
            </View>

            <Text
              style={[
                typography.h1,
                { color: colors.text, textAlign: 'center', marginTop: 28 },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                typography.body,
                {
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: 12,
                  paddingHorizontal: 12,
                },
              ]}
            >
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View
            key={s.key}
            style={{
              height: 8,
              borderRadius: 4,
              width: i === index ? 24 : 8,
              backgroundColor: i === index ? colors.primary : colors.borderSoft,
            }}
          />
        ))}
      </View>

      <View style={{ paddingHorizontal: spacing.margin, paddingBottom: spacing.xl }}>
        <Button
          title={index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={next}
          iconRight="arrow-forward"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  slide: { alignItems: 'center', paddingTop: 20 },
  illust: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImg: {
    width: '88%',
    height: 220,
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 2,
  },
  streakBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    zIndex: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
});
