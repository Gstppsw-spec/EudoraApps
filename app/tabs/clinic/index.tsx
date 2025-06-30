import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

const fetchUsers = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const fetchListClinic = async () => {
  const res = await fetch(
    "https://sys.eudoraclinic.com:84/apieudora/getClinic"
  );
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const IndexScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleSearchPress = () => {
    // navigation.navigate("SearchScreen");
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const {
    data: dataclinic,
    error: errorclinic,
    isLoading: isLoadingclinic,
  } = useQuery({
    queryKey: ["getClinic"],
    queryFn: fetchListClinic,
  });

  if (isLoadingclinic) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  
    if (errorclinic) {
      return (
        <View style={styles.center}>
          <Text>Error loading messages: {errorclinic.message}</Text>
        </View>
      );
    }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.mainHeader}>OUR CLINIC</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSearchPress}
        >
          <FontAwesome name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {isLoadingclinic ? (
          <Text>Loading...</Text>
        ) : errorclinic ? (
          <Text>Terjadi kesalahan saat mengambil data</Text>
        ) : (
          dataclinic.clinicEuodora.map((clinic: any, index: number) => (
            <View key={index} style={styles.clinicCardContainer}>
              <Link
                href={{ pathname: "/tabs/clinic/details", params: clinic }}
                asChild
              >
                <TouchableOpacity style={styles.clinicCard}>
                  <Image
                    source={{
                      uri: `https://sys.eudoraclinic.com:84/apieudora/upload/${clinic.image}`,
                    }}
                    style={styles.clinicImage}
                  />

                  <View style={styles.clinicInfo}>
                    <Text style={styles.clinicName}>{clinic.name}</Text>
                    <Text style={styles.clinicAddress}>{clinic.address}</Text>
                    <View style={styles.distanceRatingContainer}>
                      <Text style={styles.distanceText}>{clinic.distance}</Text>
                      <FontAwesome
                        name="arrow-up"
                        size={12}
                        color="#4CAF50"
                        style={styles.arrowIcon}
                      />
                      <Text style={styles.ratingText}>{clinic.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
              {index < dataclinic.clinicEuodora.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 8,
  },
  mainHeader: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  clinicCardContainer: {
    marginBottom: 8,
  },
  clinicCard: {
    flexDirection: "row",
    paddingVertical: 16,
  },
  clinicImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  clinicInfo: {
    flex: 1,
    justifyContent: "center",
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  distanceRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  arrowIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginLeft: 96, // Match image width + margin
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IndexScreen;
