import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '@/theme';
import DashboardScreen from '@/screens/app/DashboardScreen';
import TransactionsScreen from '@/screens/app/TransactionsScreen';
import AnalyticsScreen from '@/screens/app/AnalyticsScreen';

const Tab = createBottomTabNavigator();

// Custom Tab Button Component
const CustomTabBarButton = (props: any) => {
  const focused = props.accessibilityState?.selected;
  return (
    <TouchableOpacity
      {...props}
      style={[styles.tabButton, focused && styles.tabButtonActive]}
      activeOpacity={0.7}
    >
      {props.children}
    </TouchableOpacity>
  );
};

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 2,
          height: 86,
          paddingBottom: 20,
          paddingHorizontal: spacing.lg,
          paddingTop: 12,
          shadowColor: '#0F0E33',
          shadowOffset: {
            height: 1,
            width: 0,
          },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
          marginLeft: spacing.sm,
        },
        tabBarIconStyle: {
          marginRight: 0,
        },
        tabBarLabelPosition: 'beside-icon',
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color }) => <Ionicons name="list" size={20} color={color} />,
          tabBarLabel: 'Transactions',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={20} color={color} />,
          tabBarLabel: 'Analytics',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    alignItems: 'center',
    borderRadius: 40,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  tabButtonActive: {
    backgroundColor: colors.background.activeTab,
  },
});
