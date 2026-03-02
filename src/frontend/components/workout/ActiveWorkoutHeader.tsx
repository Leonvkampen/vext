/** ActiveWorkoutHeader - displays workout name, type, and elapsed time during an active workout. */
import React from 'react';
import { View, Text } from 'react-native';
import { formatTimerDisplay } from '@shared/utils/formatting';

type ActiveWorkoutHeaderProps = {
  workoutName: string | null;
  workoutTypeName: string;
  elapsed: number;
};

export function ActiveWorkoutHeader({ workoutName, workoutTypeName, elapsed }: ActiveWorkoutHeaderProps) {
  return (
    <View className="px-4 py-3">
      <Text className="text-xl font-bold text-foreground">
        {workoutName || workoutTypeName}
      </Text>
      <Text className="mt-1 text-sm text-primary font-medium">
        Elapsed: {formatTimerDisplay(elapsed)}
      </Text>
    </View>
  );
}
