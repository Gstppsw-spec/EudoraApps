import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
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

const setPinUsers = async (formData: any) => {
  const response = await axios.post(
    "https://sys.eudoraclinic.com:84/apieudora/set_pin",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default function SetPin() {
  const router = useRouter();
  const customerId = useStore((state: { customerid: any }) => state.customerid);

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const mutation = useMutation({
    mutationFn: setPinUsers,
    onSuccess: (data) => {
      if (data.status) {
        router.replace("/tabs/home");
        registerForPushNotificationsAsync().then((token) => {
            if (token) {
              console.log("✅ Expo Push Token:", token);
            } else {
              console.log("❌ Tidak mendapatkan token");
            }
          });
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

            <TouchableOpacity 
              style={[styles.button, mutation.isPending && styles.buttonDisabled]} 
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

      console.log("Status permission:", finalStatus);

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
    letterSpacing: 4,
  },
  button: {
    backgroundColor: "#FEBA43",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#FEBA43",
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
});