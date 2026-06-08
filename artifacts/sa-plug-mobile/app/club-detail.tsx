import { useTC } from '@/hooks/useTheme';
import { LoginGateModal } from '@/components/LoginGateModal';
import { useLoginGate } from '@/hooks/useLoginGate';
import ReviewSection from '@/components/ReviewSection';
import { shareContent } from '@/utils/share';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions, Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { openCall, openEmail, openMap } from '@/utils/linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const { width } = Dimensions.get('window');
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

const TABS = ['Overview', 'Booking', 'Gallery', 'Reviews'];

const BOOKING_DATES = [
  { day: 'Fri', date: '23', month: 'May' },
  { day: 'Sat', date: '24', month: 'May' },
  { day: 'Sun', date: '25', month: 'May' },
  { day: 'Mon', date: '26', month: 'May' },
  { day: 'Tue', date: '27', month: 'May' },
  { day: 'Wed', date: '28', month: 'May' },
  { day: 'Thu', date: '29', month: 'May' },
];
const BOOKING_TIMES = ['8:00 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM'];
const BOOKING_TABLES = [
  { id: 'T1',    name: 'Table 1',    type: 'Standard',  cap: 4,  available: true  },
  { id: 'T2',    name: 'Table 2',    type: 'Standard',  cap: 4,  available: true  },
  { id: 'T3',    name: 'Table 3',    type: 'Booth',     cap: 6,  available: false },
  { id: 'VIP-A', name: 'VIP Table A', type: 'Premium',  cap: 8,  available: true  },
  { id: 'VIP-B', name: 'VIP Table B', type: 'Premium',  cap: 8,  available: false },
  { id: 'VIP-L', name: 'VIP Lounge', type: 'Exclusive', cap: 12, available: true  },
];
function getTablePrice(name: string) {
  if (name.includes('VIP Lounge')) return 4000;
  if (name.includes('VIP')) return 3200;
  if (name.includes('Booth')) return 3000;
  return 2500;
}
function tableEmoji(type: string) {
  if (type === 'Exclusive') return '👑';
  if (type === 'Premium') return '⭐';
  if (type === 'Booth') return '🛋️';
  return '🪑';
}

const AMENITIES = ['🎵 Live DJ Sets', '🍾 Bottle Service', '💃 Dance Floor', '🌃 Rooftop View', '🅿️ Valet Parking', '👔 Dress Code'];
const REVIEWS = [
  { id: 1, user: 'Nomsa K.',    rating: 5, date: '2 days ago',  text: 'Incredible vibes and top-tier service. The bottle package was worth every rand.' },
  { id: 2, user: 'Sipho M.',    rating: 4, date: '1 week ago',  text: 'Amazing DJ and great crowd. Security was professional. Will definitely return.' },
  { id: 3, user: 'Thandeka R.', rating: 5, date: '2 weeks ago', text: 'Best birthday celebration ever! The VIP table exceeded our expectations.' },
];

type AddOn = { id: number; name: string; desc: string; price: number; qty: number };

