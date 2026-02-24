import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import * as exerciseModel from '@backend/models/exercise';
import { useDatabase } from '@frontend/hooks/useDatabase';
import type { ExerciseCategory } from '@shared/types/exercise';
import { APP_CONFIG } from '@config/app';

export function useExercises(category?: ExerciseCategory) {
  const db = useDatabase();
  return useQuery({
    queryKey: ['exercises', category ?? 'all'],
    queryFn: () => category ? exerciseModel.getByCategory(db, category) : exerciseModel.getAll(db),
    staleTime: 5 * 60 * 1000, // exercises are static
  });
}

export function useExerciseSearch(query: string) {
  const db = useDatabase();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), APP_CONFIG.defaults.searchDebounceMs);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery({
    queryKey: ['exercises', 'search', debouncedQuery],
    queryFn: () => exerciseModel.search(db, debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExercise(id: string) {
  const db = useDatabase();
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: () => exerciseModel.getById(db, id),
    enabled: !!id,
  });
}
