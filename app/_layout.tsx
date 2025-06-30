import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";
import NotificationListener from "../app/component/notificationListener";
import PushNotificationRegister from "../app/component/pushNotificationRegister";
import { toastConfig } from "../config/toastConfig";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PushNotificationRegister />
      <NotificationListener />
      <Slot />
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
