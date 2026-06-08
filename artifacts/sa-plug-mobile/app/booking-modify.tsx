import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert, Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;
const GUEST_EXTRA_PRICE = 300;

const CLUB_TIMES  = ['8:00 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM'];
const DINING_TIMES = ['12:00', '13:00', '18:00', '19:00', '20:00', '21:00'];

type TableTier = { id: string; name: string; emoji: string; cap: number; price: number };
const TABLE_TIERS: TableTier[] = [
  { id: 'std',    name: 'Standard Table', emoji: '🪑', cap: 4,  price: 2500 },
  { id: 'booth',  name: 'Booth Table',    emoji: '🛋️', cap: 6,  price: 3000 },
  { id: 'vip',    name: 'VIP Table',      emoji: '⭐', cap: 8,  price: 3200 },
  { id: 'lounge', name: 'VIP Lounge',     emoji: '👑', cap: 12, price: 4000 },
];

type AddOnItem = { id: number; name: string; desc: string; price: number; qty: number };
const ADDONS_BASE: Omit<AddOnItem, 'qty'>[] = [
  { id: 1, name: 'Extra Bottle Service',  desc: 'Premium bottle + mixers & garnishes',       price: 1200 },
  { id: 2, name: 'VIP Host Upgrade',      desc: 'Dedicated personal host all evening',        price:  800 },
  { id: 3, name: 'Champagne Tower',       desc: 'Moët & Chandon · 12 glasses',               price: 1800 },
  { id: 4, name: 'Birthday Package',      desc: 'Cake, confetti cannon & personalised moment', price:  950 },
  { id: 5, name: 'Pro Photography',       desc: '1-hour session + full digital gallery',      price: 1500 },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHead({ icon, label, tc }: { icon: string; label: string; tc: any }) {
  return (
    <View style={sh.row}>
      <View style={[sh.circle, { backgroundColor: `${tc.accent}18` }]}>
        <Feather name={icon as any} size={14} color={tc.accent} />
      </View>
      <Text style={[sh.label, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{label}</Text>
    </View>
  );
}
const sh = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22, marginBottom: 10 },
  circle: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 14 },
});

function PriceRow({
  label, value, bold, free, muted, accent, tc,
}: { label: string; value: string; bold?: boolean; free?: boolean; muted?: boolean; accent?: boolean; tc: any }) {
  return (
    <View style={[pr.row]}>
      <Text style={[pr.label, { color: muted ? tc.text3 : tc.text2, fontFamily: bold ? 'Poppins_600SemiBold' : 'Inter_400Regular' }]}>
        {label}
      </Text>
      <Text style={[pr.value, {
        color: free ? '#22c55e' : accent ? tc.accent : bold ? tc.text : tc.text2,
        fontFamily: bold ? 'Poppins_700Bold' : 'Inter_500Medium',
      }]}>
        {value}
      </Text>
    </View>
  );
}
const pr = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  label: { fontSize: 13, flex: 1, marginRight: 8 },
  value: { fontSize: 13 },
});

// ── Main screen ────────────────────────────────────────────────────────────────

