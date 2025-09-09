import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import HeaderWithCart from "../component/headerWithCart";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const getTransactionsCustomerById = async ({ queryKey }: any) => {
  const [, customerId, token, id] = queryKey;
  const res = await fetch(
    `${apiUrl}/api/transactions/getTransactionsCustomerById/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token_customer: `${token}`,
        customerid: `${customerId}`,
      },
    }
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const postData = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/insertCustomerCart`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const canceledPayment = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/api/transactions/canceledPayment`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
        auth_token_customer: formData.token,
        customerid: formData.customerid,
      },
    }
  );
  return response.data;
};

const OrderDetail = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const customerDetails = useStore((state) => state.customerDetails);
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [
      "getTransactionsCustomer",
      customerId,
      customerDetails?.token,
      id,
    ],
    queryFn: getTransactionsCustomerById,
    enabled: !!customerId || customerDetails?.token || id,
  });

  const formatRupiah = (number: number) => {
    return "Rp " + number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      if (data?.status) {
        queryClient.invalidateQueries(["getCustomerCart", customerId]);
      } else {
        Toast.show({
          type: "error",
          text2: "Gagal menambahkan product ke keranjang!",
          position: "top",
          visibilityTime: 2000,
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Gagal menambahkan product ke keranjang!",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const onPayPendingPayment = async (invoice_url: any) => {
    if (invoice_url) {
      try {
        await WebBrowser.openBrowserAsync(invoice_url, {
          enableBarCollapsing: true,
          showTitle: true,
        });
        queryClient.invalidateQueries([
          "getTransactionsCustomer",
          customerId,
          customerDetails?.token,
        ]);
      } catch (e) {
        Toast.show({ type: "error", text1: "Gagal membuka invoice" });
      }
    }
  };

  const extractProductsFromTransaction = (transactionData: any) => {
    if (!transactionData || !transactionData.data.products) return [];

    const products: any[] = [];
    const excludedIds = new Set([2121, 2119, 2120]);

    transactionData.data.products.forEach((product: any) => {
      const typeId = Number(product.product_type_id);
      const prodId = Number(product.product_id);

      // Skip hanya kalau type=2 dan id ada di excludedIds
      const shouldSkip = typeId === 2 && excludedIds.has(prodId);

      if (!shouldSkip) {
        products.push({
          productid: prodId,
          producttypeid: typeId,
          qty: product.quantity || 1,
        });
      }
    });

    return products;
  };

  const handleReinsertToCart = () => {
    const productsToAdd = extractProductsFromTransaction(data);

    if (productsToAdd.length === 0) {
      Toast.show({
        type: "error",
        text2: "Tidak dapat di masukkan ke keranjang!",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    const mutations = productsToAdd.map((product: any) =>
      mutation.mutateAsync({
        productid: product.productid,
        producttypeid: product.producttypeid,
        customerid: customerId,
        qty: product.qty,
        token: customerDetails?.token,
      })
    );

    Promise.all(mutations)
      .then(() => {
        Toast.show({
          type: "success",
          text2: `${productsToAdd.length} produk berhasil ditambahkan ke keranjang`,
          position: "top",
          visibilityTime: 2000,
        });
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text2: "Gagal menambahkan product ke keranjang!",
          position: "top",
          visibilityTime: 2000,
        });
      });
  };

  const mutationCanceledPayment = useMutation({
    mutationFn: canceledPayment,
    onSuccess: (data) => {
      if (data?.status) {
        queryClient.invalidateQueries([
          "getTransactionsCustomer",
          customerId,
          customerDetails?.token,
        ]);
        Toast.show({
          type: "success",
          text2: "Berhasil membatalkan pemesanan!",
          position: "top",
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: "error",
          text2: "Gagal membatalkan pemesanan!",
          position: "top",
          visibilityTime: 2000,
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Gagal membatalkan pemesanan!",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const onCanceledPayment = (id: any) => {
    mutationCanceledPayment.mutate({
      id: id,
      customerid: customerId,
      token: customerDetails?.token,
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <HeaderWithCart title="Detail Transaction" useGoBack />
      <ScrollView style={styles.container}>
        <View
          style={[
            styles.statusBox,
            {
              backgroundColor:
                data?.data?.payment_status === 2
                  ? "#E8F5E9" // Hijau untuk selesai
                  : data?.data?.payment_status === 1
                  ? "#FFF3E0" // Orange untuk menunggu
                  : data?.data?.payment_status === 3
                  ? "#FFEBEE" // Merah untuk dibatalkan
                  : "#F5F5F5", // Default abu-abu
            },
          ]}
        >
          <Ionicons
            name={
              data?.data?.payment_status === 2
                ? "checkmark-circle-outline" // Selesai
                : data?.data?.payment_status === 1
                ? "time-outline" // Menunggu
                : data?.data?.payment_status === 3
                ? "close-circle-outline" // Dibatalkan
                : "alert-circle-outline" // Default
            }
            size={20}
            color={
              data?.data?.payment_status === 2
                ? "#4CAF50" // Hijau untuk selesai
                : data?.data?.payment_status === 1
                ? "#FF9800" // Orange untuk menunggu
                : data?.data?.payment_status === 3
                ? "#F44336" // Merah untuk dibatalkan
                : "#9E9E9E" // Default abu-abu
            }
          />
          <Text
            style={[
              styles.statusText,
              {
                color:
                  data?.data?.payment_status === 2
                    ? "#2E7D32" // Hijau gelap untuk selesai
                    : data?.data?.payment_status === 1
                    ? "#EF6C00" // Orange gelap untuk menunggu
                    : data?.data?.payment_status === 3
                    ? "#C62828" // Merah gelap untuk dibatalkan
                    : "#616161", // Default abu-abu gelap
              },
            ]}
          >
            {data?.data?.status}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Pesanan</Text>
          <Text>ID Pesanan: {data?.data?.invoiceno}</Text>
          <Text>Tanggal: {data?.data?.created_at}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produk</Text>
          <FlatList
            data={data?.data?.products}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Image
                  source={{ uri: item.product_image }}
                  style={styles.itemImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.product_name}</Text>
                  <Text>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {formatRupiah(item.unit_price)}
                </Text>
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Pembayaran</Text>
          {data?.data?.payment_status === 2 && (
            <View style={styles.paymentMethod}>
              <Text style={{ fontWeight: "bold" }}>Metode Pembayaran</Text>
              <Text style={{ fontWeight: "bold" }}>
                {data?.data?.payment_method}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text>Subtotal</Text>
            <Text>{formatRupiah(data?.data?.total_amount)}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalText}>Total Belanja</Text>
            <Text style={styles.totalText}>
              {formatRupiah(data?.data?.total_amount)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        {data?.data?.payment_status === 2 ||
        data?.data?.payment_status === 3 ||
        data?.data?.payment_status === 4 ? (
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => handleReinsertToCart()}
          >
            <Text style={styles.btnText}>Beli Lagi</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.btnSecondary}
              disabled={mutationCanceledPayment.isPending}
              onPress={() => onCanceledPayment(data?.data?.id)}
            >
              {mutationCanceledPayment.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Cancel</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnPrimary}
              disabled={mutation.isPending}
              onPress={() => onPayPendingPayment(data?.data?.invoice_url)}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Bayar</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff8e6",
  },
  statusText: { marginLeft: 8, color: "#FFA500", fontWeight: "bold" },
  section: {
    backgroundColor: "#fff",
    padding: 12,
    marginTop: 8,
  },
  sectionTitle: { fontWeight: "bold", marginBottom: 6 },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  itemImage: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
  itemName: { fontSize: 14, fontWeight: "600" },
  itemPrice: { fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  totalRow: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 6,
  },
  paymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    fontWeight: "bold",
  },
  totalText: { fontWeight: "bold" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  btnSecondary: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#666",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#FF6B81",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
