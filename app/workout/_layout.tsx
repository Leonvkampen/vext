/** Workout layout - Stack navigator wrapper for the active workout screens. */
import React from 'react';
import { Stack } from 'expo-router';

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'rgb(10, 10, 15)' },
        animation: 'slide_from_right',
      }}
    />
  );
}
