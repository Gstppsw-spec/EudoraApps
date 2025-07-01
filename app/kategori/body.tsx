import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importing the navigation hook from react-navigation
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

// Use the same image for all treatments
const bodyCareImage = require('@/assets/images/body.jpg'); // Use the same image for all treatments

// Data produk perawatan tubuh
const bodyTreatments = [
  {
    id: 1,
    name: "Body Scrub",
    price: 250000,
    description: "Perawatan tubuh untuk mengangkat sel kulit mati dan melembutkan kulit.",
    image: bodyCareImage,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Massage Therapy",
    price: 300000,
    description: "Terapi pijat relaksasi untuk mengurangi stres dan ketegangan.",
    image: bodyCareImage,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Body Wrap",
    price: 400000,
    description: "Perawatan tubuh dengan rumput laut untuk detoksifikasi dan hidrasi.",
    image: bodyCareImage,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Hot Stone Massage",
    price: 350000,
    description: "Pijat menggunakan batu panas untuk meredakan ketegangan otot.",
    image: bodyCareImage,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Aromatherapy Massage",
    price: 320000,
    description: "Pijat aromaterapi dengan minyak esensial untuk relaksasi maksimal.",
    image: bodyCareImage,
    rating: 4.6,
  },
  {
    id: 6,
    name: "Reflexology",
    price: 280000,
    description: "Teknik pijat refleksi untuk meredakan nyeri dan meningkatkan kesehatan.",
    image: bodyCareImage,
    rating: 4.8,
  },
];

const TreatmentCard = ({ treatment }) => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Badge Rating */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{treatment.rating}</Text>
          <Text style={styles.ratingIcon}>★</Text>
        </View>

        <Image source={treatment.image} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{treatment.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              Rp {treatment.price.toLocaleString()}
            </Text>
            <Text style={styles.durationText}>{treatment.duration}</Text>
          </View>

          <Text style={styles.productDesc} numberOfLines={2}>
            {treatment.description}
          </Text>

          {/* Book Button */}
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BodyTreatmentsScreen = () => {
  const navigation = useNavigation(); // Get navigation instance

  return (
    <View style={styles.container}>
      {/* Fixed Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFA500" /> {/* Back icon */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perawatan Tubuh</Text>
      </View>

      <Text style={styles.subTitle}>Pilih perawatan terbaik untuk tubuh Anda</Text>

      {/* Scrollable Card Section */}
      <FlatList
        data={bodyTreatments}
        renderItem={({ item }) => <TreatmentCard treatment={item} />}
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

export default BodyTreatmentsScreen;