import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useStore from "../../store/useStore";
import HeaderWithBack from "../component/headerWithBack";
const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const deletedNotification = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/update_notification_deleted_status`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const NotificationDetail = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const customerId = useStore((state: { customerid: any }) => state.customerid);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%", "50%"], []);

  const mutationDeleted = useMutation({
    mutationFn: deletedNotification,
    onSuccess: (data) => {
      bottomSheetModalRef.current?.dismiss();
      queryClient.invalidateQueries(["get_user_notification", customerId]);
      router.back();
    },
    onError: (error) => {
      bottomSheetModalRef.current?.dismiss();
    },
  });

  const {
    title,
    sent_at,
    message,
    description,
    id,
    image_url,
    setNotifications: setNotificationsString,
  } = params;

  console.log(image_url);
  

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const confirmDeletedNotification = useCallback(() => {
    mutationDeleted.mutate({
      customer_id: customerId,
      broadcast_id: params.broadcast_id,
    });
  }, [params]);

  const handleDelete = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCancel = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <HeaderWithBack title="Detail Nofitication" useGoBack />
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ transform: [{ scale: scaleAnim }] }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={32} color="#B0174C" />
            </View>

            <Text style={styles.title}>{title}</Text>

            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="#ffffffff" />
              <Text style={styles.time}>{sent_at}</Text>
            </View>

            {image_url ? (
              <Image
                source={{ uri: `${apiUrl}/${image_url}` }}
                style={styles.image}
                contentFit="cover"
              />
            ) : null}

            <View style={styles.divider} />

            <Text style={styles.message}>{title}</Text>

            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{message}</Text>
            </View>
          </View>
        </Animated.ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Delete Notification</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ borderRadius: 20, backgroundColor: "#fff" }}
      >
        <BottomSheetView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Deleted Notification</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete notification?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={handleCancel}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#f87171" }]}
              onPress={confirmDeletedNotification}
            >
              <Text style={[styles.modalButtonText, { color: "white" }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  iconContainer: {
    alignSelf: "center",
    backgroundColor: "#ffffffff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  time: {
    fontSize: 14,
    color: "#888888",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 20,
  },
  message: {
    fontSize: 16,
    color: "#444444",
    marginBottom: 20,
    lineHeight: 24,
  },
  descriptionContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 15,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  image: {
  width: "100%",
  height: 180,
  borderRadius: 12,
  marginBottom: 20,
},

});

export default NotificationDetail;