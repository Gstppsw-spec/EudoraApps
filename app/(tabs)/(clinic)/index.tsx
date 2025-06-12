import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NearbyScreen: React.FC = () => {
  const navigation = useNavigation(); // Hook for navigation

  const handleSearchPress = () => {
    navigation.navigate('SearchScreen'); // Ensure you have a SearchScreen defined in your navigator
  };

  return (
    <View style={styles.container}>
      {/* Header with Back, Title, and Search */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.mainHeader}>Our Clinic</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleSearchPress}>
          <FontAwesome name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Clinic 1 */}
        <View style={styles.clinicCard}>
          <Image 
            source={require('@/assets/images/SMS.jpg')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Eudora Kemang</Text>
            <Text style={styles.clinicAddress}>Kemang Raya. Jl Kemang Raya No 9</Text>
            <View style={styles.distanceRatingContainer}>
              <Text style={styles.distanceText}>1.2 km</Text>
              <FontAwesome name="arrow-up" size={12} color="#4CAF50" style={styles.arrowIcon} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>
        
        {/* Divider */}
        <View style={styles.divider} />
        
        {/* Clinic 2 */}
        <View style={styles.clinicCard}>
          <Image 
            source={require('@/assets/images/CentralPark.jpg')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Eudora Aesthetic Clinic - Central Park Mall</Text>
            <Text style={styles.clinicAddress}>Central Park Mall, Lt. 3 Unit no L3-107A</Text>
            <View style={styles.distanceRatingContainer}>
              <Text style={styles.distanceText}>1.2 km</Text>
              <FontAwesome name="arrow-up" size={12} color="#4CAF50" style={styles.arrowIcon} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Clinic 3 */}
        <View style={styles.clinicCard}>
          <Image 
            source={require('@/assets/images/BX.jpg')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Eudora Aesthetic Clinic - Bintaro</Text>
            <Text style={styles.clinicAddress}>Bintaro Xchange Mall, Jl. Lkr. Jaya</Text>
            <View style={styles.distanceRatingContainer}>
              <Text style={styles.distanceText}>1.2 km</Text>
              <FontAwesome name="arrow-up" size={12} color="#4CAF50" style={styles.arrowIcon} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Clinic 4 */}
        <View style={styles.clinicCard}>
          <Image 
            source={require('@/assets/images/aeon.jpg')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Eudora Aesthetic Clinic - AEON JGC</Text>
            <Text style={styles.clinicAddress}>Aeon Mall Jgc, Jl. Jkt Garden City Boulevard No.1 2F-47</Text>
            <View style={styles.distanceRatingContainer}>
              <Text style={styles.distanceText}>1.2 km</Text>
              <FontAwesome name="arrow-up" size={12} color="#4CAF50" style={styles.arrowIcon} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Clinic 5 */}
        <View style={styles.clinicCard}>
          <Image 
            source={require('@/assets/images/SMS.jpg')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Eudora Aesthetic Clinic - Summarecon Mall Serpong</Text>
            <Text style={styles.clinicAddress}>Summarecon Mall Serpong, Lt 1F-17D</Text>
            <View style={styles.distanceRatingContainer}>
              <Text style={styles.distanceText}>1.2 km</Text>
              <FontAwesome name="arrow-up" size={12} color="#4CAF50" style={styles.arrowIcon} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Clinic 6 */}
        <View style={styles.clinicCard}>
          <Image 
            source={require('@/assets/images/LWG.jpg')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Eudora Aesthetic Clinic - Living World Grand Wisata</Text>
            <Text style={styles.clinicAddress}>Living World Grand Wisata, Jl. Esplanade Avenue, Lambangjaya</Text>
            <View style={styles.distanceRatingContainer}>
              <Text style={styles.distanceText}>1.2 km</Text>
              <FontAwesome name="arrow-up" size={12} color="#4CAF50" style={styles.arrowIcon} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Clinic 7 */}
        <View style={styles.clinicCard}>
          <Image 
            source={require('@/assets/images/LWK.jpg')} 
            style={styles.clinicImage}
          />
          <View style={styles.clinicInfo}>
            <Text style={styles.clinicName}>Eudora Aesthetic Clinic - Living World Kota Wisata</Text>
            <Text style={styles.clinicAddress}>Living World Kota Wisata Cibubur Unit 2, Jl. Boulevard Kota Wisata No.37 Lt 2</Text>
            <View style={styles.distanceRatingContainer}>
              <Text style={styles.distanceText}>1.2 km</Text>
              <FontAwesome name="arrow-up" size={12} color="#4CAF50" style={styles.arrowIcon} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>
        </View>
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
  },
  scrollContent: {
    padding: 16,
  },
  clinicCard: {
    flexDirection: 'row',
    marginBottom: 16,
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
    marginVertical: 16,
    marginLeft: 96,
  },
});

export default NearbyScreen;