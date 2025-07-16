import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HeaderWithBack from '../component/headerWithBack';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const treatmentPackages = [
  {
    id: 1,
    name: "Paket Anti Aging Premium",
    price: 1500000,
    duration: "90 menit",
    benefits: ["Reduksi kerutan", "Stimulasi kolagen", "Mengencangkan kulit", "Brightening"],
    image: require('@/assets/images/face.jpg'),
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Perawatan Kolagen",
    price: 950000,
    duration: "60 menit",
    benefits: ["Booster kolagen", "Hidrasi intensif", "Meratakan warna kulit", "Anti iritasi"],
    image: require('@/assets/images/face.jpg'),
    rating: 4.5,
    reviews: 89,
  },
  {
    id: 3,
    name: "Gold Facial Treatment",
    price: 1200000,
    duration: "75 menit",
    benefits: ["Mengandung emas 24k", "Regenerasi sel", "Antioksidan", "SPF protection"],
    image: require('@/assets/images/face.jpg'),
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    name: "Stem Cell Therapy",
    price: 2500000,
    duration: "120 menit",
    benefits: ["Teknologi stem cell", "Peremajaan kulit", "Mengurangi pigmentasi", "Hasil tahan lama"],
    image: require('@/assets/images/face.jpg'),
    rating: 4.7,
    reviews: 72,
  },
];

export default function AntiAging() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const filteredPackages = treatmentPackages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         formatPrice(pkg.price).toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter === 'under1') {
      matchesPrice = pkg.price < 1000000;
    } else if (priceFilter === '1to2') {
      matchesPrice = pkg.price >= 1000000 && pkg.price <= 2000000;
    } else if (priceFilter === 'over2') {
      matchesPrice = pkg.price > 2000000;
    }
    
    return matchesSearch && matchesPrice;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithBack title="Anti Aging Center" useGoBack />
        
        {/* Search and Filter Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari paket anti aging..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Filter Harga:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity 
                style={[styles.filterOption, priceFilter === 'all' && styles.activeFilter]}
                onPress={() => setPriceFilter('all')}
              >
                <Text style={[styles.filterText, priceFilter === 'all' && styles.activeFilterText]}>Semua</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterOption, priceFilter === 'under1' && styles.activeFilter]}
                onPress={() => setPriceFilter('under1')}
              >
                <Text style={[styles.filterText, priceFilter === 'under1' && styles.activeFilterText]}>Under 1JT</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterOption, priceFilter === '1to2' && styles.activeFilter]}
                onPress={() => setPriceFilter('1to2')}
              >
                <Text style={[styles.filterText, priceFilter === '1to2' && styles.activeFilterText]}>1JT-2JT</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterOption, priceFilter === 'over2' && styles.activeFilter]}
                onPress={() => setPriceFilter('over2')}
              >
                <Text style={[styles.filterText, priceFilter === 'over2' && styles.activeFilterText]}>Over 2JT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView 
          contentContainerStyle={styles.packagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => (
              <TouchableOpacity 
                key={pkg.id}
                style={styles.packageCard}
                onPress={() => router.push({
                  pathname: '/package-detail',
                  params: { 
                    id: pkg.id,
                    category: 'anti-aging',
                    name: pkg.name,
                    price: pkg.price,
                    duration: pkg.duration,
                    benefits: pkg.benefits.join('|'),
                    rating: pkg.rating,
                    reviews: pkg.reviews
                  }
                })}
              >
                <Image source={pkg.image} style={styles.packageImage} />
                <View style={styles.packageInfo}>
                  <View style={styles.packageHeader}>
                    <Text style={styles.packageName} numberOfLines={2}>{pkg.name}</Text>
                    <Text style={styles.packagePrice}>{formatPrice(pkg.price)}</Text>
                  </View>
                  
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{pkg.rating}</Text>
                    <Text style={styles.reviewsText}>({pkg.reviews} reviews)</Text>
                  </View>
                  
                  <Text style={styles.packageDuration}>⏱ {pkg.duration}</Text>
                  
                  <View style={styles.benefitsContainer}>
                    {pkg.benefits.slice(0, 3).map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="sad-outline" size={50} color="#888" />
              <Text style={styles.emptyText}>Tidak ada paket yang ditemukan</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    paddingTop: 15,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#B0174C',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 2,
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#B0174C',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
  },
  packagesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 5,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  packageImage: {
    width: '100%',
    height: width * 0.5,
  },
  packageInfo: {
    padding: 20,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    color: '#333',
  },
  packagePrice: {
    fontSize: 16,
    color: '#B0174C',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    marginRight: 8,
    fontWeight: 'bold',
  },
  reviewsText: {
    fontSize: 12,
    color: '#888',
  },
  packageDuration: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  benefitsContainer: {
    marginTop: 5,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 15,
  },
});