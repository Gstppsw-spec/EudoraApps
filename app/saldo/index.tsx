import useStore from "@/store/useStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

type HistoryItem = {
  id: number;
  description: string;
  amount: number;
  date: string;
  customername: string;
  status: string;
};

const getCustomerSaldo = async ({ queryKey }: any) => {
  const [, customerId, token] = queryKey;
  const res = await fetch(`${apiUrl}/api/transactions/getCustomerSaldo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      auth_token_customer: `${token}`,
      customerid: `${customerId}`,
    },
  });
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const getCustomerSaldoHistory = async ({ queryKey }: any) => {
  const [, customerId, token] = queryKey;
  const res = await fetch(
    `${apiUrl}/api/transactions/getCustomerSaldoHistory`,
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

const getCustomerWithdrawHistory = async ({ queryKey }: any) => {
  const [, customerId, token] = queryKey;
  const res = await fetch(
    `${apiUrl}/api/transactions/getCustomerWithdrawHistory`,
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

export default function SaldoScreen() {
  const [activeTab, setActiveTab] = useState<"masuk" | "keluar">("masuk");
  const [refreshing, setRefreshing] = useState(false);

  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const customerDetails = useStore((state) => state.customerDetails);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getCustomerSaldo", customerId, customerDetails?.token],
    queryFn: getCustomerSaldo,
    enabled: !!customerId || customerDetails?.token,
  });

  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ["getCustomerSaldoHistory", customerId, customerDetails?.token],
    queryFn: getCustomerSaldoHistory,
    enabled: !!customerId || customerDetails?.token,
  });

  const { data: withdraw } = useQuery({
    queryKey: [
      "getCustomerWithdrawHistory",
      customerId,
      customerDetails?.token,
    ],
    queryFn: getCustomerWithdrawHistory,
    enabled: !!customerId || customerDetails?.token,
  });

  const formatRupiah = (number: number) =>
    "Rp " + number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleTarikSaldo = () => {
    router.push("/saldo/bank_account")
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), refetchHistory()]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.desc} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        {activeTab === "masuk" && (
          <Text style={styles.date}>{item?.customername}</Text>
        )}
        {activeTab === "keluar" && (
          <Text style={styles.date}>{item?.status}</Text>
        )}
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={{ minWidth: 100, alignItems: "flex-end" }}>
        <Text
          style={[
            styles.amount,
            { color: activeTab === "masuk" ? "#4CAF50" : "#F44336" },
          ]}
        >
          {activeTab === "masuk" ? "+" : "-"} {formatRupiah(item.amount)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Detail Saldo" useGoBack />
      <View style={styles.card}>
        <View style={styles.item}>
          <Text style={styles.label}>Saldo</Text>
          <Text style={styles.value}>{isLoading ? "Memuat..." : formatRupiah(data?.data)}</Text>
        </View>
      </View>
      <View style={styles.withdrawContainer}>
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={handleTarikSaldo}
        >
          <Text style={styles.withdrawText}>Tarik Saldo</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "masuk" && styles.activeTab]}
          onPress={() => setActiveTab("masuk")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "masuk" && styles.activeTabText,
            ]}
          >
            Saldo Diterima
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "keluar" && styles.activeTab]}
          onPress={() => setActiveTab("keluar")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "keluar" && styles.activeTabText,
            ]}
          >
            Penarikan Saldo
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === "masuk" ? history?.data : withdraw?.data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <MaterialIcons name="history" size={60} color="#ccc" />
            <Text style={{ marginTop: 12, fontSize: 16, color: "#888" }}>
              Belum ada data
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  withdrawContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  withdrawButton: {
    backgroundColor: "#B0174C",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  withdrawText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  tabs: { flexDirection: "row", marginHorizontal: 16, marginBottom: 8 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: { borderBottomColor: "#B0174C" },
  tabText: { fontSize: 16, color: "#888" },
  activeTabText: { color: "#B0174C", fontWeight: "700" },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  desc: { fontSize: 14, fontWeight: "500", color: "#333" },
  date: { fontSize: 12, color: "#888", marginTop: 2 },
  amount: { fontSize: 14, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 10,
  },
  item: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
