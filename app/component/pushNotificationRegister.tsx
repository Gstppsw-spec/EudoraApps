import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Constants from 'expo-constants';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import useStore from "../../store/useStore";

const apiUrl = Constants.expoConfig?.extra?.apiUrl

const sendTokenNotification = async (formData: any) => {
  const response = await axios.post(
    `${apiUrl}/save_push_token`,
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
    mutationFn: sendTokenNotification
  });

  useEffect(() => {
    if (customerId && hasPin) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          mutation.mutate({
            customerid: customerId,
            push_token: token,
          });
        }
      });
    }
  }, [customerId, hasPin]);
  return null;
}

async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "984b7594-fc42-4a01-9042-c76436228bf1",
      })
    ).data;
    return token;
  } catch (error) {
    return null;
  }
}
