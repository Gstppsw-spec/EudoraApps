import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; // Calculate card width based on screen width

const skincareImage = require('@/assets/images/face.jpg');

const skincareProducts = [
  {
    id: 1,
    name: "Hydrating Moisturizer",
    price: 150000,
    description: "Melembapkan kulit dan memberikan rasa segar sepanjang hari.",
    image: skincareImage,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Gentle Cleanser",
    price: 120000,
    description: "Pembersih lembut untuk menghilangkan kotoran dan makeup.",
    image: skincareImage,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Broad Spectrum Sunscreen",
    price: 200000,
    description: "Perlindungan UV maksimum dengan formula ringan.",
    image: skincareImage,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Balancing Toner",
    price: 130000,
    description: "Toner seimbang untuk menyiapkan kulit sebelum perawatan.",
    image: skincareImage,
    rating: 4.5,
  },
  {
    id: 5,
    name: "Brightening Serum",
    price: 250000,
    description: "Serum untuk mencerahkan kulit dan mengurangi bintik hitam.",
    image: skincareImage,
    rating: 4.8,
  },
  {
    id: 6,
    name: "Revitalizing Eye Cream",
    price: 180000,
    description: "Krim mata revitalisasi untuk mengurangi garis halus.",
    image: skincareImage,
    rating: 4.6,
  },
];

const ProductCard = ({ product }) => {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.ratingIcon}>★</Text>
        </View>

        <Image source={product.image} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>

          <Text style={styles.productPrice}>
            Rp {product.price.toLocaleString()}
          </Text>

          <Text style={styles.productDesc} numberOfLines={2}>
            {product.description}
          </Text>

          <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
            <Text style={styles.bookButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const SkincareProductsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header with Border Bottom */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produk Skincare</Text>
        <View style={styles.backButton} /> {/* For balance */}
      </View>

      <Text style={styles.subTitle}>Temukan produk terbaik untuk perawatan kulit Anda</Text>

      {/* Scrollable Product List */}
      <FlatList
        data={skincareProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginBottom: 12,
  },
  backButton: {
    width: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    padding: 8,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 300,
  },
  productImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#333",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#FF6B6B",
    marginBottom: 8,
  },
  productDesc: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666",
    lineHeight: 16,
    marginBottom: 16,
    height: 32,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 1,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
    color: "#333",
    marginRight: 2,
  },
  ratingIcon: {
    fontSize: 12,
    color: "#FFD700",
  },
  bookButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
  },
});

export default SkincareProductsScreen;