import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Modal, Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const TABS = ['Upcoming', 'Past', 'Cancelled'] as const;

const UPCOMING_BASE = [
  { id: 1, type: 'club',   venue: 'ONYX',                     date: 'Sat, 24 May 2026', time: '23:00', guests: 4, status: 'confirmed', ref: 'SP-001234', price: 2500 },
  { id: 2, type: 'dining', venue: 'Marble Restaurant',        date: 'Sun, 25 May 2026', time: '19:00', guests: 2, status: 'confirmed', ref: 'SP-001235', price: 0   },
  { id: 3, type: 'tour',   venue: 'Cape Winelands Helicopter',date: 'Fri, 30 May 2026', time: '09:00', guests: 2, status: 'pending',   ref: 'SP-001236', price: 9000 },
];

const PAST = [
  { id: 4, type: 'club',   venue: 'COCO',           date: 'Sat, 10 May 2026', time: '22:00', guests: 6, status: 'completed', ref: 'SP-001230', price: 3500 },
  { id: 5, type: 'dining', venue: 'The FishMonger', date: 'Fri, 2 May 2026',  time: '20:00', guests: 3, status: 'completed', ref: 'SP-001225', price: 0   },
];

const CANCELLED_STATIC = [
  { id: 20, type: 'club', venue: 'ZONE 6 VENUE', date: 'Sat, 1 Mar 2026', time: '22:00', guests: 3, status: 'cancelled', ref: 'SP-001200', price: 0 },
];

const CANCEL_REASONS = ['Change of plans', 'Found a better option', "Can't make it anymore", 'Double booking', 'Financial reasons', 'Other'];

const typeIcon = (type: string) => {
  if (type === 'club') return '🍸';
  if (type === 'tour') return '🚁';
  return '🍽️';
};

const statusColor = (status: string) => {
  if (status === 'confirmed') return '#22C55E';
  if (status === 'pending') return '#F59E0B';
  if (status === 'cancelled') return '#EF4444';
  return '#6B7280';
};

