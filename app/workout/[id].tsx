import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActiveWorkoutHeader } from '@frontend/components/workout/ActiveWorkoutHeader';
import { ExerciseCard } from '@frontend/components/workout/ExerciseCard';
import { ExercisePicker } from '@frontend/components/overlay/ExercisePicker';
import { ConfirmDialog } from '@frontend/components/overlay/ConfirmDialog';
import { EmptyState } from '@frontend/components/EmptyState';
import { RestTimer } from '@frontend/components/workout/RestTimer';
import { useTimerStore } from '@frontend/hooks/useTimer';
import {
  useFullWorkout,
  useAddExercise,
  useLogSet,
  useUpdateSet,
  useRemoveSet,
  useRemoveExercise,
  useCompleteWorkout,
  useDiscardWorkout,
  useUpdateWorkoutExerciseRestSeconds,
  useUpdateExerciseTargetReps,
} from '@frontend/hooks/useWorkout';
import { usePreviousSetsForExercises } from '@frontend/hooks/useHistory';
import type { Exercise } from '@shared/types/exercise';
import { cn } from '@frontend/lib/utils';

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const startTimer = useTimerStore((s) => s.startTimer);

  const { data: workout, isLoading } = useFullWorkout(id);
  const exerciseIds = React.useMemo(
    () => workout?.exercises.map((ex) => ex.exerciseId) ?? [],
    [workout?.exercises]
  );
  const { data: previousSetsMap } = usePreviousSetsForExercises(exerciseIds);
  const addExercise = useAddExercise(id!);
  const logSet = useLogSet(id!);
  const updateSet = useUpdateSet(id!);
  const removeSet = useRemoveSet(id!);
  const removeExercise = useRemoveExercise(id!);
  const completeWorkout = useCompleteWorkout();
  const discardWorkout = useDiscardWorkout();
  const updateRestSeconds = useUpdateWorkoutExerciseRestSeconds(id!);
  const updateTargetReps = useUpdateExerciseTargetReps(id!);

  const handleAddExercise = (exercise: Exercise) => {
    addExercise.mutate({ exerciseId: exercise.id });
  };

  const handleComplete = async () => {
    try {
      await completeWorkout.mutateAsync(id!);
      router.replace('/(tabs)/workouts');
    } catch {
      // error toast handled by mutation
    }
  };

  const handleDiscard = async () => {
    await discardWorkout.mutateAsync(id!);
    setShowDiscardConfirm(false);
    router.replace('/(tabs)');
  };

  if (isLoading || !workout) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="rgb(52, 211, 153)" />
      </View>
    );
  }

  const isStrength = workout.workoutType.name === 'Strength Training';

  return (
    <View className="flex-1 bg-background">
      <ActiveWorkoutHeader
        workoutName={workout.name}
        workoutTypeName={workout.workoutType.name}
        startedAt={workout.startedAt}
      />

      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        contentContainerClassName={cn(workout.exercises.length === 0 ? 'flex-1' : 'pb-[120px]')}
        ListEmptyComponent={
          <EmptyState
            icon="add-circle-outline"
            title="No exercises yet"
            message="Add an exercise to get started"
            actionLabel="Add Exercise"
            onAction={() => setShowExercisePicker(true)}
          />
        }
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            isStrength={isStrength}
            previousSets={previousSetsMap?.get(item.exerciseId)}
            onAddSet={() => {
              logSet.mutate({ workoutExerciseId: item.id, data: {} });
            }}
            onSaveSet={(setId, data) => {
              updateSet.mutate({ setId, data });
              startTimer(item.restSeconds);
            }}
            onRemoveSet={(setId) => removeSet.mutate(setId)}
            onRemoveExercise={() => removeExercise.mutate(item.id)}
            onUpdateRestSeconds={(seconds) => updateRestSeconds.mutate({ workoutExerciseId: item.id, restSeconds: seconds })}
            onUpdateTargetReps={(min, max) => updateTargetReps.mutate({ workoutExerciseId: item.id, targetRepsMin: min, targetRepsMax: max })}
          />
        )}
      />

      {/* Bottom action bar */}
      <View className="bg-background border-t border-background-100 px-4 pb-8 pt-3">
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => setShowDiscardConfirm(true)}
            className="flex-1 rounded-xl border border-destructive py-3.5 items-center"
          >
            <Text className="text-sm font-semibold text-destructive">Discard</Text>
          </Pressable>

          <Pressable
            onPress={() => setShowExercisePicker(true)}
            className="flex-1 rounded-xl border border-background-100 py-3.5 items-center"
          >
            <Text className="text-sm font-semibold text-foreground">Add Exercise</Text>
          </Pressable>

          <Pressable
            onPress={handleComplete}
            disabled={completeWorkout.isPending}
            className="flex-1 rounded-xl bg-primary py-3.5 items-center"
          >
            <Text className="text-sm font-bold text-background">
              {completeWorkout.isPending ? 'Saving...' : 'Finish'}
            </Text>
          </Pressable>
        </View>
      </View>

      <ExercisePicker
        visible={showExercisePicker}
        onSelect={handleAddExercise}
        onClose={() => setShowExercisePicker(false)}
      />

      <ConfirmDialog
        visible={showDiscardConfirm}
        title="Discard Workout"
        message="All logged sets will be lost. This cannot be undone."
        confirmLabel="Discard"
        destructive
        onConfirm={handleDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
      />

      <RestTimer />
    </View>
  );
}
