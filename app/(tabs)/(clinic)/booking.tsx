import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons'; // For the back arrow
import { Link } from 'expo-router'; // Import Link for navigation

const BookingAppointmentScreen = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    // Time slots from 09:00 AM to 07:00 PM (19:00)
    const timeSlots = [
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '01:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
        '06:00 PM',
        '07:00 PM',
    ];

    // Function to handle booking
    const handleBooking = () => {
        if (selectedDate && selectedTime) {
            setModalVisible(true); // Show the modal on continue
        } else {
            alert('Please select both a date and a time.'); // Validation
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Book Appointment</Text>
            </View>

            <Text style={styles.subHeader}>Select Date</Text>
            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                }}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: '#FFA500' },
                }}
                style={styles.calendar}
            />

            <Text style={styles.subHeader}>Select Time</Text>
            <View style={styles.timeContainer}>
                {timeSlots.map((time) => (
                    <TouchableOpacity
                        key={time}
                        style={[
                            styles.timeButton,
                            selectedTime === time && styles.selectedTime,
                        ]}
                        onPress={() => setSelectedTime(time)}
                    >
                        <Text
                            style={[
                                styles.timeText,
                                selectedTime === time && styles.selectedTimeText,
                            ]}
                        >
                            {time}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleBooking}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            {/* Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // Handle Android back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Booking Successful!</Text>
                        <Link href="/mybooking" style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>OK</Text>
                        </Link>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 20, // Adjusted font size
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 18,
        marginVertical: 10,
    },
    calendar: {
        marginBottom: 20,
    },
    timeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    timeButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        minWidth: 80,
    },
    selectedTime: {
        backgroundColor: '#FFA500',
    },
    timeText: {
        fontSize: 16,
        color: '#666',
    },
    selectedTimeText: {
        color: '#fff',
    },
    continueButton: {
        backgroundColor: '#FFA500',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#FFA500',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
});

export default BookingAppointmentScreen;