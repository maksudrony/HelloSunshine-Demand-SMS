import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SMSMessage } from '../types/index';
import { determineSmsType } from '@utils/smsLogic';
import SMSCard from '@components/SMSCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SMSNotSynced'>;

interface Props { navigation: NavigationProp; }

const SMSNotSyncedScreen: React.FC<Props> = ({ navigation }) => {
  const [smsList, setSmsList] = useState<SMSMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { loadUnsyncedSMS(); }, []);

  const loadUnsyncedSMS = () => {
    const rawDeviceSms = [
      { id: '1', sender: '+8801738449485', body: 'dlv DMT-16-9662:Salam:01719082842:BRAN-Coarse Sunshine-37KG[144276];360', timestamp: '2026-04-06 12:09' },
      { id: '2', sender: '+8801711000001', body: 'DPZ 5000 TK received successfully.', timestamp: '2026-04-06 11:30' },
      { id: '3', sender: '+8801911000003', body: 'Hello bhai, kemon asen?', timestamp: '2026-04-06 10:00' }, 
    ];
    setSmsList(rawDeviceSms.map(sms => ({ ...sms, type: determineSmsType(sms.body) })));
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Text style={styles.iconText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SMS Not Syn To DB</Text>
        <TouchableOpacity onPress={handleBulkProcess} disabled={isProcessing} style={styles.iconButton}>
          {isProcessing ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={styles.iconTextRefresh}>🔄</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={smsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SMSCard item={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>All SMS synced successfully!</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: '#E8531F', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, elevation: 4 },
  iconButton: { padding: 8 },
  iconText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  iconTextRefresh: { color: '#ffffff', fontSize: 22 },
  listContainer: { flex: 1, paddingTop: 16 },
  listContent: { paddingBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: '#6b7280', fontSize: 16, fontWeight: '500' },
});

export default SMSNotSyncedScreen;