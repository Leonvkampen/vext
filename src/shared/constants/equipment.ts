/** Equipment constants - enum values and display labels for exercise equipment types. */
import { Equipment } from '@shared/types/exercise';

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  [Equipment.Barbell]: 'Barbell',
  [Equipment.Dumbbell]: 'Dumbbell',
  [Equipment.Machine]: 'Machine',
  [Equipment.Cable]: 'Cable',
  [Equipment.Bodyweight]: 'Bodyweight',
  [Equipment.CardioMachine]: 'Cardio Machine',
  [Equipment.None]: 'None',
};

export const ALL_EQUIPMENT = Object.values(Equipment);
