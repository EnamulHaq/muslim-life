import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/Theme';

type Props = {
  message?: string;
};

export function LoadingState({ message = 'Loading...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Theme.colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xxl,
    gap: Theme.spacing.md,
  },
  text: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
  },
});
