import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SaldoPoint {
  saldo: number;
}

const SaldoPointCard: React.FC<SaldoPoint> = ({ saldo }) => {
  const formatRupiah = (number: number) =>
    "Rp " + number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <Pressable style={styles.card} onPress={() => router.push("/saldo")}>
      <View style={styles.item}>
        <Text style={styles.label}>Saldo</Text>
        <Text style={styles.value}>
          {saldo === undefined ? "Memuat..." : formatRupiah(saldo)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 10,
  },
  item: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default SaldoPointCard;
