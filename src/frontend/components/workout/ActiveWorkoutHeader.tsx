import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { formatTimerDisplay } from '@shared/utils/formatting';

type ActiveWorkoutHeaderProps = {
  workoutName: string | null;
  workoutTypeName: string;
  startedAt: string;
};

export function ActiveWorkoutHeader({ workoutName, workoutTypeName, startedAt }: ActiveWorkoutHeaderProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    const update = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <View className="px-4 py-3">
      <Text className="text-xl font-bold text-foreground">
        {workoutName || workoutTypeName}
      </Text>
      <Text className="mt-1 text-sm text-primary font-medium">
        {formatTimerDisplay(elapsed)}
      </Text>
    </View>
  );
}
