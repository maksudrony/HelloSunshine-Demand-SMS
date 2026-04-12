import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface SMSMemoryModalProps {
  visible: boolean;
  onClose: () => void;
}

const SMSMemoryModal: React.FC<SMSMemoryModalProps> = ({ visible, onClose }) => {
  // Mock Memory Data (We will connect this to device storage in Phase 3)
  const totalCapacity = 10000;
  const usedCapacity = 8450;
  const freeCapacity = totalCapacity - usedCapacity;
  const usedPercentage = (usedCapacity / totalCapacity) * 100;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          
          <View style={styles.header}>
            <Text style={styles.title}>💾 SMS Memory Status</Text>
          </View>

          <View style={styles.body}>
            {/* Visual Progress Bar */}
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${usedPercentage}%` }]} />
            </View>
            <Text style={styles.percentageText}>{usedPercentage.toFixed(1)}% Used</Text>

            {/* Storage Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Capacity:</Text>
                <Text style={styles.detailValue}>{totalCapacity.toLocaleString()} SMS</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Used Storage:</Text>
                <Text style={[styles.detailValue, { color: '#E8531F' }]}>{usedCapacity.toLocaleString()} SMS</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Free Space:</Text>
                <Text style={[styles.detailValue, { color: '#166534' }]}>{freeCapacity.toLocaleString()} SMS</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    width: width * 0.85,
    borderRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  body: {
    padding: 20,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E8531F',
    borderRadius: 6,
  },
  percentageText: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E8531F',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  closeButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
});

export default SMSMemoryModal;