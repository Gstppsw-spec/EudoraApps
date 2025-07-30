import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

// Data produk HARUS sama persis dengan index.js 
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

export default function DetailProduct() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Cari produk berdasarkan id di parameter URL
  const product = skincareProducts.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={{ fontSize: 18, color: "red" }}>Produk tidak ditemukan</Text>
        <TouchableOpacity
          style={[styles.backBtn, { marginTop: 32 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#ff5252" />
          <Text style={{ color: "#B0174C", marginLeft: 8 }}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        {/* Tombol kembali */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Image source={product.image} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.category}>{product.category}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          </View>
          <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
          <Text style={styles.desc}>{product.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 18,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 }
  },
  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
    backgroundColor: "#EEE",
    marginBottom: 10
  },
  info: {
    padding: 22,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -1 }
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 7
  },
  category: {
    fontSize: 15,
    color: "#B0174C",
    backgroundColor: "#FFE6E6",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 2
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#FFFBEA",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 15
  },
  ratingText: {
    marginLeft: 6,
    fontWeight: "bold",
    color: "#333",
    fontSize: 15
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B0174C   ",
    marginBottom: 10
  },
  desc: {
    fontSize: 17,
    color: "#444",
    marginTop: 8
  }
});;