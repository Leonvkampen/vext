import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as exerciseModel from '@backend/models/exercise';
import { useDatabase } from '@frontend/hooks/useDatabase';
import { usePersonalRecords, useVolumeOverTime, useWorkoutFrequency } from '@frontend/hooks/useProgress';
import { PRCard } from '@frontend/components/charts/PRCard';
import { VolumeChart } from '@frontend/components/charts/VolumeChart';
import { FrequencyChart } from '@frontend/components/charts/FrequencyChart';
import { SelectPicker } from '@frontend/components/overlay/SelectPicker';
import { EmptyState } from '@frontend/components/EmptyState';

export default function ProgressScreen() {
  const db = useDatabase();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  const { data: exercises } = useQuery({
    queryKey: ['exercises', 'all'],
    queryFn: () => exerciseModel.getAll(db),
    staleTime: 5 * 60 * 1000,
  });

  const exerciseOptions = useMemo(
    () => (exercises ?? []).map((e) => ({ label: e.name, value: e.id })),
    [exercises]
  );

  const selectedExercise = exercises?.find((e) => e.id === selectedExerciseId);
  const { data: prs } = usePersonalRecords(selectedExerciseId);
  const { data: volumeData } = useVolumeOverTime(selectedExerciseId, 12);
  const { data: frequencyData } = useWorkoutFrequency(12);

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="pb-[100px]">
        <View className="px-4 py-3">
          <Text className="text-2xl font-bold text-foreground">Progress</Text>
        </View>

        {/* Exercise selector */}
        <Pressable
          onPress={() => setShowExercisePicker(true)}
          className="mx-4 mb-4 flex-row items-center justify-between rounded-xl bg-background-50 px-4 py-3"
        >
          <Text className={selectedExercise ? 'text-base text-foreground' : 'text-base text-foreground-subtle'}>
            {selectedExercise?.name ?? 'Select an exercise'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="rgb(163, 163, 163)" />
        </Pressable>

        {/* Personal Records */}
        {selectedExerciseId && prs && (
          <View className="px-4 mb-4">
            <Text className="text-sm font-medium text-foreground-muted mb-2">Personal Records</Text>
            <View className="flex-row gap-3">
              <PRCard label="Best Weight" value={prs.maxWeight != null ? Math.round(prs.maxWeight) : null} unit="kg" />
              <PRCard label="Best Reps" value={prs.maxReps} />
              <PRCard label="Est. 1RM" value={prs.estimated1RM != null ? Math.round(prs.estimated1RM) : null} unit="kg" />
            </View>
          </View>
        )}

        {/* Volume chart */}
        {selectedExerciseId && (
          <View className="px-4 mb-4">
            <VolumeChart data={volumeData ?? []} />
          </View>
        )}

        {/* Frequency chart - always shown */}
        <View className="px-4 mb-4">
          <FrequencyChart data={frequencyData ?? []} />
        </View>

        {!selectedExerciseId && (
          <View className="px-4">
            <EmptyState
              icon="analytics-outline"
              title="Select an exercise"
              message="Choose an exercise above to see personal records and volume trends"
            />
          </View>
        )}
      </ScrollView>

      <SelectPicker
        visible={showExercisePicker}
        title="Select Exercise"
        options={exerciseOptions}
        selectedValue={selectedExerciseId ?? undefined}
        onSelect={setSelectedExerciseId}
        onClose={() => setShowExercisePicker(false)}
      />
    </View>
  );
}
