import { StyleSheet, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Theme } from '@/constants/Theme';
import { getHijriDate } from '@/utils/prayerTimes';

const ISLAMIC_EVENTS = [
  { name: 'Islamic New Year', nameBn: 'ইসলামিক নববর্ষ', hijriMonth: 'Muharram', hijriDay: 1 },
  { name: 'Ashura', nameBn: 'আশুরা', hijriMonth: 'Muharram', hijriDay: 10 },
  { name: 'Mawlid an-Nabi', nameBn: 'ঈদে মিলাদুন্নবী', hijriMonth: 'Rabiʻ I', hijriDay: 12 },
  { name: 'Isra and Mi\'raj', nameBn: 'শবে মেরাজ', hijriMonth: 'Rajab', hijriDay: 27 },
  { name: 'Mid-Sha\'ban', nameBn: 'শবে বরাত', hijriMonth: 'Shaʻban', hijriDay: 15 },
  { name: 'Ramadan Begins', nameBn: 'রমজান শুরু', hijriMonth: 'Ramadan', hijriDay: 1 },
  { name: 'Laylat al-Qadr', nameBn: 'শবে কদর', hijriMonth: 'Ramadan', hijriDay: 27 },
  { name: 'Eid al-Fitr', nameBn: 'ঈদুল ফিতর', hijriMonth: 'Shawwal', hijriDay: 1 },
  { name: 'Day of Arafah', nameBn: 'আরাফার দিন', hijriMonth: "Dhuʻl-Hijjah", hijriDay: 9 },
  { name: 'Eid al-Adha', nameBn: 'ঈদুল আযহা', hijriMonth: "Dhuʻl-Hijjah", hijriDay: 10 },
];

export default function CalendarScreen() {
  const hijri = getHijriDate();
  const gregorian = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.wrapper}>
      <Header title="Islamic Calendar" subtitle="ইসলামিক ক্যালেন্ডার" showBack />
      <ScreenContainer>
        <View style={styles.todayCard}>
          <Text style={styles.todayLabel}>Today</Text>
          <Text style={styles.gregorian}>{gregorian}</Text>
          <Text style={styles.hijri}>
            {hijri.day} {hijri.monthBn} {hijri.year} হিজরি
          </Text>
          <Text style={styles.hijriEn}>
            {hijri.day} {hijri.month} {hijri.year} AH
          </Text>
        </View>

        <SectionHeading
          title="Important Islamic Dates"
          subtitle="গুরুত্বপূর্ণ ইসলামিক দিনসমূহ"
        />

        {ISLAMIC_EVENTS.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>{event.hijriDay}</Text>
              <Text style={styles.eventMonth}>{event.hijriMonth}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventNameBn}>{event.nameBn}</Text>
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
  todayCard: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  todayLabel: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  gregorian: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.textLight,
    fontWeight: '600',
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  hijri: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '800',
    color: Theme.colors.accentLight,
    marginTop: Theme.spacing.md,
  },
  hijriEn: {
    fontSize: Theme.fontSize.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  eventDate: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  eventDay: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  eventMonth: {
    fontSize: 8,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  eventNameBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
});
