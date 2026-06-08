import { useApp } from '@/context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Alert, Dimensions, Platform, StyleSheet, Text,
  TouchableOpacity, View, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD, GOLD_DARK } from '@/constants/colors';
import { AppleIcon, GoogleIcon, FacebookIcon } from '@/components/SocialIcons';

const { height } = Dimensions.get('window');
const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

const SOCIALS = [
  { label: 'Apple',    Icon: AppleIcon    },
  { label: 'Google',   Icon: GoogleIcon   },
  { label: 'Facebook', Icon: FacebookIcon },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { loginAsGuest } = useApp();

  const handleSocial = (provider: string) => {
    Alert.alert(
      `${provider} Login`,
      `${provider} sign-in is not available in this demo. Please use email or create an account.`,
      [{ text: 'OK' }]
    );
  };

  const handleGuest = () => {
    loginAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Image
        source={require('../../assets/images/welcome-bg.jpg')}
        style={[StyleSheet.absoluteFill, { opacity: 0.14 }]}
        contentFit="cover"
      />
      {/* 4-stop vignette: dark top+bottom, lighter mid-frame reveals the image */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.10)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.97)']}
        locations={[0, 0.28, 0.60, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: insets.top + WEB_TOP }]}>

        {/* Logo — centered in the upper half */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImg}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text style={[styles.tagline, { fontFamily: 'Inter_400Regular' }]}>
            The World's Premier Luxury Nightlife & Experiences Platform
          </Text>
        </View>

        {/* CTA area — anchored at bottom */}
        <View style={[styles.ctaSection, { paddingBottom: insets.bottom + WEB_BOT + 24 }]}>

        {/* CTA Buttons */}
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <LinearGradient colors={[GOLD, GOLD_DARK]} style={styles.btnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={[styles.btnPrimaryTxt, { fontFamily: 'Poppins_700Bold' }]}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnOutline, { borderColor: GOLD }]}
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={[styles.btnOutlineTxt, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divRow}>
          <View style={[styles.divLine, { backgroundColor: 'rgba(255,255,255,0.10)' }]} />
          <Text style={[styles.divTxt, { fontFamily: 'Inter_400Regular' }]}>or continue with</Text>
          <View style={[styles.divLine, { backgroundColor: 'rgba(255,255,255,0.10)' }]} />
        </View>

        {/* Social buttons */}
        <View style={styles.socialRow}>
          {SOCIALS.map(({ label, Icon }) => (
            <TouchableOpacity
              key={label}
              style={[styles.socialBtn, {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.10)',
              }]}
              activeOpacity={0.8}
              onPress={() => handleSocial(label)}
            >
              <Icon size={22} color="#fff" />
              <Text style={[styles.socialTxt, { fontFamily: 'Inter_500Medium' }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue as Guest */}
        <TouchableOpacity style={styles.guestBtn} onPress={handleGuest} activeOpacity={0.7}>
          <Text style={[styles.guestTxt, { fontFamily: 'Inter_400Regular' }]}>Continue as Guest</Text>
          <Feather name="chevron-right" size={13} color="rgba(255,255,255,0.35)" />
        </TouchableOpacity>

        {/* Terms */}
        <View style={styles.termsRow}>
          <Text style={[styles.termsTxt, { fontFamily: 'Inter_400Regular' }]}>By continuing, you agree to our </Text>
          <TouchableOpacity onPress={() => router.push('/legal-terms')} activeOpacity={0.7}>
            <Text style={[styles.termsLink, { color: GOLD, fontFamily: 'Inter_500Medium' }]}>Terms</Text>
          </TouchableOpacity>
          <Text style={[styles.termsTxt, { fontFamily: 'Inter_400Regular' }]}> & </Text>
          <TouchableOpacity onPress={() => router.push('/legal-privacy')} activeOpacity={0.7}>
            <Text style={[styles.termsLink, { color: GOLD, fontFamily: 'Inter_500Medium' }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, paddingHorizontal: 24 },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  logoImg: { width: 220, height: 184 },
  ctaSection: {},
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.50)', textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 },
  btns: { gap: 12, marginBottom: 24 },
  btnPrimary: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: GOLD, shadowOpacity: 0.4, shadowRadius: 16, elevation: 6,
  },
  btnGrad: { paddingVertical: 17, alignItems: 'center', borderRadius: 16 },
  btnPrimaryTxt: { fontSize: 15, color: '#000', letterSpacing: 1 },
  btnOutline: { borderRadius: 16, borderWidth: 1.5, paddingVertical: 16, alignItems: 'center' },
  btnOutlineTxt: { fontSize: 15, letterSpacing: 1 },
  divRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  divLine: { flex: 1, height: StyleSheet.hairlineWidth },
  divTxt: { fontSize: 12, color: 'rgba(255,255,255,0.38)' },
  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  socialBtn: { flex: 1, paddingVertical: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 6 },
  socialTxt: { fontSize: 11, color: 'rgba(255,255,255,0.55)' },
  guestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 10, marginBottom: 16,
  },
  guestTxt: { fontSize: 13, color: 'rgba(255,255,255,0.40)' },
  termsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  termsTxt: { fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 17 },
  termsLink: { fontSize: 11, lineHeight: 17 },
});
