import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export function PrivacyPolicyScreen({ navigation }: Props) {
  const { colors, typography, spacing } = useTheme();

  return (
    <Screen scroll style={{ paddingHorizontal: spacing.margin }}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text }]}>Privacy Policy</Text>
        <View style={{ width: 22 }} />
      </View>
      <Text style={[typography.h1, { color: colors.text, marginTop: 12 }]}>Privacy Policy</Text>
      <Text style={[typography.caption, { color: colors.textMuted, marginTop: 6 }]}>
        Last updated: November 25, 2026
      </Text>

      <Section title="Overview" colors={colors} typography={typography}>
        HabitFlow is a fully offline habit tracker. Your habits, streaks, and profile
        are stored only on your device using local storage. We do not operate a backend
        server and do not create user accounts.
      </Section>

      <Section title="Data we store on your device" colors={colors} typography={typography}>
        Habit names, icons, completion dates, reminder times, display name, goals,
        theme preference, and achievement unlock status. You can erase this data at any
        time from Settings → Reset all data.
      </Section>

      <Section title="Notifications" colors={colors} typography={typography}>
        If you enable reminders, HabitFlow schedules local notifications on your device.
        Notification content never leaves your phone.
      </Section>

      <Section title="Advertising" colors={colors} typography={typography}>
        HabitFlow may show ads via Google AdMob. AdMob may collect device advertising
        identifiers and approximate location for ad delivery and fraud prevention under
        Google's policies. You can purchase Remove Ads (when available) to hide banners
        and interstitials.
      </Section>

      <Section title="Children" colors={colors} typography={typography}>
        HabitFlow is not directed at children under 13. Do not use the app if you are
        under the applicable age in your region without parental consent.
      </Section>

      <Section title="Contact" colors={colors} typography={typography}>
        Questions about privacy? Email support@habitflow.app (placeholder — update before
        Play Store release).
      </Section>
    </Screen>
  );
}

function Section({
  title,
  children,
  colors,
  typography,
}: {
  title: string;
  children: string;
  colors: any;
  typography: any;
}) {
  return (
    <>
      <Text style={[typography.h3, { color: colors.text, marginTop: 24 }]}>{title}</Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8, lineHeight: 24 }]}>
        {children}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});
