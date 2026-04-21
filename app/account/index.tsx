import SaldoPointCard from "@/app/component/saldoPoint";
import useStore from "@/store/useStore";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const sendTokenNotification = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/save_push_token`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

const getCustomerSaldo = async ({ queryKey }: any) => {
  const [, customerid, token] = queryKey;
  const res = await fetch(`${apiUrl}/api/transactions/getCustomerSaldo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      auth_token_customer: `${token}`,
      customerid: `${customerid}`,
    },
  });
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const MyAccountScreen = () => {
  const router = useRouter();
  const clearCustomerId = useStore((state) => state.setCustomerId);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const lang = useStore((state) => state.lang);
  const setLang = useStore((state) => state.setLang);
  const customerDetails = useStore((state) => state.customerDetails);
  const profileImage = useStore((state) => state.profileImage);
  const token = useStore((state) => state.token);
  const customerid = useStore((state) => state.customerid);
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["32%", "45%"], []);

  const handleShowLogout = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["getCustomerSaldo", customerid, customerDetails?.token],
    queryFn: getCustomerSaldo,
    enabled: !!customerid && !!customerDetails?.token,
  });

  const handleCancel = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const mutation = useMutation({
    mutationFn: sendTokenNotification,
    onSuccess: () => {
      router.replace("/authentication/otpWhatsapp");
      bottomSheetModalRef.current?.dismiss();
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: t("successTitle"),
          text2: t("logoutSuccess"),
          position: "top",
          visibilityTime: 2000,
        });
        clearCustomerId();
      }, 300);
    },
    onError: () => {
      setTimeout(() => {
        Toast.show({
          type: "error",
          text1: t("error"),
          text2: t("logoutFailed"),
          position: "top",
          visibilityTime: 2000,
        });
      }, 300);
    },
  });

  const handleLogOut = () => {
    if (customerid && token) {
      mutation.mutate({
        customerid: customerid,
        push_token: token,
        type: 0,
      });
    } else {
      router.replace("/authentication/otpWhatsapp");
      bottomSheetModalRef.current?.dismiss();
      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: t("successTitle"),
          text2: t("logoutSuccess"),
          position: "top",
          visibilityTime: 2000,
        });
        clearCustomerId();
      }, 300);
    }
  };

  const languages = [
    { label: "English", value: "en" },
    { label: "Bahasa Indonesia", value: "id" },
    { label: "中文 (Mandarin)", value: "zh" },
  ];

  const handleSelectLanguage = (lang: any) => {
    setLang(lang.value);
    setLanguageModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Profile" useGoBack />
      <Link href="/account/details" style={styles.profileSection}>
        <View style={styles.profileSectionContent}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="user" size={40} color="#4a90e2" />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {customerDetails?.fullname || "Guest"}
            </Text>
            <Text style={styles.email}>
              {customerDetails?.phone || "No phone"}
            </Text>
          </View>
          <View style={styles.chevronWrapper}>
            <MaterialIcons name="chevron-right" size={28} color="#4a90e2" />
          </View>
        </View>
      </Link>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SaldoPointCard saldo={data?.data} />
        <View style={[styles.card, styles.highlightCard]}>
          <Link href="/static/claimTreatment" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
              <View>
                <Text style={styles.highlightTitle}>
                  Klaim treatment gratis kamu!
                </Text>
                <Text style={styles.highlightDesc}>
                  Klaim treatment gratis karena sudah install Eudora Aesthetic
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        {/* General Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("general")}</Text>
          <Link href="/treatment/yourTeatment" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("treatmentAndPackage")}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <Link href="/mybooking/myBooking" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("myHistory")}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <Link href="/notification" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("pushNotification")}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>{t("language")}</Text>
              <Text style={styles.cacheSize}>
                {languages.find((langObj) => langObj.value === lang)?.label}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#bbb" />
          </TouchableOpacity>

          <Link href="/static/myRefferal" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("myReferral")}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <Link href="/transaction" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Transaksi</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <Link href="/validation-prepaid" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Validasi Pemotongan</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <Link href="/ereceipt-prepaid" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>E-Receipt Pemotongan</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>
        </View>
        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("about")}</Text>

          <Link href="/static/help-center" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("helpCenter")}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <Link href="/static/privacy-policy" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("privacyPolicy")}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <Link href="/static/about" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("about")}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <Link href="/static/term-conditions" asChild>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("termsConditions")}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#bbb" />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[
              styles.menuItem,
              { borderTopWidth: 1, borderTopColor: "#eee" },
            ]}
            activeOpacity={0.7}
            onPress={handleShowLogout}
          >
            <Text style={[styles.menuText, { color: "#e53935" }]}>
              {t("logout")}
            </Text>
            <MaterialIcons name="logout" size={24} color="#e53935" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={languageModalVisible}
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.value}
                style={[
                  styles.languageOption,
                  lang === language.value && styles.languageOptionSelected,
                ]}
                onPress={() => handleSelectLanguage(language)}
              >
                <Text style={styles.menuText}>{language.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ borderRadius: 20, backgroundColor: "#fff" }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={styles.modalContentSheet}>
          <Text style={styles.modalTitleSheet}>{t("logout")}</Text>
          <Text style={styles.modalMessage}>{t("confirmLogout")}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButtonSheet, { backgroundColor: "#eee" }]}
              onPress={handleCancel}
            >
              <Text style={styles.modalButtonText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButtonSheet, { backgroundColor: "#e53935" }]}
              onPress={handleLogOut}
            >
              <Text style={[styles.modalButtonText, { color: "white" }]}>
                {t("confirm")}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  profileSection: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  profileSectionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#4a90e2",
    marginRight: 16,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#4a90e2",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#777",
  },
  chevronWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  highlightTitle: { fontSize: 15, fontWeight: "bold", color: "#222" },
  highlightDesc: { fontSize: 12, color: "#555", marginTop: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  menuText: { fontSize: 15, color: "#333" },
  cacheSize: { fontSize: 13, color: "#888", marginLeft: 8 },
  menuTextContainer: { flexDirection: "row", alignItems: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 5,
  },
  languageOption: { padding: 12 },
  languageOptionSelected: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  modalContentSheet: { padding: 20, alignItems: "center" },
  modalTitleSheet: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButtonSheet: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: { fontSize: 14, fontWeight: "600" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#e0e0e0",
    paddingTop: StatusBar.currentHeight,
  },
});

export default MyAccountScreen;
