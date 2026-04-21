import HeaderWithBack from "@/app/component/headerWithBack";
import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import ConfirmModal from "./component/modal_confirmation";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const getPaymentChannel = async () => {
  const res = await fetch(`${apiUrl}/api/transactions/getPayoutChannel`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const addAccountBank = async (formData: any) => {
  const formDataObj = new FormData();
  formDataObj.append("account_holder_name", formData.account_holder_name);
  formDataObj.append("account_number", formData.account_number);
  formDataObj.append("channel_code", formData.channel_code);
  formDataObj.append("channel_name", formData.channel_name);
  formDataObj.append("customerid", formData.customerid);

  const response = await axios.post(
    `${apiUrl}/api/transactions/saveBankAccount`,
    formDataObj,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

const AddBankAccountScreen = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const [selectedBank, setSelectedBank] = useState("");
  const [channelCode, setChannelCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePresentBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const { data: dataPaymentChannel } = useQuery({
    queryKey: ["getPayoutChannel"],
    queryFn: getPaymentChannel,
  });

  const mutation = useMutation({
    mutationFn: addAccountBank,
    onSuccess: (data) => {
      if (data.status == "success") {
        Toast.show({
          type: "success",
          text2: data.message,
          position: "top",
          visibilityTime: 2000,
        });
        router.replace("/saldo/bank_account");
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
        text2: "Tambah akun gagal",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const saveBankAccount = () => {
    if (selectedBank && accountHolder && accountNumber && channelCode) {
      setShowConfirm(true);
    } else {
      Toast.show({
        type: "info",
        text2: "Data belum lengkap",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);

    mutation.mutate({
      account_holder_name: accountHolder,
      account_number: accountNumber,
      customerid: customerId,
      channel_code: channelCode,
      channel_name: selectedBank,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredChannels = dataPaymentChannel
    ?.filter(
      (item: any) => item.currency === "IDR" && item.channel_category === "BANK"
    )
    .filter((item: any) =>
      debouncedQuery
        ? item.channel_name.toLowerCase().includes(debouncedQuery.toLowerCase())
        : true
    );

  const renderItemLocation = ({ item }: any) => {
    const isSelected = selectedBank === item.channel_name;
    return (
      <TouchableOpacity
        style={[
          styles.clinicCard,
          isSelected && { borderColor: "#B0174C", borderWidth: 1 },
        ]}
        onPress={() => {
          setSelectedBank(item.channel_name);
          setChannelCode(item?.channel_code);
          bottomSheetModalRef.current?.dismiss();
        }}
      >
        <Ionicons
          name="business-outline"
          size={22}
          color="#B0174C"
          style={{ marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.clinicNameText}>{item?.channel_name}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color="#B0174C" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <HeaderWithBack title="Tambah Rekening" useGoBack />
        <View style={styles.body_add}>
          <Text style={styles.title_add}>
            Lengkapi informasi rekening bank Anda
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bank</Text>
            <Pressable
              style={styles.dropdownContainer}
              onPress={() => {
                handlePresentBottomSheet();
              }}
            >
              <Text style={styles.text}>{selectedBank || "Pilih Bank"}</Text>
              <Ionicons name="chevron-down" size={20} color="#64748b" />
            </Pressable>
          </View>

          <View style={styles.inputGroupOther}>
            <Text style={styles.labelOther}>Nama</Text>
            <TextInput
              style={styles.inputOther}
              value={accountHolder}
              placeholder="Ketik nama akun bank anda"
              onChangeText={(text) => setAccountHolder(text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor Rekening</Text>
            <TextInput
              keyboardType="number-pad"
              style={styles.input}
              value={accountNumber}
              placeholder="Masukkan nomor rekening anda"
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setAccountNumber(numericText);
              }}
            />
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={{ marginHorizontal: 16, marginBottom: 20 }}
            onPress={saveBankAccount}
            disabled={
              mutation.isPending ||
              !selectedBank ||
              !channelCode ||
              !accountHolder ||
              !accountNumber
            }
          >
            <LinearGradient
              colors={
                mutation.isPending ||
                !selectedBank ||
                !channelCode ||
                !accountHolder ||
                !accountNumber
                  ? ["#ccc", "#aaa"]
                  : ["#ff0844", "#ff2e63"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.payButton}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={20} color="#fff" />
                  <Text style={styles.payButtonText}>Tambah</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["50%", "90%"]}
          enablePanDownToClose
          keyboardBehavior="interactive"
          backgroundStyle={{ borderRadius: 20, backgroundColor: "#fff" }}
        >
          <BottomSheetFlatList
            data={filteredChannels}
            keyExtractor={(item: any) => String(item?.channel_code)}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 300 }}
            ListHeaderComponent={
              <View style={{ padding: 16, backgroundColor: "#fff" }}>
                <View
                  style={{
                    backgroundColor: "#e5e7eb",
                    borderRadius: 2,
                    alignSelf: "center",
                  }}
                />
                <Text style={styles.modalTitleSheet}>Pilih Bank</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari Bank..."
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
            renderItem={renderItemLocation}
          />
        </BottomSheetModal>

        <ConfirmModal
          visible={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
          bankName={selectedBank}
          accountHolder={accountHolder}
          accountNumber={accountNumber}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body_add: {
    margin: 15,
    flex: 1,
  },
  title_add: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputGroup: { marginVertical: 10 },
  inputGroupOther: { marginVertical: 10 },
  text: { color: "#1e293b", fontSize: 14, fontWeight: "700" },

  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  clinicCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  modalTitleSheet: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#111827",
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  clinicNameText: { fontSize: 15, fontWeight: "600", color: "#1f2937" },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8 },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontWeight: "700",
  },
  labelOther: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  inputOther: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontWeight: "700",
  },
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
});

export default AddBankAccountScreen;
