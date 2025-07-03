import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    gender: "FEMALE",
    idNumber: "",
    birthDate: "",
    clinicLocation: "",
    referralCode: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isClinicModalVisible, setClinicModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const clinicOptions = [
    "Eudora Aesthetic Clinic - Bintaro",
    "Eudora Aesthetic Clinic - SMS",
    "Eudora Aesthetic Clinic - Central Park Mall",
    "Eudora Aesthetic Clinic - Kemang",
     "Eudora Aesthetic Clinic -  Living World Grand Wisata",
      "Eudora Aesthetic Clinic - Living World Kota Wisata",
  ];

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    handleChange("birthDate", `${day}/${month}/${year}`);
    hideDatePicker();
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://sys.eudoraclinic.com:84/apieudora/send_otp",
        {
          phone: formData.phone,
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status) {
        Alert.alert("Success", "OTP telah dikirim.");
        setStep(2);
      } else {
        Alert.alert("Error", response.data.message || "Gagal kirim OTP");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://sys.eudoraclinic.com:84/apieudora/verify_otp",
        {
          phone: formData.phone,
          otp: otp,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status) {
        Alert.alert("Berhasil", "OTP berhasil diverifikasi.");
        router.replace("/authentication/setPin");
      } else {
        Alert.alert("Error", "OTP salah atau kadaluarsa");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Gagal verifikasi OTP");
    } finally {
      setLoading(false);
    }
  };

  // Filter clinics based on search query
  const filteredClinics = clinicOptions.filter(clinic =>
    clinic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Depan</Text>
              <TextInput
                style={styles.input}
                value={formData.firstname}
                onChangeText={(text) => handleChange("firstname", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Belakang</Text>
              <TextInput
                style={styles.input}
                value={formData.lastname}
                onChangeText={(text) => handleChange("lastname", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor KTP</Text>
              <TextInput
                style={styles.input}
                value={formData.idNumber}
                onChangeText={(text) => handleChange("idNumber", text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tanggal Lahir</Text>
              <Pressable
                style={styles.dropdownContainer}
                onPress={showDatePicker}
              >
                <Text style={formData.birthDate ? styles.text : styles.placeholderText}>
                  {formData.birthDate || "dd/mm/yyyy"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lokasi Klinik</Text>
              <Pressable
                style={styles.dropdownContainer}
                onPress={() => setClinicModalVisible(true)} // Open the modal
              >
                <Text style={styles.text}>
                  {formData.clinicLocation || "Pilih Klinik Terdekat"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Jenis Kelamin</Text>
              <View style={styles.radioRow}>
                {["FEMALE", "MALE"].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={styles.radioOption}
                    onPress={() => handleChange("gender", gender)}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        formData.gender === gender && styles.radioCircleSelected,
                      ]}
                    />
                    <Text style={styles.radioLabel}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kode Referal</Text>
              <TextInput
                style={styles.input}
                value={formData.referralCode}
                onChangeText={(text) => handleChange("referralCode", text)}
                placeholder="Masukkan kode referal (jika ada)"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={sendOtp}
              disabled={loading || !formData.phone || !formData.firstname}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Kirim OTP</Text>
              )}
            </TouchableOpacity>

            {/* Calendar Modal */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              backdropStyle={styles.backdrop}
            />

            {/* Modal for Clinic Selection */}
            <Modal
              transparent={true}
              animationType="slide"
              visible={isClinicModalVisible}
              onRequestClose={() => setClinicModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.headerText}>Pilih Klinik</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Cari Klinik"
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                  />

                  <FlatList
                    data={filteredClinics}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          handleChange("clinicLocation", item);
                          setClinicModalVisible(false);
                        }}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setClinicModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 40 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 12,
    fontSize: 14,
    color: "#1e293b",
  },
  placeholderText: { color: "#9ca3af" },
  text: { color: "#1e293b", fontSize: 14 },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 12,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%', // Width of the modal
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Optional shadow for Android
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  closeButton: {
    backgroundColor: '#FEBA43',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  radioRow: { flexDirection: "row", gap: 16, alignItems: "center" },
  radioOption: { flexDirection: "row", alignItems: "center" },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#FEBA43",
    marginRight: 6,
  },
  radioCircleSelected: {
    backgroundColor: "#FEBA43",
  },
  radioLabel: { fontSize: 14, color: "#1e293b" },
  submitButton: {
    backgroundColor: "#FEBA43",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});