export default function ReservationsScreen() {
  const tc = useTC();
  const { isLoggedIn } = useApp();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<typeof TABS[number]>('Upcoming');
  const [cancelledIds, setCancelledIds] = useState<number[]>([]);
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [reasonError, setReasonError] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(auth)/sign-in');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const upcoming = UPCOMING_BASE.filter(b => !cancelledIds.includes(b.id));
  const cancelled = [
    ...CANCELLED_STATIC,
    ...UPCOMING_BASE.filter(b => cancelledIds.includes(b.id)).map(b => ({ ...b, status: 'cancelled' })),
  ];

  const items = tab === 'Upcoming' ? upcoming : tab === 'Past' ? PAST : cancelled;

  const confirmCancel = () => {
    if (!selectedReason) { setReasonError(true); return; }
    if (showCancelModal !== null) {
      setCancelledIds(prev => [...prev, showCancelModal]);
      setShowCancelModal(null);
      setSelectedReason('');
      setReasonError(false);
    }
  };

  const pendingVenue = UPCOMING_BASE.find(b => b.id === showCancelModal)?.venue ?? 'booking';

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={tc.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>My Reservations</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.tabRow}>
          {TABS.map(t => {
            const active = tab === t;
            const count = t === 'Cancelled' ? cancelled.length : 0;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                style={[styles.tabChip, {
                  backgroundColor: active ? tc.accent : tc.tagBg,
                  borderColor: active ? 'transparent' : tc.border,
                }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabChipTxt, {
                  color: active ? (tc.isDark ? '#000' : '#fff') : tc.text2,
                  fontFamily: active ? 'Poppins_600SemiBold' : 'Inter_400Regular',
                }]}>
                  {t}{count > 0 ? ` (${count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Feather name="calendar" size={40} color={tc.text3} />
            </View>
            <Text style={[styles.emptyTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
              No {tab.toLowerCase()} bookings
            </Text>
            <Text style={[styles.emptySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
              {tab === 'Upcoming' ? 'Start exploring to make your first booking' : 'Nothing here yet'}
            </Text>
            {tab === 'Upcoming' && (
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.back()} activeOpacity={0.85}>
                <LinearGradient colors={tc.accentGradColors} style={styles.emptyBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
                  <Text style={[styles.emptyBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Explore Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {items.map(item => (
              <View
                key={item.id}
                style={[styles.card, {
                  backgroundColor: tc.card,
                  borderColor: item.status === 'cancelled' ? 'rgba(239,68,68,0.3)' : tc.border,
                }]}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.typeIcon}>{typeIcon(item.type)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.venueName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{item.venue}</Text>
                    <Text style={[styles.refTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Ref: {item.ref}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
                    <Text style={[styles.statusTxt, { color: statusColor(item.status), fontFamily: 'Poppins_600SemiBold' }]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: tc.border }]} />

                <View style={styles.detailsRow}>
                  {[
                    { icon: 'calendar', val: item.date },
                    { icon: 'clock',    val: item.time },
                    { icon: 'users',    val: `${item.guests} guest${item.guests > 1 ? 's' : ''}` },
                  ].map(d => (
                    <View key={d.icon} style={styles.detailItem}>
                      <Feather name={d.icon as any} size={13} color={tc.text3} />
                      <Text style={[styles.detailTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{d.val}</Text>
                    </View>
                  ))}
                </View>

                {item.price > 0 && (
                  <View style={[styles.priceRow, { backgroundColor: tc.gold10 }]}>
                    <Text style={[styles.priceLbl, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Total Paid</Text>
                    <Text style={[styles.priceVal, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{item.price.toLocaleString()}</Text>
                  </View>
                )}

                {tab === 'Upcoming' && (item.status === 'confirmed' || item.status === 'pending') && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/booking-detail', params: { id: String(item.id), venue: item.venue, ref: item.ref, date: item.date, time: item.time, type: item.type, guests: String(item.guests), price: String(item.price), status: item.status } })}
                      style={[styles.actionBtn, { borderColor: tc.accent, backgroundColor: tc.accent + '08' }]}
                      activeOpacity={0.8}
                    >
                      <Feather name="eye" size={14} color={tc.accent} />
                      <Text style={[styles.actionTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/booking-detail', params: { id: String(item.id), venue: item.venue, ref: item.ref, date: item.date, time: item.time, type: item.type, guests: String(item.guests), price: String(item.price), status: item.status } })}
                      style={[styles.actionBtn, { borderColor: tc.accent, backgroundColor: tc.accent + '08' }]}
                      activeOpacity={0.8}
                    >
                      <Feather name="grid" size={14} color={tc.accent} />
                      <Text style={[styles.actionTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>QR Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { setShowCancelModal(item.id); setSelectedReason(''); setReasonError(false); }}
                      style={[styles.actionBtnSm, { backgroundColor: '#EF444415', borderColor: '#EF444430' }]}
                      activeOpacity={0.8}
                    >
                      <Feather name="x" size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}

                {tab === 'Past' && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/booking-detail', params: { id: String(item.id), venue: item.venue, ref: item.ref, date: item.date, time: item.time, type: item.type, guests: String(item.guests), price: String(item.price), status: item.status } })}
                      style={[styles.actionBtn, { backgroundColor: tc.chipBg, borderColor: tc.border }]}
                      activeOpacity={0.8}
                    >
                      <Feather name="file-text" size={14} color={tc.text2} />
                      <Text style={[styles.actionTxt, { color: tc.text2, fontFamily: 'Inter_500Medium' }]}>Receipt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: tc.chipBg, borderColor: tc.border }]}
                      activeOpacity={0.8}
                    >
                      <Feather name="refresh-cw" size={14} color={tc.accent} />
                      <Text style={[styles.actionTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>Rebook</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: tc.chipBg, borderColor: tc.border }]}
                      activeOpacity={0.8}
                      onPress={() => router.push('/profile-reviews')}
                    >
                      <Feather name="star" size={14} color={GOLD} />
                      <Text style={[styles.actionTxt, { color: GOLD, fontFamily: 'Inter_500Medium' }]}>Review</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {tab === 'Cancelled' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: tc.accent, backgroundColor: tc.accent + '08', alignSelf: 'stretch', justifyContent: 'center' }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.actionTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>Book Similar Venue</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Cancel Reason Modal — tap overlay or back button to dismiss */}
      <Modal
        visible={showCancelModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowCancelModal(null); setSelectedReason(''); setReasonError(false); }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => { setShowCancelModal(null); setSelectedReason(''); setReasonError(false); }}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={[styles.modalSheet, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: tc.border2 }]} />
            <View style={styles.cancelIconWrap}>
              <Feather name="x" size={24} color="#ef4444" />
            </View>
            <Text style={[styles.modalTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Cancel Booking?</Text>
            <Text style={[styles.modalVenueTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{pendingVenue}</Text>
            <View style={styles.feeBanner}>
              <Text style={[styles.feeTxt, { fontFamily: 'Poppins_600SemiBold' }]}>20% cancellation fee applies</Text>
              <Text style={[styles.feeNote, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Refund of 80% within 3–5 business days</Text>
            </View>
            <Text style={[styles.reasonTitle, {
              color: reasonError && !selectedReason ? '#ef4444' : tc.text,
              fontFamily: 'Poppins_600SemiBold',
            }]}>
              {reasonError && !selectedReason ? 'Please select a reason' : 'Reason for cancellation'}
            </Text>
            <View style={styles.reasonGrid}>
              {CANCEL_REASONS.map(r => (
                <TouchableOpacity
                  key={r}
                  onPress={() => { setSelectedReason(r); setReasonError(false); }}
                  style={[styles.reasonChip, {
                    backgroundColor: selectedReason === r ? tc.accent + '15' : tc.inputBg,
                    borderColor: selectedReason === r ? tc.accent : tc.border,
                  }]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.reasonTxt, {
                    color: selectedReason === r ? tc.accent : tc.text2,
                    fontFamily: 'Inter_400Regular',
                  }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => { setShowCancelModal(null); setSelectedReason(''); setReasonError(false); }}
                style={[styles.keepBtn, { borderColor: tc.border, backgroundColor: tc.inputBg }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.keepTxt, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={confirmCancel} activeOpacity={0.8}>
                <Text style={[styles.confirmCancelTxt, { fontFamily: 'Poppins_700Bold' }]}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, marginBottom: 12 },
  headerTitle: { fontSize: 18 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  tabChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  tabChipTxt: { fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 14 },
  emptyIcon: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emptyTitle: { fontSize: 20 },
  emptySub: { fontSize: 14, textAlign: 'center' },
  emptyBtn: { width: '70%', borderRadius: 14, overflow: 'hidden', marginTop: 6 },
  emptyBtnGrad: { alignItems: 'center', paddingVertical: 14, borderRadius: 14 },
  emptyBtnTxt: { fontSize: 15 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  typeIcon: { fontSize: 28 },
  venueName: { fontSize: 15 },
  refTxt: { fontSize: 12, marginTop: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusDot: { width: 5, height: 5, borderRadius: 2.5 },
  statusTxt: { fontSize: 11 },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 12 },
  detailsRow: { gap: 6, marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailTxt: { fontSize: 13 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, marginBottom: 10 },
  priceLbl: { fontSize: 13 },
  priceVal: { fontSize: 15 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  actionBtnSm: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  actionTxt: { fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36, borderWidth: 1 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  cancelIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ef444415', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, textAlign: 'center', marginBottom: 4 },
  modalVenueTxt: { fontSize: 13, textAlign: 'center', marginBottom: 14 },
  feeBanner: { backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', borderRadius: 12, padding: 12, marginBottom: 16, alignItems: 'center' },
  feeTxt: { color: '#ef4444', fontSize: 12, marginBottom: 2 },
  feeNote: { fontSize: 12 },
  reasonTitle: { fontSize: 13, marginBottom: 10 },
  reasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  reasonChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  reasonTxt: { fontSize: 12 },
  modalActions: { flexDirection: 'row', gap: 12 },
  keepBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center', borderWidth: 1 },
  keepTxt: { fontSize: 14 },
  confirmCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  confirmCancelTxt: { color: '#ef4444', fontSize: 14 },
});
