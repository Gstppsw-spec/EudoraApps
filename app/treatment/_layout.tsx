import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="yourTreatment"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
