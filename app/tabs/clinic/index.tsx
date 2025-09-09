import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
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

import ErrorView from "@/app/component/errorView";
import LoadingView from "@/app/component/loadingView";
import Constants from "expo-constants";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchListClinic = async () => {
  const res = await fetch(`${apiUrl}/getClinic`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const IndexScreen: React.FC = () => {
  const setLocationId = useStore((state) => state.setLocationId);
  const [refreshing, setRefreshing] = useState(false);
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

  const { distances, loading, error } = useClinicDistances(
    dataclinic?.clinicEuodora
  );

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([refetch()]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }
    setRefreshing(false);
  };

  const sortedClinics = dataclinic?.clinicEuodora
    ?.slice()
    .sort((a: any, b: any) => {
      const distanceA = distances[a.id] ?? Infinity;
      const distanceB = distances[b.id] ?? Infinity;
      return distanceA - distanceB;
    });

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View key={index} style={styles.clinicCardContainer}>
      <Link
        href={{ pathname: "/tabs/clinic/details", params: item }}
        onPress={() => setLocationId(item.id)}
        asChild
      >
        <TouchableOpacity style={styles.clinicCard}>
          <View>
            <Image
              source={{ uri: `${apiUrl}/${item.image}` }}
              style={styles.clinicImage}
            />
          </View>
          <View>
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName}>{item.name}</Text>
              <Text style={styles.clinicAddress}>{item.address}</Text>
              <View style={styles.distanceRatingContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome
                    name="whatsapp"
                    size={12}
                    color="#4CAF50"
                    style={styles.arrowIcon}
                  />
                  <Text style={styles.ratingText}>{item.mobilephone}</Text>
                </View>
                <Text style={styles.distanceText}>
                  {loading
                    ? "Menghitung..."
                    : `${distances[item.id]?.toFixed(2) ?? "?"} KM`}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
      {index < sortedClinics.length - 1 && <View style={styles.divider} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainHeader}>Eudora Clinic</Text>
      </View>

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {isLoadingclinic ? (
        <LoadingView />
      ) : errorclinic ? (
        <ErrorView onRetry={onRefresh} />
      ) : (
        <FlatList
          data={sortedClinics}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
        />
      )}
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
