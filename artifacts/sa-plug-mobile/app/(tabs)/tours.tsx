import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { LoginGateModal } from '@/components/LoginGateModal';
import { useLoginGate } from '@/hooks/useLoginGate';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions, FlatList, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';
import TabHeaderIcons from '@/components/TabHeaderIcons';

const { width } = Dimensions.get('window');
const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const CATS = [
  { label: 'All',       emoji: '🌍' },
  { label: 'Safari',    emoji: '🦁' },
  { label: 'City',      emoji: '🏙️' },
  { label: 'Wine',      emoji: '🍷' },
  { label: 'Adventure', emoji: '🏔️' },
  { label: 'Cultural',  emoji: '🎭' },
];

const TOURS = [
  { id: 10, name: 'Sunset Safari Experience',  loc: 'Kruger National Park', price: 2900,  rating: 4.8, dur: '3 Days',    reviews: 256, cat: 'Safari',    img: 'https://picsum.photos/seed/safari88/800/500' },
  { id: 11, name: 'Cape Town City Tour',        loc: 'Cape Town',            price: 950,   rating: 4.6, dur: 'Full Day', reviews: 128, cat: 'City',      img: 'https://picsum.photos/seed/capetown88/800/500' },
  { id: 12, name: 'Stellenbosch Wine Tour',     loc: 'Stellenbosch',         price: 1250,  rating: 4.7, dur: 'Full Day', reviews: 96,  cat: 'Wine',      img: 'https://picsum.photos/seed/wine88/800/500' },
  { id: 13, name: 'Garden Route Tour',          loc: 'Knysna, Western Cape', price: 1950,  rating: 4.8, dur: '2 Days',   reviews: 112, cat: 'Adventure', img: 'https://picsum.photos/seed/garden88/800/500' },
  { id: 14, name: 'Helicopter Tour',            loc: 'Cape Town',            price: 4500,  rating: 4.9, dur: '1 Hour',   reviews: 89,  cat: 'Adventure', img: 'https://picsum.photos/seed/heli88/800/500' },
  { id: 15, name: 'Robben Island & History',    loc: 'Cape Town',            price: 680,   rating: 4.5, dur: 'Half Day', reviews: 204, cat: 'Cultural',  img: 'https://picsum.photos/seed/robben88/800/500' },
  { id: 16, name: 'Yacht Experience',           loc: 'V&A Waterfront',       price: 3200,  rating: 5.0, dur: 'Half Day', reviews: 67,  cat: 'Adventure', img: 'https://picsum.photos/seed/yacht88/800/500' },
  { id: 17, name: 'Franschhoek Wine Tram',      loc: 'Franschhoek',          price: 890,   rating: 4.6, dur: 'Full Day', reviews: 143, cat: 'Wine',      img: 'https://picsum.photos/seed/tram88/800/500' },
];

const BANNERS = [
  { img: 'https://picsum.photos/seed/tourbanner1/800/400', title: 'Explore South Africa 🌍',  sub: 'Epic landscapes, vibrant cities and unforgettable moments.', cta: 'Explore Tours',      tourId: 10, tourName: 'Sunset Safari Experience' },
  { img: 'https://picsum.photos/seed/tourbanner2/800/400', title: 'Safari Experiences',        sub: 'Witness the Big Five in their natural habitat.',              cta: 'Book Safari',        tourId: 10, tourName: 'Sunset Safari Experience' },
  { img: 'https://picsum.photos/seed/tourbanner3/800/400', title: 'Sky High Adventures',       sub: 'Cape Town from above — breathtaking views.',                  cta: 'View Details',       tourId: 14, tourName: 'Helicopter Tour'          },
  { img: 'https://picsum.photos/seed/tourbanner4/800/400', title: 'Wine Country Tours',        sub: 'World-class wineries, scenic routes.',                         cta: 'Explore Wine Tours', tourId: 12, tourName: 'Stellenbosch Wine Tour'   },
];

const featured = TOURS[0];

