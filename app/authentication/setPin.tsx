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
          <Text style={styles.title}>Buat PIN Baru</Text>
          <Text style={styles.instruction}>
            Silakan buat PIN 4-6 digit untuk keamanan login
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Masukkan PIN"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={setPin}
          />

          <TextInput
            style={styles.input}
            placeholder="Ulangi PIN"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            value={confirmPin}
            onChangeText={setConfirmPin}
          />

          <TouchableOpacity style={styles.button} onPress={handleSetPin}>
            <Text style={styles.buttonText}>Simpan PIN</Text>
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
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FFB900",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
