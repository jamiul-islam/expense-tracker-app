import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme';
import DashboardScreen from '@/screens/app/DashboardScreen';
import TransactionsScreen from '@/screens/app/TransactionsScreen';
import AnalyticsScreen from '@/screens/app/AnalyticsScreen';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          elevation: 8,
          height: 86,
          paddingBottom: 20,
          paddingHorizontal: 16,
          paddingTop: 12,
          shadowColor: '#0F0E33',
          shadowOffset: {
            height: 1,
            width: 0,
          },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          borderRadius: 40,
          marginHorizontal: 4,
          paddingHorizontal: 14,
          paddingVertical: 12,
        },
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              color={focused ? colors.primaryText : colors.text.tertiary}
              size={20}
            />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="list"
              color={focused ? colors.primaryText : colors.text.tertiary}
              size={20}
            />
          ),
          tabBarLabel: 'Transactions',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="bar-chart"
              color={focused ? colors.primaryText : colors.text.tertiary}
              size={20}
            />
          ),
          tabBarLabel: 'Analytics',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
