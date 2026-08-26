import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { QURAN_RECITERS, type Reciter } from '@/constants/audio';
import { Theme } from '@/constants/Theme';
import { useAppTheme } from '@/context/AppThemeContext';

type Props = {
  visible: boolean;
  selectedId: number;
  onSelect: (reciter: Reciter) => void;
  onClose: () => void;
};

export function ReciterPickerModal({
  visible,
  selectedId,
  onSelect,
  onClose,
}: Props) {
  const { colors, isDark } = useAppTheme();
  const [search, setSearch] = useState('');

  const filtered = QURAN_RECITERS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.nameBn.includes(search) ||
      r.style.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                Select Reciter
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                পছন্দের ক্বারী নির্বাচন করুন
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View
            style={[
              styles.searchBox,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Search reciters..."
              placeholderTextColor={colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {filtered.map((reciter) => {
              const isSelected = reciter.id === selectedId;
              return (
                <Pressable
                  key={reciter.id}
                  style={[
                    styles.item,
                    { borderBottomColor: colors.border },
                    isSelected && { backgroundColor: colors.primary + '14' },
                  ]}
                  onPress={() => {
                    onSelect(reciter);
                    onClose();
                  }}
                >
                  <View style={styles.itemInfo}>
                    <View style={styles.nameRow}>
                      <Text
                        style={[
                          styles.itemName,
                          { color: isSelected ? colors.primary : colors.text },
                        ]}
                      >
                        {reciter.name}
                      </Text>
                      <View
                        style={[
                          styles.styleBadge,
                          { backgroundColor: isSelected ? colors.primary : colors.muted },
                        ]}
                      >
                        <Text
                          style={[
                            styles.styleText,
                            { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                          ]}
                        >
                          {reciter.style}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.itemBn, { color: colors.textSecondary }]}>
                      {reciter.nameBn}
                    </Text>
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '80%',
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: Theme.fontSize.xs,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.md,
  },
  list: {
    marginBottom: Theme.spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderRadius: Theme.borderRadius.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  itemName: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
  },
  styleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  styleText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemBn: {
    fontSize: Theme.fontSize.xs,
    marginTop: 3,
  },
});
