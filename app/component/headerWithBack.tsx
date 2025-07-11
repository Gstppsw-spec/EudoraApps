import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HeaderWithBack = ({ title, backHref, useGoBack = false }: any) => {
  const router = useRouter();

  const handleBack = () => {
    if (useGoBack) {
      router.back();
    } else {
      router.replace(backHref);
    }
  };
  return (
    <View style={styles.header}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: StatusBar.currentHeight,
    justifyContent: "space-between",
  },
  navContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    justifyContent: "space-between",
  },
  navButton: {
    padding: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: 30
  },
});

export default HeaderWithBack;
