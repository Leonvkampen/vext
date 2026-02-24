import { useQuery } from '@tanstack/react-query';
import * as progressService from '@backend/services/progressService';
import { useDatabase } from '@frontend/hooks/useDatabase';

export function usePersonalRecords(exerciseId: string | null) {
  const db = useDatabase();
  return useQuery({
    queryKey: ['personalRecords', exerciseId],
    queryFn: () => progressService.getPersonalRecords(db, exerciseId!),
    enabled: !!exerciseId,
    staleTime: 60 * 1000,
  });
}

export function useVolumeOverTime(exerciseId: string | null, weeks = 12) {
  const db = useDatabase();
  return useQuery({
    queryKey: ['volumeOverTime', exerciseId, weeks],
    queryFn: () => progressService.getVolumeOverTime(db, exerciseId!, weeks),
    enabled: !!exerciseId,
    staleTime: 60 * 1000,
  });
}

export function useWorkoutFrequency(weeks = 12) {
  const db = useDatabase();
  return useQuery({
    queryKey: ['workoutFrequency', weeks],
    queryFn: () => progressService.getWorkoutFrequency(db, weeks),
    staleTime: 60 * 1000,
  });
}
