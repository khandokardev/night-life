import { useTC } from '@/hooks/useTheme';
import { LoginGateModal } from '@/components/LoginGateModal';
import { useLoginGate } from '@/hooks/useLoginGate';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';
import TabHeaderIcons from '@/components/TabHeaderIcons';
import { useApp } from '@/context/AppContext';

const { width } = Dimensions.get('window');
const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const CATEGORIES = [
  { label: 'All',        emoji: '🍽️' },
  { label: 'Fine Dining', emoji: '🥂'  },
  { label: 'Rooftop',    emoji: '🌆'  },
  { label: 'African',    emoji: '🌍'  },
  { label: 'Brunch',     emoji: '☕'  },
  { label: 'Date Night', emoji: '🕯️' },
];

const RESTAURANTS = [
  { id: 0,  name: 'Rooftop by Luma',       area: 'Sandton City',          type: 'Rooftop',     rating: 4.7, reviews: 320,  price: 500,  perPerson: 'R500+', tag: 'NEW',          img: 'https://picsum.photos/seed/luma88/800/500',      desc: 'Panoramic views, signature cocktails, and elevated dishes.' },
  { id: 1,  name: 'Marble Restaurant',     area: 'Rosebank, JHB',         type: 'Fine Dining', rating: 4.9, reviews: 843,  price: 800,  perPerson: 'R800+', tag: 'AWARD WINNING',img: 'https://picsum.photos/seed/marble88/800/500',    desc: 'Wood-fired luxury dining crafted by chef David Higgs in the heart of Johannesburg.' },
  { id: 2,  name: 'Norocco',               area: 'Cape Town',              type: 'Rooftop',     rating: 4.8, reviews: 612,  price: 600,  perPerson: 'R600+', tag: 'TRENDING',     img: 'https://picsum.photos/seed/norocco88/800/500',   desc: 'Stunning Mediterranean-inspired rooftop dining overlooking Signal Hill.' },
  { id: 3,  name: 'The FishMonger',        area: 'V&A Waterfront, CT',    type: 'Fine Dining', rating: 4.7, reviews: 527,  price: 400,  perPerson: 'R400+', tag: 'SEAFOOD',      img: 'https://picsum.photos/seed/fish88/800/500',      desc: 'The freshest daily catches served in a breathtaking waterfront setting.' },
  { id: 4,  name: "Fasie's Braai Bar",     area: 'Sandton, JHB',          type: 'Date Night',  rating: 4.7, reviews: 389,  price: 350,  perPerson: 'R350+', tag: 'LOCAL FAVE',   img: 'https://picsum.photos/seed/braai88/800/500',     desc: 'Authentic South African braai experience with premium Kalahari cuts.' },
  { id: 5,  name: 'Jambo Africa',          area: 'Cape Town City Bowl',   type: 'African',     rating: 4.6, reviews: 291,  price: 300,  perPerson: 'R300+', tag: 'CULTURAL',     img: 'https://picsum.photos/seed/jambo88/800/500',     desc: "Pan-African cuisine celebrating the diversity of the continent's culinary traditions." },
  { id: 6,  name: 'Dragon Palace',         area: 'Sandton, JHB',          type: 'Fine Dining', rating: 4.8, reviews: 445,  price: 400,  perPerson: 'R400+', tag: 'VIP',          img: 'https://picsum.photos/seed/dragon88/800/500',    desc: 'Exquisite Chinese fine dining with a private dining room and sommelier service.' },
  { id: 7,  name: 'Harbour House',         area: 'V&A Waterfront, CT',    type: 'Fine Dining', rating: 4.8, reviews: 498,  price: 650,  perPerson: 'R650+', tag: 'WATERFRONT',   img: 'https://picsum.photos/seed/harbour88/800/500',   desc: 'Iconic Cape Town seafood restaurant with sweeping panoramic ocean views.' },
  { id: 8,  name: 'The Lucky Bean',        area: 'Greenside, JHB',        type: 'Brunch',      rating: 4.5, reviews: 567,  price: 180,  perPerson: 'R180+', tag: 'BRUNCH FAV',   img: 'https://picsum.photos/seed/lucky88/800/500',     desc: 'Beloved neighbourhood spot for weekend brunch and all-day breakfast plates.' },
  { id: 9,  name: 'Wombles Steakhouse',    area: 'Bedfordview, JHB',      type: 'Date Night',  rating: 4.6, reviews: 712,  price: 450,  perPerson: 'R450+', tag: 'CLASSIC',      img: 'https://picsum.photos/seed/wombles88/800/500',   desc: 'Legendary Joburg steakhouse renowned for aged prime cuts and rich sauces.' },
];

