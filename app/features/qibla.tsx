import { Ionicons } from '@expo/vector-icons';
import { Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Theme } from '@/constants/Theme';
import { useLocation } from '@/hooks/useLocation';
import { calculateQiblaDirection, getDistanceToKaaba } from '@/utils/qibla';
import { shadowStyle } from '@/utils/shadow';

export default function QiblaScreen() {
  const { location } = useLocation();
  const [heading, setHeading] = useState(0);
  const qiblaDirection = calculateQiblaDirection(location.latitude, location.longitude);
  const distance = getDistanceToKaaba(location.latitude, location.longitude);
  const rotation = qiblaDirection - heading;

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);
    const sub = Magnetometer.addListener((data) => {
      const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      setHeading((angle + 360) % 360);
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Header title="Qibla Compass" subtitle="কিবলা দিক নির্ণায়ক" showBack />
      <ScreenContainer scroll={false} contentStyle={styles.content}>
        <Text style={styles.location}>
          📍 {location.city}, {location.country}
        </Text>
        <Text style={styles.distance}>
          Distance to Kaaba: {Math.round(distance).toLocaleString()} km
        </Text>

        <View style={styles.compassContainer}>
          <View style={styles.compassOuter}>
            {['N', 'E', 'S', 'W'].map((dir, i) => (
              <Text
                key={dir}
                style={[
                  styles.direction,
                  { transform: [{ rotate: `${i * 90}deg` }, { translateY: -110 }] },
                ]}
              >
                {dir}
              </Text>
            ))}

            <View style={[styles.qiblaArrow, { transform: [{ rotate: `${rotation}deg` }] }]}>
              <Ionicons name="navigate" size={80} color={Theme.colors.primary} />
            </View>

            <View style={styles.centerDot} />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.qiblaAngle}>{Math.round(qiblaDirection)}°</Text>
          <Text style={styles.qiblaLabel}>Qibla Direction from North</Text>
          <Text style={styles.qiblaBn}>উত্তর থেকে কিবলার দিক</Text>
        </View>

        <View style={styles.kaabaCard}>
          <Text style={styles.kaabaEmoji}>🕋</Text>
          <Text style={styles.kaabaText}>Face this direction for Salah</Text>
          <Text style={styles.kaabaBn}>নামাজের জন্য এই দিকে মুখ করুন</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  distance: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  compassContainer: {
    marginVertical: Theme.spacing.lg,
  },
  compassOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
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
  direction: {
    position: 'absolute',
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
  },
  qiblaArrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.accent,
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    width: '100%',
    marginTop: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  qiblaAngle: {
    fontSize: 48,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  qiblaLabel: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    marginTop: 4,
  },
  qiblaBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  kaabaCard: {
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
    padding: Theme.spacing.md,
  },
  kaabaEmoji: {
    fontSize: 40,
  },
  kaabaText: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
    marginTop: Theme.spacing.sm,
  },
  kaabaBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primary,
  },
});
