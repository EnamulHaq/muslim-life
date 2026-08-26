import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { OfflineReadingBootstrap } from '@/components/OfflineReadingBootstrap';
import { AppUpdateModal } from '@/components/ui/AppUpdateModal';
import { AppThemeProvider, useAppTheme } from '@/context/AppThemeContext';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { usePrayerNotifications } from '@/hooks/usePrayerNotifications';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function AppUpdateBootstrap() {
  const { showModal, updateInfo, handleUpdate, handleDismiss } = useAppUpdate();

  return (
    <AppUpdateModal
      visible={showModal}
      updateInfo={updateInfo}
      onUpdate={handleUpdate}
      onDismiss={handleDismiss}
    />
  );
}

function PrayerNotificationBootstrap() {
  usePrayerNotifications();
  return null;
}

function ThemedNavigation() {
  const { colors, isDark } = useAppTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="quran/[id]" />
        <Stack.Screen name="quran/tafsir/[id]" />
        <Stack.Screen name="features/prayer-times" />
        <Stack.Screen name="features/nurani-qaida/index" />
        <Stack.Screen name="features/nurani-qaida/[id]" />
        <Stack.Screen name="features/hifz" />
        <Stack.Screen name="features/hadith" />
        <Stack.Screen name="features/dua" />
        <Stack.Screen name="features/fitness" />
        <Stack.Screen name="features/tasbih" />
        <Stack.Screen name="features/qibla" />
        <Stack.Screen name="features/zakat" />
        <Stack.Screen name="features/calendar" />
        <Stack.Screen name="features/names-of-allah" />
        <Stack.Screen name="features/hajj" />
        <Stack.Screen name="features/scholar" />
        <Stack.Screen name="features/matrimonial" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <PrayerNotificationBootstrap />
      <OfflineReadingBootstrap />
      <AppUpdateBootstrap />
      <AppThemeProvider>
        <ThemedNavigation />
      </AppThemeProvider>
    </>
  );
}
