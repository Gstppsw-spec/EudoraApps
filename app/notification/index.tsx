import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "../../store/useStore";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchNotificationCustomer = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/get_user_notification/${customerId}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const readNotification = async (formData: any) => {
  console.log(formData);

  const response = await axios.post(
    `${apiUrl}/update_notification_read_status`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

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

const NotificationsScreen = () => {
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const queryClient = useQueryClient();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%", "50%"], []);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const { data, isLoading, error, isRefetching, refetch } = useQuery({
    queryKey: ["get_user_notification", customerId],
    queryFn: fetchNotificationCustomer,
    enabled: !!customerId,
  });

  const mutation = useMutation({
    mutationFn: readNotification,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["get_user_notification", customerId]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const mutationDeleted = useMutation({
    mutationFn: deletedNotification,
    onSuccess: (data) => {
      bottomSheetModalRef.current?.dismiss();
      queryClient.invalidateQueries(["get_user_notification", customerId]);
    },
    onError: (error) => {
      bottomSheetModalRef.current?.dismiss();
      console.log(error);
    },
  });

  const handleDetailNotification = (notification: any) => {
    if (notification.is_read == 0) {
      mutation.mutate({
        customer_id: customerId,
        broadcast_id: notification.broadcast_id,
      });
      router.push({
        pathname: "/notification/details",
        params: notification,
      });
    } else {
      router.push({
        pathname: "/notification/details",
        params: notification,
      });
    }
  };

  const confirmDeletedNotification = useCallback(() => {
    mutationDeleted.mutate({
      customer_id: customerId,
      broadcast_id: selectedNotification.broadcast_id,
    });
  }, [selectedNotification]);

  const handleLongPress = useCallback((notification: number) => {
    bottomSheetModalRef.current?.present();
    setSelectedNotification(notification);
  }, []);

  const handleCancel = () => {
    setSelectedNotification(null);
    bottomSheetModalRef.current?.dismiss();
  };

  const onRefresh = () => {
    refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="Notification" useGoBack />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <>
            <View style={styles.center}>
              <ActivityIndicator size="large" />
            </View>
          </>
        ) : error ? (
          <>
            <Text>Error..</Text>
          </>
        ) : data?.data?.length > 0 ? (
          data?.data?.map((notification: any) => {
            return (
              <TouchableOpacity
                onPress={() => handleDetailNotification(notification)}
                onLongPress={() => handleLongPress(notification)}
                style={[
                  styles.notificationItem,
                  notification.is_read === 0 && { backgroundColor: "#FFF4F4" },
                ]}
                key={notification.broadcast_id}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons name="notifications" size={24} color="#FFB900" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{notification.title}</Text>
                  <Text style={styles.message} numberOfLines={1}>
                    {notification.message}
                  </Text>
                  <Text style={styles.time}>{notification.sent_at}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            );
          })
        ) : (
          <>
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-circle-outline"
                size={60}
                color="#E0E0E0"
              />
              <Text style={styles.emptyTitle}>No Notification found</Text>
              <Text style={styles.emptySubtitle}>
                You don't have any notification yet
              </Text>
            </View>
          </>
        )}
      </ScrollView>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  scrollContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  notificationIcon: {
    backgroundColor: "#FFF8E6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#999999",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    // paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 8,
  },
  mainHeader: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: -50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  emptyTitle: {
    fontSize: 18,
    color: "#555",
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    zIndex: 1,
  },

  unreadTitle: {
    fontWeight: "bold",
    color: "#111827",
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
});

export default NotificationsScreen;
