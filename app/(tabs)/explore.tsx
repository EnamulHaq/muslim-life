import { StyleSheet, Text, View } from 'react-native';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FEATURES, Theme } from '@/constants/Theme';

export default function ExploreScreen() {
  return (
    <View style={styles.wrapper}>
      <Header title="Explore" subtitle="Muslim Life · সকল ফিচার" />
      <ScreenContainer>
        <SectionHeading
          title="All Features"
          subtitle="আপনার সম্পূর্ণ ইসলামিক জীবনযাত্রার সঙ্গী"
        />
        <View style={styles.grid}>
          {FEATURES.map((feature) => (
            <View key={feature.id} style={styles.item}>
              <FeatureCard feature={feature} size="large" />
            </View>
          ))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '48%',
    marginBottom: Theme.spacing.sm,
  },
});
