import { useApp } from '@/context/AppContext';
import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { AppleIcon, GoogleIcon, FacebookIcon } from '@/components/SocialIcons';
import { CountryCodePickerModal, DEFAULT_COUNTRY, type Country } from '@/components/CountryCodePickerModal';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const { height } = Dimensions.get('window');
const IMG_H   = height * 0.38;
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

function validateEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}

export default function SignInScreen() {
  const tc     = useTC();
  const insets = useSafeAreaInsets();
  const { login, loginByPhone, setPendingUser, securityPrefs, updateSecurityPrefs } = useApp();

  const [tab, setTab]             = useState<'email' | 'phone'>('email');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [country, setCountry]     = useState<Country>(DEFAULT_COUNTRY);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const accent = tc.accent;

  const handleSignIn = async () => {
    setError('');
    if (tab === 'email') {
      if (!email.trim()) { setError('Please enter your email address.'); return; }
      if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
      if (!password) { setError('Please enter your password.'); return; }

      setLoading(true);
      const result = await login(email, password);
      setLoading(false);

      if (!result.ok) { setError(result.error || 'Invalid email or password.'); return; }
      router.replace('/(tabs)');
    } else {
      if (!phone.trim() || phone.trim().length < 6) {
        setError('Please enter a valid phone number.'); return;
      }
      const identifier = `${country.code}${phone.trim()}`;
      setLoading(true);
      const result = await loginByPhone(identifier);
      setLoading(false);
      if (!result.ok) { setError(result.error || 'No account found with this phone number.'); return; }
      router.push({ pathname: '/(auth)/otp', params: { mode: 'login', identifier } });
    }
  };

  const handleSocial = (provider: string) => {
    Alert.alert(
      `${provider} Login`,
      `${provider} sign-in is not available in this demo. Please use email or phone instead.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[s.root, { backgroundColor: tc.authSheet }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top image hero */}
      <View style={{ height: IMG_H, position: 'relative' }}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=900&fit=crop&q=85' }}
          style={[StyleSheet.absoluteFill, { opacity: 0.14 }]}
          contentFit="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.52)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.80)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.heroLogoWrap} pointerEvents="none">
          <Image
            source={require('../../assets/images/logo.png')}
            style={s.heroLogo}
            contentFit="contain"
          />
        </View>
        <TouchableOpacity
          style={[s.backBtn, { top: insets.top + 12 }]}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/welcome')}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      <KeyboardAvoidingView
        style={[s.sheet, { backgroundColor: tc.authSheet, marginTop: -32 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[s.sheetContent, { paddingBottom: insets.bottom + WEB_BOT + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[s.heading, { color: tc.authText, fontFamily: 'Poppins_700Bold' }]}>Log In</Text>
          <Text style={[s.sub, { color: tc.authSub, fontFamily: 'Inter_400Regular' }]}>
            Welcome back! Glad to see you again.
          </Text>

          {/* Email / Phone toggle */}
          <View style={[s.toggle, { backgroundColor: tc.authTabBg, borderColor: tc.authTabBd }]}>
            {(['email', 'phone'] as const).map(t => {
              const isActive = tab === t;
              const activeTxt = tc.isDark ? '#000' : '#fff';
              return (
              <TouchableOpacity
                key={t}
                style={[s.toggleBtn, isActive && { backgroundColor: tc.accent }]}
                onPress={() => { setTab(t); setError(''); }}
                activeOpacity={0.85}
              >
                <View style={s.toggleInner}>
                  <Feather name={t === 'email' ? 'mail' : 'phone'} size={14} color={isActive ? activeTxt : tc.authIcon} />
                  <Text style={[
                    s.toggleTxt,
                    { color: isActive ? activeTxt : tc.authIcon },
                    isActive && { fontFamily: 'Poppins_600SemiBold' },
                  ]}>
                    {t === 'email' ? 'Email' : 'Phone'}
                  </Text>
                </View>
              </TouchableOpacity>
              );
            })}
          </View>

          {/* Fields */}
          <View style={s.fields}>
            {tab === 'email' ? (
              <>
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
                <View style={[s.field, { backgroundColor: tc.authInputBg, borderColor: tc.authBorder }]}>
                  <Feather name="lock" size={17} color={tc.authIcon} style={s.fieldIcon} />
                  <TextInput
                    style={[s.input, { color: tc.authText, fontFamily: 'Inter_400Regular', flex: 1 }]}
                    placeholder="Password"
                    placeholderTextColor={tc.authIcon}
                    value={password}
                    onChangeText={v => { setPassword(v); setError(''); }}
                    secureTextEntry={!showPw}
                  />
                  <TouchableOpacity onPress={() => setShowPw(s => !s)} style={s.eyeBtn}>
                    <Feather name={showPw ? 'eye-off' : 'eye'} size={17} color={tc.authIcon} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={s.forgotRow}
                  onPress={() => router.push('/(auth)/forgot-password')}
                >
                  <Text style={[s.forgotTxt, { color: accent, fontFamily: 'Inter_500Medium' }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </>
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
                <Text style={[s.otpNote, { color: tc.authSub, fontFamily: 'Inter_400Regular' }]}>
                  We'll send a one-time code to verify your number.
                </Text>
              </>
            )}

            {!!error && (
              <View style={s.errorBanner}>
                <Feather name="alert-circle" size={14} color="#EF4444" />
                <Text style={[s.errorTxt, { fontFamily: 'Inter_400Regular' }]}>{error}</Text>
              </View>
            )}
          </View>

          {/* Remember Me row — email tab only */}
          {tab === 'email' && (
            <TouchableOpacity
              onPress={() => updateSecurityPrefs({ rememberDevice: !securityPrefs.rememberDevice })}
              style={[s.rememberRow, { borderColor: tc.authBorder }]}
              activeOpacity={0.8}
            >
              <View style={[
                s.checkbox,
                {
                  borderColor: securityPrefs.rememberDevice ? tc.accent : tc.authBorder,
                  backgroundColor: securityPrefs.rememberDevice ? tc.accent : 'transparent',
                },
              ]}>
                {securityPrefs.rememberDevice && (
                  <Feather name="check" size={11} color={tc.isDark ? '#000' : '#fff'} />
                )}
              </View>
              <Text style={[s.rememberTxt, { color: tc.authSub, fontFamily: 'Inter_400Regular' }]}>
                Remember this device
              </Text>
            </TouchableOpacity>
          )}

          {/* Sign In button */}
          <TouchableOpacity
            style={[s.btnWrap, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleSignIn}
            activeOpacity={0.85}
            disabled={loading}
          >
            <LinearGradient
              colors={tc.accentGradColors}
              style={s.btn}
              start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}
            >
              {loading ? (
                <ActivityIndicator color={tc.isDark ? '#000' : '#fff'} size="small" />
              ) : (
                <View style={s.btnInner}>
                  <Text style={[s.btnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                    {tab === 'phone' ? 'Send OTP' : 'Log In'}
                  </Text>
                  <Feather
                    name={tab === 'email' ? 'chevron-right' : 'message-square'}
                    size={tab === 'email' ? 18 : 16}
                    color={tc.isDark ? '#000' : '#fff'}
                    style={{ marginTop: 1 }}
                  />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.divider}>
            <View style={[s.divLine, { backgroundColor: tc.authDivider }]} />
            <Text style={[s.divTxt, { color: tc.authDivText, fontFamily: 'Inter_400Regular' }]}>or continue with</Text>
            <View style={[s.divLine, { backgroundColor: tc.authDivider }]} />
          </View>

          {/* Social buttons */}
          <View style={s.socialRow}>
            {([
              { key: 'Apple',    Icon: AppleIcon    },
              { key: 'Google',   Icon: GoogleIcon   },
              { key: 'Facebook', Icon: FacebookIcon },
            ] as const).map(({ key, Icon }) => (
              <TouchableOpacity
                key={key}
                style={[s.socialBtn, { backgroundColor: tc.authSocialBg, borderColor: tc.authSocialBd }]}
                activeOpacity={0.85}
                onPress={() => handleSocial(key)}
              >
                <Icon size={22} color={tc.isDark ? '#fff' : '#1A1A2E'} />
                <Text style={[s.socialTxt, { color: tc.authSocialText, fontFamily: 'Inter_500Medium' }]}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Alt link */}
          <View style={s.altRow}>
            <Text style={[s.altQ, { color: tc.authSub, fontFamily: 'Inter_400Regular' }]}>
              Don't have an account?{'  '}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
              <Text style={[s.altLink, { color: accent, fontFamily: 'Poppins_600SemiBold' }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  backBtn: {
    position: 'absolute', left: 20, width: 40, height: 40,
    borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroLogoWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  heroLogo: { width: 170, height: 142 },
  sheet: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetContent: { paddingHorizontal: 24, paddingTop: 28 },
  heading: { fontSize: 26, marginBottom: 6 },
  sub: { fontSize: 14, marginBottom: 20 },

  toggle: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  toggleInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toggleTxt: { fontSize: 14, fontFamily: 'Inter_400Regular' },

  fields: { gap: 12, marginBottom: 20 },
  field: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, minHeight: 52,
  },
  fieldIcon: { marginRight: 12 },
  input: { flex: 1, height: 52, fontSize: 14 },
  eyeBtn: { padding: 8 },

  phoneRow:  { flexDirection: 'row', gap: 10 },
  phoneField: { flex: 1 },

  forgotRow: { alignSelf: 'flex-end' },
  forgotTxt: { fontSize: 13 },

  otpNote: { fontSize: 13, lineHeight: 20 },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(239,68,68,0.10)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  errorTxt: { color: '#EF4444', fontSize: 13, flex: 1 },

  btnWrap: { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  btn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnTxt: { fontSize: 15, letterSpacing: 0.5 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  divLine: { flex: 1, height: StyleSheet.hairlineWidth },
  divTxt: { fontSize: 12 },

  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  socialBtn: { flex: 1, paddingVertical: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 5 },
  socialTxt: { fontSize: 11 },

  altRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  altQ: { fontSize: 14 },
  altLink: { fontSize: 14 },

  rememberRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 16, paddingVertical: 2,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  rememberTxt: { fontSize: 13 },
});
