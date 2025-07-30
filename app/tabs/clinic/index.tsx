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
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import useClinicDistances from "@/app/hooks/useDistanceToClinic";
import useStore from "../../../store/useStore";
import Constants from 'expo-constants';
import { useTranslation } from "react-i18next";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface Clinic {
  id: string;
  name: string;
  address: string;
  mobilephone: string;
  image: string;
}

interface ClinicResponse {
  clinicEuodora: Clinic[];
}

const fetchListClinic = async (): Promise<ClinicResponse> => {
  const res = await fetch(`${apiUrl}/getClinic`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const IndexScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const setLocationId = useStore((state) => state.setLocationId);
  const currentLanguage = useStore((state) => state.lang);

  const {
    data: dataclinic,
    error: errorclinic,
    isLoading: isLoadingclinic,
    isRefetching,
    refetch,
  } = useQuery<ClinicResponse>({
    queryKey: ["getClinic", currentLanguage],
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
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  if (errorclinic) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {t('errorLoading')}: {errorclinic.message}
        </Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainHeader}>{t('ourClinic')}</Text>
      </View>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={onRefresh}
            tintColor="#B0174C"
          />
        }
      >
        {dataclinic?.clinicEuodora.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('noClinicsAvailable')}</Text>
          </View>
        ) : (
          dataclinic?.clinicEuodora.map((clinic: Clinic, index: number) => (
            <View key={clinic.id} style={styles.clinicCardContainer}>
              <Link
                href={{ pathname: "/tabs/clinic/details", params: clinic }}
                onPress={() => setLocationId(clinic.id)}
                asChild
              >
                <TouchableOpacity style={styles.clinicCard}>
                  <Image
                    source={{ uri: `${apiUrl}/upload/${clinic.image}` }}
                    style={styles.clinicImage}
                    contentFit="cover"
                  />
                  <View style={styles.clinicInfo}>
                    <Text style={styles.clinicName}>{clinic.name}</Text>
                    <Text style={styles.clinicAddress}>{clinic.address}</Text>
                    <View style={styles.distanceRatingContainer}>
                      <View style={styles.contactContainer}>
                        <FontAwesome
                          name="whatsapp"
                          size={14}
                          color="#4CAF50"
                          style={styles.contactIcon}
                        />
                        <Text style={styles.contactText}>
                          {clinic.mobilephone}
                        </Text>
                      </View>
                      <View style={styles.distanceContainer}>
                        <FontAwesome
                          name="map-marker"
                          size={14}
                          color="#B0174C"
                          style={styles.distanceIcon}
                        />
                        <Text style={styles.distanceText}>
                          {loading 
                            ? t('calculating') 
                            : `${distances[clinic.id]?.toFixed(2) ?? "?"} ${t('km')}`}
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: StatusBar.currentHeight,
  },
  mainHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    color: "#333",
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
    width: "100%",
    height: 180,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  clinicAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  distanceRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIcon: {
    marginRight: 6,
  },
  contactText: {
    fontSize: 14,
    color: "#4CAF50",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceIcon: {
    marginRight: 6,
  },
  distanceText: {
    fontSize: 14,
    color: "#B0174C",
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  errorText: {
    color: "#f87171",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#B0174C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default IndexScreen;