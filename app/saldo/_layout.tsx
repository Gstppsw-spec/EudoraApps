import { Stack } from "expo-router";
import useAuthGuard from "../hooks/useAuthGuard";

export default function RootLayout() {
  useAuthGuard();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="withdraw"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="bank_account"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add_bank_account"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
