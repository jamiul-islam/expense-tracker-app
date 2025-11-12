/**
 * ErrorBoundary Component - Catch and display React errors
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { Text } from './Text';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text preset="h2" style={styles.title}>
            Oops! Something went wrong
          </Text>
          <Text preset="body" style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button title="Try Again" onPress={this.handleReset} style={styles.button} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  button: {
    minWidth: 200,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    flex: 1,
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  message: {
    color: colors.text.secondary,
    marginBottom: spacing['2xl'],
    textAlign: 'center',
  },
  title: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});

export default ErrorBoundary;
