import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="otpWhatsapp" />
      <Stack.Screen name="registerUsers" />
      <Stack.Screen name="setPin" />
      <Stack.Screen name="verifyPin" />
    </Stack>
  );
}
