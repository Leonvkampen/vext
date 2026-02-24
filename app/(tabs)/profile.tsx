import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@backend/store/settingsStore';
import { useDatabase } from '@frontend/hooks/useDatabase';
import { SelectPicker } from '@frontend/components/overlay/SelectPicker';
import type { UnitSystem } from '@shared/types/settings';

const REST_OPTIONS = [
  { label: '30 seconds', value: '30' },
  { label: '60 seconds', value: '60' },
  { label: '90 seconds', value: '90' },
  { label: '2 minutes', value: '120' },
  { label: '3 minutes', value: '180' },
  { label: '5 minutes', value: '300' },
];

export default function ProfileScreen() {
  const db = useDatabase();
  const { units, defaultRestSeconds, isLoaded, loadSettings, updateUnits, updateDefaultRestSeconds } = useSettingsStore();
  const [showRestPicker, setShowRestPicker] = useState(false);

  useEffect(() => {
    if (!isLoaded) loadSettings(db);
  }, [db, isLoaded, loadSettings]);

  const handleUnitsToggle = (useImperial: boolean) => {
    const newUnits: UnitSystem = useImperial ? 'imperial' : 'metric';
    updateUnits(db, newUnits);
  };

  const restLabel = REST_OPTIONS.find((o) => o.value === String(defaultRestSeconds))?.label ?? `${defaultRestSeconds}s`;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="pb-[100px]">
        <View className="px-4 py-3">
          <Text className="text-2xl font-bold text-foreground">Settings</Text>
        </View>

        {/* Units */}
        <View className="mx-4 mt-2 rounded-xl bg-background-50 p-4">
          <Text className="text-sm font-medium text-foreground-muted mb-3">Units</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Ionicons name="scale-outline" size={20} color="rgb(163, 163, 163)" />
              <Text className="text-base text-foreground">Imperial (lb, mi)</Text>
            </View>
            <Switch
              value={units === 'imperial'}
              onValueChange={handleUnitsToggle}
              trackColor={{ false: 'rgb(38, 38, 38)', true: 'rgb(52, 211, 153)' }}
              thumbColor="rgb(250, 250, 250)"
            />
          </View>
          <Text className="mt-2 text-xs text-foreground-subtle">
            Currently using {units === 'metric' ? 'metric (kg, km)' : 'imperial (lb, mi)'}
          </Text>
        </View>

        {/* Rest timer default */}
        <View className="mx-4 mt-3 rounded-xl bg-background-50 p-4">
          <Text className="text-sm font-medium text-foreground-muted mb-3">Rest Timer</Text>
          <Pressable
            onPress={() => setShowRestPicker(true)}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="timer-outline" size={20} color="rgb(163, 163, 163)" />
              <Text className="text-base text-foreground">Default rest duration</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-primary">{restLabel}</Text>
              <Ionicons name="chevron-forward" size={16} color="rgb(163, 163, 163)" />
            </View>
          </Pressable>
        </View>

        {/* About */}
        <View className="mx-4 mt-3 rounded-xl bg-background-50 p-4">
          <Text className="text-sm font-medium text-foreground-muted mb-3">About</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-foreground">Vitalis</Text>
            <Text className="text-sm text-foreground-subtle">v1.0.0</Text>
          </View>
        </View>

        {/* Coming soon */}
        <View className="mx-4 mt-3 rounded-xl bg-background-50 p-4">
          <Text className="text-sm font-medium text-foreground-muted mb-3">Coming Soon</Text>
          {['Data Export', 'Custom Exercises', 'Theme Customization'].map((feature) => (
            <View key={feature} className="flex-row items-center justify-between py-2">
              <Text className="text-base text-foreground-subtle">{feature}</Text>
              <View className="rounded-full bg-background-100 px-2 py-0.5">
                <Text className="text-xs text-foreground-subtle">Soon</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <SelectPicker
        visible={showRestPicker}
        title="Default Rest Duration"
        options={REST_OPTIONS}
        selectedValue={String(defaultRestSeconds)}
        onSelect={(val) => updateDefaultRestSeconds(db, parseInt(val, 10))}
        onClose={() => setShowRestPicker(false)}
      />
    </View>
  );
}
