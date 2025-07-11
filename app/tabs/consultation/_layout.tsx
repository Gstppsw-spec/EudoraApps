import useAuthGuard from '@/app/hooks/useAuthGuard';
import { Stack } from 'expo-router';

export default function RootLayout() {
  useAuthGuard();
  return (
    <Stack
      screenOptions={{
        headerShown:false
      }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
