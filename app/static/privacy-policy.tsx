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

const PrivacyPolicyScreen = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title={t("privacyPolicy")} useGoBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("privacyTitle")}</Text>
        <Text style={styles.subTitle}>{t("effectiveDate")}</Text>
        <Text style={styles.paragraph}>
          {t("intro")}
        </Text>

        <Text style={styles.sectionTitle}>{t("section1Title")}</Text>
        <Bullet>{t("section1Bullet1")}</Bullet>
        <Bullet>{t("section1Bullet2")}</Bullet>
        <Bullet>{t("section1Bullet3")}</Bullet>
        <Bullet>{t("section1Bullet4")}</Bullet>
        <Bullet>{t("section1Bullet5")}</Bullet>

        <Text style={styles.sectionTitle}>{t("section2Title")}</Text>
        <Bullet>{t("section2Bullet1")}</Bullet>
        <Bullet>{t("section2Bullet2")}</Bullet>
        <Bullet>{t("section2Bullet3")}</Bullet>
        <Bullet>{t("section2Bullet4")}</Bullet>
        <Bullet>{t("section2Bullet5")}</Bullet>

        <Text style={styles.sectionTitle}>{t("section3Title")}</Text>
        <Bullet>{t("section3Bullet1")}</Bullet>
        <Bullet>{t("section3Bullet2")}</Bullet>
        <Bullet>{t("section3Bullet3")}</Bullet>

        <Text style={styles.sectionTitle}>{t("section4Title")}</Text>
        <Bullet>{t("section4Bullet1")}</Bullet>
        <Bullet>{t("section4Bullet2")}</Bullet>
        <Bullet>{t("section4Bullet3")}</Bullet>

        <Text style={styles.sectionTitle}>{t("intro")}</Text>
        <Text style={styles.paragraph}>
          {t("intro")}
        </Text>

        <Text style={styles.sectionTitle}>{t("section5Title")}</Text>
        <Text style={styles.paragraph}>
          {t("section5Text")}
        </Text>

        <Text style={styles.sectionTitle}>{t("section6Title")}</Text>
        <Text style={styles.paragraph}>
          {t("section6Text")}
        </Text>
        <Text style={styles.sectionTitle}>{t("section8Title")}</Text>
        <Text style={styles.paragraph}>
          {t("section8Text")}
        </Text>
        <Text style={styles.sectionTitle}>{t("section7Title")}</Text>
        <Text style={styles.paragraph}>
          {t("section7Text")}
        </Text>
        <Text style={styles.link}>📧 admin@eudoraclinic.com</Text>
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

export default PrivacyPolicyScreen;
