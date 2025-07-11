import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Constants from 'expo-constants';
import { Image } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import useStore from "../../store/useStore";
import HeaderWithBack from "../component/headerWithBack";
import useClinicDistances from "../hooks/useDistanceToClinic";
import CountryPicker, { Country } from 'react-native-country-picker-modal';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const fetchListClinic = async () => {
  const res = await fetch(`${apiUrl}/getClinic`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const sendOtp = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/send_otpRegister`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const verifyOtp = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/verify_otpRegistration`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    gender: "F",
    idNumber: "",
    birthDate: "",
    clinicLocation: "",
    referralCode: "",
    clinicId: null,
  });

  // Country code state
  const [country, setCountry] = useState<Country>({
    callingCode: ['62'], // Default to Indonesia
    cca2: 'ID',
    currency: ['IDR'],
    flag: 'flag-id',
    name: 'Indonesia',
    region: 'Asia',
    subregion: 'South-Eastern Asia'
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const genderOptions = [
    { label: "FEMALE", value: "F" },
    { label: "MALE", value: "M" },
  ];

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isClinicModalVisible, setClinicModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const setCustomerId = useStore((state) => state.setCustomerId);
  const setCustomerDetails = useStore((state) => state.setCustomerDetails);

  const {
    data: clinicOptions,
    error: errorclinic,
    isLoading: isLoadingclinic,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["getClinic"],
    queryFn: fetchListClinic,
  });

  const {
    distances,
    loading: loadingDistance,
    error,
  } = useClinicDistances(clinicOptions?.clinicEuodora);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (text: string) => {
    // Remove all non-digit characters
    let cleanedText = text.replace(/[^0-9]/g, '');
    
    // Remove leading zeros
    if (cleanedText.startsWith('0')) {
      cleanedText = cleanedText.substring(1);
    }
    
    // Limit to 15 characters max
    cleanedText = cleanedText.substring(0, 15);
    
    handleChange("phone", cleanedText);
  };

  const isValidPhoneNumber = (phone: string) => {
    // Phone should be 8-15 digits and not start with 0
    const phoneRegex = /^[1-9]\d{7,14}$/;
    return phoneRegex.test(phone);
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

  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text2: "Registrasi berhasil, lakukan verifikasi",
        position: "top",
        visibilityTime: 2000,
      });
      setStep(2);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Registrasi gagal",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const mutationVerifyOtp = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.status) {
        setCustomerId(data.customerId);
        setCustomerDetails({
          fullname: data?.dataCustomer?.firstname + " " + data?.dataCustomer?.lastname,
          email: data?.dataCustomer?.email,
          phone: data?.dataCustomer?.cellphonenumber,
          gender: data?.dataCustomer?.sex,
          dateofbirth: data?.dataCustomer?.dateofbirth,
          locationCustomerRegister: data?.dataCustomer?.locationid
        });
        router.replace("/authentication/setPin");
      } else {
        Alert.alert("Error", "OTP Salah atau Kadaluarsa");
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: "Registrasi gagal",
        position: "top",
        visibilityTime: 2000,
      });
    },
  });

  const handleSendOtp = () => {
    if (
      formData.firstname &&
      formData.lastname &&
      formData.clinicLocation &&
      formData.gender &&
      formData.phone
    ) {
      if (!isValidPhoneNumber(formData.phone)) {
        Alert.alert("Error", "Format nomor telepon tidak valid. Harap masukkan nomor tanpa kode negara dan tanpa angka 0 di depan.");
        return;
      }
      
      mutation.mutate({
        ...formData,
        countryCode: country.callingCode[0]
      });
    } else {
      Toast.show({
        type: "info",
        text2: "Data belum lengkap",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const handleVerifyOtp = () => {
    if (
      formData.firstname &&
      formData.lastname &&
      formData.clinicLocation &&
      formData.gender &&
      formData.phone &&
      otp?.length === 6
    ) {
      const payload = {
        ...formData,
        otp: otp,
        countryCode: country.callingCode[0]
      };
      mutationVerifyOtp.mutate(payload);
    } else {
      Toast.show({
        type: "info",
        text2: "Digit code kurang dari 6",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filteredClinics = clinicOptions?.clinicEuodora?.filter((clinic) =>
    clinic?.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const sortedClinics = (filteredClinics || [])
    .map((clinic) => {
      const distance = distances?.[clinic.id];
      return {
        ...clinic,
        distance: distance ?? Infinity,
      };
    })
    .sort((a, b) => a.distance - b.distance);

  const renderWhatsAppInput = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Whatsapp</Text>
      <View style={styles.phoneInputContainer}>
        <TouchableOpacity
          style={styles.countryCodeButton}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={styles.countryCodeText}>+{country.callingCode[0]}</Text>
          <Ionicons name="chevron-down" size={16} color="#64748b" />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, styles.phoneInput]}
          value={formData.phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          placeholder="8123456789"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {step === 1 && <HeaderWithBack title="Register" useGoBack />}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {step === 1 ? (
            <>
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

                  {renderWhatsAppInput()}

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
                      <Text
                        style={
                          formData.birthDate
                            ? styles.text
                            : styles.placeholderText
                        }
                      >
                        {formData.birthDate || "dd/mm/yyyy"}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#64748b"
                      />
                    </Pressable>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Lokasi Klinik</Text>
                    <Pressable
                      style={styles.dropdownContainer}
                      onPress={() => setClinicModalVisible(true)}
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
                      {genderOptions.map((item) => (
                        <TouchableOpacity
                          key={item.value}
                          style={styles.radioOption}
                          onPress={() => handleChange("gender", item.value)}
                        >
                          <View
                            style={[
                              styles.radioCircle,
                              formData.gender === item.value &&
                                styles.radioCircleSelected,
                            ]}
                          />
                          <Text style={styles.radioLabel}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Kode Referal</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.referralCode}
                      onChangeText={(text) =>
                        handleChange("referralCode", text)
                      }
                      placeholder="Masukkan kode referal (jika ada)"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSendOtp}
                    disabled={loading || !formData.phone || !formData.firstname}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>{t("register")}</Text>
                    )}
                  </TouchableOpacity>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={new Date()}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />

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
                          placeholderTextColor={"#000000"}
                          onChangeText={(text) => setSearchQuery(text)}
                          value={searchQuery}
                        />

                        <FlatList
                          data={sortedClinics}
                          keyExtractor={(item) => item?.id}
                          renderItem={({ item }) => {
                            const distance = distances?.[item.id];
                            const formattedDistance = loading
                              ? "Menghitung..."
                              : distance !== undefined
                              ? `${distance.toFixed(2)} KM`
                              : "? KM";

                            return (
                              <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                  handleChange("clinicLocation", item?.name);
                                  setClinicModalVisible(false);
                                  handleChange("clinicId", item?.id);
                                }}
                              >
                                <View style={{ flexDirection: "column" }}>
                                  <Text style={styles.clinicNameText}>
                                    {item?.name}
                                  </Text>
                                  <Text style={styles.clinicDistanceText}>
                                    JARAK: {formattedDistance}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          }}
                          initialNumToRender={5}
                          maxToRenderPerBatch={5}
                          windowSize={5}
                          keyboardShouldPersistTaps="handled"
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

                  <CountryPicker
                    visible={showCountryPicker}
                    withCallingCode
                    withFilter
                    withFlag
                    withAlphaFilter
                    withCallingCodeButton
                    withEmoji
                    onSelect={(selectedCountry) => {
                      setCountry(selectedCountry);
                      setShowCountryPicker(false);
                    }}
                    onClose={() => setShowCountryPicker(false)}
                    countryCode={country.cca2}
                  />
                </View>
              </TouchableWithoutFeedback>
            </>
          ) : (
            <>
              <View style={styles.headerRegis}>
                <View style={styles.logoContainer}>
                  <Image
                    source={require("@/assets/images/logo.jpg")}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>{t("welcome")}</Text>
                <Text style={styles.subtitle}>
                  {step === 1 ? t("input_whatsapp") : t("input_verification")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  paddingTop: 20,
                  alignItems: "center",
                }}
              >
                <View style={styles.formCard}>
                  <View style={styles.formGroup}>
                    <TextInput
                      style={styles.otpInput}
                      placeholder={t("enter6DigitCode")}
                      placeholderTextColor="#9ca3af"
                      keyboardType="number-pad"
                      value={otp}
                      onChangeText={setOtp}
                      textAlign="center"
                      maxLength={6}
                    />
                    <Text style={styles.otpNote}>
                      {t("codeSentTo")} +{country.callingCode[0]} {formData.phone}
                    </Text>
                  </View>
                  <TouchableOpacity
                    disabled={otp?.length !== 6}
                    style={[
                      styles.button,
                      otp?.length !== 6 && { opacity: 0.3 },
                    ]}
                    onPress={handleVerifyOtp}
                  >
                    <Text style={styles.buttonText}>{t("confirm")}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleSendOtp}
                  >
                    <Text style={styles.resendText}>
                      {t("didNotReceiveCode")}
                    </Text>
                    <Text style={styles.resendLink}>{t("resend")}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={() => setStep(1)}
                  >
                    <Text style={styles.resendLink}>Update Data?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40, marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 12,
    fontSize: 14,
    color: "#1e293b",
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  countryCodeText: {
    color: '#1e293b',
    fontSize: 14,
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
  },
  phoneHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    height: "50%",
    elevation: 5,
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
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
  radioRow: { flexDirection: "row", gap: 16, alignItems: "center" },
  radioOption: { flexDirection: "row", alignItems: "center" },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#B0174C",
    marginRight: 6,
  },
  radioCircleSelected: {
    backgroundColor: "#B0174C",
  },
  radioLabel: { fontSize: 14, color: "#1e293b" },
  submitButton: {
    backgroundColor: "#B0174C",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    padding: 8,
  },
  mainHeader: {
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
  },
  formGroup: {
    marginBottom: 24,
  },
  headerRegis: {
    alignItems: "center",
    paddingTop: 80,
  },
  otpInput: {
    height: 60,
    fontSize: 20,
    color: "#111827",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
    fontWeight: "600",
    marginTop: 15,
  },
  otpNote: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 15,
    textAlign: "center",
  },
  button: {
    height: 60,
    backgroundColor: "#B0174C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#B0174C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    color: "#6b7280",
  },
  resendLink: {
    fontSize: 14,
    color: "#B0174C",
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#ffffff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  clinicNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  clinicDistanceText: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});