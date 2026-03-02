/** Tracks time spent actively viewing a specific workout screen. Pauses when navigating away. */
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { create } from 'zustand';

interface TimerState {
  accumulated: number; // seconds built up in previous focus sessions
  focusedAt: number | null; // Date.now() when screen last focused, null if not focused
}

interface WorkoutTimerStore {
  timers: Record<string, TimerState>;
  onFocus: (workoutId: string) => void;
  onBlur: (workoutId: string) => void;
  clear: (workoutId: string) => void;
}

const useWorkoutTimerStore = create<WorkoutTimerStore>((set) => ({
  timers: {},
  onFocus: (workoutId) =>
    set((state) => ({
      timers: {
        ...state.timers,
        [workoutId]: {
          accumulated: state.timers[workoutId]?.accumulated ?? 0,
          focusedAt: Date.now(),
        },
      },
    })),
  onBlur: (workoutId) =>
    set((state) => {
      const timer = state.timers[workoutId];
      if (!timer?.focusedAt) return state;
      const delta = Math.floor((Date.now() - timer.focusedAt) / 1000);
      return {
        timers: {
          ...state.timers,
          [workoutId]: { accumulated: timer.accumulated + delta, focusedAt: null },
        },
      };
    }),
  clear: (workoutId) =>
    set((state) => {
      const { [workoutId]: _, ...rest } = state.timers;
      return { timers: rest };
    }),
}));

export function useWorkoutTimer(workoutId: string) {
  const onFocus = useWorkoutTimerStore((s) => s.onFocus);
  const onBlur = useWorkoutTimerStore((s) => s.onBlur);
  const clear = useWorkoutTimerStore((s) => s.clear);
  const timer = useWorkoutTimerStore((s) => s.timers[workoutId]);

  // Force a re-render each second while focused so the display updates
  const [, setTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      onFocus(workoutId);
      const interval = setInterval(() => setTick((t) => t + 1), 1000);
      return () => {
        clearInterval(interval);
        onBlur(workoutId);
      };
    }, [workoutId, onFocus, onBlur])
  );

  const elapsed = timer
    ? timer.accumulated +
      (timer.focusedAt ? Math.floor((Date.now() - timer.focusedAt) / 1000) : 0)
    : 0;

  return { elapsed, clear };
}
