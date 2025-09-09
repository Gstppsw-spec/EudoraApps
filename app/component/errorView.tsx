import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ 
  message = "Terjadi kesalahan saat mengambil data", 
  onRetry 
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
      <Text style={styles.title}>Ups!</Text>
      <Text style={styles.subtitle}>{message}</Text>

      {onRetry && (
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </Pressable>
      )}
    </View>
  );
};

export default ErrorView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    color: "#B91C1C",
  },
  subtitle: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
    marginTop: 6,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
