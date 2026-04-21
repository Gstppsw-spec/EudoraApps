import * as Updates from "expo-updates";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Text, View } from "react-native";

export default function PopUpUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setIsUpdating(true);

        Animated.timing(progressAnim, {
          toValue: 100,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();

        await Updates.fetchUpdateAsync();

        setTimeout(() => {
          Updates.reloadAsync();
        }, 1000);
      }
    } catch (e) {
      setIsUpdating(false);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={{ flex: 1 }}>
      {isUpdating && (
        <Modal transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.7)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 25,
                width: "90%",
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 15,
                  textAlign: "center",
                }}
              >
                Sedang Mengunduh Update...
              </Text>

              {/* Progress bar */}
              <View
                style={{
                  height: 10,
                  backgroundColor: "#eee",
                  borderRadius: 20,
                  overflow: "hidden",
                  marginBottom: 10,
                }}
              >
                <Animated.View
                  style={{
                    height: "100%",
                    width: progressWidth,
                    backgroundColor: "#ff5252",
                  }}
                />
              </View>

              <Text
                style={{ fontSize: 14, color: "#555", textAlign: "center" }}
              >
                Mohon tunggu, update sedang diunduh...
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
