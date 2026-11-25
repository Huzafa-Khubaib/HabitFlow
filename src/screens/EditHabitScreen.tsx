import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { showInterstitialIfReady } from '../ads/AdManager';
import { HabitForm } from '../components/HabitForm';
import { Screen } from '../components/Screen';
import { useHabits } from '../store/HabitContext';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditHabit'>;

export function EditHabitScreen({ navigation, route }: Props) {
  const { colors, typography } = useTheme();
  const { habits, updateHabit, deleteHabit } = useHabits();
  const habit = habits.find((h) => h.id === route.params.habitId);

  if (!habit) {
    return (
      <Screen>
        <Text style={{ padding: 24, color: colors.text }}>Habit not found.</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[typography.h3, { color: colors.text }]}>Edit Habit</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
      </View>
      <HabitForm
        initial={{
          name: habit.name,
          icon: habit.icon,
          color: habit.color,
          frequency: habit.frequency,
          customDays: habit.customDays,
          reminderTime: habit.reminderTime,
        }}
        submitLabel="Save Changes"
        onSubmit={async (input) => {
          await updateHabit(habit.id, input);
          try {
            await showInterstitialIfReady();
          } catch {
            // ignore
          }
          navigation.goBack();
        }}
        onDelete={() => {
          Alert.alert('Delete habit?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                await deleteHabit(habit.id);
                navigation.popToTop();
              },
            },
          ]);
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
