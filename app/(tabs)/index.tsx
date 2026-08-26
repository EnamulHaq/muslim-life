import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { memo, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FEATURES, Theme } from '@/constants/Theme';
import { useLocation } from '@/hooks/useLocation';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { formatTime, getHijriDate } from '@/utils/prayerTimes';

/**
 * Isolated countdown component — re-renders every 1s without
 * triggering re-renders of the rest of the HomeScreen tree.
 */
const CountdownTimer = memo(function CountdownTimer() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text style={styles.currentTime}>
      {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
    </Text>
  );
});

/**
 * Isolated countdown display for the next prayer card.
 * Updates every second independently of the rest of the screen.
 */
const PrayerCountdown = memo(function PrayerCountdown({ countdown }: { countdown: { hours: number; minutes: number; seconds: number } }) {
  return (
    <View style={styles.countdown}>
      <Text style={styles.countdownText}>
        {String(countdown.hours).padStart(2, '0')}:
        {String(countdown.minutes).padStart(2, '0')}:
        {String(countdown.seconds).padStart(2, '0')}
      </Text>
      <Text style={styles.countdownLabel}>remaining</Text>
    </View>
  );
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { location } = useLocation();
  const { prayers, nextPrayer, countdown } = usePrayerTimes(location.latitude, location.longitude);
  const hijri = getHijriDate();

  const featuredFeatures = FEATURES.slice(0, 8);

  return (
    <ScreenContainer contentStyle={{ padding: 0 }}>
      <LinearGradient
        colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd, '#0D6B45']}
        style={[styles.hero, { paddingTop: insets.top + Theme.spacing.md }]}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greeting}>Assalamu Alaikum</Text>
            <Text style={styles.greetingBn}>আসসালামু আলাইকুম</Text>
            <Text style={styles.appName}>Muslim Life</Text>
          </View>
          <Pressable style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={Theme.colors.textLight} />
          </Pressable>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={Theme.colors.accentLight} />
          <Text style={styles.locationText}>
            {location.city}, {location.country}
          </Text>
        </View>

        <Text style={styles.hijriDate}>
          {hijri.day} {hijri.monthBn} {hijri.year} হিজরি
        </Text>

        {nextPrayer && (
          <View style={styles.nextPrayerCard}>
            <View>
              <Text style={styles.nextLabel}>Next Prayer · {nextPrayer.labelBn}</Text>
              <Text style={styles.nextName}>{nextPrayer.label}</Text>
              <Text style={styles.nextTime}>{formatTime(nextPrayer.time)}</Text>
            </View>
            <PrayerCountdown countdown={countdown} />
          </View>
        )}

        <CountdownTimer />
      </LinearGradient>

      <View style={styles.section}>
        <SectionHeading
          title="Today's Prayers"
          subtitle="আজকের নামাজ"
          rightAction={
            <Pressable onPress={() => router.push('/features/prayer-times')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          }
        />
        <View style={styles.prayerRow}>
          {prayers
            .filter((p) => p.name !== 'sunrise')
            .map((prayer) => {
              const isNext = nextPrayer?.name === prayer.name;
              return (
                <View
                  key={prayer.name}
                  style={[styles.prayerPill, isNext && styles.prayerPillActive]}
                >
                  <Text style={[styles.prayerPillName, isNext && styles.prayerPillNameActive]}>
                    {prayer.labelBn}
                  </Text>
                  <Text style={[styles.prayerPillTime, isNext && styles.prayerPillTimeActive]}>
                    {formatTime(prayer.time)}
                  </Text>
                </View>
              );
            })}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Quick Access" subtitle="দ্রুত অ্যাক্সেস" />
        <View style={styles.featureGrid}>
          {featuredFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <FeatureCard feature={feature} />
            </View>
          ))}
        </View>
      </View>

      <Pressable
        style={styles.dailyCard}
        onPress={() => router.push('/features/dua')}
      >
        <LinearGradient
          colors={['#C9A227', '#E8D48B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dailyGradient}
        >
          <View>
            <Text style={styles.dailyTitle}>Daily Dua & Azkar</Text>
            <Text style={styles.dailySubtitle}>দৈনন্দিন দোয়া ও যিকির</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Theme.colors.primaryDark} />
        </LinearGradient>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
    borderBottomLeftRadius: Theme.borderRadius.xl,
    borderBottomRightRadius: Theme.borderRadius.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  greeting: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '700',
    color: Theme.colors.textLight,
  },
  greetingBn: {
    fontSize: Theme.fontSize.md,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    lineHeight: 22,
  },
  appName: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.accentLight,
    marginTop: 6,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  hijriDate: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.accentLight,
    marginBottom: Theme.spacing.lg,
  },
  nextPrayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  nextLabel: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  nextName: {
    fontSize: Theme.fontSize.hero,
    fontWeight: '800',
    color: Theme.colors.textLight,
    marginVertical: 4,
  },
  nextTime: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.accentLight,
    fontWeight: '600',
  },
  countdown: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  countdownText: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.accentLight,
    fontVariant: ['tabular-nums'],
  },
  countdownLabel: {
    fontSize: Theme.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  currentTime: {
    textAlign: 'center',
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: Theme.spacing.md,
  },
  section: {
    padding: Theme.spacing.md,
  },
  seeAll: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  prayerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  prayerPill: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  prayerPillActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  prayerPillName: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  prayerPillNameActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  prayerPillTime: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: 2,
  },
  prayerPillTimeActive: {
    color: Theme.colors.textLight,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    marginBottom: Theme.spacing.sm,
  },
  dailyCard: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  dailyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.lg,
  },
  dailyTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.primaryDark,
  },
  dailySubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primaryDark,
    opacity: 0.8,
    marginTop: 2,
  },
});
