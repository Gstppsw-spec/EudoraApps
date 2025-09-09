import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import useStore from "../../store/useStore";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

const verifyPinUsers = async (formData: any) => {
  const response = await axios.post(`${apiUrl}/verify_pin`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export default function VerifyPin() {
  const pendingRoute = useStore((state) => state.pendingRoute);
  const setPendingRoute = useStore((state) => state.setPendingRoute);
  const router = useRouter();
  const customerId = useStore((state: { customerid: any }) => state.customerid);
  const [pin, setPin] = useState("");
  const { t } = useTranslation();
  const lang = useStore((state) => state.lang);
  const [isFocused, setIsFocused] = useState(false);

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
        Toast.show({
          type: "error",
          text1: data.message,
          position: "top",
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Terjadi Kesalahan",
        text2: "Terjadi kesalahan saat verifikasi PIN",
        position: "top",
      });
    },
  });

  const handleVerifyPinUsers = () => {
    if (pin.length < 4 || pin.length > 6) {
      Toast.show({
        type: "error",
        text1: "PIN tidak valid",
        text2: "PIN harus 4-6 digit",
        position: "top",
      });
      return;
    }

    mutation.mutate({
      customerId: customerId,
      pin: pin,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.instruction}>{t("pinInstruction")}</Text>

          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            placeholder="******"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={setPin}
            placeholderTextColor={"black"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <TouchableOpacity
            disabled={mutation.isPending}
            style={[styles.button, mutation.isPending && { opacity: 0.5 }]}
            onPress={handleVerifyPinUsers}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.buttonText}>Verify</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => router.push('/authentication/forgetPin')}
          >
            <Text style={styles.resendText}>Forgot PIN ? </Text>
            <Text style={styles.resendLink}>Request Change</Text>
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
    color: "#B0174C",
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
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 24,
    alignItems: "center",
    letterSpacing: 15,
    color: "#000",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  inputFocused: {
    borderColor: "#B0174C",
    shadowColor: "#B0174C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  button: {
    backgroundColor: "#B0174C",
    borderRadius: 10,
    paddingVertical: 16,
    marginTop: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
