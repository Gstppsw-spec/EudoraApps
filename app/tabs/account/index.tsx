import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
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
  View
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import useStore from "../../../store/useStore";

const MyAccountScreen = () => {
  const router = useRouter();
  const clearCustomerId = useStore((state) => state.setCustomerId);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const lang = useStore((state) => state.lang);
  const setLang = useStore((state) => state.setLang);
  const customerDetails = useStore((state) => state.customerDetails);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileImage = useStore((state) => state.profileImage);

  const handleLogOut = () => {
    router.replace("/authentication/otpWhatsapp");
    setShowLogoutModal(false);
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "Sukses",
        text2: "Logout berhasil!",
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
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
            />
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
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.sectionItem}>
            {/* Your Treatment Section */}
            <Link href="/treatment/yourTeatment" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>My Treatment & Package</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

            <Link href="/mybooking/myBooking" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>My History</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>
          </View>

          <Link href="/notification" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Push Notification</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Language</Text>
              <Text style={styles.cacheSize}>
                {languages.find((langObj) => langObj.value === lang)?.label}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Clear Cache</Text>
              <Text style={styles.cacheSize}>88 MB</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.sectionItem}>
            {/* <Link href="/help-center" asChild> */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Help Center</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
            {/* </Link> */}

            <Link href="/static/privacy-policy" asChild>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuText}>Privacy & Policy</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

            <Link href="/static/about" asChild>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuText}>About</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

            {/* <Link href="/terms-and-conditions" asChild> */}
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Terms & Conditions</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => setShowLogoutModal(true)}
            >
              <Text style={styles.menuText}>Logout</Text>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Logout Confirmation</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                Are you sure you want to logout?
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogOut}
              >
                <Text style={styles.confirmButtonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginLeft: 10
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
  subSectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
    marginTop: 12,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    // borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  languageOptionSelected: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  menuTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  modalButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: "#f8f8f8",
  },
  confirmButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
});

export default MyAccountScreen;
