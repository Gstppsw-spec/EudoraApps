import React from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import HeaderWithBack from "../component/headerWithBack";

const TermsAndConditionsScreen = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title={t("terms.titleHeader")} useGoBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("terms.title")}</Text>
        <Text style={styles.subTitle}>{t("terms.effectiveDate")}</Text>

        <Text style={styles.sectionTitle}>{t("terms.section1Title")}</Text>
        <Text style={styles.paragraph}>{t("terms.section1Content")}</Text>

        <Text style={styles.sectionTitle}>{t("terms.section2Title")}</Text>
        <Bullet>{t("terms.section2Bullet1")}</Bullet>
        <Bullet>{t("terms.section2Bullet2")}</Bullet>

        <Text style={styles.sectionTitle}>{t("terms.section3Title")}</Text>
        <Bullet>{t("terms.section3Bullet1")}</Bullet>
        <Bullet>{t("terms.section3Bullet2")}</Bullet>
        <Bullet>{t("terms.section3Bullet3")}</Bullet>

        <Text style={styles.sectionTitle}>{t("terms.section4Title")}</Text>
        <Bullet>{t("terms.section4Bullet1")}</Bullet>
        <Bullet>{t("terms.section4Bullet2")}</Bullet>
        <Bullet>{t("terms.section4Bullet3")}</Bullet>
        <Bullet>{t("terms.section4Bullet4")}</Bullet>

        <Text style={styles.sectionTitle}>{t("terms.section5Title")}</Text>
        <Bullet>{t("terms.section5Bullet1")}</Bullet>
        <Bullet>{t("terms.section5Bullet2")}</Bullet>

        <Text style={styles.sectionTitle}>{t("terms.section6Title")}</Text>
        <Text style={styles.paragraph}>{t("terms.section6Content")}</Text>

        <Text style={styles.sectionTitle}>{t("terms.section7Title")}</Text>
        <Text style={styles.paragraph}>{t("terms.section7Content")}</Text>
        <Text style={styles.link}>{t("terms.contactEmail")}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Bullet = ({ children }) => (
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color: "#1e1e1e",
  },
  subTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#2a2a2a",
  },
  paragraph: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
    marginBottom: 10,
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
    marginTop: 4,
  },
});

export default TermsAndConditionsScreen;
