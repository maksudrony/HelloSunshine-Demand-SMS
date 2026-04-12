import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SMSMessage, SMSType } from '../types/index';

interface SMSCardProps {
  item: SMSMessage;
  // Optional prop so the second screen can add "(Server Time)"
  timestampSuffix?: string; 
}

const SMSCard: React.FC<SMSCardProps> = ({ item, timestampSuffix = '' }) => {
  const getTypeStyles = (type: SMSType) => {
    switch (type) {
      case 'Deposit': return [styles.badgeContainer, styles.badgeDeposit];
      case 'Delivery': return [styles.badgeContainer, styles.badgeDelivery];
      case 'Invalid': return [styles.badgeContainer, styles.badgeInvalid];
      default: return [styles.badgeContainer, styles.badgeDefault];
    }
  };

  const getTypeColor = (type: SMSType) => {
    switch (type) {
      case 'Deposit': return '#166534';
      case 'Delivery': return '#1e40af';
      case 'Invalid': return '#991b1b';
      default: return '#374151';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.senderText}>{item.sender}</Text>
        <View style={getTypeStyles(item.type)}>
          <Text style={[styles.badgeText, { color: getTypeColor(item.type) }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.bodyText} numberOfLines={2}>
        {item.body}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.timestampText}>
          {item.timestamp}{timestampSuffix}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  senderText: { color: '#111827', fontWeight: 'bold', fontSize: 16 },
  badgeContainer: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  badgeDeposit: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  badgeDelivery: { backgroundColor: '#dbeafe', borderColor: '#93c5fd' },
  badgeInvalid: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  badgeDefault: { backgroundColor: '#f3f4f6', borderColor: '#d1d5db' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  bodyText: { color: '#4b5563', fontSize: 14, marginBottom: 12, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  timestampText: { color: '#9ca3af', fontSize: 12, fontWeight: '500' },
});

export default SMSCard;