// components/LoadingView.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-download-outline" size={60} color="#007AFF" />
      <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 16 }} />
      <Text style={styles.title}>Memuat data</Text>
      <Text style={styles.subtitle}>Mohon tunggu sebentar...</Text>
    </View>
  );
};

export default LoadingView; // ✅ ini yang wajib ada

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },
});
