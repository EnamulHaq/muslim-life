import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Theme } from '@/constants/Theme';
import { shadowStyle } from '@/utils/shadow';

const PRESETS = [
  { label: 'SubhanAllah', labelBn: 'সুবহানাল্লাহ', target: 33 },
  { label: 'Alhamdulillah', labelBn: 'আলহামদুলিল্লাহ', target: 33 },
  { label: 'Allahu Akbar', labelBn: 'আল্লাহু আকবার', target: 34 },
  { label: 'La ilaha illallah', labelBn: 'লা ইলাহা ইল্লাল্লাহ', target: 100 },
  { label: 'Astaghfirullah', labelBn: 'আস্তাগফিরুল্লাহ', target: 100 },
];

const STORAGE_KEY = 'tasbih_count';

export default function TasbihScreen() {
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(0);
  const preset = PRESETS[selected];

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) setCount(parseInt(val, 10));
    });
  }, []);

  const increment = async () => {
    const next = count + 1;
    setCount(next);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await AsyncStorage.setItem(STORAGE_KEY, String(next));

    if (next >= preset.target) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const reset = async () => {
    setCount(0);
    await AsyncStorage.setItem(STORAGE_KEY, '0');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const progress = Math.min(count / preset.target, 1);

  return (
    <View style={styles.wrapper}>
      <Header title="Tasbih" subtitle="ডিজিটাল তসবিহ" showBack />
      <ScreenContainer scroll={false} contentStyle={styles.content}>
        <View style={styles.presets}>
          {PRESETS.map((p, i) => (
            <Pressable
              key={p.label}
              style={[styles.presetChip, selected === i && styles.presetActive]}
              onPress={() => { setSelected(i); setCount(0); }}
            >
              <Text style={[styles.presetText, selected === i && styles.presetTextActive]}>
                {p.labelBn}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.counterArea}>
          <Text style={styles.dhikrLabel}>{preset.label}</Text>
          <Text style={styles.dhikrBn}>{preset.labelBn}</Text>

          <Pressable style={styles.beadButton} onPress={increment}>
            <View style={[styles.progressRing, { borderColor: Theme.colors.primary + Math.round(progress * 255).toString(16).padStart(2, '0') }]}>
              <Text style={styles.count}>{count}</Text>
              <Text style={styles.target}>/ {preset.target}</Text>
            </View>
          </Pressable>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <Text style={styles.tapHint}>Tap to count · গণনা করতে ট্যাপ করুন</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.resetBtn} onPress={reset}>
            <Ionicons name="refresh" size={20} color={Theme.colors.error} />
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    justifyContent: 'center',
  },
  presetChip: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  presetActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  presetText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text,
  },
  presetTextActive: {
    color: Theme.colors.textLight,
    fontWeight: '600',
  },
  counterArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  dhikrLabel: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  dhikrBn: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  beadButton: {
    marginVertical: Theme.spacing.lg,
  },
  progressRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle({
      color: Theme.colors.cardShadow,
      offset: { width: 0, height: 8 },
      radius: 16,
      elevation: 8,
    }),
  },
  count: {
    fontSize: 64,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  target: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.textSecondary,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: Theme.spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  tapHint: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.md,
  },
  actions: {
    alignItems: 'center',
    paddingBottom: Theme.spacing.lg,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
  },
  resetText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.error,
    fontWeight: '600',
  },
});
