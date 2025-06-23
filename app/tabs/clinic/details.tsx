import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ClinicDetailScreen = () => {
  const clinicData = useLocalSearchParams();
  const router = useRouter();

  const handleWhatsAppPress = (whatsappNumber: any) => {
    const message = "Halo, saya ingin bertanya."; // isi pesan default
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    Linking.openURL(url).catch((err) => {
      console.error("Gagal membuka WhatsApp:", err);
    });
  };

  const handleCallPress = (whatsappNumber: any) => {
    const telUrl = `tel:${whatsappNumber}`;
    Linking.openURL(telUrl).catch((err) =>
      console.error("Gagal membuka aplikasi telepon:", err)
    );
  };

  const handleOpenMap = () => {
    const address = clinicData.address || "Bintaro Jaya Exchange";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch((err) =>
      console.error("Gagal membuka Google Maps:", err)
    );
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Cek klinik ${
          clinicData.name || "EUDORA Clinic"
        } di sini:\n\nAlamat: ${
          clinicData.address || "Bintaro Jaya Exchange"
        }\n\nGoogle Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          clinicData.address || "Bintaro Jaya Exchange"
        )}`,
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Klinik dibagikan.");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dibatalkan.");
      }
    } catch (error) {
      console.error("Gagal share:", error.message);
    }
  };

  const doctors = [
    {
      id: 1,
      name: "A. Walker",
      role: "Doctor",
      image: require("@/assets/images/doc.png"),
    },
    {
      id: 2,
      name: "N. Patel",
      role: "Doctor",
      image: require("@/assets/images/doc.png"),
    },
    {
      id: 3,
      name: "B. Cruz",
      role: "Doctor",
      image: require("@/assets/images/doc.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView>
        <View style={{ flex: 1 }}>
          {clinicData.image ? (
            <Image
              source={{
                uri: `https://sys.eudoraclinic.com:84/apieudora/upload/${clinicData.image}`,
              }}
              style={styles.clinicImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Clinic Image Unavailable
              </Text>
            </View>
          )}

          <View style={styles.headerContainer}>
            <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
              <Text style={styles.clinicName}>
                {clinicData.name || "EUDORA Bintaro Exchange"}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesome
                  style={{ marginRight: 13 }}
                  name="map-marker"
                  size={20}
                  color="#FFB900"
                />
                <Text
                  style={styles.clinicAddress}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {clinicData.address || "Bintaro Jaya Exchange"}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesome
                  style={{ marginRight: 10 }}
                  name="star"
                  size={15}
                  color="#FFB900"
                />
                <Text style={styles.rating}>
                  {clinicData.rating || "4.8"} ({clinicData.reviews || "3,279"}{" "}
                  reviews)
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleWhatsAppPress(clinicData.mobilephone)}
              >
                <View style={styles.actionIconCircle}>
                  <FontAwesome name="envelope" size={25} color="#FFA500" />
                </View>
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCallPress(clinicData.mobilephone)}
              >
                <View style={styles.actionIconCircle}>
                  <FontAwesome name="phone" size={25} color="#FFA500" />
                </View>
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleOpenMap}
              >
                <View style={styles.actionIconCircle}>
                  <FontAwesome name="map-marker" size={25} color="#FFA500" />
                </View>
                <Text style={styles.actionButtonText}>Direction</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <View style={styles.actionIconCircle}>
                  <FontAwesome name="share-alt" size={25} color="#FFA500" />
                </View>
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Our Doctors Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our doctor</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {/* Doctors List */}
            <View style={styles.doctorsContainer}>
              {doctors.map((doctor) => (
                <View key={doctor.id} style={styles.doctorCard}>
                  <Image source={doctor.image} style={styles.doctorImage} />
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorRole}>{doctor.role}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <Link
              href="/bookappointment/booking"
              asChild
              style={styles.bookButton}
            >
              <TouchableOpacity>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 8,
  },
  clinicImage: {
    width: "100%",
    height: 300, // tinggi gambar (bisa disesuaikan)
  },
  placeholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#ccc",
    fontSize: 16,
  },
  headerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -40,
    padding: 10,
    zIndex: 10,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  clinicAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    color: "#666",
    // fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 20,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 15,
    backgroundColor: "#FFF8E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 16,
    color: "#FFB900",
  },
  doctorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  doctorCard: {
    width: "30%",
    marginBottom: 16,
    alignItems: "center",
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  doctorRole: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: "#FFB900",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ClinicDetailScreen;
