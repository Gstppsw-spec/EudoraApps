import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="mybooking" options={{
        headerShown: false,
        gestureEnabled: true,
      }}/>
      {/* <Stack.Screen name="details" options={{
        title: 'Detail Notification'
      }}/> */}
    </Stack>
  );
}
