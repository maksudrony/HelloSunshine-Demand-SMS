import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  onRightAction?: () => void;
  rightIcon?: string;
  isProcessing?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  onBack, 
  onRightAction, 
  rightIcon, 
  isProcessing = false 
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.iconButton}>
        <Text style={styles.iconText}>✕</Text>
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Dynamic Right Side */}
      <View style={styles.iconButton}>
        {isProcessing ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : onRightAction && rightIcon ? (
          <TouchableOpacity onPress={onRightAction}>
            <Text style={styles.iconTextRefresh}>{rightIcon}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E8531F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  iconButton: { padding: 8, width: 40, alignItems: 'center' },
  iconText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  iconTextRefresh: { color: '#ffffff', fontSize: 22 },
});

export default ScreenHeader;