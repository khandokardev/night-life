import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const TRENDING_ALL = [
  { id: 1, img: 'https://picsum.photos/seed/trend1/800/500',  name: 'Amapiano Nights',          venue: 'Onyx Sandton',     views: '12.4K views', genre: 'Amapiano' },
  { id: 2, img: 'https://picsum.photos/seed/trend2/800/500',  name: 'Luxe Fridays Rosebank',    venue: 'Kong Rosebank',    views: '9.8K views',  genre: 'Afrobeats' },
  { id: 3, img: 'https://picsum.photos/seed/trend3/800/500',  name: 'After Dark Saturdays',     venue: 'Coco Sandton',     views: '8.3K views',  genre: 'Hip Hop' },
  { id: 4, img: 'https://picsum.photos/seed/trend4/800/500',  name: 'Rooftop Takeovers',        venue: 'Status Nightclub', views: '7.1K views',  genre: 'EDM' },
  { id: 5, img: 'https://picsum.photos/seed/trend5/800/500',  name: 'VIP Sundays',              venue: 'ICON Soweto',      views: '6.5K views',  genre: 'Amapiano' },
  { id: 6, img: 'https://picsum.photos/seed/trend6/800/500',  name: 'Gqom Wave Thursdays',      venue: 'Zone 6 Venue',     views: '5.9K views',  genre: 'Gqom' },
  { id: 1, img: 'https://picsum.photos/seed/trend7/800/500',  name: 'Bottle Service Wednesdays',venue: 'Onyx Sandton',     views: '5.2K views',  genre: 'R&B' },
  { id: 2, img: 'https://picsum.photos/seed/trend8/800/500',  name: 'Exclusive Mondays',        venue: 'Kong Rosebank',    views: '4.8K views',  genre: 'Hip Hop' },
];

const GENRE_COLORS: Record<string, { bg: string; color: string }> = {
  'Amapiano': { bg: 'rgba(212,175,55,0.14)',  color: '#D4AF37' },
  'Afrobeats': { bg: 'rgba(220,100,50,0.16)', color: '#E08060' },
  'Hip Hop':  { bg: 'rgba(255,255,255,0.08)', color: '#aaa' },
  'EDM':      { bg: 'rgba(50,220,150,0.14)',  color: '#40C090' },
  'Gqom':     { bg: 'rgba(50,160,220,0.16)',  color: '#50A0DC' },
  'R&B':      { bg: 'rgba(160,100,220,0.16)', color: '#B070E0' },
};

