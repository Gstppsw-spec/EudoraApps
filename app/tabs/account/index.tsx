import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
// import { SafeAreaView } from "react-native-safe-area-context";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import useStore from "../../../store/useStore";
import { useTranslation } from "react-i18next"; // Include this for translation

const MyAccountScreen = () => {
  const router = useRouter();
  const clearCustomerId = useStore((state) => state.setCustomerId);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const lang = useStore((state) => state.lang);
  const setLang = useStore((state) => state.setLang);
  const customerDetails = useStore((state) => state.customerDetails);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileImage = useStore((state) => state.profileImage);

  // Use the translation hook
  const { t } = useTranslation();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%", "50%"], []);

  const handleShowLogout = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCancel = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleLogOut = () => {
    router.replace("/authentication/otpWhatsapp");
    bottomSheetModalRef.current?.dismiss();
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: t("successTitle"),
        text2: t("logoutSuccess"), // This should be defined in your translation files
        position: "top",
        visibilityTime: 2000,
      });

      clearCustomerId();
    }, 300);
  };

  const languages = [
    { label: "English", value: "en" },
    { label: "Bahasa Indonesia", value: "id" },
    { label: "中文 (Mandarin)", value: "zh" },
  ];

  const handleSelectLanguage = (lang) => {
    setLang(lang.value);  
    setLanguageModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <Link href="/tabs/account/details" style={styles.profileSection}>
        <View style={styles.profileSectionContent}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="user" size={35} color="#aaa" />
            </View>
          )}

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{customerDetails?.fullname}</Text>
            <Text style={styles.email}>{customerDetails?.phone}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </View>
      </Link>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Info Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("general")}</Text> {/* Translation for "General" */}
          <View style={styles.sectionItem}>
            {/* Your Treatment Section */}
            <Link href="/treatment/yourTeatment" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>{t("treatmentAndPackage")}</Text> {/* Translated text for "My Treatment & Package" */}
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

            <Link href="/mybooking/myBooking" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>{t("myHistory")}</Text> {/* Translated text for "My History" */}
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>
          </View>

          <Link href="/notification" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>{t("pushNotification")}</Text> {/* Translated text for "Push Notification" */}
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>{t("language")}</Text> {/* Translation for "Language" */}
              <Text style={styles.cacheSize}>
                {languages.find((langObj) => langObj.value === lang)?.label}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>{t("clearCache")}</Text> {/* Translation for "Clear Cache" */}
              <Text style={styles.cacheSize}>88 MB</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("about")}</Text> {/* Translation for "About" */}

          <View style={styles.sectionItem}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("helpCenter")}</Text> {/* Translated text for "Help Center" */}
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <Link href="/static/privacy-policy" asChild>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuText}>{t("privacyPolicy")}</Text> {/* Translated text for "Privacy & Policy" */}
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

            <Link href="/static/about" asChild>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuText}>{t("about")}</Text> {/* Translated text for "About" */}
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>{t("termsConditions")}</Text> {/* Translated text for "Terms & Conditions" */}
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleShowLogout()}
            >
              <Text style={styles.menuText}>{t("logout")}</Text> {/* Translated text for "Logout" */}
            </TouchableOpacity>
          </View>
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
      >
        <BottomSheetView style={styles.modalContentSheet}>
          <Text style={styles.modalTitleSheet}>{t("logout")}</Text> {/* Translated text for "Logout" */}
          <Text style={styles.modalMessage}>
            {t("confirmLogout")} {/* Translated text for confirmation message */}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={handleCancel}
            >
              <Text style={styles.modalButtonText}>{t("cancel")}</Text> {/* Translated text for "Cancel" */}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButtonSheet, { backgroundColor: "#f87171" }]}
              onPress={handleLogOut}
            >
              <Text style={[styles.modalButtonText, { color: "white" }]}>
                {t("confirm")} {/* Translated text for "Confirm" */}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  profileSection: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: StatusBar.currentHeight,
  },
  profileSectionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#333",
    paddingVertical: 12,
  },
  sectionItem: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  cacheSize: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  languageOption: {
    padding: 12,
    borderBottomColor: "#eee",
  },
  languageOptionSelected: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  modalContentSheet: {
    padding: 20,
    alignItems: "center",
  },
  modalTitleSheet: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MyAccountScreen;