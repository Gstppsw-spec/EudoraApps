import HeaderWithBack from "@/app/component/headerWithBack";
import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const getCustomerBankAccount = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `${apiUrl}/api/transactions/getBankAccountByCustomerId/${customerId}`,
    {
      method: "GET",
    }
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const BankAccountScreen = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getBankAccountByCustomerId", customerId],
    queryFn: getCustomerBankAccount,
    enabled: !!customerId,
  });

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([refetch()]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    const isSelected = selectedBank === item.channel_name;
    return (
      <Pressable
        onPress={() => {
          setSelectedBank(item.channel_name);
          setSelectedBankAccount(item);
        }}
        style={({ pressed }) => [
          styles.listAccount,
          pressed && { opacity: 0.7 },
          isSelected && { borderColor: "#ff7eb3", borderWidth: 1 },
        ]}
      >
        <View>
          <Text style={styles.bankName}>{item?.channel_name}</Text>
          <Text style={styles.accountNumber}>{item?.account_number}</Text>
          <Text style={styles.accountHolder}>{item?.account_holder_name}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Penarikan Ke Rekening Bank" useGoBack />

      <FlatList
        data={data?.data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Penarikan</Text>
            <Text style={{ marginTop: 10 }}>Pilih akun bank tujuan</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <Pressable onPress={() => router.push("/saldo/add_bank_account")}>
            <View style={styles.addButton}>
              <Ionicons
                name="add-circle"
                size={20}
                style={{ marginLeft: 10 }}
              />
              <Text>Tambah akun</Text>
            </View>
          </Pressable>
        )}
      />
      <TouchableOpacity
        style={{ marginHorizontal: 16, marginBottom: 20 }}
        onPress={() =>
          router.push({
            pathname: "/saldo/withdraw",
            params: { ...selectedBankAccount },
          })
        }
        disabled={!selectedBank}
      >
        <LinearGradient
          colors={!selectedBank ? ["#ccc", "#aaa"] : ["#ff7eb3", "#ff2e63"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.payButton}
        >
          <Ionicons name="wallet-outline" size={20} color="#fff" />
          <Text style={styles.payButtonText}>Lanjut</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  payButton: {
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 10,
    marginLeft: 10,
    borderWidth: 1,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  listAccount: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  accountHolder: {
    fontSize: 13,
    color: "#666",
  },
});

export default BankAccountScreen;
