import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { DosePlan, ReminderSettings } from '@/types/app-data';

type ReminderKind = 'dose' | 'water' | 'protein';
type NotificationSyncUpdates = Partial<ReminderSettings>;

const androidChannelId = 'trackglp-reminders';

const reminderContent: Record<ReminderKind, Notifications.NotificationContentInput> = {
  water: {
    title: 'Time to hydrate',
    body: 'A little water check-in can help you stay on track today.',
    data: { reminderKind: 'water' },
  },
  protein: {
    title: 'Protein check-in',
    body: "See how you're doing with today's protein goal.",
    data: { reminderKind: 'protein' },
  },
  dose: {
    title: 'Dose reminder',
    body: 'Your scheduled GLP-1 dose is today.',
    data: { reminderKind: 'dose' },
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(allowRequest = true) {
  if (Platform.OS === 'web') return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!allowRequest || !current.canAskAgain) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleDailyReminder(kind: 'water' | 'protein', time: string) {
  const parsed = parseTime(time);
  if (!parsed || Platform.OS === 'web') return null;
  await ensureAndroidChannel();

  return Notifications.scheduleNotificationAsync({
    content: reminderContent[kind],
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: Platform.OS === 'android' ? androidChannelId : undefined,
      hour: parsed.hour,
      minute: parsed.minute,
    },
  });
}

export async function scheduleDoseReminder(plan: DosePlan, time: string) {
  const parsed = parseTime(time);
  const weekday = getExpoWeekday(plan.scheduledDay);
  if (!parsed || !weekday || Platform.OS === 'web') return null;
  await ensureAndroidChannel();

  return Notifications.scheduleNotificationAsync({
    content: reminderContent.dose,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      channelId: Platform.OS === 'android' ? androidChannelId : undefined,
      weekday,
      hour: parsed.hour,
      minute: parsed.minute,
    },
  });
}

export async function cancelReminder(notificationId?: string) {
  if (!notificationId || Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function replaceDailyReminder(
  kind: 'water' | 'protein',
  currentId: string | undefined,
  time: string,
) {
  await cancelReminder(currentId);
  return scheduleDailyReminder(kind, time);
}

export async function replaceDoseReminder(
  currentId: string | undefined,
  plan: DosePlan,
  time: string,
) {
  await cancelReminder(currentId);
  return scheduleDoseReminder(plan, time);
}

export async function syncNotificationsFromSettings(
  reminders: ReminderSettings,
  dosePlan: DosePlan,
): Promise<NotificationSyncUpdates> {
  if (Platform.OS === 'web') return {};

  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) {
    await Promise.all([
      cancelReminder(reminders.doseNotificationId),
      cancelReminder(reminders.waterNotificationId),
      cancelReminder(reminders.proteinNotificationId),
    ]);
    return {
      doseEnabled: false,
      waterEnabled: false,
      proteinEnabled: false,
      doseNotificationId: undefined,
      waterNotificationId: undefined,
      proteinNotificationId: undefined,
      notificationPermissionDenied: reminders.doseEnabled || reminders.waterEnabled || reminders.proteinEnabled
        ? true
        : reminders.notificationPermissionDenied,
    };
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const scheduledIds = new Set(scheduled.map((notification) => notification.identifier));
  const updates: NotificationSyncUpdates = { notificationPermissionDenied: false };

  await syncDaily('water', reminders.waterEnabled, reminders.waterTime ?? '10:00', reminders.waterNotificationId);
  await syncDaily('protein', reminders.proteinEnabled, reminders.proteinTime ?? '13:00', reminders.proteinNotificationId);

  const doseCanSchedule = Boolean(dosePlan.medication && dosePlan.scheduledDay);
  const doseId = reminders.doseNotificationId;
  if (!reminders.doseEnabled || !doseCanSchedule) {
    await cancelReminder(doseId);
    if (doseId) updates.doseNotificationId = undefined;
  } else if (!doseId || !scheduledIds.has(doseId)) {
    updates.doseNotificationId = await scheduleDoseReminder(dosePlan, reminders.doseTime ?? '09:00') ?? undefined;
  }

  return updates;

  async function syncDaily(
    kind: 'water' | 'protein',
    enabled: boolean,
    time: string,
    currentId?: string,
  ) {
    const idKey = `${kind}NotificationId` as const;
    if (!enabled) {
      await cancelReminder(currentId);
      if (currentId) updates[idKey] = undefined;
      return;
    }
    if (!currentId || !scheduledIds.has(currentId)) {
      updates[idKey] = await scheduleDailyReminder(kind, time) ?? undefined;
    }
  }
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(androidChannelId, {
    name: 'TrackGLP reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function parseTime(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function getExpoWeekday(day?: string | null) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const index = day ? days.indexOf(day) : -1;
  return index < 0 ? null : index + 1;
}
