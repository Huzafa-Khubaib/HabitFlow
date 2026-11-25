import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { showInterstitialIfReady } from '../ads/AdManager';
import { HabitForm } from '../components/HabitForm';
import { Screen } from '../components/Screen';
import { useHabits } from '../store/HabitContext';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddHabit'>;

export function AddHabitScreen({ navigation }: Props) {
  const { colors, typography } = useTheme();
  const { addHabit } = useHabits();

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text }]}>Add Habit</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
      </View>
      <HabitForm
        submitLabel="Create Habit"
        onSubmit={async (input) => {
          const habit = await addHabit(input);
          // Never block navigation if ad is not ready / fails
          try {
            await showInterstitialIfReady();
          } catch {
            // ignore
          }
          navigation.replace('Celebration', {
            title: 'Habit created! 🎉',
            subtitle: `${habit.name} is ready. Keep the streak going.`,
            habitId: habit.id,
          });
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
});
