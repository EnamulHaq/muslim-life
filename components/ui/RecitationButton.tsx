import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/Theme';

type Props = {
  id: string;
  activeId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  onPress: () => void;
  label?: string;
  size?: 'sm' | 'md';
};

export function RecitationButton({
  id,
  activeId,
  isPlaying,
  isLoading,
  onPress,
  label = 'Listen',
  size = 'sm',
}: Props) {
  const isActive = activeId === id;
  const iconSize = size === 'md' ? 22 : 18;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        size === 'md' && styles.buttonMd,
        isActive && styles.buttonActive,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      hitSlop={8}
    >
      {isLoading && isActive ? (
        <ActivityIndicator size="small" color={Theme.colors.primary} />
      ) : (
        <Ionicons
          name={isActive && isPlaying ? 'pause' : 'volume-high'}
          size={iconSize}
          color={isActive ? Theme.colors.primary : Theme.colors.textSecondary}
        />
      )}
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.primary + '10',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  buttonMd: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buttonActive: {
    backgroundColor: Theme.colors.primary + '18',
    borderColor: Theme.colors.primary + '40',
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  labelActive: {
    color: Theme.colors.primary,
  },
});
