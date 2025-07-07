import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown: false
      }}/>
      <Stack.Screen name="details" options={{
        title: 'Personal Data'
      }}/>
  <Stack.Screen name="helpcenter" options={{
        headerShown: false
      }}/>
      <Stack.Screen name="PrivacyPolicy" options={{
        headerShown: false
      }}/>
        <Stack.Screen name="about" options={{
        headerShown: false
      }}/>
    </Stack>
    
  );
}
