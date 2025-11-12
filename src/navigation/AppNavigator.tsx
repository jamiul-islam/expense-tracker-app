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
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.background.secondary,
          borderTopWidth: 1,
          elevation: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: {
            height: -2,
            width: 0,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 4,
        },
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="home" color={color} size={size} />
            </View>
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="list" color={color} size={size} />
            </View>
          ),
          tabBarLabel: 'Transactions',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="bar-chart" color={color} size={size} />
            </View>
          ),
          tabBarLabel: 'Analytics',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: colors.background.activeTab,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 60,
  },
  tabBarBackground: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
