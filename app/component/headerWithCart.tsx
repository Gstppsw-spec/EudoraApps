import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchCustomerCart = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getCustomerCart/${customerId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const HeaderWithCart = ({ title, backHref, useGoBack = false }: any) => {
  const router = useRouter();
  const customerId = useStore((state: { customerid: any }) => state.customerid);

  const handleBack = () => {
    if (useGoBack) {
      router.back();
    } else {
      router.replace(backHref);
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getCustomerCart", customerId],
    queryFn: fetchCustomerCart,
    enabled: !!customerId,
  });

  //   console.log(data);

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
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push("/cart")}
      >
        <Ionicons name="cart-outline" size={24} color="#000" />
        {data?.count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data?.count}</Text>
          </View>
        )}
      </TouchableOpacity>
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
  },
  cartButton: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 2,
    top: 2,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default HeaderWithCart;
