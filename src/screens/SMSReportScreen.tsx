import React, { useState, useEffect, useMemo } from 'react';
import { View,Text,TextInput,SectionList,TouchableOpacity,StyleSheet,KeyboardAvoidingView,Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList, SMSMessage } from '../types/index';
import { determineSmsType } from '@utils/smsLogic';
import SMSCard from '@components/SMSCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SMSReport'>;

interface Props {
  navigation: NavigationProp;
}

interface SMSSection {
  title: string;
  data: SMSMessage[];
}

const SMSReportScreen: React.FC<Props> = ({ navigation }) => {
  const [allSms, setAllSms] = useState<SMSMessage[]>([]);
  const [searchNumber, setSearchNumber] = useState('');
  
  // Date Picker States
  const [searchDate, setSearchDate] = useState(''); // Stores 'YYYY-MM-DD'
  const [dateObj, setDateObj] = useState(new Date()); // Stores actual Date object
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadDeviceSms();
  }, []);

  const loadDeviceSms = () => {
    const rawDeviceSms = [
      { id: '1', sender: '+8801738449485', body: 'dlv DMT-16-9662:Salam:01719082842:BRAN-Coarse Sunshine-37KG[144276];360', timestamp: '2026-04-12 12:09' },
      { id: '2', sender: '+8801711000001', body: 'DPZ 5000 TK received successfully.', timestamp: '2026-04-12 11:30' },
      { id: '3', sender: '+8801911000003', body: 'Hello bhai, kemon asen?', timestamp: '2026-04-11 10:00' },
      { id: '4', sender: '+8801738449485', body: 'dlv Allardan:Arif:01730487085:BRAN-Fine Sunshine-55KG[144278];300', timestamp: '2026-04-11 09:15' },
    ];

    const processedList: SMSMessage[] = rawDeviceSms.map(sms => ({
      ...sms,
      type: determineSmsType(sms.body)
    }));

    setAllSms(processedList);
  };

  // ─── Handle Date Picker Change ───
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Hide popup on Android after selection
    if (selectedDate) {
      setDateObj(selectedDate);
      
      // Format to YYYY-MM-DD manually to avoid timezone shifting issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      
      setSearchDate(`${year}-${month}-${day}`);
    }
  };

  const clearDateFilter = () => {
    setSearchDate('');
    setDateObj(new Date());
  };

  // ─── Filter & Group Logic ───
  const groupedData = useMemo<SMSSection[]>(() => {
    const filtered = allSms.filter(sms => {
      const matchNumber = sms.sender.includes(searchNumber);
      const matchDate = searchDate === '' || sms.timestamp.startsWith(searchDate); 
      return matchNumber && matchDate;
    });

    const groups = filtered.reduce((acc: Record<string, SMSMessage[]>, currentSms) => {
      const dateOnly = currentSms.timestamp.split(' ')[0]; 
      if (!acc[dateOnly]) acc[dateOnly] = [];
      acc[dateOnly].push(currentSms);
      return acc;
    }, {});

    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a)) 
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
        <View style={styles.iconButton} /> 
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ─── Search Filter Card ─── */}
        <View style={styles.filterCard}>
          
          {/* Date Picker Button */}
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, !searchDate && styles.placeholderText]}>
              {searchDate ? searchDate : "Select Date (YYYY-MM-DD)"}
            </Text>
            
            <View style={styles.dateRightSide}>
              {searchDate ? (
                <TouchableOpacity onPress={clearDateFilter} style={styles.clearBtn}>
                  <Text style={styles.clearBtnText}>✕</Text>
                </TouchableOpacity>
              ) : null}
              <Text style={styles.calendarIcon}>📅</Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateObj}
              mode="date"
              display="default"
              onValueChange={onChangeDate}
            />
          )}
          
          <View style={styles.divider} />

          {/* Number Search */}
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },
  
  // Date Picker Styles
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  dateRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearBtnText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: 'bold',
  },
  calendarIcon: {
    fontSize: 20,
    color: '#6b7280',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 14,
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