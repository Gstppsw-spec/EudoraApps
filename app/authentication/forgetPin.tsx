import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
} from "react-native";
import useStore from "../../store/useStore";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const setPinUsers = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/set_pinRequest`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const sendOtp = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/send_otp`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export default function SetPin() {
  const router = useRouter();
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const { t } = useTranslation();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const setHasPin = useStore((state) => state.setHasPin);
  const [otp, setOtp] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const customerDetails = useStore((state) => state.customerDetails);

  const mutationRequest = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      if (data.status) {
        Alert.alert("Success", "Code berhasil dikirim kembali");
      } else {
        Alert.alert("Error", "Nomor WhatsApp anda tidak terdaftar");
      }
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      Alert.alert("Error", "Gagal mengirim OTP");
    },
  });

  const mutation = useMutation({
    mutationFn: setPinUsers,
    onSuccess: (data) => {
      if (data.status) {
        setHasPin(true);
        router.replace("/tabs/home");
        registerForPushNotificationsAsync().then((token) => {});
      } else {
        Alert.alert("Gagal", data.message || "Gagal menyimpan PIN");
      }
    },
    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });

  const handleSetPin = () => {
    if (pin.length < 4 || pin.length > 6) {
      Alert.alert("PIN tidak valid", "PIN harus 4-6 digit");
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert("PIN tidak sama", "Konfirmasi PIN harus sama");
      return;
    }

    mutation.mutate({
      customerId: customerId,
      pin: pin,
      otp: otp,
    });
  };

  const handleSendOtp = () => {
    if (!customerDetails?.phone) {
      setShowErrorModal(true);
      return;
    }

    mutationRequest.mutate({
      phone: `${customerDetails?.phone}`,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Buat PIN Baru</Text>
            <Text style={styles.subtitle}>
              Buat PIN 4-6 digit untuk keamanan akun Anda
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>PIN Baru</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan 4-6 digit PIN"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                value={pin}
                onChangeText={setPin}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi PIN</Text>
              <TextInput
                style={styles.input}
                placeholder="Ulangi PIN Anda"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                value={confirmPin}
                onChangeText={setConfirmPin}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>OTP Request</Text>
              <TextInput
                style={styles.input}
                placeholder="OTP Request"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                textAlign="center"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                mutation.isPending && styles.buttonDisabled,
              ]}
              onPress={handleSetPin}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Simpan PIN</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.resendButton} onPress={handleSendOtp}>
            <Text style={styles.resendText}>{t("didNotReceiveCode")}</Text>
            <Text style={styles.resendLink}>{t("resend")}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Pastikan PIN mudah diingat tetapi sulit ditebak
            </Text>
          </View>
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
    } else {
      alert("Harus dijalankan di perangkat fisik!");
    }

    return token;
  } catch (e) {

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 300,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#1e293b",
    textAlign: "center",
    letterSpacing: 2,
  },
  button: {
    backgroundColor: "#B0174C",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#B0174C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
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
});
