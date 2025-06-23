import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen
        name="booking"
        options={{
          headerShown: true,
          title: "BOOK APPOINTMENT",
        }}
      />
      <Stack.Screen name="mybooking" />
    </Stack>
  );
}
