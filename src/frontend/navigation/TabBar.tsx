/** TabBar - custom bottom tab navigation bar with centered action button. */
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  workouts: { active: 'time', inactive: 'time-outline' },
  exercises: { active: 'barbell', inactive: 'barbell-outline' },
  progress: { active: 'trending-up', inactive: 'trending-up-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();

  return (
    <View className="bg-background-50">
      <View className="flex-row items-end border-t border-background-100 pt-2 px-2 pb-1">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;
        const isCenterSlot = index === 2;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        if (isCenterSlot) {
          return (
            <View key={route.key} className="flex-1 items-center">
              {/* FAB above the tab bar */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/workout/new');
                }}
                className="absolute -top-7 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] })}
              >
                <Ionicons name="add" size={28} color="rgb(10, 10, 15)" />
              </Pressable>
              {/* Tab item below FAB */}
              <Pressable onPress={onPress} className="items-center pt-4 mt-2">
                <Ionicons
                  name={isFocused ? TAB_ICONS[route.name]?.active ?? 'ellipse' : TAB_ICONS[route.name]?.inactive ?? 'ellipse-outline'}
                  size={22}
                  color={isFocused ? 'rgb(52, 211, 153)' : 'rgb(115, 115, 115)'}
                />
                <Text
                  className={`text-xs mt-1 ${isFocused ? 'text-primary font-semibold' : 'text-foreground-subtle'}`}
                >
                  {label}
                </Text>
              </Pressable>
            </View>
          );
        }

        const icons = TAB_ICONS[route.name];

        return (
          <Pressable key={route.key} onPress={onPress} className="flex-1 items-center py-1">
            <Ionicons
              name={isFocused ? icons?.active ?? 'ellipse' : icons?.inactive ?? 'ellipse-outline'}
              size={22}
              color={isFocused ? 'rgb(52, 211, 153)' : 'rgb(115, 115, 115)'}
            />
            <Text
              className={`text-xs mt-1 ${isFocused ? 'text-primary font-semibold' : 'text-foreground-subtle'}`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
      </View>
    </View>
  );
}
