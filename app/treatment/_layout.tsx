import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="yourTreatment"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
