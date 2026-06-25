import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Theme } from '@/constants/Theme';
import { HAJJ_STEPS, UMRAH_STEPS } from '@/data/hajjGuide';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  shirt: 'shirt-outline',
  sync: 'sync-outline',
  walk: 'walk-outline',
  sunny: 'sunny-outline',
  moon: 'moon-outline',
  ellipse: 'ellipse-outline',
  gift: 'gift-outline',
  cut: 'cut-outline',
  heart: 'heart-outline',
};

export default function HajjScreen() {
  const [tab, setTab] = useState<'hajj' | 'umrah'>('hajj');
  const steps = tab === 'hajj' ? HAJJ_STEPS : UMRAH_STEPS;

  return (
    <View style={styles.wrapper}>
      <Header title="Hajj & Umrah" subtitle="হজ্জ ও উমরাহ গাইড" showBack />
      <ScreenContainer>
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === 'hajj' && styles.tabActive]}
            onPress={() => setTab('hajj')}
          >
            <Text style={[styles.tabText, tab === 'hajj' && styles.tabTextActive]}>Hajj</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === 'umrah' && styles.tabActive]}
            onPress={() => setTab('umrah')}
          >
            <Text style={[styles.tabText, tab === 'umrah' && styles.tabTextActive]}>Umrah</Text>
          </Pressable>
        </View>

        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepCard}>
            <View style={styles.stepLeft}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              {index < steps.length - 1 && <View style={styles.connector} />}
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Ionicons
                  name={ICON_MAP[step.icon] ?? 'checkmark-circle-outline'}
                  size={22}
                  color={Theme.colors.primary}
                />
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepTitleBn}>{step.titleBn}</Text>
              <Text style={styles.stepDesc}>{step.description}</Text>
              <Text style={styles.stepDescBn}>{step.descriptionBn}</Text>
            </View>
          </View>
        ))}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: 4,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  tabTextActive: {
    color: Theme.colors.textLight,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
  },
  stepLeft: {
    alignItems: 'center',
    width: 40,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: Theme.colors.textLight,
    fontWeight: '700',
    fontSize: Theme.fontSize.sm,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  stepTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  stepTitleBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primary,
    marginTop: 2,
    marginBottom: Theme.spacing.sm,
  },
  stepDesc: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text,
    lineHeight: 20,
  },
  stepDescBn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    marginTop: Theme.spacing.sm,
  },
});
