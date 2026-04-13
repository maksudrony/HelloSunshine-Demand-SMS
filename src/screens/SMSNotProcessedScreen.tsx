import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SMSMessage } from '../types/index';

// Components
import ScreenHeader from '@components/ScreenHeader';
import SMSCard from '@components/SMSCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SMSNotProcessed'>;
interface Props { navigation: NavigationProp; }

const SMSNotProcessedScreen: React.FC<Props> = ({ navigation }) => {
  const [pendingList, setPendingList] = useState<SMSMessage[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { fetchPendingData(); }, []);

  const fetchPendingData = () => {
    setIsFetching(true);
    setTimeout(() => {
      const mockDbData: SMSMessage[] = [
        { id: 'DB_101', sender: '+8801738449485', body: 'dlv DMT-16-9662:Salam:01719082842:BRAN-Coarse Sunshine-37KG[144276];360', timestamp: '2026-04-12 08:30', type: 'Delivery' },
        { id: 'DB_102', sender: '+8801811000002', body: 'DPZ 10000 TK received for ID 9928.', timestamp: '2026-04-11 15:45', type: 'Deposit' },
      ];
      setPendingList(mockDbData);
      setIsFetching(false);
    }, 1000);
  };

  const handleProcessAction = () => {
    if (pendingList.length === 0) return Alert.alert('Info', 'No pending data to process.');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('Success', 'Processing completed via Stored Procedure.');
      fetchPendingData();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Reusable Header Component */}
      <ScreenHeader 
        title="Data Not Process List" 
        onBack={() => navigation.goBack()} 
        onRightAction={handleProcessAction}
        rightIcon="🔄"
        isProcessing={isProcessing || isFetching} 
      />

      <View style={styles.listContainer}>
        {isFetching ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator color="#E8531F" size="large" />
            <Text style={styles.loadingText}>Fetching pending data...</Text>
          </View>
        ) : (
          <FlatList
            data={pendingList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SMSCard item={item} timestampSuffix=" (Server Time)" />}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  listContainer: { flex: 1, paddingTop: 16 },
  listContent: { paddingBottom: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  loadingText: { color: '#6b7280', fontSize: 14, marginTop: 12 },
});

export default SMSNotProcessedScreen;