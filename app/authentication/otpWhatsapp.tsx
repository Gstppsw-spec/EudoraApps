import { useMutation } from "@tanstack/react-query";
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
  ActivityIndicator,
  Modal,
  Image
} from "react-native";
import useStore from "../../store/useStore";

const sendOtp = async (formData: any) => {
  const response = await axios.post(
    "https://sys.eudoraclinic.com:84/apieudora/send_otp",
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
    "https://sys.eudoraclinic.com:84/apieudora/verify_otp",
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

  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      console.log(data);
      
      if (data.status) {
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
    if (phone) {
      mutation.mutate({
        phone: phone,
      });
    } else {
      setShowErrorModal(true);
    }
  };

  const mutatioVerifyOtp = useMutation({
    mutationFn: verifyOtpUser,
    onSuccess: (data) => {
      if (data.status) {
        setCustomerId(data.customerId);
        setHasPin(data.has_pin);
        if (data.has_pin) {
          router.replace("/tabs/home");
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
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/logo.jpg')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Selamat Datang</Text>
            <Text style={styles.subtitle}>
              {step === 1 
                ? "Masukkan nomor WhatsApp untuk melanjutkan" 
                : "Masukkan kode verifikasi yang telah dikirim"}
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {step === 1 ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nomor WhatsApp</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.prefixContainer}>
                    <Text style={styles.prefix}>+62</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="8123456789"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Kode Verifikasi</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="Masukkan 6 digit kode"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  textAlign="center"
                  maxLength={6}
                />
                <Text style={styles.otpNote}>
                  Kode dikirim ke +62{phone}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.button,
                (mutation.isPending || mutatioVerifyOtp.isPending) && styles.buttonDisabled
              ]}
              onPress={step === 1 ? handleSendOtp : handleVerifyOtp}
              disabled={mutation.isPending || mutatioVerifyOtp.isPending}
            >
              {mutation.isPending || mutatioVerifyOtp.isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  {step === 1 ? "Kirim Kode OTP" : "Konfirmasi"}
                </Text>
              )}
            </TouchableOpacity>

            {step === 2 && (
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleSendOtp}
              >
                <Text style={styles.resendText}>Tidak menerima kode? </Text>
                <Text style={styles.resendLink}>Kirim ulang</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity
              onPress={() => router.push("/authentication/registerUsers")}
            >
              <Text style={styles.footerLink}>Daftar</Text>
            </TouchableOpacity>
          </View>

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
                <Text style={styles.modalTitle}>Berhasil!</Text>
                <Text style={styles.modalMessage}>
                  OTP telah dikirim ke nomor WhatsApp Anda
                </Text>
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
                  Harap masukkan nomor WhatsApp terlebih dahulu
                </Text>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => setShowErrorModal(false)}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
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
                <Text style={styles.modalTitle}>Konfirmasi</Text>
                <Text style={styles.modalMessage}>
                  Apakah Anda yakin ingin memverifikasi kode OTP?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.modalButtonCancel}
                    onPress={() => setShowConfirmModal(false)}
                  >
                    <Text style={styles.modalButtonCancelText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalButton}
                    onPress={confirmVerification}
                  >
                    <Text style={styles.modalButtonText}>Ya, Verifikasi</Text>
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
    letterSpacing: 4,
  },
  otpNote: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 12,
    textAlign: "center",
  },
  button: {
    height: 60,
    backgroundColor: "#FEBA43",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#FEBA43",
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
    color: "#FEBA43",
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
    color: "#FEBA43",
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
    backgroundColor: "#FEBA43",
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
});