import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

import { OnboardingFlow, OnboardingLoadingScreen } from '@/components/onboarding/onboarding-flow';
import { AppDataProvider, useAppData } from '@/context/app-data-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { syncNotificationsFromSettings } from '@/services/local-notifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppDataProvider>
      <NotificationStartupSync />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppEntry />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppDataProvider>
  );
}

function NotificationStartupSync() {
  const { data, isLoading, updateReminderSettings } = useAppData();
  const synced = useRef(false);

  useEffect(() => {
    if (isLoading || !data.profile.onboardingCompleted || synced.current) return;
    synced.current = true;

    syncNotificationsFromSettings(data.reminders, data.dosePlan)
      .then((updates) => {
        if (Object.keys(updates).length > 0) updateReminderSettings(updates);
      })
      .catch((error) => {
        if (__DEV__) console.warn('Could not sync local reminders.', error);
      });
  }, [data.dosePlan, data.profile.onboardingCompleted, data.reminders, isLoading, updateReminderSettings]);

  return null;
}

function AppEntry() {
  const { data, isLoading } = useAppData();

  if (isLoading) return <OnboardingLoadingScreen />;
  if (!data.profile.onboardingCompleted) return <OnboardingFlow />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name="dev-data" options={{ headerShown: false }} />
    </Stack>
  );
}
