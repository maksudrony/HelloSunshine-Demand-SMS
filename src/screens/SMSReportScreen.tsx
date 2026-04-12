import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, SectionList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SMSMessage } from '../types/index';
import { determineSmsType } from '@utils/smsLogic';
import SMSCard from '@components/SMSCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SMSReport'>;

interface Props {
  navigation: NavigationProp;
}

// Type for the SectionList grouping
interface SMSSection {
  title: string;
  data: SMSMessage[];
}

const SMSReportScreen: React.FC<Props> = ({ navigation }) => {
  const [allSms, setAllSms] = useState<SMSMessage[]>([]);
  const [searchNumber, setSearchNumber] = useState('');
  const [searchDate, setSearchDate] = useState(''); // Leaving blank to show all by default

  useEffect(() => {
    loadDeviceSms();
  }, []);

  const loadDeviceSms = () => {
    // Mocking a larger dataset from the device to show date grouping
    const rawDeviceSms = [
      { id: '1', sender: '+8801738449485', body: 'dlv DMT-16-9662:Salam:01719082842:BRAN-Coarse Sunshine-37KG[144276];360', timestamp: '2026-04-07 12:09' },
      { id: '2', sender: '+8801711000001', body: 'DPZ 5000 TK received successfully.', timestamp: '2026-04-07 11:30' },
      { id: '3', sender: '+8801911000003', body: 'Hello bhai, kemon asen?', timestamp: '2026-04-06 10:00' },
      { id: '4', sender: '+8801738449485', body: 'dlv Allardan:Arif:01730487085:BRAN-Fine Sunshine-55KG[144278];300', timestamp: '2026-04-06 09:15' },
    ];

    const processedList: SMSMessage[] = rawDeviceSms.map(sms => ({
      ...sms,
      type: determineSmsType(sms.body)
    }));

    setAllSms(processedList);
  };

  // ─── Filter & Group Logic ───
  const groupedData = useMemo(() => {
    // 1. Filter the data based on search inputs
    const filtered = allSms.filter(sms => {
      const matchNumber = sms.sender.includes(searchNumber);
      // Extract just the YYYY-MM-DD part from the timestamp for basic date matching
      const matchDate = searchDate === '' || sms.timestamp.startsWith(searchDate); 
      return matchNumber && matchDate;
    });

    // 2. Group the filtered data by Date
    const groups = filtered.reduce((acc: Record<string, SMSMessage[]>, currentSms) => {
      const dateOnly = currentSms.timestamp.split(' ')[0]; // Gets "2026-04-07"
      if (!acc[dateOnly]) {
        acc[dateOnly] = [];
      }
      acc[dateOnly].push(currentSms);
      return acc;
    }, {});

    // 3. Convert object to SectionList array format
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a)) // Sort dates descending (newest first)
      .map(date => ({
        title: date,
        data: groups[date],
      }));
  }, [allSms, searchNumber, searchDate]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Text style={styles.iconText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SMS Report View</Text>
        {/* Invisible spacer to perfectly center the title since there's no right button */}
        <View style={styles.iconButton} /> 
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ─── Search Filter Card ─── */}
        <View style={styles.filterCard}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD (e.g. 2026-04-07)"
              placeholderTextColor="#9ca3af"
              value={searchDate}
              onChangeText={setSearchDate}
            />
            <Text style={styles.calendarIcon}>📅</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Sender Number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              value={searchNumber}
              onChangeText={setSearchNumber}
            />
          </View>
        </View>

        {/* ─── Grouped SMS List ─── */}
        <SectionList
          sections={groupedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SMSCard item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No SMS found for this search.</Text>
            </View>
          }
          stickySectionHeadersEnabled={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  keyboardView: { flex: 1 },
  header: {
    backgroundColor: '#E8531F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  iconButton: { padding: 8, width: 40 },
  iconText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  
  filterCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 10,
  },
  calendarIcon: {
    fontSize: 20,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    width: '100%',
  },
  
  listContent: { paddingBottom: 20 },
  sectionHeader: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 50, marginBottom: 16 },
  emptyText: { color: '#6b7280', fontSize: 16, fontWeight: '500' },
});

export default SMSReportScreen;