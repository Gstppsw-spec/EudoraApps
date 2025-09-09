import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import HeaderWithBack from "../component/headerWithBack";
import { useXenditPayment } from "../component/paymentHooks";
import useClinicDistances from "../hooks/useDistanceToClinic";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchCartList = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `${apiUrl}/getCustomerCartOnPaymentList/${customerId}/2`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchListClinic = async () => {
  const res = await fetch(`${apiUrl}/getClinic`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const PaymentDetailScreen = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["75%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [formData, setFormData] = useState({
    clinicLocation: "",
    clinicId: null,
  });

  const handlePresentBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleDismissBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getCustomerCartOnPaymentList", customerId],
    queryFn: fetchCartList,
    enabled: !!customerId,
  });

  const { data: clinicOptions } = useQuery({
    queryKey: ["getClinic"],
    queryFn: fetchListClinic,
  });

  const { distances, loading: loadingDistance } = useClinicDistances(
    clinicOptions?.clinicEuodora
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredClinics = clinicOptions?.clinicEuodora?.filter((clinic) =>
    clinic?.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const sortedClinics = (filteredClinics || [])
    .map((clinic) => {
      const distance = distances?.[clinic.id];
      return {
        ...clinic,
        distance: distance ?? Infinity,
      };
    })
    .sort((a, b) => a.distance - b.distance);

  const formatRupiah = (number: number) =>
    "Rp " + number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const getTotal = () =>
    data?.data?.reduce((sum, item) => sum + item.price * item.qty, 0);

  const paymentMutation = useXenditPayment();

  const handleCheckOut = () => {
    if (!formData?.clinicId) {
      Toast.show({
        type: "error",
        text1: "Pilih Klinik",
        text2: "Silakan pilih klinik pembelian terlebih dahulu.",
        position: "top",
        visibilityTime: 2500,
      });
      return;
    }

    paymentMutation.mutate({
      amount: getTotal(),
      location_id: formData?.clinicId,
      customer_id: customerId,
      detail: data?.data,
    });
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemCard}>
      <Ionicons
        name="cube-outline"
        size={28}
        color="#B0174C"
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.productname}</Text>
        <Text style={styles.itemQty}>Jumlah: {item.qty}</Text>
      </View>
      <Text style={styles.itemPrice}>{formatRupiah(item?.price)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <HeaderWithBack title="Detail Pembelian" useGoBack />
        <Text style={styles.headerSubtitle}>Ringkasan belanja Anda</Text>
      </View>

      {/* PILIH KLINIK */}
      <View style={styles.inputGroup}>
        <Pressable
          style={styles.dropdownContainer}
          onPress={() => {
            if (isBottomSheetOpen) {
              handleDismissBottomSheet();
              setIsBottomSheetOpen(false);
            } else {
              handlePresentBottomSheet();
              setIsBottomSheetOpen(true);
            }
          }}
        >
          <Text style={styles.text}>
            {formData.clinicLocation || "Pilih Klinik Pembelian"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748b" />
        </Pressable>
      </View>

      {/* LIST ITEM */}
      <FlatList
        data={data?.data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* TOTAL TAGIHAN */}
      <LinearGradient
        colors={["#ff7eb3", "#B0174C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.totalContainer}
      >
        <Text style={styles.totalLabel}>Total Tagihan</Text>
        <Text style={styles.totalValue}>{formatRupiah(getTotal())}</Text>
      </LinearGradient>

      {/* TOMBOL BAYAR */}
      <TouchableOpacity
        style={{ marginHorizontal: 16, marginBottom: 20 }}
        onPress={handleCheckOut}
        disabled={paymentMutation.isPending}
      >
        <LinearGradient
          colors={
            paymentMutation.isPending
              ? ["#ccc", "#aaa"]
              : ["#ff0844", "#ff2e63"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.payButton}
        >
          {paymentMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="wallet-outline" size={20} color="#fff" />
              <Text style={styles.payButtonText}>Bayar Sekarang</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* BOTTOM SHEET KLINIK */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["50%", "90%"]}
        enablePanDownToClose
        onDismiss={() => setIsBottomSheetOpen(false)}
        keyboardBehavior="interactive"
        backgroundStyle={{ borderRadius: 20, backgroundColor: "#fff" }}
      >
        <BottomSheetFlatList
          data={sortedClinics}
          keyExtractor={(item) => String(item?.id)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 300 }}
          ListHeaderComponent={
            <View style={{ padding: 16, backgroundColor: "#fff" }}>
              <View
                style={{
                  width: 50,
                  height: 4,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 2,
                  alignSelf: "center",
                  marginBottom: 12,
                }}
              />
              <Text style={styles.modalTitleSheet}>Pilih Klinik Terdekat</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari Klinik..."
                placeholderTextColor="#9ca3af"
                onChangeText={setSearchQuery}
                value={searchQuery}
                onFocus={() => bottomSheetModalRef.current?.snapToIndex(1)}
              />
            </View>
          }
          stickyHeaderIndices={[0]}
          ListEmptyComponent={() => (
            <View style={{ padding: 32, alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#999" }}>
                Tidak ada data tersedia
              </Text>
            </View>
          )}
          renderItem={({ item }) => {
            const distance = distances?.[item.id];
            const formattedDistance = loadingDistance
              ? "Menghitung..."
              : distance !== undefined
              ? `${distance.toFixed(2)} KM`
              : "? KM";

            const isSelected = formData.clinicId === item.id;

            return (
              <TouchableOpacity
                style={[
                  styles.clinicCard,
                  isSelected && { borderColor: "#B0174C", borderWidth: 1 },
                ]}
                onPress={() => {
                  setFormData({
                    clinicLocation: item.name,
                    clinicId: item.id,
                  });
                  handleDismissBottomSheet();
                }}
              >
                <Ionicons
                  name="business-outline"
                  size={22}
                  color="#B0174C"
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.clinicNameText}>{item?.name}</Text>
                  <Text style={styles.clinicDistanceText}>
                    Jarak: {formattedDistance}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color="#B0174C" />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },

  headerContainer: {
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    marginLeft: 4,
  },

  listContainer: { padding: 16 },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    marginVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  itemName: { fontSize: 14, fontWeight: "600", color: "#1f2937" },
  itemQty: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  itemPrice: { fontSize: 15, fontWeight: "700", color: "#B0174C" },

  totalContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
  },
  totalLabel: { color: "#fff", fontSize: 14, fontWeight: "600" },
  totalValue: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 4 },

  payButton: {
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  inputGroup: { marginHorizontal: 16, marginVertical: 15 },
  text: { color: "#1e293b", fontSize: 14 },

  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  modalTitleSheet: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#111827",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },

  clinicCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  clinicNameText: { fontSize: 15, fontWeight: "600", color: "#1f2937" },
  clinicDistanceText: { fontSize: 13, color: "#6b7280", marginTop: 2 },
});

export default PaymentDetailScreen;
