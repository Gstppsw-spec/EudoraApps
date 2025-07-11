import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Constants from 'expo-constants';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import useStore from "../../store/useStore";
import CountryPicker, { Country } from 'react-native-country-picker-modal';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const sendOtp = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/send_otp`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const verifyOtpUser = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/verify_otp`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  const setCustomerId = useStore((state) => state.setCustomerId);
  const setHasPin = useStore((state) => state.setHasPin);
  const [messageOtp, setMessageOtp] = useState("");
  const { t } = useTranslation();
  const lang = useStore((state) => state.lang);
  const setLang = useStore((state) => state.setLang);
  const setCustomerDetails = useStore((state) => state.setCustomerDetails);
  
  // Country code state
  const [countryCode, setCountryCode] = useState<Country>({
    callingCode: ['62'],
    cca2: 'ID',
    currency: ['IDR'],
    flag: 'flag-id',
    name: 'Indonesia',
    region: 'Asia',
    subregion: 'South-Eastern Asia'
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handlePhoneChange = (text: string) => {
    // Remove all non-digit characters
    let cleanedText = text.replace(/[^0-9]/g, '');
    
    // Remove leading zeros
    if (cleanedText.startsWith('0')) {
      cleanedText = cleanedText.substring(1);
    }
    
    // Limit to 15 characters max
    cleanedText = cleanedText.substring(0, 15);
    
    setPhone(cleanedText);
  };

  const isValidPhoneNumber = (phone: string) => {
    // Phone should be 8-15 digits and not start with 0
    const phoneRegex = /^[1-9]\d{7,14}$/;
    return phoneRegex.test(phone);
  };

  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      console.log(data.otp);
      if (data.status) {
        setMessageOtp(data?.otp);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setStep(2);
        }, 2000);
      } else {
        Alert.alert("Error", "Nomor WhatsApp anda tidak terdaftar");
      }
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      Alert.alert("Error", "Gagal mengirim OTP");
    },
  });

  const handleSendOtp = () => {
    if (!phone) {
      setShowErrorModal(true);
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      Alert.alert("Error", "Format nomor telepon tidak valid. Harap masukkan nomor tanpa kode negara dan tanpa angka 0 di depan.");
      return;
    }

    mutation.mutate({
      phone: phone,
      countryCode: countryCode.callingCode[0]
    });
  };

  const mutatioVerifyOtp = useMutation({
    mutationFn: verifyOtpUser,
    onSuccess: (data) => {
      if (data.status) {
        console.log(data);
        setCustomerId(data.customerId);
        setHasPin(data.has_pin);
        setCustomerDetails({
          fullname: data?.dataCustomer?.firstname + " " + data?.dataCustomer?.lastname ,
          email: data?.dataCustomer?.email,
          phone: data?.dataCustomer?.cellphonenumber,
          gender: data?.dataCustomer?.sex,
          dateofbirth: data?.dataCustomer?.dateofbirth,
          locationCustomerRegister: data?.dataCustomer?.locationid
        });

        if (data.has_pin) {
          router.replace("/tabs/home");
          registerForPushNotificationsAsync().then((token) => {
            if (token) {
              console.log("✅ Expo Push Token:", token);
            } else {
              console.log("❌ Tidak mendapatkan token");
            }
          });
        } else {
          router.replace("/authentication/setPin");
        }
      } else {
        Alert.alert("Error", "OTP Salah atau Kadaluarsa");
      }
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      Alert.alert("Error", "Gagal verifikasi OTP");
    },
  });

  const handleVerifyOtp = () => {
    if (phone && otp) {
      setShowConfirmModal(true);
    } else {
      Alert.alert("Error", "Harap masukkan OTP");
    }
  };

  const confirmVerification = () => {
    setShowConfirmModal(false);
    mutatioVerifyOtp.mutate({
      phone: phone,
      otp: otp,
      countryCode: countryCode.callingCode[0]
    });
  };

  const onSelectCountry = (country: Country) => {
    setCountryCode(country);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.languageSwitcher}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                lang === "id" && styles.languageButtonActive,
              ]}
              onPress={() => setLang("id")}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  lang === "id" && styles.languageButtonTextActive,
                ]}
              >
                🇮🇩
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                lang === "en" && styles.languageButtonActive,
              ]}
              onPress={() => setLang("en")}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  lang === "en" && styles.languageButtonTextActive,
                ]}
              >
                🇺🇸
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                lang === "zh" && styles.languageButtonActive,
              ]}
              onPress={() => setLang("zh")}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  lang === "zh" && styles.languageButtonTextActive,
                ]}
              >
                🇨🇳
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
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

          {/* Form Card */}
          <View style={styles.formCard}>
            {step === 1 ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("whatsappNumber")}</Text>
                <View style={styles.inputWrapper}>
                  <TouchableOpacity 
                    style={styles.prefixContainer}
                    onPress={() => setShowCountryPicker(true)}
                  >
                    <Text style={styles.prefix}>+{countryCode.callingCode[0]}</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.input}
                    placeholder="8123456789"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={handlePhoneChange}
                  />
                </View>
                {showCountryPicker && (
                  <CountryPicker
                    visible={showCountryPicker}
                    withCallingCode
                    withFilter
                    withFlag
                    withAlphaFilter
                    withCallingCodeButton
                    withEmoji
                    onSelect={onSelectCountry}
                    onClose={() => setShowCountryPicker(false)}
                    countryCode={countryCode.cca2}
                  />
                )}
              </View>
            ) : (
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t("verificationCode")}</Text>

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
                  {t("codeSentTo")} +{countryCode.callingCode[0]}{phone}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                (mutation.isPending || mutatioVerifyOtp.isPending) &&
                  styles.buttonDisabled,
              ]}
              onPress={step === 1 ? handleSendOtp : handleVerifyOtp}
              disabled={mutation.isPending || mutatioVerifyOtp.isPending}
            >
              {mutation.isPending || mutatioVerifyOtp.isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  {step === 1 ? t("sendOtpCode") : t("confirm")}
                </Text>
              )}
            </TouchableOpacity>

            {step === 2 && (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleSendOtp}
              >
                <Text style={styles.resendText}>{t("didNotReceiveCode")}</Text>
                <Text style={styles.resendLink}>{t("resend")}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          {step === 1 && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>{t("noAccount")}</Text>

              <TouchableOpacity
                onPress={() => router.push("/authentication/registerUsers")}
              >
                <Text style={styles.footerLink}>{t("register")}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Success Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showSuccessModal}
            onRequestClose={() => setShowSuccessModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.successIcon}>
                  <Text style={styles.successEmoji}>✅</Text>
                </View>
                <Text style={styles.modalTitle}>{t("successTitle")}</Text>
                <Text style={styles.modalMessage}>{t("otpSentMessage")}</Text>
              </View>
            </View>
          </Modal>

          {/* Error Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showErrorModal}
            onRequestClose={() => setShowErrorModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.errorIcon}>
                  <Text style={styles.errorEmoji}>❌</Text>
                </View>
                <Text style={styles.modalTitle}>Oops!</Text>
                <Text style={styles.modalMessage}>
                  {t("pleaseEnterWhatsapp")}
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowErrorModal(false)}
                >
                  <Text style={styles.modalButtonText}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Confirmation Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.confirmIcon}>
                  <Text style={styles.confirmEmoji}>🔐</Text>
                </View>
                <Text style={styles.modalTitle}>{t("confirm")}</Text>
                <Text style={styles.modalMessage}>
                  {t("confirmOtpMessage")}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonCancel}
                    onPress={() => setShowConfirmModal(false)}
                  >
                    <Text style={styles.modalButtonCancelText}>
                      {t("cancel")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={confirmVerification}
                  >
                    <Text style={styles.modalButtonText}>{t("yesVerify")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

async function registerForPushNotificationsAsync() {
  try {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Gagal mendapatkan permission notifikasi!");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("✅ Token:", token);
    } else {
      alert("Harus dijalankan di perangkat fisik!");
    }

    return token;
  } catch (e) {
    console.log("❌ Error saat register notifikasi:", e);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
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
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  },
  prefixContainer: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  prefix: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
  },
  input: {
    flex: 1,
    height: 60,
    fontSize: 16,
    color: "#111827",
    paddingHorizontal: 16,
    fontWeight: "500",
  },
  phoneHint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    fontStyle: "italic",
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
  },
  otpNote: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 12,
    textAlign: "center",
  },
  button: {
    height: 60,
    backgroundColor: "#B0174C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
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
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  footerLink: {
    fontSize: 14,
    color: "#B0174C",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successEmoji: {
    fontSize: 24,
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorEmoji: {
    fontSize: 24,
  },
  confirmIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fef7ed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmEmoji: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: "#B0174C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButtonCancel: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
  },
  languageSwitcher: {
    position: "absolute",
    top: 40,
    right: 24,
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },
  languageButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  languageButtonActive: {
    backgroundColor: "#B0174C",
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  languageButtonTextActive: {
    color: "#ffffff",
  },
});