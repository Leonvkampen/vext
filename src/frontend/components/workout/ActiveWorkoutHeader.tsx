/** ActiveWorkoutHeader - displays workout name and type during an active workout. */
import React from 'react';
import { View, Text } from 'react-native';

type ActiveWorkoutHeaderProps = {
  workoutName: string | null;
  workoutTypeName: string;
};

export function ActiveWorkoutHeader({ workoutName, workoutTypeName }: ActiveWorkoutHeaderProps) {
  return (
    <View className="px-4 py-3">
      <Text className="text-xl font-bold text-foreground">
        {workoutName || workoutTypeName}
      </Text>
    </View>
  );
}
