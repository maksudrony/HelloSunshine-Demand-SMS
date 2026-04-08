import React from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS, STRINGS} from '@constants/index';

interface ServiceToggleCardProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  onRefresh: () => void;
}

const ServiceToggleCard: React.FC<ServiceToggleCardProps> = ({isEnabled,onToggle,onRefresh,}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{STRINGS.enableSMSService}</Text>
      <View style={styles.rightSection}>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{false: COLORS.border, true: COLORS.primary}}
          thumbColor={COLORS.white}
        />
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refreshButton: {
    padding: 4,
  },
  refreshIcon: {
    fontSize: 22,
  },
});

export default ServiceToggleCard;