import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Theme } from '@/constants/Theme';

const FAQ = [
  {
    q: 'How do I ask a question?',
    qBn: 'কিভাবে প্রশ্ন করব?',
    a: 'Submit your Islamic question and our scholars will provide authentic answers based on Quran and Sunnah.',
    aBn: 'আপনার ইসলামিক প্রশ্ন জমা দিন, আমাদের আলেমগণ কুরআন ও সুন্নাহ ভিত্তিক উত্তর দেবেন।',
  },
  {
    q: 'Who answers the questions?',
    qBn: 'কে উত্তর দেন?',
    a: 'Qualified Muftis and Islamic scholars with expertise in Fiqh, Tafsir, and Hadith.',
    aBn: 'যোগ্য মুফতি ও ইসলামিক আলেমগণ যারা ফিকহ, তাফসীর ও হাদিসে বিশেষজ্ঞ।',
  },
  {
    q: 'Is voice call available?',
    qBn: 'ভয়েস কল কি available?',
    a: 'Yes! You can schedule a voice call with a Mufti for direct Shariah guidance.',
    aBn: 'হ্যাঁ! সরাসরি শরীয়াহ পরামর্শের জন্য মুফতির সাথে ভয়েস কল শিডিউল করতে পারবেন।',
  },
];

export default function ScholarScreen() {
  return (
    <View style={styles.wrapper}>
      <Header title="Ask a Scholar" subtitle="আলেমদের প্রশ্নোত্তর" showBack />
      <ScreenContainer>
        <View style={styles.heroCard}>
          <Ionicons name="chatbubbles" size={48} color={Theme.colors.primary} />
          <Text style={styles.heroTitle}>Get Authentic Islamic Answers</Text>
          <Text style={styles.heroBn}>নির্ভরযোগ্য ইসলামিক উত্তর পান</Text>
          <Text style={styles.heroDesc}>
            Ask our qualified scholars any question about Islam, Fiqh, Halal/Haram, and daily life matters.
          </Text>
        </View>

        <View style={styles.actionCards}>
          <View style={styles.actionCard}>
            <Ionicons name="create-outline" size={28} color={Theme.colors.primary} />
            <Text style={styles.actionTitle}>Ask Question</Text>
            <Text style={styles.actionBn}>প্রশ্ন করুন</Text>
          </View>
          <View style={styles.actionCard}>
            <Ionicons name="call-outline" size={28} color={Theme.colors.accent} />
            <Text style={styles.actionTitle}>Voice Call</Text>
            <Text style={styles.actionBn}>ভয়েস কল</Text>
          </View>
        </View>

        <Text style={styles.faqTitle}>Frequently Asked</Text>
        {FAQ.map((item, i) => (
          <View key={i} style={styles.faqCard}>
            <Text style={styles.faqQ}>{item.q}</Text>
            <Text style={styles.faqQBn}>{item.qBn}</Text>
            <Text style={styles.faqA}>{item.a}</Text>
            <Text style={styles.faqABn}>{item.aBn}</Text>
          </View>
        ))}

        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>Full Q&A platform coming soon</Text>
          <Text style={styles.comingSoonBn}>সম্পূর্ণ প্রশ্নোত্তর প্ল্যাটফর্ম শীঘ্রই আসছে</Text>
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
    borderColor: Theme.colors.border,
  },
  heroTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  heroBn: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.primary,
    marginTop: 4,
  },
  heroDesc: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.md,
    lineHeight: 20,
  },
  actionCards: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  actionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginTop: Theme.spacing.sm,
  },
  actionBn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
  },
  faqTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  faqCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  faqQ: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  faqQBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.sm,
  },
  faqA: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  faqABn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  comingSoon: {
    alignItems: 'center',
    padding: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
  },
  comingSoonText: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.accent,
  },
  comingSoonBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },
});
