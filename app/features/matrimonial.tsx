import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Theme } from '@/constants/Theme';

export default function MatrimonialScreen() {
  return (
    <View style={styles.wrapper}>
      <Header title="Matrimonial" subtitle="মুসলিম বিবাহ সেবা" showBack />
      <ScreenContainer>
        <View style={styles.heroCard}>
          <Ionicons name="heart" size={48} color="#B56576" />
          <Text style={styles.heroTitle}>Find Your Life Partner</Text>
          <Text style={styles.heroBn}>জীবনসঙ্গী খুঁজুন</Text>
          <Text style={styles.heroDesc}>
            A trusted platform for Muslim marriage in the Bangla community. Find compatible matches based on Islamic values.
          </Text>
          <Text style={styles.heroDescBn}>
            বাংলা মুসলিম সম্প্রদায়ের জন্য বিশ্বস্ত বিবাহ প্ল্যাটফর্ম। ইসলামিক মূল্যবোধ ভিত্তিক জীবনসঙ্গী খুঁজুন।
          </Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: 'shield-checkmark' as const, title: 'Verified Profiles', bn: 'যাচাইকৃত প্রোফাইল' },
            { icon: 'lock-closed' as const, title: 'Privacy Protected', bn: 'গোপনীয়তা সুরক্ষিত' },
            { icon: 'people' as const, title: 'Family Involvement', bn: 'পরিবারের অংশগ্রহণ' },
            { icon: 'star' as const, title: 'Islamic Values', bn: 'ইসলামিক মূল্যবোধ' },
          ].map((f) => (
            <View key={f.title} style={styles.featureItem}>
              <Ionicons name={f.icon} size={24} color={Theme.colors.primary} />
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureBn}>{f.bn}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Create Your Profile</Text>
          <Text style={styles.ctaBn}>আপনার প্রোফাইল তৈরি করুন</Text>
          <Text style={styles.ctaDesc}>
            Matrimonial service will be available in the next update. Stay tuned!
          </Text>
          <Text style={styles.ctaDescBn}>বিবাহ সেবা পরবর্তী আপডেটে আসছে ইনশাআল্লাহ</Text>
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
  heroCard: {
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#B5657630',
  },
  heroTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
  },
  heroBn: {
    fontSize: Theme.fontSize.md,
    color: '#B56576',
    marginTop: 4,
  },
  heroDesc: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.md,
    lineHeight: 20,
  },
  heroDescBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
    lineHeight: 20,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
  },
  featureItem: {
    width: '47%',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  featureTitle: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.text,
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  featureBn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  ctaCard: {
    alignItems: 'center',
    backgroundColor: Theme.colors.primary + '10',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
  },
  ctaTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  ctaBn: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
  ctaDesc: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.md,
  },
  ctaDescBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
});
