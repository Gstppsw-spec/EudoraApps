import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import NotificationListener from "../app/component/notificationListener";
import PushNotificationLocalRegister from "../app/component/pushNotificationLocalRegister";
import PushNotificationRegister from "../app/component/pushNotificationRegister";
import { toastConfig } from "../config/toastConfig";
import "./../languageConfig/i18n";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GestureHandlerRootView  style={{ flex: 1 }}>
      <BottomSheetModalProvider>
      <QueryClientProvider client={queryClient}>
        <PushNotificationRegister />
        <PushNotificationLocalRegister />
        <NotificationListener />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="authentication" />
          <Stack.Screen name="component/onBoarding" />
          <Stack.Screen name="tabs" />
          <Stack.Screen name="treatment" />
          <Stack.Screen name="bookappointment" />
          <Stack.Screen name="mybooking" />
          <Stack.Screen name="Point" />
          <Stack.Screen name="notification" />
          <Stack.Screen name="staff" />
          <Stack.Screen name="static" />
        </Stack>

        <Toast config={toastConfig} />
      </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
