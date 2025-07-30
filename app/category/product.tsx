import { router } from "expo-router";
import React, { useState, useRef, useCallback } from 'react';
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

const skincareProducts = [
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
    id: 2,
    name: "Gentle Cleanser",
    price: 120000,
    description: "Pembersih lembut untuk menghilangkan kotoran dan makeup.",
    image: require('@/assets/images/face.jpg'),
    rating: 4.7,
    category: "CLEANSER",
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
  },
  {
    id: 5,
    name: "Night Cream",
    price: 220000,
    description: "Perawatan malam untuk regenerasi kulit.",
    image: require('@/assets/images/face.jpg'),
    rating: 4.7,
    category: "MOISTURIZER",
  },
  {
    id: 6,
    name: "Acne Spot Treatment",
    price: 95000,
    description: "Mengurangi jerawat dengan cepat.",
    image: require('@/assets/images/face.jpg'),
    rating: 4.5,
    category: "TREATMENT",
  },
];

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'MOISTURIZER', name: 'Moisturizer' },
  { id: 'CLEANSER', name: 'Cleanser' },
  { id: 'SERUM', name: 'Serum' },
  { id: 'SUNSCREEN', name: 'Sunscreen' },
  { id: 'TREATMENT', name: 'Treatment' },
];

const ProductCard = ({ product, onPress, isFavorite, toggleFavorite }) => (
  <View style={styles.cardContainer}>
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={12} color="#FFD700" />
        <Text style={styles.ratingText}>{product.rating}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(e) => {
          e.stopPropagation && e.stopPropagation();
          toggleFavorite(product.id);
        }}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "#FF6B6B" : "#FFF"}
        />
      </TouchableOpacity>
      <Image source={product.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const Main = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const favoriteSheetRef = useRef(null);
  const openFavoriteSheet = useCallback(() => favoriteSheetRef.current?.present(), []);
  const closeFavoriteSheet = useCallback(() => favoriteSheetRef.current?.close(), []);

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = skincareProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductPress = (product) => {
    router.push({ pathname: "/category/detailproduct", params: { id: product.id } });
  };

  const favoriteProducts = skincareProducts.filter(product => favorites.includes(product.id));

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Welcome to</Text>
              <Text style={styles.title}>Eudora Product</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={openFavoriteSheet}
            >
              <Ionicons name="heart" size={24} color="#B0174C" />
              {favorites.length > 0 && (
                <View style={styles.favoriteBadge}>
                  <Text style={styles.favoriteBadgeText}>{favorites.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari produk skincare..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Ionicons name="filter" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.selectedCategoryChip
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Products List */}
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => handleProductPress(item)}
                  isFavorite={favorites.includes(item.id)}
                  toggleFavorite={toggleFavorite}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={50} color="#888" />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          )}
          {/* Filter Modal */}
          <Modal
            visible={showFilterModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowFilterModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filter Products</Text>
                  <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.filterSectionTitle}>Categories</Text>
                <View style={styles.filterOptions}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.filterOption,
                        selectedCategory === category.id && styles.selectedFilterOption
                      ]}
                      onPress={() => {
                        setSelectedCategory(category.id);
                        setShowFilterModal(false);
                      }}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedCategory === category.id && styles.selectedFilterOptionText
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>
          {/* Favorite BottomSheet Modal */}
          <BottomSheetModal
            ref={favoriteSheetRef}
            snapPoints={['65%']}
            backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            onDismiss={closeFavoriteSheet}
          >
            <BottomSheetView style={styles.modalContentSheet}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.modalTitleSheet}>Favorite Products</Text>
                <TouchableOpacity onPress={closeFavoriteSheet}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              {favoriteProducts.length > 0 ? (
                <FlatList
                  data={favoriteProducts}
                  renderItem={({ item }) => (
                    <ProductCard
                      product={item}
                      onPress={() => {
                        closeFavoriteSheet();
                        handleProductPress(item);
                      }}
                      isFavorite={favorites.includes(item.id)}
                      toggleFavorite={toggleFavorite}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="heart-dislike-outline" size={50} color="#888" />
                  <Text style={styles.emptyText}>No favorite products</Text>
                </View>
              )}
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </SafeAreaView>
    </BottomSheetModalProvider>
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
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#888',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  favoriteIcon: {
    position: 'relative',
  },
  favoriteBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#B0174C',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#B0174C',
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryContainer: {
    paddingBottom: 16,
  },
  categoryChip: {
    backgroundColor: '#EEE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#B0174C',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 24,
  },
  cardContainer: {
    width: '48%',
    marginRight: '4%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    height: 260,
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 2,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
    padding: 4,
    zIndex: 1,
  },
  productImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B0174C",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#EEE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFilterOption: {
    backgroundColor: '#B0174C',
  },
  filterOptionText: {
    color: '#666',
  },
  selectedFilterOptionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContentSheet: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitleSheet: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  modalButtonSheet: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: "#B0174C"
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#333"
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 6
  },
  modalMessage: {
    textAlign: 'center',
    color: '#444',
    marginVertical: 18,
    fontSize: 15,
  }
});

export default Main;