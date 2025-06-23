import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router"; // Import the Link component from expo-router
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "../../store/useStore";

const fetchListBooking = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `https://sys.eudoraclinic.com:84/apieudora/getListBooking/${customerId}/1`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchListBookingCompleted = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `https://sys.eudoraclinic.com:84/apieudora/getListBooking/${customerId}/3`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchListBookingCanceled = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(
    `https://sys.eudoraclinic.com:84/apieudora/getListBooking/${customerId}/2`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const canceledBooking = async (formData: any) => {
  const response = await axios.post(
    "https://sys.eudoraclinic.com:84/apieudora/canceledBooking",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const MyBookingUpcoming = () => {
  const [modalVisible, setModalVisible] = useState(false); // Manage the modal visibility
  const [currentBooking, setCurrentBooking] = useState(null); // Store current booking to cancel
  const navigation = useNavigation();
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const queryClient = useQueryClient();
  const [switchStates, setSwitchStates] = useState<boolean[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<"upcoming" | "completed" | "canceled">(
    "upcoming"
  );

  // Function to handle Cancel Booking button click
  const handleCancelBooking = (
    booking: string | React.SetStateAction<null>
  ) => {
    setCurrentBooking(booking); // Set the current booking to cancel
    setModalVisible(true); // Show the confirmation modal
  };

  // Function to handle modal dismiss
  const cancelModal = () => {
    setModalVisible(false); // Hide modal without canceling
    setCurrentBooking(null); // Reset current booking
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

  console.log(dataCanceled);

  const mutation = useMutation({
    mutationFn: canceledBooking,
    onSuccess: (data) => {
      // setModalVisible(true);
      queryClient.invalidateQueries(["getListBooking", customerId]);
    },
    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });

  useEffect(() => {
    if (data?.customerbooking) {
      setSwitchStates(data.customerbooking.map(() => false));
    }
  }, [data]);

  const toggleSwitch = (index: number) => {
    setSwitchStates((prevState) => {
      const updated = [...prevState];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleCanceledBooking = (bookingId: number) => {
    mutation.mutate({
      bookingId: bookingId,
    });
  };

  const onRefresh = () => {
    refetch();
    refetchCompleted();
    refetchCanceled();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.mainHeader}>HISTORY BOOKING</Text>
      </View>
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
              data.customerbooking
                .slice(0, 3)
                .map((booking: any, index: number) => {
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
                              trackColor={{ false: "#ccc", true: "#FFB900" }}
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
                              uri: `https://sys.eudoraclinic.com:84/apieudora/upload/${booking.IMAGE}`,
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
                              handleCanceledBooking(booking.BOOKINGID)
                            }
                          >
                            <Text style={styles.cancelText}>
                              Cancel Booking
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })
            ) : (
              <Text>Tidak ada data...</Text>
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
                          {/* <View style={styles.remindButton}>
                            <Text style={styles.remindText}>Remind me</Text>
                            <Switch
                              style={styles.switch}
                              trackColor={{ false: "#ccc", true: "#FFB900" }}
                              thumbColor={isEnabled ? "#fff" : "#fff"}
                              ios_backgroundColor="#ccc"
                              onValueChange={() => toggleSwitch(index)}
                              value={switchStates[index]}
                            />
                          </View> */}
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                          <Image
                            source={{
                              uri: `https://sys.eudoraclinic.com:84/apieudora/upload/${booking.IMAGE}`,
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
                        {/* <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() =>
                              handleCanceledBooking(booking.BOOKINGID)
                            }
                          >
                            <Text style={styles.cancelText}>
                              Cancel Booking
                            </Text>
                          </TouchableOpacity>
                        </View> */}
                      </View>
                    </View>
                  );
                }
              )
            ) : (
              <Text>Tidak ada data...</Text>
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
                          {/* <View style={styles.remindButton}>
                            <Text style={styles.remindText}>Remind me</Text>
                            <Switch
                              style={styles.switch}
                              trackColor={{ false: "#ccc", true: "#FFB900" }}
                              thumbColor={isEnabled ? "#fff" : "#fff"}
                              ios_backgroundColor="#ccc"
                              onValueChange={() => toggleSwitch(index)}
                              value={switchStates[index]}
                            />
                          </View> */}
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                          <Image
                            source={{
                              uri: `https://sys.eudoraclinic.com:84/apieudora/upload/${booking.IMAGE}`,
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
                        {/* <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() =>
                              handleCanceledBooking(booking.BOOKINGID)
                            }
                          >
                            <Text style={styles.cancelText}>
                              Cancel Booking
                            </Text>
                          </TouchableOpacity>
                        </View> */}
                      </View>
                    </View>
                  );
                }
              )
            ) : (
              <Text>Tidak ada data...</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelModal} // Close on back button
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to cancel this booking?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Link
                href="/tabs/clinic/bookingcancel"
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </Link>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomColor: "#FFB900",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FFB900",
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
    borderColor: "#FFB900",
    borderRadius: 5,
  },
  receiptText: {
    color: "#FFB900",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5, // Shadow effect on modal
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFB900",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFB900",
    fontWeight: "bold",
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
});

export default MyBookingUpcoming;
