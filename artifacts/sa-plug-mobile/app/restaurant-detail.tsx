import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { LoginGateModal } from '@/components/LoginGateModal';
import { useLoginGate } from '@/hooks/useLoginGate';
import { shareContent } from '@/utils/share';
import ReviewSection from '@/components/ReviewSection';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions, Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { openCall, openMap } from '@/utils/linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const { width } = Dimensions.get('window');
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

const MENU_TABS = ['Overview', 'Menu', 'Gallery', 'Reviews'];
const MENU_CATS = ['Starters', 'Mains', 'Desserts', 'Drinks'];
const MENU_ITEMS = {
  Starters: [
    { id: 1, name: 'Beef Carpaccio', desc: 'Paper-thin Wagyu with truffle oil & parmesan', price: 185 },
    { id: 2, name: 'Prawn Cocktail', desc: 'Jumbo prawns with Marie Rose sauce & lemon', price: 165 },
  ],
  Mains: [
    { id: 3, name: 'Wood-Fired Ribeye', desc: '400g prime cut, herb butter, truffle fries', price: 485 },
    { id: 4, name: 'Pan-Seared Kingklip', desc: 'West Coast kingklip, saffron cream, asparagus', price: 365 },
  ],
  Desserts: [
    { id: 5, name: 'Malva Pudding', desc: 'Classic SA dessert with vanilla ice cream', price: 95 },
    { id: 6, name: 'Baked Cheesecake', desc: 'NY-style with berry coulis', price: 105 },
  ],
  Drinks: [
    { id: 7, name: 'Negroni', desc: 'Gin, Campari, sweet vermouth', price: 135 },
    { id: 8, name: 'Dom Pérignon', desc: 'Vintage 2013, 750ml', price: 3800 },
  ],
};
const TIME_SLOTS = ['12:00', '13:00', '18:00', '19:00', '20:00', '21:00'];
const REVIEWS = [
  { id: 1, user: 'Zanele M.', rating: 5, text: 'World-class food and impeccable service. A true gem.' },
  { id: 2, user: 'Pieter V.',  rating: 5, text: 'The wood-fired ribeye is the best steak in SA, hands down.' },
];

