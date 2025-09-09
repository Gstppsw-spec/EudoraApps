import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
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

const getTransactionsCustomer = async ({ queryKey }: any) => {
  const [, customerId, token] = queryKey;
  const res = await fetch(
    `${apiUrl}/api/transactions/getTransactionsCustomer`,
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

export default function TransactionHistory() {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const customerDetails = useStore((state) => state.customerDetails);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getTransactionsCustomer", customerId, customerDetails?.token],
    queryFn: getTransactionsCustomer,
    enabled: !!customerId || customerDetails?.token,
  });

  const formatRupiah = (number: number) => {
    return "Rp " + number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };


  const [filter, setFilter] = useState("Semua");

  const filters = ["Semua", "Menunggu Pembayaran", "Selesai", "Dibatalkan"];

  const filteredData =
    filter === "Semua"
      ? data?.data
      : data?.data.filter((item) => item.status === filter);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch()]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }

    setRefreshing(false);
  };

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

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/transaction/${item.id}`)}
    >
      <View style={styles.storeRow}>
        <Text style={styles.storeName}>{item.storeName}</Text>
        <Text style={[styles.status, getStatusColor(item.status)]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.productRow}>
        <Image
          source={{ uri: item.products[0].product_image }}
          style={styles.image}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.products[0].product_name}
          </Text>
          {item.products.length > 1 && (
            <Text style={styles.moreProducts}>
              +{item.products.length - 1} produk lainnya
            </Text>
          )}
          <Text style={styles.date}>{item.transaction_date}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.total}>{formatRupiah(item.total_amount)}</Text>
        {/* {item?.payment_status === 2 || item?.payment_status === 3 ? (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Beli Lagi</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onPayPendingPayment(item?.invoice_url)}
          >
            <Text style={styles.actionText}>Bayar</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <HeaderWithCart title="Transactions" useGoBack />
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{
            alignItems: "center",
          }}
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          automaticallyAdjustsScrollIndicatorInsets
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterButton,
                filter === f && styles.filterButtonActive,
              ]}
            >
              <View style={styles.filterContent}>
                <Ionicons
                  name={
                    f === "Semua"
                      ? "list"
                      : f === "Selesai"
                      ? "checkmark-done"
                      : "time"
                  }
                  size={16}
                  color={filter === f ? "#FF6B81" : "#666"}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterText,
                    filter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
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
              Tidak ada data tersedia
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case "Selesai":
      return { color: "green" };
    case "Menunggu Pembayaran":
      return { color: "orange" };
    case "Dibatalkan":
      return { color: "red" };
    default:
      return { color: "#333" };
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#fff",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  storeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productName: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  moreProducts: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  total: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  actionButton: {
    backgroundColor: "#FF6B81",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  filterRow: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  filterButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    backgroundColor: "#fff",
    height: 36,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  filterButtonActive: {
    borderColor: "#FF6B81",
    backgroundColor: "#eee",
  },

  filterContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  filterText: {
    fontSize: 14,
    lineHeight: 16,
    color: "#666",
  },

  filterTextActive: {
    fontWeight: "bold",
    color: "#FF6B81",
    lineHeight: 16,
  },

  badge: {
    backgroundColor: "#FF4D4F",
    borderRadius: 10,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
});
