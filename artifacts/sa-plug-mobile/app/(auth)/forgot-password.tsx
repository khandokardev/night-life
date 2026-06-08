import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Platform, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CountryCodePickerModal, DEFAULT_COUNTRY, type Country } from '@/components/CountryCodePickerModal';
import { useApp } from '@/context/AppContext';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

function Sparkle({ size = 14, color = '#D4AF37', style }: { size?: number; color?: string; style?: object }) {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <View style={{ position: 'absolute', width: size * 0.18, height: size, backgroundColor: color, borderRadius: size }} />
      <View style={{ position: 'absolute', width: size, height: size * 0.18, backgroundColor: color, borderRadius: size }} />
      <View style={{ position: 'absolute', width: size * 0.13, height: size * 0.8, backgroundColor: color, borderRadius: size, transform: [{ rotate: '45deg' }] }} />
      <View style={{ position: 'absolute', width: size * 0.13, height: size * 0.8, backgroundColor: color, borderRadius: size, transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
}

function validateEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}

export default function ForgotPasswordScreen() {
  const tc       = useTC();
  const insets   = useSafeAreaInsets();
  const { checkEmailExists, checkPhoneExists } = useApp();

  const [mode, setMode]       = useState<'email' | 'phone'>('email');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [sent, setSent]       = useState(false);

  const activeTxt = tc.isDark ? '#000' : '#fff';

  const handleSend = async () => {
    setError('');
    if (mode === 'email') {
      if (!email.trim()) { setError('Please enter your email address.'); return; }
      if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    } else {
      if (!phone.trim() || phone.trim().length < 6) { setError('Please enter a valid phone number.'); return; }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    if (mode === 'email') {
      const exists = await checkEmailExists(email);
      if (!exists) {
        setLoading(false);
        setError('No account found with this email address. Please create an account first.');
        return;
      }
    } else {
      const fullPhone = `${country.code}${phone}`;
      const exists = await checkPhoneExists(fullPhone);
      if (!exists) {
        setLoading(false);
        setError('No account found with this phone number. Please create an account first.');
        return;
      }
    }

    setLoading(false);
    setSent(true);
    router.push({
      pathname: '/(auth)/otp',
      params: { mode: 'forgot', identifier: mode === 'email' ? email : `${country.code}${phone}` },
    });
  };

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      <StatusBar barStyle={tc.isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + WEB_TOP + 16, paddingBottom: insets.bottom + WEB_BOT + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          style={[s.back, { backgroundColor: tc.card, borderColor: tc.border2 }]}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/sign-in')}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color={tc.text} />
        </TouchableOpacity>

        {/* Icon section */}
        <View style={s.iconSection}>
          <View style={s.sparklesWrap}>
            <View style={[s.outerRing, { borderColor: tc.isDark ? 'rgba(212,175,55,0.25)' : `${tc.accent}30` }]} />
            <LinearGradient
              colors={tc.isDark ? ['#D4AF37', '#8B6914', '#4A3500'] : [tc.accent, `${tc.accent}99`] as [string,string]}
              start={{ x: 0.15, y: 0.05 }} end={{ x: 0.85, y: 0.95 }}
              style={s.iconCircle}
            >
              <Feather name="lock" size={40} color="#fff" />
              <View style={[s.iconCircleBorder, { borderColor: 'rgba(255,255,255,0.15)' }]} />
            </LinearGradient>
            <View style={[s.sparkle, { top: -6, right: -4 }]}><Sparkle size={16} color="#5BC8A0" /></View>
            <View style={[s.sparkle, { top: -4, left: -16 }]}><Sparkle size={12} color={tc.accent} /></View>
            <View style={[s.sparkle, { bottom: -4, right: -20 }]}><Sparkle size={10} color="#C87E5B" /></View>
            <View style={[s.sparkle, { bottom: 8, left: -24 }]}><Sparkle size={14} color={tc.accent} /></View>
          </View>
        </View>

        {/* Main card */}
        <View style={[s.card, { backgroundColor: tc.card, borderColor: tc.border, borderWidth: 1 }]}>
          <Text style={[s.cardTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
            {mode === 'email' ? 'Forgot Password?' : 'Reset via Phone'}
          </Text>
          <Text style={[s.cardSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            {mode === 'email'
              ? "No worries! Enter your email and we'll send you a reset link."
              : "Enter your phone number and we'll send a verification code."}
          </Text>

          {/* Email / Phone toggle */}
          <View style={[s.toggle, { backgroundColor: tc.authTabBg, borderColor: tc.authTabBd }]}>
            {(['email', 'phone'] as const).map(m => (
              <TouchableOpacity
                key={m}
                style={[s.toggleBtn, mode === m && { backgroundColor: tc.accent }]}
                onPress={() => { setMode(m); setError(''); }}
                activeOpacity={0.85}
              >
                <View style={s.toggleInner}>
                  <Feather name={m === 'email' ? 'mail' : 'phone'} size={14} color={mode === m ? activeTxt : tc.authIcon} />
                  <Text style={[
                    s.toggleTxt,
                    { color: mode === m ? activeTxt : tc.authIcon, fontFamily: 'Inter_400Regular' },
                    mode === m && { fontFamily: 'Poppins_600SemiBold' },
                  ]}>
                    {m === 'email' ? 'Email' : 'Phone'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input */}
          {mode === 'email' ? (
            <View style={[s.field, { backgroundColor: tc.authInputBg, borderColor: tc.authBorder }]}>
              <Feather name="mail" size={17} color={tc.authIcon} style={s.fieldIcon} />
              <TextInput
                style={[s.input, { color: tc.authText, fontFamily: 'Inter_400Regular' }]}
                placeholder="Email Address"
                placeholderTextColor={tc.authIcon}
                value={email}
                onChangeText={v => { setEmail(v); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          ) : (
            <>
              <View style={s.phoneRow}>
                <CountryCodePickerModal selected={country} onChange={setCountry} />
                <View style={[s.field, s.phoneField, { backgroundColor: tc.authInputBg, borderColor: tc.authBorder }]}>
                  <Feather name="phone" size={16} color={tc.authIcon} style={s.fieldIcon} />
                  <TextInput
                    style={[s.input, { color: tc.authText, fontFamily: 'Inter_400Regular' }]}
                    placeholder="Phone number"
                    placeholderTextColor={tc.authIcon}
                    value={phone}
                    onChangeText={v => { setPhone(v); setError(''); }}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              <View style={[s.otpBanner, { backgroundColor: `${tc.accent}0A`, borderColor: `${tc.accent}28` }]}>
                <Feather name="message-square" size={13} color={tc.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                <Text style={[s.otpBannerTxt, { fontFamily: 'Inter_400Regular', color: tc.isDark ? '#B3913A' : tc.accent }]}>
                  A 6-digit OTP will be sent via SMS to reset your account.
                </Text>
              </View>
            </>
          )}

          {!!error && (
            <Text style={[s.errorTxt, { fontFamily: 'Inter_400Regular' }]}>{error}</Text>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitWrap, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleSend}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={tc.accentGradColors}
              start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}
              style={s.submitBtn}
            >
              {loading ? (
                <ActivityIndicator color={activeTxt} size="small" />
              ) : (
                <View style={s.submitInner}>
                  <Feather name={mode === 'email' ? 'send' : 'message-square'} size={16} color={activeTxt} />
                  <Text style={[s.submitTxt, { fontFamily: 'Poppins_700Bold', color: activeTxt }]}>
                    {mode === 'email' ? 'Send Reset Link' : 'Send OTP'}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Security card */}
        <View style={[s.securityCard, { backgroundColor: tc.card, borderColor: tc.border2 }]}>
          <View style={[s.shieldCircle, {
            backgroundColor: `${tc.accent}14`,
            borderColor: `${tc.accent}44`,
          }]}>
            <Feather name="shield" size={20} color={tc.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.secureTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Secure & Private</Text>
            <Text style={[s.secureSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              We'll never share your information with anyone.
            </Text>
          </View>
        </View>

        {/* Bottom link */}
        <View style={s.altRow}>
          <Text style={[s.altQ, { color: tc.authSub, fontFamily: 'Inter_400Regular' }]}>Remember your password?{'  '}</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
            <Text style={[s.altLink, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: 24 },

  back: {
    width: 40, height: 40, borderRadius: 20, marginBottom: 24,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },

  iconSection: { alignItems: 'center', marginBottom: 28 },
  sparklesWrap: { position: 'relative', width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  outerRing: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 1,
  },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  iconCircleBorder: {
    position: 'absolute', inset: 0, borderRadius: 48, borderWidth: 1,
  },
  sparkle: { position: 'absolute' },

  card: { borderRadius: 28, padding: 20, marginBottom: 12 },
  cardTitle: { fontSize: 22, marginBottom: 6 },
  cardSub: { fontSize: 13, lineHeight: 20, marginBottom: 18 },

  toggle: {
    flexDirection: 'row', borderWidth: 1,
    borderRadius: 16, padding: 4, marginBottom: 16,
  },
  toggleBtn:   { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  toggleInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toggleTxt:   { fontSize: 14 },

  field: {
    flexDirection: 'row', alignItems: 'center', minHeight: 52,
    borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16,
  },
  fieldIcon: { marginRight: 12 },
  input: { flex: 1, height: 52, fontSize: 14 },

  phoneRow:   { flexDirection: 'row', gap: 10, marginBottom: 0 },
  phoneField: { flex: 1, marginBottom: 0 },

  otpBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginBottom: 16,
    borderWidth: 1,
  },
  otpBannerTxt: { flex: 1, fontSize: 11, lineHeight: 17 },

  errorTxt: { color: '#EF4444', fontSize: 13, textAlign: 'center', marginBottom: 12 },

  submitWrap: { borderRadius: 16, overflow: 'hidden' },
  submitBtn:  { paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  submitInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  submitTxt: { fontSize: 15 },

  securityCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderRadius: 24, padding: 16, marginBottom: 24,
  },
  shieldCircle: {
    width: 40, height: 40, borderRadius: 20, flexShrink: 0,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  secureTitle: { fontSize: 14, marginBottom: 2 },
  secureSub:   { fontSize: 12, lineHeight: 17 },

  altRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 8 },
  altQ:   { fontSize: 14 },
  altLink: { fontSize: 14 },
});
