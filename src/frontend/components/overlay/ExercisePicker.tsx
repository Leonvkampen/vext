/** ExercisePicker - modal for browsing and selecting exercises to add to a workout. */
import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TextInput, FlatList, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExercises, useExerciseSearch, useCreateExercise } from '@frontend/hooks/useExercises';
import { ExerciseForm } from '@frontend/components/overlay/ExerciseForm';
import { EQUIPMENT_LABELS } from '@shared/constants/equipment';
import type { Exercise, ExerciseCategory } from '@shared/types/exercise';

const CATEGORIES: { label: string; value: ExerciseCategory | null }[] = [
  { label: 'All', value: null },
  { label: 'Strength', value: 'strength' as ExerciseCategory },
  { label: 'Cardio', value: 'cardio' as ExerciseCategory },
  { label: 'Flexibility', value: 'flexibility' as ExerciseCategory },
];

type ExercisePickerProps = {
  visible: boolean;
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
};

export function ExercisePicker({ visible, onSelect, onClose }: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const exercisesQuery = useExercises(selectedCategory ?? undefined);
  const searchResults = useExerciseSearch(searchQuery);
  const createExercise = useCreateExercise();

  const isSearching = searchQuery.length > 0;
  const exercises = useMemo(() => {
    const data = isSearching ? (searchResults.data ?? []) : (exercisesQuery.data ?? []);
    if (isSearching && selectedCategory) {
      return data.filter((e) => e.category === selectedCategory);
    }
    return data;
  }, [isSearching, searchResults.data, exercisesQuery.data, selectedCategory]);

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    setSearchQuery('');
    setSelectedCategory(null);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={handleClose}>
        <Pressable className="h-3/4 rounded-t-2xl bg-background" onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-background-100 px-4 py-3">
            <Text className="text-lg font-bold text-foreground">Select Exercise</Text>
            <View className="flex-row items-center gap-2">
              <Pressable onPress={() => setShowCreateForm(true)} className="p-1">
                <Ionicons name="add-circle" size={26} color="rgb(52, 211, 153)" />
              </Pressable>
              <Pressable onPress={handleClose} className="p-1">
                <Ionicons name="close" size={24} color="rgb(163, 163, 163)" />
              </Pressable>
            </View>
          </View>

          {/* Search */}
          <View className="px-4 pt-3 pb-2">
            <View className="flex-row items-center rounded-xl bg-background-50 px-4 py-2.5">
              <Ionicons name="search" size={16} color="rgb(115, 115, 115)" />
              <TextInput
                className="ml-2 flex-1 text-sm text-foreground"
                placeholder="Search..."
                placeholderTextColor="rgb(115, 115, 115)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Category chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="grow-0 px-4 py-2" contentContainerClassName="gap-1.5 items-center">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <Pressable
                  key={cat.label}
                  onPress={() => setSelectedCategory(cat.value)}
                  className={`rounded-full px-3 py-1.5 ${isActive ? 'bg-primary' : 'bg-background-50'}`}
                >
                  <Text className={`text-xs font-medium ${isActive ? 'text-background' : 'text-foreground-muted'}`}>
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
            contentContainerClassName="pb-10"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="flex-row items-center justify-between border-b border-background-100 py-3"
              >
                <View className="flex-1">
                  <Text className="text-base text-foreground">{item.name}</Text>
                  <Text className="mt-0.5 text-xs text-foreground-subtle">{EQUIPMENT_LABELS[item.equipment]}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={22} color="rgb(52, 211, 153)" />
              </Pressable>
            )}
          />
        </Pressable>
      </Pressable>

      {/* Create exercise form */}
      <ExerciseForm
        visible={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSave={(data) => {
          createExercise.mutate(data, {
            onSuccess: (newExercise) => {
              handleSelect(newExercise);
            },
          });
        }}
      />
    </Modal>
  );
}
