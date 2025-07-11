import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import useStore from "../../store/useStore";
import HeaderWithBack from "../component/headerWithBack";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchListBooking = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getListBooking/${customerId}/1`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchListBookingCompleted = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getListBooking/${customerId}/3`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchListBookingCanceled = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getListBooking/${customerId}/2`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const canceledBooking = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/canceledBooking`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const MyBookingUpcoming = () => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const queryClient = useQueryClient();
  const [switchStates, setSwitchStates] = useState<boolean[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<"upcoming" | "completed" | "canceled">(
    "upcoming"
  );
  const { addReminder, removeReminder } = useStore();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%", "50%"], []);

  const handlePresentModalPress = useCallback((bookingId: number) => {
    setCurrentBooking(bookingId);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCancel = () => {
    setCurrentBooking(null);
    bottomSheetModalRef.current?.dismiss();
  };


  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["getListBooking", customerId],
    queryFn: fetchListBooking,
    enabled: !!customerId,
  });

  const {
    data: dataCompleted,
    isLoading: isLoadingCompeletd,
    error: errorCompleted,
    refetch: refetchCompleted,
    isRefetching: isRefetchingCompleted,
  } = useQuery({
    queryKey: ["getListBooking2", customerId],
    queryFn: fetchListBookingCompleted,
    enabled: !!customerId,
  });

  const {
    data: dataCanceled,
    isLoading: isLoadingCanceled,
    error: errorCanceled,
    refetch: refetchCanceled,
    isRefetching: isRefetchingCanceled,
  } = useQuery({
    queryKey: ["getListBooking3", customerId],
    queryFn: fetchListBookingCanceled,
    enabled: !!customerId,
  });

  const mutation = useMutation({
    mutationFn: canceledBooking,
    onSuccess: (data) => {
      removeReminder(currentBooking);
      setCurrentBooking(null);
      bottomSheetModalRef.current?.dismiss();
      Toast.show({
        type: "success",
        text2: "Appointment berhsil dicancel!",
        position: "top",
        visibilityTime: 2000,
      });
      queryClient.invalidateQueries(["getListBooking", customerId]);

    },
    onError: (error) => {
      setCurrentBooking(null);
      bottomSheetModalRef.current?.dismiss();
      Toast.show({
        type: "error",
        text2: "Appointment gagal dicancel!",
        position: "top",
        visibilityTime: 2000,
      });
      console.error("Error posting data:", error);
    },
  });

  useEffect(() => {
    if (!data?.customerbooking) return;
    const { isReminderActive } = useStore.getState();
    const newSwitchStates = data.customerbooking.map((booking) =>
      isReminderActive(booking.BOOKINGID)
    );
    setSwitchStates(newSwitchStates);
  }, [data]);

  const toggleSwitch = (index: number) => {
    if (!data?.customerbooking) return;

    const booking = data.customerbooking[index];
    const wasEnabled = switchStates[index];
    const willBeEnabled = !wasEnabled;
    setSwitchStates((prevState) => {
      const updated = [...prevState];
      updated[index] = willBeEnabled;

      return updated;
    });
    if (willBeEnabled) {
      const dateOnly = new Date(booking.TREATMENTDATE.split(" ")[0]);
      dateOnly.setHours(0, 0, 0, 0);
      const bookingDateTime = new Date(
        booking.TREATMENTDATE.replace(" ", "T").split("T")[0] +
          "T" +
          booking.TIME +
          ":00"
      );
      const twoHoursBefore = new Date(
        bookingDateTime.getTime() - 2 * 60 * 60 * 1000
      );

      const now = new Date();
      if (dateOnly > now) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Hari ini kamu ada booking!",
            body: `${booking.SERVICE} di ${booking.LOCATIONNAME}`,
            sound: true,
          },
          trigger: { type: "date", date: dateOnly },
        });
      }

      if (twoHoursBefore > now) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Kamu ada appointment 2 jam lagi!",
            body: `${booking.SERVICE} jam ${booking.TIME} di ${booking.LOCATIONNAME}`,
            sound: true,
          },
          trigger: { type: "date", date: twoHoursBefore },
        });
      }

      addReminder(booking.BOOKINGID);
    } else {
      removeReminder(booking.BOOKINGID);
    }
  };

  const confirmCanceledBooking = () => {
    mutation.mutate({
      bookingId: currentBooking,
    });
  };

  const onRefresh = () => {
    refetch();
    refetchCompleted();
    refetchCanceled();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBack title="History Treatment" useGoBack />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === "upcoming" && styles.activeTab]}
          onPress={() => {
            setMode("upcoming");
          }}
        >
          <Text
            style={[
              styles.tabText,
              mode === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === "completed" && styles.activeTab]}
          onPress={() => {
            setMode("completed");
          }}
        >
          <Text
            style={[
              styles.tabText,
              mode === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === "canceled" && styles.activeTab]}
          onPress={() => {
            setMode("canceled");
          }}
        >
          <Text
            style={[
              styles.tabText,
              mode === "canceled" && styles.activeTabText,
            ]}
          >
            Canceled
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      >
        {mode == "upcoming" ? (
          <View
            style={{
              flex: 1,
              marginBottom: 30,
              // paddingHorizontal: 20,
              marginTop: 10,
            }}
          >
            {isLoading ? (
              <Text>Loading...</Text>
            ) : error ? (
              <Text>Error..</Text>
            ) : data?.customerbooking?.length > 0 ? (
              data.customerbooking.map((booking: any, index: number) => {
                const formattedDate = new Date(
                  booking.TREATMENTDATE.replace(" ", "T")
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                return (
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      borderColor: "#ECEFF3",
                      marginBottom: 10,
                    }}
                    key={index}
                  >
                    <View style={styles.bookingContainer}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.dateText}>
                          {formattedDate} ({booking.TIME})
                        </Text>
                        <View style={styles.remindButton}>
                          <Text style={styles.remindText}>Remind me</Text>
                          <Switch
                            style={styles.switch}
                            trackColor={{ false: "#ccc", true: "#B0174C" }}
                            thumbColor={isEnabled ? "#fff" : "#fff"}
                            ios_backgroundColor="#ccc"
                            onValueChange={() => toggleSwitch(index)}
                            value={switchStates[index]}
                          />
                        </View>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.row}>
                        <Image
                          source={{
                            uri: `${apiUrl}/upload/${booking.IMAGE}`,
                          }}
                          style={styles.clinicImage}
                        />
                        <View style={styles.bookingDetails}>
                          <Text style={styles.clinicName}>
                            {booking.LOCATIONNAME}
                          </Text>
                          <Text style={styles.clinicAddress}>
                            {booking.ADDRESS}
                          </Text>
                          <Text style={styles.servicesTitle}>Services:</Text>
                          <Text style={styles.servicesText}>
                            {booking.SERVICE}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() =>
                            handlePresentModalPress(booking.BOOKINGID)
                          }
                        >
                          <Text style={styles.cancelText}>Cancel Booking</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="medkit-outline" size={60} color="#E0E0E0" />
                <Text style={styles.emptyTitle}>No History found</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any upcoming appointment yet
                </Text>
              </View>
            )}
          </View>
        ) : mode == "completed" ? (
          <View
            style={{
              flex: 1,
              marginBottom: 30,
              // paddingHorizontal: 20,
              marginTop: 10,
            }}
          >
            {isLoadingCompeletd ? (
              <Text>Loading...</Text>
            ) : errorCompleted ? (
              <Text>Error..</Text>
            ) : dataCompleted?.customerbooking?.length > 0 ? (
              dataCompleted.customerbooking.map(
                (booking: any, index: number) => {
                  const formattedDate = new Date(
                    booking.TREATMENTDATE.replace(" ", "T")
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  return (
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        borderColor: "#ECEFF3",
                        marginBottom: 10,
                      }}
                      key={index}
                    >
                      <View style={styles.bookingContainer}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.dateText}>
                            {formattedDate} ({booking.TIME})
                          </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                          <Image
                            source={{
                              uri: `${apiUrl}/upload/${booking.IMAGE}`,
                            }}
                            style={styles.clinicImage}
                          />
                          <View style={styles.bookingDetails}>
                            <Text style={styles.clinicName}>
                              {booking.LOCATIONNAME}
                            </Text>
                            <Text style={styles.clinicAddress}>
                              {booking.ADDRESS}
                            </Text>
                            <Text style={styles.servicesTitle}>Services:</Text>
                            <Text style={styles.servicesText}>
                              {booking.SERVICE}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }
              )
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="medkit-outline" size={60} color="#E0E0E0" />
                <Text style={styles.emptyTitle}>No History found</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any treatment history yet
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              marginBottom: 30,
              // paddingHorizontal: 20,
              marginTop: 10,
            }}
          >
            {isLoadingCanceled ? (
              <Text>Loading...</Text>
            ) : errorCanceled ? (
              <Text>Error..</Text>
            ) : dataCanceled?.customerbooking?.length > 0 ? (
              dataCanceled.customerbooking.map(
                (booking: any, index: number) => {
                  const formattedDate = new Date(
                    booking.TREATMENTDATE.replace(" ", "T")
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                  return (
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        borderColor: "#ECEFF3",
                        marginBottom: 10,
                      }}
                      key={index}
                    >
                      <View style={styles.bookingContainer}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.dateText}>
                            {formattedDate} ({booking.TIME})
                          </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                          <Image
                            source={{
                              uri: `${apiUrl}/upload/${booking.IMAGE}`,
                            }}
                            style={styles.clinicImage}
                          />
                          <View style={styles.bookingDetails}>
                            <Text style={styles.clinicName}>
                              {booking.LOCATIONNAME}
                            </Text>
                            <Text style={styles.clinicAddress}>
                              {booking.ADDRESS}
                            </Text>
                            <Text style={styles.servicesTitle}>Services:</Text>
                            <Text style={styles.servicesText}>
                              {booking.SERVICE}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }
              )
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="medkit-outline" size={60} color="#E0E0E0" />
                <Text style={styles.emptyTitle}>No History found</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any canceled booking
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ borderRadius: 20, backgroundColor: "#fff" }}
      >
        <BottomSheetView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cancel Booking</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to cancel this booking?
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
              onPress={confirmCanceledBooking}
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
    backgroundColor: "#fff",
  },
  switch: {
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  searchButton: {
    padding: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#B0174C",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#B0174C",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bookingContainer: {
    paddingVertical: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  clinicImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  bookingDetails: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    // fontWeight: "bold",
    // marginBottom: 10,
  },
  remindButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  remindText: {
    color: "#A4ACB9",
    fontSize: 14,
    // fontWeight: "bold",
  },
  clinicName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  clinicAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  servicesTitle: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  servicesText: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ff5252",
    borderRadius: 5,
    marginRight: 10,
    width: "100%",
  },
  cancelText: {
    color: "#ff5252",
    fontWeight: "bold",
    textAlign: "center",
  },
  receiptButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#B0174C",
    borderRadius: 5,
  },
  receiptText: {
    color: "#B0174C",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
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
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
});

export default MyBookingUpcoming;
