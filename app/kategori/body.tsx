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

const bodyCareImage = require('@/assets/images/body.jpg');

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
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{treatment.rating}</Text>
          <Text style={styles.ratingIcon}>★</Text>
        </View>

        <Image source={treatment.image} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{treatment.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              Rp {treatment.price.toLocaleString()}
            </Text>
          </View>

          <Text style={styles.productDesc} numberOfLines={2}>
            {treatment.description}
          </Text>

          <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
            <Text style={styles.bookButtonText}>Beli</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const BodyTreatmentsScreen = () => {
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
        <Text style={styles.headerTitle}>Perawatan Tubuh</Text>
        <View style={styles.backButton} /> {/* For balance */}
      </View>

      <Text style={styles.subTitle}>Pilih perawatan terbaik untuk tubuh Anda</Text>

      {/* Scrollable Treatment List */}
      <FlatList
        data={bodyTreatments}
        renderItem={({ item }) => <TreatmentCard treatment={item} />}
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
    fontSize: 16,
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
  priceContainer: {
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

export default BodyTreatmentsScreen;