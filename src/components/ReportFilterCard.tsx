import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ReportFilterCardProps {
  searchDate: string;
  dateObj: Date;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  onChangeDate: (event: any, selectedDate?: Date) => void;
  clearDateFilter: () => void;
  searchNumber: string;
  setSearchNumber: (num: string) => void;
}

const ReportFilterCard: React.FC<ReportFilterCardProps> = ({
  searchDate,
  dateObj,
  showDatePicker,
  setShowDatePicker,
  onChangeDate,
  clearDateFilter,
  searchNumber,
  setSearchNumber,
}) => {
  return (
    <View style={styles.filterCard}>
      {/* Date Picker Button */}
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
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
          onChange={onChangeDate}
        />
      )}
      
      <View style={styles.divider} />

      {/* Number Search Input */}
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
  );
};

const styles = StyleSheet.create({
  filterCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },
  datePickerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  dateText: { fontSize: 16, color: '#111827' },
  placeholderText: { color: '#9ca3af' },
  dateRightSide: { flexDirection: 'row', alignItems: 'center' },
  clearBtn: { backgroundColor: '#f3f4f6', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  clearBtnText: { fontSize: 12, color: '#4b5563', fontWeight: 'bold' },
  calendarIcon: { fontSize: 20, color: '#6b7280' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontSize: 16, color: '#111827', paddingVertical: 14 },
  divider: { height: 1, backgroundColor: '#e5e7eb', width: '100%' },
});

export default ReportFilterCard;