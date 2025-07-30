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
        name="face"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="body"
        options={{
          headerShown: false
        }}
      />
        <Stack.Screen
        name="product"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="more-category"
        options={{
          headerShown: false
        }}
      />
       <Stack.Screen
        name="anti-aging"
        options={{
          headerShown: false
        }}
      />
       <Stack.Screen
        name="detailproduct"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}
