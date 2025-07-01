import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

// Use a single image for all products
const skincareImage = require('@/assets/images/face.jpg'); // Make sure this is the actual image used

// Data produk skincare
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
    <TouchableOpacity style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Badge Rating */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.ratingIcon}>★</Text>
        </View>

        <Image source={product.image} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              Rp {product.price.toLocaleString()}
            </Text>
          </View>

          <Text style={styles.productDesc} numberOfLines={2}>
            {product.description}
          </Text>

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SkincareProductsScreen = () => {
  const navigation = useNavigation(); // Get navigation instance

  return (
    <View style={styles.container}>
      {/* Fixed Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFA500" /> {/* Back icon */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produk Skincare</Text>
      </View>

      <Text style={styles.subTitle}>Temukan produk terbaik untuk perawatan kulit Anda</Text>

      {/* Scrollable Card Section */}
      <FlatList
        data={skincareProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Display 2 cards in a row
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row", // Make header a flex container
    alignItems: "center", // Center items vertically
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#333",
    flex: 1, // Allow title to take remaining space
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    flex: 1,
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
    position: "relative",
    height: 280, // Fixed height
  },
  productImage: {
    width: "100%",
    height: 120,
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
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#FF6B6B",
  },
  productDesc: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666",
    lineHeight: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
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