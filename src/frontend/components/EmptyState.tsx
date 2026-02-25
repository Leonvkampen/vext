/** EmptyState - reusable placeholder component with icon, message, and optional action button. */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon = 'fitness-outline', title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Ionicons name={icon} size={48} color="rgb(115, 115, 115)" />
      <Text className="mt-4 text-lg font-semibold text-foreground">{title}</Text>
      <Text className="mt-2 text-center text-sm text-foreground-muted">{message}</Text>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="mt-6 rounded-lg bg-primary px-6 py-3"
        >
          <Text className="font-semibold text-background">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
