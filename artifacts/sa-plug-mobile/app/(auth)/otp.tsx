import { useApp } from '@/context/AppContext';
import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Platform, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const CODE_LEN = 6;
const WEB_TOP  = Platform.OS === 'web' ? 67 : 0;

export default function OTPScreen() {
  const tc     = useTC();
  const insets = useSafeAreaInsets();
  const { mode, identifier } = useLocalSearchParams<{ mode?: string; identifier?: string }>();
  const { authenticate, register, pendingUser, setPendingUser } = useApp();

  const [code, setCode]           = useState<string[]>(Array(CODE_LEN).fill(''));
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const inputs   = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeTxt = tc.isDark ? '#000' : '#fff';

  const startCountdown = useCallback(() => {
    setCountdown(45); setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { setCanResend(true); if (timerRef.current) clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startCountdown]);

  const handleChange = (val: string, idx: number) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...code]; next[idx] = cleaned; setCode(next);
    setError('');
    if (cleaned && idx < CODE_LEN - 1) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
      const next = [...code]; next[idx - 1] = ''; setCode(next);
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    if (otp.length < CODE_LEN) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    if (mode === 'forgot') {
      setLoading(false);
      router.replace('/set-password');
      return;
    }

    if (mode === 'signup' && pendingUser) {
      const result = await register({
        name: pendingUser.name || 'User',
        email: pendingUser.email,
        phone: pendingUser.phone,
        password: pendingUser.password,
      });
      if (!result.ok) {
        setLoading(false);
        setError(result.error || 'Registration failed. Please try again.');
        setCode(Array(CODE_LEN).fill(''));
        inputs.current[0]?.focus();
        return;
      }
    }

    const userToAuth = pendingUser
      ? { name: pendingUser.name || 'User', email: pendingUser.email, phone: pendingUser.phone }
      : { name: 'User', phone: identifier };
    authenticate(userToAuth);
    setPendingUser(null);
    setLoading(false);
    router.replace('/(tabs)');
  };

  const handleResend = () => {
    if (!canResend) return;
    setCode(Array(CODE_LEN).fill(''));
    setError('');
    startCountdown();
    inputs.current[0]?.focus();
  };

  const isFull   = code.every(d => !!d);
  const subtitle = mode === 'forgot'
    ? 'Enter the 6-digit code to reset your password'
    : identifier
      ? `Enter the 6-digit code sent to\n${identifier}`
      : 'Enter the 6-digit code we sent you';

  return (
    <View style={[s.root, { backgroundColor: tc.bg, paddingTop: insets.top + WEB_TOP }]}>
      <StatusBar barStyle={tc.isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      <TouchableOpacity
        style={[s.back, { backgroundColor: tc.card, borderColor: tc.border2 }]}
        onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/sign-up')}
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={20} color={tc.text} />
      </TouchableOpacity>

      <View style={s.body}>
        <View style={[s.iconWrap, { backgroundColor: tc.accent + '14', borderColor: tc.accent + '40' }]}>
          <Feather name="shield" size={34} color={tc.accent} />
        </View>

        <Text style={[s.heading, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
          {mode === 'forgot' ? 'Verify Identity' : 'Verify Your Number'}
        </Text>
        <Text style={[s.sub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{subtitle}</Text>

        {!!error && (
          <View style={s.errorBanner}>
            <Feather name="alert-circle" size={14} color="#EF4444" />
            <Text style={[s.errorTxt, { fontFamily: 'Inter_400Regular' }]}>{error}</Text>
          </View>
        )}

        <View style={s.boxes}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={el => { inputs.current[i] = el; }}
              style={[
                s.box,
                {
                  borderColor: digit ? tc.accent : tc.border2,
                  backgroundColor: digit ? tc.accent + '08' : tc.inputBg,
                  color: tc.text,
                },
                !!error ? { borderColor: '#EF4444' } : undefined,
              ]}
              value={digit}
              onChangeText={v => handleChange(v, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[s.btnWrap, { opacity: isFull && !loading ? 1 : 0.45 }]}
          onPress={handleVerify}
          disabled={!isFull || loading}
          activeOpacity={0.85}
        >
          <LinearGradient colors={tc.accentGradColors} style={s.btn} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
            {loading
              ? <ActivityIndicator color={activeTxt} size="small" />
              : <Text style={[s.btnTxt, { color: activeTxt, fontFamily: 'Poppins_700Bold' }]}>Verify Code</Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        {!canResend && (
          <Text style={[s.countdownTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            Resend code in{' '}
            <Text style={{ color: tc.accent, fontFamily: 'Inter_500Medium' }}>
              0:{countdown.toString().padStart(2, '0')}
            </Text>
          </Text>
        )}

        <View style={s.resendRow}>
          <Text style={[s.resendQ, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Didn't receive code?{'  '}</Text>
          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text style={[s.resendLink, { color: canResend ? tc.accent : tc.text3, fontFamily: 'Inter_500Medium' }]}>
              RESEND
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  back: {
    width: 40, height: 40, borderRadius: 20, marginLeft: 20, marginTop: 8,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 40 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40, marginBottom: 28,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
  },
  heading: { fontSize: 28, textAlign: 'center', marginBottom: 12 },
  sub: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(239,68,68,0.10)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20, width: '100%',
  },
  errorTxt: { color: '#EF4444', fontSize: 13, flex: 1 },
  boxes: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  box: {
    width: 48, height: 56, borderRadius: 12,
    borderWidth: 1.5, fontSize: 24, fontFamily: 'Poppins_700Bold',
  },
  btnWrap: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  btn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  btnTxt: { fontSize: 15, letterSpacing: 0.5 },
  countdownTxt: { fontSize: 13, marginBottom: 14, textAlign: 'center' },
  resendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  resendQ: { fontSize: 13 },
  resendLink: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  hint: { fontSize: 11, textAlign: 'center' },
});
