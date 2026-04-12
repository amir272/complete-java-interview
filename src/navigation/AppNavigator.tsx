import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, typography } from '../theme';

import { HomeScreen } from '../screens/HomeScreen';
import { DSACategoriesScreen } from '../screens/DSACategoriesScreen';
import { ProblemListScreen } from '../screens/ProblemListScreen';
import { ProblemDetailScreen } from '../screens/ProblemDetailScreen';
import { JavaTopicsScreen } from '../screens/JavaTopicsScreen';
import { JavaQAScreen } from '../screens/JavaQAScreen';
import { PatternSkillScreen } from '../screens/PatternSkillScreen';
import { Text } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
    notification: colors.secondary,
  },
};

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface, elevation: 0, shadowOpacity: 0 },
  headerTintColor: colors.text,
  headerTitleStyle: { ...typography.h4, color: colors.text },
  cardStyle: { backgroundColor: colors.background },
  animationEnabled: true,
  gestureEnabled: true,
};

function DSAStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="DSACategories" component={DSACategoriesScreen} options={{ title: 'DSA Patterns' }} />
      <Stack.Screen name="ProblemList" component={ProblemListScreen} options={{ title: 'Problems' }} />
      <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} options={{ title: 'Problem' }} />
    </Stack.Navigator>
  );
}

function JavaStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="JavaTopics" component={JavaTopicsScreen} options={{ title: 'Java Topics' }} />
      <Stack.Screen name="JavaQA" component={JavaQAScreen} options={{ title: 'Q & A' }} />
    </Stack.Navigator>
  );
}

function PatternStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="PatternSkill" component={PatternSkillScreen} options={{ title: 'Pattern Skill' }} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DSACategories" component={DSACategoriesScreen} options={{ title: 'DSA Patterns' }} />
      <Stack.Screen name="ProblemList" component={ProblemListScreen} options={{ title: 'Problems' }} />
      <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} options={{ title: 'Problem' }} />
      <Stack.Screen name="JavaTopics" component={JavaTopicsScreen} options={{ title: 'Java Topics' }} />
      <Stack.Screen name="JavaQA" component={JavaQAScreen} options={{ title: 'Q & A' }} />
      <Stack.Screen name="PatternSkill" component={PatternSkillScreen} options={{ title: 'Pattern Skill' }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: Platform.OS === 'ios' ? 4 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 80 : 60,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { ...typography.caption, fontWeight: '600' },
          tabBarIcon: ({ focused, color }) => {
            const icons: Record<string, string> = {
              HomeTab: '🏠',
              DSATab: '⚡',
              JavaTab: '☕',
              PatternTab: '🎯',
            };
            return <Text style={{ fontSize: focused ? 22 : 20 }}>{icons[route.name]}</Text>;
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="DSATab" component={DSAStack} options={{ title: 'DSA' }} />
        <Tab.Screen name="JavaTab" component={JavaStack} options={{ title: 'Java' }} />
        <Tab.Screen name="PatternTab" component={PatternStack} options={{ title: 'Pattern' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
