import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "../../../store/useStore";

const MyAccountScreen = () => {
  const router = useRouter();
  const setCustomerId = useStore((state) => state.setCustomerId);
  const setHasPin = useStore((state) => state.setHasPin);

  const handleLogOut = () => {
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
          </View>

          <View style={styles.sectionItem}>
            <Text style={styles.subSectionTitle}>Language</Text>

            <Link href="/notification" asChild style={styles.menuItem}>
              <TouchableOpacity>
                <Text style={styles.menuText}>Push Notification</Text>
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
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Help Center</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Privacy & Policy</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>About App</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>Terms & Conditions</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={handleLogOut}>
              <Text style={styles.menuText}>Logout</Text>
              {/* <MaterialIcons name="chevron-right" size={24} color="#999" /> */}
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
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
  menuTextContainer: {
    flexDirection: "row",
    alignItems: "center",
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

});

export default MyAccountScreen;
