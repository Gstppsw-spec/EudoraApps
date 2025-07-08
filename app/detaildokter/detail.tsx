import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DoctorDetailScreen = () => {
  const { id } = useLocalSearchParams();

  const doctorData = {
    1: {
      name: "Dr. Valeria Saputra",
      role: "Dokter Estetika",
      image: require("@/assets/images/vanlencia.jpg"),
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
      details: [
        "Medical Aesthetic Doctor | Trusted in Botox, Filler, Threadlift, Acne, & Anti-Aging",
        "Facial Rejuvenation (Laser, Chemical peels, Microneedling, Skinbooster)",
        "Facial Contouring (Thread lifting, HIFU, V-shape facial sculpting)",
        "Acne & Acne Scar Management (Acne injections, Acne peels, PRP)",
        "Body Shaping & Fat Reduction (Mesolipolysis)",
        "Pigmentation & Skin Brightening (Melasma and dark spot treatment, Medical-grade skincare plans, Combination therapy)",
        "Results that are safe, natural, and evidence-based",
      ],
    },
    3: {
      name: "Dr. Chindyra Nabila",
      role: "Dokter Estetika",
      image: require("@/assets/images/nabila.jpg"),
      details: [
        "Certified in Advanced Aesthetic Procedures",
        "Aesthetic Practitioner: Botox, Filler, Skinbooster, Threadlift",
        "Laser & Energy-Based Device Treatments",
        "Skin & Hair Rejuvenation (PRP, Microneedling, Acne Therapy)",
        "Mesotherapy Face and Body",
        "Aesthetic and Wellness Consultant",
      ],
    },
  };

  const doctor = doctorData[id];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Link href="/tabs/clinic/details" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFA500" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>Detail Dokter</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image source={doctor.image} style={styles.doctorImage} />
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorRole}>{doctor.role}</Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Keahlian</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 24,
  },
  doctorImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFE74C', // Changed to yellow
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 4,
  },
  doctorRole: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
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
    backgroundColor: '#FFE74C', // Changed to yellow
    marginTop: 8,
    marginRight: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    flex: 1,
  },
});

export default DoctorDetailScreen;