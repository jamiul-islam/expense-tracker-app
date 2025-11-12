import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';
import { colors, spacing, borderRadius, layout } from '@/theme';
import DashboardScreen from '@/screens/app/DashboardScreen';
import TransactionsScreen from '@/screens/app/TransactionsScreen';
import AnalyticsScreen from '@/screens/app/AnalyticsScreen';

const Tab = createBottomTabNavigator();

const TAB_ITEMS = [
  {
    name: 'Home',
    component: DashboardScreen,
    label: 'Home',
    icon: 'home' as const,
  },
  {
    name: 'Transactions',
    component: TransactionsScreen,
    label: 'Transactions',
    icon: 'list' as const,
  },
  {
    name: 'Analytics',
    component: AnalyticsScreen,
    label: 'Analytics',
    icon: 'bar-chart' as const,
  },
];

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
          height: layout.tabBarHeight + spacing.xl,
          paddingBottom: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          shadowColor: '#0F0E33',
          shadowOffset: {
            height: 1,
            width: 0,
          },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        },
        tabBarShowLabel: false, // We'll render custom labels
        tabBarItemStyle: {
          borderRadius: 40,
          marginHorizontal: 4,
          flex: 1,
        },
      }}
    >
      {TAB_ITEMS.map(({ name, component, label, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <TabBarIcon focused={focused} color={color} icon={icon} label={label} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

type TabBarIconProps = {
  color: string;
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

function TabBarIcon({ focused, color, icon, label }: TabBarIconProps) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.tabInner, focused && styles.tabInnerActive]}>
        <Ionicons
          name={icon}
          size={20}
          color={focused ? colors.primary : color}
        />
        <Text
          numberOfLines={1}
          // adjustsFontSizeToFit
          minimumFontScale={0.95}
          style={[
            styles.tabLabel,
            focused ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabInner: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: 110,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tabInnerActive: {
    backgroundColor: colors.background.activeTab,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tabLabel: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  tabLabelActive: {
    color: colors.primaryText,
  },
  tabLabelInactive: {
    color: colors.text.tertiary,
  },
});
