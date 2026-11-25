import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Habit } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habit-reminders', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  return status === 'granted';
}

function parseTime(time: string): { hour: number; minute: number } {
  const [hour, minute] = time.split(':').map(Number);
  return { hour: hour || 0, minute: minute || 0 };
}

/** Cancel all existing habit reminders and reschedule from habits list */
export async function syncHabitReminders(habits: Habit[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  for (const habit of habits) {
    if (!habit.reminderTime) continue;
    const { hour, minute } = parseTime(habit.reminderTime);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'HabitFlow Reminder',
        body: `Time for: ${habit.name}`,
        data: { habitId: habit.id },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: Platform.OS === 'android' ? 'habit-reminders' : undefined,
      },
    });
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
