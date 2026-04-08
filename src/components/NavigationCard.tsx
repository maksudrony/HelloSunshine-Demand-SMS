import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '@constants/index';

interface NavigationCardProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const NavigationCard: React.FC<NavigationCardProps> = ({icon,label,onPress,}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 40,
    padding: 14,
    marginBottom: 10,
  },
  icon: {
    fontSize: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default NavigationCard;