import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

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
    infoSource: "Rekomendasi",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [showInfoSourceDropdown, setShowInfoSourceDropdown] = useState(false);

  const clinicOptions = [
    "Eudora Aesthetic Clinic - Bintaro",
    "Eudora Aesthetic Clinic - SMS",
    "Eudora Aesthetic Clinic - Central Park Mall",
    "Eudora Aesthetic Clinic - Kemang",
  ];

  const infoSourceOptions = [
    "Rekomendasi",
    "GUN",
    "Media Sosial",
    "Iklan",
    "Lainnya",
  ];

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear();
      handleChange("birthDate", `${day}/${month}/${year}`);
    }
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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) { console.log(response.data);
      
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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

     if (response.data.status) {
      Alert.alert("Berhasil", "OTP berhasil diverifikasi.");
router.replace("/authentication/setPin");
       } else {
      Alert.alert("Error", "OTP salah atau kadaluarsa");
    }
  } catch (err: any) {
    // Handle errors gracefully
    Alert.alert("Error", err?.response?.data?.message || "Gagal verifikasi OTP");
  } finally {
    setLoading(false); // Hide loading indicator
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#1e293b" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Registrasi</Text>
              <View style={{ width: 24 }} />
            </View>

            {step === 1 ? (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Data Pribadi</Text>

                {/* Semua input field satu per satu ke bawah */}
                {[
                  { label: "Nama Depan", key: "firstname", placeholder: "Nama depan" },
                  { label: "Nama Belakang", key: "lastname", placeholder: "Nama belakang" },
                  { label: "Nomor WhatsApp", key: "phone", placeholder: "08XXXXXXXXXX", keyboardType: "phone-pad" },
                  { label: "Email", key: "email", placeholder: "email@contoh.com", keyboardType: "email-address" },
                  { label: "Nomor KTP", key: "idNumber", placeholder: "Nomor KTP", keyboardType: "number-pad" },
                ].map((item) => (
                  <View style={styles.inputGroup} key={item.key}>
                    <Text style={styles.label}>{item.label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={item.placeholder}
                      keyboardType={item.keyboardType || "default"}
                      value={formData[item.key]}
                      onChangeText={(text) => handleChange(item.key, text)}
                    />
                  </View>
                ))}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tanggal Lahir</Text>
                  <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text style={formData.birthDate ? styles.dateText : styles.placeholderText}>
                      {formData.birthDate || "dd/mm/yyyy"}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Jenis Kelamin</Text>
                  <View style={styles.radioGroup}>
                    {["FEMALE", "MALE"].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.radioButton,
                          formData.gender === gender && styles.radioButtonActive,
                        ]}
                        onPress={() => handleChange("gender", gender)}
                      >
                        <Text
                          style={[
                            styles.radioText,
                            formData.gender === gender && styles.radioTextActive,
                          ]}
                        >
                          {gender === "FEMALE" ? "Perempuan" : "Laki-laki"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Lokasi Klinik</Text>
                  <Pressable style={styles.input} onPress={() => setShowClinicDropdown(!showClinicDropdown)}>
                    <Text>{formData.clinicLocation || "Pilih Klinik Terdekat"}</Text>
                  </Pressable>
                  {showClinicDropdown && (
                    <View style={styles.dropdown}>
                      {clinicOptions.map((option, index) => (
                        <Pressable
                          key={index}  
                          style={styles.dropdownItem}
                          onPress={() => {
                            handleChange("clinicLocation", option);
                            setShowClinicDropdown(false);
                          }}
                        >
                          <Text>{option}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Sumber Informasi</Text>
                  <Pressable style={styles.input} onPress={() => setShowInfoSourceDropdown(!showInfoSourceDropdown)}>
                    <Text>{formData.infoSource}</Text>
                  </Pressable>
                  {showInfoSourceDropdown && (
                    <View style={styles.dropdown}>
                      {infoSourceOptions.map((source, index) => (
                        <Pressable
                          key={index}
                          style={styles.dropdownItem}
                          onPress={() => {
                            handleChange("infoSource", source);
                            setShowInfoSourceDropdown(false);
                          }}
                        >
                          <Text>{source}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={sendOtp}
                  disabled={loading || !formData.phone || !formData.firstname}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Kirim OTP</Text>}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.otpContainer}>
                <Text style={styles.otpTitle}>Masukkan Kode OTP</Text>
                <Text style={styles.otpSubtitle}>Kode OTP telah dikirim ke {formData.phone}</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="••••••"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={verifyOtp}
                  disabled={loading || otp.length < 6}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verifikasi OTP</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.resendLink} onPress={sendOtp}>
                  <Text style={styles.resendText}>Tidak menerima kode? Kirim ulang</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 40 },
  container: { flex: 1, backgroundColor: "#f8fafc", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: Platform.OS === "ios" ? 48 : 24,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1e293b", flex: 1, textAlign: "center" },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: { fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8 },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: "#1e293b",
  },
  placeholderText: { color: "#9ca3af" },
  dateText: { color: "#1e293b" },
  radioGroup: { flexDirection: "row", gap: 12 },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  radioButtonActive: { backgroundColor: "#FEBA43", borderColor: "#FEBA43" },
  radioText: { color: "#64748b", fontWeight: "500", fontSize: 14 },
  radioTextActive: { color: "#fff", fontWeight: "600" },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    backgroundColor: "#fff",
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  submitButton: {
    backgroundColor: "#FEBA43",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  otpContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    marginTop: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  otpTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 8 },
  otpSubtitle: { fontSize: 14, color: "#64748b", marginBottom: 24, textAlign: "center" },
  otpInput: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: "#1e293b",
    letterSpacing: 8,
    textAlign: "center",
    marginBottom: 24,
  },
  resendLink: { marginTop: 16 },
  resendText: { color: "#FEBA43", fontWeight: "600", textAlign: "center", fontSize: 14 },
});
