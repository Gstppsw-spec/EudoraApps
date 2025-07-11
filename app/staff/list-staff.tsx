import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import useStore from "../../store/useStore";

import Constants from "expo-constants";
import HeaderWithBack from "../component/headerWithBack";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const getStaffClinic = async ({ queryKey }: any) => {
  const [, locationId] = queryKey;
  const res = await fetch(`${apiUrl}/getStaffByLocationId/${locationId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const IndexScreen: React.FC = () => {
  const locationId = useStore((state: { locationId: any }) => state.locationId);

  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["getStaffByLocationId", locationId],
    queryFn: getStaffClinic,
    enabled: !!locationId,
  });

  const doctors = data?.doctorEuodora?.filter((d: any) => d.jobid === 12);
  const therapists = data?.doctorEuodora?.filter((d: any) => d.jobid === 6);
  const consultants = data?.doctorEuodora?.filter((d: any) => d.jobid === 4);
  const cso = data?.doctorEuodora?.filter((d: any) => d.jobid === 20);
  const om = data?.doctorEuodora?.filter((d: any) => d.jobid === 21);
  const nurse = data?.doctorEuodora?.filter((d: any) => d.jobid === 72);

  const onRefresh = () => {
    refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Our Doctor & Team" useGoBack />
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >
        <View style={styles.doctorsContainer}>
          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text>Error loading messages: {error.message}</Text>
            </View>
          ) : data?.doctorEuodora?.length > 0 ? (
            <>
              {om.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Operational Manager</Text>
                  {om.map((om: any) => (
                    <View key={om.id} style={styles.doctorCard}>
                      <Image
                        source={{ uri: `${apiUrl}/uploads/${om.image}` }}
                        style={styles.doctorImage}
                      />
                      <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{om.name}</Text>
                        <Text style={styles.doctorRole}>
                          Operational Manager
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
              {doctors.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Available Doctor</Text>
                  {doctors.map((doctor: any) => (
                    <View key={doctor.id} style={styles.doctorCard}>
                      <Image
                        source={{ uri: `${apiUrl}/uploads/${doctor.image}` }}
                        style={styles.doctorImage}
                      />
                      <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{doctor.name}</Text>
                        <Text style={styles.doctorRole}>
                          {doctor.expertise}
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {therapists.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Beauty Therapist</Text>
                  {therapists.map((therapist: any) => (
                    <View key={therapist.id} style={styles.doctorCard}>
                      <Image
                        source={{ uri: `${apiUrl}/uploads/${therapist.image}` }}
                        style={styles.doctorImage}
                      />
                      <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{therapist.name}</Text>
                        <Text style={styles.doctorRole}>
                          Beauty Therapist
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {consultants.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Beauty Consultant</Text>
                  {consultants.map((consultant: any) => (
                    <View key={consultant.id} style={styles.doctorCard}>
                      <Image
                        source={{
                          uri: `${apiUrl}/uploads/${consultant.image}`,
                        }}
                        style={styles.doctorImage}
                      />
                      <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{consultant.name}</Text>
                        <Text style={styles.doctorRole}>
                          Beauty Consultant
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {nurse.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Nurse</Text>
                  {nurse.map((nurse: any) => (
                    <View key={nurse.id} style={styles.doctorCard}>
                      <Image
                        source={{
                          uri: `${apiUrl}/uploads/${nurse.image}`,
                        }}
                        style={styles.doctorImage}
                      />
                      <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{nurse.name}</Text>
                        <Text style={styles.doctorRole}>
                          Nurse
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}

              {cso.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Customer Service Officier</Text>
                  {cso.map((cso: any) => (
                    <View key={cso.id} style={styles.doctorCard}>
                      <Image
                        source={{
                          uri: `${apiUrl}/uploads/${cso.image}`,
                        }}
                        style={styles.doctorImage}
                      />
                      <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{cso.name}</Text>
                        <Text style={styles.doctorRole}>
                          CSO
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptySubtitle}>
                You don't have any upcoming appointment yet
              </Text>
            </View>
          )}
        </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  emptyTitle: {
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  doctorsContainer: {
    marginHorizontal: 5,
    marginTop: 12,
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

  doctorInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
    gap: 4,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
});

export default IndexScreen;
