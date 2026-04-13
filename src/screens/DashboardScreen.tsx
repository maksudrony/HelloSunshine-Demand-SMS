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

import { requestSMSPermission } from '@utils/permissions';

// ─── NEW: Import your API Service ───
import { syncSmsToDatabase, SunshineMobileSms_202604 } from '../services/apiSync';

type DashboardNavigationProp = NativeStackNavigationProp <
  RootStackParamList,
  'Dashboard'
>;

interface Props {
  navigation: DashboardNavigationProp;
}

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

  const handleToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await requestSMSPermission();
      
      if (hasPermission) {
        setSmsServiceEnabled(true);
      } else {
        Alert.alert('Permission Denied', 'HelloSunshine cannot sync data without SMS permissions.');
        setSmsServiceEnabled(false); 
      }
    } else {
      setSmsServiceEnabled(false);
    }
  };

  // ─── NEW: Firing the API when you click Refresh ───
  const handleRefresh = async () => {
    Alert.alert('Processing', 'Attempting to sync with Oracle Database...');

    // 1. Prepare the dummy data for testing
    const dummySms: SunshineMobileSms_202604[] = [
      {
        SMS_FROM_MOBILE: "+8801738449485",
        SMS_TEXT: "dlv DMT-16-9662:Salam:01719082842:BRAN",
        SMS_ID: Math.floor(Math.random() * 100000), // Random ID so Oracle doesn't block it as duplicate
        SMS_DEVICE_DATE: "04/13/2026 15:30:00", 
        READ_FLAG: "AUTO",
        LICENCE_NO: "2026",
        APP_VERSION: "2"
      }
    ];

    // 2. Send it to .NET
    const result = await syncSmsToDatabase(dummySms);

    // 3. Show the result from the server
    if (result.Success) {
      Alert.alert("Success!", result.Message);
    } else {
      Alert.alert("Failed", result.Message);
    }
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