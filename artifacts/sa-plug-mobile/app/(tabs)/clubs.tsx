import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
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

const FILTERS = ['All', 'VIP', 'Rooftop', 'Amapiano', 'Afrobeats', 'EDM', 'Hip Hop'];

const CLUBS = [
  { id: 1, img: 'https://picsum.photos/seed/onyx88/800/500', name: 'Onyx Sandton',    rating: '4.8', reviews: '1.2k', area: 'Sandton',  genres: ['Amapiano', 'Hip Hop', 'Afrobeats'], tags: ['VIP'] },
  { id: 2, img: 'https://picsum.photos/seed/coco88/800/500', name: 'Coco Sandton',    rating: '4.7', reviews: '980',  area: 'Sandton',  genres: ['Afrobeats', 'Hip Hop', 'R&B'],      tags: [] },
  { id: 3, img: 'https://picsum.photos/seed/zone88/800/500', name: 'Zone 6 Venue',    rating: '4.6', reviews: '870',  area: 'Soweto',   genres: ['Amapiano', 'Gqom', 'Hip Hop'],      tags: [] },
  { id: 4, img: 'https://picsum.photos/seed/kong88/800/500', name: 'Kong Rosebank',   rating: '4.5', reviews: '760',  area: 'Rosebank', genres: ['Hip Hop', 'Afrobeats', 'R&B'],      tags: ['Rooftop'] },
  { id: 5, img: 'https://picsum.photos/seed/icon88/800/500', name: 'ICON Soweto',     rating: '4.4', reviews: '640',  area: 'Soweto',   genres: ['Amapiano', 'Afrobeats'],             tags: ['VIP'] },
  { id: 6, img: 'https://picsum.photos/seed/stat88/800/500', name: 'Status Nightclub',rating: '4.3', reviews: '520',  area: 'Sandton',  genres: ['EDM', 'Hip Hop'],                    tags: ['EDM', 'Rooftop'] },
];

const BANNERS = [
  { img: 'https://picsum.photos/seed/clubbn1/800/400', title: 'Tonight Belongs To You', sub: 'The city. The music. The energy.',     cta: 'Explore Top Clubs', clubId: 1, clubName: 'Onyx Sandton',  tab: 'Overview' },
  { img: 'https://picsum.photos/seed/clubbn2/800/400', title: 'Amapiano All Night 🎵',  sub: 'Live DJs. Premium sound. VIP access.', cta: 'Book a Table',      clubId: 1, clubName: 'Onyx Sandton',  tab: 'Booking'  },
  { img: 'https://picsum.photos/seed/clubbn3/800/400', title: 'VIP Bottle Service',     sub: 'Skip the queue. Own the night.',      cta: 'Reserve Now',       clubId: 2, clubName: 'Kong Rosebank', tab: 'Booking'  },
];

const TRENDING = [
  { img: 'https://picsum.photos/seed/trend1/300/200', name: 'Amapiano Nights',       views: '12.4K views', clubId: 1, clubName: 'Onyx Sandton'    },
  { img: 'https://picsum.photos/seed/trend2/300/200', name: 'Luxe Fridays Rosebank', views: '9.8K views',  clubId: 4, clubName: 'Kong Rosebank'   },
  { img: 'https://picsum.photos/seed/trend3/300/200', name: 'After Dark Saturdays',  views: '8.3K views',  clubId: 2, clubName: 'Coco Sandton'    },
  { img: 'https://picsum.photos/seed/trend4/300/200', name: 'Rooftop Takeovers',     views: '7.1K views',  clubId: 6, clubName: 'Status Nightclub' },
];

const GENRE_COLORS: Record<string, { bg: string; color: string }> = {
  'Amapiano': { bg: 'rgba(212,175,55,0.14)',  color: '#D4AF37' },
  'Hip Hop':  { bg: 'rgba(255,255,255,0.08)', color: '#aaa' },
  'Afrobeats':{ bg: 'rgba(220,100,50,0.16)',  color: '#E08060' },
  'R&B':      { bg: 'rgba(160,100,220,0.16)', color: '#B070E0' },
  'Gqom':     { bg: 'rgba(50,160,220,0.16)',  color: '#50A0DC' },
  'EDM':      { bg: 'rgba(50,220,150,0.14)',  color: '#40C090' },
};

