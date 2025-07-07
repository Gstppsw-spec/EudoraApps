import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "../../../store/useStore";

const MyAccountScreen = () => {
  const router = useRouter();
  const setCustomerId = useStore((state) => state.setCustomerId);
  const setHasPin = useStore((state) => state.setHasPin);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogOut = () => {
    setShowLogoutModal(false);
    setCustomerId(null);
    setHasPin(false);
    router.replace("/authentication/otpWhatsapp");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <Link href="/tabs/account/details" style={styles.profileSection}>
        <View style={styles.profileSectionContent}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Aaron Ramsdale</Text>
            <Text style={styles.email}>aaronramsdale@gmail.com</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </View>
      </Link>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Info Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Info</Text>

          <View style={styles.sectionItem}>
            <Text style={styles.subSectionTitle}>Personal Data</Text>
            <View style={styles.menuItem}>
              <Text style={styles.menuText}>General</Text>
              {/* No arrow for General */}
            </View>

            {/* Your Treatment Section */}
            <Link href="/treatment/yourTeatment" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Your Treatment</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.sectionItem}>
            <Text style={styles.subSectionTitle}>Language</Text>
            <Link href="/notification" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuText}>Push Notification</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Clear Cache</Text>
                <Text style={styles.cacheSize}>88 MB</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.sectionItem}>
            <Link href="/tabs/account/helpcenter" asChild>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuText}>Help Center</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

            <Link href="/tabs/account/PrivacyPolicy" asChild>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuText}>Privacy & Policy</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

            <Link href="/tabs/account/about" asChild>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <Text style={styles.menuText}>About App</Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </Link>

         

            <TouchableOpacity 
              style={styles.menuItem} 
              activeOpacity={0.7} 
              onPress={() => setShowLogoutModal(true)}
            >
              <Text style={[styles.menuText, { color: '#ff4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
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
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>
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
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#f8f8f8',
  },
  confirmButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyAccountScreen;