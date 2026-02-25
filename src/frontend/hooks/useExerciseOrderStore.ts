/** Zustand store for optimistic exercise reorder — drives UI instantly while DB mutation is in-flight. */
import { create } from 'zustand';

interface ExerciseOrderState {
  /** Map of workoutId -> optimistic ordered exercise IDs */
  orders: Record<string, string[]>;
  setOrder: (workoutId: string, orderedIds: string[]) => void;
  clearOrder: (workoutId: string) => void;
}

export const useExerciseOrderStore = create<ExerciseOrderState>((set) => ({
  orders: {},
  setOrder: (workoutId, orderedIds) =>
    set((state) => ({ orders: { ...state.orders, [workoutId]: orderedIds } })),
  clearOrder: (workoutId) =>
    set((state) => {
      const { [workoutId]: _, ...rest } = state.orders;
      return { orders: rest };
    }),
}));
