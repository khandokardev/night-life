import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="welcome"          options={{ animation: 'none' }} />
      <Stack.Screen name="onboarding"       options={{ animation: 'fade' }} />
      <Stack.Screen name="sign-in"          options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="sign-up"          options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="otp"              options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="forgot-password"  options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
