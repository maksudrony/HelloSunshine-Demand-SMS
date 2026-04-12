import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SMSMessage } from '../types/index';
import { fetchDeviceSMS } from '@utils/smsReader';

// Components
import ScreenHeader from '@components/ScreenHeader';
import SMSCard from '@components/SMSCard';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SMSNotSynced'>;
interface Props { navigation: NavigationProp; }

const SMSNotSyncedScreen: React.FC<Props> = ({ navigation }) => {
  const [smsList, setSmsList] = useState<SMSMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { loadUnsyncedSMS(); }, []);

  // const loadUnsyncedSMS = () => {
  //   const rawDeviceSms = [
  //     { id: '1', sender: '+8801738449485', body: 'dlv DMT-16-9662:Salam:01719082842:BRAN-Coarse Sunshine-37KG[144276];360', timestamp: '2026-04-06 12:09' },
  //     { id: '2', sender: '+8801711000001', body: 'DPZ 5000 TK received successfully.', timestamp: '2026-04-06 11:30' },
  //     { id: '3', sender: '+8801911000003', body: 'Hello bhai, kemon asen?', timestamp: '2026-04-06 10:00' }, 
  //   ];
  //   setSmsList(rawDeviceSms.map(sms => ({ ...sms, type: determineSmsType(sms.body) })));
  // };

const loadUnsyncedSMS = async () => {
    try {
      // Fetch real SMS from device!
      const realDeviceSms = await fetchDeviceSMS();
      setSmsList(realDeviceSms);
    } catch (error) {
      // Actually use the error variable to satisfy TypeScript
      console.error('Failed to read SMS:', error);
      Alert.alert('Error', 'Failed to load SMS from device memory.');
    }
  };

  const handleBulkProcess = () => {
    if (smsList.length === 0) return Alert.alert('Info', 'No SMS to process.');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('Sync Complete', `${smsList.length} SMS sent to backend.`, [{ text: 'OK', onPress: () => setSmsList([]) }]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Reusable Header Component */}
      <ScreenHeader 
        title="SMS Not Syn To DB" 
        onBack={() => navigation.goBack()} 
        onRightAction={handleBulkProcess}
        rightIcon="🔄"
        isProcessing={isProcessing}
      />

      <View style={styles.listContainer}>
        <FlatList
          data={smsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SMSCard item={item} />}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  listContainer: { flex: 1, paddingTop: 16 },
  listContent: { paddingBottom: 20 },
});

export default SMSNotSyncedScreen;