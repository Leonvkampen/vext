/** Muscle group constants - enum values and display labels for all muscle groups. */
import { MuscleGroup } from '@shared/types/exercise';

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  [MuscleGroup.Chest]: 'Chest',
  [MuscleGroup.Back]: 'Back',
  [MuscleGroup.Shoulders]: 'Shoulders',
  [MuscleGroup.Biceps]: 'Biceps',
  [MuscleGroup.Triceps]: 'Triceps',
  [MuscleGroup.Quads]: 'Quads',
  [MuscleGroup.Hamstrings]: 'Hamstrings',
  [MuscleGroup.Glutes]: 'Glutes',
  [MuscleGroup.Calves]: 'Calves',
  [MuscleGroup.Core]: 'Core',
  [MuscleGroup.FullBody]: 'Full Body',
};

export const ALL_MUSCLE_GROUPS = Object.values(MuscleGroup);
