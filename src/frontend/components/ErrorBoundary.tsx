/** ErrorBoundary - catches React render errors and displays a fallback UI. */
import React, { Component } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-background px-8">
          <Ionicons name="warning-outline" size={48} color="rgb(239, 68, 68)" />
          <Text className="mt-4 text-lg font-semibold text-foreground">Something went wrong</Text>
          <Text className="mt-2 text-center text-sm text-foreground-muted">
            {this.state.error?.message ?? 'An unexpected error occurred'}
          </Text>
          <Pressable onPress={this.handleReset} className="mt-6 rounded-lg bg-primary px-6 py-3">
            <Text className="font-semibold text-background">Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