export default function BookingModifyScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { venue, ref: bookingRef, date, time, guests, price, type } = useLocalSearchParams<{
    venue?: string; ref?: string; date?: string; time?: string;
    guests?: string; price?: string; type?: string;
  }>();

  const venueName     = venue      ?? 'ONYX Sandton';
  const refCode       = bookingRef ?? 'SAPVIP-482291';
  const confirmedDate = date       ?? 'Sat, 24 May 2026';
  const confirmedTime = time       ?? '10:00 PM';
  const origGuests    = Number(guests ?? '1');
  const origPrice     = Number(price  ?? '2500');
  const bookingType   = type ?? 'club';
  const isClub        = bookingType !== 'tour' && bookingType !== 'dining';
  const isDining      = bookingType === 'dining';

  const DATES = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day:   d.toLocaleDateString('en-ZA', { weekday: 'short' }),
      num:   d.getDate().toString(),
      month: d.toLocaleDateString('en-ZA', { month: 'short' }),
    };
  }), []);

  const [newDateIdx, setNewDateIdx] = useState(-1);
  const [newTime, setNewTime]       = useState('');
  const [newGuests, setNewGuests]   = useState(origGuests);
  const [tableId, setTableId]       = useState('');
  const [addOns, setAddOns]         = useState<AddOnItem[]>(ADDONS_BASE.map(a => ({ ...a, qty: 0 })));
  const [submitted, setSubmitted]   = useState(false);

  const selectedTable    = TABLE_TIERS.find(t => t.id === tableId);
  const guestDiff        = Math.max(0, newGuests - origGuests);
  const guestExtra       = guestDiff * GUEST_EXTRA_PRICE;
  const tableCharge      = selectedTable ? selectedTable.price : 0;
  const addOnsTotal      = addOns.reduce((s, a) => s + a.price * a.qty, 0);
  const subtotal         = guestExtra + tableCharge + addOnsTotal;
  const serviceFee       = subtotal > 0 ? Math.round(subtotal * 0.1) : 0;
  const additionalCharge = subtotal + serviceFee;

  const hasChanges = newDateIdx !== -1 || newTime !== '' || newGuests > origGuests
    || tableId !== '' || addOns.some(a => a.qty > 0);

  const timesForType = isDining ? DINING_TIMES : CLUB_TIMES;

  const handleConfirm = () => {
    if (!hasChanges) {
      Alert.alert('No Changes', 'Make at least one change to update your booking.');
      return;
    }
    const chargeMsg = additionalCharge > 0
      ? `An additional R${additionalCharge.toLocaleString()} will be charged to your payment method.`
      : 'No additional charge — this update is free.';
    Alert.alert(
      'Confirm Modifications',
      `Update your booking at ${venueName}?\n\n${chargeMsg}`,
      [
        { text: 'Go Back', style: 'cancel' },
        {
          text: additionalCharge > 0 ? `Pay R${additionalCharge.toLocaleString()}` : 'Confirm',
          onPress: () => {
            setSubmitted(true);
            setTimeout(() => router.back(), 1800);
          },
        },
      ]
    );
  };

  if (submitted) {
    return (
      <View style={[styles.root, { backgroundColor: tc.bg }]}>
        <View style={styles.successWrap}>
          <View style={[styles.successIcon, { backgroundColor: `${tc.accent}12`, borderColor: `${tc.accent}35` }]}>
            <Feather name="check-circle" size={52} color={tc.accent} />
          </View>
          <Text style={[styles.successTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Booking Updated!</Text>
          <Text style={[styles.successSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            Your modifications have been confirmed.{'\n'}A summary has been sent to your email.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Modify Booking</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + WEB_BOT + 130 }}>

        {/* ── Confirmed Booking Summary ── */}
        <View style={[styles.confirmedCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <View style={styles.confirmedRow}>
            <View style={[styles.confirmedIcon, { backgroundColor: `${tc.accent}12` }]}>
              <Text style={{ fontSize: 26 }}>
                {bookingType === 'tour' ? '🚁' : bookingType === 'dining' ? '🍽️' : '🎵'}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[styles.confirmedVenue, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{venueName}</Text>
              <Text style={[styles.confirmedRef, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Ref: {refCode}</Text>
              <View style={styles.confirmedMeta}>
                <Feather name="calendar" size={11} color={tc.text3} />
                <Text style={[styles.metaTxt, { color: tc.text3 }]}>{confirmedDate}</Text>
                <Feather name="clock" size={11} color={tc.text3} />
                <Text style={[styles.metaTxt, { color: tc.text3 }]}>{confirmedTime}</Text>
                <Feather name="users" size={11} color={tc.text3} />
                <Text style={[styles.metaTxt, { color: tc.text3 }]}>{origGuests}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#22c55e18' }]}>
              <View style={styles.statusDot} />
              <Text style={[styles.statusTxt, { fontFamily: 'Poppins_600SemiBold' }]}>CONFIRMED</Text>
            </View>
          </View>
          <View style={[styles.paidBanner, { backgroundColor: `${tc.accent}0D`, borderColor: `${tc.accent}30` }]}>
            <Feather name="lock" size={12} color={tc.accent} />
            <Text style={[styles.paidTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>
              Original confirmed & paid: R{origPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* ── Rules notice ── */}
        <View style={[styles.ruleBanner, { backgroundColor: '#3b82f610', borderColor: '#3b82f630' }]}>
          <Feather name="info" size={14} color="#3b82f6" style={{ marginTop: 1 }} />
          <Text style={[styles.ruleTxt, { color: '#3b82f6', fontFamily: 'Inter_400Regular' }]}>
            You can change date, time, and add extras to your booking.
            {isClub ? ' Guest count and confirmed items cannot be reduced.' : ' Previously confirmed guests cannot be reduced.'}
          </Text>
        </View>

        {/* ── Date ── */}
        <SectionHead icon="calendar" label="Change Date" tc={tc} />
        <Text style={[styles.currentHint, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Current: {confirmedDate}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 4 }}>
          {DATES.map((d, i) => {
            const active = newDateIdx === i;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dateCard, {
                  backgroundColor: active ? tc.accent : tc.card,
                  borderColor:     active ? tc.accent : tc.border,
                }]}
                onPress={() => setNewDateIdx(active ? -1 : i)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateDay, { color: active ? (tc.isDark ? '#000' : '#fff') : tc.text3, fontFamily: 'Inter_400Regular' }]}>{d.day}</Text>
                <Text style={[styles.dateNum, { color: active ? (tc.isDark ? '#000' : '#fff') : tc.text, fontFamily: 'Poppins_700Bold' }]}>{d.num}</Text>
                <Text style={[styles.dateMon, { color: active ? (tc.isDark ? '#000' : '#fff') : tc.text3, fontFamily: 'Inter_400Regular' }]}>{d.month}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {newDateIdx >= 0 && (
          <View style={[styles.freeNote, { backgroundColor: '#22c55e0F', borderColor: '#22c55e35', marginTop: 8 }]}>
            <Feather name="check-circle" size={12} color="#22c55e" />
            <Text style={[styles.freeNoteTxt, { color: '#22c55e', fontFamily: 'Inter_400Regular' }]}>
              Date → {DATES[newDateIdx].day} {DATES[newDateIdx].num} {DATES[newDateIdx].month} — no extra charge
            </Text>
          </View>
        )}

        {/* ── Time (clubs and dining) ── */}
        {(isClub || isDining) && (
          <>
            <SectionHead icon="clock" label="Change Time" tc={tc} />
            <Text style={[styles.currentHint, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Current: {confirmedTime}</Text>
            <View style={styles.timesGrid}>
              {timesForType.map(t => {
                const active = newTime === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.timeBtn, {
                      backgroundColor: active ? tc.accent : tc.card,
                      borderColor:     active ? tc.accent : tc.border,
                    }]}
                    onPress={() => setNewTime(active ? '' : t)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.timeTxt, {
                      color:      active ? (tc.isDark ? '#000' : '#fff') : tc.text2,
                      fontFamily: active ? 'Poppins_600SemiBold' : 'Inter_400Regular',
                    }]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {newTime !== '' && (
              <View style={[styles.freeNote, { backgroundColor: '#22c55e0F', borderColor: '#22c55e35', marginTop: 8 }]}>
                <Feather name="check-circle" size={12} color="#22c55e" />
                <Text style={[styles.freeNoteTxt, { color: '#22c55e', fontFamily: 'Inter_400Regular' }]}>
                  Time → {newTime} — no extra charge
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── Guests ── */}
        <SectionHead icon="users" label="Number of Guests" tc={tc} />
        <View style={[styles.guestCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.guestNum, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
              {newGuests} Guest{newGuests !== 1 ? 's' : ''}
            </Text>
            <Text style={[styles.guestSub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
              Min {origGuests} (confirmed) · +R{GUEST_EXTRA_PRICE} per extra guest
            </Text>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, {
                backgroundColor: tc.bg2, borderColor: tc.border,
                opacity: newGuests <= origGuests ? 0.3 : 1,
              }]}
              onPress={() => setNewGuests(g => Math.max(origGuests, g - 1))}
              disabled={newGuests <= origGuests}
            >
              <Feather name="minus" size={14} color={tc.text} />
            </TouchableOpacity>
            <Text style={[styles.stepVal, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{newGuests}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, { backgroundColor: tc.accent }]}
              onPress={() => setNewGuests(g => Math.min(20, g + 1))}
            >
              <Feather name="plus" size={14} color={tc.isDark ? '#000' : '#fff'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Table Service (clubs only) ── */}
        {isClub && (
          <>
            <SectionHead icon="star" label="Add / Upgrade Table Service" tc={tc} />
            <Text style={[styles.currentHint, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
              Add a dedicated table area to your booking (optional)
            </Text>
            <View style={styles.tablesGrid}>
              {TABLE_TIERS.map(tbl => {
                const active = tableId === tbl.id;
                return (
                  <TouchableOpacity
                    key={tbl.id}
                    style={[styles.tableCard, {
                      backgroundColor: active ? `${tc.accent}12` : tc.card,
                      borderColor:     active ? tc.accent : tc.border,
                    }]}
                    onPress={() => setTableId(active ? '' : tbl.id)}
                    activeOpacity={0.8}
                  >
                    {active && (
                      <View style={[styles.tableCheck, { backgroundColor: tc.accent }]}>
                        <Feather name="check" size={9} color={tc.isDark ? '#000' : '#fff'} />
                      </View>
                    )}
                    <Text style={styles.tableEmoji}>{tbl.emoji}</Text>
                    <Text style={[styles.tableName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{tbl.name}</Text>
                    <Text style={[styles.tableCap, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Up to {tbl.cap} guests</Text>
                    <Text style={[styles.tablePrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>
                      R{tbl.price.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ── Extras / Add-ons (clubs only) ── */}
        {isClub && (
          <>
            <SectionHead icon="plus-circle" label="Add Extras" tc={tc} />
            <View style={{ gap: 10 }}>
              {addOns.map(addon => (
                <View key={addon.id} style={[styles.addonCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text style={[styles.addonName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{addon.name}</Text>
                    <Text style={[styles.addonDesc, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{addon.desc}</Text>
                    <Text style={[styles.addonPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{addon.price.toLocaleString()}</Text>
                  </View>
                  <View style={styles.addonStepper}>
                    <TouchableOpacity
                      style={[styles.addonBtn, { borderColor: tc.border, opacity: addon.qty === 0 ? 0.3 : 1 }]}
                      onPress={() => setAddOns(prev => prev.map(a => a.id === addon.id ? { ...a, qty: Math.max(0, a.qty - 1) } : a))}
                      disabled={addon.qty === 0}
                    >
                      <Feather name="minus" size={13} color={tc.text} />
                    </TouchableOpacity>
                    <Text style={[styles.addonQty, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{addon.qty}</Text>
                    <TouchableOpacity
                      style={[styles.addonBtn, { backgroundColor: tc.accent, borderColor: tc.accent }]}
                      onPress={() => setAddOns(prev => prev.map(a => a.id === addon.id ? { ...a, qty: a.qty + 1 } : a))}
                    >
                      <Feather name="plus" size={13} color={tc.isDark ? '#000' : '#fff'} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Pricing Summary (only when changes exist) ── */}
        {hasChanges && (
          <View style={[styles.pricingCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Text style={[styles.pricingTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Pricing Summary</Text>
            <View style={[styles.divLine, { backgroundColor: tc.border }]} />

            <PriceRow label="Confirmed & already paid" value={`R${origPrice.toLocaleString()}`} tc={tc} />

            {newDateIdx >= 0 && (
              <PriceRow label={`Date → ${DATES[newDateIdx].day} ${DATES[newDateIdx].num} ${DATES[newDateIdx].month}`} value="Free" tc={tc} free />
            )}
            {newTime !== '' && (
              <PriceRow label={`Time → ${newTime}`} value="Free" tc={tc} free />
            )}
            {guestDiff > 0 && (
              <PriceRow label={`+${guestDiff} extra guest${guestDiff > 1 ? 's' : ''} × R${GUEST_EXTRA_PRICE}`} value={`+R${guestExtra.toLocaleString()}`} tc={tc} />
            )}
            {selectedTable && (
              <PriceRow label={`Table: ${selectedTable.name}`} value={`+R${tableCharge.toLocaleString()}`} tc={tc} />
            )}
            {addOns.filter(a => a.qty > 0).map(a => (
              <PriceRow key={a.id} label={`${a.name} ×${a.qty}`} value={`+R${(a.price * a.qty).toLocaleString()}`} tc={tc} />
            ))}
            {serviceFee > 0 && (
              <PriceRow label="Service fee (10%)" value={`+R${serviceFee.toLocaleString()}`} tc={tc} muted />
            )}

            <View style={[styles.divLine, { backgroundColor: tc.border }]} />
            <PriceRow
              label="Additional charge"
              value={additionalCharge > 0 ? `R${additionalCharge.toLocaleString()}` : 'R0 — Free'}
              tc={tc} bold accent={additionalCharge > 0} free={additionalCharge === 0}
            />
            <PriceRow
              label="New total"
              value={`R${(origPrice + additionalCharge).toLocaleString()}`}
              tc={tc} bold
            />
          </View>
        )}
      </ScrollView>

      {/* ── CTA ── */}
      <View style={[styles.ctaBar, { backgroundColor: tc.bg, borderTopColor: tc.border, paddingBottom: insets.bottom + WEB_BOT + 8 }]}>
        {!hasChanges && (
          <Text style={[styles.ctaHint, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
            Make changes above to update your booking
          </Text>
        )}
        <TouchableOpacity
          style={[styles.ctaBtn, { opacity: hasChanges ? 1 : 0.45 }]}
          onPress={handleConfirm}
          disabled={!hasChanges}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={tc.accentGradColors}
            style={styles.ctaGrad}
            start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}
          >
            <Feather name={additionalCharge > 0 ? 'credit-card' : 'check'} size={16} color={tc.isDark ? '#000' : '#fff'} />
            <Text style={[styles.ctaTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
              {hasChanges
                ? additionalCharge > 0
                  ? `Pay Additional R${additionalCharge.toLocaleString()}`
                  : 'Confirm Changes — No Charge'
                : 'No Changes Made'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },

  confirmedCard: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  confirmedRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  confirmedIcon: { width: 54, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  confirmedVenue: { fontSize: 15 },
  confirmedRef: { fontSize: 12 },
  confirmedMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginTop: 4 },
  metaTxt: { fontSize: 11, marginRight: 6, fontFamily: 'Inter_400Regular' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 7, flexShrink: 0 },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#22c55e' },
  statusTxt: { color: '#22c55e', fontSize: 9 },
  paidBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, padding: 10, borderWidth: 1 },
  paidTxt: { fontSize: 12, flex: 1 },

  ruleBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 4 },
  ruleTxt: { fontSize: 13, flex: 1, lineHeight: 19 },

  currentHint: { fontSize: 12, marginBottom: 10 },

  dateCard: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, minWidth: 54 },
  dateDay: { fontSize: 11 },
  dateNum: { fontSize: 18 },
  dateMon: { fontSize: 10 },

  freeNote: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, padding: 10, borderWidth: 1 },
  freeNoteTxt: { fontSize: 12 },

  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  timeBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  timeTxt: { fontSize: 13 },

  guestCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 14, borderWidth: 1 },
  guestNum: { fontSize: 16, marginBottom: 2 },
  guestSub: { fontSize: 12 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepVal: { fontSize: 18, minWidth: 24, textAlign: 'center' },

  tablesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tableCard: { width: '47%', padding: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center', position: 'relative' },
  tableCheck: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  tableEmoji: { fontSize: 22, marginBottom: 6 },
  tableName: { fontSize: 12, textAlign: 'center', marginBottom: 2 },
  tableCap: { fontSize: 11, textAlign: 'center', marginBottom: 6 },
  tablePrice: { fontSize: 13, textAlign: 'center' },

  addonCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, gap: 12 },
  addonName: { fontSize: 13 },
  addonDesc: { fontSize: 11 },
  addonPrice: { fontSize: 13 },
  addonStepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  addonBtn: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  addonQty: { fontSize: 15, minWidth: 20, textAlign: 'center' },

  pricingCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginTop: 20 },
  pricingTitle: { fontSize: 14, marginBottom: 12 },
  divLine: { height: StyleSheet.hairlineWidth, marginVertical: 10 },

  ctaBar: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 10 },
  ctaHint: { fontSize: 12, textAlign: 'center', marginBottom: 8 },
  ctaBtn: { borderRadius: 16, overflow: 'hidden' },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  ctaTxt: { fontSize: 15 },

  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  successTitle: { fontSize: 24 },
  successSub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
