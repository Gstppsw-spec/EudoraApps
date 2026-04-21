import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchCartList = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getCustomerCartList/${customerId}/1`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const updateQtyAndStatusCart = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/updateQtyAndStatusCart`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

const CartScreen = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getCustomerCartList", customerId],
    queryFn: fetchCartList,
    enabled: !!customerId,
  });

  const formatRupiah = (number: number) => {
    return "Rp " + number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const toggleSelect = (item: any) => {
    const isOnPayment = item?.is_on_payment === 0;
    mutation.mutate({
      idcart: item.id,
      type: isOnPayment ? 5 : 7,
    });
  };

  const toggleSelectAll = () => {
    const allSelected = data?.data?.every(
      (item: any) => item.is_on_payment === 1,
    );
    mutation.mutate({
      idcart: customerId,
      type: allSelected ? 6 : 4,
    });
  };

  const mutation = useMutation({
    mutationFn: updateQtyAndStatusCart,
    onSuccess: (data) => {
      if (data?.status) {
        queryClient.invalidateQueries(["getCustomerCartList", customerId]);
      } else {
        Toast.show({
          type: "error",
          text2: "Gagal update keranjang!",
          position: "top",
          visibilityTime: 2000,
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Gagal update keranjang!",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const increaseQty = (item: any) => {
    mutation.mutate({
      idcart: item.id,
      type: 2,
    });
  };

  const decreaseQty = (item: any) => {
    if (item.qty == 1) {
      mutation.mutate({
        idcart: item.id,
        type: 3,
      });
    } else {
      mutation.mutate({
        idcart: item.id,
        type: 1,
      });
    }
  };

  const removeItem = (item: any) => {
    mutation.mutate({
      idcart: item.id,
      type: 3,
    });
  };

  const subtotal =
    data?.data && data.data.length > 0
      ? data.data.reduce(
          (sum: number, item: any) =>
            item.is_on_payment === 1 ? sum + item.price * item.qty : sum,
          0,
        )
      : 0;

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleSelect(item)}
      >
        {item?.is_on_payment == 1 && <View style={styles.checkboxTick} />}
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.productname}</Text>
        <Text style={styles.itemPrice}>{formatRupiah(item?.price)}</Text>
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => decreaseQty(item)}
          >
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.qty}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => increaseQty(item)}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={{ padding: 6 }} onPress={() => removeItem(item)}>
        <Ionicons name="trash-outline" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
      <HeaderWithBack title="Keranjang" useGoBack />

      {data?.data?.length !== 0 && (
        <View style={styles.selectAllContainer}>
          <TouchableOpacity style={styles.checkbox} onPress={toggleSelectAll}>
            {data?.data?.every((item: any) => item.is_on_payment === 1) &&
              data?.data?.length > 0 && <View style={styles.checkboxTick} />}
          </TouchableOpacity>
          <Text style={{ fontSize: 15, marginLeft: 8 }}>Pilih Semua</Text>
        </View>
      )}

      <FlatList
        data={data?.data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={() =>
          isLoading && (
            <View style={{ padding: 10, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          )
        }
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Text style={{ fontSize: 16, color: "#999" }}>
              {isLoading ? "Memuat data..." : "Tidak ada data tersedia"}
            </Text>
          </View>
        )}
      />

      <View style={styles.bottomBar}>
        <View>
          <Text style={{ fontSize: 14, color: "#555" }}>Subtotal</Text>
          {mutation.isPending ? (
            <Text
              style={[
                styles.totalPrice,
                { color: "#999", fontStyle: "italic" },
              ]}
            >
              Menghitung...
            </Text>
          ) : (
            <Text style={styles.totalPrice}>{formatRupiah(subtotal)}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            {
              backgroundColor:
                data?.data?.filter((item: any) => item.is_on_payment === 1)
                  .length > 0
                  ? "#B0174C"
                  : "#ccc",
            },
          ]}
          disabled={
            data?.data?.filter((item: any) => item.is_on_payment === 1)
              .length === 0
          }
          onPress={() => router.push("/payment/paymentDetail")}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#B0174C",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxTick: {
    width: 12,
    height: 12,
    backgroundColor: "#B0174C",
    borderRadius: 3,
  },

  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  itemContainer: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  itemName: { fontSize: 13, fontWeight: "600" },
  itemPrice: { fontSize: 13, color: "#666", marginVertical: 4 },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  qtyText: { fontSize: 14, fontWeight: "600" },
  qtyValue: { marginHorizontal: 12, fontSize: 16 },

  removeText: { color: "red", fontSize: 14, marginLeft: 10 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  totalPrice: { fontSize: 18, fontWeight: "700" },
  checkoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default CartScreen;
