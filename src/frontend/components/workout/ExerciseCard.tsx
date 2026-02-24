import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SetRow } from './SetRow';
import { ConfirmDialog } from '@frontend/components/overlay/ConfirmDialog';
import type { WorkoutExerciseFull, WorkoutSet } from '@shared/types/workout';

type ExerciseCardProps = {
  exercise: WorkoutExerciseFull;
  isStrength: boolean;
  previousSets?: WorkoutSet[];
  onAddSet: () => void;
  onSaveSet: (setId: string, data: { weightKg?: number; reps?: number; durationSeconds?: number; distanceMeters?: number }) => void;
  onRemoveSet: (setId: string) => void;
  onRemoveExercise: () => void;
  onUpdateRestSeconds: (seconds: number) => void;
};

export function ExerciseCard({
  exercise,
  isStrength,
  previousSets,
  onAddSet,
  onSaveSet,
  onRemoveSet,
  onRemoveExercise,
  onUpdateRestSeconds,
}: ExerciseCardProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [editingRest, setEditingRest] = useState(false);
  const [localRestSeconds, setLocalRestSeconds] = useState(exercise.restSeconds);

  useEffect(() => {
    setLocalRestSeconds(exercise.restSeconds);
  }, [exercise.restSeconds]);

  const handleUpdateRest = (newVal: number) => {
    setLocalRestSeconds(newVal);
    onUpdateRestSeconds(newVal);
  };

  return (
    <View className="mb-4 rounded-xl bg-background-50 p-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-bold text-foreground">{exercise.exerciseName}</Text>
        <Pressable onPress={() => setShowRemoveConfirm(true)} className="p-1">
          <Ionicons name="close-circle-outline" size={20} color="rgb(163, 163, 163)" />
        </Pressable>
      </View>

      {/* Rest time badge */}
      <Pressable
        onPress={() => setEditingRest(!editingRest)}
        className="self-start mb-2 flex-row items-center rounded-full bg-background-100 px-3 py-1"
      >
        <Ionicons name="timer-outline" size={14} color="rgb(163, 163, 163)" />
        <Text className="ml-1 text-xs text-foreground-muted">
          {localRestSeconds}s rest
        </Text>
      </Pressable>

      {/* Rest time editor */}
      {editingRest && (
        <View className="flex-row items-center gap-2 mb-2">
          <Pressable
            onPress={() => handleUpdateRest(Math.max(15, localRestSeconds - 15))}
            className="rounded-lg bg-background-100 px-3 py-1.5"
          >
            <Text className="text-sm text-foreground-muted">-15s</Text>
          </Pressable>
          <Text className="text-sm font-medium text-foreground min-w-[48px] text-center">
            {localRestSeconds}s
          </Text>
          <Pressable
            onPress={() => handleUpdateRest(localRestSeconds + 15)}
            className="rounded-lg bg-background-100 px-3 py-1.5"
          >
            <Text className="text-sm text-foreground-muted">+15s</Text>
          </Pressable>
        </View>
      )}

      {/* Header row */}
      <View className="flex-row items-center py-1 gap-2 mb-1">
        <View className="w-8" />
        {isStrength ? (
          <>
            <Text className="flex-1 text-center text-xs text-foreground-subtle">Weight</Text>
            <Text className="text-xs text-foreground-subtle" />
            <Text className="flex-1 text-center text-xs text-foreground-subtle">Reps</Text>
          </>
        ) : (
          <>
            <Text className="flex-1 text-center text-xs text-foreground-subtle">Duration</Text>
            <Text className="flex-1 text-center text-xs text-foreground-subtle">Distance</Text>
          </>
        )}
        <View className="w-10" />
        <View className="w-8" />
      </View>

      {/* Existing sets */}
      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          set={set}
          previousSet={previousSets?.[index]}
          setNumber={set.setNumber}
          isStrength={isStrength}
          onSave={(data) => onSaveSet(set.id, data)}
          onRemove={() => onRemoveSet(set.id)}
        />
      ))}

      {/* Add Set button */}
      <Pressable
        onPress={onAddSet}
        className="mt-2 rounded-xl border border-dashed border-background-100 py-3 items-center"
      >
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="add" size={18} color="rgb(52, 211, 153)" />
          <Text className="text-sm font-medium text-primary">Add Set</Text>
        </View>
      </Pressable>

      <ConfirmDialog
        visible={showRemoveConfirm}
        title="Remove Exercise"
        message={`Remove ${exercise.exerciseName} and all its sets?`}
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          onRemoveExercise();
          setShowRemoveConfirm(false);
        }}
        onCancel={() => setShowRemoveConfirm(false)}
      />
    </View>
  );
}
