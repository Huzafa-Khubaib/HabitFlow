import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { images } from '../assets/images';
import { Screen } from '../components/Screen';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export function AboutScreen({ navigation }: Props) {
  const { colors, typography, spacing, radius } = useTheme();

  return (
    <Screen scroll style={{ paddingHorizontal: spacing.margin }}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text }]}>About</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.center}>
        <View
          style={[
            styles.logo,
            shadows.card,
            { borderRadius: radius.xl, overflow: 'hidden' },
          ]}
        >
          <Image source={images.appIcon} style={{ width: 88, height: 88 }} />
        </View>
        <Text style={[typography.h1, { color: colors.text, marginTop: 16 }]}>HabitFlow</Text>
        <Text style={[typography.caption, { color: colors.primary, marginTop: 4 }]}>
          Version 1.0.0
        </Text>
      </View>

      <Text
        style={[
          typography.body,
          { color: colors.textSecondary, marginTop: 28, lineHeight: 24 },
        ]}
      >
        HabitFlow helps you build lasting routines with streaks, gentle reminders, and
        achievements — all offline on your device. No account. No cloud. Just progress.
      </Text>

      <Text style={[typography.h3, { color: colors.text, marginTop: 28 }]}>Built with</Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8, lineHeight: 22 }]}>
        Expo · React Native · TypeScript · AsyncStorage · AdMob · expo-notifications
      </Text>

      <Text
        style={[
          typography.labelSm,
          { color: colors.textMuted, marginTop: 40, textAlign: 'center' },
        ]}
      >
        LUMINOUS MOMENTUM · MINDFUL RITUALS
      </Text>
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
  center: { alignItems: 'center', marginTop: 24 },
  logo: {
    width: 88,
    height: 88,
  },
});
