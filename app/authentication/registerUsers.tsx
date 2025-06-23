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

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const sendOtp = async () => {
    try {
      await axios.post(
        "https://yourdomain.com/index.php/auth/send_otp_register",
        {
          phone,
          firstname,
          lastname,
        }
      );
      setStep(2);
    } catch (err: any) {
      Alert.alert(err?.response?.data?.message || "Gagal kirim OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "https://yourdomain.com/index.php/auth/verify_otp",
        { phone, otp }
      );
      if (res.data.status) {
        router.replace("/tabs/home");
      } else {
        Alert.alert("OTP Salah atau Kadaluarsa");
      }
    } catch {
      Alert.alert("Terjadi kesalahan");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {step === 1 ? (
            <>
              <Text style={styles.label}>Nama Depan</Text>
              <TextInput
                style={styles.input}
                value={firstname}
                onChangeText={setFirstname}
              />

              <Text style={styles.label}>Nama Belakang</Text>
              <TextInput
                style={styles.input}
                value={lastname}
                onChangeText={setLastname}
              />

              <Text style={styles.label}>Nomor WhatsApp</Text>
              <TextInput
                style={styles.input}
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <TouchableOpacity style={styles.button} onPress={sendOtp}>
                <Text style={styles.buttonText}>Kirim OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>Masukkan OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Kode OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
              />
              <TouchableOpacity style={styles.button} onPress={verifyOtp}>
                <Text style={styles.buttonText}>Verifikasi OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFB900",
    textAlign: "center",
    marginBottom: 30,
  },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#FFB900",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFB900",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
