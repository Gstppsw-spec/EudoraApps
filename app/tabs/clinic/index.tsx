import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import useClinicDistances from "@/app/hooks/useDistanceToClinic";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import useStore from "../../../store/useStore";

import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl 


const fetchListClinic = async () => {
  const res = await fetch(
    `${apiUrl}/getClinic`
  );
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const IndexScreen: React.FC = () => {
  const navigation = useNavigation();
  const setLocationId = useStore((state) => state.setLocationId);

  const {
    data: dataclinic,
    error: errorclinic,
    isLoading: isLoadingclinic,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["getClinic"],
    queryFn: fetchListClinic,
  });

  const { distances, loading, error } = useClinicDistances(dataclinic?.clinicEuodora);

  const onRefresh = () => {
    refetch();
  };

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
        <Text style={styles.mainHeader}>OUR CLINIC</Text>
      </View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >
        {isLoadingclinic ? (
          <Text>Loading...</Text>
        ) : errorclinic ? (
          <Text>Terjadi kesalahan saat mengambil data</Text>
        ) : (
          dataclinic.clinicEuodora.map((clinic: any, index: number) => {
            return (
              <View key={index} style={styles.clinicCardContainer}>
                <Link
                  href={{ pathname: "/tabs/clinic/details", params: clinic }}
                  onPress={() => setLocationId(clinic.id)}
                  asChild
                >
                  <TouchableOpacity style={styles.clinicCard}>
                    <View>
                      <Image
                        source={{
                          uri: `${apiUrl}/upload/${clinic.image}`,
                        }}
                        style={styles.clinicImage}
                      />
                    </View>
                    <View>
                      <View style={styles.clinicInfo}>
                        <Text style={styles.clinicName}>{clinic.name}</Text>
                        <Text style={styles.clinicAddress}>
                          {clinic.address}
                        </Text>
                        <View style={styles.distanceRatingContainer}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <FontAwesome
                              name="whatsapp"
                              size={12}
                              color="#4CAF50"
                              style={styles.arrowIcon}
                            />
                            <Text style={styles.ratingText}>
                              {clinic.mobilephone}
                            </Text>
                          </View>
                          <Text style={styles.distanceText}>
                            {loading
                              ? "Menghitung..."
                              : `${distances[clinic.id]?.toFixed(2) ?? "?"} KM`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
                {index < dataclinic.clinicEuodora.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: StatusBar.currentHeight,
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
    paddingVertical: 16,
  },
  clinicImage: {
    borderRadius: 8,
    marginRight: 16,
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  clinicInfo: {
    flex: 1,
    justifyContent: "center",
  },
  clinicName: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 8,
  },
  clinicAddress: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  distanceRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IndexScreen;
