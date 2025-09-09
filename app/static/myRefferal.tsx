import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchTreatmentFreeClaim = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getListRefferalFriend/${customerId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const MyRefferalScreen = () => {
  const { t } = useTranslation();
  const customerId = useStore((state: { customerid: any }) => state.customerid);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["getListBooking", customerId],
    queryFn: fetchTreatmentFreeClaim,
    enabled: !!customerId,
  });

  const onRefresh = useCallback(() => {
    refetch;
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBack title={t("myReferral")} useGoBack />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBack title={t("myReferral")} useGoBack />
        <View style={styles.center}>
          <Text style={{ color: "red" }}>Gagal memuat data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.treatmentName}>
          {t("fullname")}: {item.refferalname}
        </Text>
        <Text style={styles.qty}>
          {t("cellphoneNumber")}: {item.cellphonenumber}{" "}
        </Text>
        <Text style={styles.qty}>
          {t("registerDate")}: {item.registerdate}{" "}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title={t("myReferral")} useGoBack />
      {data?.listRefferalFriend?.length > 0 ? (
        <FlatList
          data={data?.listRefferalFriend || []}
          keyExtractor={(item) => item.cellphonenumber.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="people-outline"
            size={60}
            color="#E0E0E0"
          />
          <Text style={styles.emptyTitle}>No Refferal Yet</Text>
          <Text style={styles.emptySubtitle}>
            You don't have any refferal yet
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  claimedContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    width: "85%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
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

  checkButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  checkButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: { flex: 1, backgroundColor: "#fff" },
  headerMessage: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff0f5",
    borderRadius: 10,
    margin: 10,
  },
  headerText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#ff4f81",
    fontWeight: "500",
  },
  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  note: { fontSize: 13, color: "#666", marginVertical: 2 },
  qty: { fontSize: 13, color: "#999" },
  claimButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  claimText: { color: "#fff", marginLeft: 5, fontWeight: "600" },

  claimedTitle: {
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  claimedSubtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    paddingBottom: 10,
  },
  buttonClaimed: {
    marginTop: 20,
    backgroundColor: "#B0174C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MyRefferalScreen;
