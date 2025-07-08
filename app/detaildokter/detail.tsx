import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const DoctorDetailScreen = () => {
  const { id } = useLocalSearchParams();

  const doctorData = {
    1: {
      name: "Dr. Valeria Saputra",
      role: "Dokter Estetika",
      image: require("@/assets/images/vanlencia.jpg"),
      experience: "8 Tahun Pengalaman",
      rating: "4.9",
      reviews: "128",
      details: [
        "Aesthetic Practitioner: Botox, Filler, Skinbooster, Threadlift",
        "Laser & Energy-Based Device Treatments",
        "Skin & Hair Rejuvenation (PRP, Microneedling, Acne Therapy)",
      ],
    },
    2: {
      name: "Dr. Dodi Saputra",
      role: "Dokter Estetika",
      image: require("@/assets/images/dodi.jpg"),
      experience: "10 Tahun Pengalaman",
      rating: "4.8",
      reviews: "215",
      details: [
        "Medical Aesthetic Doctor | Trusted in Botox, Filler, Threadlift, Acne, & Anti-Aging",
        "Facial Rejuvenation (Laser, Chemical peels, Microneedling, Skinbooster)",
        "Facial Contouring (Thread lifting, HIFU, V-shape facial sculpting)",
      ],
    },
    3: {
      name: "Dr. Chindyra Nabila",
      role: "Dokter Estetika",
      image: require("@/assets/images/nabila.jpg"),
      experience: "6 Tahun Pengalaman",
      rating: "4.7",
      reviews: "95",
      details: [
        "Certified in Advanced Aesthetic Procedures",
        "Aesthetic Practitioner: Botox, Filler, Skinbooster, Threadlift",
        "Laser & Energy-Based Device Treatments",
      ],
    },
  };

  const doctor = doctorData[id];

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <Link href="/tabs/clinic/details" asChild>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Link>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Doctor Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={doctor.image} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={20} color="#4CAF50" />
            </View>
          </View>
          
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorRole}>{doctor.role}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
            </View>
            <View style={styles.statItem}>
            </View>
          </View>
        </View>

        {/* Expertise Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="medical-services" size={24} color="#FF9800" />
            <Text style={styles.sectionTitle}>Keahlian Spesialis</Text>
          </View>
          
          <View style={styles.detailsList}>
            {doctor.details.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.detailText}>{detail}</Text>
              </View>
            ))}
          </View>
        </View> 

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#E3F2FD',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  statText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  detailsList: {
    paddingLeft: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9800', // Changed to orange
    marginTop: 8,
    marginRight: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    flex: 1,
  },
  bookingInfo: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});

export default DoctorDetailScreen;