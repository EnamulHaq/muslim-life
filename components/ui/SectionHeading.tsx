import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/Theme';

type Props = {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
};

export function SectionHeading({ title, subtitle, rightAction }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 22,
  },
});
