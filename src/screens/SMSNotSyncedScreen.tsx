import React, { useState, useEffect } from 'react';
import { View,Text,FlatList,TouchableOpacity,Alert,ActivityIndicator,StyleSheet, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SMSMessage, SMSType } from '../types/index';
import { determineSmsType } from '@utils/smsLogic';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SMSNotSynced'>;

interface Props {
  navigation: NavigationProp;
}

const SMSNotSyncedScreen: React.FC<Props> = ({ navigation }) => {
  const [smsList, setSmsList] = useState<SMSMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadUnsyncedSMS();
  }, []);

  const loadUnsyncedSMS = () => {
    const rawDeviceSms = [
      { id: '1', sender: '+8801738449485', body: 'dlv DMT-16-9662:Salam:01719082842:BRAN-Coarse Sunshine-37KG[144276];360', timestamp: '2026-04-06 12:09' },
      { id: '2', sender: '+8801711000001', body: 'DPZ 5000 TK received successfully.', timestamp: '2026-04-06 11:30' },
      { id: '3', sender: '+8801911000003', body: 'Hello bhai, kemon asen?', timestamp: '2026-04-06 10:00' }, 
    ];

    const processedList: SMSMessage[] = rawDeviceSms.map(sms => ({
      ...sms,
      type: determineSmsType(sms.body)
    }));

    setSmsList(processedList);
  };

  const handleBulkProcess = () => {
    if (smsList.length === 0) {
      Alert.alert('Info', 'No SMS to process.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Sync Complete',
        `${smsList.length} SMS sent to .NET Backend.\nOracle DB ADDRESS2 validation will be applied on the server.`,
        [{ text: 'OK', onPress: () => setSmsList([]) }]
      );
    }, 1500);
  };

  const getTypeStyles = (type: SMSType) => {
    switch (type) {
      case 'Deposit': return [styles.badgeContainer, styles.badgeDeposit];
      case 'Delivery': return [styles.badgeContainer, styles.badgeDelivery];
      case 'Invalid': return [styles.badgeContainer, styles.badgeInvalid];
      default: return [styles.badgeContainer, styles.badgeDefault];
    }
  };

  const getTypeColor = (type: SMSType) => {
    switch (type) {
      case 'Deposit': return '#166534';
      case 'Delivery': return '#1e40af';
      case 'Invalid': return '#991b1b';
      default: return '#374151';
    }
  };

  const renderSMSCard = ({ item }: { item: SMSMessage }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.senderText}>{item.sender}</Text>
        <View style={getTypeStyles(item.type)}>
          <Text style={[styles.badgeText, { color: getTypeColor(item.type) }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.bodyText} numberOfLines={2}>
        {item.body}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.timestampText}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Text style={styles.iconText}>✕</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>SMS Not Syn To DB</Text>

        <TouchableOpacity onPress={handleBulkProcess} disabled={isProcessing} style={styles.iconButton}>
          {isProcessing ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.iconTextRefresh}>🔄</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={smsList}
          keyExtractor={(item) => item.id}
          renderItem={renderSMSCard}
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
  header: {
    backgroundColor: '#E8531F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  iconButton: { padding: 8 },
  iconText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  iconTextRefresh: { color: '#ffffff', fontSize: 22 },
  listContainer: { flex: 1, paddingTop: 16 },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  senderText: { color: '#111827', fontWeight: 'bold', fontSize: 16 },
  badgeContainer: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  badgeDeposit: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  badgeDelivery: { backgroundColor: '#dbeafe', borderColor: '#93c5fd' },
  badgeInvalid: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  badgeDefault: { backgroundColor: '#f3f4f6', borderColor: '#d1d5db' },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  bodyText: { color: '#4b5563', fontSize: 14, marginBottom: 12, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  timestampText: { color: '#9ca3af', fontSize: 12, fontWeight: '500' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: '#6b7280', fontSize: 16, fontWeight: '500' },
});

export default SMSNotSyncedScreen;