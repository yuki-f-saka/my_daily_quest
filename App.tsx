import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme as NavTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AchievementUnlockedModal } from './src/components/AchievementUnlockedModal';
import { AchievementsScreen } from './src/screens/AchievementsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SoundProvider } from './src/soundStore';
import { useXPStore, XPProvider } from './src/store';
import { ThemeProvider, useTheme } from './src/themeStore';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: 'home',
  History: 'time',
  Achievements: 'sparkles',
} as const;

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SoundProvider>
          <XPProvider>
            <Root />
          </XPProvider>
        </SoundProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const theme = useTheme();
  const { ready, pendingUnlock, dismissPendingUnlock } = useXPStore();

  const navTheme: NavTheme = {
    ...(theme.dark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.dark ? DarkTheme : DefaultTheme).colors,
      background: theme.bg,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      primary: theme.accent,
    },
  };

  // Keeps the XP numbers from flashing 0 before the local log is read.
  if (!ready) return <View style={[styles.blank, { backgroundColor: theme.bg }]} />;

  return (
    <NavigationContainer theme={navTheme}>
      {/* Follows the resolved theme, not the system, so an in-app override stays readable. */}
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: theme.muted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
          tabBarIcon: ({ color, size, focused }) => {
            const icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
            return <Ionicons name={focused ? icon : `${icon}-outline`} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Achievements" component={AchievementsScreen} />
      </Tab.Navigator>
      <AchievementUnlockedModal achievement={pendingUnlock} onDismiss={dismissPendingUnlock} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  blank: {
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
