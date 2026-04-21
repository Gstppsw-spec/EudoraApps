import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function MiddleTabButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.middleButtonWrapper}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.middleButton}>
        <FontAwesome5 name="notes-medical" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Calculate dynamic heights based on safe area
  const getTabBarHeight = () => {
    const baseHeight = Platform.OS === "ios" ? 85 : 70;
    return baseHeight + insets.bottom;
  };

  const getBottomPadding = () => {
    return Platform.OS === "ios" ? insets.bottom + 5 : insets.bottom + 8;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
        translucent={false}
      />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#B0174C",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: {
            ...styles.tabBarStyle,
            height: getTabBarHeight(),
            paddingBottom: getBottomPadding(),
            paddingTop: 10,
          },
          tabBarIcon: ({ color, focused }) => {
            if (route.name === "mytreatment") {
              return null;
            }
            let iconName = "";
            switch (route.name) {
              case "home":
                iconName = "home";
                break;
              case "clinic":
                iconName = "map-marker-alt";
                break;
              case "consultation":
                iconName = "comments";
                break;
              case "feeds":
                iconName = "newspaper";
                break;
            }
            return (
              <View style={styles.iconContainer}>
                <FontAwesome5
                  name={iconName}
                  size={focused ? 22 : 20}
                  color={color}
                  solid={focused}
                />
              </View>
            );
          },
          tabBarLabel: ({ focused, color }) => {
            if (route.name === "mytreatment") {
              return null;
            }

            let label = "";
            switch (route.name) {
              case "home":
                label = "Home";
                break;
              case "clinic":
                label = "Klinik";
                break;
              case "consultation":
                label = "Chat";
                break;
              case "feeds":
                label = "Feeds";
                break;
            }

            return (
              <Text
                style={[
                  styles.tabLabel,
                  { color },
                  focused && styles.tabLabelFocused,
                ]}
              >
                {label}
              </Text>
            );
          },
          tabBarButton: (props) => {
            if (route.name === "mytreatment") {
              return (
                <View style={styles.middleButtonContainer}>
                  <MiddleTabButton onPress={props.onPress!} />
                </View>
              );
            }
            return (
              <TouchableOpacity
                {...props}
                style={[props.style, styles.tabButton]}
              />
            );
          },
        })}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="clinic" />
        <Tabs.Screen name="mytreatment" options={{ title: "" }} />
        <Tabs.Screen name="consultation" />
        <Tabs.Screen name="feeds" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  middleButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  middleButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  middleButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0174C",
    width: 58,
    height: 58,
    borderRadius: 29,
    shadowColor: "#B0174C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: Platform.OS === "ios" ? 15 : 10,
  },
  tabBarStyle: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
    position: "relative",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  tabLabelFocused: {
    fontWeight: "700",
    fontSize: 11,
  },
});
