import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadows } from '../theme';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../types';

const TABS: {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { name: 'Stats', label: 'Stats', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
  { name: 'RemindersTab', label: 'Alerts', icon: 'notifications-outline', iconActive: 'notifications' },
  { name: 'Profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const rootNav =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  const renderTab = (tab: (typeof TABS)[0]) => {
    const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
    const focused = state.index === routeIndex;
    return (
      <Pressable
        key={tab.name}
        onPress={() => navigation.navigate(tab.name)}
        style={styles.tab}
        accessibilityRole="button"
        accessibilityState={focused ? { selected: true } : {}}
      >
        <Ionicons
          name={focused ? tab.iconActive : tab.icon}
          size={22}
          color={focused ? colors.primary : colors.tabInactive}
        />
        <Text
          style={[
            typography.labelMd,
            {
              color: focused ? colors.primary : colors.tabInactive,
              marginTop: 2,
              fontSize: 11,
            },
          ]}
        >
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View
        style={[
          styles.dock,
          shadows.card,
          { backgroundColor: colors.tabBar, borderColor: colors.borderSoft },
        ]}
      >
        <View style={styles.side}>{left.map(renderTab)}</View>

        <View style={styles.fabSlot}>
          <Pressable
            onPress={() => rootNav.navigate('AddHabit')}
            style={({ pressed }) => [
              styles.fab,
              shadows.fab,
              {
                backgroundColor: colors.primary,
                transform: [{ scale: pressed ? 0.94 : 1 }],
              },
            ]}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.side}>{right.map(renderTab)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
  },
  dock: {
    height: 64,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 4,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minWidth: 56,
  },
  fabSlot: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    top: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
