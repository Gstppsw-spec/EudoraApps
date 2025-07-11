import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from 'expo-constants';
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import HeaderWithBack from "../../app/component/headerWithBack";
import useStore from "../../store/useStore";

const apiUrl = Constants.expoConfig?.extra?.apiUrl

const fetchGeneralPoint = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const response = await fetch(
    `${apiUrl}/getDetailPointGeneral/${customerId}`
  );
  if (!response.ok) {
    throw new Error("Network error: " + response.statusText);
  }
  return response.json();
};

const fetchMedisPoint = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const response = await fetch(
    `${apiUrl}/getDetailPointMedis/${customerId}`
  );
  if (!response.ok) {
    throw new Error("Network error: " + response.statusText);
  }
  return response.json();
};

const fetchNonMedisPoint = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const response = await fetch(
    `${apiUrl}/getDetailPointNonMedis/${customerId}`
  );
  if (!response.ok) {
    throw new Error("Network error: " + response.statusText);
  }
  return response.json();
};

export default function PointsDetail() {
  const [activeTab, setActiveTab] = useState("normal");
  const customerId = useStore((state) => state.customerid);

  const {
    data: dataGeneralPoint,
    isLoading: isLoadingGeneralPoint,
    error: errorGeneralPoint,
    refetch: refetchGeneralPoint,
  } = useQuery({
    queryKey: ["getDetailPointGeneral", customerId],
    queryFn: fetchGeneralPoint,
    enabled: !!customerId,
  });

  const {
    data: dataMedisPoint,
    isLoading: isLoadingMedisPoint,
    error: errorMedisPoint,
    refetch: refetchMedisPoint,
  } = useQuery({
    queryKey: ["getDetailPointMedis", customerId],
    queryFn: fetchMedisPoint,
    enabled: !!customerId,
  });

  const {
    data: dataNonMedisPoint,
    isLoading: isLoadingNonMedisPoint,
    error: errorNonMedisPoint,
    refetch: refetchNonMedisPoint,
  } = useQuery({
    queryKey: ["getDetailPointNonMedis", customerId],
    queryFn: fetchNonMedisPoint,
    enabled: !!customerId,
  });

  const pointsData = {
    normal: dataGeneralPoint?.generalPoint ?? [],
    medis: dataMedisPoint?.medisPoint ?? [],
    nonMedis: dataNonMedisPoint?.nonMedisPoint ?? [],
  };

  console.log(pointsData);

  const renderPoints = () => {
    return pointsData[activeTab].map((item, index) => (
      <View key={index} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{item.DATETRANSACTION}</Text>
          <View style={styles.pointBadge}>
            {item.TOTAL > 0 ? (
              <Text style={styles.pointBadgeText}>
                + {parseInt(item.TOTAL).toLocaleString("id-ID")}
              </Text>
            ) : (
              <Text style={styles.pointBadgeTextMin}>
                - {parseInt(item.KREDIT).toLocaleString("id-ID")}
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.cardDescription}>{item.REMARKS}</Text>

        <View style={styles.divider} />

        <View style={styles.pointDetails}>
          <View style={styles.pointRow}>
            <Text style={styles.pointLabel}>SALDO AKHIR:</Text>
            <Text style={styles.pointValue}>
              {parseInt(item.SALDOAKHIR).toLocaleString("id-ID")}
            </Text>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <HeaderWithBack title="Riwayat Poin" backHref="/tabs/home" />
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {Object.keys(pointsData).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === "normal" ? "REGULER" : tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <ScrollView style={styles.content}>
            {pointsData[activeTab].length > 0 ? (
              renderPoints()
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome name="file-text-o" size={50} color="#E0E0E0" />
                <Text style={styles.emptyText}>Tidak ada riwayat poin</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  navContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  navButton: {
    padding: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFB900",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
  },
  activeTabText: {
    color: "#FFB900",
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 15,
  },
  content: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 14,
    color: "#666",
  },
  pointBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
   pointBadgeTextMin: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },
  pointDetails: {
    marginTop: 5,
  },
  pointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pointLabel: {
    fontSize: 14,
    color: "#666",
  },
  pointValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 15,
  },
});
