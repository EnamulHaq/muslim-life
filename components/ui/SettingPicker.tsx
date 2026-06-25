import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Theme } from '@/constants/Theme';

type Props<T extends string> = {
  visible: boolean;
  title: string;
  options: Record<T, string>;
  selected: T;
  onSelect: (value: T) => void;
  onClose: () => void;
};

export function SettingPicker<T extends string>({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: Props<T>) {
  const { colors } = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {(Object.entries(options) as [T, string][]).map(([key, label]) => {
              const active = key === selected;
              return (
                <Pressable
                  key={key}
                  style={[
                    styles.option,
                    { borderColor: colors.border },
                    active && { backgroundColor: colors.primary + '12', borderColor: colors.primary + '40' },
                  ]}
                  onPress={() => {
                    onSelect(key);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      active && { color: colors.primary, fontWeight: '700' },
                    ]}
                  >
                    {label}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  ) : (
                    <View style={[styles.radio, { borderColor: colors.border }]} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable style={[styles.cancelBtn, { backgroundColor: colors.muted }]} onPress={onClose}>
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    marginBottom: Theme.spacing.md,
  },
  list: {
    marginBottom: Theme.spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    marginBottom: Theme.spacing.sm,
  },
  optionText: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    lineHeight: 22,
    paddingRight: Theme.spacing.sm,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  cancelBtn: {
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
  },
});
