import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {COLORS} from '@constants/index';
import {RootStackParamList, DashboardStats, AppStatus} from '../types/index';

import AppHeader from '@components/AppHeader';
import ServiceToggleCard from '@components/ServiceToggleCard';
import NavigationCard from '@components/NavigationCard';
import StatsPanel from '@components/StatsPanel';
import StatusCard from '@components/StatusCard';
import SMSMemoryModal from '@components/SMSMemoryModal';

// Phase 3: Import our permission utility
import { requestSMSPermission } from '@utils/permissions';

type DashboardNavigationProp = NativeStackNavigationProp <
  RootStackParamList,
  'Dashboard'
>;

interface Props {
  navigation: DashboardNavigationProp;
}

// ─── Mock Data (will be replaced with real data in Phase 3) ───
const INITIAL_STATS: DashboardStats = {
  smsReceived: {
    depositSMS: 0,
    deliverySMS: 0,
    invalidSMS: 0,
    totalSMS: 0,
  },
  dataProcess: {
    pending: 0,
    process: 71,
    invalid: 3,
    totalProcess: 74,
  },
};

const INITIAL_STATUS: AppStatus = {
  isWifiConnected: true,
  isLicenceVerified: true,
  statusMessage: '',
};

const DashboardScreen: React.FC<Props> = ({navigation}) => {
  const [smsServiceEnabled, setSmsServiceEnabled] = useState(false);
  const [stats] = useState<DashboardStats>(INITIAL_STATS);
  const [appStatus] = useState<AppStatus>(INITIAL_STATUS);
  const [memoryModalVisible, setMemoryModalVisible] = useState(false);

  // ─── PHASE 3: Updated Toggle Logic with Permissions ───
  const handleToggle = async (value: boolean) => {
    if (value) {
      // User is trying to turn the service ON
      const hasPermission = await requestSMSPermission();
      
      if (hasPermission) {
        setSmsServiceEnabled(true);
        // TODO: Phase 3 - start background SMS service here later
      } else {
        Alert.alert('Permission Denied', 'HelloSunshine cannot sync data without SMS permissions.');
        setSmsServiceEnabled(false); // Force toggle back to off
      }
    } else {
      // User is turning the service OFF
      setSmsServiceEnabled(false);
      // TODO: Phase 3 - stop background SMS service here later
    }
  };

  const handleRefresh = () => {
    // Phase 3: trigger SMS processing + refresh stats
    Alert.alert('Processing', 'Processing unsynced SMS...');
  };

  const handleCheckSMSMemory = () => {
    setMemoryModalVisible(true);
  };

  const handleSMSReport = () => {
    navigation.navigate('SMSReport');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        onCheckSMSMemory={handleCheckSMSMemory}
        onSMSReport={handleSMSReport}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Toggle Card */}
        <ServiceToggleCard
          isEnabled={smsServiceEnabled}
          onToggle={handleToggle}
          onRefresh={handleRefresh}
        />

        {/* Navigation Cards Row */}
        <View style={styles.navCardsRow}>
          <NavigationCard
            icon="📊"
            label="SMS Not Pass"
            onPress={() => navigation.navigate('SMSNotSynced')}
          />
          <NavigationCard
            icon="📋"
            label="SMS Not Process"
            onPress={() => navigation.navigate('SMSNotProcessed')}
          />
        </View>

        {/* Stats Panel */}
        <StatsPanel
          smsReceived={stats.smsReceived}
          dataProcess={stats.dataProcess}
        />

        {/* Status Card */}
        <StatusCard status={appStatus} />

      </ScrollView>
      <SMSMemoryModal 
        visible={memoryModalVisible} 
        onClose={() => setMemoryModalVisible(false)} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  navCardsRow: {
    flexDirection: 'row',
    marginHorizontal: 6,
    marginTop: 12,
  },
});

export default DashboardScreen;