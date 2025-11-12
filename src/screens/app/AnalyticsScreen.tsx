import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Analytics Screen</Text>
      <Text style={styles.subtext}>Coming in Phase 5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: colors.text.secondary,
  },
});
