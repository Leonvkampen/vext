import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/60"
        onPress={onCancel}
      >
        <Pressable
          className="mx-8 w-full max-w-sm rounded-2xl bg-background-50 p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-lg font-bold text-foreground">{title}</Text>
          <Text className="mt-2 text-sm text-foreground-muted">{message}</Text>
          <View className="mt-6 flex-row justify-end gap-3">
            <Pressable
              onPress={onCancel}
              className="rounded-lg border border-background-100 px-4 py-2.5"
            >
              <Text className="text-sm font-medium text-foreground-muted">
                {cancelLabel}
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className={`rounded-lg px-4 py-2.5 ${
                destructive ? 'bg-destructive' : 'bg-primary'
              }`}
            >
              <Text className="text-sm font-semibold text-background">
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
