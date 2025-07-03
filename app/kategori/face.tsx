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

const faceImage = require('@/assets/images/face.jpg');

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
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.ratingIcon}>★</Text>
        </View>

        <Image source={product.image} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              Rp {product.price.toLocaleString()}
            </Text>
            <Text style={styles.durationText}>{product.duration}</Text>
          </View>

          <Text style={styles.productDesc} numberOfLines={2}>
            {product.description}
          </Text>

          <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
            <Text style={styles.bookButtonText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const BeautyProductsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perawatan Kecantikan</Text>
        <View style={styles.backButton} /> {/* For balance */}
      </View>

      <Text style={styles.subTitle}>Pilih perawatan terbaik untuk kulit Anda</Text>

      {/* Scrollable Content Section */}
      <FlatList
        data={beautyProducts}
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
  },
  backButton: {
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#666",
    marginVertical: 12,
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
    marginBottom: 16,
    height: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 8,
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