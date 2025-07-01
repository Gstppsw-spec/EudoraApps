import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Pressable
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const BookingAppointmentScreen = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [customTreatment, setCustomTreatment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTreatmentDropdown, setShowTreatmentDropdown] = useState(false);
  
  const TREATMENT_OPTIONS = [
    { label: 'Pilih Treatment', value: '' },
    { label: 'Facial Treatment', value: 'facial' },
    { label: 'Chemical Peel', value: 'chemical' },
    { label: 'Microdermabrasion', value: 'micro' },
    { label: 'Laser Hair Removal', value: 'laser' },
    { label: 'Lainnya (Tulis sendiri)', value: 'other' },
  ];

  const availableTimes = [
    '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      alert('Harap pilih tanggal dan waktu terlebih dahulu');
      return;
    }

    if (!selectedTreatment) {
      alert('Harap pilih treatment');
      return;
    }

    if (selectedTreatment === 'other' && !customTreatment) {
      alert('Harap tulis treatment Anda');
      return;
    }

    setShowModal(true);
  };

  const getSelectedTreatmentLabel = () => {
    const selected = TREATMENT_OPTIONS.find(opt => opt.value === selectedTreatment);
    return selected ? selected.label : "Pilih Treatment";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/tabs/clinic/details" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>BOOK APPOINTMENT</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Date Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>PILIH TANGGAL</Text>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#FFA500' },
              }}
              minDate={today}
              style={styles.calendar}
              theme={{
                calendarBackground: '#FFF',
                textSectionTitleColor: '#333',
                selectedDayBackgroundColor: '#FFA500',
                selectedDayTextColor: '#FFF',
                todayTextColor: '#FFA500',
                dayTextColor: '#333',
                textDisabledColor: '#DDD',
                arrowColor: '#FFA500',
                textDayFontFamily: 'Inter-Regular',
                textMonthFontFamily: 'Inter-SemiBold',
                textDayHeaderFontFamily: 'Inter-Medium',
              }}
            />
          </View>

          {/* Time Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>PILIH WAKTU</Text>
            <View style={styles.timeGrid}>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Treatment Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>PILIH TREATMENT</Text>
            <View style={styles.inputGroup}>
              <Pressable 
                style={styles.input} 
                onPress={() => setShowTreatmentDropdown(!showTreatmentDropdown)}
              >
                <Text style={styles.inputText}>{getSelectedTreatmentLabel()}</Text>
                <Ionicons 
                  name={showTreatmentDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                  style={styles.dropdownIcon}
                />
              </Pressable>
              
              {showTreatmentDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScroll}>
                    {TREATMENT_OPTIONS.map((option, index) => (
                      <Pressable
                        key={index}
                        style={[
                          styles.dropdownItem,
                          selectedTreatment === option.value && styles.selectedDropdownItem
                        ]}
                        onPress={() => {
                          setSelectedTreatment(option.value);
                          setShowTreatmentDropdown(false);
                          if (option.value !== 'other') {
                            setCustomTreatment('');
                          }
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{option.label}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Custom Treatment Input */}
            {selectedTreatment === 'other' && (
              <TextInput
                style={[styles.input, styles.customInput]}
                placeholder="Tulis treatment Anda"
                placeholderTextColor="#999"
                value={customTreatment}
                onChangeText={setCustomTreatment}
              />
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>LANJUTKAN</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Booking Berhasil!</Text>
            <Text style={styles.modalText}>Anda telah berhasil melakukan booking appointment.</Text>
            <Link href="/mybooking/mybooking" asChild>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    flex: 1,
    marginLeft: -40,
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  timeSlot: {
    width: '30%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedTimeSlot: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  selectedTimeText: {
    color: '#FFF',
    fontFamily: 'Inter-SemiBold',
  },
  inputGroup: {
    position: 'relative',
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontFamily: 'Inter-Regular',
  },
  customInput: {
    marginTop: 12,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    width: '100%',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginTop: 4,
    elevation: 3,
    zIndex: 10,
  },
  dropdownScroll: {
    maxHeight: 196,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  selectedDropdownItem: {
    backgroundColor: '#FFF9E6',
  },
  dropdownItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#FFA500',
    padding: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
});

export default BookingAppointmentScreen;