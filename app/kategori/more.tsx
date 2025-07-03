import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Complete clinic categories data
const clinicCategories = [
  {
    id: 1,
    name: 'Facial Treatment',
    icon: 'face',
  },
  {
    id: 2,
    name: 'Skin Care',
    icon: 'spa',
  },
  {
    id: 3,
    name: 'Hair Removal',
    icon: 'content-cut',
  },
  {
    id: 4,
    name: 'Body Treatment',
    icon: 'bathtub',
  },
  {
    id: 5,
    name: 'Nail Care',
    icon: 'brush',
  },
  {
    id: 6,
    name: 'Makeup',
    icon: 'colorize',
  },
  {
    id: 7,
    name: 'Hair Care',
    icon: 'content-cut',
  },
  {
    id: 8,
    name: 'Eyelash',
    icon: 'visibility',
  },
  {
    id: 9,
    name: 'Special Package',
    icon: 'star',
  },
];

// Complete clinic services data
const clinicServices = [
  {
    id: 1,
    name: 'Facial Treatments',
    description: 'Various facial treatments for all skin types'
  },
  {
    id: 2,
    name: 'Skin Rejuvenation',
    description: 'Advanced treatments for youthful skin'
  },
  {
    id: 3,
    name: 'Body Treatments',
    description: 'Full body massage and treatments'
  },
  {
    id: 4,
    name: 'Hair Services',
    description: 'Hair care and styling services'
  },
  {
    id: 5,
    name: 'Nail Services',
    description: 'Manicure and pedicure treatments'
  },
  {
    id: 6,
    name: 'Makeup Services',
    description: 'Professional makeup application'
  }
];

const CategoryCard = ({ category }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon name={category.icon} size={30} color="#FFB900" />
      </View>
      <Text style={styles.cardTitle}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const ServiceItem = ({ service }) => {
  return (
    <TouchableOpacity style={styles.serviceButton}>
      <View>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#FFB900" />
    </TouchableOpacity>
  );
};

const MoreScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFB900" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beauty Clinic Services</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Content Section */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Grid */}
        <Text style={styles.sectionTitle}>Treatment Categories</Text>
        <FlatList
          data={clinicCategories}
          renderItem={({ item }) => <CategoryCard category={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
        />

        {/* Services Sections */}
        <Text style={styles.sectionTitle}>Our Services</Text>
        {clinicServices.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}

        {/* Clinic Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Our Clinic</Text>
          <Text style={styles.infoText}>
            We provide premium beauty treatments with certified professionals using 
            the latest technology and highest quality products.
          </Text>
          <View style={styles.contactItem}>
            <Icon name="location-on" size={20} color="#FFB900" />
            <Text style={styles.contactText}>123 Beauty Street, Jakarta</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="phone" size={20} color="#FFB900" />
            <Text style={styles.contactText}>(021) 1234-5678</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Black color for the title
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    backgroundColor: '#FFF8E6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  serviceName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  infoCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB900',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
});

export default MoreScreen;