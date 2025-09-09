import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchTreatmentFreeClaim = async () => {
  const res = await fetch(`${apiUrl}/getListTreatmentClaimFreeActive`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const postData = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/insertFreeClaimInstallApps`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const getIsClaim = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getIsClaim/${customerId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const AboutScreen = () => {
  const { t } = useTranslation();
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const customerDetails = useStore((state) => state.customerDetails);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["getListTreatmentClaimFreeActive"],
    queryFn: fetchTreatmentFreeClaim,
  });

  const {
    data: dataIsclaim,
    isLoading: isLoadingIsclaim,
    error: errorIsclaim,
    refetch: refetchIsclaim,
    isRefetching: isRefetchingIsclaim,
  } = useQuery({
    queryKey: ["getListBooking", customerId],
    queryFn: getIsClaim,
    enabled: !!customerId,
  });

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      if (data.status) {
        Toast.show({
          type: "success",
          text2: data.message,
          position: "top",
          visibilityTime: 2000,
        });
        refetch();
        refetchIsclaim();
      } else {
        Toast.show({
          type: "error",
          text2: data.message,
          position: "top",
          visibilityTime: 2000,
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Treatment gagal diclaim!",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const handleBooking = ({ qty, treatmentid, note }: any) => {
    if (qty && treatmentid && note) {
      mutation.mutate({
        qty: qty,
        note: note,
        customerid: customerId,
        locationid: customerDetails?.locationCustomerRegister,
        treatmentid: treatmentid,
      });
    } else {
      alert("Please select a date, a time and treatment .");
    }
  };

  const onRefresh = useCallback(() => {
    refetch;
  }, []);

  if (isLoading || isLoadingIsclaim) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBack title="Claim Treatment" useGoBack />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || errorIsclaim) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBack title="Claim Treatment" useGoBack />
        <View style={styles.center}>
          <Text style={{ color: "red" }}>Gagal memuat data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.treatmentName}>{item.treatmentname}</Text>
        <Text style={styles.qty}>Qty: {item.qty} </Text>
      </View>
      <TouchableOpacity
        disabled={mutation.isPending}
        onPress={() =>
          handleBooking({
            qty: item.qty,
            treatmentid: item.treatmentid,
            note: item.note,
          })
        }
      >
        <LinearGradient
          colors={["#ff7eb3", "#ff758c"]}
          style={styles.claimButton}
        >
          <Ionicons name="gift-outline" size={18} color="#fff" />
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.claimText}>Claim</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Claim Treatment" useGoBack />
      {dataIsclaim?.isClaim ? (
        <>
          <LinearGradient
            colors={["#E0F7FA", "#FFFFFF"]}
            style={styles.gradientBackground}
          >
            <View style={styles.claimedContainer}>
              <Ionicons
                name="checkmark-circle"
                size={70}
                color="#B0174C"
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.claimedSubtitle}>
                Kamu sudah klaim treatment
              </Text>
              <Text style={styles.treatmentName}>
                {dataIsclaim?.isClaim?.treatmentname}
              </Text>

              <TouchableOpacity
                style={styles.checkButton}
                activeOpacity={0.8}
                onPress={() => router.push("/treatment/yourTeatment")}
              >
                <LinearGradient
                  colors={["#B0174C", "#B0174C"]}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                  <Text style={styles.checkButtonText}>
                    Lihat Detail Treatment
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Yay! Kamu dapat hadiah treatment karena sudah install Eudora
              Aesthetic. Pilih salah satu ya!
            </Text>
          </View>

          <FlatList
            data={data?.listTreatment || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
            }
          />
        </>
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
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
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

export default AboutScreen;
