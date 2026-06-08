import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const SHOP_PRODUCTS = [
  { id: 20, name: 'SA PLUG Hoodie',        price: 699,  rating: 4.8, reviews: 128, cat: 'Merchandise', emoji: '👕' },
  { id: 21, name: 'SA PLUG Tee',           price: 349,  rating: 4.6, reviews: 94,  cat: 'Merchandise', emoji: '👕' },
  { id: 22, name: 'SA PLUG Cap',           price: 299,  rating: 4.7, reviews: 76,  cat: 'Merchandise', emoji: '🧢' },
  { id: 31, name: 'SA PLUG Bomber',        price: 1299, rating: 4.9, reviews: 58,  cat: 'Merchandise', emoji: '🧥' },
  { id: 32, name: 'SA PLUG Joggers',       price: 549,  rating: 4.5, reviews: 67,  cat: 'Merchandise', emoji: '👖' },
  { id: 33, name: 'SA PLUG Snapback',      price: 249,  rating: 4.6, reviews: 43,  cat: 'Merchandise', emoji: '🎩' },
  { id: 34, name: 'Socks 3-Pack',          price: 199,  rating: 4.4, reviews: 82,  cat: 'Merchandise', emoji: '🧦' },
  { id: 23, name: 'Dom Pérignon',          price: 1200, rating: 4.9, reviews: 55,  cat: 'Drinks',      emoji: '🍾' },
  { id: 24, name: 'SA PLUG Vodka',         price: 950,  rating: 4.7, reviews: 43,  cat: 'Drinks',      emoji: '🍶' },
  { id: 25, name: 'Premium Whiskey',       price: 1100, rating: 4.8, reviews: 38,  cat: 'Drinks',      emoji: '🥃' },
  { id: 35, name: 'Moët & Chandon Rosé',   price: 890,  rating: 4.8, reviews: 61,  cat: 'Drinks',      emoji: '🍷' },
  { id: 36, name: 'Hennessy VSOP 750ml',   price: 1350, rating: 4.9, reviews: 47,  cat: 'Drinks',      emoji: '🍶' },
  { id: 37, name: 'Craft Gin Bundle',      price: 680,  rating: 4.5, reviews: 29,  cat: 'Drinks',      emoji: '🌿' },
  { id: 38, name: 'Wine Connoisseur Set',  price: 750,  rating: 4.6, reviews: 33,  cat: 'Drinks',      emoji: '🍷' },
  { id: 26, name: 'VIP Bottle Package',    price: 2500, rating: 4.9, reviews: 89,  cat: 'Packages',    emoji: '🎁' },
  { id: 27, name: 'Premium Experience',    price: 3800, rating: 4.9, reviews: 62,  cat: 'Packages',    emoji: '⭐' },
  { id: 39, name: 'Birthday VIP Package',  price: 5500, rating: 4.9, reviews: 44,  cat: 'Packages',    emoji: '🎂' },
  { id: 40, name: "Couple's Night Out",    price: 1800, rating: 4.7, reviews: 71,  cat: 'Packages',    emoji: '💑' },
  { id: 41, name: 'Squad Night Package',   price: 4200, rating: 4.8, reviews: 53,  cat: 'Packages',    emoji: '🥂' },
  { id: 42, name: 'Corporate Hospitality', price: 8500, rating: 4.9, reviews: 27,  cat: 'Packages',    emoji: '🏢' },
  { id: 28, name: 'Gift Card',             price: 250,  rating: 4.8, reviews: 201, cat: 'Accessories', emoji: '🎴' },
  { id: 29, name: 'SA PLUG Tote Bag',      price: 280,  rating: 4.5, reviews: 47,  cat: 'Accessories', emoji: '👜' },
  { id: 30, name: 'VIP Wristband Pack',    price: 120,  rating: 4.6, reviews: 33,  cat: 'Accessories', emoji: '⌚' },
  { id: 43, name: 'Phone Wallet Case',     price: 349,  rating: 4.5, reviews: 56,  cat: 'Accessories', emoji: '📱' },
  { id: 44, name: 'SA PLUG Keyring',       price: 89,   rating: 4.4, reviews: 94,  cat: 'Accessories', emoji: '🔑' },
  { id: 45, name: 'Luxury Scented Candle', price: 420,  rating: 4.7, reviews: 38,  cat: 'Accessories', emoji: '🕯️' },
  { id: 46, name: 'SA PLUG Sticker Pack',  price: 49,   rating: 4.3, reviews: 113, cat: 'Accessories', emoji: '🏷️' },
];

