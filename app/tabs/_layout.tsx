import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import useAuthGuard from "../hooks/useAuthGuard";

function MiddleTabButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.middleButtonWrapper}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.middleButton}>
        <FontAwesome5 name="notes-medical" size={28} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  useAuthGuard();

  return (
    <Tabs
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#B0174C",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 70, // tinggi tab bar (default sekitar 50-60)
          paddingBottom: 10, // jarak bawah ikon/label ke bawah
          paddingTop: 10, // jarak atas (optional)
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === "mytreatment") {
            // Icon tidak dipakai di sini karena pakai custom button
            return null;
          }
          let iconName = "";
          switch (route.name) {
            case "home":
              iconName = "home";
              break;
            case "clinic":
              iconName = "map";
              break;
            case "consultation":
              iconName = "comment";
              break;
            case "account":
              iconName = "user-circle";
              break;
          }
          return (
            <FontAwesome5
              name={iconName}
              size={focused ? 26 : 20}
              color={color}
              solid={focused}
            />
          );
        },
        tabBarLabel: ({ focused, color }) => {
          if (route.name === "mytreatment") {
            return null;
          }
          return (
            <Text
              style={{
                color,
                fontSize: focused ? 13 : 11,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              {route.name === "consultation"
                ? "Chat"
                : route.name.charAt(0).toUpperCase() + route.name.slice(1)}
            </Text>
          );
        },
        tabBarButton: (props) => {
          if (route.name === "mytreatment") {
            return <MiddleTabButton onPress={props.onPress!} />;
          }
          return <TouchableOpacity {...props} />;
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="clinic" />
      <Tabs.Screen name="mytreatment" options={{ title: "" }} />
      <Tabs.Screen name="consultation" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  middleButtonWrapper: {
    position: "absolute",
    bottom: 5,
    left: "50%",
    transform: [{ translateX: -25 }], // 70 / 2
    zIndex: 10,
  },

  middleButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0174C",
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#B0174C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  tabBarStyle: {
    height: 70,
    paddingBottom: Platform.OS === "android" ? 10 : 20,
    paddingTop: 10,
    backgroundColor: "#fff",
    position: "absolute", // penting agar absolute tombol tengah tidak ketiban
    borderTopWidth: 0, // opsional
    elevation: 10,
  },
});
