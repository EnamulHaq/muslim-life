import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchBar } from '@/components/ui/SearchBar';
import { Theme } from '@/constants/Theme';
import { NAMES_OF_ALLAH } from '@/data/namesOfAllah';

export default function NamesOfAllahScreen() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return NAMES_OF_ALLAH;
    return NAMES_OF_ALLAH.filter(
      (n) =>
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q) ||
        n.meaningBn.includes(search) ||
        n.arabic.includes(search)
    );
  }, [search]);

  return (
    <View style={styles.wrapper}>
      <Header title="99 Names of Allah" subtitle="আল্লাহর ৯৯ নাম" showBack />
      <ScreenContainer>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search name..." />

        <View style={styles.grid}>
          {filtered.map((name) => (
            <View key={name.number} style={styles.card}>
              <Text style={styles.number}>{name.number}</Text>
              <Text style={styles.arabic}>{name.arabic}</Text>
              <Text style={styles.transliteration}>{name.transliteration}</Text>
              <Text style={styles.meaning}>{name.meaning}</Text>
              <Text style={styles.meaningBn}>{name.meaningBn}</Text>
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
    gap: Theme.spacing.sm,
  },
  card: {
    width: '47%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  number: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '700',
    color: Theme.colors.accent,
    marginBottom: 4,
  },
  arabic: {
    fontSize: Theme.fontSize.arabic,
    color: Theme.colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  transliteration: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  meaning: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  meaningBn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.primary,
    marginTop: 2,
    textAlign: 'center',
  },
});
