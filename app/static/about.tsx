import React from "react";
import {
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HeaderWithBack from "../component/headerWithBack";

const AboutScreen = () => {
  const handleContactPress = () => {
    Linking.openURL("mailto:support@eudoraaesthetic.com");
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="About" useGoBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.appName}>EUDORA AESTHETIC</Text>
          <Text style={styles.version}>Version 1.0.1</Text>
          <Text style={styles.description}>
            EUDORA AESTHETIC is a modern skincare and aesthetic clinic app that helps you manage your beauty journey with ease and confidence.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌟 Key Features</Text>
          <Bullet>Book appointments with aesthetic professionals</Bullet>
          <Bullet>Access treatment and package history</Bullet>
          <Bullet>Secure chat with certified doctors and consultants</Bullet>
          <Bullet>Personalized skincare insights and notifications</Bullet>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🧑‍💻 Developer</Text>
          <Text style={styles.paragraph}>Eudora International Group</Text>

          <Text style={styles.sectionTitle}>📬 Contact</Text>
          <Text style={styles.link} onPress={handleContactPress}>
            support@eudoraaesthetic.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {Platform.OS === "ios" ? "Designed for iPhone & iPad" : "Optimized for Android Devices"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Bullet = ({ children }: any) => (
  <View style={styles.bulletContainer}>
    <Text style={styles.bulletIcon}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e1e1e",
    marginBottom: 6,
  },
  version: {
    fontSize: 14,
    color: "#888",
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2a2a2a",
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  bulletContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bulletIcon: {
    fontSize: 16,
    color: "#555",
    marginRight: 8,
  },
  bulletText: {
    fontSize: 16,
    color: "#555",
    flex: 1,
    lineHeight: 22,
  },
  link: {
    fontSize: 16,
    color: "#007bff",
    textDecorationLine: "underline",
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: "#aaa",
  },
});

export default AboutScreen;
