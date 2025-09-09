import useStore from "@/store/useStore";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderWithCart from "../component/headerWithCart";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const getCategory = async ({ queryKey }: any) => {
  const [, customerId, token] = queryKey;
  const res = await fetch(`${apiUrl}/getListCategoryApps`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      auth_token_customer: `${token}`,
      customerid: `${customerId}`,
    },
  });
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const CategoryCard = ({ category }: any) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/category/${category.id}`)}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={category.icon} size={30} color="#B0174C" />
      </View>
      <Text style={styles.cardTitle}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const MoreScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const customerDetails = useStore((state) => state.customerDetails);

  const {
    data: category,
    isLoading: isLoadingcategory,
    refetch,
    isRefetching: isRefetchingcategory,
  } = useQuery({
    queryKey: ["getListCategoryApps", customerId, customerDetails?.token],
    queryFn: getCategory,
    enabled: !!customerId || customerDetails?.token,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithCart title="Eudora Services" useGoBack />
      <FlatList
        data={category?.listCategory}
        renderItem={({ item }) => <CategoryCard category={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Text style={{ fontSize: 16, color: "#999" }}>
              Tidak ada data tersedia
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    alignItems: "center",
    margin: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    backgroundColor: "#FDECEF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  serviceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  serviceName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  infoCard: {
    margin: 16,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFB900",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
});

export default MoreScreen;
