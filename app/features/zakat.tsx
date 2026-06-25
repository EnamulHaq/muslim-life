import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Theme } from '@/constants/Theme';

const NISAB_GOLD_GRAMS = 87.48;
const GOLD_PRICE_PER_GRAM = 8500; // approximate BDT

export default function ZakatScreen() {
  const [cash, setCash] = useState('');
  const [gold, setGold] = useState('');
  const [silver, setSilver] = useState('');
  const [investments, setInvestments] = useState('');
  const [debts, setDebts] = useState('');

  const cashVal = parseFloat(cash) || 0;
  const goldVal = parseFloat(gold) || 0;
  const silverVal = parseFloat(silver) || 0;
  const investVal = parseFloat(investments) || 0;
  const debtVal = parseFloat(debts) || 0;

  const totalWealth = cashVal + goldVal + silverVal + investVal - debtVal;
  const nisab = NISAB_GOLD_GRAMS * GOLD_PRICE_PER_GRAM;
  const isEligible = totalWealth >= nisab;
  const zakatAmount = isEligible ? totalWealth * 0.025 : 0;

  return (
    <View style={styles.wrapper}>
      <Header title="Zakat Calculator" subtitle="যাকাত ক্যালকুলেটর" showBack />
      <ScreenContainer>
        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>Zakat = 2.5% of eligible wealth</Text>
          <Text style={styles.infoBn}>যাকাত = যোগ্য সম্পদের ২.৫%</Text>
          <Text style={styles.nisab}>
            Nisab: ৳{nisab.toLocaleString()} ({NISAB_GOLD_GRAMS}g gold)
          </Text>
        </View>

        {[
          { label: 'Cash & Savings', labelBn: 'নগদ ও সঞ্চয়', value: cash, set: setCash },
          { label: 'Gold Value (৳)', labelBn: 'স্বর্ণের মূল্য', value: gold, set: setGold },
          { label: 'Silver Value (৳)', labelBn: 'রূপার মূল্য', value: silver, set: setSilver },
          { label: 'Investments', labelBn: 'বিনিয়োগ', value: investments, set: setInvestments },
          { label: 'Debts (-)', labelBn: 'ঋণ (-)', value: debts, set: setDebts },
        ].map((field) => (
          <View key={field.label} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <Text style={styles.inputLabelBn}>{field.labelBn}</Text>
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.set}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Theme.colors.textSecondary}
            />
          </View>
        ))}

        <View style={styles.resultCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Total Wealth</Text>
            <Text style={styles.resultValue}>৳{totalWealth.toLocaleString()}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Eligible for Zakat?</Text>
            <Text style={[styles.resultValue, { color: isEligible ? Theme.colors.success : Theme.colors.error }]}>
              {isEligible ? 'Yes ✓' : 'No ✗'}
            </Text>
          </View>
          <View style={[styles.resultRow, styles.zakatRow]}>
            <Text style={styles.zakatLabel}>Zakat Amount</Text>
            <Text style={styles.zakatAmount}>৳{zakatAmount.toLocaleString()}</Text>
          </View>
          <Text style={styles.zakatBn}>যাকাতের পরিমাণ</Text>
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
  infoBanner: {
    backgroundColor: Theme.colors.primary + '12',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
  },
  infoTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  infoBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  nisab: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
  },
  inputGroup: {
    marginBottom: Theme.spacing.md,
  },
  inputLabel: {
    fontSize: Theme.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  inputLabelBn: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  resultCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    borderWidth: 2,
    borderColor: Theme.colors.accent,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  resultLabel: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
  },
  resultValue: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  zakatRow: {
    borderBottomWidth: 0,
    marginTop: Theme.spacing.sm,
  },
  zakatLabel: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  zakatAmount: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  zakatBn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
});
