import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Modal, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const TIERS = [
  { name: 'GOLD', label: 'Gold Member', pts: '0 – 15,000', price: 'Free', icon: '🥇', perks: ['Priority bookings', '5% cashback on all bookings', 'Free table upgrades', 'Early event access'] },
  { name: 'PLATINUM', label: 'Platinum Member', pts: '15,001 – 50,000', price: 'R299/mo', icon: '💎', perks: ['10% cashback on all bookings', 'Free VIP entry ×4/month', 'Dedicated SA PLUG support', 'Airport lounge access'] },
  { name: 'BLACK', label: 'Black Card Member', pts: '50,001+', price: 'R799/mo', icon: '🖤', perks: ['20% cashback on all bookings', 'Unlimited VIP entry', 'Private jet charter access', 'Personal relationship manager'] },
];

const CARDS = [
  { type: 'Visa', last: '4521', exp: '12/27' },
  { type: 'Mastercard', last: '8832', exp: '06/26' },
];

export default function ProfileVIPScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const vipColor = tc.isDark ? GOLD : tc.accent;
  const vipBg = tc.isDark ? GOLD + '12' : tc.accent + '10';
  const vipBorder = tc.isDark ? GOLD + '40' : tc.accent + '35';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);

  const PTS = [12450, 32800, 67200];
  const MAX = [15000, 50000, 99999];
  const pct = Math.min(100, Math.round((PTS[currentIdx] / MAX[currentIdx]) * 100));

  const handleUpgrade = () => {
    if (selectedIdx === null) return;
    if (TIERS[selectedIdx].price === 'Free') {
      setCurrentIdx(selectedIdx);
      setSelectedIdx(null);
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 3000);
    } else {
      setShowModal(true);
    }
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(() => {
        setCurrentIdx(selectedIdx!);
        setSelectedIdx(null);
        setConfirmed(true);
        setShowModal(false);
        setDone(false);
        setTimeout(() => setConfirmed(false), 3000);
      }, 1200);
    }, 1800);
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>VIP Membership</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        <View style={[styles.statusCard, { backgroundColor: vipBg, borderColor: vipBorder }]}>
          <View style={styles.statusTop}>
            <View style={[styles.tierIcon, { backgroundColor: vipBg }]}>
              <Text style={{ fontSize: 20 }}>{TIERS[currentIdx].icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tierLabel2, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>ACTIVE TIER</Text>
              <Text style={[styles.tierName2, { color: vipColor, fontFamily: 'Poppins_700Bold' }]}>{TIERS[currentIdx].label}</Text>
            </View>
            <View style={[styles.activeBadge, { backgroundColor: vipColor }]}>
              <Text style={[styles.activeTxt, { fontFamily: 'Poppins_700Bold' }]}>ACTIVE</Text>
            </View>
          </View>
          <Text style={[styles.ptsLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>LOYALTY POINTS</Text>
          <Text style={[styles.ptsValue, { color: vipColor, fontFamily: 'Poppins_700Bold' }]}>{PTS[currentIdx].toLocaleString()} pts</Text>
          <View style={[styles.progressBg, { backgroundColor: tc.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
            <LinearGradient
              colors={tc.isDark ? [GOLD, '#C9A000'] : [tc.accent, tc.accentTeal]}
              style={[styles.progressFill, { width: `${pct}%` as any }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={[styles.pctTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{pct}% to next tier</Text>
        </View>

        {confirmed && (
          <View style={styles.confirmedBanner}>
            <Feather name="check-circle" size={18} color="#22c55e" />
            <Text style={[styles.confirmedTxt, { fontFamily: 'Poppins_600SemiBold' }]}>
              Membership upgraded to {TIERS[currentIdx].name}!
            </Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Choose Your Tier</Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {TIERS.map((t, i) => {
            const isCurrent = i === currentIdx;
            const isSelected = i === selectedIdx;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => !isCurrent && setSelectedIdx(isSelected ? null : i)}
                style={[styles.tierCard, {
                  backgroundColor: isCurrent ? vipBg : isSelected ? (tc.isDark ? GOLD + '08' : tc.accent + '08') : tc.card,
                  borderColor: isCurrent || isSelected ? vipColor : tc.border,
                }]}
                activeOpacity={0.85}
              >
                <View style={styles.tierCardTop}>
                  <Text style={{ fontSize: 22, marginRight: 10 }}>{t.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tierCardName, { color: vipColor, fontFamily: 'Poppins_700Bold' }]}>{t.name}</Text>
                    <Text style={[styles.tierCardPts, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{t.pts} points</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.tierCardPrice, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{t.price}</Text>
                    {isCurrent ? (
                      <View style={[styles.currentBadge, { backgroundColor: vipColor }]}>
                        <Text style={[styles.currentTxt, { fontFamily: 'Poppins_700Bold' }]}>CURRENT</Text>
                      </View>
                    ) : (
                      <View style={[styles.selectCircle, { borderColor: isSelected ? vipColor : tc.border, backgroundColor: isSelected ? vipColor : 'transparent' }]}>
                        {isSelected && <Feather name="check" size={10} color="#fff" />}
                      </View>
                    )}
                  </View>
                </View>
                <View style={{ gap: 4 }}>
                  {t.perks.map((p, j) => (
                    <View key={j} style={styles.perkRow}>
                      <Feather name="check" size={11} color={vipColor} />
                      <Text style={[styles.perkTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{p}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedIdx !== null && selectedIdx !== currentIdx && (
          <View style={[styles.ctaBanner, { backgroundColor: tc.accent + '08', borderColor: tc.accent + '30' }]}>
            <Text style={[styles.ctaBannerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
              Upgrading to <Text style={{ color: tc.accent }}>{TIERS[selectedIdx].name}</Text>
            </Text>
            <Text style={[styles.ctaBannerSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              {TIERS[selectedIdx].price === 'Free' ? 'No charge — enjoy your free tier.' : `You will be billed ${TIERS[selectedIdx].price}. Cancel anytime.`}
            </Text>
            <TouchableOpacity onPress={handleUpgrade} style={styles.ctaBtn} activeOpacity={0.88}>
              <LinearGradient colors={tc.accentGradColors} style={styles.ctaGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
                <Text style={[styles.ctaTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                  {TIERS[selectedIdx].price === 'Free' ? 'Confirm Free Upgrade' : 'Proceed to Payment →'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.footnote, { color: tc.muted, fontFamily: 'Inter_400Regular' }]}>
          Membership billed monthly · Cancel anytime · Points carry over
        </Text>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: tc.border2 }]} />
            {done ? (
              <View style={styles.doneWrap}>
                <View style={styles.doneIcon}>
                  <Feather name="check-circle" size={32} color="#22c55e" />
                </View>
                <Text style={[styles.doneTxt, { fontFamily: 'Poppins_700Bold' }]}>Payment Successful!</Text>
                <Text style={[styles.doneSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Activating your {selectedIdx !== null ? TIERS[selectedIdx].name : ''} membership…</Text>
              </View>
            ) : (
              <>
                <View style={styles.modalTop}>
                  <Text style={{ fontSize: 24 }}>{selectedIdx !== null ? TIERS[selectedIdx].icon : ''}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTierName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{selectedIdx !== null ? TIERS[selectedIdx].label : ''}</Text>
                    <Text style={[styles.modalSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Billed monthly · Cancel anytime</Text>
                  </View>
                  <Text style={[styles.modalPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>{selectedIdx !== null ? TIERS[selectedIdx].price : ''}</Text>
                </View>
                <Text style={[styles.cardSelectTitle, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Select Payment Card</Text>
                <View style={{ gap: 8, marginBottom: 16 }}>
                  {CARDS.map((c, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setSelectedCard(i)}
                      style={[styles.cardOption, { backgroundColor: selectedCard === i ? tc.accent + '08' : tc.inputBg, borderColor: selectedCard === i ? tc.accent : tc.border }]}
                      activeOpacity={0.8}
                    >
                      <Feather name="credit-card" size={18} color={selectedCard === i ? tc.accent : tc.text2} />
                      <Text style={[styles.cardOptionTxt, { color: tc.text, fontFamily: 'Inter_500Medium', flex: 1 }]}>{c.type} •••• {c.last}</Text>
                      <Text style={[styles.cardExpTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{c.exp}</Text>
                      <View style={[styles.cardRadio, { borderColor: selectedCard === i ? tc.accent : tc.border2 }]}>
                        {selectedCard === i && <View style={[styles.cardRadioDot, { backgroundColor: tc.accent }]} />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={handlePay}
                  disabled={processing}
                  style={[styles.payBtn, { opacity: processing ? 0.7 : 1 }]}
                  activeOpacity={0.88}
                >
                  <LinearGradient colors={tc.accentGradColors} style={styles.payBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
                    {processing ? <ActivityIndicator color={tc.isDark ? '#000' : '#fff'} size="small" /> : (
                      <>
                        <Feather name="lock" size={15} color={tc.isDark ? '#000' : '#fff'} />
                        <Text style={[styles.payBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                          Pay {selectedIdx !== null ? TIERS[selectedIdx].price : ''} Now
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowModal(false)} style={{ marginTop: 12, alignItems: 'center' }} activeOpacity={0.7}>
                  <Text style={[{ color: tc.text3, fontSize: 14, fontFamily: 'Inter_400Regular' }]}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  statusCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 14 },
  statusTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  tierIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  tierLabel2: { fontSize: 9, letterSpacing: 1, marginBottom: 2 },
  tierName2: { fontSize: 15 },
  activeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  activeTxt: { color: '#fff', fontSize: 9 },
  ptsLabel: { fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  ptsValue: { fontSize: 28, marginBottom: 10 },
  progressBg: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: 8, borderRadius: 4 },
  pctTxt: { fontSize: 12 },
  confirmedBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', borderRadius: 12, padding: 12, marginBottom: 14 },
  confirmedTxt: { color: '#22c55e', fontSize: 13 },
  sectionTitle: { fontSize: 14, marginBottom: 10 },
  tierCard: { borderRadius: 16, padding: 14, borderWidth: 1 },
  tierCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tierCardName: { fontSize: 14 },
  tierCardPts: { fontSize: 11, marginTop: 2 },
  tierCardPrice: { fontSize: 14, marginBottom: 4 },
  currentBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  currentTxt: { color: '#fff', fontSize: 9 },
  selectCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  perkTxt: { fontSize: 12 },
  ctaBanner: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 14 },
  ctaBannerTitle: { fontSize: 14, marginBottom: 4 },
  ctaBannerSub: { fontSize: 12, marginBottom: 12 },
  ctaBtn: { borderRadius: 14, overflow: 'hidden' },
  ctaGrad: { paddingVertical: 12, alignItems: 'center' },
  ctaTxt: { fontSize: 14 },
  footnote: { fontSize: 12, textAlign: 'center', marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36, borderWidth: 1 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  modalTierName: { fontSize: 15 },
  modalSub: { fontSize: 11, marginTop: 2 },
  modalPrice: { fontSize: 18 },
  cardSelectTitle: { fontSize: 13, marginBottom: 10 },
  cardOption: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5 },
  cardOptionTxt: { fontSize: 14 },
  cardExpTxt: { fontSize: 12 },
  cardRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  cardRadioDot: { width: 8, height: 8, borderRadius: 4 },
  payBtn: { borderRadius: 14, overflow: 'hidden' },
  payBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  payBtnTxt: { fontSize: 14 },
  doneWrap: { alignItems: 'center', paddingVertical: 24 },
  doneIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  doneTxt: { fontSize: 18, color: '#22c55e', marginBottom: 6 },
  doneSub: { fontSize: 13, textAlign: 'center' },
});