export default function RestaurantDetailScreen() {
  const tc = useTC();
  const { addToCart, isLoggedIn } = useApp();
  const { gateVisible, closeGate, guard } = useLoginGate();
  const insets = useSafeAreaInsets();
  const { id, name } = useLocalSearchParams<{ id?: string; name?: string }>();
  const [activeTab, setActiveTab] = useState('Overview');
  const [menuCat, setMenuCat] = useState('Starters');
  const [selectedDate, setSelectedDate] = useState(-1);
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [booked, setBooked] = useState(false);

  const restName = name ?? 'Restaurant';
  const img = `https://picsum.photos/seed/rest${id ?? 1}/800/500`;

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { day: d.toLocaleDateString('en-ZA', { weekday: 'short' }), num: d.getDate() };
  });

  const handleBook = () => {
    if (selectedDate === -1 || !selectedTime) return;
    guard(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setBooked(true);
      setTimeout(() => { setBooked(false); router.push('/checkout-details'); }, 800);
    });
  };

  const handleShare = async () => {
    await shareContent({
      title: `SA PLUG — ${restName}`,
      message: `Check out ${restName} on SA PLUG!\n🍽️ Fine Dining · Rosebank, Johannesburg\n⭐ 4.9 Rating · From R800 per person\n\nReserve your table via the SA PLUG app.`,
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + WEB_BOT + 100 }}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: img }} style={styles.heroImg} contentFit="cover" />
          <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
          <TouchableOpacity style={[styles.backBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shareHeroBtn, { top: insets.top + 12 }]} onPress={handleShare} activeOpacity={0.8}>
            <Feather name="share-2" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroInfo}>
            <View style={[styles.heroBadge, { backgroundColor: tc.accent }]}>
              <Text style={[styles.heroBadgeTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>AWARD WINNING</Text>
            </View>
            <Text style={[styles.heroName, { fontFamily: 'Poppins_700Bold' }]}>{restName}</Text>
            <View style={styles.heroRow}>
              <Feather name="map-pin" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroArea}>Rosebank, Johannesburg</Text>
              <View style={[styles.heroRating]}>
                <Feather name="star" size={12} color={GOLD} />
                <Text style={[styles.heroRatingTxt, { fontFamily: 'Poppins_600SemiBold' }]}>4.9</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsRow, { backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
          {MENU_TABS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && [styles.tabActive, { borderBottomColor: tc.accent }]]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabTxt, { color: activeTab === t ? tc.accent : tc.text3, fontFamily: activeTab === t ? 'Poppins_600SemiBold' : 'Inter_400Regular' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Overview' && (
          <View style={styles.content}>
            <View style={[styles.metaRow, { backgroundColor: tc.card, borderColor: tc.border }]}>
              {[
                { icon: 'star',    val: '4.9', label: 'Rating'   },
                { icon: 'users',   val: '843', label: 'Reviews'  },
                { icon: 'dollar-sign', val: 'R800+', label: 'Per Person' },
              ].map((m, i) => (
                <View key={m.label} style={[styles.metaItem, i < 2 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: tc.border }]}>
                  <Feather name={m.icon as any} size={15} color={tc.accent} />
                  <Text style={[styles.metaVal, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{m.val}</Text>
                  <Text style={[styles.metaLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{m.label}</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>About</Text>
            <Text style={[styles.about, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              {restName} is a landmark of fine dining in South Africa. Chef David Higgs' wood-fired philosophy transforms the finest local produce into extraordinary dining experiences that have earned multiple international accolades.
            </Text>
            <View style={styles.tagsRow}>
              {['Fine Dining', 'Wood-Fired', 'Award Winner', 'Private Dining'].map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: tc.chipBg, borderColor: tc.border }]}>
                  <Text style={[styles.tagTxt, { color: tc.chipColor, fontFamily: 'Inter_400Regular' }]}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.contactCard, { backgroundColor: tc.card, borderColor: tc.border, marginTop: 16 }]}>
              <View style={[styles.contactListRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: tc.border }]}>
                <View style={[styles.contactListIcon, { backgroundColor: `${tc.accent}18` }]}>
                  <Feather name="clock" size={16} color={tc.accent} />
                </View>
                <View style={styles.contactListMeta}>
                  <Text style={[styles.contactListLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Hours</Text>
                  <Text style={[styles.contactListVal, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>12:00 – 22:00</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.contactListRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: tc.border }]}
                onPress={() => openCall('+27111234567')}
                activeOpacity={0.75}
              >
                <View style={[styles.contactListIcon, { backgroundColor: `${tc.accent}18` }]}>
                  <Feather name="phone" size={16} color={tc.accent} />
                </View>
                <View style={styles.contactListMeta}>
                  <Text style={[styles.contactListLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Phone</Text>
                  <Text style={[styles.contactListVal, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>+27 11 555 0191</Text>
                </View>
                <Feather name="chevron-right" size={15} color={tc.text3} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactListRow}
                onPress={() => openMap('Rosebank, Johannesburg')}
                activeOpacity={0.75}
              >
                <View style={[styles.contactListIcon, { backgroundColor: `${tc.accent}18` }]}>
                  <Feather name="map-pin" size={16} color={tc.accent} />
                </View>
                <View style={styles.contactListMeta}>
                  <Text style={[styles.contactListLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Location</Text>
                  <Text style={[styles.contactListVal, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Rosebank, Johannesburg</Text>
                </View>
                <Feather name="chevron-right" size={15} color={tc.text3} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'Menu' && (
          <View style={styles.content}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
              {MENU_CATS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.catChip, { backgroundColor: menuCat === c ? tc.chipActiveBg : tc.chipBg, borderColor: menuCat === c ? tc.chipActiveBg : tc.border }]}
                  onPress={() => setMenuCat(c)}
                >
                  <Text style={[styles.catChipTxt, { color: menuCat === c ? tc.chipActiveColor : tc.chipColor, fontFamily: menuCat === c ? 'Poppins_600SemiBold' : 'Inter_400Regular' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {(MENU_ITEMS[menuCat as keyof typeof MENU_ITEMS] ?? []).map(item => (
              <View key={item.id} style={[styles.menuItem, { backgroundColor: tc.card, borderColor: tc.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{item.name}</Text>
                  <Text style={[styles.menuDesc, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{item.desc}</Text>
                </View>
                <Text style={[styles.menuPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{item.price}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Gallery' && (
          <View style={styles.galleryGrid}>
            {Array.from({ length: 6 }, (_, i) => (
              <Image key={i} source={{ uri: `https://picsum.photos/seed/restGall${id}${i}/400/400` }} style={styles.galleryImg} contentFit="cover" />
            ))}
          </View>
        )}

        {activeTab === 'Reviews' && (
          <View style={styles.content}>
            <ReviewSection itemKey={restName} staticReviews={REVIEWS} />
          </View>
        )}

        {/* Reservation Section */}
        {activeTab === 'Overview' && (
          <View style={[styles.content, { paddingTop: 0 }]}>
            <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Make a Reservation</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 8 }}>
              {dates.map((d, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateCard, { backgroundColor: selectedDate === i ? tc.accent : tc.card, borderColor: selectedDate === i ? tc.accent : tc.border }]}
                  onPress={() => setSelectedDate(i)}
                >
                  <Text style={[styles.dateDay, { color: selectedDate === i ? (tc.isDark ? '#000' : '#fff') : tc.text3 }]}>{d.day}</Text>
                  <Text style={[styles.dateNum, { color: selectedDate === i ? (tc.isDark ? '#000' : '#fff') : tc.text, fontFamily: 'Poppins_700Bold' }]}>{d.num}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.timesRow}>
              {TIME_SLOTS.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeBtn, { backgroundColor: selectedTime === t ? tc.accent : tc.card, borderColor: selectedTime === t ? tc.accent : tc.border }]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.timeTxt, { color: selectedTime === t ? (tc.isDark ? '#000' : '#fff') : tc.text, fontFamily: selectedTime === t ? 'Poppins_600SemiBold' : 'Inter_400Regular' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.guestRow, { backgroundColor: tc.card, borderColor: tc.border, marginTop: 12 }]}>
              <Text style={[styles.guestLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Guests: {guests}</Text>
              <View style={styles.guestCounter}>
                <TouchableOpacity style={[styles.counterBtn, { backgroundColor: tc.bg2, borderColor: tc.border }]} onPress={() => setGuests(g => Math.max(1, g - 1))}>
                  <Feather name="minus" size={14} color={tc.text} />
                </TouchableOpacity>
                <Text style={[styles.counterNum, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{guests}</Text>
                <TouchableOpacity style={[styles.counterBtn, { backgroundColor: tc.bg2, borderColor: tc.border }]} onPress={() => setGuests(g => Math.min(12, g + 1))}>
                  <Feather name="plus" size={14} color={tc.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {activeTab === 'Overview' && (
        <View style={[styles.cta, { backgroundColor: tc.bg, borderTopColor: tc.border, paddingBottom: insets.bottom + WEB_BOT + 12 }]}>
          <TouchableOpacity
            style={[styles.ctaBtn, { opacity: (selectedDate === -1 || !selectedTime) ? 0.45 : 1 }]}
            onPress={handleBook}
            disabled={selectedDate === -1 || !selectedTime}
            activeOpacity={0.85}
          >
            <LinearGradient colors={tc.accentGradColors} style={styles.ctaBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Text style={[styles.ctaBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                {booked ? '✓ Reserved!' : 'Reserve Table'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      <LoginGateModal visible={gateVisible} onClose={closeGate} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heroWrap: { height: 300, position: 'relative' },
  heroImg: { width: '100%', height: 300 },
  backBtn: { position: 'absolute', left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  shareHeroBtn: { position: 'absolute', right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  heroInfo: { position: 'absolute', bottom: 18, left: 16, right: 16 },
  heroBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  heroBadgeTxt: { fontSize: 9, letterSpacing: 1 },
  heroName: { fontSize: 24, color: '#fff', marginBottom: 6 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroArea: { fontSize: 13, color: 'rgba(255,255,255,0.8)', flex: 1, fontFamily: 'Inter_400Regular' },
  heroRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroRatingTxt: { fontSize: 13, color: GOLD },
  tabsRow: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: {},
  tabTxt: { fontSize: 13 },
  content: { padding: 16 },
  metaRow: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, marginBottom: 18 },
  metaItem: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 },
  metaVal: { fontSize: 15 },
  metaLabel: { fontSize: 11 },
  sectionTitle: { fontSize: 15, marginBottom: 10 },
  about: { fontSize: 14, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  tagTxt: { fontSize: 12 },
  infoRow: { flexDirection: 'row', gap: 8 },
  infoItem: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 3 },
  infoVal: { fontSize: 12 },
  infoLabel: { fontSize: 10 },
  contactCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  contactListRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  contactListIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  contactListMeta: { flex: 1 },
  contactListLabel: { fontSize: 11, marginBottom: 2 },
  contactListVal: { fontSize: 14 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  catChipTxt: { fontSize: 13 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  menuName: { fontSize: 14, marginBottom: 2 },
  menuDesc: { fontSize: 12, lineHeight: 17 },
  menuPrice: { fontSize: 14, marginLeft: 10 },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, padding: 12 },
  galleryImg: { width: (width - 32) / 3, height: (width - 32) / 3, borderRadius: 8 },
  reviewCard: { padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarTxt: { fontSize: 14 },
  reviewUser: { fontSize: 14 },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewText: { fontSize: 13, lineHeight: 20 },
  dateCard: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, minWidth: 52 },
  dateDay: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  dateNum: { fontSize: 18 },
  timesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  timeBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, borderWidth: 1 },
  timeTxt: { fontSize: 14 },
  guestRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1 },
  guestLabel: { fontSize: 14 },
  guestCounter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  counterNum: { fontSize: 16, minWidth: 22, textAlign: 'center' },
  cta: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 12 },
  ctaBtn: { borderRadius: 14, overflow: 'hidden', alignSelf: 'stretch' },
  ctaBtnGrad: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14 },
  ctaBtnTxt: { fontSize: 15 },
});
