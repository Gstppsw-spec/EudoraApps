import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" />
      {/* <Stack.Screen name="settings" /> */}
    </Stack>
  );
}