export default function ToursScreen() {
  const tc = useTC();
  const { user, wishlistIds, toggleWishlist } = useApp();
  const { gateVisible, closeGate, guard } = useLoginGate();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState('All');
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerRef = useRef<FlatList>(null);
  const scrollRef = useRef<ScrollView>(null);
  const listY = useRef(0);

  const filtered = useMemo(
    () => cat === 'All' ? TOURS : TOURS.filter(t => t.cat === cat),
    [cat],
  );

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIdx(prev => {
        const next = (prev + 1) % BANNERS.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <View style={s.logoRow}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={s.logoImg}
            contentFit="contain"
          />
          <TabHeaderIcons />
        </View>
        <View style={s.greetRow}>
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.75} style={s.greetInner}>
            <Text style={[s.greetTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Hi, {user?.name || 'Member'}</Text>
            <Feather name="chevron-right" size={12} color={tc.text3} />
          </TouchableOpacity>
        </View>
        <Text style={[s.pageTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Discover Tours</Text>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>

        {/* 1. Banner Slider — comes FIRST before chips */}
        <View style={s.bannerWrap}>
          <FlatList
            ref={bannerRef}
            data={BANNERS}
            horizontal pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <View style={[s.bannerSlide, { width: width - 32 }]}>
                <Image source={{ uri: item.img }} style={s.bannerImg} contentFit="cover" cachePolicy="memory-disk" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={s.bannerGrad} />
                <View style={s.bannerContent}>
                  <Text style={[s.bannerTitle, { fontFamily: 'Poppins_700Bold' }]}>{item.title}</Text>
                  <Text style={[s.bannerSub, { fontFamily: 'Inter_400Regular' }]}>{item.sub}</Text>
                  <TouchableOpacity style={s.bannerCta} onPress={() => router.push({ pathname: '/tour-detail', params: { id: String(item.tourId), name: item.tourName } })}>
                    <LinearGradient colors={tc.accentGradColors} style={s.bannerCtaGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
                      <Text style={[s.bannerCtaTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>{item.cta}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={s.bannerDots}>
            {BANNERS.map((_, i) => (
              <View key={i} style={[s.bannerDot, { backgroundColor: i === bannerIdx ? tc.accent : 'rgba(255,255,255,0.4)', width: i === bannerIdx ? 18 : 5 }]} />
            ))}
          </View>
        </View>

        {/* 2. Category Filter chips — AFTER banner */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={s.chipsScroll}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}
        >
          {CATS.map(c => {
            const active = cat === c.label;
            return (
              <TouchableOpacity
                key={c.label}
                style={[s.chip, { backgroundColor: active ? tc.accent : tc.card, borderColor: active ? tc.accent : tc.border }]}
                onPress={() => setCat(c.label)}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 22 }}>{c.emoji}</Text>
                <Text style={[s.chipTxt, { color: active ? (tc.isDark ? '#000' : '#fff') : tc.text2, fontFamily: active ? 'Poppins_600SemiBold' : 'Inter_400Regular' }]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 3. Featured Experience */}
        <View style={s.featSection}>
          <View style={s.secRow}>
            <Text style={[s.secTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Featured Experience</Text>
            <TouchableOpacity style={s.viewAllRow} onPress={() => {
              setCat('All');
              setTimeout(() => scrollRef.current?.scrollTo({ y: listY.current, animated: true }), 50);
            }}>
              <Text style={[s.viewAll, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>View all</Text>
              <Feather name="chevron-right" size={13} color={tc.accent} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={s.featCard}
            onPress={() => router.push({ pathname: '/tour-detail', params: { id: featured.id, name: featured.name } })}
            activeOpacity={0.88}
          >
            <Image source={{ uri: featured.img }} style={s.featImg} contentFit="cover" />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.92)']} style={StyleSheet.absoluteFillObject} />

            {/* Dots inside the featured card */}
            <View style={s.featDots}>
              {[0,1,2,3,4].map(i => (
                <View key={i} style={[s.featDot, { width: i === 0 ? 16 : 5, backgroundColor: i === 0 ? tc.chipActiveBg : 'rgba(255,255,255,0.4)' }]} />
              ))}
            </View>

            {/* Heart button */}
            <TouchableOpacity
              style={[s.featHeart, { backgroundColor: wishlistIds.includes(featured.id) ? `${GOLD}cc` : 'rgba(0,0,0,0.45)' }]}
              onPress={() => guard(() => toggleWishlist(featured.id))}
              activeOpacity={0.8}
            >
              <Feather name="heart" size={15} color={wishlistIds.includes(featured.id) ? '#000' : '#fff'} />
            </TouchableOpacity>

            {/* Content overlay */}
            <View style={s.featContent}>
              <Text style={[s.featTitle, { fontFamily: 'Poppins_700Bold' }]}>{featured.name}</Text>
              <View style={s.featMeta}>
                <Feather name="map-pin" size={10} color="rgba(255,255,255,0.7)" />
                <Text style={[s.featLoc, { fontFamily: 'Inter_400Regular' }]}>{featured.loc}</Text>
              </View>
              <View style={s.featBottom}>
                <Text style={[s.featPrice, { fontFamily: 'Poppins_700Bold' }]}>From R{featured.price.toLocaleString()} pp</Text>
                <TouchableOpacity
                  style={[s.featBtn, { backgroundColor: tc.accent }]}
                  onPress={() => router.push({ pathname: '/tour-detail', params: { id: featured.id, name: featured.name } })}
                  activeOpacity={0.85}
                >
                  <Text style={[s.featBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>View Details →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. Tour List — horizontal compact cards (96×96 image left, text+button right) */}
        <View style={s.listSection} onLayout={e => { listY.current = e.nativeEvent.layout.y; }}>
          <View style={s.listHeader}>
            <Text style={[s.listTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
              {cat === 'All' ? 'All Tours' : `${cat} Tours`}
            </Text>
            <View style={[s.resultsBadge, { backgroundColor: `${tc.accent}15` }]}>
              <Text style={[s.resultsTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>{filtered.length} tours</Text>
            </View>
          </View>

          <View style={s.tourList}>
            {filtered.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[s.tourCard, { backgroundColor: tc.card, borderColor: tc.border }]}
                onPress={() => router.push({ pathname: '/tour-detail', params: { id: t.id, name: t.name } })}
                activeOpacity={0.88}
              >
                {/* 96×96 image on the left */}
                <Image source={{ uri: t.img }} style={s.tourImg} contentFit="cover" />

                {/* Content middle */}
                <View style={s.tourBody}>
                  <Text style={[s.tourName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]} numberOfLines={2}>{t.name}</Text>
                  <View style={s.tourMeta}>
                    <Feather name="map-pin" size={10} color={tc.text2} />
                    <Text style={[s.tourLoc, { color: tc.text2, fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>{t.loc}</Text>
                  </View>
                  <View style={s.tourRating}>
                    <Feather name="star" size={10} color={GOLD} />
                    <Text style={[s.tourRatingTxt, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>{t.rating}</Text>
                    <Text style={[s.tourReviewsTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>({t.reviews}) · {t.dur}</Text>
                  </View>
                  <Text style={[s.tourPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>
                    From R{t.price.toLocaleString()} pp
                  </Text>
                </View>

                {/* Action buttons — right column */}
                <View style={s.tourActions}>
                  <TouchableOpacity
                    style={[s.tourBookBtn, { backgroundColor: tc.accent }]}
                    onPress={() => router.push({ pathname: '/tour-detail', params: { id: t.id, name: t.name } })}
                    activeOpacity={0.85}
                  >
                    <Text style={[s.tourBookBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Book Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.tourSaveBtn, { borderColor: wishlistIds.includes(t.id) ? tc.accent : tc.border, backgroundColor: wishlistIds.includes(t.id) ? `${tc.accent}18` : 'transparent' }]}
                    onPress={() => guard(() => toggleWishlist(t.id))}
                    activeOpacity={0.8}
                  >
                    <Feather name="heart" size={13} color={wishlistIds.includes(t.id) ? tc.accent : tc.text3} />
                    <Text style={[s.tourSaveBtnTxt, { color: wishlistIds.includes(t.id) ? tc.accent : tc.text3, fontFamily: 'Poppins_600SemiBold' }]}>
                      {wishlistIds.includes(t.id) ? 'Saved' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.tourViewBtn, { borderColor: tc.border }]}
                    onPress={() => router.push({ pathname: '/tour-detail', params: { id: t.id, name: t.name } })}
                    activeOpacity={0.85}
                  >
                    <Text style={[s.tourViewBtnTxt, { color: tc.text2, fontFamily: 'Poppins_600SemiBold' }]}>Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  greetRow: { paddingHorizontal: 16, paddingBottom: 2 },
  greetInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  greetTxt: { fontSize: 13 },
  pageTitle: { fontSize: 26, paddingHorizontal: 16, paddingBottom: 8 },
  bellBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' },

  // Banner: comes before chips
  bannerWrap: { paddingHorizontal: 16, paddingTop: 16, marginBottom: 16 },
  bannerSlide: { height: 200, borderRadius: 18, overflow: 'hidden' },
  bannerImg: { width: '100%', height: 200 },
  bannerGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  bannerContent: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  bannerTitle: { fontSize: 18, color: '#fff', marginBottom: 4 },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 10 },
  bannerCta: { alignSelf: 'flex-start', borderRadius: 10, overflow: 'hidden' },
  bannerCtaGrad: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10 },
  bannerCtaTxt: { fontSize: 12 },
  bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 10 },
  bannerDot: { height: 5, borderRadius: 3 },

  // Chips: comes AFTER banner
  chipsScroll: { paddingBottom: 8, marginBottom: 20 },
  chip: { width: 80, height: 80, borderRadius: 18, borderWidth: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 },
  chipTxt: { fontSize: 11, textAlign: 'center' },

  // Featured
  featSection: { paddingHorizontal: 16, marginBottom: 20 },
  secRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  secTitle: { fontSize: 16 },
  viewAllRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAll: { fontSize: 12 },

  featCard: { height: 180, borderRadius: 18, overflow: 'hidden' },
  featImg: { width: '100%', height: 180 },
  featDots: { position: 'absolute', bottom: 60, left: 16, flexDirection: 'row', gap: 4 },
  featDot: { height: 5, borderRadius: 3 },
  featHeart: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  featContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  featTitle: { fontSize: 18, color: '#fff', lineHeight: 24, marginBottom: 4 },
  featMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  featLoc: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  featBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featPrice: { fontSize: 14, color: '#fff' },
  featBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12 },
  featBtnTxt: { fontSize: 11 },

  // Tour list
  listSection: { paddingHorizontal: 16 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listTitle: { fontSize: 16 },
  resultsBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  resultsTxt: { fontSize: 11 },

  tourList: { gap: 10 },
  tourCard: { flexDirection: 'row', borderRadius: 18, overflow: 'hidden', borderWidth: 1, alignItems: 'center' },
  tourImg: { width: 96, height: 96, flexShrink: 0, alignSelf: 'stretch' },
  tourBody: { flex: 1, paddingVertical: 10, paddingLeft: 10, gap: 3 },
  tourName: { fontSize: 13, lineHeight: 18 },
  tourMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tourLoc: { fontSize: 11, flex: 1 },
  tourRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tourRatingTxt: { fontSize: 10 },
  tourReviewsTxt: { fontSize: 10 },
  tourPrice: { fontSize: 12 },
  tourActions: { flexDirection: 'column', gap: 6, paddingVertical: 12, paddingRight: 12, paddingLeft: 8, justifyContent: 'center', flexShrink: 0 },
  tourBookBtn: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, alignItems: 'center' },
  tourBookBtnTxt: { fontSize: 9 },
  tourSaveBtn: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  tourSaveBtnTxt: { fontSize: 9 },
  tourViewBtn: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  tourViewBtnTxt: { fontSize: 9 },
});
