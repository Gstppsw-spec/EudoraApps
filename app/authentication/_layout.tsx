import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="otpWhatsapp"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="registerUsers"
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen
        name="setPin"
        options={{
          headerShown: false,
        }}
      />

    </Stack>

  );
}
