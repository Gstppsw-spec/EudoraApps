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
} from "react-native";
import useStore from "../../store/useStore";

const verifyPinUsers = async (formData: any) => {
  const response = await axios.post(
    "https://sys.eudoraclinic.com:84/apieudora/verify_pin",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default function VerifyPin() {
  const pendingRoute = useStore((state) => state.pendingRoute);
  const setPendingRoute = useStore((state) => state.setPendingRoute);
  const router = useRouter();
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const [pin, setPin] = useState("");

  const mutation = useMutation({
    mutationFn: verifyPinUsers,
    onSuccess: (data) => {
      if (data.status) {
        if (pendingRoute) {
          router.push("/" + pendingRoute);
          setPendingRoute(null);
        } else {
          router.replace("/tabs/home");
        }
      } else {
        Alert.alert("PIN Salah", data.message);
      }
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      Alert.alert("Error", "Terjadi kesalahan saat verifikasi PIN");
    },
  });

  const handleVerifyPinUsers = () => {
    if (pin.length < 4 || pin.length > 6) {
      Alert.alert("PIN tidak valid", "PIN harus 4-6 digit");
      return;
    }
    // Lolos semua validasi
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
          <Text style={styles.title}>Masukkan PIN Anda</Text>
          <Text style={styles.instruction}>
            Untuk keamanan, silakan masukkan PIN 6 digit Anda
          </Text>

          <TextInput
            style={styles.input}
            placeholder="******"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={setPin}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyPinUsers}
          >
            <Text style={styles.buttonText}>Verifikasi PIN</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFB900",
    textAlign: "center",
    marginBottom: 10,
  },
  instruction: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFB900",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFB900",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
