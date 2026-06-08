import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { LoginGateModal } from '@/components/LoginGateModal';
import { useLoginGate } from '@/hooks/useLoginGate';
import ReviewSection from '@/components/ReviewSection';
import { shareContent } from '@/utils/share';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { openCall, openEmail, openMap } from '@/utils/linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

const TOUR_REVIEWS = [
  { id: 1, user: 'Ayanda N.', rating: 5, date: '3 days ago',  text: 'An absolutely breathtaking experience. Worth every cent — pure luxury from start to finish.' },
  { id: 2, user: 'Marco V.',  rating: 5, date: '1 week ago',  text: 'The helicopter tour was jaw-dropping. SA PLUG curates truly incredible experiences.' },
  { id: 3, user: 'Lerato M.', rating: 4, date: '2 weeks ago', text: 'Our guide was exceptional and the food was world-class. Highly recommended!' },
];

const HIGHLIGHTS = ['🚁 Private Transport', '🍾 Champagne Included', '📸 Pro Photography', '🌿 Small Groups (max 8)', '🏡 Luxury Accommodation', '👨‍🍳 Private Chef'];
const INCLUDES = ['Hotel pickup & drop-off', 'All entrance fees', 'Gourmet lunch & drinks', 'Expert local guide', 'Certificate of experience'];

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i + 1);
  return { day: d.toLocaleDateString('en-ZA', { weekday: 'short' }), num: d.getDate(), available: i !== 2 };
});

