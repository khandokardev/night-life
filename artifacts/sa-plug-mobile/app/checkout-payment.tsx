import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const BASE_TOTAL = 1200;

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

const PROMOS: Record<string, { discount: number; type: 'pct' | 'fixed' }> = {
  'SAPVIP10': { discount: 10, type: 'pct' },
  'PLUG20': { discount: 200, type: 'fixed' },
  'GOLD15': { discount: 15, type: 'pct' },
};

export default function CheckoutPaymentScreen() {
  const tc = useTC();
  const { isLoggedIn } = useApp();
  const insets = useSafeAreaInsets();

  const [payMethod, setPayMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number; type: 'pct' | 'fixed' } | null>(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/sign-in');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const applyPromo = () => {
    const code = promo.toUpperCase().trim();
    if (PROMOS[code]) {
      setPromoApplied({ code, ...PROMOS[code] });
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try SAPVIP10, PLUG20 or GOLD15');
      setPromoApplied(null);
    }
  };

  const discountAmt = promoApplied
    ? promoApplied.type === 'pct' ? Math.round(BASE_TOTAL * promoApplied.discount / 100) : promoApplied.discount
    : 0;
  const finalTotal = BASE_TOTAL - discountAmt;

  const PAY_METHODS = [
    { id: 'card' as const, label: 'Card', sub: 'Visa, Mastercard, Amex', icon: 'credit-card' },
    { id: 'apple' as const, label: 'Apple Pay', sub: null, icon: 'smartphone' },
    { id: 'google' as const, label: 'Google Pay', sub: null, icon: 'smartphone' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <CheckoutStepper step={2} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 130 }}>
        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Payment Method</Text>
        <View style={{ gap: 10 }}>
          {PAY_METHODS.map(({ id, label, sub, icon }) => {
            const sel = payMethod === id;
            return (
              <TouchableOpacity
                key={id}
                onPress={() => setPayMethod(id)}
                style={[styles.payOption, { backgroundColor: sel ? tc.accent + '08' : tc.card, borderColor: sel ? tc.accent : tc.border }]}
                activeOpacity={0.8}
              >
                <View style={[styles.payIconWrap, { backgroundColor: sel ? tc.accent + '18' : tc.inputBg }]}>
                  <Feather name={icon as any} size={20} color={sel ? tc.accent : tc.text2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.payLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{label}</Text>
                  {sub && <Text style={[styles.paySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{sub}</Text>}
                </View>
                <View style={[styles.radio, { borderColor: sel ? tc.accent : tc.border2 }]}>
                  {sel && <View style={[styles.radioDot, { backgroundColor: tc.accent }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Promo Code</Text>
        <View style={[styles.promoWrap, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <Feather name="tag" size={15} color={tc.accent} style={{ marginRight: 8 }} />
          <TextInput
            value={promo}
            onChangeText={v => { setPromo(v); setPromoError(''); }}
            placeholder="SAPVIP10 · PLUG20 · GOLD15"
            placeholderTextColor={tc.muted}
            autoCapitalize="characters"
            style={[styles.promoInput, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
          />
          <TouchableOpacity onPress={applyPromo} activeOpacity={0.8}>
            <Text style={[styles.applyTxt, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>Apply</Text>
          </TouchableOpacity>
        </View>
        {promoError ? <Text style={styles.promoError}>{promoError}</Text> : null}
        {promoApplied ? <Text style={styles.promoSuccess}>✓ {promoApplied.code} applied — R{discountAmt} off!</Text> : null}

        <View style={[styles.summaryCard, { backgroundColor: tc.card, borderColor: tc.border, marginTop: 20 }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLbl, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Booking Total</Text>
            <Text style={[styles.summaryVal, { color: tc.text, fontFamily: 'Inter_400Regular' }]}>R{BASE_TOTAL.toLocaleString()}</Text>
          </View>
          {promoApplied && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLbl, { color: '#22c55e', fontFamily: 'Inter_400Regular' }]}>{promoApplied.code} discount</Text>
              <Text style={[styles.summaryVal, { color: '#22c55e', fontFamily: 'Inter_400Regular' }]}>-R{discountAmt}</Text>
            </View>
          )}
          <View style={[styles.totalRow, { borderTopColor: tc.border }]}>
            <View>
              <Text style={[styles.totalLabel, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Total Amount</Text>
              <Text style={[styles.totalNote, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Inclusive of taxes and fees</Text>
            </View>
            <Text style={[styles.totalAmount, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{finalTotal.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: tc.navBg, borderTopColor: tc.border, paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity onPress={() => router.push('/checkout-confirmed')} activeOpacity={0.88} style={styles.ctaBtn}>
          <LinearGradient colors={tc.accentGradColors} style={styles.ctaGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
            <Feather name="lock" size={16} color={tc.isDark ? '#000' : '#fff'} />
            <Text style={[styles.ctaTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Pay R{finalTotal.toLocaleString()}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={[styles.legalNote, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
          By paying you agree to our{' '}
          <Text style={{ color: tc.accent }} onPress={() => router.push('/legal-payment')}>Payment Terms</Text>
          {' '}and{' '}
          <Text style={{ color: tc.accent }} onPress={() => router.push('/legal-refund')}>Refund Policy</Text>.
        </Text>
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
  payOption: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5 },
  payIconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  payLabel: { fontSize: 14 },
  paySub: { fontSize: 11, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  promoWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1 },
  promoInput: { flex: 1, fontSize: 14, paddingVertical: 12 },
  applyTxt: { fontSize: 14, paddingVertical: 8, paddingHorizontal: 4 },
  promoError: { color: '#ef4444', fontSize: 12, marginTop: 6 },
  promoSuccess: { color: '#22c55e', fontSize: 12, marginTop: 6, fontFamily: 'Poppins_600SemiBold' },
  summaryCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLbl: { fontSize: 14 },
  summaryVal: { fontSize: 14 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  totalLabel: { fontSize: 15 },
  totalNote: { fontSize: 11, marginTop: 2 },
  totalAmount: { fontSize: 26 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  ctaBtn: { borderRadius: 16, overflow: 'hidden' },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  ctaTxt: { fontSize: 15 },
  legalNote: { fontSize: 11, textAlign: 'center', marginTop: 10, lineHeight: 16 },
});
