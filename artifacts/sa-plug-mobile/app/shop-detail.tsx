import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { LoginGateModal } from '@/components/LoginGateModal';
import { useLoginGate } from '@/hooks/useLoginGate';
import ReviewSection from '@/components/ReviewSection';
import { shareContent } from '@/utils/share';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_BOT = Platform.OS === 'web' ? 34 : 0;
const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const SHOP_PRODUCTS = [
  { id: 20, name: 'SA PLUG Hoodie',        price: 699,  rating: 4.8, reviews: 128, cat: 'Merchandise', emoji: '👕', desc: 'Premium comfort. Iconic vibes. Made from heavyweight cotton blend with an embroidered SA PLUG logo on the chest.',  sizes: ['S','M','L','XL'] },
  { id: 21, name: 'SA PLUG Tee',           price: 349,  rating: 4.6, reviews: 94,  cat: 'Merchandise', emoji: '👕', desc: 'Soft-touch premium cotton. Relaxed fit with subtle branding. Perfect for day-to-night looks.',                       sizes: ['S','M','L','XL','XXL'] },
  { id: 22, name: 'SA PLUG Cap',           price: 299,  rating: 4.7, reviews: 76,  cat: 'Merchandise', emoji: '🧢', desc: 'Snapback. Embroidered logo. Flat brim with adjustable back strap. One size fits all.',                             sizes: ['One Size'] },
  { id: 31, name: 'SA PLUG Bomber',        price: 1299, rating: 4.9, reviews: 58,  cat: 'Merchandise', emoji: '🧥', desc: 'Limited edition. Premium satin bomber with embroidered SA PLUG branding. Collector\'s item.',                      sizes: ['S','M','L','XL'] },
  { id: 32, name: 'SA PLUG Joggers',       price: 549,  rating: 4.5, reviews: 67,  cat: 'Merchandise', emoji: '👖', desc: 'Ultra-soft lounge wear. Brushed fleece interior. Elasticated waist with drawcord.',                               sizes: ['S','M','L','XL'] },
  { id: 33, name: 'SA PLUG Snapback',      price: 249,  rating: 4.6, reviews: 43,  cat: 'Merchandise', emoji: '🎩', desc: 'Flat brim. Gold logo. Clean design. Premium 6-panel construction.',                                              sizes: ['One Size'] },
  { id: 34, name: 'Socks 3-Pack',          price: 199,  rating: 4.4, reviews: 82,  cat: 'Merchandise', emoji: '🧦', desc: 'Premium comfort. Branded SA PLUG design. 3 pairs per pack. One size fits all.',                                   sizes: ['One Size'] },
  { id: 23, name: 'Dom Pérignon',          price: 1200, rating: 4.9, reviews: 55,  cat: 'Drinks',      emoji: '🍾', desc: 'Vintage brut champagne. Prestige cuvée harvested from exceptional years. Delivered chilled.',                      sizes: [] },
  { id: 24, name: 'SA PLUG Vodka',         price: 950,  rating: 4.7, reviews: 43,  cat: 'Drinks',      emoji: '🍶', desc: 'Ultra-premium distilled vodka. Five-times distilled from Highveld grain. Silky smooth with a clean finish.',      sizes: [] },
  { id: 25, name: 'Premium Whiskey',       price: 1100, rating: 4.8, reviews: 38,  cat: 'Drinks',      emoji: '🥃', desc: '12-year aged single malt. Rich amber with notes of dried fruit, vanilla, and spiced oak.',                         sizes: [] },
  { id: 35, name: 'Moët & Chandon Rosé',   price: 890,  rating: 4.8, reviews: 61,  cat: 'Drinks',      emoji: '🍷', desc: 'Iconic rosé champagne. Delicate pink hue with notes of strawberry and white peach.',                               sizes: [] },
  { id: 36, name: 'Hennessy VSOP 750ml',   price: 1350, rating: 4.9, reviews: 47,  cat: 'Drinks',      emoji: '🍶', desc: 'Rich cognac. Deep notes of roasted almonds, vanilla, and cinnamon. Finished in Limousin oak.',                     sizes: [] },
  { id: 37, name: 'Craft Gin Bundle',      price: 680,  rating: 4.5, reviews: 29,  cat: 'Drinks',      emoji: '🌿', desc: 'SA craft gins. 2-bottle set featuring award-winning South African botanicals.',                                   sizes: [] },
  { id: 38, name: 'Wine Connoisseur Set',  price: 750,  rating: 4.6, reviews: 33,  cat: 'Drinks',      emoji: '🍷', desc: 'Curated Stellenbosch wines. 3 bottles selected by our resident sommelier.',                                        sizes: [] },
  { id: 26, name: 'VIP Bottle Package',    price: 2500, rating: 4.9, reviews: 89,  cat: 'Packages',    emoji: '🎁', desc: 'Skip the line. Own the night. Includes 2 premium bottles, VIP wristbands, and table reservation.',                  sizes: [] },
  { id: 27, name: 'Premium Experience',    price: 3800, rating: 4.9, reviews: 62,  cat: 'Packages',    emoji: '⭐', desc: 'VIP table, 3 bottles, personal host for the evening. The full SA PLUG experience.',                                sizes: [] },
  { id: 39, name: 'Birthday VIP Package',  price: 5500, rating: 4.9, reviews: 44,  cat: 'Packages',    emoji: '🎂', desc: 'Cake, confetti, bottles, VIP table. Make your birthday unforgettable.',                                            sizes: [] },
  { id: 40, name: "Couple's Night Out",    price: 1800, rating: 4.7, reviews: 71,  cat: 'Packages',    emoji: '💑', desc: 'Champagne, flowers, private booth. A romantic evening crafted for two.',                                           sizes: [] },
  { id: 41, name: 'Squad Night Package',   price: 4200, rating: 4.8, reviews: 53,  cat: 'Packages',    emoji: '🥂', desc: 'Up to 8 guests. VIP area + 4 bottles. Perfect for group celebrations.',                                           sizes: [] },
  { id: 42, name: 'Corporate Hospitality', price: 8500, rating: 4.9, reviews: 27,  cat: 'Packages',    emoji: '🏢', desc: 'Full venue buyout. Catering and event coordination included. Minimum 30 guests.',                                   sizes: [] },
  { id: 28, name: 'Gift Card',             price: 250,  rating: 4.8, reviews: 201, cat: 'Accessories', emoji: '🎴', desc: 'Give the gift of luxury. Redeemable on any SA PLUG product or booking.',                                          sizes: ['R250','R500','R1000'] },
  { id: 29, name: 'SA PLUG Tote Bag',      price: 280,  rating: 4.5, reviews: 47,  cat: 'Accessories', emoji: '👜', desc: 'Premium canvas. Branded with the SA PLUG wordmark. Reinforced handles and internal pocket.',                       sizes: [] },
  { id: 30, name: 'VIP Wristband Pack',    price: 120,  rating: 4.6, reviews: 33,  cat: 'Accessories', emoji: '⌚', desc: '3-pack wristbands. Used for exclusive SA PLUG events. Collector\'s item.',                                         sizes: [] },
  { id: 43, name: 'Phone Wallet Case',     price: 349,  rating: 4.5, reviews: 56,  cat: 'Accessories', emoji: '📱', desc: 'Leather. Card slots. SA PLUG branded. Available for iPhone and Android Universal.',                                sizes: ['iPhone','Android'] },
  { id: 44, name: 'SA PLUG Keyring',       price: 89,   rating: 4.4, reviews: 94,  cat: 'Accessories', emoji: '🔑', desc: 'Metal keyring. Engraved SA PLUG logo. Premium die-cast zinc alloy.',                                              sizes: [] },
  { id: 45, name: 'Luxury Scented Candle', price: 420,  rating: 4.7, reviews: 38,  cat: 'Accessories', emoji: '🕯️', desc: 'Hand-poured. Oud & amber fragrance. 45-hour burn time. Elegant matte glass vessel.',                              sizes: [] },
  { id: 46, name: 'SA PLUG Sticker Pack',  price: 49,   rating: 4.3, reviews: 113, cat: 'Accessories', emoji: '🏷️', desc: '10 premium vinyl stickers. Waterproof and UV resistant. Multiple SA PLUG designs.',                               sizes: [] },
];

