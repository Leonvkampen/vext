/** Timer service - default rest timer durations per exercise category. */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { ExerciseCategory } from '@shared/types/exercise';
import { APP_CONFIG } from '@config/app';

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('rest-timer', {
      name: 'Rest Timer',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

export async function scheduleRestTimer(seconds: number): Promise<string> {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Rest Complete',
      body: 'Time for your next set!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
  return identifier;
}

export async function cancelRestTimer(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllRestTimers(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export function getDefaultRestSeconds(category: ExerciseCategory): number {
  switch (category) {
    case ExerciseCategory.Strength:
      return APP_CONFIG.defaults.restSeconds.strength;
    case ExerciseCategory.Cardio:
      return APP_CONFIG.defaults.restSeconds.cardio;
    case ExerciseCategory.Flexibility:
      return APP_CONFIG.defaults.restSeconds.flexibility;
    default:
      return APP_CONFIG.defaults.restSeconds.strength;
  }
}

// Re-export Device for consumers that need to check physical device availability
export { Device };
