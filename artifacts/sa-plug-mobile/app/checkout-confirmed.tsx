import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shareQR } from '@/utils/share';
import { buildQRData, buildQRUrl, openCalendar, saveQR } from '@/utils/qr';
import { useApp } from '@/context/AppContext';

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

export default function CheckoutConfirmedScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { clearCart, markCheckoutComplete } = useApp();

  const { venue, ref: paramRef, date, time, pkg } = useLocalSearchParams<{
    venue?: string; ref?: string; date?: string; time?: string; pkg?: string;
  }>();

  const venueName   = venue   ?? 'ONYX Sandton';

  useEffect(() => {
    clearCart();
    markCheckoutComplete();
  }, []);
  const bookingRef  = paramRef ?? 'SAPVIP-482291';
  const bookingDate = date     ?? '24 May 2026';
  const bookingTime = time     ?? '22:00';
  const packageName = pkg      ?? 'VIP Table + Bottle Service';

  const qrData = buildQRData({ ref: bookingRef, venue: venueName, date: bookingDate, time: bookingTime });
  const qrUrl  = buildQRUrl(qrData);

  const [saveState, setSaveState]   = useState<'idle' | 'saving' | 'saved'>('idle');
  const [shareState, setShareState] = useState<'idle' | 'sharing'>('idle');
  const [calAdded, setCalAdded]     = useState(false);

  const handleSaveQR = async () => {
    if (saveState !== 'idle') return;
    setSaveState('saving');
    const result = await saveQR(qrUrl, bookingRef);
    if (result === 'saved') {
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 3000);
    } else {
      setSaveState('idle');
    }
  };

  const handleShareQR = async () => {
    if (shareState !== 'idle') return;
    setShareState('sharing');
    await shareQR({
      qrUrl,
      refCode: bookingRef,
      title: `SA PLUG Booking — ${venueName}`,
      message: `SA PLUG Booking Confirmed!\n📍 ${venueName}\n📦 ${packageName}\n📅 ${bookingDate} at ${bookingTime}\n🔖 Ref: ${bookingRef}`,
    });
    setShareState('idle');
  };

  const handleAddToCalendar = async () => {
    await openCalendar({
      title: `SA PLUG: ${venueName}`,
      dateStr: bookingDate,
      timeStr: bookingTime,
      refCode: bookingRef,
      venue: venueName,
    });
    setCalAdded(true);
    setTimeout(() => setCalAdded(false), 3000);
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.headerPad, { paddingTop: insets.top + WEB_TOP }]} />
      <CheckoutStepper step={3} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        <View style={styles.heroSection}>
          <View style={[styles.outerCircle, { borderColor: tc.accent + '60', backgroundColor: tc.accent + '18' }]}>
            <LinearGradient
              colors={tc.isDark ? ['#1C1500', '#2A1F00'] : [tc.accent + '10', tc.accent + '06']}
              style={[styles.innerCircle, { borderColor: tc.accent + '60' }]}
            >
              <Text style={{ fontSize: 36 }}>✦</Text>
            </LinearGradient>
            <View style={styles.checkBadge}>
              <Feather name="check" size={14} color="#fff" />
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Booking Confirmed!</Text>
          <Text style={[styles.heroSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            You're all set. Get ready for an{'\n'}unforgettable experience.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Booking Summary</Text>
          <View style={[styles.summaryCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <View style={[styles.summaryThumb, { backgroundColor: tc.card2 }]}>
              <Text style={{ fontSize: 28 }}>🎵</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.summaryTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{packageName}</Text>
              <Text style={[styles.summarySub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{venueName}</Text>
              <View style={styles.metaRow}>
                <Feather name="calendar" size={10} color={tc.accent} />
                <Text style={[styles.metaTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{bookingDate}</Text>
                <Feather name="clock" size={10} color={tc.accent} />
                <Text style={[styles.metaTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{bookingTime}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.qrCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Text style={[styles.qrCardTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Entry QR Code</Text>
            <Text style={[styles.qrCardSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Present at venue entrance for VIP access</Text>
            <View style={styles.qrCenter}>
              <View style={styles.qrBg}>
                <Image source={{ uri: qrUrl }} style={styles.qrImg} contentFit="contain" />
              </View>
            </View>
            <Text style={[styles.refTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{bookingRef}</Text>
            <View style={styles.qrActions}>
              <TouchableOpacity
                style={[styles.qrBtn, { borderColor: tc.accent }]}
                onPress={handleSaveQR}
                activeOpacity={0.8}
              >
                <Feather name={saveState === 'saved' ? 'check' : 'download'} size={14} color={tc.accent} />
                <Text style={[styles.qrBtnTxt, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>
                  {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved!' : 'Save QR'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.qrBtn, { borderColor: tc.border }]}
                onPress={handleShareQR}
                activeOpacity={0.8}
              >
                <Feather name="share-2" size={14} color={tc.text2} />
                <Text style={[styles.qrBtnTxt, { color: tc.text2, fontFamily: 'Poppins_600SemiBold' }]}>
                  {shareState === 'sharing' ? 'Sharing…' : 'Share'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.calBtn, { backgroundColor: tc.inputBg, borderColor: calAdded ? tc.accent + '80' : tc.border }]}
            onPress={handleAddToCalendar}
            activeOpacity={0.8}
          >
            <Feather name="calendar" size={18} color={tc.accent} />
            <Text style={[styles.calBtnTxt, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
              {calAdded ? '✓ Added to Calendar!' : 'Add to Calendar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/profile-bookings')} activeOpacity={0.88} style={styles.primaryBtn}>
            <LinearGradient colors={tc.accentGradColors} style={styles.primaryGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Text style={[styles.primaryTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>View My Bookings</Text>
              <Feather name="chevron-right" size={18} color={tc.isDark ? '#000' : '#fff'} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(tabs)')} style={[styles.secondaryBtn, { borderColor: tc.border, backgroundColor: tc.inputBg }]} activeOpacity={0.8}>
            <Feather name="home" size={18} color={tc.accent} />
            <Text style={[styles.secondaryTxt, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerPad: {},
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: 11 },
  stepLabel: { fontSize: 10 },
  stepLine: { width: 40, height: 1, marginBottom: 16, marginHorizontal: 4 },
  heroSection: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 },
  outerCircle: { width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, marginBottom: 16 },
  innerCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  checkBadge: { position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 24, marginBottom: 8 },
  heroSub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  sectionTitle: { fontSize: 15, marginBottom: 12 },
  summaryCard: { flexDirection: 'row', gap: 12, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  summaryThumb: { width: 60, height: 60, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  summaryTitle: { fontSize: 13, marginBottom: 2 },
  summarySub: { fontSize: 12, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt: { fontSize: 11, marginRight: 6 },
  qrCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  qrCardTitle: { fontSize: 14, marginBottom: 4 },
  qrCardSub: { fontSize: 12, marginBottom: 14 },
  qrCenter: { alignItems: 'center', marginBottom: 10 },
  qrBg: { backgroundColor: '#ffffff', borderRadius: 12, padding: 8 },
  qrImg: { width: 148, height: 148 },
  refTxt: { fontSize: 12, textAlign: 'center', marginBottom: 12 },
  qrActions: { flexDirection: 'row', gap: 8 },
  qrBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  qrBtnTxt: { fontSize: 12 },
  calBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  calBtnTxt: { fontSize: 14 },
  primaryBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 10 },
  primaryGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  primaryTxt: { fontSize: 15 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  secondaryTxt: { fontSize: 15 },
});
