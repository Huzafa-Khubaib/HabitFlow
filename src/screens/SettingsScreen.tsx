import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useHabits } from '../store/HabitContext';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { profile, updateProfile, resetAllData } = useHabits();
  const { colors, typography, spacing, radius, themePreference, setThemePreference } =
    useTheme();
  const [name, setName] = useState(profile.name);
  const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];

  return (
    <Screen scroll style={{ paddingHorizontal: spacing.margin }}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={[typography.h3, { color: colors.text, marginTop: 24, marginBottom: 10 }]}>
        Display name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          typography.bodyBold,
          {
            backgroundColor: colors.surfaceAlt,
            color: colors.text,
            borderRadius: radius.md,
          },
        ]}
      />
      <Button
        title="Save name"
        onPress={() => updateProfile({ name: name.trim() })}
        style={{ marginTop: 12 }}
        variant="secondary"
      />

      <Text style={[typography.h3, { color: colors.text, marginTop: 28, marginBottom: 10 }]}>
        Theme
      </Text>
      <View style={[styles.seg, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
        {themes.map((t) => {
          const active = themePreference === t;
          return (
            <Pressable
              key={t}
              onPress={() => setThemePreference(t)}
              style={[
                styles.segItem,
                active && {
                  backgroundColor: colors.primary,
                  borderRadius: radius.sm,
                  ...shadows.soft,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelMd,
                  {
                    color: active ? '#fff' : colors.textSecondary,
                    textTransform: 'capitalize',
                  },
                ]}
              >
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[typography.h3, { color: colors.text, marginTop: 36, marginBottom: 10 }]}>
        Danger zone
      </Text>
      <Button
        title="Reset all data"
        variant="danger"
        icon="trash-outline"
        onPress={() =>
          Alert.alert(
            'Reset HabitFlow?',
            'All habits, streaks, and achievements will be deleted.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: async () => {
                  await resetAllData();
                  navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
                },
              },
            ],
          )
        }
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
  input: {
    height: 52,
    paddingHorizontal: 16,
  },
  seg: { flexDirection: 'row', padding: 4 },
  segItem: { flex: 1, paddingVertical: 12, alignItems: 'center' },
});
