import 'react-native-gesture-handler';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  initAds,
  markAppBackgrounded,
  showAppOpenIfReady,
} from './src/ads/AdManager';
import { RootNavigator } from './src/navigation/RootNavigator';
import { HabitProvider } from './src/store/HabitContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function StatusBarBridge() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const appState = useRef<AppStateStatus>(
    (AppState.currentState as AppStateStatus) || 'active',
  );

  useEffect(() => {
    // Consent + Mobile Ads SDK init (no-op in Expo Go)
    initAds().catch(() => undefined);
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = appState.current;
      appState.current = next;

      if (next === 'background' || next === 'inactive') {
        markAppBackgrounded().catch(() => undefined);
      }

      // Resume from background → App Open (rules inside AdManager)
      if (
        (prev === 'background' || prev === 'inactive') &&
        next === 'active'
      ) {
        setTimeout(() => {
          showAppOpenIfReady().catch(() => undefined);
        }, 400);
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#F8F9FD' }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HabitProvider>
          <ThemeProvider>
            <StatusBarBridge />
            <RootNavigator />
          </ThemeProvider>
        </HabitProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