function filteredClubs(f: string) {
  if (f === 'All') return CLUBS;
  return CLUBS.filter(c => c.genres.includes(f) || c.tags.includes(f));
}

function getGenreStyle(g: string, isDark: boolean): { bg: string; color: string } {
  const MAP: Record<string, [string, string, string, string]> = {
    'Amapiano': ['rgba(212,175,55,0.14)', 'rgba(212,175,55,0.13)', '#D4AF37', '#8A6D00'],
    'Hip Hop':  ['rgba(255,255,255,0.08)', 'rgba(0,0,0,0.07)',    '#aaa',    '#555'   ],
    'Afrobeats':['rgba(220,100,50,0.16)',  'rgba(220,100,50,0.13)','#E08060', '#B04820'],
    'R&B':      ['rgba(160,100,220,0.16)', 'rgba(160,100,220,0.13)','#B070E0','#7040B0'],
    'Gqom':     ['rgba(50,160,220,0.16)',  'rgba(50,160,220,0.13)', '#50A0DC','#2070B0'],
    'EDM':      ['rgba(50,220,150,0.14)',  'rgba(50,220,150,0.12)', '#40C090','#158060'],
  };
  const e = MAP[g];
  if (!e) return { bg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', color: isDark ? '#aaa' : '#555' };
  return { bg: isDark ? e[0] : e[1], color: isDark ? e[2] : e[3] };
}

export default function ClubsScreen() {
  const tc = useTC();
  const { cartCount, user } = useApp();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerRef = useRef<FlatList>(null);
  const scrollRef = useRef<ScrollView>(null);
  const listY = useRef(0);

  const clubs = useMemo(() => filteredClubs(filter), [filter]);
  const featuredVipClub = useMemo(() => CLUBS.find(c => c.tags.includes('VIP')) ?? CLUBS[0], []);
  const handleFilterPress = useCallback((f: string) => {
    setFilter(f);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIdx(prev => {
        const next = (prev + 1) % BANNERS.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const renderBannerSlider = () => (
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
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={s.bannerGrad}
            />
            <View style={s.bannerContent}>
              <Text style={[s.bannerTitle, { fontFamily: 'Poppins_700Bold' }]}>{item.title}</Text>
              <Text style={[s.bannerSub, { fontFamily: 'Inter_400Regular' }]}>{item.sub}</Text>
              <TouchableOpacity
                style={s.bannerCta}
                onPress={() => router.push({ pathname: '/club-detail', params: { id: String(item.clubId), name: item.clubName, tab: item.tab } })}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={tc.accentGradColors}
                  style={s.bannerCtaGrad}
                  start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}
                >
                  <Text style={[s.bannerCtaTxt, { color: '#000', fontFamily: 'Poppins_700Bold' }]}>{item.cta}</Text>
                  <Feather name="chevron-right" size={12} color="#000" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={s.bannerDots}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[s.bannerDot, {
              backgroundColor: i === bannerIdx ? tc.accent : 'rgba(255,255,255,0.35)',
              width: i === bannerIdx ? 18 : 5,
            }]}
          />
        ))}
      </View>
    </View>
  );

  const renderHandpickedSection = () => (
    <View style={s.section}>
      <View style={s.secRow}>
        <Text style={[s.secTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Handpicked Clubs</Text>
        <TouchableOpacity
          style={s.viewAllRow}
          onPress={() => {
            setFilter('All');
            setTimeout(() => scrollRef.current?.scrollTo({ y: listY.current, animated: true }), 50);
          }}
        >
          <Text style={[s.viewAll, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>View all</Text>
          <Feather name="chevron-right" size={12} color={tc.accent} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14, paddingTop: 12 }}
      >
        {CLUBS.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={s.thumbWrap}
            onPress={() => router.push({ pathname: '/club-detail', params: { id: String(c.id), name: c.name } })}
            activeOpacity={0.85}
          >
            <View style={s.thumbImg}>
              <Image source={{ uri: c.img }} style={{ width: 88, height: 88 }} contentFit="cover" cachePolicy="memory-disk" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFillObject} />
              {c.tags.includes('VIP') && (
                <View style={[s.thumbVip, { backgroundColor: tc.accent }]}>
                  <Text style={[s.thumbVipTxt, { fontFamily: 'Poppins_700Bold', color: tc.isDark ? '#000' : '#fff' }]}>VIP</Text>
                </View>
              )}
            </View>
            <Text style={[s.thumbName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={1}>{c.name}</Text>
            <Text style={[s.thumbArea, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{c.area}</Text>
            <View style={s.thumbRating}>
              <Feather name="star" size={9} color={tc.accent} />
              <Text style={[s.thumbRatingTxt, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>{c.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderBottleServiceBanner = () => (
    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
      <View style={[s.bottleCard, { backgroundColor: '#080600' }]}>
        {/* Champagne bottle image — full-width background, anchor bottle to the right */}
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=500&fit=crop&q=80' }}
          style={s.bottleImg}
          contentFit="cover"
          contentPosition="right center"
        />
        {/* Full-width dark overlay: left dark enough for text, right lets bottle breathe */}
        <LinearGradient
          colors={['rgba(6,4,0,0.72)', 'rgba(6,4,0,0.58)', 'rgba(6,4,0,0.28)', 'rgba(6,4,0,0.08)']}
          locations={[0, 0.40, 0.70, 1]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.bottleOverlay}
        />
        {/* Crown badge — top right */}
        <View style={[s.bottleCrown, { backgroundColor: `${tc.accent}25`, borderColor: `${tc.accent}60` }]}>
          <Feather name="award" size={14} color={tc.accent} />
        </View>
        {/* Content — left side */}
        <View style={s.bottleContent}>
          <Text style={[s.bottleTitle, { color: '#fff', fontFamily: 'Poppins_700Bold' }]}>Premium Bottle Service</Text>
          <Text style={[s.bottleSub, { color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' }]}>Skip the line. Own the night.</Text>
          {['VIP Table Booking', 'Premium Bottles', 'Dedicated Host'].map(f => (
            <View key={f} style={s.checkRow}>
              <Feather name="check" size={13} color={tc.accent} />
              <Text style={[s.checkTxt, { color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter_400Regular' }]}>{f}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={[s.bottleBtn, { borderColor: tc.accent, backgroundColor: tc.accent }]}
            onPress={() => router.push({ pathname: '/club-detail', params: { id: String(featuredVipClub.id), name: featuredVipClub.name, tab: 'Booking' } })}
            activeOpacity={0.85}
          >
            <Text style={[s.bottleBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Book VIP Experience</Text>
            <Feather name="chevron-right" size={14} color={tc.isDark ? '#000' : '#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTrendingSection = () => (
    <View style={s.section}>
      <View style={s.secRow}>
        <Text style={[s.secTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Trending Now</Text>
        <TouchableOpacity style={s.viewAllRow} onPress={() => router.push('/trending')}>
          <Text style={[s.viewAll, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>View all</Text>
          <Feather name="chevron-right" size={12} color={tc.accent} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingTop: 12 }}
      >
        {TRENDING.map((t, i) => (
          <TouchableOpacity
            key={i}
            style={s.trendCard}
            onPress={() => router.push({ pathname: '/club-detail', params: { id: String(t.clubId), name: t.clubName } })}
            activeOpacity={0.85}
          >
            <View style={s.trendImgWrap}>
              <Image source={{ uri: t.img }} style={{ width: 128, height: 88 }} contentFit="cover" />
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.75)']}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={s.trendPlayBtn}>
                <Feather name="play" size={12} color="#fff" />
              </View>
            </View>
            <Text style={[s.trendName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={1}>{t.name}</Text>
            <Text style={[s.trendViews, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{t.views}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        {/* Row 1: Logo */}
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
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.75} style={s.greetInner}>
            <Text style={[s.greetTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Hi, {user?.name || 'Member'}</Text>
            <Feather name="chevron-right" size={12} color={tc.text3} />
          </TouchableOpacity>
        </View>
        {/* Row 3: Title */}
        <Text style={[s.pageTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Discover Clubs</Text>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>

        {/* Banner Slider */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, marginBottom: 14 }}>
          {renderBannerSlider()}
        </View>

        {/* Genre filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 4 }}
          style={{ marginBottom: 20 }}
        >
          {FILTERS.map(f => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[s.filterChip, {
                  backgroundColor: active ? tc.accent : tc.card,
                  borderColor: active ? tc.accent : tc.border,
                }]}
                onPress={() => handleFilterPress(f)}
                activeOpacity={0.8}
              >
                <Text style={[s.filterChipTxt, {
                  color: active ? (tc.isDark ? '#000' : '#fff') : tc.text2,
                  fontFamily: active ? 'Poppins_700Bold' : 'Inter_500Medium',
                }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Handpicked Clubs */}
        {renderHandpickedSection()}

        {/* Premium Bottle Service */}
        {renderBottleServiceBanner()}

        {/* Trending Now */}
        {renderTrendingSection()}

        {/* Top Clubs list */}
        <View style={{ paddingHorizontal: 16 }} onLayout={e => { listY.current = e.nativeEvent.layout.y; }}>
          <View style={s.listHeader}>
            <Text style={[s.listTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
              {filter === 'All' ? 'Top Clubs' : `${filter} Clubs`}
            </Text>
            <View style={[s.resultsBadge, { backgroundColor: `${tc.accent}12` }]}>
              <Text style={[s.resultsTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>{clubs.length} results</Text>
            </View>
          </View>

          {clubs.length === 0 ? (
            <View style={[s.emptyBox, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Feather name="volume-x" size={36} color={tc.text3} />
              <Text style={[s.emptyTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>No clubs found for "{filter}"</Text>
              <TouchableOpacity onPress={() => setFilter('All')}>
                <Text style={[s.emptyAction, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>Show All Clubs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            clubs.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={[s.clubCard, { backgroundColor: tc.card, borderColor: tc.border }]}
                onPress={() => router.push({ pathname: '/club-detail', params: { id: String(c.id), name: c.name } })}
                activeOpacity={0.9}
              >
                <Image source={{ uri: c.img }} style={s.clubImg} contentFit="cover" cachePolicy="memory-disk" />
                <View style={s.clubBody}>
                  <View style={s.clubTopRow}>
                    <Text style={[s.clubName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={1}>{c.name}</Text>
                    {c.tags.includes('VIP') && (
                      <View style={[s.vipBadge, { backgroundColor: `${tc.accent}18`, borderColor: `${tc.accent}44` }]}>
                        <Text style={[s.vipTxt, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>VIP</Text>
                      </View>
                    )}
                  </View>
                  <View style={s.ratingRow}>
                    <Feather name="star" size={9} color={tc.accent} />
                    <Text style={[s.ratingTxt, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>{c.rating}</Text>
                    <Text style={[s.reviewsTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>({c.reviews}) · {c.area}</Text>
                  </View>
                  <View style={s.genreRow}>
                    {c.genres.map(g => (
                      <View key={g} style={[s.genreChip, { backgroundColor: getGenreStyle(g, tc.isDark).bg }]}>
                        <Text style={[s.genreTxt, { color: getGenreStyle(g, tc.isDark).color, fontFamily: 'Inter_500Medium' }]}>{g}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={s.clubActions}>
                  <TouchableOpacity
                    style={[s.bookTableBtn, { backgroundColor: tc.accent }]}
                    onPress={() => router.push({ pathname: '/club-detail', params: { id: String(c.id), name: c.name, tab: 'Booking' } })}
                    activeOpacity={0.85}
                  >
                    <Text style={[s.bookTableTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Book Table</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.viewDetailsBtn, { borderColor: tc.border2 }]}
                    onPress={() => router.push({ pathname: '/club-detail', params: { id: String(c.id), name: c.name } })}
                    activeOpacity={0.85}
                  >
                    <Text style={[s.viewDetailsTxt, { color: tc.text2, fontFamily: 'Poppins_600SemiBold' }]}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
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

  // Filter pills
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterChipTxt: { fontSize: 12 },

  // Banner
  bannerWrap: { position: 'relative' },
  bannerSlide: { height: 176, borderRadius: 18, overflow: 'hidden' },
  bannerImg: { width: '100%', height: 176 },
  bannerGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 130 },
  bannerContent: { position: 'absolute', bottom: 14, left: 14, right: 14 },
  bannerTitle: { fontSize: 22, color: '#fff', lineHeight: 28, marginBottom: 3 },
  bannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 10 },
  bannerCta: { alignSelf: 'flex-start', borderRadius: 20, overflow: 'hidden' },
  bannerCtaGrad: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  bannerCtaTxt: { fontSize: 12 },
  bannerDots: { flexDirection: 'row', justifyContent: 'flex-end', gap: 5, marginTop: 8, paddingRight: 4 },
  bannerDot: { height: 4, borderRadius: 3 },

  // Sections
  section: { marginBottom: 20 },
  secRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 2 },
  secTitle: { fontSize: 16 },
  viewAllRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAll: { fontSize: 12 },

  // Handpicked thumbs
  thumbWrap: { width: 88, alignItems: 'flex-start' },
  thumbImg: { width: 88, height: 88, borderRadius: 16, overflow: 'hidden', marginBottom: 7 },
  thumbVip: { position: 'absolute', top: 5, left: 5, backgroundColor: GOLD, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  thumbVipTxt: { fontSize: 7, color: '#000', letterSpacing: 0.5 },
  thumbName: { fontSize: 11, lineHeight: 14, marginBottom: 1 },
  thumbArea: { fontSize: 10, marginBottom: 3 },
  thumbRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  thumbRatingTxt: { fontSize: 10 },

  // Premium Bottle Service
  bottleCard: { borderRadius: 20, overflow: 'hidden', padding: 20, position: 'relative', minHeight: 190 },
  bottleImg: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
  bottleOverlay: { position: 'absolute', left: 0, top: 0, bottom: 0, right: 0 },
  bottleCrown: { position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  bottleContent: { position: 'relative', zIndex: 2, maxWidth: '62%' },
  bottleTitle: { fontSize: 18, marginBottom: 4 },
  bottleSub: { fontSize: 12, marginBottom: 14, opacity: 0.8 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 8 },
  checkTxt: { fontSize: 13 },
  bottleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginTop: 14, alignSelf: 'flex-start' },
  bottleBtnTxt: { fontSize: 13 },

  // Trending Now
  trendCard: { width: 128, alignItems: 'flex-start' },
  trendImgWrap: { width: 128, height: 88, borderRadius: 16, overflow: 'hidden', marginBottom: 7 },
  trendPlayBtn: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  trendName: { fontSize: 11, lineHeight: 14, marginBottom: 2 },
  trendViews: { fontSize: 10 },

  // Top Clubs list
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  listTitle: { fontSize: 16 },
  resultsBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  resultsTxt: { fontSize: 11 },

  emptyBox: { borderRadius: 20, borderWidth: 1, padding: 40, alignItems: 'center', gap: 10 },
  emptyTitle: { fontSize: 14, textAlign: 'center' },
  emptyAction: { fontSize: 12, marginTop: 4 },

  clubCard: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, padding: 12, gap: 10, marginBottom: 12, alignItems: 'center' },
  clubImg: { width: 76, height: 76, borderRadius: 14 },
  clubBody: { flex: 1, minWidth: 0, paddingTop: 2 },
  clubTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  clubName: { fontSize: 13, flex: 1 },
  vipBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20, borderWidth: 1 },
  vipTxt: { fontSize: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 7 },
  ratingTxt: { fontSize: 11 },
  reviewsTxt: { fontSize: 11 },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  genreChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  genreTxt: { fontSize: 9 },
  clubActions: { flexDirection: 'column', gap: 6, justifyContent: 'center', flexShrink: 0 },
  bookTableBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  bookTableTxt: { fontSize: 9 },
  viewDetailsBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  viewDetailsTxt: { fontSize: 9 },
});
