import { useApp } from '@/context/AppContext';
import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions, FlatList, Platform, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';
import TabHeaderIcons from '@/components/TabHeaderIcons';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const SCREEN_W = Dimensions.get('window').width;
const CATS = [
  { label: 'All',         emoji: '🛍️' },
  { label: 'Merchandise', emoji: '👕' },
  { label: 'Drinks',      emoji: '🥤' },
  { label: 'Packages',    emoji: '🎁' },
  { label: 'Accessories', emoji: '⌚' },
];

const SHOP_PRODUCTS = [
  { id: 20, name: 'SA PLUG Hoodie',        price: 699,  rating: 4.8, cat: 'Merchandise', emoji: '👕', desc: 'Premium comfort. Iconic vibes.',              sizes: ['S','M','L','XL'] },
  { id: 21, name: 'SA PLUG Tee',           price: 349,  rating: 4.6, cat: 'Merchandise', emoji: '👕', desc: 'Soft-touch premium cotton.',                  sizes: ['S','M','L','XL','XXL'] },
  { id: 22, name: 'SA PLUG Cap',           price: 299,  rating: 4.7, cat: 'Merchandise', emoji: '🧢', desc: 'Snapback. Embroidered logo.',                  sizes: ['One Size'] },
  { id: 31, name: 'SA PLUG Bomber',        price: 1299, rating: 4.9, cat: 'Merchandise', emoji: '🧥', desc: 'Limited edition. Premium satin.',             sizes: ['S','M','L','XL'] },
  { id: 32, name: 'SA PLUG Joggers',       price: 549,  rating: 4.5, cat: 'Merchandise', emoji: '👖', desc: 'Ultra-soft lounge wear.',                     sizes: ['S','M','L','XL'] },
  { id: 33, name: 'SA PLUG Snapback',      price: 249,  rating: 4.6, cat: 'Merchandise', emoji: '🎩', desc: 'Flat brim. Gold logo. Clean.',                sizes: ['One Size'] },
  { id: 34, name: 'Socks 3-Pack',          price: 199,  rating: 4.4, cat: 'Merchandise', emoji: '🧦', desc: 'Premium comfort. Branded.',                   sizes: ['One Size'] },
  { id: 23, name: 'Dom Pérignon',          price: 1200, rating: 4.9, cat: 'Drinks',      emoji: '🍾', desc: 'Vintage brut champagne.',                      sizes: [] },
  { id: 24, name: 'SA PLUG Vodka',         price: 950,  rating: 4.7, cat: 'Drinks',      emoji: '🍶', desc: 'Ultra-premium distilled vodka.',              sizes: [] },
  { id: 25, name: 'Premium Whiskey',       price: 1100, rating: 4.8, cat: 'Drinks',      emoji: '🥃', desc: '12-year aged single malt.',                   sizes: [] },
  { id: 35, name: 'Moët & Chandon Rosé',   price: 890,  rating: 4.8, cat: 'Drinks',      emoji: '🍷', desc: 'Iconic rosé champagne.',                       sizes: [] },
  { id: 36, name: 'Hennessy VSOP 750ml',   price: 1350, rating: 4.9, cat: 'Drinks',      emoji: '🍶', desc: 'Rich cognac. Deep notes.',                     sizes: [] },
  { id: 37, name: 'Craft Gin Bundle',      price: 680,  rating: 4.5, cat: 'Drinks',      emoji: '🌿', desc: 'SA craft gins. 2-bottle set.',                 sizes: [] },
  { id: 38, name: 'Wine Connoisseur Set',  price: 750,  rating: 4.6, cat: 'Drinks',      emoji: '🍷', desc: 'Curated Stellenbosch wines.',                  sizes: [] },
  { id: 26, name: 'VIP Bottle Package',    price: 2500, rating: 4.9, cat: 'Packages',    emoji: '🎁', desc: 'Skip the line. Own the night.',                sizes: [] },
  { id: 27, name: 'Premium Experience',    price: 3800, rating: 4.9, cat: 'Packages',    emoji: '⭐', desc: 'VIP table, 3 bottles, host.',                  sizes: [] },
  { id: 39, name: 'Birthday VIP Package',  price: 5500, rating: 4.9, cat: 'Packages',    emoji: '🎂', desc: 'Cake, confetti, bottles, table.',              sizes: [] },
  { id: 40, name: "Couple's Night Out",    price: 1800, rating: 4.7, cat: 'Packages',    emoji: '💑', desc: 'Champagne, flowers, private booth.',           sizes: [] },
  { id: 41, name: 'Squad Night Package',   price: 4200, rating: 4.8, cat: 'Packages',    emoji: '🥂', desc: 'Up to 8 guests. VIP area + 4 bottles.',       sizes: [] },
  { id: 42, name: 'Corporate Hospitality', price: 8500, rating: 4.9, cat: 'Packages',    emoji: '🏢', desc: 'Full venue buyout. Catering included.',        sizes: [] },
  { id: 28, name: 'Gift Card',             price: 250,  rating: 4.8, cat: 'Accessories', emoji: '🎴', desc: 'Give the gift of luxury.',                     sizes: ['R250','R500','R1000'] },
  { id: 29, name: 'SA PLUG Tote Bag',      price: 280,  rating: 4.5, cat: 'Accessories', emoji: '👜', desc: 'Premium canvas. Branded.',                     sizes: [] },
  { id: 30, name: 'VIP Wristband Pack',    price: 120,  rating: 4.6, cat: 'Accessories', emoji: '⌚', desc: '3-pack. Exclusive events access.',              sizes: [] },
  { id: 43, name: 'Phone Wallet Case',     price: 349,  rating: 4.5, cat: 'Accessories', emoji: '📱', desc: 'Leather. Card slots. SA PLUG branded.',        sizes: ['iPhone','Android'] },
  { id: 44, name: 'SA PLUG Keyring',       price: 89,   rating: 4.4, cat: 'Accessories', emoji: '🔑', desc: 'Metal. Engraved logo.',                        sizes: [] },
  { id: 45, name: 'Luxury Scented Candle', price: 420,  rating: 4.7, cat: 'Accessories', emoji: '🕯️', desc: 'Hand-poured. Oud & amber.',                   sizes: [] },
  { id: 46, name: 'SA PLUG Sticker Pack',  price: 49,   rating: 4.3, cat: 'Accessories', emoji: '🏷️', desc: '10 premium vinyl stickers.',                   sizes: [] },
];

