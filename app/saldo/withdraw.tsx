import HeaderWithBack from "@/app/component/headerWithBack";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import useStore from "../../store/useStore";
import ConfirmModal from "./component/modal_confirmation";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

interface GetCustomerSaldoResponse {
  status: string;
  data: number;
}

const getCustomerSaldo = async ({
  queryKey,
}: {
  queryKey: [string, string, string];
}): Promise<GetCustomerSaldoResponse> => {
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

const saveWithdraw = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/api/transactions/createPayoutCustomer`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

interface WithdrawParams {
  account_number?: string;
  account_holder_name?: string;
}

const WithdrawScreen: React.FC = () => {
  const customerDetails = useStore((state: any) => state.customerDetails);
  const customerId = useStore((state: any) => state.customerid);
  const params = useLocalSearchParams<any>();
  const [value, setValue] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getCustomerSaldo", customerId, customerDetails?.token],
    queryFn: getCustomerSaldo,
    enabled: !!customerId && !!customerDetails?.token,
  });

  const balance = data?.data ?? 0;

  const formatRupiah = (num: string | number): string => {
    if (!num || isNaN(Number(num))) return "0";
    return Number(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    const amount = parseInt(numeric || "0", 10);
    const maxWithdraw = Math.max(balance, 0);

    if (amount > maxWithdraw) {
      setValue(maxWithdraw.toString());
    } else {
      setValue(numeric);
    }
  };

  const receivedAmount = Math.max(parseInt(value || "0", 10) - 2500, 0);

  const mutation = useMutation({
    mutationFn: saveWithdraw,
    onSuccess: (data) => {
      if (data.status == "success") {
        Toast.show({
          type: "success",
          text2: data.message,
          position: "top",
          visibilityTime: 2000,
        });
        router.replace("/saldo");
        queryClient.invalidateQueries([
          "getCustomerSaldo",
          customerId,
          customerDetails?.token,
        ]);
        queryClient.invalidateQueries([
          "getCustomerSaldoHistory",
          customerId,
          customerDetails?.token,
        ]);
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
        text2: "Gagal melakukan withdraw",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const saveWithdrawRequest = () => {
    if (params && value >= 100000) {
      setShowConfirm(true);
    } else if (!params || !value) {
      Toast.show({
        type: "info",
        text2: "Data belum lengkap",
        position: "top",
        visibilityTime: 2000,
      });
    } else if (value < 100000) {
      Toast.show({
        type: "info",
        text2: "Minimal penarikan adalah Rp 100.000",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    mutation.mutate({
      account_holder_name: params?.account_holder_name,
      account_number: params?.account_number,
      customer_id: customerId,
      channel_code: params?.channel_code,
      channel_name: params?.channel_name,
      amount: value,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <HeaderWithBack title="Penarikan Ke Rekening Bank" useGoBack />
        <View style={{ flex: 1, padding: 16, backgroundColor: "#f9f9f9" }}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Saldo tersedia</Text>
              <Text style={styles.balance}>Rp {formatRupiah(balance)}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.prefix}>Rp</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formatRupiah(value)}
                onChangeText={handleChange}
                placeholder="0"
              />
            </View>
            <Text style={styles.hint}>Minimal penarikan: Rp 100.000</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Nomor rekening</Text>
              <Text style={styles.account}>{params?.account_number}</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                editable={false}
                value={params?.account_holder_name || ""}
                placeholder="Nama pemilik rekening"
              />
            </View>
          </View>
        </View>

        <LinearGradient
          colors={["#ff7eb3", "#B0174C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalContainer}
        >
          <Text style={styles.totalLabel}>Anda akan menerima</Text>
          <Text style={styles.totalValue}>
            Rp {formatRupiah(receivedAmount)}
          </Text>
          <Text style={styles.totalLabel}>Biaya penarikan: Rp 2.500</Text>
        </LinearGradient>

        <TouchableOpacity
          onPress={saveWithdrawRequest}
          style={{ marginHorizontal: 16, marginBottom: 20 }}
        >
          <LinearGradient
            colors={["#ff7eb3", "#B0174C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.payButton}
          >
            <Ionicons name="wallet-outline" size={20} color="#fff" />
            <Text style={styles.payButtonText}>Lanjut</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Konfirmasi Penarikan"
        message="Apakah anda yakin ingin melakukan penarikan saldo ke rekening berikut?"
        bankName={params?.channel_name}
        accountHolder={params?.account_holder_name}
        accountNumber={params?.account_number}
        confirmText="Ya, Konfirmasi"
      />
    </SafeAreaView>
  );
};

export default WithdrawScreen;

// 🧱 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#777",
    fontWeight: "700",
  },
  balance: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c7a7b",
  },
  account: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
    height: 48,
  },
  prefix: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#444",
  },
  totalContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
  },
  totalLabel: { color: "#fff", fontSize: 12, fontWeight: "600" },
  totalValue: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 4 },
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
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: "#9CA3AF",
  },
});
