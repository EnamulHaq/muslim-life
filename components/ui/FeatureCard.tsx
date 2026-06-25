import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/Theme';
import type { FeatureItem } from '@/constants/Theme';
import { shadowStyle } from '@/utils/shadow';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  time: 'time-outline',
  school: 'school-outline',
  ribbon: 'ribbon-outline',
  book: 'book-outline',
  library: 'library-outline',
  heart: 'heart-outline',
  ellipse: 'ellipse-outline',
  compass: 'compass-outline',
  calculator: 'calculator-outline',
  calendar: 'calendar-outline',
  star: 'star-outline',
  location: 'location-outline',
  chatbubbles: 'chatbubbles-outline',
  people: 'people-outline',
};

type Props = {
  feature: FeatureItem;
  size?: 'small' | 'large';
};

export function FeatureCard({ feature, size = 'small' }: Props) {
  const iconName = ICON_MAP[feature.icon] ?? 'apps-outline';
  const isLarge = size === 'large';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isLarge && styles.cardLarge,
        pressed && styles.pressed,
      ]}
      onPress={() => router.push(feature.route as never)}
    >
      <View style={[styles.iconWrap, { backgroundColor: feature.color + '18' }]}>
        <Ionicons name={iconName} size={isLarge ? 28 : 24} color={feature.color} />
      </View>
      <Text style={[styles.title, isLarge && styles.titleLarge]} numberOfLines={2}>
        {feature.title}
      </Text>
      <Text style={styles.titleBn} numberOfLines={1}>
        {feature.titleBn}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    ...shadowStyle({
      color: Theme.colors.cardShadow,
      offset: { width: 0, height: 4 },
      radius: 12,
      elevation: 4,
    }),
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardLarge: {
    minHeight: 130,
    padding: Theme.spacing.lg,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
  },
  title: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  titleLarge: {
    fontSize: Theme.fontSize.md,
  },
  titleBn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
    textAlign: 'center',
  },
});
