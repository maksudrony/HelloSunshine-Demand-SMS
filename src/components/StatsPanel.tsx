import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, STRINGS} from '@constants/index';
import {SMSReceivedStats, DataProcessStats} from '../types/index';

interface StatsPanelProps {
  smsReceived: SMSReceivedStats;
  dataProcess: DataProcessStats;
}

interface StatRowProps {
  label: string;
  value: number;
  isTotal?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({label, value, isTotal = false}) => (
  <View style={styles.statRow}>
    <Text style={[styles.statLabel, isTotal && styles.totalLabel]}>
      {label}
    </Text>
    <Text style={[styles.statValue, isTotal && styles.totalLabel]}>
      {value}
    </Text>
  </View>
);

const StatsPanel: React.FC<StatsPanelProps> = ({smsReceived, dataProcess}) => {
  return (
    <View style={styles.card}>
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{STRINGS.smsReceived}</Text>
        <View style={styles.divider} />
        <StatRow label={STRINGS.depositSMS} value={smsReceived.depositSMS} />
        <StatRow label={STRINGS.deliverySMS} value={smsReceived.deliverySMS} />
        <StatRow label={STRINGS.invalidSMS} value={smsReceived.invalidSMS} />
        <StatRow
          label={STRINGS.totalSMS}
          value={smsReceived.totalSMS}
          isTotal
        />
      </View>

      <View style={styles.verticalDivider} />

      <View style={styles.column}>
        <Text style={styles.columnTitle}>{STRINGS.dataProcess}</Text>
        <View style={styles.divider} />
        <StatRow label={STRINGS.pending} value={dataProcess.pending} />
        <StatRow label={STRINGS.process} value={dataProcess.process} />
        <StatRow label={STRINGS.invalid} value={dataProcess.invalid} />
        <StatRow
          label={STRINGS.totalProcess}
          value={dataProcess.totalProcess}
          isTotal
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    elevation: 2,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 8,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text,
  },
  statValue: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 13,
  },
});

export default StatsPanel;