import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AboutScreen } from '../screens/AboutScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { AddHabitScreen } from '../screens/AddHabitScreen';
import { CelebrationScreen } from '../screens/CelebrationScreen';
import { ChooseGoalsScreen } from '../screens/ChooseGoalsScreen';
import { EditHabitScreen } from '../screens/EditHabitScreen';
import { HabitDetailScreen } from '../screens/HabitDetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { NameSetupScreen } from '../screens/NameSetupScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
import { RemoveAdsScreen } from '../screens/RemoveAdsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { useTheme } from '../theme/ThemeContext';
import { MainTabParamList, RootStackParamList } from '../types';
import { FloatingTabBar } from './FloatingTabBar';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen
        name="RemindersTab"
        component={RemindersScreen}
        options={{ title: 'Alerts' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="ChooseGoals" component={ChooseGoalsScreen} />
        <Stack.Screen name="NameSetup" component={NameSetupScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="AddHabit"
          component={AddHabitScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="EditHabit" component={EditHabitScreen} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="RemoveAds" component={RemoveAdsScreen} />
        <Stack.Screen
          name="Celebration"
          component={CelebrationScreen}
          options={{ presentation: 'modal', animation: 'fade_from_bottom' }}
        />
        {/* Reminders also reachable from stack if needed */}
        <Stack.Screen name="Reminders" component={RemindersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
