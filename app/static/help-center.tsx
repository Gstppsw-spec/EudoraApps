import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Import header
import HeaderWithBack from "../component/headerWithBack";

const HelpCenterScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const helpTopics = [
    {
      title: t("accountIssuesTitle"),
      icon: "account-circle",
      description: t("accountIssuesDesc"),
    },
    {
      title: t("bookingProblemsTitle"),
      icon: "calendar-today",
      description: t("bookingProblemsDesc"),
    },
    {
      title: t("treatmentInfoTitle"),
      icon: "healing",
      description: t("treatmentInfoDesc"),
    },
    {
      title: t("appTechnicalTitle"),
      icon: "smartphone",
      description: t("appTechnicalDesc"),
    },
    {
      title: t("contactSupportTitle"),
      icon: "contact-support",
      description: t("contactSupportDesc"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderWithBack title={t("helpCenter")} useGoBack />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Daftar topik */}
        <View style={styles.topicsContainer}>
          {helpTopics.map((topic, index) => (
            <View style={styles.topicCard} key={index}>
              <MaterialIcons
                name={topic.icon}
                size={24}
                color="#B0174C"
                style={styles.icon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>{t("needMoreHelp")}</Text>
          <Text style={styles.contactText}>{t("contactUs")}</Text>
          <Text style={styles.contactEmail}>admin@eudoraclinic.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  content: { padding: 20, paddingBottom: 40 },
  subheader: { fontSize: 16, color: "#666", marginBottom: 30 },
  topicsContainer: { marginBottom: 30 },
  topicCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: { marginRight: 16, marginTop: 2 },
  topicTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  topicDescription: { fontSize: 14, color: "#666", marginTop: 4 },
  contactContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  contactText: { fontSize: 14, color: "#666", marginBottom: 8 },
  contactEmail: {
    fontSize: 16,
    color: "#B0174C",
    fontWeight: "500",
    marginBottom: 4,
  },
  contactPhone: { fontSize: 16, color: "#B0174C", fontWeight: "500" },
});

export default HelpCenterScreen;
