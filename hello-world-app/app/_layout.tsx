import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { OnboardingFlow, OnboardingLoadingScreen } from '@/components/onboarding/onboarding-flow';
import { AppDataProvider, useAppData } from '@/context/app-data-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppDataProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppEntry />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppDataProvider>
  );
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
