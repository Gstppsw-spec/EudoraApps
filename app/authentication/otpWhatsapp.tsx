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
  const router = useRouter();
  const setCustomerId = useStore((state) => state.setCustomerId);
  const setHasPin = useStore((state) => state.setHasPin);

  const mutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
        console.log(data);
        
      if (data.status) {
        setStep(2);
      } else {
        Alert.alert("Nomor Whatsapp anda tidak terdaftar");
      }
    },
    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });

  const handleSendOtp = () => {
    if (phone) {
      mutation.mutate({
        phone: phone,
      });
    } else {
      alert("Please input whatsapp number");
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
        Alert.alert("OTP Salah atau Kadaluarsa");
      }
    },
    onError: (error) => {
      console.error("Error posting data:", error);
    },
  });

  const handleVerifyOtp = () => {
    if (phone && otp) {
      mutatioVerifyOtp.mutate({
        phone: phone,
        otp: otp,
      });
    } else {
      alert("Please input whatsapp number");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.welcome}>Selamat datang!</Text>
          <Text style={styles.instruction}>
            Masuk menggunakan nomor WhatsApp kamu
          </Text>

          {step === 1 ? (
            <>
              <Text style={styles.label}>Nomor WhatsApp</Text>
              <TextInput
                style={styles.input}
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
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
              <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
                <Text style={styles.buttonText}>Verifikasi</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push("/authentication/register")}
            >
              <Text style={styles.switchLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
    color: "#333",
  },
  switchLink: {
    fontSize: 14,
    color: "#FFB900",
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFB900",
    textAlign: "center",
    marginBottom: 8,
  },
  instruction: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
});