export default function ClubDetailScreen() {
  const tc = useTC();
  const { gateVisible, closeGate, guard } = useLoginGate();
  const insets = useSafeAreaInsets();
  const { id, name, tab } = useLocalSearchParams<{ id?: string; name?: string; tab?: string }>();
  const [activeTab, setActiveTab] = useState<string>(TABS.includes(tab ?? '') ? (tab ?? 'Overview') : 'Overview');

  const [bookDateIdx, setBookDateIdx] = useState(1);
  const [bookTime, setBookTime] = useState('');
  const [bookGuests, setBookGuests] = useState(1);
  const [bookTable, setBookTable] = useState('');
  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: 1, name: 'VIP Bottle Service', desc: 'Includes premium spirits, mixers & VIP host.', price: 2500, qty: 0 },
    { id: 2, name: 'Onyx Experience Package', desc: 'Entry for 4, 2 bottles, VIP seating & mixers.', price: 6000, qty: 0 },
  ]);
  const [bookError, setBookError] = useState('');

  const clubName = name ?? 'Onyx Sandton';
  const img = `https://picsum.photos/seed/club${id ?? 1}/800/500`;

  const updateAddOnQty = (addonId: number, delta: number) => {
    setAddOns(prev => prev.map(a => a.id === addonId ? { ...a, qty: Math.max(0, a.qty + delta) } : a).filter(a => a.qty >= 0));
  };

  const tablePrice = bookTable ? getTablePrice(bookTable) : 2500;
  const addOnsTotal = addOns.reduce((s, a) => s + a.price * a.qty, 0);
  const serviceFee = Math.round((tablePrice + addOnsTotal) * 0.1);
  const bookingTotal = tablePrice + addOnsTotal + serviceFee;

  const handleProceed = () => {
    if (!bookTime || !bookTable) {
      setBookError('Please select a date, time and a table to continue.');
      return;
    }
    setBookError('');
    guard(() => router.push('/checkout-details'));
  };

  const galleryImgs = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/gallery${id}${i}/400/400`);

  const handleShare = async () => {
    await shareContent({
      title: `SA PLUG — ${clubName}`,
      message: `Check out ${clubName} on SA PLUG!\n🎵 VIP Nightlife · Sandton, Johannesburg\n⭐ 4.9 Rating\n\nBook VIP tables & exclusive bottle service via the SA PLUG app.`,
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + WEB_BOT + 100 }}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: img }} style={styles.heroImg} contentFit="cover" />
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={[styles.backBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shareHeroBtn, { top: insets.top + 12 }]} onPress={handleShare} activeOpacity={0.8}>
            <Feather name="share-2" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroInfo}>
            <View style={[styles.heroBadge, { backgroundColor: tc.accent }]}>
              <Text style={[styles.heroBadgeTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>VIP</Text>
            </View>
            <Text style={[styles.heroName, { fontFamily: 'Poppins_700Bold' }]}>{clubName}</Text>
            <View style={styles.heroRow}>
              <Feather name="map-pin" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroArea}>Sandton, Johannesburg</Text>
              <View style={styles.heroRating}>
                <Feather name="star" size={12} color={GOLD} />
                <Text style={[styles.heroRatingTxt, { fontFamily: 'Poppins_600SemiBold' }]}>4.9</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsRow, { backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && [styles.tabActive, { borderBottomColor: tc.accent }]]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabTxt, { color: activeTab === t ? tc.accent : tc.text3, fontFamily: activeTab === t ? 'Poppins_600SemiBold' : 'Inter_400Regular' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── OVERVIEW ── */}
        {activeTab === 'Overview' && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>About</Text>
            <Text style={[styles.about, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              {clubName} is one of South Africa's most prestigious nightlife destinations. Experience world-class DJ sets, luxury bottle service, and an unmatched atmosphere that defines the SA PLUG lifestyle.
            </Text>
            <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {AMENITIES.map((a, i) => (
                <View key={i} style={[styles.amenityItem, { backgroundColor: tc.card, borderColor: tc.border }]}>
                  <Text style={[styles.amenityTxt, { color: tc.text, fontFamily: 'Inter_400Regular' }]}>{a}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.infoRow, { marginTop: 20 }]}>
              {[
                { icon: 'clock',    label: 'Opens',      val: '10 PM' },
                { icon: 'users',    label: 'Capacity',   val: '800+' },
                { icon: 'tag',      label: 'Dress Code', val: 'Smart' },
              ].map(info => (
                <View key={info.label} style={[styles.infoItem, { backgroundColor: tc.card, borderColor: tc.border }]}>
                  <Feather name={info.icon as any} size={18} color={tc.accent} />
                  <Text style={[styles.infoVal, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{info.val}</Text>
                  <Text style={[styles.infoLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{info.label}</Text>
                </View>
              ))}
            </View>

            {/* Contact & Call */}
            <View style={[styles.contactCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
              {[
                { icon: 'phone',   label: 'Call Venue', val: '+27 11 555 0123',      action: () => openCall('+27115550123') },
                { icon: 'mail',    label: 'Email',       val: 'vip@saplug.co.za',    action: () => openEmail('vip@saplug.co.za') },
                { icon: 'map-pin', label: 'Directions',  val: 'Sandton, Johannesburg', action: () => openMap('Sandton, Johannesburg') },
              ].map((m, i, arr) => (
                <TouchableOpacity
                  key={m.label}
                  style={[styles.contactListRow, i < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: tc.border }]}
                  onPress={m.action}
                  activeOpacity={0.75}
                >
                  <View style={[styles.contactListIcon, { backgroundColor: `${tc.accent}18` }]}>
                    <Feather name={m.icon as any} size={16} color={tc.accent} />
                  </View>
                  <View style={styles.contactListMeta}>
                    <Text style={[styles.contactListLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{m.label}</Text>
                    <Text style={[styles.contactListVal, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{m.val}</Text>
                  </View>
                  <Feather name="chevron-right" size={15} color={tc.text3} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Book CTA in overview */}
            <TouchableOpacity
              style={[styles.bookCta, { marginTop: 24 }]}
              onPress={() => setActiveTab('Booking')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={tc.accentGradColors}
                style={styles.bookCtaGrad}
                start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}
              >
                <Feather name="calendar" size={16} color={tc.isDark ? '#000' : '#fff'} />
                <Text style={[styles.bookCtaTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Book Your Table</Text>
                <Feather name="chevron-right" size={15} color={tc.isDark ? '#000' : '#fff'} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* ── BOOKING ── */}
        {activeTab === 'Booking' && (
          <View style={styles.content}>

            {/* Step 1: Date */}
            <View style={styles.stepHeader}>
              <View style={[styles.stepNum, { backgroundColor: tc.accent }]}>
                <Text style={[styles.stepNumTxt, { fontFamily: 'Poppins_700Bold', color: tc.isDark ? '#000' : '#fff' }]}>1</Text>
              </View>
              <Text style={[styles.stepTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Select Date</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ gap: 8, paddingRight: 4 }}>
              {BOOKING_DATES.map((d, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateCard, {
                    backgroundColor: bookDateIdx === i ? tc.accent : tc.card,
                    borderColor: bookDateIdx === i ? tc.accent : tc.border,
                  }]}
                  onPress={() => setBookDateIdx(i)}
                >
                  <Text style={[styles.dateDay, { color: bookDateIdx === i ? (tc.isDark ? '#000' : '#fff') : tc.text3, fontFamily: 'Inter_400Regular' }]}>{d.day}</Text>
                  <Text style={[styles.dateNum, { color: bookDateIdx === i ? (tc.isDark ? '#000' : '#fff') : tc.text, fontFamily: 'Poppins_700Bold' }]}>{d.date}</Text>
                  <Text style={[styles.dateMonth, { color: bookDateIdx === i ? (tc.isDark ? '#000' : '#fff') : tc.text3, fontFamily: 'Inter_400Regular' }]}>{d.month}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Step 2: Time */}
            <View style={styles.stepHeader}>
              <View style={[styles.stepNum, { backgroundColor: tc.accent }]}>
                <Text style={[styles.stepNumTxt, { fontFamily: 'Poppins_700Bold', color: tc.isDark ? '#000' : '#fff' }]}>2</Text>
              </View>
              <Text style={[styles.stepTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Select Time</Text>
            </View>
            <View style={styles.timesGrid}>
              {BOOKING_TIMES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeBtn, { backgroundColor: bookTime === t ? tc.accent : tc.card, borderColor: bookTime === t ? tc.accent : tc.border }]}
                  onPress={() => setBookTime(t)}
                >
                  <Text style={[styles.timeTxt, { color: bookTime === t ? (tc.isDark ? '#000' : '#fff') : tc.text2, fontFamily: bookTime === t ? 'Poppins_600SemiBold' : 'Inter_400Regular' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Step 3: Guests */}
            <View style={[styles.stepHeader, { marginTop: 20 }]}>
              <View style={[styles.stepNum, { backgroundColor: tc.accent }]}>
                <Text style={[styles.stepNumTxt, { fontFamily: 'Poppins_700Bold', color: tc.isDark ? '#000' : '#fff' }]}>3</Text>
              </View>
              <Text style={[styles.stepTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Number of Guests</Text>
            </View>
            <View style={[styles.guestsCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <View>
                <Text style={[styles.guestsCount, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{bookGuests} Guest{bookGuests !== 1 ? 's' : ''}</Text>
                <Text style={[styles.guestsSub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Min 1 · Max 20</Text>
              </View>
              <View style={styles.guestsStepper}>
                <TouchableOpacity
                  style={[styles.stepperBtn, { backgroundColor: tc.bg2, borderColor: tc.border }]}
                  onPress={() => setBookGuests(g => Math.max(1, g - 1))}
                >
                  <Feather name="minus" size={14} color={tc.text} />
                </TouchableOpacity>
                <Text style={[styles.stepperVal, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{bookGuests}</Text>
                <TouchableOpacity
                  style={[styles.stepperBtn, { backgroundColor: tc.accent }]}
                  onPress={() => setBookGuests(g => Math.min(20, g + 1))}
                >
                  <Feather name="plus" size={14} color={tc.isDark ? '#000' : '#fff'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Step 4: Table */}
            <View style={[styles.stepHeader, { marginTop: 20 }]}>
              <View style={[styles.stepNum, { backgroundColor: tc.accent }]}>
                <Text style={[styles.stepNumTxt, { fontFamily: 'Poppins_700Bold', color: tc.isDark ? '#000' : '#fff' }]}>4</Text>
              </View>
              <Text style={[styles.stepTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Select Table</Text>
            </View>
            <View style={styles.tablesGrid}>
              {BOOKING_TABLES.map(tbl => {
                const isSelected = bookTable === tbl.name;
                const isVIP = tbl.type !== 'Standard' && tbl.type !== 'Booth';
                return (
                  <TouchableOpacity
                    key={tbl.id}
                    onPress={() => { if (!tbl.available) return; setBookTable(tbl.name); }}
                    activeOpacity={tbl.available ? 0.8 : 1}
                    style={[styles.tableCard, {
                      backgroundColor: !tbl.available ? tc.card2 : isSelected ? `${tc.accent}18` : tc.card,
                      borderColor: isSelected ? tc.accent : tc.border,
                      opacity: tbl.available ? 1 : 0.55,
                    }]}
                  >
                    {isVIP && tbl.available && (
                      <View style={[styles.tableVipBadge, { backgroundColor: tc.accent }]}>
                        <Text style={[styles.tableVipTxt, { color: tc.isDark ? '#000' : '#fff' }]}>VIP</Text>
                      </View>
                    )}
                    {isSelected && (
                      <View style={[styles.tableCheckmark, { backgroundColor: tc.accent }]}>
                        <Feather name="check" size={9} color="#fff" />
                      </View>
                    )}
                    <Text style={styles.tableEmoji}>{tableEmoji(tbl.type)}</Text>
                    <Text style={[styles.tableName, { color: isSelected ? tc.accent : tc.text, fontFamily: 'Poppins_700Bold' }]}>{tbl.name}</Text>
                    <Text style={[styles.tableCap, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Up to {tbl.cap} guests</Text>
                    <Text style={[styles.tableMin, { color: tbl.available ? tc.accent : tc.text3, fontFamily: 'Inter_400Regular' }]}>
                      {tbl.available ? `R${getTablePrice(tbl.name).toLocaleString()} min` : 'Unavailable'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Error */}
            {bookError !== '' && (
              <View style={[styles.errorBox, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }]}>
                <Feather name="alert-circle" size={15} color="#EF4444" />
                <Text style={[styles.errorTxt, { fontFamily: 'Inter_400Regular' }]}>{bookError}</Text>
              </View>
            )}

            {/* Add-Ons */}
            <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 24 }]}>Add-Ons & Packages</Text>
            <View style={{ gap: 10, marginTop: 12 }}>
              {addOns.map(addon => (
                <View key={addon.id} style={[styles.addOnCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
                  <View style={[styles.addOnImgPlaceholder, { backgroundColor: tc.bg2 }]}>
                    <Text style={{ fontSize: 26 }}>🎁</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.addOnName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{addon.name}</Text>
                    <Text style={[styles.addOnDesc, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{addon.desc}</Text>
                    <View style={styles.addOnBottom}>
                      <Text style={[styles.addOnPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{addon.price.toLocaleString()}</Text>
                      <View style={styles.addOnStepper}>
                        <TouchableOpacity
                          style={[styles.addOnBtn, { backgroundColor: tc.bg2, borderColor: tc.border }]}
                          onPress={() => updateAddOnQty(addon.id, -1)}
                        >
                          <Feather name="minus" size={11} color={tc.text} />
                        </TouchableOpacity>
                        <Text style={[styles.addOnQty, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{addon.qty}</Text>
                        <TouchableOpacity
                          style={[styles.addOnBtn, { backgroundColor: tc.bg2, borderColor: tc.border }]}
                          onPress={() => updateAddOnQty(addon.id, 1)}
                        >
                          <Feather name="plus" size={11} color={tc.text} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Order Summary */}
            <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 24 }]}>Order Summary</Text>
            <View style={[styles.summaryCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Table Minimum Spend</Text>
                <Text style={[styles.summaryVal, { color: tc.text, fontFamily: 'Inter_400Regular' }]}>R{tablePrice.toLocaleString()}</Text>
              </View>
              {addOns.filter(a => a.qty > 0).map(a => (
                <View key={a.id} style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>{a.name} ×{a.qty}</Text>
                  <Text style={[styles.summaryVal, { color: tc.text, fontFamily: 'Inter_400Regular' }]}>R{(a.price * a.qty).toLocaleString()}</Text>
                </View>
              ))}
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Service Fee (10%)</Text>
                <Text style={[styles.summaryVal, { color: tc.text, fontFamily: 'Inter_400Regular' }]}>R{serviceFee.toLocaleString()}</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: tc.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryTotal, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Total</Text>
                <Text style={[styles.summaryTotalVal, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{bookingTotal.toLocaleString()}</Text>
              </View>
            </View>

            {/* Deposit note */}
            <View style={[styles.depositNote, { backgroundColor: `${tc.accent}08`, borderColor: `${tc.accent}28` }]}>
              <Feather name="shield" size={16} color={tc.accent} style={{ flexShrink: 0 }} />
              <Text style={[styles.depositTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
                A non-refundable deposit of <Text style={{ color: tc.text, fontFamily: 'Poppins_600SemiBold' }}>R2,000</Text> is required to confirm your booking.
              </Text>
            </View>
          </View>
        )}

        {/* ── GALLERY ── */}
        {activeTab === 'Gallery' && (
          <View style={styles.galleryGrid}>
            {galleryImgs.map((uri, i) => (
              <Image key={i} source={{ uri }} style={[styles.galleryImg, i === 0 && styles.galleryImgLarge]} contentFit="cover" />
            ))}
          </View>
        )}

        {/* ── REVIEWS ── */}
        {activeTab === 'Reviews' && (
          <View style={styles.content}>
            <View style={[styles.ratingBig, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Text style={[styles.ratingScore, { color: tc.text, fontFamily: 'Poppins_900Black' }]}>4.9</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Feather key={s} name="star" size={18} color={GOLD} />)}
              </View>
              <Text style={[styles.ratingCount, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Based on 1,245 reviews</Text>
            </View>
            <View style={{ marginTop: 16 }}>
              <ReviewSection itemKey={clubName} staticReviews={REVIEWS} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Proceed CTA — only on booking tab */}
      {activeTab === 'Booking' && (
        <View style={[styles.cta, { backgroundColor: tc.bg, borderTopColor: tc.border, paddingBottom: insets.bottom + WEB_BOT + 12 }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.ctaBtn}
            onPress={handleProceed}
          >
            <LinearGradient colors={tc.accentGradColors} style={styles.ctaBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Feather name="lock" size={15} color={tc.isDark ? '#000' : '#fff'} />
              <Text style={[styles.ctaBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                Proceed to Payment
              </Text>
              <Feather name="chevron-right" size={16} color={tc.isDark ? '#000' : '#fff'} />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={[styles.ctaSub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Secure & Encrypted Checkout</Text>
        </View>
      )}
      <LoginGateModal visible={gateVisible} onClose={closeGate} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heroWrap: { height: 320, position: 'relative' },
  heroImg: { width: '100%', height: 320 },
  backBtn: { position: 'absolute', left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  shareHeroBtn: { position: 'absolute', right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  heroInfo: { position: 'absolute', bottom: 20, left: 16, right: 16 },
  heroBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  heroBadgeTxt: { fontSize: 9, letterSpacing: 1.5 },
  heroName: { fontSize: 28, color: '#fff', marginBottom: 6 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroArea: { fontSize: 13, color: 'rgba(255,255,255,0.8)', flex: 1, fontFamily: 'Inter_400Regular' },
  heroRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroRatingTxt: { fontSize: 13, color: GOLD },
  tabsRow: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: {},
  tabTxt: { fontSize: 13 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, marginBottom: 10 },
  about: { fontSize: 14, lineHeight: 22 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  amenityTxt: { fontSize: 13 },
  infoRow: { flexDirection: 'row', gap: 10 },
  infoItem: { flex: 1, alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, gap: 4 },
  infoVal: { fontSize: 14 },
  infoLabel: { fontSize: 11 },
  bookCta: { borderRadius: 14, overflow: 'hidden', alignSelf: 'stretch' },
  bookCtaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14 },
  bookCtaTxt: { fontSize: 15 },

  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  stepNum: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepNumTxt: { fontSize: 10, color: '#000' },
  stepTitle: { fontSize: 14 },

  dateCard: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, minWidth: 56 },
  dateDay: { fontSize: 10, letterSpacing: 0.2 },
  dateNum: { fontSize: 18, marginVertical: 1 },
  dateMonth: { fontSize: 9, opacity: 0.75 },

  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  timeBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  timeTxt: { fontSize: 12 },

  guestsCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 4 },
  guestsCount: { fontSize: 15 },
  guestsSub: { fontSize: 12, marginTop: 2 },
  guestsStepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepperVal: { fontSize: 20, width: 28, textAlign: 'center' },

  tablesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  tableCard: { width: (width - 42) / 2, borderRadius: 16, padding: 12, borderWidth: 1, position: 'relative', overflow: 'hidden' },
  tableVipBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tableVipTxt: { fontSize: 8, color: '#000', fontFamily: 'Poppins_700Bold' },
  tableCheckmark: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  tableEmoji: { fontSize: 24, marginBottom: 6 },
  tableName: { fontSize: 13, lineHeight: 17, marginBottom: 2 },
  tableCap: { fontSize: 11, marginBottom: 4 },
  tableMin: { fontSize: 11 },

  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 4 },
  errorTxt: { fontSize: 13, color: '#EF4444', flex: 1, lineHeight: 18 },

  addOnCard: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  addOnImgPlaceholder: { width: 60, height: 60, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  addOnName: { fontSize: 13, marginBottom: 2 },
  addOnDesc: { fontSize: 11, lineHeight: 15, marginBottom: 8 },
  addOnBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addOnPrice: { fontSize: 14 },
  addOnStepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addOnBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  addOnQty: { fontSize: 14, width: 20, textAlign: 'center' },

  summaryCard: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 10, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, flex: 1, paddingRight: 8 },
  summaryVal: { fontSize: 13 },
  summaryDivider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  summaryTotal: { fontSize: 15 },
  summaryTotalVal: { fontSize: 18 },

  contactRow: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginTop: 16 },
  contactItem: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 14 },
  contactVal: { fontSize: 13 },
  contactLabel: { fontSize: 11 },
  contactCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginTop: 16 },
  contactListRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  contactListIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  contactListMeta: { flex: 1 },
  contactListLabel: { fontSize: 11, marginBottom: 2 },
  contactListVal: { fontSize: 14 },

  depositNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 16 },
  depositTxt: { fontSize: 13, lineHeight: 19, flex: 1 },

  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 2 },
  galleryImg: { width: (width - 8) / 3, height: (width - 8) / 3 },
  galleryImgLarge: { width: (width - 8) / 3 * 2 + 2, height: (width - 8) / 3 * 2 + 2 },

  ratingBig: { alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1, gap: 8 },
  ratingScore: { fontSize: 52 },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingCount: { fontSize: 13 },
  reviewCard: { padding: 14, borderRadius: 14, borderWidth: 1 },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarTxt: { fontSize: 14 },
  reviewUser: { fontSize: 14 },
  reviewDate: { fontSize: 12 },
  reviewText: { fontSize: 13, lineHeight: 20 },

  cta: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 12 },
  ctaBtn: { borderRadius: 14, overflow: 'hidden', alignSelf: 'stretch' },
  ctaBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14 },
  ctaBtnTxt: { fontSize: 15 },
  ctaSub: { textAlign: 'center', fontSize: 11, marginTop: 6 },
});
