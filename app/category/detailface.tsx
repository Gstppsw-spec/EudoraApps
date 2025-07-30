import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Data kategori perawatan
const treatmentsData = [
  {
    categoryId: 1,
    treatments: [
      { id: 1, title: "PerfectLift by Aptos V - 2 thread", description: "Deskripsi lengkap tentang PerfectLift by Aptos V - 2 thread.", image: require('@/assets/images/face.jpg') },
      { id: 2, title: "4D Perfect Nose Lift & Tip Lift", description: "Deskripsi tentang 4D Perfect Nose Lift.", image: require('@/assets/images/face.jpg') },
      { id: 3, title: "Mesotherapy for Anti Aging", description: "Deskripsi tentang Mesotherapy.", image: require('@/assets/images/face.jpg') },
      { id: 4, title: "Ultherapy for Skin Tightening", description: "Deskripsi tentang Ultherapy.", image: require('@/assets/images/face.jpg') },
      { id: 5, title: "Radiofrequency Skin Treatment", description: "Deskripsi tentang Radiofrequency.", image: require('@/assets/images/face.jpg') },
      { id: 6, title: "PRP Hair Restoration", description: "Deskripsi tentang PRP Hair Restoration.", image: require('@/assets/images/face.jpg') },
    ],
  },
  {
    categoryId: 2,
    treatments: [
      { id: 1, title: "Ageless Skin Essence", description: "Deskripsi tentang Ageless Skin Essence.", image: require('@/assets/images/face.jpg') },
      { id: 2, title: "Antiperspirant Injection", description: "Deskripsi tentang Antiperspirant Injection.", image: require('@/assets/images/face.jpg') },
      { id: 3, title: "Facial Rejuvenation Treatment", description: "Deskripsi tentang Facial Rejuvenation Treatment.", image: require('@/assets/images/face.jpg') },
      { id: 4, title: "Chemical Peel Treatment", description: "Deskripsi tentang Chemical Peel Treatment.", image: require('@/assets/images/face.jpg') },
      { id: 5, title: "Hydrafacial Treatment", description: "Deskripsi tentang Hydrafacial Treatment.", image: require('@/assets/images/face.jpg') },
      { id: 6, title: "LED Light Therapy", description: "Deskripsi tentang LED Light Therapy.", image: require('@/assets/images/face.jpg') },
    ],
  },
  {
    categoryId: 3,
    treatments: [
      { id: 1, title: "Skin Brightening Treatment", description: "Deskripsi tentang Skin Brightening.", image: require('@/assets/images/face.jpg') },
      { id: 2, title: "Acne Treatment Program", description: "Deskripsi tentang Acne Treatment.", image: require('@/assets/images/face.jpg') },
      { id: 3, title: "Whitening Peeling Treatment", description: "Deskripsi tentang Whitening Peeling.", image: require('@/assets/images/face.jpg') },
      { id: 4, title: "Hydrating Mask Treatment", description: "Deskripsi tentang Hydrating Mask.", image: require('@/assets/images/face.jpg') },
      { id: 5, title: "Skin Firming Gel", description: "Deskripsi tentang Skin Firming Gel.", image: require('@/assets/images/face.jpg') },
      { id: 6, title: "Spa Body Scrub", description: "Deskripsi tentang Spa Body Scrub.", image: require('@/assets/images/face.jpg') },
    ],
  },
  {
    categoryId: 4,
    treatments: [
      { id: 1, title: "Body Contouring Treatment", description: "Deskripsi tentang Body Contouring.", image: require('@/assets/images/face.jpg') },
      { id: 2, title: "Cellulite Reduction Treatment", description: "Deskripsi tentang Cellulite Treatment.", image: require('@/assets/images/face.jpg') },
      { id: 3, title: "Steam Bath Therapy", description: "Deskripsi tentang Steam Bath Therapy.", image: require('@/assets/images/face.jpg') },
      { id: 4, title: "Weight Loss Program", description: "Deskripsi tentang Weight Loss Program.", image: require('@/assets/images/face.jpg') },
      { id: 5, title: "Relaxing Massage Therapy", description: "Deskripsi tentang Relaxing Massage.", image: require('@/assets/images/face.jpg') },
      { id: 6, title: "Hot Stone Massage", description: "Deskripsi tentang Hot Stone Massage.", image: require('@/assets/images/face.jpg') },
    ],
  },
];

const TreatmentDetailsScreen = () => {
  const router = useRouter();
  const { id } = router.query; // Mengambil ID kategori dari URL
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(null); // State untuk menyimpan kategori

  useEffect(() => {
    if (id) {
      // Temukan kategori berdasarkan ID
      const foundCategory = treatmentsData.find(c => c.categoryId === parseInt(id));
      setCategory(foundCategory);
    }
  }, [id]); // Trigger setiap kali id berubah

  // Filter perawatan berdasarkan query pencarian
  const filteredTreatments = category
    ? category.treatments.filter(treatment =>
        treatment.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Cari perawatan..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredTreatments.length > 0 ? (
          filteredTreatments.map(treatment => (
            <View key={treatment.id} style={styles.cardContainer}>
              <Image 
                source={treatment.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <Text style={styles.cardTitle}>{treatment.title}</Text>
              <Text style={styles.cardDescription}>{treatment.description}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noResults}>Tidak ada hasil ditemukan.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 16,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 10,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  cardDescription: {
    fontSize: 14,
    paddingTop: 5,
    color: '#777',
  },
  noResults: {
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default TreatmentDetailsScreen;   