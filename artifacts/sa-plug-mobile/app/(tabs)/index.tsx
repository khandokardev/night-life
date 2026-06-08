import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { useNotifications } from '@/context/NotificationsContext';
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

const { width } = Dimensions.get('window');
const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const BANNERS = [
  { id: 1, img: 'https://picsum.photos/seed/saHero1/800/500', title: 'Plan Your Perfect Night ✦', subtitle: 'Clubs, tours, dining and more — all in one place.', cta: 'Explore Now', route: '/(tabs)/clubs' },
  { id: 2, img: 'https://picsum.photos/seed/tour-ct/800/500',  title: 'Curated Experiences',       subtitle: 'Handpicked moments. Made for you.',            cta: "See What's New", route: '/(tabs)/tours' },
  { id: 3, img: 'https://picsum.photos/seed/tour-wine/800/500',title: 'Discover Exceptional Dining', subtitle: 'Premium restaurants across South Africa.',  cta: 'Reserve Table', route: '/(tabs)/dining' },
  { id: 4, img: 'https://picsum.photos/seed/onyxclub/800/500', title: 'VIP Nightlife Access',      subtitle: 'Skip the queue. Own the night.',             cta: 'Book Now', route: '/(tabs)/clubs' },
];


const EVENTS = [
  { id: 1, date: '24', month: 'MAY', name: 'Neon Nights',    venue: 'ONYX Sandton',    live: true  },
  { id: 2, date: '25', month: 'MAY', name: 'Sunset Beats',   venue: 'Zone 6 Venue',   live: true  },
  { id: 3, date: '31', month: 'MAY', name: 'Friday Lights',  venue: 'Coco Sandton',   live: true  },
  { id: 4, date: '01', month: 'JUN', name: 'The Society',    venue: 'TBA',             live: false },
];

const TOURS = [
  { id: 1, name: 'Safari Escape',  price: 'R1,250', img: 'https://picsum.photos/seed/safari10/800/500' },
  { id: 2, name: 'Cape Explorer',  price: 'R850',   img: 'https://picsum.photos/seed/capetown10/800/500' },
  { id: 3, name: 'Wine Route',     price: 'R950',   img: 'https://picsum.photos/seed/wine10/800/500' },
  { id: 4, name: 'Helicopter',     price: 'R4,500', img: 'https://picsum.photos/seed/helicopter10/800/500' },
];

const NIGHTS = [
  { id: 1, name: 'DJ Horizon',  venue: 'ONYX Sandton',  price: 'R150', img: 'https://picsum.photos/seed/dj1/800/500',  tag: 'LIVE' },
  { id: 2, name: 'Urban Glow',  venue: 'Zone 6 Venue',  price: 'R120', img: 'https://picsum.photos/seed/club2/800/500', tag: 'LIVE' },
  { id: 3, name: 'After Dark',  venue: 'Coco Sandton',  price: 'R100', img: 'https://picsum.photos/seed/club3/800/500', tag: 'LIVE' },
  { id: 4, name: 'Luxe Friday', venue: 'Rosebank',      price: 'R200', img: 'https://picsum.photos/seed/vip4/800/500',  tag: 'VIP'  },
];

const EXCLUSIVES = [
  { id: 1, name: 'VIP Bottle Service', sub: 'Skip the line.',  price: 'R2,500+', img: 'https://picsum.photos/seed/vipbtl/800/500' },
  { id: 2, name: 'Private Safari',     sub: 'Luxury. Wildlife.', price: 'R2,800',  img: 'https://picsum.photos/seed/privsafari/800/500' },
  { id: 3, name: "Chef's Table",       sub: 'Fine dining.',     price: 'R1,450',  img: 'https://picsum.photos/seed/cheftable/800/500' },
];

const LOCAL_FAVS = [
  { label: 'Hidden Bars',   route: '/(tabs)/clubs',  emoji: '🎵' },
  { label: 'Rooftop Views', route: '/(tabs)/dining', emoji: '🌆' },
  { label: 'Fine Dining',   route: '/(tabs)/dining', emoji: '🍽️' },
  { label: 'Shopping',      route: '/(tabs)/shop',   emoji: '🛍️' },
  { label: 'Day Tours',     route: '/(tabs)/tours',  emoji: '🌍' },
];

const TRENDING = ['#Rooftop', '#Amapiano', '#WeekendPlan', '#VIP', '#WineTour', '#SafariLife', '#JoziFridays', '#CapeTown', '#Soweto'];

