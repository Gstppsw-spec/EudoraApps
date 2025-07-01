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
import { useNavigation } from '@react-navigation/native'; // Importing the navigation hook from react-navigation
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

// Import images
const faceImage = require('@/assets/images/face.jpg'); // Use the same face image for all treatments

// Data produk klinik kecantikan
const beautyProducts = [
  {
    id: 1,
    name: "Facial Whitening",
    price: 300000,
    description: "Perawatan wajah untuk mencerahkan kulit dan mengurangi flek hitam",
    image: faceImage,
    rating: 4.8,
    duration: "60 menit",
  },
  {
    id: 2,
    name: "Acne Treatment",
    price: 350000,
    description: "Perawatan khusus untuk kulit berjerawat dengan ekstrak tea tree oil",
    image: faceImage,
    rating: 4.7,
    duration: "75 menit",
  },
  {
    id: 3,
    name: "Gold Facial",
    price: 500000,
    description: "Perawatan premium dengan kandungan emas untuk kulit lebih glowing",
    image: faceImage,
    rating: 4.9,
    duration: "90 menit",
  },
  {
    id: 4,
    name: "Microdermabrasion",
    price: 450000,
    description: "Eksfoliasi kulit dengan teknologi diamond untuk kulit lebih halus",
    image: faceImage,
    rating: 4.6,
    duration: "60 menit",
  },
  {
    id: 5,
    name: "Chemical Peel",
    price: 400000,
    description: "Pengelupasan kulit menggunakan bahan kimia khusus",
    image: faceImage,
    rating: 4.5,
    duration: "45 menit",
  },
  {
    id: 6,
    name: "Oxygen Facial",
    price: 550000,
    description: "Perawatan dengan oksigen murni untuk kulit lebih segar",
    image: faceImage,
    rating: 4.8,
    duration: "80 menit",
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
            <Text style={styles.durationText}>{product.duration}</Text>
          </View>

          <Text style={styles.productDesc} numberOfLines={2}>
            {product.description}
          </Text>

          {/* Book Button */}
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BeautyProductsScreen = () => {
  const navigation = useNavigation(); // Get navigation instance

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFA500" /> {/* Back icon */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perawatan Kecantikan</Text>
      </View>

      <Text style={styles.subTitle}>Pilih perawatan terbaik untuk kulit Anda</Text>

      <FlatList
        data={beautyProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Display 2 cards in a row
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
    paddingTop: 48, // Increased top padding
  },
  headerContainer: {
    flexDirection: "row", // Make header a flex container
    alignItems: "center", // Center items vertically
    marginBottom: 16, // Space below header
  },
  backButton: {
    marginRight: 10, // Space between back button and title
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
    textAlign: "center", // Center aligned
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
  durationText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#888",
  },
  productDesc: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666",
    lineHeight: 16,
    marginBottom: 12,
  },
  row: {
    justifyContent: "space-between",
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

export default BeautyProductsScreen;