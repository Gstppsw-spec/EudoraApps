import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing Material icons

// Sample data for featured categories with icons
const featuredCategories = [
  {
    id: 1,
    name: 'Kecantikan',
    icon: 'face', // Material icon name
  },
  {
    id: 2,
    name: 'Mainan & Hobi',
    icon: 'toys', // Material icon name
  },
  {
    id: 3,
    name: 'Ibu & Bayi',
    icon: 'child-care', // Material icon name
  },
  {
    id: 4,
    name: 'Promo',
    icon: 'star', // Material icon name
  },
  {
    id: 5,
    name: 'GoPay Pinjam',
    icon: 'attach-money', // Material icon name
  },
  {
    id: 6,
    name: 'Pulsa',
    icon: 'phonelink', // Material icon name
  },
  {
    id: 7,
    name: 'Tokopedia Card',
    icon: 'credit-card', // Material icon name
  },
  {
    id: 8,
    name: 'Dilayani Tokopedia',
    icon: 'room-service', // Material icon name
  },
  {
    id: 9,
    name: 'Tokopedia Farma',
    icon: 'local-pharmacy', // Material icon name
  },
];

const CategoryCard = ({ category }) => {
  const navigation = useNavigation(); // Get navigation instance

  return (
    <TouchableOpacity style={styles.card} onPress={() => {/* Handle navigation here */}}>
      <Icon name={category.icon} size={40} color="#FFA500" />
      <Text style={styles.cardTitle}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const MoreScreen = () => {
  const navigation = useNavigation(); // Get navigation instance

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jelajah Tokopedia</Text>
      </View>

      {/* Featured Categories */}
      <Text style={styles.sectionTitle}>Featured</Text>
      <FlatList
        data={featuredCategories}
        renderItem={({ item }) => <CategoryCard category={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContent}
      />

      {/* Other Sections */}
      {['Gadget & Elektronik', 'Fashion & Kecantikan', 'Kebutuhan Harian', 'Mainan & Hobi', 'Perlengkapan Rumah & Dekorasi', 'Tagihan'].map((section, index) => (
        <View key={index}>
          <Text style={styles.sectionTitle}>{section}</Text>
          <TouchableOpacity style={styles.collapsibleSection}>
            <Text style={styles.collapsibleText}>Check it out</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
    elevation: 2,
  },
  cardTitle: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  collapsibleSection: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  collapsibleText: {
    fontSize: 16,
    color: '#555',
  },
});

export default MoreScreen;