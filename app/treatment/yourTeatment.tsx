import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const YourTreatmentScreen = () => {
  const treatments = [
    {
      invoiceNo: "THOF2504047",
      treatment: "SD STUCTURE LIFT FACIAL TRIAL",
      total: 1,
      used: 0,
      exchange: 0,
      remaining: 1,
      status: "Ready",
    },
    {
      invoiceNo: "THOF2504046",
      treatment: "EXOSOME HAIR VITAL BOOST TRIAL",
      total: 1,
      used: 0,
      exchange: 0,
      remaining: 1,
      status: "Ready",
    },
    {
      invoiceNo: "THOF2504045",
      treatment: "3 IN 1 RADIO FREQUENCY & SUCTION TRIAL",
      total: 1,
      used: 0,
      exchange: 0,
      remaining: 1,
      status: "Ready",
    },
    {
      invoiceNo: "THOF2504044",
      treatment: "EXOSOME HAIR VITAL BOOST TRIAL",
      total: 1,
      used: 0,
      exchange: 0,
      remaining: 1,
      status: "Ready",
    },
    {
      invoiceNo: "THOF2504043",
      treatment: "EXOSOME HAIR VITAL BOOST TRIAL",
      total: 1,
      used: 0,
      exchange: 0,
      remaining: 1,
      status: "Ready",
    },
    {
      invoiceNo: "THOF2504042",
      treatment: "INFUSION CHROMOSOME TRIAL",
      total: 1,
      used: 0,
      exchange: 0,
      remaining: 1,
      status: "Ready",
    },
  ];

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Invoice No:</Text>
        <Text style={styles.value}>{item.invoiceNo}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Treatment:</Text>
        <Text style={[styles.value, styles.treatment]}>{item.treatment}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>{item.total}</Text>
        </View>

        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Used</Text>
          <Text style={styles.detailValue}>{item.used}</Text>
        </View>

        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Exchange</Text>
          <Text style={styles.detailValue}>{item.exchange}</Text>
        </View>

        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Remaining</Text>
          <Text style={styles.detailValue}>{item.remaining}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            item.status === "Ready" ? styles.readyStatus : styles.usedStatus,
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );
  const [mode, setMode] = useState<"treatment" | "package">("treatment");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.mainHeader}>My Treatment</Text>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === "treatment" && styles.activeTab]}
          onPress={() => {
            setMode("treatment");
          }}
        >
          <Text
            style={[
              styles.tabText,
              mode === "treatment" && styles.activeTabText,
            ]}
          >
            Treatment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === "package" && styles.activeTab]}
          onPress={() => {
            setMode("package");
          }}
        >
          <Text
            style={[styles.tabText, mode === "package" && styles.activeTabText]}
          >
            Package
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={treatments}
        renderItem={renderItem}
        keyExtractor={(item) => item.invoiceNo}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  // header: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginBottom: 20,
  //   color: '#333',
  //   textAlign: 'center',
  // },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFB900",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FFB900",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    width: 90,
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#333",
  },
  treatment: {
    fontWeight: "500",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8,
  },
  detailColumn: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusContainer: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  statusText: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  readyStatus: {
    backgroundColor: "#e0f7fa",
    color: "#00acc1",
  },
  usedStatus: {
    backgroundColor: "#ffebee",
    color: "#f44336",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 8,
  },
  mainHeader: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: -50,
  },
});

export default YourTreatmentScreen;
