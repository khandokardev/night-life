import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
  useFonts as usePoppinsFonts,
} from "@expo-google-fonts/poppins";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, Text, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// ── Android global text fixes ────────────────────────────────────────────────
// 1. includeFontPadding: false — removes Android's built-in extra glyph padding
//    that makes text look taller/blockier than iOS.
// 2. allowFontScaling: false — prevents Android's system accessibility font-size
//    setting from stretching the app's carefully sized typography.
if (Platform.OS === 'android') {
  const androidTextStyle = { includeFontPadding: false } as const;
  (Text as any).defaultProps = { ...((Text as any).defaultProps ?? {}), allowFontScaling: false, style: androidTextStyle };
  (TextInput as any).defaultProps = { ...((TextInput as any).defaultProps ?? {}), allowFontScaling: false, style: androidTextStyle };
}
// ────────────────────────────────────────────────────────────────────────────
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useApp } from "@/context/AppContext";
import { NotificationsProvider } from "@/context/NotificationsContext";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

function ThemeGate({ children }: { children: React.ReactNode }) {
  const { themeReady } = useApp();
  if (!themeReady) return null;
  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="club-detail" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="tour-detail" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="restaurant-detail" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="shop-detail" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="cart" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="search" options={{ animation: "fade" }} />
      <Stack.Screen name="reservations" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="chat" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="notifications" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="booking-modify" options={{ animation: "slide_from_right" }} />
      {/* Checkout flow */}
      <Stack.Screen name="checkout-details" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="checkout-payment" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="checkout-confirmed" options={{ animation: "slide_from_right" }} />
      {/* Booking & Deals */}
      <Stack.Screen name="booking-detail" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="deals" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="trending" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="events" options={{ animation: "slide_from_right" }} />
      {/* Profile sub-screens */}
      <Stack.Screen name="profile-bookings" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-saved" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-payment" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-notifications" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-vip" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-settings" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-help" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-edit" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-password" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-privacy" options={{ animation: "slide_from_right" }} />
      {/* Legal screens */}
      <Stack.Screen name="legal-terms" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="legal-privacy" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="legal-refund" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="legal-payment" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="legal-disclaimer" options={{ animation: "slide_from_right" }} />
      {/* Auth extras */}
      <Stack.Screen name="set-password" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [interLoaded, interError] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [poppinsLoaded, poppinsError] = usePoppinsFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });
  const [iconsLoaded, iconsError] = useFonts(Feather.font);
  const fontsReady =
    (interLoaded || !!interError) &&
    (poppinsLoaded || !!poppinsError) &&
    (iconsLoaded || !!iconsError);

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <AppProvider>
      <ThemeGate>
        <NotificationsProvider>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </QueryClientProvider>
          </SafeAreaProvider>
        </NotificationsProvider>
      </ThemeGate>
    </AppProvider>
  );
}
