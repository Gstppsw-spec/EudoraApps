import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";

const { width } = Dimensions.get("window");

const AnimatedToast = ({ visible, message, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current; // start posisi atas

  useEffect(() => {
    if (visible) {
      // slide down
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // auto hide
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          onHide && onHide();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    backgroundColor: "#B0174C",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 1000,
    maxWidth: width - 40,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AnimatedToast;