export default function HomeScreen() {
  const tc = useTC();
  const { cartCount, user } = useApp();
  const { unreadCount } = useNotifications();
  const insets = useSafeAreaInsets();
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerRef = useRef<FlatList>(null);

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
      {/* Sticky Header */}
      <View style={[s.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        {/* Row 1: Logo */}
        <View style={s.logoRow}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={s.logoImg}
            contentFit="contain"
          />
          <View style={s.headerIcons}>
            <TouchableOpacity style={[s.hBtn, { backgroundColor: tc.card }]} onPress={() => router.push('/search')}>
              <Feather name="search" size={17} color={tc.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[s.hBtn, { backgroundColor: tc.card }]} onPress={() => router.push('/notifications')} activeOpacity={0.8}>
              <Feather name="bell" size={17} color={tc.text} />
              {unreadCount > 0 && (
                <View style={[s.badge, { backgroundColor: '#EF4444' }]}>
                  <Text style={[s.badgeTxt, { color: '#fff' }]}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[s.hBtn, { backgroundColor: tc.card }]} onPress={() => router.push('/cart')}>
              <Feather name="shopping-cart" size={19} color={tc.text} />
              {cartCount > 0 && (
                <View style={[s.badge, { backgroundColor: tc.accent }]}>
                  <Text style={[s.badgeTxt, { color: tc.isDark ? '#000' : '#fff' }]}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.avatar, { backgroundColor: `${tc.accent}20`, borderColor: tc.accent }]}
              onPress={() => router.push('/profile')}
            >
              <Feather name="user" size={16} color={tc.accent} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Row 2: Greeting */}
        <View style={s.greetRow}>
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.75} style={s.greetInner}>
            <Text style={[s.greetTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Hi, {user?.name || 'Member'}</Text>
            <Feather name="chevron-right" size={12} color={tc.text3} />
          </TouchableOpacity>
        </View>
        {/* Row 3: Title */}
        <Text style={[s.pageTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Discover</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}>

        {/* Hero Slider */}
        <View style={s.heroWrap}>
          <FlatList
            ref={bannerRef}
            data={BANNERS}
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={b => String(b.id)}
            onMomentumScrollEnd={e => setBannerIdx(Math.round(e.nativeEvent.contentOffset.x / (width - 32)))}
            renderItem={({ item }) => (
              <View style={[s.heroSlide, { width: width - 32 }]}>
                <Image source={{ uri: item.img }} style={s.heroImg} contentFit="cover" cachePolicy="memory-disk" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.96)']} style={s.heroGrad} />
                <View style={s.heroContent}>
                  <Text style={[s.heroTitle, { fontFamily: 'Poppins_700Bold' }]}>{item.title}</Text>
                  <Text style={[s.heroSub, { fontFamily: 'Inter_400Regular' }]}>{item.subtitle}</Text>
                  <TouchableOpacity
                    style={s.heroCta}
                    onPress={() => router.push(item.route as any)}
                    activeOpacity={0.85}
                  >
                    <LinearGradient colors={tc.accentGradColors} style={s.heroCtaGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
                      <Text style={[s.heroCtaTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>{item.cta}</Text>
                      <Feather name="arrow-right" size={13} color={tc.isDark ? '#000' : '#fff'} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={s.heroDots}>
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[s.dot, { backgroundColor: i === bannerIdx ? tc.accent : 'rgba(255,255,255,0.4)', width: i === bannerIdx ? 20 : 6 }]}
              />
            ))}
          </View>
        </View>


        {/* Upcoming Events */}
        <SectionHeader title="Upcoming Events" onPress={() => router.push('/events')} tc={tc} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}
        >
          {EVENTS.map(ev => (
            <TouchableOpacity
              key={ev.id}
              style={[s.evCard, { backgroundColor: tc.isDark ? '#0D0D0D' : '#1a1a2e', borderColor: tc.border }]}
              onPress={() => router.push({ pathname: '/club-detail', params: { id: String(ev.id), name: ev.venue } })}
              activeOpacity={0.85}
            >
              <View style={s.evTop}>
                <View>
                  <Text style={[s.evMon, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>{ev.month}</Text>
                  <Text style={[s.evDate, { fontFamily: 'Poppins_900Black' }]}>{ev.date}</Text>
                </View>
                <View style={[s.evBadge, {
                  backgroundColor: ev.live ? 'rgba(239,68,68,0.2)' : `${GOLD}22`,
                  borderColor: ev.live ? 'rgba(239,68,68,0.4)' : `${GOLD}44`,
                }]}>
                  <Text style={[s.evBadgeTxt, { color: ev.live ? '#f87171' : GOLD, fontFamily: 'Poppins_700Bold' }]}>
                    {ev.live ? 'LIVE' : 'VIP'}
                  </Text>
                </View>
              </View>
              <Text style={[s.evName, { fontFamily: 'Poppins_700Bold' }]}>{ev.name}</Text>
              <View style={s.evVenueRow}>
                <Feather name="map-pin" size={9} color="#B3B3B3" />
                <Text style={s.evVenue}>{ev.venue}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Book Tours */}
        <SectionHeader title="Book Tours" onPress={() => router.push('/(tabs)/tours')} tc={tc} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}
        >
          {TOURS.map(t => (
            <TouchableOpacity
              key={t.id}
              style={s.tourCard}
              onPress={() => router.push({ pathname: '/tour-detail', params: { id: String(t.id), name: t.name } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: t.img }} style={s.tourImg} contentFit="cover" cachePolicy="memory-disk" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.92)']} style={s.cardGrad} />
              <View style={s.tourInfo}>
                <Text style={[s.tourName, { fontFamily: 'Poppins_700Bold' }]}>{t.name}</Text>
                <Text style={[s.tourPrice, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>From {t.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nightlife Picks */}
        <SectionHeader title="Nightlife Picks" onPress={() => router.push('/(tabs)/clubs')} tc={tc} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}
        >
          {NIGHTS.map(n => (
            <TouchableOpacity
              key={n.id}
              style={s.nightCard}
              onPress={() => router.push({ pathname: '/club-detail', params: { id: String(n.id), name: n.venue } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: n.img }} style={s.nightImg} contentFit="cover" cachePolicy="memory-disk" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.93)']} style={s.cardGrad} />
              <View style={[s.nightBadge, {
                backgroundColor: n.tag === 'LIVE' ? 'rgba(239,68,68,0.9)' : GOLD,
              }]}>
                <Text style={[s.nightBadgeTxt, { color: n.tag === 'LIVE' ? '#fff' : '#000', fontFamily: 'Poppins_700Bold' }]}>{n.tag}</Text>
              </View>
              <View style={s.nightInfo}>
                <Text style={[s.nightName, { fontFamily: 'Poppins_700Bold' }]}>{n.name}</Text>
                <Text style={s.nightVenue}>{n.venue}</Text>
                <Text style={[s.nightPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>From {n.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exclusive Experiences */}
        <SectionHeader title="Exclusive Experiences" onPress={() => router.push('/(tabs)/tours')} tc={tc} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}
        >
          {EXCLUSIVES.map(ex => (
            <TouchableOpacity
              key={ex.id}
              style={[s.exCard, { backgroundColor: tc.card, borderColor: tc.border }]}
              onPress={() => router.push({ pathname: '/tour-detail', params: { id: String(ex.id), name: ex.name } })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: ex.img }} style={[s.exImg, { opacity: 0.6 }]} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={s.cardGrad} />
              <View style={s.exInfo}>
                <Text style={[s.exName, { fontFamily: 'Poppins_700Bold' }]}>{ex.name}</Text>
                <Text style={s.exSub}>{ex.sub}</Text>
                <Text style={[s.exPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>{ex.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Local Favorites */}
        <SectionHeader title="Local Favorites" onPress={() => router.push('/(tabs)/clubs')} tc={tc} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 24 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}
        >
          {LOCAL_FAVS.map((fav, i) => (
            <TouchableOpacity
              key={i}
              style={[s.favBtn, { backgroundColor: tc.card, borderColor: tc.border }]}
              onPress={() => router.push(fav.route as any)}
              activeOpacity={0.8}
            >
              <Text style={s.favEmoji}>{fav.emoji}</Text>
              <Text style={[s.favLabel, { color: tc.text2, fontFamily: 'Inter_500Medium' }]}>{fav.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Tags */}
        <View style={s.trendSection}>
          <Text style={[s.trendTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Trending</Text>
          <View style={s.trendWrap}>
            {TRENDING.map((tag, i) => (
              <TouchableOpacity
                key={i}
                style={[s.trendTag, {
                  backgroundColor: i % 3 === 0 ? tc.accent : tc.inputBg,
                  borderColor: i % 3 === 0 ? tc.accent : tc.border,
                }]}
                onPress={() => router.push('/search')}
                activeOpacity={0.8}
              >
                <Text style={[s.trendTagTxt, {
                  color: i % 3 === 0 ? (tc.isDark ? '#000' : '#fff') : tc.text2,
                  fontFamily: 'Poppins_700Bold',
                }]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add to Calendar */}
        <View style={s.calSection}>
          <View style={[s.calCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <View style={[s.calIcon, { backgroundColor: `${tc.accent}15` }]}>
              <Feather name="calendar" size={22} color={tc.accent} />
            </View>
            <View style={s.calText}>
              <Text style={[s.calTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Upcoming: {EVENTS[0].name}</Text>
              <Text style={[s.calSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Tonight · {EVENTS[0].venue} · 10PM</Text>
            </View>
            <TouchableOpacity
              style={[s.calBtn, { backgroundColor: tc.accent }]}
              onPress={() => router.push({ pathname: '/club-detail', params: { id: String(EVENTS[0].id), name: EVENTS[0].venue } })}
            >
              <Text style={[s.calBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, onPress, tc }: { title: string; onPress: () => void; tc: ReturnType<typeof useTC> }) {
  return (
    <View style={s.secHeader}>
      <Text style={[s.secTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{title}</Text>
      <TouchableOpacity onPress={onPress} style={s.secAll}>
        <Text style={[s.secAllTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>View all</Text>
        <Feather name="chevron-right" size={12} color={tc.accent} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  header: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 4 },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  logoImg: { width: 60, height: 50 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { fontSize: 9, fontWeight: '800' },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },

  greetRow: { paddingHorizontal: 16, paddingBottom: 2 },
  greetInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  greetTxt: { fontSize: 13 },
  pageTitle: { fontSize: 26, paddingHorizontal: 16, paddingBottom: 8 },
  bellBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },

  heroWrap: { paddingHorizontal: 16, marginBottom: 20, position: 'relative' },
  heroSlide: { height: 210, borderRadius: 20, overflow: 'hidden' },
  heroImg: { width: '100%', height: 210 },
  heroGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 },
  heroContent: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  heroTitle: { fontSize: 18, color: '#fff', lineHeight: 26, marginBottom: 4 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 12 },
  heroCta: { alignSelf: 'flex-start', borderRadius: 10, overflow: 'hidden' },
  heroCtaGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10 },
  heroCtaTxt: { fontSize: 12 },
  heroDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { height: 6, borderRadius: 3 },

  catPill: { width: 80, height: 80, borderRadius: 18, borderWidth: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 },
  catLabel: { fontSize: 11, textAlign: 'center' },

  secHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  secTitle: { fontSize: 16 },
  secAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  secAllTxt: { fontSize: 12 },

  evCard: { width: 140, borderRadius: 16, padding: 12, borderWidth: 1, flexShrink: 0 },
  evTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  evMon: { fontSize: 10, letterSpacing: 1 },
  evDate: { fontSize: 26, color: '#fff', lineHeight: 30 },
  evBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  evBadgeTxt: { fontSize: 8, letterSpacing: 0.5 },
  evName: { fontSize: 12, color: '#fff', lineHeight: 16, marginBottom: 6 },
  evVenueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  evVenue: { fontSize: 10, color: '#B3B3B3', fontFamily: 'Inter_400Regular' },

  tourCard: { width: 150, height: 112, borderRadius: 16, overflow: 'hidden', flexShrink: 0 },
  tourImg: { width: 150, height: 112 },
  tourInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 },
  tourName: { fontSize: 11, color: '#fff', lineHeight: 15, marginBottom: 2 },
  tourPrice: { fontSize: 10 },

  nightCard: { width: 120, height: 120, borderRadius: 16, overflow: 'hidden', flexShrink: 0 },
  nightImg: { width: 120, height: 120 },
  nightBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  nightBadgeTxt: { fontSize: 8 },
  nightInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8 },
  nightName: { fontSize: 11, color: '#fff', lineHeight: 14, marginBottom: 1 },
  nightVenue: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular', marginBottom: 2 },
  nightPrice: { fontSize: 9 },

  exCard: { width: 160, height: 110, borderRadius: 16, overflow: 'hidden', flexShrink: 0, borderWidth: 1 },
  exImg: { width: 160, height: 110 },
  exInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10 },
  exName: { fontSize: 11, color: '#fff', marginBottom: 2 },
  exSub: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular', marginBottom: 3 },
  exPrice: { fontSize: 10 },

  cardGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 },

  favBtn: { width: 92, height: 98, borderRadius: 18, borderWidth: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 },
  favEmoji: { fontSize: 36 },
  favLabel: { fontSize: 11, textAlign: 'center' },

  trendSection: { paddingHorizontal: 16, marginBottom: 24 },
  trendTitle: { fontSize: 16, marginBottom: 12 },
  trendWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trendTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  trendTagTxt: { fontSize: 12 },

  calSection: { paddingHorizontal: 16, marginBottom: 8 },
  calCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  calIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  calText: { flex: 1, minWidth: 0 },
  calTitle: { fontSize: 13, marginBottom: 2 },
  calSub: { fontSize: 11 },
  calBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexShrink: 0 },
  calBtnTxt: { fontSize: 12, color: '#fff' },
});
