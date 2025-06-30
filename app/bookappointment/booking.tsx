import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import useStore from "../../store/useStore";

const postData = async (formData: any) => {
  const response = await axios.post(
    "https://sys.eudoraclinic.com:84/apieudora/insertBookingByCustomer",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const fetchAvailableTime = async ({ queryKey }: any) => {
  const [, date, locationId] = queryKey;
  const res = await fetch(
    `https://sys.eudoraclinic.com:84/apieudora/getTimeAvailable/${date}/${locationId}`
  );
  if (!res.ok) throw new Error("Network error");
  return res.json();
};

const BookingAppointmentScreen = () => {
  const setCustomerId = useStore((state) => state.setCustomerId);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const locationId = 6;
  const [remarks, setRemarks] = useState("");
  const navigation = useNavigation();

  const {
    data: availableTime,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getTimeAvailable", selectedDate, locationId],
    queryFn: fetchAvailableTime,
    enabled: !!selectedDate && !!locationId,
  });

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      setModalVisible(true);
    },
    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedEmployee) {
      mutation.mutate({
        appointmentdate: selectedDate,
        booktime: selectedTime,
        service: remarks,
        locationId: 6,
        customerid: 5,
        employeeid: selectedEmployee,
      });
    } else {
      alert("Please select both a date and a time.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 5 }}>
      <View style={styles.header}>
        <Link href={'/tabs/clinic/details'} asChild>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </Link>

        <Text style={styles.mainHeader}>BOOK APPOINTMENT</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80} // sesuaikan jika header menutup input
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subHeader}>Select DATE</Text>
          <Calendar
            onDayPress={(day: { dateString: React.SetStateAction<string> }) => {
              setSelectedDate(day.dateString);
            }}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "#FFA500" },
            }}
            minDate={today}
            style={styles.calendar}
          />

          <Text style={styles.subHeader}>Select Time</Text>
          <View style={styles.timeContainer}>
            {isLoading ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" />
              </View>
            ) : error ? (
              <Text style={styles.timeText}>
                Terjadi kesalahan saat mengambil data
              </Text>
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
                )
              )
            ) : (
              <Text style={styles.timeText}>Tidak ada waktu tersedia</Text>
            )}
          </View>

          <Text style={styles.subHeader}>Treatment</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Masukkan catatan treatment yang ingin dilakukan disini."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={remarks}
            onChangeText={setRemarks}
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleBooking}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Booking Successful!</Text>
                <Link
                  href="/mybooking/mybooking"
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>OK</Text>
                </Link>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    minWidth: 80,
  },
  selectedTime: {
    backgroundColor: "#FFA500",
  },
  timeText: {
    fontSize: 16,
    color: "#666",
  },
  selectedTimeText: {
    color: "#fff",
  },
  continueButton: {
    backgroundColor: "#FFA500",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    borderWidth: 0.2
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
});

export default BookingAppointmentScreen;
