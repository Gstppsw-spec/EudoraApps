import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

const ClinicDetailScreen = () => {
    const clinicData = useLocalSearchParams();
    const router = useRouter();

    // Sample doctor data
    const doctors = [
        { id: 1, name: 'A. Walker', role: 'Doctor', image: require('@/assets/images/doc.png') },
        { id: 2, name: 'N. Patel', role: 'Doctor', image: require('@/assets/images/doc.png') },
        { id: 3, name: 'B. Cruz', role: 'Doctor', image: require('@/assets/images/doc.png') },
    ];

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Clinic Image */}
                {clinicData.image ? (
                    <Image
                        source={clinicData.image}
                        style={styles.clinicImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Clinic Image Unavailable</Text>
                    </View>
                )}
                
                {/* Clinic Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.clinicName}>{clinicData.name || 'EUDORA Bintaro Exchange'}</Text>
                    <Text style={styles.clinicAddress}>{clinicData.address || 'Bintaro Jaya Exchange'}</Text>
                    <View style={styles.distanceRatingContainer}>
                        <Text style={styles.rating}>{clinicData.rating || '4.8'} ({clinicData.reviews || '3,279'} reviews)</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIconCircle}>
                            <FontAwesome name="envelope" size={20} color="#FFA500" />
                        </View>
                        <Text style={styles.actionButtonText}>Message</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIconCircle}>
                            <FontAwesome name="phone" size={20} color="#FFA500" />
                        </View>
                        <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIconCircle}>
                            <FontAwesome name="map-marker" size={20} color="#FFA500" />
                        </View>
                        <Text style={styles.actionButtonText}>Direction</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIconCircle}>
                            <FontAwesome name="share-alt" size={20} color="#FFA500" />
                        </View>
                        <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                {/* Our Doctors Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Our doctor</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {/* Doctors List */}
                <View style={styles.doctorsContainer}>
                    {doctors.map((doctor) => (
                        <View key={doctor.id} style={styles.doctorCard}>
                            <Image source={doctor.image} style={styles.doctorImage} />
                            <Text style={styles.doctorName}>{doctor.name}</Text>
                            <Text style={styles.doctorRole}>{doctor.role}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                {/* Book Now Button - Navigate to booking page */}
                <Link href="/booking" style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </Link>

                {/* Bottom spacing to ensure button isn't hidden */}
                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 80,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 16,
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 20,
        padding: 8,
    },
    clinicImage: {
        width: '100%',
        height: 250,
    },
    placeholder: {
        width: '100%',
        height: 250,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#ccc',
        fontSize: 16,
    },
    headerContainer: {
        padding: 16,
    },
    clinicName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    clinicAddress: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    rating: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    actionButton: {
        alignItems: 'center',
        width: 80,
    },
    actionIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF8E1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionButtonText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAll: {
        fontSize: 16,
        color: '#666',
    },
    doctorsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    doctorCard: {
        width: '30%',
        marginBottom: 16,
        alignItems: 'center',
    },
    doctorImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    doctorRole: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    bookButton: {
        backgroundColor: '#FFA500',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 20,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ClinicDetailScreen;