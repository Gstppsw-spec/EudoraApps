import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { Link } from 'expo-router'; // Import the Link component from expo-router

const MyBookingUpcoming = () => {
  const [modalVisible, setModalVisible] = useState(false); // Manage the modal visibility
  const [currentBooking, setCurrentBooking] = useState(null); // Store current booking to cancel

  // Function to handle Cancel Booking button click
  const handleCancelBooking = (booking) => {
    setCurrentBooking(booking); // Set the current booking to cancel
    setModalVisible(true); // Show the confirmation modal
  };

  // Function to handle modal dismiss
  const cancelModal = () => {
    setModalVisible(false); // Hide modal without canceling
    setCurrentBooking(null); // Reset current booking
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Booking</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Booking Status Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Canceled</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Booking 1 */}
        <View style={styles.bookingContainer}>
          <View style={styles.row}>
            <Image
              source={require('@/assets/images/SMS.jpg')}
              style={styles.clinicImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.dateText}>June 22, 2025</Text>
              <TouchableOpacity style={styles.remindButton}>
                <Text style={styles.remindText}>Remind me</Text>
              </TouchableOpacity>
              <Text style={styles.clinicName}>EUDORA Kemang</Text>
              <Text style={styles.clinicAddress}>
                Kemang Raya, Jl Kemang Raya No 99B Lt 2, Kec. Mampang Prptn, Jakarta Selatan
              </Text>
              <Text style={styles.servicesTitle}>Services:</Text>
              <Text style={styles.servicesText}>Face Contouring, Body Contouring, Dll</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking('Booking 1')}>
                  <Text style={styles.cancelText}>Cancel Booking</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.receiptButton}>
                  <Text style={styles.receiptText}>E-Receipt</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Booking 2 */}
        <View style={styles.bookingContainer}>
          <View style={styles.row}>
            <Image
              source={require('@/assets/images/BX.jpg')}
              style={styles.clinicImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.dateText}>June 11, 2025</Text>
              <TouchableOpacity style={styles.remindButton}>
                <Text style={styles.remindText}>Remind me</Text>
              </TouchableOpacity>
              <Text style={styles.clinicName}>EUDORA Bintaro Exchange</Text>
              <Text style={styles.clinicAddress}>
                Bintaro Xchange Mall, JL Lkr. Jaya No.12 Lt UG Unit S-10, Pd. Jaya, Kec. Pd. Aren, Kota Tangerang Selatan.
              </Text>
              <Text style={styles.servicesTitle}>Services:</Text>
              <Text style={styles.servicesText}>Face Contouring, Body Contouring, Dll</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking('Booking 2')}>
                  <Text style={styles.cancelText}>Cancel Booking</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.receiptButton}>
                  <Text style={styles.receiptText}>E-Receipt</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelModal} // Close on back button
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <Text style={styles.modalMessage}>Are you sure you want to cancel this booking?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={cancelModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Link href="/bookingcancel" style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </Link>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFB900',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FFB900',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bookingContainer: {
    paddingVertical: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  bookingDetails: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  remindButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  remindText: {
    color: '#FFB900',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  servicesTitle: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  servicesText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ff5252',
    borderRadius: 5,
    marginRight: 10,
  },
  cancelText: {
    color: '#ff5252',
    fontWeight: 'bold',
  },
  receiptButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FFB900',
    borderRadius: 5,
  },
  receiptText: {
    color: '#FFB900',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Shadow effect on modal
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFB900',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFB900',
    fontWeight: 'bold',
  },
});

export default MyBookingUpcoming;