const BANNERS = [
  { bg: ['#1a0a00', '#3d2200'] as [string, string], emoji: '🛍️', title: 'Elevate Your Night.', sub: 'Official Merchandise & Premium Drinks.', cta: 'Shop Now', cat: 'All' },
  { bg: ['#0a0a1a', '#1a1a4d'] as [string, string], emoji: '🎁', title: 'VIP Packages 🎁',     sub: 'Skip the line. Own the experience.',         cta: 'View Packages', cat: 'Packages' },
  { bg: ['#0a1a0a', '#1a3d1a'] as [string, string], emoji: '🍾', title: 'Premium Drinks',      sub: 'Champagne, Vodka, Whiskey & more.',          cta: 'Browse Drinks', cat: 'Drinks' },
];

export default function ShopScreen() {
  const tc = useTC();
  const { user } = useApp();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState('All');
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = useMemo(
    () => cat === 'All' ? SHOP_PRODUCTS : SHOP_PRODUCTS.filter(p => p.cat === cat),
    [cat],
  );
  const featured = SHOP_PRODUCTS[0];

  useEffect(() => {
    bannerTimer.current = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => { if (bannerTimer.current) clearInterval(bannerTimer.current); };
  }, []);

  const banner = BANNERS[bannerIdx];

  const ListHeader = (
    <View>
      {/* ── BANNER ── */}
      <View style={styles.bannerWrap}>
        <LinearGradient colors={banner.bg} style={styles.banner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { fontFamily: 'Poppins_700Bold', color: '#fff' }]}>{banner.title}</Text>
            <Text style={[styles.bannerSub, { fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.65)' }]}>{banner.sub}</Text>
            <TouchableOpacity
              style={[styles.bannerBtn, { backgroundColor: tc.accent }]}
              onPress={() => setCat(banner.cat)}
              activeOpacity={0.85}
            >
              <Text style={[styles.bannerBtnTxt, { fontFamily: 'Poppins_600SemiBold', color: tc.isDark ? '#000' : '#fff' }]}>{banner.cta}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.dots}>
          {BANNERS.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === bannerIdx ? tc.accent : tc.border2, width: i === bannerIdx ? 16 : 6 }]} />
          ))}
        </View>
      </View>

      {/* ── FLASH SALE ── */}
      <TouchableOpacity
        style={[styles.flashRow, { backgroundColor: tc.card, borderColor: tc.border }]}
        onPress={() => router.push('/deals')}
        activeOpacity={0.85}
      >
        <View style={styles.flashLeft}>
          <Feather name="zap" size={18} color="#ef4444" />
          <View>
            <Text style={[styles.flashLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>FLASH SALE — up to 40% OFF</Text>
            <Text style={[styles.flashTimer, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>
              Ends in <Text style={{ color: tc.accent }}>02:45:30</Text>
            </Text>
          </View>
        </View>
        <View style={[styles.flashCta, { backgroundColor: tc.accent }]}>
          <Text style={[styles.flashCtaTxt, { fontFamily: 'Poppins_600SemiBold', color: tc.isDark ? '#000' : '#fff' }]}>View Deals</Text>
        </View>
      </TouchableOpacity>

      {/* ── CATEGORY CHIPS ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
        {CATS.map(c => {
          const active = cat === c.label;
          return (
            <TouchableOpacity
              key={c.label}
              style={[styles.chip, { backgroundColor: active ? tc.accent : tc.card, borderColor: active ? tc.accent : tc.border }]}
              onPress={() => setCat(c.label)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
              <Text style={[styles.chipTxt, { color: active ? (tc.isDark ? '#000' : '#fff') : tc.text2, fontFamily: active ? 'Poppins_600SemiBold' : 'Inter_400Regular' }]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── FEATURED PRODUCT (All only) ── */}
      {cat === 'All' && (
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Featured Product</Text>
          <TouchableOpacity
            style={[styles.featuredCard, { backgroundColor: tc.card, borderColor: tc.border }]}
            onPress={() => router.push({ pathname: '/shop-detail', params: { id: featured.id, name: featured.name } })}
            activeOpacity={0.9}
          >
            <View style={[styles.featuredEmoji, { backgroundColor: tc.card2 }]}>
              <Text style={{ fontSize: 52 }}>{featured.emoji}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[styles.featuredName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{featured.name}</Text>
              <Text style={[styles.featuredDesc, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{featured.desc}</Text>
              <View style={styles.featuredRating}>
                <Text style={{ fontSize: 11 }}>⭐</Text>
                <Text style={[{ fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: GOLD }]}>{featured.rating}</Text>
              </View>
              <View style={styles.featuredBottom}>
                <Text style={[styles.featuredPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{featured.price}</Text>
                <TouchableOpacity
                  style={[styles.featuredAddBtn, { backgroundColor: tc.accent }]}
                  onPress={() => router.push({ pathname: '/shop-detail', params: { id: featured.id, name: featured.name } })}
                  activeOpacity={0.85}
                >
                  <Feather name="shopping-cart" size={14} color={tc.isDark ? '#000' : '#fff'} />
                  <Text style={[{ fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: tc.isDark ? '#000' : '#fff' }]}>
                    Shop Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ── GRID HEADER ── */}
      <View style={styles.gridHeader}>
        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{cat === 'All' ? 'Best Sellers' : cat}</Text>
        <Text style={[styles.gridCount, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{filtered.length} items</Text>
      </View>
    </View>
  );

  const NUM_COLS = 3;
  const CARD_W = (SCREEN_W - 32 - 8 * (NUM_COLS - 1)) / NUM_COLS;

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      {/* ── HEADER ── */}
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        {/* Row 1: Logo */}
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImg}
            contentFit="contain"
          />
          <TabHeaderIcons />
        </View>
        {/* Row 2: Greeting */}
        <View style={styles.greetRow}>
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.75} style={styles.greetInner}>
            <Text style={[styles.greetTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Hi, {user?.name || 'Member'}</Text>
            <Feather name="chevron-right" size={12} color={tc.text3} />
          </TouchableOpacity>
        </View>
        {/* Row 3: Title */}
        <Text style={[styles.pageTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Shop</Text>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={filtered}
        keyExtractor={p => String(p.id)}
        numColumns={NUM_COLS}
        key={cat}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        columnWrapperStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 8 }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={6}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: CARD_W, backgroundColor: tc.card, borderColor: tc.border }]}
            onPress={() => router.push({ pathname: '/shop-detail', params: { id: item.id, name: item.name } })}
            activeOpacity={0.9}
          >
            <View style={[styles.emojiBox, { backgroundColor: tc.card2 }]}>
              <Text style={styles.emojiTxt}>{item.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.productName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={2}>{item.name}</Text>
              <View style={styles.ratingRow}>
                <Feather name="star" size={8} color={GOLD} />
                <Text style={[styles.ratingTxt, { color: GOLD, fontFamily: 'Poppins_600SemiBold' }]}>{item.rating}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{item.price}</Text>
                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: tc.accent }]}
                  onPress={() => router.push({ pathname: '/shop-detail', params: { id: item.id, name: item.name } })}
                  activeOpacity={0.85}
                >
                  <Feather name="shopping-cart" size={11} color={tc.isDark ? '#000' : '#fff'} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  logoImg: { width: 60, height: 50 },
  header: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 4 },
  greetRow: { paddingHorizontal: 16, paddingBottom: 2 },
  greetInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  greetTxt: { fontSize: 13 },
  pageTitle: { fontSize: 26, paddingHorizontal: 16, paddingBottom: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  badge: { position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { fontSize: 9, fontWeight: '800' },
  bannerWrap: { paddingHorizontal: 16, marginTop: 14, marginBottom: 8 },
  banner: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 120 },
  bannerEmoji: { fontSize: 44 },
  bannerTitle: { fontSize: 15, marginBottom: 2 },
  bannerSub: { fontSize: 11, marginBottom: 10, lineHeight: 16 },
  bannerBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, alignSelf: 'flex-start' },
  bannerBtnTxt: { fontSize: 11 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 8 },
  dot: { height: 4, borderRadius: 2 },
  flashRow: { marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1 },
  flashLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flashLabel: { fontSize: 10, marginBottom: 2 },
  flashTimer: { fontSize: 13 },
  flashCta: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  flashCtaTxt: { fontSize: 11 },
  chips: { marginBottom: 12 },
  chip: { width: 80, height: 80, borderRadius: 18, borderWidth: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 },
  chipTxt: { fontSize: 11, textAlign: 'center' },
  sectionTitle: { fontSize: 14, marginBottom: 10 },
  featuredCard: { borderRadius: 18, padding: 14, flexDirection: 'row', gap: 14, borderWidth: 1 },
  featuredEmoji: { width: 96, height: 96, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featuredName: { fontSize: 15, lineHeight: 20 },
  featuredDesc: { fontSize: 11, lineHeight: 16 },
  featuredRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  featuredBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  featuredPrice: { fontSize: 20 },
  featuredAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  gridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
  gridCount: { fontSize: 11 },
  card: { borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  emojiBox: { height: 80, alignItems: 'center', justifyContent: 'center' },
  emojiTxt: { fontSize: 36 },
  cardBody: { padding: 8, gap: 3 },
  productName: { fontSize: 10, lineHeight: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingTxt: { fontSize: 9 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  price: { fontSize: 11 },
  sizeBtn: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  addBtn: { width: 22, height: 22, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