export default function TrendingScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Feather name="chevron-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Trending Now</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* Hero banner — top trending */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, marginBottom: 20 }}>
          <TouchableOpacity
            style={s.heroCard}
            onPress={() => router.push({ pathname: '/club-detail', params: { id: String(TRENDING_ALL[0].id), name: TRENDING_ALL[0].venue } })}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: TRENDING_ALL[0].img }}
              style={s.heroImg}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={s.heroGrad}
            />
            <View style={[s.heroRankBadge, { backgroundColor: GOLD }]}>
              <Text style={[s.heroRankTxt, { fontFamily: 'Poppins_700Bold' }]}>#1</Text>
            </View>
            <View style={s.heroPlayBtn}>
              <Feather name="play" size={22} color="#fff" />
            </View>
            <View style={s.heroContent}>
              <View style={[s.genreChip, { backgroundColor: GENRE_COLORS[TRENDING_ALL[0].genre]?.bg ?? 'rgba(255,255,255,0.08)' }]}>
                <Text style={[s.genreTxt, { color: GENRE_COLORS[TRENDING_ALL[0].genre]?.color ?? '#aaa', fontFamily: 'Inter_500Medium' }]}>{TRENDING_ALL[0].genre}</Text>
              </View>
              <Text style={[s.heroName, { fontFamily: 'Poppins_700Bold' }]}>{TRENDING_ALL[0].name}</Text>
              <View style={s.heroMeta}>
                <Feather name="map-pin" size={11} color="rgba(255,255,255,0.7)" />
                <Text style={[s.heroVenue, { fontFamily: 'Inter_400Regular' }]}>{TRENDING_ALL[0].venue}</Text>
                <View style={s.heroDot} />
                <Feather name="eye" size={11} color="rgba(255,255,255,0.7)" />
                <Text style={[s.heroViews, { fontFamily: 'Inter_400Regular' }]}>{TRENDING_ALL[0].views}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Label */}
        <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
          <Text style={[s.sectionLabel, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>All Trending Events</Text>
          <Text style={[s.sectionSub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{TRENDING_ALL.length} events this week</Text>
        </View>

        {/* List */}
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {TRENDING_ALL.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[s.card, { backgroundColor: tc.card, borderColor: tc.border }]}
              onPress={() => router.push({ pathname: '/club-detail', params: { id: String(item.id), name: item.venue } })}
              activeOpacity={0.85}
            >
              {/* Thumbnail */}
              <View style={s.cardImgWrap}>
                <Image source={{ uri: item.img }} style={s.cardImg} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={s.cardPlayBtn}>
                  <Feather name="play" size={10} color="#fff" />
                </View>
                <View style={[s.rankBadge, { backgroundColor: i === 0 ? GOLD : 'rgba(255,255,255,0.15)' }]}>
                  <Text style={[s.rankTxt, { color: i === 0 ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>#{i + 1}</Text>
                </View>
              </View>

              {/* Info */}
              <View style={s.cardBody}>
                <Text style={[s.cardName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={1}>{item.name}</Text>
                <View style={s.cardMeta}>
                  <Feather name="map-pin" size={10} color={tc.text3} />
                  <Text style={[s.cardVenue, { color: tc.text3, fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>{item.venue}</Text>
                </View>
                <View style={s.cardBottom}>
                  <View style={[s.genreChip, { backgroundColor: GENRE_COLORS[item.genre]?.bg ?? 'rgba(255,255,255,0.08)' }]}>
                    <Text style={[s.genreTxt, { color: GENRE_COLORS[item.genre]?.color ?? '#aaa', fontFamily: 'Inter_500Medium' }]}>{item.genre}</Text>
                  </View>
                  <View style={s.viewsRow}>
                    <Feather name="eye" size={10} color={tc.text3} />
                    <Text style={[s.cardViews, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{item.views}</Text>
                  </View>
                </View>
              </View>

              {/* Arrow */}
              <View style={s.cardArrow}>
                <Feather name="chevron-right" size={16} color={tc.text3} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18 },

  heroCard: { borderRadius: 20, overflow: 'hidden', height: 220, position: 'relative' },
  heroImg: { width: '100%', height: 220 },
  heroGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 },
  heroRankBadge: { position: 'absolute', top: 14, left: 14, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroRankTxt: { fontSize: 12, color: '#000' },
  heroPlayBtn: {
    position: 'absolute', top: '50%', left: '50%',
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  heroContent: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  heroName: { fontSize: 20, color: '#fff', marginBottom: 6, marginTop: 6 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroVenue: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  heroViews: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  heroDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },

  sectionLabel: { fontSize: 16, marginBottom: 2 },
  sectionSub: { fontSize: 12 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, borderWidth: 1, padding: 10,
  },
  cardImgWrap: { width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative' },
  cardImg: { width: 72, height: 72 },
  cardPlayBtn: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  rankBadge: { position: 'absolute', top: 5, left: 5, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  rankTxt: { fontSize: 9 },
  cardBody: { flex: 1, minWidth: 0 },
  cardName: { fontSize: 13, marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  cardVenue: { fontSize: 11, flex: 1 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  genreChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  genreTxt: { fontSize: 10 },
  viewsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardViews: { fontSize: 11 },
  cardArrow: { paddingRight: 4 },
});
