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
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24;

export default function HeaderActions({ scrollY }: { scrollY?: any }) {
  const router = useRouter();
  const customerId = useStore((state: { customerid: any }) => state.customerid);

  const { data: notification } = useQuery({
    queryKey: ["get_user_notification_not_read", customerId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const res = await fetch(`${apiUrl}/get_user_notification_not_read/${id}`);
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
    enabled: !!customerId,
  });

  const { data: cart } = useQuery({
    queryKey: ["getCustomerCart", customerId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const res = await fetch(`${apiUrl}/getCustomerCart/${id}`);
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
    enabled: !!customerId,
  });

  return (
    <BlurView intensity={50} tint="dark" style={styles.headerContainer}>
      <View style={styles.searchWrapper}>
        <FontAwesome
          name="search"
          size={16}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search products"
          placeholderTextColor="rgba(255,255,255,0.7)"
          style={styles.input}
        />
        <TouchableOpacity>
          <FontAwesome name="filter" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.iconsWrapper}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.push("/notification")}
        >
          <FontAwesome name="bell" size={20} color="#fff" />
          {notification?.count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notification.count}</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[styles.iconButton, { marginLeft: 12 }]}
          onPress={() => router.push("/cart")}
        >
          <FontAwesome name="shopping-cart" size={20} color="#fff" />
          {cart?.count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.count}</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[styles.iconButton, { marginLeft: 12 }]}
          onPress={() => router.push("/account")}
        >
          <FontAwesome name="user-circle" size={20} color="#fff" />
        </Pressable>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.4)", // fallback blur
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    letterSpacing: 1,
  },
  iconsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
