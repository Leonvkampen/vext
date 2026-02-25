/** Exercises screen - browse, search, create, edit, and archive exercises. */
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExercises, useExerciseSearch, useCreateExercise, useUpdateExercise, useArchiveExercise } from '@frontend/hooks/useExercises';
import { EmptyState } from '@frontend/components/EmptyState';
import { ExerciseForm } from '@frontend/components/overlay/ExerciseForm';
import { MUSCLE_GROUP_LABELS } from '@shared/constants/muscleGroups';
import { EQUIPMENT_LABELS } from '@shared/constants/equipment';
import type { Exercise, ExerciseCategory } from '@shared/types/exercise';
import { cn } from '@frontend/lib/utils';
import { useDatabase } from '@frontend/hooks/useDatabase';
import * as exerciseService from '@backend/services/exerciseService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getDefaultRestSeconds } from '@backend/services/timerService';

const CATEGORIES: { label: string; value: ExerciseCategory | null }[] = [
  { label: 'All', value: null },
  { label: 'Strength', value: 'strength' as ExerciseCategory },
  { label: 'Cardio', value: 'cardio' as ExerciseCategory },
  { label: 'Flexibility', value: 'flexibility' as ExerciseCategory },
];

export default function ExercisesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const db = useDatabase();
  const queryClient = useQueryClient();
  const updateExerciseRest = useMutation({
    mutationFn: ({ exerciseId, restSeconds }: { exerciseId: string; restSeconds: number | null }) =>
      exerciseService.updateDefaultRestSeconds(db, exerciseId, restSeconds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exerciseSearch'] });
      setSelectedExercise((prev) =>
        prev && prev.id === variables.exerciseId
          ? { ...prev, restSeconds: variables.restSeconds }
          : prev
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exerciseSearch'] });
    },
  });

  const createExerciseMutation = useCreateExercise();
  const updateExerciseMutation = useUpdateExercise();
  const archiveExerciseMutation = useArchiveExercise();

  const exercisesQuery = useExercises(selectedCategory ?? undefined);
  const searchResults = useExerciseSearch(searchQuery);

  const isSearching = searchQuery.length > 0;
  const exercises = useMemo(() => {
    const data = isSearching ? (searchResults.data ?? []) : (exercisesQuery.data ?? []);
    if (isSearching && selectedCategory) {
      return data.filter((e) => e.category === selectedCategory);
    }
    return data;
  }, [isSearching, searchResults.data, exercisesQuery.data, selectedCategory]);

  const isLoading = isSearching ? searchResults.isLoading : exercisesQuery.isLoading;

  const handleArchive = (exercise: Exercise) => {
    Alert.alert(
      'Archive Exercise',
      `Are you sure you want to archive "${exercise.name}"? It will be hidden from all lists.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: () => {
            archiveExerciseMutation.mutate(exercise.id);
            setSelectedExercise(null);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Search + Add */}
      <View className="px-4 pt-4 pb-2 flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center rounded-xl bg-background-50 px-4 py-3">
          <Ionicons name="search" size={18} color="rgb(115, 115, 115)" />
          <TextInput
            className="ml-3 flex-1 text-base text-foreground"
            placeholder="Search exercises..."
            placeholderTextColor="rgb(115, 115, 115)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="rgb(115, 115, 115)" />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setShowCreateForm(true)}
          className="rounded-xl bg-primary p-3"
        >
          <Ionicons name="add" size={22} color="white" />
        </Pressable>
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="grow-0 px-4 py-2" contentContainerClassName="gap-2 items-center">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <Pressable
              key={cat.label}
              onPress={() => setSelectedCategory(cat.value)}
              className={`rounded-full px-4 py-2 ${isActive ? 'bg-primary' : 'bg-background-50'}`}
            >
              <Text className={`text-sm font-medium ${isActive ? 'text-background' : 'text-foreground-muted'}`}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Exercise list */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        contentContainerClassName={cn(exercises.length === 0 ? 'flex-1' : 'pb-[100px]')}
        ListEmptyComponent={
          isLoading ? null : (
            <EmptyState
              icon="barbell-outline"
              title={isSearching ? 'No results' : 'No exercises'}
              message={isSearching ? 'Try a different search term' : 'No exercises found in this category'}
            />
          )
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedExercise(item)}
            className="mb-2 rounded-xl bg-background-50 p-4"
          >
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-base font-semibold text-foreground">{item.name}</Text>
              {!item.isDefault && (
                <View className="rounded-md bg-primary/10 px-2 py-0.5 ml-2">
                  <Text className="text-[10px] font-medium text-primary">Custom</Text>
                </View>
              )}
            </View>
            <View className="mt-2 flex-row flex-wrap gap-2">
              <View className="rounded-md bg-primary/15 px-2 py-1">
                <Text className="text-xs font-medium text-primary">{item.category}</Text>
              </View>
              <View className="rounded-md bg-background-100 px-2 py-1">
                <Text className="text-xs text-foreground-muted">{EQUIPMENT_LABELS[item.equipment]}</Text>
              </View>
              {item.primaryMuscles.slice(0, 2).map((m) => (
                <View key={m} className="rounded-md bg-background-100 px-2 py-1">
                  <Text className="text-xs text-foreground-muted">{MUSCLE_GROUP_LABELS[m]}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        )}
      />

      {/* Exercise detail modal */}
      <Modal visible={!!selectedExercise} transparent animationType="fade" onRequestClose={() => setSelectedExercise(null)}>
        <Pressable className="flex-1 items-center justify-center bg-black/60" onPress={() => setSelectedExercise(null)}>
          <Pressable className="mx-6 w-full max-w-sm rounded-2xl bg-background-50 p-6" onPress={(e) => e.stopPropagation()}>
            {selectedExercise && (
              <>
                <View className="flex-row items-center justify-between">
                  <Text className="flex-1 text-xl font-bold text-foreground">{selectedExercise.name}</Text>
                  <Pressable onPress={() => setSelectedExercise(null)}>
                    <Ionicons name="close" size={24} color="rgb(163, 163, 163)" />
                  </Pressable>
                </View>
                <View className="mt-3 flex-row flex-wrap gap-2">
                  <View className="rounded-md bg-primary/15 px-2 py-1">
                    <Text className="text-xs font-medium text-primary">{selectedExercise.category}</Text>
                  </View>
                  <View className="rounded-md bg-background-100 px-2 py-1">
                    <Text className="text-xs text-foreground-muted">{EQUIPMENT_LABELS[selectedExercise.equipment]}</Text>
                  </View>
                </View>
                <Text className="mt-4 text-sm font-medium text-foreground">Target Muscles</Text>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {selectedExercise.primaryMuscles.map((m) => (
                    <View key={m} className="rounded-md bg-background-100 px-2 py-1">
                      <Text className="text-xs text-foreground-muted">{MUSCLE_GROUP_LABELS[m]}</Text>
                    </View>
                  ))}
                </View>
                {/* Default Rest Time */}
                <Text className="mt-4 text-sm font-medium text-foreground">Default Rest Time</Text>
                <View className="mt-2 flex-row items-center gap-2">
                  <Pressable
                    onPress={() => {
                      const current = selectedExercise.restSeconds ?? getDefaultRestSeconds(selectedExercise.category);
                      const newVal = Math.max(15, current - 15);
                      updateExerciseRest.mutate({ exerciseId: selectedExercise.id, restSeconds: newVal });
                    }}
                    className="rounded-lg bg-background-100 px-3 py-1.5"
                  >
                    <Text className="text-sm text-foreground-muted">-15s</Text>
                  </Pressable>
                  <Text className="text-sm font-medium text-foreground min-w-[48px] text-center">
                    {selectedExercise.restSeconds != null
                      ? `${selectedExercise.restSeconds}s`
                      : `${getDefaultRestSeconds(selectedExercise.category)}s`}
                  </Text>
                  <Pressable
                    onPress={() => {
                      const current = selectedExercise.restSeconds ?? getDefaultRestSeconds(selectedExercise.category);
                      const newVal = current + 15;
                      updateExerciseRest.mutate({ exerciseId: selectedExercise.id, restSeconds: newVal });
                    }}
                    className="rounded-lg bg-background-100 px-3 py-1.5"
                  >
                    <Text className="text-sm text-foreground-muted">+15s</Text>
                  </Pressable>
                  {selectedExercise.restSeconds != null && (
                    <Pressable
                      onPress={() => updateExerciseRest.mutate({ exerciseId: selectedExercise.id, restSeconds: null })}
                      className="ml-1 rounded-lg bg-background-100 px-3 py-1.5"
                    >
                      <Text className="text-xs text-foreground-muted">Reset</Text>
                    </Pressable>
                  )}
                </View>
                <Text className="mt-1 text-xs text-foreground-subtle">
                  {selectedExercise.restSeconds != null ? 'Custom default' : 'Using category default'}
                </Text>

                {selectedExercise.instructions && (
                  <>
                    <Text className="mt-4 text-sm font-medium text-foreground">Instructions</Text>
                    <Text className="mt-2 text-sm leading-5 text-foreground-muted">{selectedExercise.instructions}</Text>
                  </>
                )}

                {/* Edit & Archive actions */}
                <View className="mt-5 flex-row gap-2">
                  <Pressable
                    onPress={() => {
                      setEditingExercise(selectedExercise);
                      setSelectedExercise(null);
                    }}
                    className="flex-1 flex-row items-center justify-center rounded-xl bg-background-100 py-3 gap-2"
                  >
                    <Ionicons name="pencil" size={16} color="rgb(163, 163, 163)" />
                    <Text className="text-sm font-medium text-foreground-muted">Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleArchive(selectedExercise)}
                    className="flex-1 flex-row items-center justify-center rounded-xl bg-red-500/10 py-3 gap-2"
                  >
                    <Ionicons name="archive-outline" size={16} color="rgb(239, 68, 68)" />
                    <Text className="text-sm font-medium text-red-500">Archive</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Create exercise form */}
      <ExerciseForm
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={(data) => createExerciseMutation.mutate(data)}
      />

      {/* Edit exercise form */}
      <ExerciseForm
        visible={!!editingExercise}
        exercise={editingExercise}
        onClose={() => setEditingExercise(null)}
        onSave={(data) => {
          if (editingExercise) {
            updateExerciseMutation.mutate({ id: editingExercise.id, data });
          }
        }}
      />
    </View>
  );
}