const SHOP_REVIEWS = [
  { id: 1, name: 'Mpho K.',     rating: 5, date: '3 days ago',   text: 'Absolutely love it! Premium quality and the design is fire. Got so many compliments wearing this out.' },
  { id: 2, name: 'Thandeka L.', rating: 4, date: '1 week ago',   text: 'Great product, super comfortable. Sizing runs a bit large so I\'d recommend going down a size.' },
  { id: 3, name: 'Sipho N.',    rating: 5, date: '2 weeks ago',  text: 'Top quality. Arrived quickly and packaging was premium. Will definitely buy again.' },
];

export default function ShopDetailScreen() {
  const tc = useTC();
  const { addToCart, wishlistIds, toggleWishlist } = useApp();
  const { gateVisible, closeGate, guard } = useLoginGate();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const numId = Number(id ?? 20);
  const p = SHOP_PRODUCTS.find(x => x.id === numId) ?? SHOP_PRODUCTS[0];
  const isWished = wishlistIds.includes(p.id);
  const related = SHOP_PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat).slice(0, 5);
  const origPrice = Math.round(p.price * 1.25);

  const handleAdd = () => {
    if (p.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const name = `${p.name}${selectedSize ? ` (${selectedSize})` : ''}`;
    for (let i = 0; i < qty; i++) {
      addToCart({ id: p.id, name, price: p.price, venue: 'SA PLUG Shop' });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    await shareContent({
      title: `SA PLUG Store — ${p.name}`,
      message: `Check out ${p.name} on SA PLUG!\n${p.emoji} ${p.cat}\n⭐ ${p.rating} (${p.reviews} reviews) · R${p.price.toLocaleString()}\n\n${p.desc}\n\nShop via the SA PLUG app.`,
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      {/* ── STICKY HEADER ── */}
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity style={[styles.headerBtn, { backgroundColor: tc.card, borderColor: tc.border }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Product Details</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: tc.card, borderColor: tc.border }]}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Feather name="share-2" size={18} color={tc.text2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: tc.card, borderColor: tc.border }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); guard(() => toggleWishlist(p.id)); }}
          >
            <Feather name="heart" size={20} color={isWished ? '#EF4444' : tc.text2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + WEB_BOT + 100 }}>
        {/* ── EMOJI HERO ── */}
        <View style={[styles.emojiHero, { backgroundColor: tc.card2 }]}>
          <Text style={styles.emojiHeroTxt}>{p.emoji}</Text>
        </View>

        <View style={styles.content}>
          {/* ── NAME + IN STOCK ── */}
          <View style={styles.nameRow}>
            <Text style={[styles.productName, { color: tc.text, fontFamily: 'Poppins_700Bold', flex: 1 }]}>{p.name}</Text>
            <View style={[styles.inStockBadge, { backgroundColor: `${tc.accentTeal ?? '#14b8a6'}15`, borderColor: `${tc.accentTeal ?? '#14b8a6'}50` }]}>
              <Text style={[styles.inStockTxt, { color: tc.accentTeal ?? '#14b8a6', fontFamily: 'Poppins_600SemiBold' }]}>In Stock</Text>
            </View>
          </View>

          {/* ── DESC ── */}
          <Text style={[styles.desc, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{p.desc}</Text>

          {/* ── STARS ── */}
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(i => (
              <Feather key={i} name="star" size={13} color={GOLD} />
            ))}
            <Text style={[styles.ratingNum, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>{p.rating}</Text>
            <Text style={[styles.ratingCount, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>({p.reviews} reviews)</Text>
          </View>

          {/* ── PRICE ── */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{p.price.toLocaleString()}</Text>
            <Text style={[styles.origPrice, { color: tc.text3 ?? '#666', fontFamily: 'Inter_400Regular' }]}>R{origPrice.toLocaleString()}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountTxt}>-20%</Text>
            </View>
          </View>

          {/* ── SIZES ── */}
          {p.sizes.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sizeTitleRow}>
                <Text style={[styles.sectionTitle, { color: sizeError ? '#ef4444' : tc.text, fontFamily: 'Poppins_700Bold' }]}>Size</Text>
                {sizeError && <Text style={[styles.sizeError, { fontFamily: 'Inter_400Regular' }]}>— please select a size</Text>}
              </View>
              <View style={styles.sizesWrap}>
                {p.sizes.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.sizeBtn,
                      {
                        backgroundColor: selectedSize === s ? tc.accent : sizeError ? 'rgba(239,68,68,0.05)' : tc.card,
                        borderColor: selectedSize === s ? tc.accent : sizeError ? 'rgba(239,68,68,0.5)' : tc.border,
                      },
                    ]}
                    onPress={() => { setSelectedSize(s); setSizeError(false); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.sizeTxt, {
                      color: selectedSize === s ? (tc.isDark ? '#000' : '#fff') : sizeError ? '#ef4444' : tc.text2,
                      fontFamily: selectedSize === s ? 'Poppins_700Bold' : 'Inter_400Regular',
                    }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── QUANTITY ── */}
          <View style={styles.qtySection}>
            <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Quantity</Text>
            <View style={[styles.qtyRow, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}>
                <Feather name="minus" size={18} color={tc.text} />
              </TouchableOpacity>
              <Text style={[styles.qtyNum, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.min(10, q + 1))}>
                <Feather name="plus" size={18} color={tc.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── REVIEWS ── */}
          <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 24 }]}>Reviews</Text>
          <View style={{ marginTop: 8 }}>
            <ReviewSection itemKey={p.name} staticReviews={SHOP_REVIEWS} />
          </View>

          {/* ── RELATED ── */}
          {related.length > 0 && (
            <View style={{ marginTop: 28 }}>
              <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginBottom: 10 }]}>More from {p.cat}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {related.map(rel => (
                  <TouchableOpacity
                    key={rel.id}
                    style={[styles.relCard, { backgroundColor: tc.card, borderColor: tc.border }]}
                    onPress={() => router.push({ pathname: '/shop-detail', params: { id: rel.id, name: rel.name } })}
                    activeOpacity={0.9}
                  >
                    <View style={[styles.relEmoji, { backgroundColor: tc.card2 }]}>
                      <Text style={{ fontSize: 32 }}>{rel.emoji}</Text>
                    </View>
                    <View style={{ padding: 8 }}>
                      <Text style={[styles.relName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={2}>{rel.name}</Text>
                      <Text style={[styles.relPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{rel.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── CTA ── */}
      <View style={[styles.cta, { backgroundColor: tc.bg, borderTopColor: tc.border, paddingBottom: insets.bottom + WEB_BOT + 12 }]}>
        <View style={styles.ctaRow}>
          <View>
            <Text style={[styles.ctaLabel, { color: tc.text3 ?? '#888', fontFamily: 'Inter_400Regular' }]}>Total</Text>
            <Text style={[styles.ctaTotal, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{(p.price * qty).toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.ctaBtn} onPress={handleAdd} activeOpacity={0.85}>
            <LinearGradient colors={added ? ['#22C55E', '#16A34A'] : tc.accentGradColors} style={styles.ctaBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              {added
                ? <Feather name="check" size={16} color={tc.isDark ? '#000' : '#fff'} />
                : <Feather name="shopping-cart" size={18} color={tc.isDark ? '#000' : '#fff'} />}
              <Text style={[styles.ctaBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { flex: 1, fontSize: 17, textAlign: 'center' },
  emojiHero: { height: 220, alignItems: 'center', justifyContent: 'center' },
  emojiHeroTxt: { fontSize: 88 },
  content: { padding: 20, gap: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  productName: { fontSize: 22, lineHeight: 28 },
  inStockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, marginTop: 4 },
  inStockTxt: { fontSize: 11 },
  desc: { fontSize: 13, lineHeight: 21, marginBottom: 14 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 12 },
  ratingNum: { fontSize: 14, marginLeft: 3 },
  ratingCount: { fontSize: 13 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  price: { fontSize: 28 },
  origPrice: { fontSize: 14, textDecorationLine: 'line-through' },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: 'rgba(239,68,68,0.15)' },
  discountTxt: { fontSize: 11, fontWeight: '700', color: '#ef4444' },
  sectionBlock: { marginBottom: 20 },
  sizeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 15 },
  sizeError: { fontSize: 12, color: '#ef4444' },
  sizesWrap: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  sizeBtn: { minWidth: 46, paddingHorizontal: 12, height: 46, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  sizeTxt: { fontSize: 13 },
  qtySection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  qtyBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  qtyNum: { width: 42, textAlign: 'center', fontSize: 17 },
  reviewCard: { padding: 14, borderRadius: 16, borderWidth: 1 },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarTxt: { fontSize: 15 },
  reviewUser: { fontSize: 14, lineHeight: 18 },
  reviewDate: { fontSize: 11 },
  starsRowSmall: { flexDirection: 'row', gap: 1 },
  reviewText: { fontSize: 13, lineHeight: 20 },
  relCard: { width: 120, borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  relEmoji: { height: 80, alignItems: 'center', justifyContent: 'center' },
  relName: { fontSize: 11, lineHeight: 15, marginBottom: 4 },
  relPrice: { fontSize: 13 },
  cta: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 12 },
  ctaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ctaLabel: { fontSize: 12 },
  ctaTotal: { fontSize: 22 },
  ctaBtn: { borderRadius: 14, overflow: 'hidden' },
  ctaBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 26, paddingVertical: 14, borderRadius: 14 },
  ctaBtnTxt: { fontSize: 14 },
});
