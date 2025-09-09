import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function PopUpModal({ status }: any) {
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const checkFirstOpen = async () => {
      if (status === undefined || status === null) return;
      await AsyncStorage.removeItem("appAlreadyOpened");
      const opened = await AsyncStorage.getItem("appAlreadyOpened");
      if (!opened && imageLoaded) {
        setShowModal(true);
        await AsyncStorage.setItem("appAlreadyOpened", "true");
      }
    };
    checkFirstOpen();
  }, [status, imageLoaded]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../../assets/images/promoNewCustomer.jpg")}
        style={{ width: 1, height: 1, position: "absolute", opacity: 0 }}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => console.log("Error loading image", e.nativeEvent)}
      />

      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <View
            style={{
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              elevation: 5,
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Tombol Close */}
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 75,
                right: 4,
                backgroundColor: "#ff4d4d",
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
              >
                ×
              </Text>
            </TouchableOpacity>

            {/* Klik gambar untuk redirect */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                status === 0
                  ? router.push(`/category/10`)
                  : router.push("/static/shareRefferal");

                setShowModal(false);
              }}
            >
              <Image
                source={
                  status === 1
                    ? require("../../assets/images/eudoratokorea.png")
                    : require("../../assets/images/skunewcustomeroffer.png")
                }
                style={{
                  width: screenWidth * 0.85,
                  maxHeight: screenHeight * 0.7,
                  resizeMode: "contain",
                  borderRadius: 16,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
