import { Stack } from "expo-router";
import useAuthGuard from "../hooks/useAuthGuard";

export default function RootLayout() {
  useAuthGuard();
  return (
    <Stack>
      <Stack.Screen
        name="detailChat"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
