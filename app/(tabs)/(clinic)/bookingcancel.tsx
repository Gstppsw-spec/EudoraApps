import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router'; // Import the Link component from expo-router

const MyBookingCanceled = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Canceled Bookings</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

    
          {/* Booking Status Tabs */}
          <View style={styles.tabsContainer}>
              <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Completed</Text>
            </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={[styles.tabText, styles.activeTabText]}>Canceled</Text>
            </TouchableOpacity>
          </View>
          
      <ScrollView style={styles.content}>
        {/* Canceled Booking 1 */}
        <View style={styles.bookingContainer}>
          <View style={styles.row}>
            <Image
              source={require('@/assets/images/SMS.jpg')} // Ensure correct path
              style={styles.clinicImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.dateText}>June 22, 2025</Text>
              <Text style={styles.clinicName}>EUDORA Kemang</Text>
              <Text style={styles.clinicAddress}>
                Kemang Raya, Jl Kemang Raya No 99B Lt 2, Kec. Mampang Prptn, Jakarta Selatan
              </Text>
              <Text style={styles.serviceStatus}>Status: Canceled</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Canceled Booking 2 */}
        <View style={styles.bookingContainer}>
          <View style={styles.row}>
            <Image
              source={require('@/assets/images/BX.jpg')} // Ensure correct path
              style={styles.clinicImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.dateText}>June 11, 2025</Text>
              <Text style={styles.clinicName}>EUDORA Bintaro Exchange</Text>
              <Text style={styles.clinicAddress}>
                Bintaro Xchange Mall, JL Lkr. Jaya No.12 Lt UG Unit S-10, Pd. Jaya, Kec. Pd. Aren, Kota Tangerang Selatan.
              </Text>
              <Text style={styles.serviceStatus}>Status: Canceled</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles
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
  serviceStatus: {
    fontSize: 14,
    color: '#ff5252', // Canceled status in red
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
});

export default MyBookingCanceled;