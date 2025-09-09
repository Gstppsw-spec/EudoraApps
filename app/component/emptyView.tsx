import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyViewProps {
  message?: string;
}

const EmptyView: React.FC<EmptyViewProps> = ({ message = "Tidak ada data tersedia" }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="folder-open-outline" size={60} color="#9CA3AF" />
      <Text style={styles.title}>Kosong</Text>
      <Text style={styles.subtitle}>{message}</Text>
    </View>
  );
};

export default EmptyView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    color: "#374151",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
  },
});
