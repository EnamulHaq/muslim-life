import { Ionicons } from '@expo/vector-icons';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Theme } from '@/constants/Theme';
import { useFitness } from '@/hooks/useFitness';

export default function FitnessScreen() {
  const {
    steps,
    distanceKm,
    runDistanceKm,
    isTrackingRun,
    pedometerAvailable,
    startRun,
    stopRun,
  } = useFitness();

  const handleRunToggle = async () => {
    if (isTrackingRun) {
      await stopRun();
      return;
    }

    const started = await startRun();
    if (!started) {
      Alert.alert('Location needed', 'Allow location access to track your run distance.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Header title="Fitness" subtitle="পদক্ষেপ ও দৌড় ট্র্যাকিং" showBack />
      <ScreenContainer>
        <View style={styles.hero}>
          <Ionicons name="footsteps" size={32} color={Theme.colors.textLight} />
          <Text style={styles.heroTitle}>Today's Activity</Text>
          <Text style={styles.heroSubtitle}>আজকের কার্যকলাপ</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="walk" size={24} color={Theme.colors.primary} />
            <Text style={styles.statValue}>{steps.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Steps</Text>
            <Text style={styles.statLabelBn}>পদক্ষেপ</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="map" size={24} color={Theme.colors.accent} />
            <Text style={styles.statValue}>{distanceKm.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Est. km</Text>
            <Text style={styles.statLabelBn}>আনুমানিক কিমি</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="speedometer" size={24} color={Theme.colors.secondary} />
            <Text style={styles.statValue}>{runDistanceKm.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Run km</Text>
            <Text style={styles.statLabelBn}>দৌড় কিমি</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.runButton,
            isTrackingRun && styles.runButtonActive,
            pressed && styles.pressed,
          ]}
          onPress={handleRunToggle}
        >
          <Ionicons
            name={isTrackingRun ? 'stop-circle' : 'play-circle'}
            size={28}
            color={Theme.colors.textLight}
          />
          <Text style={styles.runButtonText}>
            {isTrackingRun ? 'Stop Run' : 'Start Run'}
          </Text>
          <Text style={styles.runButtonTextBn}>
            {isTrackingRun ? 'দৌড় বন্ধ করুন' : 'দৌড় শুরু করুন'}
          </Text>
        </Pressable>

        {Platform.OS === 'web' ? (
          <Text style={styles.note}>
            Step counting works on iOS and Android. On web, use the run tracker with location
            permission.
          </Text>
        ) : !pedometerAvailable ? (
          <Text style={styles.note}>
            Step sensor is not available on this device. You can still track run distance with GPS.
          </Text>
        ) : (
          <Text style={styles.note}>
            Estimated distance uses an average stride of 0.76 m per step. Run distance uses GPS.
          </Text>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  hero: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  heroTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.textLight,
  },
  heroSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.accentLight,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  statLabelBn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
  },
  runButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    gap: 4,
    marginBottom: Theme.spacing.md,
  },
  runButtonActive: {
    backgroundColor: Theme.colors.error,
  },
  pressed: {
    opacity: 0.9,
  },
  runButtonText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.textLight,
  },
  runButtonTextBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.accentLight,
  },
  note: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});
