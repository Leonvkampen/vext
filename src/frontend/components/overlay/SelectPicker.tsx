/** SelectPicker - generic bottom sheet single-select picker. */
import React from 'react';
import { Modal, View, Text, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SelectOption = {
  label: string;
  value: string;
};

type SelectPickerProps = {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

export function SelectPicker({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end bg-black/60"
        onPress={onClose}
      >
        <Pressable
          className="rounded-t-2xl bg-background-50 pb-8"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-background-100 px-6 py-4">
            <Text className="text-lg font-bold text-foreground">{title}</Text>
            <Pressable onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="rgb(163, 163, 163)" />
            </Pressable>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            className="max-h-80"
            renderItem={({ item }) => {
              const isSelected = item.value === selectedValue;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                  className={`flex-row items-center justify-between px-6 py-4 ${
                    isSelected ? 'bg-primary/10' : ''
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isSelected
                        ? 'font-semibold text-primary'
                        : 'text-foreground'
                    }`}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color="rgb(52, 211, 153)"
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
