import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import gambar
const images = {
  SMS: require('@/assets/images/SMS.jpg'),
  CentralPark: require('@/assets/images/CentralPark.jpg'),
  BX: require('@/assets/images/BX.jpg'),
  aeon: require('@/assets/images/aeon.jpg'),
  LWG: require('@/assets/images/LWG.jpg'),
  LWK: require('@/assets/images/LWK.jpg'),
};

// Sample clinic data
const clinics = [
  {
    name: 'Eudora Kemang',
    address: 'Kemang Raya. Jl Kemang Raya No 9',
    image: images.SMS,
    distance: '1.2 km',
    rating: '4.8'
  },
  {
    name: 'Eudora Aesthetic Clinic - Central Park Mall',
    address: 'Central Park Mall, Lt. 3 Unit no L3-107A',
    image: images.CentralPark,
    distance: '2.5 km',
    rating: '4.7'
  },
  {
    name: 'Eudora Aesthetic Clinic - Bintaro',
    address: 'Bintaro Xchange Mall, Jl. Lkr. Jaya',
    image: images.BX,
    distance: '3.1 km',
    rating: '4.9'
  },
  {
    name: 'Eudora Aesthetic Clinic - AEON JGC',
    address: 'Aeon Mall Jgc, Jl. Jkt Garden City Boulevard No.1 2F-47',
    image: images.aeon,
    distance: '5.3 km',
    rating: '4.6'
  },
  {
    name: 'Eudora Aesthetic Clinic - Summarecon Mall Serpong',
    address: 'Summarecon Mall Serpong, Lt 1F-17D',
    image: images.SMS,
    distance: '7.8 km',
    rating: '4.5'
  },
  {
    name: 'Eudora Aesthetic Clinic - Living World Grand Wisata',
    address: 'Living World Grand Wisata, Jl. Esplanade Avenue, Lambangjaya',
    image: images.LWG,
    distance: '10.2 km',
    rating: '4.8'
  },
  {
    name: 'Eudora Aesthetic Clinic - Living World Kota Wisata',
    address: 'Living World Kota Wisata Cibubur Unit 2, Jl. Boulevard Kota Wisata No.37 Lt 2',
    image: images.LWK,
    distance: '12.5 km',
    rating: '4.7'
  },
];

const IndexScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen');
  };

  return (
    
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.mainHeader}>Our Clinic</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSearchPress}>
          <FontAwesome name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Clinic List */}
      <ScrollView style={styles.scrollContainer}>
        {clinics.map((clinic, index) => (
          <View key={index} style={styles.clinicCardContainer}>
            <Link href={{ pathname: '/details', params: clinic }} asChild>
              <TouchableOpacity style={styles.clinicCard}>
                <Image source={clinic.image} style={styles.clinicImage} />
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName}>{clinic.name}</Text>
                  <Text style={styles.clinicAddress}>{clinic.address}</Text>
                  <View style={styles.distanceRatingContainer}>
                    <Text style={styles.distanceText}>{clinic.distance}</Text>
                    <FontAwesome name="arrow-up" size={12} color="#4CAF50" style={styles.arrowIcon} />
                    <Text style={styles.ratingText}>{clinic.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
            {index < clinics.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    padding: 8,
  },
  mainHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  clinicCardContainer: {
    marginBottom: 8,
  },
  clinicCard: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  clinicImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  clinicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  distanceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  arrowIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 96, // Match image width + margin
  },
});

export default IndexScreen;