export default function TourDetailScreen() {
  const tc = useTC();
  const { addToCart, wishlistIds, toggleWishlist } = useApp();
  const { gateVisible, closeGate, guard } = useLoginGate();
  const insets = useSafeAreaInsets();
  const { id, name } = useLocalSearchParams<{ id?: string; name?: string }>();
  const [selectedDate, setSelectedDate] = useState(-1);
  const [guests, setGuests] = useState(1);
  const [booked, setBooked] = useState(false);

  const tourName = name ?? 'Tour Experience';
  const img = `https://picsum.photos/seed/tourDetail${id ?? 1}/800/500`;
  const pricePerPerson = 4500;
  const total = pricePerPerson * guests;

  const handleBook = () => {
    if (selectedDate === -1) return;
    guard(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addToCart({ id: Number(id ?? 99), name: tourName, price: total, venue: `${guests} guest${guests > 1 ? 's' : ''}` });
      setBooked(true);
      setTimeout(() => { setBooked(false); router.push('/cart'); }, 1000);
    });
  };

  const handleShare = async () => {
    await shareContent({
      title: `SA PLUG — ${tourName}`,
      message: `Check out ${tourName} on SA PLUG!\n🚁 Luxury Experience · Cape Town, South Africa\n⭐ 4.9 Rating · From R${pricePerPerson.toLocaleString()}pp\n\nBook your experience via the SA PLUG app.`,
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + WEB_BOT + 100 }}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: img }} style={styles.heroImg} contentFit="cover" />
          <LinearGradient colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={[styles.backBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveHeroBtn, { top: insets.top + 12, backgroundColor: wishlistIds.includes(Number(id ?? 99)) ? `${GOLD}cc` : 'rgba(0,0,0,0.5)' }]} onPress={() => guard(() => toggleWishlist(Number(id ?? 99)))} activeOpacity={0.8}>
            <Feather name="heart" size={18} color={wishlistIds.includes(Number(id ?? 99)) ? '#000' : '#fff'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shareHeroBtn, { top: insets.top + 12 }]} onPress={handleShare} activeOpacity={0.8}>
            <Feather name="share-2" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroInfo}>
            <View style={[styles.heroBadge, { backgroundColor: tc.accent }]}>
              <Text style={[styles.heroBadgeTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>LUXURY</Text>
            </View>
            <Text style={[styles.heroName, { fontFamily: 'Poppins_700Bold' }]} numberOfLines={2}>{tourName}</Text>
            <View style={styles.heroRow}>
              <Feather name="map-pin" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroArea}>Cape Town, South Africa</Text>
              <View style={styles.heroDuration}>
                <Feather name="clock" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroDurationTxt}>4 hours</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Rating & Reviews */}
          <View style={[styles.metaCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            {[
              { icon: 'star', val: '4.9', label: 'Rating', color: GOLD },
              { icon: 'users', val: '127', label: 'Reviews', color: tc.accent },
              { icon: 'award', val: '#1', label: 'In CT', color: tc.accent },
            ].map((m, i) => (
              <View key={m.label} style={[styles.metaItem, i < 2 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: tc.border }]}>
                <Feather name={m.icon as any} size={16} color={m.color} />
                <Text style={[styles.metaVal, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{m.val}</Text>
                <Text style={[styles.metaLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{m.label}</Text>
              </View>
            ))}
          </View>

          {/* About */}
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>About This Experience</Text>
          <Text style={[styles.about, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            {tourName} is one of South Africa's most sought-after luxury experiences. Crafted for discerning travellers who demand nothing but the finest, this experience combines breathtaking scenery with world-class hospitality.
          </Text>

          {/* Highlights */}
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Highlights</Text>
          <View style={styles.highlightGrid}>
            {HIGHLIGHTS.map((h, i) => (
              <View key={i} style={[styles.highlightItem, { backgroundColor: tc.card, borderColor: tc.border }]}>
                <Text style={[styles.highlightTxt, { color: tc.text, fontFamily: 'Inter_400Regular' }]}>{h}</Text>
              </View>
            ))}
          </View>

          {/* What's included */}
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>What's Included</Text>
          <View style={{ gap: 8, marginTop: 10 }}>
            {INCLUDES.map((inc, i) => (
              <View key={i} style={styles.includeRow}>
                <View style={[styles.checkCircle, { backgroundColor: tc.accent + '20' }]}>
                  <Feather name="check" size={12} color={tc.accent} />
                </View>
                <Text style={[styles.includeTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{inc}</Text>
              </View>
            ))}
          </View>

          {/* Contact */}
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Contact</Text>
          <View style={[styles.contactCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            {[
              { icon: 'phone',   label: 'Phone',    val: '+27 21 555 0123',         action: () => openCall('+27215550123') },
              { icon: 'mail',    label: 'Email',    val: 'tours@saplug.co.za',       action: () => openEmail('tours@saplug.co.za') },
              { icon: 'map-pin', label: 'Location', val: 'Cape Town, South Africa', action: () => openMap('Cape Town, South Africa') },
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

          {/* Select Date */}
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 8 }}>
            {DATES.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dateCard,
                  {
                    backgroundColor: selectedDate === i ? tc.accent : tc.card,
                    borderColor: selectedDate === i ? tc.accent : tc.border,
                    opacity: d.available ? 1 : 0.4,
                  },
                ]}
                onPress={() => d.available && setSelectedDate(i)}
                disabled={!d.available}
              >
                <Text style={[styles.dateDay, { color: selectedDate === i ? (tc.isDark ? '#000' : '#fff') : tc.text3 }]}>{d.day}</Text>
                <Text style={[styles.dateNum, { color: selectedDate === i ? (tc.isDark ? '#000' : '#fff') : tc.text, fontFamily: 'Poppins_700Bold' }]}>{d.num}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Guests */}
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Number of Guests</Text>
          <View style={[styles.guestRow, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <View>
              <Text style={[styles.guestLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Guests</Text>
              <Text style={[styles.guestSub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Min 1, max 8 per booking</Text>
            </View>
            <View style={styles.guestCounter}>
              <TouchableOpacity
                style={[styles.counterBtn, { backgroundColor: tc.bg2, borderColor: tc.border }]}
                onPress={() => setGuests(g => Math.max(1, g - 1))}
              >
                <Feather name="minus" size={16} color={tc.text} />
              </TouchableOpacity>
              <Text style={[styles.counterNum, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{guests}</Text>
              <TouchableOpacity
                style={[styles.counterBtn, { backgroundColor: tc.bg2, borderColor: tc.border }]}
                onPress={() => setGuests(g => Math.min(8, g + 1))}
              >
                <Feather name="plus" size={16} color={tc.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reviews */}
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 24 }]}>Reviews</Text>
          <View style={{ marginTop: 10 }}>
            <ReviewSection itemKey={tourName} staticReviews={TOUR_REVIEWS} />
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.cta, { backgroundColor: tc.bg, borderTopColor: tc.border, paddingBottom: insets.bottom + WEB_BOT + 12 }]}>
        {selectedDate === -1 && (
          <View style={styles.ctaHint}>
            <Feather name="calendar" size={12} color={tc.accent} />
            <Text style={[styles.ctaHintTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Select a date above to enable booking</Text>
          </View>
        )}
        <View style={styles.ctaTop}>
          <View>
            <Text style={[styles.ctaFrom, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Total ({guests} guests)</Text>
            <Text style={[styles.ctaPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{total.toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            style={[styles.ctaBtn, { opacity: selectedDate === -1 ? 0.6 : 1 }]}
            onPress={handleBook}
            disabled={selectedDate === -1}
            activeOpacity={0.85}
          >
            <LinearGradient colors={tc.accentGradColors} style={styles.ctaBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Text style={[styles.ctaBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                {booked ? '✓ Added to Cart!' : 'Book Now'}
              </Text>
              {!booked && <Feather name="arrow-right" size={15} color={tc.isDark ? '#000' : '#fff'} />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <LoginGateModal visible={gateVisible} onClose={closeGate} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heroWrap: { height: 300, position: 'relative' },
  heroImg: { width: '100%', height: 300 },
  backBtn: { position: 'absolute', left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  saveHeroBtn: { position: 'absolute', right: 62, width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  shareHeroBtn: { position: 'absolute', right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  heroInfo: { position: 'absolute', bottom: 18, left: 16, right: 16 },
  heroBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  heroBadgeTxt: { fontSize: 9, letterSpacing: 1.5 },
  heroName: { fontSize: 22, color: '#fff', lineHeight: 30, marginBottom: 6 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroArea: { fontSize: 13, color: 'rgba(255,255,255,0.8)', flex: 1, fontFamily: 'Inter_400Regular' },
  heroDuration: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroDurationTxt: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  content: { padding: 16 },
  metaCard: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, marginBottom: 18 },
  metaItem: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 },
  metaVal: { fontSize: 16 },
  metaLabel: { fontSize: 11 },
  contactCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 18 },
  contactListRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  contactListIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  contactListMeta: { flex: 1 },
  contactListLabel: { fontSize: 11, marginBottom: 2 },
  contactListVal: { fontSize: 14 },
  sectionTitle: { fontSize: 15, marginBottom: 10 },
  about: { fontSize: 14, lineHeight: 22 },
  highlightGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  highlightItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  highlightTxt: { fontSize: 13 },
  includeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  includeTxt: { fontSize: 14 },
  dateCard: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, minWidth: 52 },
  dateDay: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  dateNum: { fontSize: 18 },
  guestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginTop: 10 },
  guestLabel: { fontSize: 14 },
  guestSub: { fontSize: 12, marginTop: 1 },
  guestCounter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  counterNum: { fontSize: 18, minWidth: 24, textAlign: 'center' },
  cta: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 10 },
  ctaHint: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  ctaHintTxt: { fontSize: 12 },
  ctaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ctaFrom: { fontSize: 12, marginBottom: 2 },
  ctaPrice: { fontSize: 20 },
  ctaBtn: { borderRadius: 14, overflow: 'hidden', minWidth: 148 },
  ctaBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14 },
  ctaBtnTxt: { fontSize: 15 },
});
