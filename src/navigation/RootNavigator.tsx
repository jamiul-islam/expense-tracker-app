import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserStore } from '@/store';
import { SplashScreen, LoginScreen } from '@/screens/auth';
import { AppNavigator } from './AppNavigator';

const Stack = createStackNavigator();

export function RootNavigator() {
  const [isInitializing, setIsInitializing] = useState(true);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Allow splash screen to show
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isInitializing ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : user ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
