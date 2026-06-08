import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Modal, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { openCall } from '@/utils/linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';
import { shareQR } from '@/utils/share';
import { buildQRData, buildQRUrl, openCalendar, saveQR } from '@/utils/qr';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const CANCEL_REASONS = [
  'Change of plans', 'Found a better option', "Can't make it anymore",
  'Double booking', 'Financial reasons', 'Other',
];

export default function BookingDetailScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { venue, ref: bookingRef, date, time, type, guests, price, status } =
    useLocalSearchParams<{
      venue?: string; ref?: string; date?: string; time?: string;
      type?: string; guests?: string; price?: string; status?: string;
    }>();

  const venueName    = venue      ?? 'ONYX Sandton';
  const refCode      = bookingRef ?? 'SAPVIP-482291';
  const bookingDate  = date       ?? 'Sat, 24 May 2026';
  const bookingTime  = time       ?? '10:00 PM';
  const guestCount   = guests     ?? '1';
  const typeEmoji    = type === 'tour' ? '🚁' : type === 'dining' ? '🍽️' : '🎵';
  const packageLabel = type === 'tour' ? 'Tour Package' : type === 'dining' ? 'Dining Reservation' : 'VIP Table + Bottle Service';

  const qrData = buildQRData({ ref: refCode, venue: venueName, date: bookingDate, time: bookingTime, guests: guestCount, type: type ?? 'club' });
  const qrUrl  = buildQRUrl(qrData);

  const [showCancel, setShowCancel]         = useState(false);
  const [cancelled, setCancelled]           = useState(status === 'cancelled');
  const [selectedReason, setSelectedReason] = useState('');
  const [reasonError, setReasonError]       = useState(false);
  const [calAdded, setCalAdded]             = useState(false);
  const [saveState, setSaveState]           = useState<'idle' | 'saving' | 'saved'>('idle');
  const [shareState, setShareState]         = useState<'idle' | 'sharing'>('idle');

  const closeCancel = () => { setShowCancel(false); setSelectedReason(''); setReasonError(false); };

  const handleConfirmCancel = () => {
    if (!selectedReason) { setReasonError(true); return; }
    setCancelled(true);
    closeCancel();
  };

  const handleSaveQR = async () => {
    if (saveState !== 'idle') return;
    setSaveState('saving');
    const result = await saveQR(qrUrl, refCode);
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
      refCode,
      title: `SA PLUG Booking — ${venueName}`,
      message: `SA PLUG Booking\n📍 ${venueName}\n📅 ${bookingDate} at ${bookingTime}\n👥 ${guestCount} guests\n🔖 Ref: ${refCode}`,
    });
    setShareState('idle');
  };

  const handleAddToCalendar = async () => {
    await openCalendar({
      title: `SA PLUG: ${venueName}`,
      dateStr: bookingDate,
      timeStr: bookingTime,
      refCode,
      venue: venueName,
    });
    setCalAdded(true);
    setTimeout(() => setCalAdded(false), 3000);
  };

  const INFO = [
    { icon: 'calendar', label: 'Date',        value: bookingDate },
    { icon: 'clock',    label: 'Time',        value: bookingTime },
    { icon: 'users',    label: 'Guests',      value: `${guestCount} Guest${Number(guestCount) !== 1 ? 's' : ''}` },
    { icon: 'tag',      label: 'Package',     value: packageLabel },
    { icon: 'map-pin',  label: 'Venue',       value: venueName },
    { icon: 'hash',     label: 'Booking Ref', value: refCode },
  ];

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Booking Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        {cancelled && (
          <View style={styles.cancelledBanner}>
            <Feather name="x-circle" size={16} color="#ef4444" />
            <Text style={[styles.cancelledTxt, { fontFamily: 'Poppins_600SemiBold' }]}>Booking Cancelled</Text>
          </View>
        )}

        <View style={[styles.venueCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <View style={[styles.venueBadge, { backgroundColor: tc.card2 }]}>
            <Text style={{ fontSize: 32 }}>{typeEmoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.venueName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{venueName}</Text>
            <Text style={[styles.venueSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{packageLabel}</Text>
            <View style={[styles.statusBadge, { backgroundColor: cancelled ? '#ef444420' : '#22c55e20' }]}>
              <View style={[styles.statusDot, { backgroundColor: cancelled ? '#ef4444' : '#22c55e' }]} />
              <Text style={[styles.statusTxt, { color: cancelled ? '#ef4444' : '#22c55e', fontFamily: 'Poppins_600SemiBold' }]}>
                {cancelled ? 'CANCELLED' : 'CONFIRMED'}
              </Text>
            </View>
          </View>
          <Text style={[styles.price, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>
            {price ? `R${Number(price).toLocaleString()}` : 'R1,200'}
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          {INFO.map((item, i) => (
            <View key={item.label}>
              <View style={styles.infoRow}>
                <View style={[styles.infoIconWrap, { backgroundColor: tc.accent + '12' }]}>
                  <Feather name={item.icon as any} size={14} color={tc.accent} />
                </View>
                <Text style={[styles.infoLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{item.label}</Text>
                <Text style={[styles.infoValue, { color: tc.text, fontFamily: 'Inter_500Medium' }]}>{item.value}</Text>
              </View>
              {i < INFO.length - 1 && <View style={[styles.divider, { backgroundColor: tc.border }]} />}
            </View>
          ))}
        </View>

        <View style={[styles.qrCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <Text style={[styles.qrTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Entry QR Code</Text>
          <Text style={[styles.qrSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Present at venue entrance for VIP access</Text>
          <View style={styles.qrCenter}>
            <View style={styles.qrBg}>
              <Image source={{ uri: qrUrl }} style={styles.qrImg} contentFit="contain" />
            </View>
          </View>
          <Text style={[styles.refTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{refCode}</Text>
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

        {!cancelled && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: tc.accent + '08', borderColor: tc.accent + '40' }]}
              onPress={handleAddToCalendar}
              activeOpacity={0.8}
            >
              <Feather name="calendar" size={16} color={tc.accent} />
              <Text style={[styles.actionTxt, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>
                {calAdded ? '✓ Added!' : 'Add to Calendar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#ef444408', borderColor: '#ef444430' }]}
              onPress={() => setShowCancel(true)}
              activeOpacity={0.8}
            >
              <Feather name="x" size={16} color="#ef4444" />
              <Text style={[styles.actionTxt, { color: '#ef4444', fontFamily: 'Poppins_600SemiBold' }]}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/booking-modify',
            params: { venue: venueName, ref: refCode, date: bookingDate, time: bookingTime, guests: guestCount, price: price ?? '2500', type: type ?? 'club' },
          })}
          style={[styles.modifyBtn, { borderColor: tc.border, backgroundColor: tc.card }]}
          activeOpacity={0.8}
        >
          <Feather name="edit-2" size={16} color={tc.accent} />
          <Text style={[styles.modifyTxt, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Modify Booking</Text>
          <Feather name="chevron-right" size={16} color={tc.text3} />
        </TouchableOpacity>

        {/* Call Venue */}
        <TouchableOpacity
          style={[styles.modifyBtn, { borderColor: tc.border, backgroundColor: tc.card }]}
          onPress={() => openCall('+27115550123')}
          activeOpacity={0.8}
        >
          <Feather name="phone" size={16} color={tc.accent} />
          <Text style={[styles.modifyTxt, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Call Venue</Text>
          <Feather name="chevron-right" size={16} color={tc.text3} />
        </TouchableOpacity>
      </ScrollView>

      {/* Cancel modal — tap overlay to dismiss, back button to dismiss */}
      <Modal
        visible={showCancel}
        transparent
        animationType="slide"
        onRequestClose={closeCancel}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeCancel}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={[styles.modalSheet, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: tc.border2 }]} />
            <View style={styles.cancelIconWrap}>
              <Feather name="x" size={24} color="#ef4444" />
            </View>
            <Text style={[styles.modalTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Cancel Booking?</Text>
            <Text style={[styles.modalVenue, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{venueName}</Text>
            <View style={styles.feeBanner}>
              <Text style={styles.feeTxt}>20% cancellation fee applies</Text>
              <Text style={[styles.feeNote, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Refund of 80% within 3–5 business days</Text>
            </View>
            <Text style={[styles.reasonTitle, { color: reasonError && !selectedReason ? '#ef4444' : tc.text, fontFamily: 'Poppins_600SemiBold' }]}>
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
                  <Text style={[styles.reasonTxt, { color: selectedReason === r ? tc.accent : tc.text2, fontFamily: 'Inter_400Regular' }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.keepBtn, { borderColor: tc.border, backgroundColor: tc.inputBg }]} onPress={closeCancel} activeOpacity={0.8}>
                <Text style={[styles.keepTxt, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={handleConfirmCancel} activeOpacity={0.8}>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  cancelledBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ef444412', borderWidth: 1, borderColor: '#ef444430', borderRadius: 12, padding: 12, marginBottom: 14 },
  cancelledTxt: { color: '#ef4444', fontSize: 14 },
  venueCard: { flexDirection: 'row', gap: 12, borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  venueBadge: { width: 70, height: 70, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  venueName: { fontSize: 16, marginBottom: 2 },
  venueSub: { fontSize: 12, marginBottom: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  statusDot: { width: 5, height: 5, borderRadius: 2.5 },
  statusTxt: { fontSize: 10 },
  price: { fontSize: 17, alignSelf: 'flex-end' },
  infoCard: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  infoIconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 12, width: 90, color: '#999' },
  infoValue: { flex: 1, fontSize: 13, textAlign: 'right' },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 40 },
  qrCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12 },
  qrTitle: { fontSize: 15, marginBottom: 4 },
  qrSub: { fontSize: 12, marginBottom: 16 },
  qrCenter: { alignItems: 'center', marginBottom: 10 },
  qrBg: { backgroundColor: '#ffffff', borderRadius: 12, padding: 8 },
  qrImg: { width: 160, height: 160 },
  refTxt: { fontSize: 12, textAlign: 'center', marginBottom: 12 },
  qrActions: { flexDirection: 'row', gap: 8 },
  qrBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  qrBtnTxt: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14, borderWidth: 1 },
  actionTxt: { fontSize: 13 },
  modifyBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  modifyTxt: { flex: 1, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36, borderWidth: 1 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  cancelIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ef444415', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, textAlign: 'center', marginBottom: 4 },
  modalVenue: { fontSize: 13, textAlign: 'center', marginBottom: 14 },
  feeBanner: { backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', borderRadius: 12, padding: 12, marginBottom: 16, alignItems: 'center' },
  feeTxt: { color: '#ef4444', fontSize: 12, fontFamily: 'Poppins_600SemiBold', marginBottom: 2 },
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