const SHOP_IDS = new Set(SHOP_PRODUCTS.map(p => p.id));

export default function ProfileSavedProductsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { wishlistIds, toggleWishlist, addToCart } = useApp();

  const saved = SHOP_PRODUCTS.filter(p => wishlistIds.includes(p.id));

  const handleAddToCart = (p: typeof SHOP_PRODUCTS[0]) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart({ id: p.id, name: p.name, price: p.price, venue: 'SA PLUG Shop' });
  };

  const handleRemove = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleWishlist(id);
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.75}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
          Saved Products{saved.length > 0 ? ` (${saved.length})` : ''}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30, gap: 12 }}>
        {saved.length === 0 ? (
          /* ── Empty State ── */
          <View style={styles.empty}>
            <View style={[styles.emptyIconWrap, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Text style={{ fontSize: 40 }}>🛍️</Text>
            </View>
            <Text style={[styles.emptyTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>No saved products yet</Text>
            <Text style={[styles.emptySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
              Tap the heart on any product to save it here for later
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/shop')}
              activeOpacity={0.85}
              style={styles.browseBtn}
            >
              <LinearGradient
                colors={tc.accentGradColors}
                style={styles.browseBtnGrad}
                start={{ x: 0.07, y: 0 }}
                end={{ x: 0.93, y: 1 }}
              >
                <Feather name="shopping-bag" size={15} color={tc.isDark ? '#000' : '#fff'} />
                <Text style={[styles.browseBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                  Browse Shop
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Saved Products List ── */
          saved.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.card, { backgroundColor: tc.card, borderColor: tc.border }]}
              onPress={() => router.push({ pathname: '/shop-detail', params: { id: String(p.id) } })}
              activeOpacity={0.88}
            >
              {/* Emoji thumbnail */}
              <View style={[styles.thumb, { backgroundColor: tc.card2 }]}>
                <Text style={{ fontSize: 34 }}>{p.emoji}</Text>
              </View>

              {/* Product info */}
              <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10 }}>
                <View style={[styles.catBadge, { backgroundColor: `${tc.accent}15` }]}>
                  <Text style={[styles.catTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>{p.cat}</Text>
                </View>
                <Text style={[styles.name, { color: tc.text, fontFamily: 'Poppins_700Bold' }]} numberOfLines={2}>{p.name}</Text>
                <View style={styles.ratingRow}>
                  <Feather name="star" size={11} color={GOLD} />
                  <Text style={[styles.ratingTxt, { color: GOLD, fontFamily: 'Poppins_600SemiBold' }]}>{p.rating}</Text>
                  <Text style={[styles.reviewsTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>({p.reviews})</Text>
                </View>
                <Text style={[styles.price, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{p.price.toLocaleString()}</Text>
              </View>

              {/* Actions column */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.cartBtn, { backgroundColor: tc.accent }]}
                  onPress={() => handleAddToCart(p)}
                  activeOpacity={0.85}
                >
                  <Feather name="shopping-cart" size={14} color={tc.isDark ? '#000' : '#fff'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.removeBtn, { borderColor: tc.border }]}
                  onPress={() => handleRemove(p.id)}
                  activeOpacity={0.8}
                >
                  <Feather name="heart" size={14} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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

  empty: { alignItems: 'center', paddingTop: 72, gap: 14, paddingHorizontal: 16 },
  emptyIconWrap: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emptyTitle: { fontSize: 18 },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  browseBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 6 },
  browseBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 32, paddingVertical: 14 },
  browseBtnTxt: { fontSize: 14 },

  card: {
    flexDirection: 'row', borderRadius: 16, borderWidth: 1,
    overflow: 'hidden', alignItems: 'center',
  },
  thumb: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, marginBottom: 4 },
  catTxt: { fontSize: 10, letterSpacing: 0.3 },
  name: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  ratingTxt: { fontSize: 11 },
  reviewsTxt: { fontSize: 11 },
  price: { fontSize: 14 },

  actions: { flexDirection: 'column', gap: 8, paddingVertical: 16, paddingRight: 12, paddingLeft: 4, alignItems: 'center', justifyContent: 'center' },
  cartBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  removeBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
