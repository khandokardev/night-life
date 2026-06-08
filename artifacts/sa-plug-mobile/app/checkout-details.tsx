import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert, Platform, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

function CheckoutStepper({ step }: { step: number }) {
  const tc = useTC();
  const steps = ['Details', 'Payment', 'Confirmation'];
  return (
    <View style={styles.stepper}>
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <React.Fragment key={label}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, (active || done) ? { backgroundColor: tc.accent } : { borderWidth: 1.5, borderColor: tc.border2 }]}>
                {done
                  ? <Feather name="check" size={12} color="#fff" />
                  : <Text style={[styles.stepNum, { color: active ? '#fff' : tc.text3, fontFamily: 'Poppins_700Bold' }]}>{num}</Text>}
              </View>
              <Text style={[styles.stepLabel, { color: active ? tc.text : tc.text3, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
            </View>
            {i < 2 && <View style={[styles.stepLine, { backgroundColor: num < step ? tc.accent : tc.border2 }]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function validateFullName(v: string): string {
  const trimmed = v.trim();
  if (!trimmed) return 'Full name is required.';
  if (/[0-9]/.test(trimmed)) return 'Name must not contain numbers.';
  if (/[!@#$%^&*()_+={}\[\];:'"<>,?/\\|`~]/.test(trimmed)) return 'Name must not contain special characters.';
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 2) return 'Please enter your first and last name.';
  if (words.some(w => w.length < 2)) return 'Each name must be at least 2 characters.';
  return '';
}

function validatePhone(v: string): string {
  const trimmed = v.trim();
  if (!trimmed) return 'Phone number is required.';
  const digitsOnly = trimmed.replace(/[\s\-\+\(\)]/g, '');
  if (!/^\d+$/.test(digitsOnly)) return 'Phone number must contain digits only.';
  if (digitsOnly.length < 7) return 'Phone number is too short (min 7 digits).';
  if (digitsOnly.length > 15) return 'Phone number is too long (max 15 digits).';
  return '';
}

function validateEmail(v: string): string {
  const trimmed = v.trim();
  if (!trimmed) return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address.';
  return '';
}

export default function CheckoutDetailsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please log in or create an account to proceed to checkout.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
          { text: 'Log In', onPress: () => router.replace('/(auth)/sign-in') },
        ],
        { cancelable: false }
      );
    }
  }, [isLoggedIn]);

  const validateField = (key: string, value: string): string => {
    if (key === 'name') return validateFullName(value);
    if (key === 'phone') return validatePhone(value);
    if (key === 'email') return validateEmail(value);
    return '';
  };

  const handleBlur = (key: string, value: string) => {
    setTouched(t => ({ ...t, [key]: true }));
    const err = validateField(key, value);
    setFieldErrors(e => ({ ...e, [key]: err }));
  };

  const handleChange = (key: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (touched[key]) {
      const err = validateField(key, value);
      setFieldErrors(e => ({ ...e, [key]: err }));
    }
  };

  const handleContinue = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please log in to proceed to checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => router.replace('/(auth)/sign-in') },
        ]
      );
      return;
    }

    const nameErr  = validateFullName(name);
    const phoneErr = validatePhone(phone);
    const emailErr = validateEmail(email);
    const errors: Record<string, string> = {};
    if (nameErr)  errors.name  = nameErr;
    if (phoneErr) errors.phone = phoneErr;
    if (emailErr) errors.email = emailErr;

    setTouched({ name: true, phone: true, email: true });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    if (!agreed) { setTermsError(true); return; }
    router.push('/checkout-payment');
  };

  const formValid =
    !validateFullName(name) &&
    !validatePhone(phone) &&
    !validateEmail(email) &&
    agreed;

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <CheckoutStepper step={1} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Order Summary</Text>
        <View style={[styles.summaryCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <View style={[styles.summaryThumb, { backgroundColor: tc.card2 }]}>
            <Text style={{ fontSize: 32 }}>🎵</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.summaryTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>VIP Table + Bottle Service</Text>
            <Text style={[styles.summarySub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>ONYX Sandton</Text>
            <View style={styles.row}>
              <Feather name="calendar" size={11} color={tc.accent} />
              <Text style={[styles.summaryMeta, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Sat, 24 May 2026 · 10PM</Text>
            </View>
            <View style={styles.row}>
              <Feather name="users" size={11} color={tc.accent} />
              <Text style={[styles.summaryMeta, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>4 Guests</Text>
            </View>
          </View>
          <Text style={[styles.summaryPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R1,200</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Customer Details</Text>
        <View style={{ gap: 12 }}>
          {[
            { key: 'name',  label: 'Full Name',     value: name,  set: setName,  icon: 'user',  kb: 'default' as const,       ph: 'e.g. Alexandra Smith',  hint: 'First and last name required' },
            { key: 'phone', label: 'Phone Number',  value: phone, set: setPhone, icon: 'phone', kb: 'phone-pad' as const,     ph: '+27 XX XXX XXXX',   hint: 'Digits only, 7–15 numbers'    },
            { key: 'email', label: 'Email Address', value: email, set: setEmail, icon: 'mail',  kb: 'email-address' as const, ph: 'your@email.com',    hint: ''                             },
          ].map(({ key, label, value, set, icon, kb, ph, hint }) => {
            const hasError = !!fieldErrors[key];
            const isValid  = touched[key] && !hasError && value.trim().length > 0;
            return (
              <View key={key}>
                <View style={[
                  styles.inputWrap,
                  {
                    backgroundColor: tc.card,
                    borderColor: hasError ? '#ef4444' : isValid ? '#22c55e' : tc.border,
                    borderWidth: hasError || isValid ? 1.5 : 1,
                  },
                ]}>
                  <View style={styles.inputLabelRow}>
                    <Text style={[styles.inputLabel, { color: hasError ? '#ef4444' : tc.text3, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
                    {hint && !hasError && !isValid ? (
                      <Text style={[styles.inputHint, { color: tc.text3 }]}>{hint}</Text>
                    ) : null}
                    {isValid && <Feather name="check-circle" size={13} color="#22c55e" />}
                  </View>
                  <View style={styles.inputRow}>
                    <Feather name={icon as any} size={14} color={hasError ? '#ef4444' : isValid ? '#22c55e' : tc.accent} style={{ marginRight: 8 }} />
                    <TextInput
                      value={value}
                      onChangeText={v => handleChange(key, v, set)}
                      onBlur={() => handleBlur(key, value)}
                      keyboardType={kb}
                      placeholder={ph}
                      style={[styles.inputField, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
                      placeholderTextColor={tc.muted}
                      autoCorrect={false}
                      autoCapitalize={key === 'name' ? 'words' : 'none'}
                    />
                  </View>
                </View>
                {hasError ? (
                  <View style={styles.fieldErrorRow}>
                    <Feather name="alert-circle" size={11} color="#ef4444" />
                    <Text style={styles.fieldError}>{fieldErrors[key]}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.checkRow} onPress={() => { setAgreed(a => !a); setTermsError(false); }} activeOpacity={0.8}>
          <View style={[styles.checkbox, { borderColor: termsError ? '#ef4444' : agreed ? tc.accent : tc.border2, backgroundColor: agreed ? tc.accent : 'transparent' }]}>
            {agreed && <Feather name="check" size={11} color="#fff" />}
          </View>
          <Text style={[styles.checkTxt, { color: termsError ? '#ef4444' : tc.text2, fontFamily: 'Inter_400Regular' }]}>
            I agree to the{' '}
            <Text style={{ color: termsError ? '#ef4444' : tc.accent, fontFamily: 'Inter_500Medium' }}>Terms & Conditions</Text>
          </Text>
        </TouchableOpacity>
        {termsError && (
          <Text style={styles.errorTxt}>Please accept the Terms & Conditions to continue.</Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: tc.navBg, borderTopColor: tc.border, paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity onPress={handleContinue} activeOpacity={0.88} style={[styles.ctaBtn, { opacity: formValid ? 1 : 0.5 }]}>
          <LinearGradient colors={tc.accentGradColors} style={styles.ctaGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
            <Text style={[styles.ctaTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Continue to Payment</Text>
            <Feather name="arrow-right" size={18} color={tc.isDark ? '#000' : '#fff'} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: 11 },
  stepLabel: { fontSize: 10 },
  stepLine: { width: 40, height: 1, marginBottom: 16, marginHorizontal: 4 },
  sectionTitle: { fontSize: 15, marginBottom: 12 },
  summaryCard: { flexDirection: 'row', gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  summaryThumb: { width: 70, height: 70, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryTitle: { fontSize: 14, marginBottom: 2 },
  summarySub: { fontSize: 12, marginBottom: 6 },
  summaryMeta: { fontSize: 11, marginLeft: 4 },
  summaryPrice: { fontSize: 16, alignSelf: 'flex-end' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  inputWrap: { borderRadius: 14, padding: 14 },
  inputLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  inputLabel: { fontSize: 11 },
  inputHint: { fontSize: 10, opacity: 0.7, fontFamily: 'Inter_400Regular' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputField: { flex: 1, fontSize: 14, padding: 0 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkTxt: { fontSize: 14, flex: 1 },
  errorTxt: { color: '#ef4444', fontSize: 12, marginTop: 6, marginLeft: 32 },
  fieldErrorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5, marginLeft: 2 },
  fieldError: { color: '#ef4444', fontSize: 11, fontFamily: 'Inter_400Regular', flex: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  ctaBtn: { borderRadius: 16, overflow: 'hidden' },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  ctaTxt: { fontSize: 15 },
});
