import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Theme } from '@/constants/Theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

export function ScreenContainer({ children, scroll = true, style, contentStyle }: Props) {
  const { colors } = useAppTheme();

  if (scroll) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }, style]}
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, styles.content, { backgroundColor: colors.background }, style, contentStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
});
