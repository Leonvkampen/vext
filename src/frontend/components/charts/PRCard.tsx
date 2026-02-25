/** PRCard - displays a personal record with exercise name and best lift. */
import React from 'react';
import { View, Text } from 'react-native';

type PRCardProps = {
  label: string;
  value: string | number | null;
  unit?: string;
};

export function PRCard({ label, value, unit }: PRCardProps) {
  return (
    <View className="flex-1 rounded-xl bg-background-50 p-3 items-center">
      <Text className="text-2xl font-bold text-primary">
        {value != null ? value : '—'}
      </Text>
      {unit && value != null && (
        <Text className="text-xs text-foreground-subtle">{unit}</Text>
      )}
      <Text className="mt-1 text-xs text-foreground-muted">{label}</Text>
    </View>
  );
}
