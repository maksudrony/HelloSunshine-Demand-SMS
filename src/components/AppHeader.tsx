import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, BackHandler, } from 'react-native';
import {COLORS, STRINGS} from '@constants/index';

interface MenuItem {
  id: string;
  label: string;
}

interface AppHeaderProps {
  onCheckSMSMemory: () => void;
  onSMSReport: () => void;
}

const MENU_ITEMS: MenuItem[] = [
  {id: '1', label: STRINGS.checkSMSMemory},
  {id: '2', label: STRINGS.smsReport},
];

const AppHeader: React.FC<AppHeaderProps> = ({onCheckSMSMemory, onSMSReport}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuSelect = (id: string) => {
    setMenuVisible(false);
    if (id === '1') onCheckSMSMemory();
    if (id === '2') onSMSReport();
  };

  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={styles.header}>
      {/* Exit Button */}
      <TouchableOpacity onPress={handleExit} style={styles.iconButton}>
        <Text style={styles.exitIcon}>⏻</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{STRINGS.appName}</Text>

      {/* 3-dot Menu */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.iconButton}>
        <Text style={styles.menuDots}>⋮</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            {MENU_ITEMS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuSelect(item.id)}>
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    elevation: 4,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    padding: 6,
  },
  exitIcon: {
    color: COLORS.white,
    fontSize: 20,
  },
  menuDots: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 52,
    paddingRight: 8,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    elevation: 6,
    minWidth: 180,
    paddingVertical: 4,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 15,
    color: COLORS.text,
  },
});

export default AppHeader;