const BANNERS = [
  { img: 'https://picsum.photos/seed/diningbn1/800/400', title: 'Discover Exceptional Dining',   sub: 'Handpicked restaurants. Unforgettable flavors.',   cta: 'Explore Now',          restaurantId: 0, restaurantName: 'Rooftop by Luma'   },
  { img: 'https://picsum.photos/seed/diningbn2/800/400', title: 'Fine Dining Experiences',       sub: 'Award-winning chefs. Unforgettable meals.',        cta: 'Explore Fine Dining',  restaurantId: 1, restaurantName: 'Marble Restaurant'  },
  { img: 'https://picsum.photos/seed/diningbn3/800/400', title: 'Rooftop & View Restaurants 🌆', sub: 'Dine with the best views in the country.',         cta: 'Find Rooftops',        restaurantId: 2, restaurantName: 'Norocco'            },
];

export default function DiningScreen() {
  const tc = useTC();
  const { wishlistIds, toggleWishlist, user } = useApp();
  const { gateVisible, closeGate, guard } = useLoginGate();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerRef = useRef<ScrollView>(null);
  const scrollRef = useRef<ScrollView>(null);
  const listY = useRef(0);

  const filtered = useMemo(
    () => filter === 'All' ? RESTAURANTS : RESTAURANTS.filter(r => r.type === filter),
    [filter],
  );
  const featured = RESTAURANTS[0];

  const BANNER_W = width - 32;
  const CARD_W = (width - 44) / 2;

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIdx(prev => {
        const next = (prev + 1) % BANNERS.length;
        bannerRef.current?.scrollTo({ x: next * BANNER_W, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(t);
  }, [BANNER_W]);

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>

        {/* Row 1: Logo + icons */}
        <View style={s.logoRow}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={s.logoImg}
            contentFit="contain"
          />
          <TabHeaderIcons />
        </View>

        {/* Row 2: Greeting */}
        <View style={s.greetRow}>
          <TouchableOpacity onPress={() => router.push('/profile')} style={s.greetBtn} activeOpacity={0.75}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={[s.greetTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Hi, {user?.name || 'Member'}</Text>
              <Feather name="chevron-right" size={12} color={tc.text3} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Row 3: Page title */}
        <Text style={[s.pageTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Discover Dining</Text>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>

        {/* Banner Slider */}
        <View style={s.bannerWrap}>
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_W);
              setBannerIdx(idx);
            }}
          >
            {BANNERS.map((item, i) => (
              <View key={i} style={[s.bannerSlide, { width: BANNER_W }]}>
                <Image source={{ uri: item.img }} style={s.bannerImg} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={s.bannerGrad} />
                <View style={s.bannerContent}>
                  <Text style={[s.bannerTitle, { fontFamily: 'Poppins_700Bold' }]}>{item.title}</Text>
                  <Text style={[s.bannerSub, { fontFamily: 'Inter_400Regular' }]}>{item.sub}</Text>
                  <TouchableOpacity style={s.bannerCta} onPress={() => router.push({ pathname: '/restaurant-detail', params: { id: String(item.restaurantId), name: item.restaurantName } })}>
                    <LinearGradient colors={tc.accentGradColors} style={s.bannerCtaGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
                      <Text style={[s.bannerCtaTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                        {item.cta}  →
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* Pagination dots */}
          <View style={s.bannerDots}>
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[s.bannerDot, {
                  backgroundColor: i === bannerIdx ? tc.accent : 'rgba(255,255,255,0.35)',
                  width: i === bannerIdx ? 20 : 5,
                }]}
              />
            ))}
          </View>
        </View>

        {/* Category Filter — directly below banner */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
          {CATEGORIES.map(cat => {
            const active = filter === cat.label;
            return (
              <TouchableOpacity
                key={cat.label}
                style={[s.catChip, {
                  backgroundColor: active ? tc.accent : tc.card,
                  borderColor: active ? tc.accent : tc.border,
                }]}
                onPress={() => setFilter(cat.label)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 22 }}>{cat.emoji}</Text>
                <Text style={[s.catLabel, {
                  color: active ? (tc.isDark ? '#000' : '#fff') : tc.text2,
                  fontFamily: active ? 'Poppins_600SemiBold' : 'Inter_500Medium',
                }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Dining */}
        {filter === 'All' && (
          <View style={s.featSection}>
            <View style={s.secRow}>
              <Text style={[s.secTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Featured Dining</Text>
              <TouchableOpacity style={s.viewAllRow} onPress={() => {
                setFilter('All');
                setTimeout(() => scrollRef.current?.scrollTo({ y: listY.current, animated: true }), 50);
              }}>
                <Text style={[s.viewAll, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>View all</Text>
                <Feather name="chevron-right" size={13} color={tc.accent} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[s.featCard, { backgroundColor: tc.card, borderColor: tc.border }]}
              onPress={() => router.push({ pathname: '/restaurant-detail', params: { id: String(featured.id), name: featured.name } })}
              activeOpacity={0.88}
            >
              {/* Image — bookmark only, no overlaid text */}
              <View style={s.featImgWrap}>
                <Image source={{ uri: featured.img }} style={s.featImg} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.45)']} style={s.featGrad} />
                <TouchableOpacity
                  style={[s.bookmarkBtn, { backgroundColor: wishlistIds.includes(featured.id + 100) ? `${GOLD}cc` : 'rgba(0,0,0,0.45)' }]}
                  onPress={() => guard(() => toggleWishlist(featured.id + 100))}
                  activeOpacity={0.8}
                >
                  <Feather name="bookmark" size={14} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Details below image */}
              <View style={s.featBody}>
                {/* Name + solid badge inline */}
                <View style={s.featNameRow}>
                  <Text style={[s.featCardName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]} numberOfLines={1}>{featured.name}</Text>
                  <View style={[s.featBadge, { backgroundColor: tc.accent }]}>
                    <Text style={[s.featBadgeTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>{featured.tag}</Text>
                  </View>
                </View>
                <Text style={[s.featTypeLoc, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
                  {featured.type}<Text style={{ color: tc.text3 }}> · </Text>{featured.area}
                </Text>
                <View style={s.featRatingRow}>
                  <Feather name="star" size={13} color={GOLD} />
                  <Text style={[s.featRating, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>{featured.rating}</Text>
                  <Text style={[s.featReviews, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>({featured.reviews})</Text>
                </View>
                <Text style={[s.featDesc, { color: tc.text2, fontFamily: 'Inter_400Regular' }]} numberOfLines={2}>
                  {featured.desc}
                </Text>
                <TouchableOpacity
                  style={[s.featReserveBtn, { backgroundColor: tc.accent }]}
                  onPress={() => router.push({ pathname: '/restaurant-detail', params: { id: String(featured.id), name: featured.name } })}
                  activeOpacity={0.85}
                >
                  <Text style={[s.featReserveTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Reserve Table</Text>
                  <Feather name="arrow-right" size={13} color={tc.isDark ? '#000' : '#fff'} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Restaurant List */}
        <View style={s.listSection} onLayout={e => { listY.current = e.nativeEvent.layout.y; }}>
          <View style={s.listHeader}>
            <Text style={[s.listTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
              {filter === 'All' ? 'All Restaurants' : filter}
            </Text>
            <View style={[s.resultsBadge, { backgroundColor: `${tc.accent}12` }]}>
              <Text style={[s.resultsTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>{filtered.length} places</Text>
            </View>
          </View>

          <View style={s.grid}>
            {filtered.map(item => {
              const isWished = wishlistIds.includes(item.id + 100);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[s.gridCard, { backgroundColor: tc.card, borderColor: tc.border, width: CARD_W }]}
                  onPress={() => router.push({ pathname: '/restaurant-detail', params: { id: String(item.id), name: item.name } })}
                  activeOpacity={0.88}
                >
                  <View style={s.gridImgWrap}>
                    <Image source={{ uri: item.img }} style={s.gridImg} contentFit="cover" cachePolicy="memory-disk" />
                    <View style={[s.gridTag, { backgroundColor: tc.accent }]}>
                      <Text style={[s.gridTagTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>{item.tag}</Text>
                    </View>
                    <TouchableOpacity
                      style={[s.gridBookmark, { backgroundColor: isWished ? `${tc.accent}cc` : 'rgba(0,0,0,0.45)' }]}
                      onPress={() => guard(() => toggleWishlist(item.id + 100))}
                      activeOpacity={0.8}
                    >
                      <Feather name="bookmark" size={11} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <View style={s.gridBody}>
                    <Text style={[s.gridName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[s.gridMeta, { color: tc.text2, fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>{item.type}</Text>
                    <View style={s.gridRatingRow}>
                      <Feather name="star" size={10} color={GOLD} />
                      <Text style={[s.gridRating, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>{item.rating}</Text>
                      <Text style={[s.gridReviews, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>({item.reviews})</Text>
                    </View>
                    <View style={s.gridFooter}>
                      <Text style={[s.gridPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>{item.perPerson}</Text>
                      <TouchableOpacity
                        style={[s.gridCartBtn, { backgroundColor: tc.accent }]}
                        onPress={() => router.push({ pathname: '/restaurant-detail', params: { id: String(item.id), name: item.name } })}
                        activeOpacity={0.85}
                      >
                        <Feather name="arrow-right" size={12} color={tc.isDark ? '#000' : '#fff'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {filtered.length === 0 && (
            <View style={[s.empty, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Feather name="coffee" size={36} color={tc.text3} />
              <Text style={[s.emptyTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>No restaurants found</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <LoginGateModal visible={gateVisible} onClose={closeGate} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 4 },

  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  logoImg: { width: 60, height: 50 },

  greetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 2, paddingBottom: 2 },
  greetBtn: { paddingVertical: 2 },
  greetTxt: { fontSize: 13 },
  bellBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, position: 'relative' },
  bellDot: { position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },

  pageTitle: { fontSize: 26, paddingHorizontal: 16, paddingBottom: 8 },

  catScroll: { paddingTop: 4, marginBottom: 20 },
  catChip: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, width: 80, height: 80, borderRadius: 18, borderWidth: 1 },
  catLabel: { fontSize: 11, textAlign: 'center' },

  bannerWrap: { paddingHorizontal: 16, paddingTop: 16, marginBottom: 20 },
  bannerSlide: { height: 195, borderRadius: 18, overflow: 'hidden' },
  bannerImg: { width: '100%', height: 195 },
  bannerGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  bannerContent: { position: 'absolute', bottom: 14, left: 14, right: 14 },
  bannerTitle: { fontSize: 17, color: '#fff', marginBottom: 3 },
  bannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 10 },
  bannerCta: { alignSelf: 'flex-start', borderRadius: 10, overflow: 'hidden' },
  bannerCtaGrad: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10 },
  bannerCtaTxt: { fontSize: 12 },
  bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 10 },
  bannerDot: { height: 4, borderRadius: 2 },

  featSection: { paddingHorizontal: 16, marginBottom: 20 },
  secRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  secTitle: { fontSize: 16 },
  viewAllRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAll: { fontSize: 12 },

  featCard: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  featImgWrap: { position: 'relative' },
  featImg: { width: '100%', height: 200 },
  featGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  bookmarkBtn: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  featBody: { padding: 14, gap: 6 },
  featNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featCardName: { fontSize: 17, flex: 1 },
  featBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 7 },
  featBadgeTxt: { fontSize: 10, letterSpacing: 0.5 },
  featTypeLoc: { fontSize: 13 },
  featRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  featRating: { fontSize: 14 },
  featReviews: { fontSize: 13 },
  featDesc: { fontSize: 13, lineHeight: 20 },
  featReserveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 12, marginTop: 4 },
  featReserveTxt: { fontSize: 13 },

  listSection: { paddingHorizontal: 16 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  listTitle: { fontSize: 16 },
  resultsBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  resultsTxt: { fontSize: 11 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  gridImgWrap: { position: 'relative' },
  gridImg: { width: '100%', height: 130 },
  gridTag: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  gridTagTxt: { fontSize: 8, letterSpacing: 0.5 },
  gridBookmark: { position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  gridBody: { padding: 10, gap: 3 },
  gridName: { fontSize: 13, lineHeight: 17 },
  gridMeta: { fontSize: 11 },
  gridRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  gridRating: { fontSize: 10 },
  gridReviews: { fontSize: 10 },
  gridFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  gridPrice: { fontSize: 12 },
  gridCartBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  empty: { borderRadius: 16, borderWidth: 1, padding: 48, alignItems: 'center', gap: 10 },
  emptyTxt: { fontSize: 15 },
});
