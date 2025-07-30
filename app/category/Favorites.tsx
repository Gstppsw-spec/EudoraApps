// app/category/favorites.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Data favorit statis
const favoriteProducts = [
  {
    id: 1,
    name: "Hydrating Moisturizer",
    price: 150000,
    description: "Melembapkan kulit dan memberikan rasa segar sepanjang hari.",
    image: require('@/assets/images/face.jpg'),
    rating: 4.8,
    category: "MOISTURIZER",
  },
  {
    id: 3,
    name: "Brightening Serum",
    price: 200000,
    description: "Serum mencerahkan kulit dengan vitamin C.",
    image: require('@/assets/images/face.jpg'),
    rating: 4.9,
    category: "SERUM",
  },
  {
    id: 4,
    name: "Sunscreen SPF 50",
    price: 180000,
    description: "Perlindungan maksimal dari sinar UV.",
    image: require('@/assets/images/face.jpg'),
    rating: 4.6,
    category: "SUNSCREEN",
  }
];

const FavoritesScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Favorites</Text>
        </View>

        {/* Daftar produk favorit */}
        <FlatList
          data={favoriteProducts}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Image 
                source={item.image} 
                style={styles.productImage} 
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff5252',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 2,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default FavoritesScreen;