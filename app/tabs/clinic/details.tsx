import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useStore from "../../../store/useStore";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
const apiKey = Constants.expoConfig?.extra?.apiKey;

const getLocationDetail = async ({ queryKey }: any) => {
  const [, locationId] = queryKey;
  const res = await fetch(`${apiUrl}/getClinicById/${locationId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const getDoctorClinic = async ({ queryKey }: any) => {
  const [, locationId] = queryKey;
  const res = await fetch(`${apiUrl}/getDoctorByLocationId/${locationId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const getPlaceIdByName = async (clinicName: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    clinicName
  )}&inputtype=textquery&fields=place_id&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK" && data.candidates.length > 0) {
    return data.candidates[0].place_id;
  } else {
    console.warn("Gagal menemukan place_id:", data.status);
    return null;
  }
};

const getGooglePlaceRating = async (placeId: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK") {
    return {
      rating: data.result.rating,
      reviews: data.result.user_ratings_total,
    };
  } else {
    console.warn("Gagal mengambil rating:", data.status);
    return {
      rating: null,
      reviews: null,
    };
  }
};

const ClinicDetailScreen = () => {
  const router = useRouter();
  const locationId = useStore((state: { locationId: any }) => state.locationId);

  const {
    data: clinicData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["getClinicById", locationId],
    queryFn: getLocationDetail,
    enabled: !!locationId,
  });

  const [googleRating, setGoogleRating] = useState({
    rating: null,
    reviews: null,
  });

  useEffect(() => {
    const fetchGoogleRating = async () => {
      if (clinicData?.clinicEuodora?.[0]?.placeid) {
        const placeid = clinicData.clinicEuodora[0].placeid;
        const placeId = await getPlaceIdByName(placeid);
        if (placeId) {
          const ratingData = await getGooglePlaceRating(placeId);
          setGoogleRating(ratingData);
        }
      }
    };

    fetchGoogleRating();
  }, [clinicData]);

  const {
    data: doctorData,
    isLoading: isLoadingDoctor,
    error: errorDoctor,
    refetch: refetchDoctor,
    isRefetching: isRefetchingDoctor,
  } = useQuery({
    queryKey: ["getDoctorByLocationId", locationId],
    queryFn: getDoctorClinic,
    enabled: !!locationId,
  });

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
    const address =
      clinicData?.clinicEuodora[0]?.address || "Bintaro Jaya Exchange";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Gagal membuka Google Maps:", err)
    );
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Cek klinik ${
          clinicData?.clinicEuodora[0]?.name || "EUDORA Clinic"
        } di sini:\n\nAlamat: ${
          clinicData?.clinicEuodora[0]?.address || "Bintaro Jaya Exchange"
        }\n\nGoogle Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          clinicData?.clinicEuodora[0]?.address || "Bintaro Jaya Exchange"
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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error loading messages: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/tabs/clinic")}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView>
        <View style={{ flex: 1 }}>
          {clinicData?.clinicEuodora[0]?.image ? (
            <Image
              source={{
                uri: `${apiUrl}/upload/${clinicData?.clinicEuodora[0]?.image}`,
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
            <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
              <Text style={styles.clinicName}>
                {clinicData?.clinicEuodora[0]?.name ||
                  "EUDORA Bintaro Exchange"}
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
                  size={15}
                  color="#B0174C"
                />
                <Text style={styles.clinicAddress}>
                  {clinicData?.clinicEuodora[0]?.address ||
                    "Bintaro Jaya Exchange"}
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
                  color="#B0174C"
                />
                <Text style={styles.rating}>
                  {googleRating?.rating} ({googleRating?.reviews} reviews)
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleWhatsAppPress(clinicData?.clinicEuodora[0]?.mobilephone)
                }
              >
                <View style={styles.actionIconCircle}>
                  <FontAwesome name="envelope" size={20} color="#B0174C" />
                </View>
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleCallPress(clinicData?.clinicEuodora[0]?.mobilephone)
                }
              >
                <View style={styles.actionIconCircle}>
                  <FontAwesome name="phone" size={20} color="#B0174C" />
                </View>
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleOpenMap}
              >
                <View style={styles.actionIconCircle}>
                  <FontAwesome name="map-marker" size={20} color="#B0174C" />
                </View>
                <Text style={styles.actionButtonText}>Direction</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <View style={styles.actionIconCircle}>
                  <FontAwesome name="share-alt" size={20} color="#B0174C" />
                </View>
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Clinic Schedule</Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Monday - Sunday</Text>
              <Text>{clinicData?.clinicEuodora[0]?.operationalTime}</Text>
            </View>

            <View style={styles.divider} />

            {/* Our Doctors Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our doctor & Team</Text>
              <Link href={"/staff/list-staff"} asChild>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#B0174C",
                    }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Doctors List */}
            <View style={styles.doctorsContainer}>
              {doctorData?.doctorEuodora?.map((doctor) => (
                <View key={doctor.id}>
                  <View style={styles.doctorCard}>
                    <Image
                      source={{
                        uri: `${apiUrl}/uploads/${doctor.image}`,
                      }}
                      style={styles.doctorImage}
                    />
                    <View
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      <Text style={styles.doctorName}>{doctor.name}</Text>
                      <Text style={styles.doctorRole}>{doctor.expertise}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ backgroundColor: "white" }}>
        <Link href="/bookappointment/booking" asChild style={styles.bookButton}>
          <TouchableOpacity>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
    height: 250, // tinggi gambar (bisa disesuaikan)
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
    padding: 10,
    zIndex: 10,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  clinicAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: "#666",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 1,
    marginTop: 15,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#FFE5F8",
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 16,
    color: "#FFB900",
  },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  doctorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#eee",
    resizeMode: "cover",
    backgroundColor: "#ccc",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  doctorRole: {
    fontSize: 14,
    color: "#666",
  },
  bookButton: {
    backgroundColor: "#B0174C",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 5,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  doctorsContainer: {
    marginHorizontal: 5,
    marginTop: 12,
  },
});

export default ClinicDetailScreen;
