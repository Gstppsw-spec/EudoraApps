import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import HeaderWithBack from '../component/headerWithBack';

const { width } = Dimensions.get('window');

// Data kategori perawatan
const beautyCategories = [
  {
    id: 1,
    title: "Anti Aging Center",
    image: require('@/assets/images/face.jpg'),
  },
  {
    id: 2,
    title: "Facial Treatments",
    image: require('@/assets/images/face.jpg'),
  },
  {
    id: 3,
    title: "Skin Care Solutions",
    image: require('@/assets/images/face.jpg'),
  },
  {
    id: 4,
    title: "Body Treatments",
    image: require('@/assets/images/face.jpg'),
  },
  {
    id: 5,
    title: "Hair Treatments",
    image: require('@/assets/images/face.jpg'),
  },
  {
    id: 6,
    title: "Wellness Therapies",
    image: require('@/assets/images/face.jpg'),
  },
];

const BeautyProductsScreen = () => {
  const router = useRouter();

  const navigateToDetail = (id) => {
    router.push(`/category/detailface?id=${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Beauty Categories" useGoBack />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {beautyCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.cardContainer}
            onPress={() => navigateToDetail(category.id)}
          >
            <Image 
              source={category.image} 
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
              <Text style={styles.cardTitle}>{category.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  cardContainer: {
    width: width - 30,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
});

export default BeautyProductsScreen;