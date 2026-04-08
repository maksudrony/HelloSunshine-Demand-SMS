import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, STRINGS} from '@constants/index';
import {AppStatus} from '../types/index';

interface StatusCardProps {
  status: AppStatus;
}

const StatusCard: React.FC<StatusCardProps> = ({status}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.statusText}>
        {status.isWifiConnected
          ? STRINGS.wifiConnected
          : STRINGS.notConnected}
      </Text>
      <Text style={styles.statusText}>
        {status.isLicenceVerified
          ? STRINGS.licenceVerified
          : STRINGS.licenceNotVerified}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    elevation: 2,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default StatusCard;