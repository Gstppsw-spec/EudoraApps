import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import HeaderWithBack from "../../app/component/headerWithBack";
import useStore from "../../store/useStore";
import ErrorView from "../component/errorView";
import LoadingView from "../component/loadingView";
import useClinicDistances from "../hooks/useDistanceToClinic";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const postData = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/insertBookingByCustomer`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

const fetchAvailableTime = async ({ queryKey }: any) => {
  const [, date, locationId, duration] = queryKey;
  const res = await fetch(
    `${apiUrl}/getTimeAvailableDuration/${date}/${locationId}/${duration}`,
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const fetchListService = async ({ queryKey }: any) => {
  const [, customerId] = queryKey;
  const res = await fetch(`${apiUrl}/getServiceListCustomer/${customerId}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};
type Treatment = {
  id: number;
  name: string;
  duration: number;
  qty: number;
};

const fetchListClinic = async () => {
  const res = await fetch(`${apiUrl}/getClinic`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

type SelectedTreatment = Treatment & { qtyorder: number };

const BookingAppointmentScreen = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const locationId = useStore((state: { locationId: any }) => state.locationId);
  const locationName = useStore(
    (state: { locationName: any }) => state.locationName,
  );

  const setLocationId = useStore((state) => state.setLocationId);
  const setLocationName = useStore((state) => state.setLocationName);

  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const router = useRouter();
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [duration, setDuration] = useState(0);
  const [selected, setSelected] = useState<SelectedTreatment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handlePresentBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleDismissBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const toggleSelect = (treatment: Treatment) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.id === treatment.id);

      if (exists) {
        return prev.map((s) =>
          s.id === treatment.id
            ? { ...s, qtyorder: Math.min(s.qtyorder + 1, treatment.qty) }
            : s,
        );
      } else {
        return [...prev, { ...treatment, qtyorder: 1 }];
      }
    });
  };

  const updateQty = (id: number, change: number) => {
    setSelected((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newQty = Math.max(1, Math.min(s.qty, s.qtyorder + change));
          return { ...s, qtyorder: newQty };
        }
        return s;
      }),
    );
  };

  const calculateDuration = (items: (Treatment & { qtyorder: number })[]) => {
    return items.reduce(
      (total, item) => total + item.duration * item.qtyorder,
      0,
    );
  };

  useEffect(() => {
    setDuration(calculateDuration(selected));
  }, [selected]);

  const removeTreatment = (id: number) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  };

  const {
    data: serviceOptions,
    error: errorService,
    isLoading: isLoadingService,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["getServiceListCustomer", customerId],
    queryFn: fetchListService,
    enabled: !!customerId,
  });

  const { data: clinicOptions } = useQuery({
    queryKey: ["getClinicTransactions"],
    queryFn: fetchListClinic,
  });

  const filteredClinics = clinicOptions?.clinicEuodora?.filter((clinic: any) =>
    clinic?.name?.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const { distances, loading: loadingDistance } = useClinicDistances(
    clinicOptions?.clinicEuodora,
  );

  const sortedClinics = (filteredClinics || [])
    .map((clinic: any) => {
      const distance = distances?.[clinic.id];
      return {
        ...clinic,
        distance: distance ?? Infinity,
      };
    })
    .sort((a: any, b: any) => a.distance - b.distance);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredServices = serviceOptions?.serviceList?.filter((clinic: any) =>
    clinic?.name?.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const {
    data: availableTime,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getTimeAvailableDuration", selectedDate, locationId, duration],
    queryFn: fetchAvailableTime,
    enabled: !!selectedDate && !!locationId && !!duration,
  });

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      if (data?.status) {
        Toast.show({
          type: "success",
          text2: data?.message,
          position: "top",
          visibilityTime: 2000,
        });
        setSelected([]);
        setDuration(0);
        router.push("/mybooking/myBooking");
      } else {
        Toast.show({
          type: "error",
          text2: data?.message,
          position: "top",
          visibilityTime: 2000,
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Appointment gagal dibuat!",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const handleBooking = () => {
    if (!selectedDate) {
      Toast.show({
        type: "error",
        text1: "Tanggal belum dipilih",
        position: "top",
      });
      return;
    }
    if (!selected || selected.length === 0) {
      Toast.show({
        type: "error",
        text1: "Pilih minimal satu treatment",
        position: "top",
      });
      return;
    }
    if (!selectedEmployee) {
      Toast.show({
        type: "error",
        text1: "Pilih waktu treatment",
        position: "top",
      });
      return;
    }

    const service = selected
      .map((item) => `${item.name} (x${item.qtyorder})`)
      .join(", ");

    mutation.mutate({
      appointmentdate: selectedDate,
      booktime: selectedTime,
      service: service,
      locationId: locationId,
      customerid: customerId,
      employeeid: selectedEmployee,
      duration: duration,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([refetch()]);
    } catch (error) {
      console.log("Error refreshing:", error);
    }
    setRefreshing(false);
  };

  const renderItemLocation = ({ item }: any) => {
    const distance = distances?.[item.id];
    const formattedDistance = loadingDistance
      ? "Menghitung..."
      : distance !== undefined
        ? `${distance.toFixed(2)} KM`
        : "? KM";

    const isSelected = locationId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.clinicCard,
          isSelected && { borderColor: "#B0174C", borderWidth: 1 },
        ]}
        onPress={() => {
          setLocationId(item.id);
          setLocationName(item.name);
          handleDismissBottomSheet();
        }}
      >
        <Ionicons
          name="business-outline"
          size={22}
          color="#B0174C"
          style={{ marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.clinicNameText}>{item?.name}</Text>
          <Text style={styles.clinicDistanceText}>
            Jarak: {formattedDistance}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color="#B0174C" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <HeaderWithBack title="Book Appointment" useGoBack />

      <View style={styles.inputGroup}>
        <Pressable
          style={styles.dropdownContainer}
          onPress={() => {
            handlePresentBottomSheet();
          }}
        >
          <Text style={styles.text}>
            {locationName || "Pilih Klinik Pembelian"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#64748b" />
        </Pressable>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "#B0174C",
              textColor: "#fff",
            },
          }}
          minDate={today}
          style={styles.calendar}
          theme={{
            backgroundColor: "#fff",
            calendarBackground: "#fff",
            textSectionTitleColor: "#B0174C",
            selectedDayBackgroundColor: "#B0174C",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#B0174C",
            dayTextColor: "#333",
            textDisabledColor: "#ccc",
            arrowColor: "#B0174C",
            monthTextColor: "#B0174C",
            indicatorColor: "#B0174C",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13,
          }}
        />

        <View style={styles.sectionContainer}>
          <Pressable
            style={styles.input}
            onPress={() => setShowTreatmentModal(true)}
          >
            <Text style={styles.inputText}>Pilih Treatment</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </Pressable>

          {selected.length > 0 && (
            <View style={styles.selectedList}>
              {selected.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.selectedItem,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      marginBottom: 5,
                    },
                  ]}
                >
                  <Text style={styles.selectedText}>
                    {item.name} (x{item.qtyorder})
                  </Text>
                  <View style={styles.qtyButtons}>
                    <TouchableOpacity onPress={() => updateQty(item.id, -1)}>
                      <Ionicons name="remove-circle" size={22} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => updateQty(item.id, 1)}>
                      <Ionicons name="add-circle" size={22} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeTreatment(item.id)}>
                      <Ionicons name="trash" size={22} color="gray" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.timeContainer}>
          {duration === 0 ? (
            <View style={styles.infoCard}>
              <Ionicons name="medkit-outline" size={40} color="#4ECDC4" />
              <Text style={styles.infoTitle}>Silahkan pilih treatment</Text>
              <Text style={styles.infoSubtitle}>
                Untuk melihat ketersediaan waktu
              </Text>
            </View>
          ) : isLoading ? (
            <View style={styles.infoCard}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <Text style={styles.infoTitle}>Memuat data...</Text>
              <Text style={styles.infoSubtitle}>Mohon tunggu sebentar</Text>
            </View>
          ) : error ? (
            <View style={styles.infoCard}>
              <Ionicons name="alert-circle-outline" size={40} color="#FF6B6B" />
              <Text style={styles.infoTitle}>Terjadi kesalahan</Text>
              <Text style={styles.infoSubtitle}>
                Gagal mengambil data, coba lagi
              </Text>
            </View>
          ) : availableTime?.availableTimeEmployee?.length > 0 ? (
            availableTime.availableTimeEmployee.map(
              (time: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeButton,
                    selectedTime === time.TIME && styles.selectedTime,
                  ]}
                  onPress={() => {
                    setSelectedTime(time.TIME);
                    setSelectedEmployee(time.EMPLOYEEID);
                  }}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === time.TIME && styles.selectedTimeText,
                    ]}
                  >
                    {time.TIME}
                  </Text>
                </TouchableOpacity>
              ),
            )
          ) : (
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={40} color="#FF6B6B" />
              <Text style={styles.infoTitle}>Tidak ada waktu tersedia</Text>
              <Text style={styles.infoSubtitle}>
                Silakan pilih hari lain atau treatment berbeda
              </Text>
            </View>
          )}
        </View>

        <Modal
          visible={showTreatmentModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTreatmentModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.searchContainer}>
                <FontAwesome
                  name="search"
                  size={18}
                  color="#aaa"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Treatment"
                  onChangeText={(text) => setSearchQuery(text)}
                  value={searchQuery}
                  placeholderTextColor="#999"
                />
              </View>
              {isLoadingService ? (
                <LoadingView />
              ) : errorService ? (
                <ErrorView onRetry={onRefresh} />
              ) : (
                <FlatList
                  data={filteredServices}
                  keyExtractor={(item) => item?.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setShowTreatmentModal(false);
                        toggleSelect(item);
                      }}
                    >
                      <Text>
                        {item?.name} - {item?.duration} Menit ({item?.qty})
                      </Text>
                    </TouchableOpacity>
                  )}
                  initialNumToRender={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 50,
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "#999" }}>
                        Tidak ada data tersedia
                      </Text>
                    </View>
                  )}
                />
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTreatmentModal(false)}
              >
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <View>
        <TouchableOpacity style={styles.continueButton} onPress={handleBooking}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>BOOK</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM SHEET KLINIK */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["50%", "90%"]}
        enablePanDownToClose
        keyboardBehavior="interactive"
        backgroundStyle={{ borderRadius: 20, backgroundColor: "#fff" }}
      >
        <BottomSheetFlatList
          data={sortedClinics}
          keyExtractor={(item: any) => String(item?.id)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 300 }}
          ListHeaderComponent={
            <View style={{ padding: 16, backgroundColor: "#fff" }}>
              <View
                style={{
                  backgroundColor: "#e5e7eb",
                  borderRadius: 2,
                  alignSelf: "center",
                }}
              />
              <Text style={styles.modalTitleSheet}>Pilih Klinik Terdekat</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari Klinik..."
                placeholderTextColor="#9ca3af"
                onChangeText={setSearchQuery}
                value={searchQuery}
                onFocus={() => bottomSheetModalRef.current?.snapToIndex(1)}
              />
            </View>
          }
          stickyHeaderIndices={[0]}
          ListEmptyComponent={() => (
            <View style={{ padding: 32, alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "#999" }}>
                Tidak ada data tersedia
              </Text>
            </View>
          )}
          renderItem={renderItemLocation}
        />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  chooseTreatmentText: {
    fontStyle: "italic",
    color: "#888", // abu-abu biar beda dari text normal
    textAlign: "center",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  calendar: {
    borderRadius: 10,
    elevation: 2, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 5,
    backgroundColor: "#fff",
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 30,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  selectedTime: {
    backgroundColor: "#B0174C",
  },
  timeText: {
    fontSize: 16,
    color: "#666",
  },
  selectedTimeText: {
    color: "#fff",
  },
  continueButton: {
    backgroundColor: "#B0174C",
    padding: 15,
    alignItems: "center",
    flexDirection: "row", // ⬅️ Penting untuk ikon dan teks sejajar
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  },

  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    marginBottom: 10,
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
    borderRadius: 80,
    borderWidth: 0.2,
  },
  mainHeader: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginLeft: -50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContainer: {
    marginBottom: 24,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    width: "100%",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    fontFamily: "Inter-Regular",
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  treatmentModalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  treatmentModalTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  treatmentItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  selectedDropdownItem: {
    backgroundColor: "#FFF9E6",
  },
  treatmentItemText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%", // Width of the modal
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    height: "50%",
    elevation: 5, // Optional shadow for Android
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  closeButton: {
    backgroundColor: "#B0174C",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
    height: 40,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  selectedList: { marginTop: 12 },
  selectedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  selectedText: { fontSize: 14, color: "#444", flex: 1, marginRight: 10 },
  qtyButtons: { flexDirection: "row", gap: 10 },
  noTimeContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#FFF5F5",
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noTimeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B6B",
    marginTop: 8,
  },
  noTimeSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  infoCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    backgroundColor: "#FFF",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    color: "#333",
    textAlign: "center",
  },
  infoSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  inputGroup: { marginHorizontal: 16, marginVertical: 15 },
  text: { color: "#1e293b", fontSize: 14 },

  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  modalTitleSheet: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#111827",
  },

  clinicCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  clinicNameText: { fontSize: 15, fontWeight: "600", color: "#1f2937" },
  clinicDistanceText: { fontSize: 13, color: "#6b7280", marginTop: 2 },
});

export default BookingAppointmentScreen;
