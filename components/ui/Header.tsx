import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/constants/Theme';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
};

export function Header({ title, subtitle, showBack = false, onBack, rightAction }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + Theme.spacing.sm }]}
    >
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={onBack ?? (() => router.back())} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Theme.colors.textLight} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>{rightAction ?? <View style={styles.backPlaceholder} />}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 40,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.textLight,
  },
  subtitle: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
});
