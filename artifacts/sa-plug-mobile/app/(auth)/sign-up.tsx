import { useApp } from '@/context/AppContext';
import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { AppleIcon, GoogleIcon, FacebookIcon } from '@/components/SocialIcons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';
import { CountryCodePickerModal, DEFAULT_COUNTRY, type Country } from '@/components/CountryCodePickerModal';

const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

const HERO_LEFT  = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80';
const HERO_RIGHT = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80';

function Sparkle({ size = 14, color = GOLD }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: size * 0.18, height: size, backgroundColor: color, borderRadius: size }} />
      <View style={{ position: 'absolute', width: size, height: size * 0.18, backgroundColor: color, borderRadius: size }} />
      <View style={{ position: 'absolute', width: size * 0.13, height: size * 0.8, backgroundColor: color, borderRadius: size, transform: [{ rotate: '45deg' }] }} />
      <View style={{ position: 'absolute', width: size * 0.13, height: size * 0.8, backgroundColor: color, borderRadius: size, transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
}

function validateEmail(e: string) {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(e.trim());
}

function validateName(n: string) {
  const trimmed = n.trim();
  if (trimmed.length < 2) return false;
  if (!/[a-zA-Z]/.test(trimmed)) return false;
  if (/[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(trimmed)) return false;
  return true;
}

function validatePassword(p: string) {
  if (p.length < 8) return { ok: false, msg: 'Password must be at least 8 characters.' };
  if (!/[a-zA-Z]/.test(p)) return { ok: false, msg: 'Password must contain at least one letter.' };
  if (!/[0-9]/.test(p)) return { ok: false, msg: 'Password must contain at least one number.' };
  return { ok: true, msg: '' };
}

function sanitizePhone(v: string) {
  return v.replace(/[^0-9]/g, '');
}

export default function SignUpScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { checkEmailExists, setPendingUser } = useApp();

  const [tab, setTab]           = useState<'email' | 'phone'>('email');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [showCp, setShowCp]     = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [country, setCountry]   = useState<Country>(DEFAULT_COUNTRY);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const accent = tc.accent;
  const activeTxt = tc.isDark ? '#000' : '#fff';

  const handleSubmit = async () => {
    setError('');

    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!validateName(name)) {
      setError('Please enter a valid full name (letters and spaces only, no numbers or symbols).');
      return;
    }

    if (tab === 'email') {
      if (!email.trim())          { setError('Please enter your email address.'); return; }
      if (!validateEmail(email))  { setError('Please enter a valid email address (e.g. user@example.com).'); return; }
      if (!password)              { setError('Please enter a password.'); return; }
      const pwCheck = validatePassword(password);
      if (!pwCheck.ok)            { setError(pwCheck.msg); return; }
      if (password !== confirmPw) { setError('Passwords do not match.'); return; }
    } else {
      const digits = sanitizePhone(phone);
      if (digits.length < 7) { setError('Please enter a valid phone number (digits only, at least 7 digits).'); return; }
      if (digits.length > 15) { setError('Phone number is too long.'); return; }
    }

    if (!agreed) { setError('Please accept the Terms of Service and Privacy Policy to continue.'); return; }

    setLoading(true);

    if (tab === 'phone') {
      const identifier = `${country.code}${sanitizePhone(phone)}`;
      setPendingUser({ name: name.trim(), phone: identifier });
      setLoading(false);
      router.push({ pathname: '/(auth)/otp', params: { mode: 'signup', identifier } });
      return;
    }

    const exists = await checkEmailExists(email.trim());
    setLoading(false);

    if (exists) { setError('An account with this email already exists.'); return; }

    setPendingUser({ name: name.trim(), email: email.trim(), password });
    router.push({ pathname: '/(auth)/otp', params: { mode: 'signup', identifier: email.trim() } });
  };

  const handleSocial = (provider: string) => {
    Alert.alert(
      `${provider} Login`,
      `${provider} sign-in is not available in this demo. Please use email or phone instead.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      <StatusBar barStyle={tc.isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      {/* Hero */}
      <View style={[s.hero, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={tc.isDark ? ['#1A1200', '#0A0800', '#0A0A0A'] : ['#EDE8F5', '#DDD5F0', '#F0ECF7'] as [string,string,string]}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity
          style={[s.backBtn, { top: insets.top + 12 }]}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/welcome')}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={s.circlesWrap}>
          <View style={[s.circleOuter, s.circleLeft]}>
            <Image source={{ uri: HERO_LEFT }} style={StyleSheet.absoluteFill} contentFit="cover" />
          </View>
          <View style={[s.circleOuter, s.circleCenter]}>
            <Image source={require('../../assets/images/logo.png')} style={s.logoImg} contentFit="contain" />
          </View>
          <View style={[s.circleOuter, s.circleRight]}>
            <Image source={{ uri: HERO_RIGHT }} style={StyleSheet.absoluteFill} contentFit="cover" />
          </View>
          <View style={s.sparkleTop}><Sparkle size={18} color={GOLD} /></View>
          <View style={s.sparkleTopRight}><Sparkle size={10} color="#C87E5B" /></View>
          <View style={s.sparkleTopLeft}><Sparkle size={10} color="#5BC8A0" /></View>
        </View>
      </View>

      {/* Bottom sheet */}
      <KeyboardAvoidingView
        style={[s.sheet, { backgroundColor: tc.authSheet }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[s.content, { paddingBottom: insets.bottom + WEB_BOT + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[s.heading, { color: tc.authText, fontFamily: 'Poppins_700Bold' }]}>Create Account</Text>
          <Text style={[s.sub, { color: tc.authSub, fontFamily: 'Inter_400Regular' }]}>
            Let's get you started on your next adventure.
          </Text>

          {/* Toggle */}
          <View style={[s.toggle, { backgroundColor: tc.authTabBg, borderColor: tc.authTabBd }]}>
            {(['email', 'phone'] as const).map(m => (
              <TouchableOpacity
                key={m}
                style={[s.toggleBtn, tab === m && { backgroundColor: accent }]}
                onPress={() => { setTab(m); setError(''); }}
                activeOpacity={0.85}
              >
                <View style={s.toggleBtnInner}>
                  <Feather name={m === 'email' ? 'mail' : 'phone'} size={14} color={tab === m ? activeTxt : tc.authIcon} />
                  <Text style={[
                    s.toggleTxt,
                    { color: tab === m ? activeTxt : tc.authIcon },
                    tab === m && { fontFamily: 'Poppins_600SemiBold' },
                  ]}>
                    {m === 'email' ? 'Email' : 'Phone'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.fields}>
            {/* Full Name */}
            <View style={[s.field, { backgroundColor: tc.authInputBg, borderColor: tc.authBorder }]}>
              <Feather name="user" size={17} color={tc.authIcon} style={s.fieldIcon} />
              <TextInput
                style={[s.input, { color: tc.authText, fontFamily: 'Inter_400Regular' }]}
                placeholder="Full Name"
                placeholderTextColor={tc.authIcon}
                value={name}
                onChangeText={v => { setName(v); setError(''); }}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

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
                  <TouchableOpacity onPress={() => setShowPw(v => !v)} style={s.eyeBtn}>
                    <Feather name={showPw ? 'eye-off' : 'eye'} size={17} color={tc.authIcon} />
                  </TouchableOpacity>
                </View>
                <View style={[s.field, { backgroundColor: tc.authInputBg, borderColor: tc.authBorder }]}>
                  <Feather name="lock" size={17} color={tc.authIcon} style={s.fieldIcon} />
                  <TextInput
                    style={[s.input, { color: tc.authText, fontFamily: 'Inter_400Regular', flex: 1 }]}
                    placeholder="Confirm Password"
                    placeholderTextColor={tc.authIcon}
                    value={confirmPw}
                    onChangeText={v => { setConfirmPw(v); setError(''); }}
                    secureTextEntry={!showCp}
                  />
                  <TouchableOpacity onPress={() => setShowCp(v => !v)} style={s.eyeBtn}>
                    <Feather name={showCp ? 'eye-off' : 'eye'} size={17} color={tc.authIcon} />
                  </TouchableOpacity>
                </View>
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
                      onChangeText={v => { setPhone(sanitizePhone(v)); setError(''); }}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <View style={s.otpBanner}>
                  <Feather name="message-square" size={13} color={accent} style={{ marginTop: 1, flexShrink: 0 }} />
                  <Text style={[s.otpBannerTxt, { fontFamily: 'Inter_400Regular', color: tc.isDark ? '#B3913A' : accent }]}>
                    A 6-digit OTP will be sent via SMS to verify your number.
                  </Text>
                </View>
              </>
            )}

            {!!error && (
              <View style={s.errorBanner}>
                <Feather name="alert-circle" size={14} color="#EF4444" />
                <Text style={[s.errorTxt, { fontFamily: 'Inter_400Regular' }]}>{error}</Text>
              </View>
            )}
          </View>

          {/* Terms checkbox */}
          <View style={s.checkRow}>
            <TouchableOpacity onPress={() => setAgreed(a => !a)} activeOpacity={0.8}>
              <View style={[
                s.checkbox,
                { borderColor: agreed ? accent : tc.border2, backgroundColor: agreed ? accent : 'transparent' },
              ]}>
                {agreed && <Feather name="check" size={11} color={activeTxt} />}
              </View>
            </TouchableOpacity>
            <Text style={[s.checkTxt, { color: tc.authSub, fontFamily: 'Inter_400Regular' }]}>
              I agree to the{' '}
              <Text
                style={{ color: accent }}
                onPress={() => router.push('/legal-terms')}
              >Terms of Service</Text>
              {' '}and{' '}
              <Text
                style={{ color: accent }}
                onPress={() => router.push('/legal-privacy')}
              >Privacy Policy</Text>
            </Text>
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[s.btnWrap, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            <LinearGradient
              colors={tc.accentGradColors}
              start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}
              style={s.btn}
            >
              {loading ? (
                <ActivityIndicator color={activeTxt} size="small" />
              ) : (
                <View style={s.btnInner}>
                  <Text style={[s.btnTxt, { fontFamily: 'Poppins_700Bold', color: activeTxt }]}>
                    {tab === 'email' ? 'Create Account' : 'Send OTP'}
                  </Text>
                  <Feather
                    name={tab === 'email' ? 'chevron-right' : 'message-square'}
                    size={tab === 'email' ? 18 : 17}
                    color={activeTxt}
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
              Already have an account?{'  '}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
              <Text style={[s.altLink, { color: accent, fontFamily: 'Poppins_600SemiBold' }]}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  hero: { height: 220, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 20 },
  backBtn: {
    position: 'absolute', left: 20, width: 40, height: 40,
    borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  circlesWrap: { width: 240, height: 130, position: 'relative' },
  circleOuter: { position: 'absolute', borderRadius: 60, overflow: 'hidden', borderWidth: 2 },
  circleLeft:   { width: 96, height: 96, bottom: 0, left: 0, borderColor: 'rgba(212,175,55,0.4)', zIndex: 10 },
  circleCenter: {
    width: 112, height: 112, bottom: 16, left: '50%', marginLeft: -56,
    borderColor: 'rgba(212,175,55,0.6)', zIndex: 20,
    backgroundColor: '#1A1200', alignItems: 'center', justifyContent: 'center',
  },
  circleRight:  { width: 96, height: 96, bottom: 0, right: 0, borderColor: 'rgba(212,175,55,0.4)', zIndex: 10 },
  logoImg: { width: 72, height: 72 },
  sparkleTop:      { position: 'absolute', top: -4, left: '50%', marginLeft: -9, zIndex: 30 },
  sparkleTopRight: { position: 'absolute', top: 20, right: 8, zIndex: 30 },
  sparkleTopLeft:  { position: 'absolute', top: 32, left: 8, zIndex: 30 },

  sheet: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -24 },
  content: { paddingHorizontal: 24, paddingTop: 28 },
  heading: { fontSize: 26, marginBottom: 4 },
  sub: { fontSize: 14, marginBottom: 20 },

  toggle: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  toggleBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toggleTxt: { fontSize: 14, fontFamily: 'Inter_400Regular' },

  fields: { gap: 12, marginBottom: 16 },
  field: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, minHeight: 52,
  },
  fieldIcon: { marginRight: 12 },
  input: { flex: 1, height: 52, fontSize: 14 },
  eyeBtn: { padding: 8 },

  phoneRow:   { flexDirection: 'row', gap: 10 },
  phoneField: { flex: 1 },

  otpBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    backgroundColor: 'rgba(212,175,55,0.06)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)',
  },
  otpBannerTxt: { flex: 1, fontSize: 11, color: '#B3913A', lineHeight: 17 },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(239,68,68,0.10)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  errorTxt: { color: '#EF4444', fontSize: 13, flex: 1 },

  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  checkbox: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  checkTxt: { flex: 1, fontSize: 12, lineHeight: 19 },

  btnWrap: { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  btn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnTxt: { fontSize: 15, color: '#000', letterSpacing: 0.5 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  divLine: { flex: 1, height: StyleSheet.hairlineWidth },
  divTxt: { fontSize: 12 },

  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  socialBtn: { flex: 1, paddingVertical: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 5 },
  socialTxt: { fontSize: 11 },

  altRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  altQ: { fontSize: 14 },
  altLink: { fontSize: 14 },
});
