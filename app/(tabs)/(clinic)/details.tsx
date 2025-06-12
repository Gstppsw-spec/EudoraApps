import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ClinicDetailScreen = () => {
    const clinicData = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Image source={clinicData.image} style={styles.clinicImage} />
            <View style={styles.detailsContainer}>
                <Text style={styles.clinicName}>{clinicData.name}</Text>
                <Text style={styles.clinicAddress}>{clinicData.address}</Text>
                <Text style={styles.status}>Open</Text>
                <Text style={styles.rating}>4.8 (3,279 reviews)</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="envelope" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="phone" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="map-marker" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="share-alt" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <Text style={styles.doctorHeader}>Our Doctors</Text>
            <View style={styles.doctorCard}>
                <Text style={styles.doctorName}>A. Walker</Text>
                <Text style={styles.doctorRole}>Doctor</Text>
            </View>
            <View style={styles.doctorCard}>
                <Text style={styles.doctorName}>N. Patel</Text>
                <Text style={styles.doctorRole}>Doctor</Text>
            </View>

            <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40, // Increased padding from 20 to 40 for more space from the top
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    clinicImage: {
        width: '100%',
        height: 160,
        borderRadius: 8,
        marginBottom: 12,
    },
    detailsContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    clinicName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    clinicAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
        textAlign: 'center',
    },
    status: {
        fontSize: 14,
        color: 'green',
        marginBottom: 4,
    },
    rating: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
        width: '100%',
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFA500',
        borderRadius: 8,
        padding: 8,
    },
    doctorHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    doctorCard: {
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 6,
        width: '100%',
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    doctorRole: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    bookButton: {
        backgroundColor: '#FFA500',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        width: '100%',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ClinicDetailScreen;