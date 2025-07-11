import { Stack } from "expo-router";
import useAuthGuard from "../hooks/useAuthGuard";

export default function RootLayout() {
  useAuthGuard();
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="yourTeatment"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
