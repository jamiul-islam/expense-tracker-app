import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

export default function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Transactions Screen</Text>
      <Text style={styles.subtext}>Coming in Phase 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    flex: 1,
    justifyContent: 'center',
  },
  subtext: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  text: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
