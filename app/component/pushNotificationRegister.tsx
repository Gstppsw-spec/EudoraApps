import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import useStore from "../../store/useStore";

const sendTokenNotification = async (formData: any) => {
  const response = await axios.post(
    "https://sys.eudoraclinic.com:84/apieudora/save_push_token",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default function PushNotificationRegister() {
  const customerId = useStore((state) => state.customerid);
  const hasPin = useStore((state) => state.hasPin);

  const mutation = useMutation({
    mutationFn: sendTokenNotification,
    onSuccess: (data) => {
      console.log("✅ Token berhasil dikirim ke server:", data);
    },
    onError: (error) => {
      console.error("❌ Error posting token:", error);
    },
  });

  useEffect(() => {
    if (customerId && hasPin) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          console.log("✅ Expo Push Token:", token);
          mutation.mutate({
            customerid: customerId,
            push_token: token,
          });
        }else{
            console.log('notoken');
            
        }
      });
    }
  }, [customerId, hasPin]);
  return null;
}

async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      alert("Harus dijalankan di perangkat fisik!");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (error) {
    console.error("❌ Error saat register notifikasi:", error);
    return null;
  }
}
