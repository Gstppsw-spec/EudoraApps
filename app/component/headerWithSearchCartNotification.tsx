import useStore from "@/store/useStore";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchNotificationCustomerNotRead = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `${apiUrl}/get_user_notification_not_read/${customerId}`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchCustomerCart = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getCustomerCart/${customerId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

export default function HeaderActions() {
  const router = useRouter();
  const customerId = useStore((state: { customerid: any }) => state.customerid);

  const { data: notification, refetch: refetchNotification } = useQuery({
    queryKey: ["get_user_notification_not_read", customerId],
    queryFn: fetchNotificationCustomerNotRead,
    enabled: !!customerId,
  });
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getCustomerCart", customerId],
    queryFn: fetchCustomerCart,
    enabled: !!customerId,
  });

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 10,
        alignItems: "center",
        width: "100%",
      }}
    >
      <BlurView intensity={30} tint="dark" style={styles.searchContainer}>
        <FontAwesome name="search" size={15} color="#fff" style={styles.icon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="white"
          style={styles.input}
        />
        <TouchableOpacity>
          <FontAwesome name="filter" size={15} color="#fff" />
        </TouchableOpacity>
      </BlurView>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.push("/notification")}
        >
          <FontAwesome name="bell" size={15} color="white" />
          {notification?.count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notification?.count}</Text>
            </View>
          )}
        </Pressable>
        <Pressable
          style={[styles.iconButton, { marginLeft: 8 }]}
          onPress={() => router.push("/cart")}
        >
          <FontAwesome name="shopping-cart" size={15} color="white" />
          {data?.count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data?.count}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.15)",
    width: "70%",
    paddingHorizontal: 13,
    paddingVertical: Platform.OS === "ios" ? 12 : 0,
    borderRadius: 12,
    borderWidth: 1,
    gap: 2,
    marginLeft: 10,
    alignSelf: "center",
    overflow: "hidden",
  },
  icon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 14,
    letterSpacing: 4,
  },
  iconButton: {
    borderColor: "#272835",
    borderWidth: 0.1,
    borderRadius: 100,
    padding: 14,
    backgroundColor: "#272835",
    marginRight: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    right: 1,
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
