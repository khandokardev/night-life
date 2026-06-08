import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList, Platform, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const RECENT = ['ONYX Sandton', 'Cape Winelands Helicopter', 'Marble Restaurant'];
const CATEGORIES = [
  { label: 'Clubs',       icon: '🍸', color: '#B8860B', route: '/(tabs)/clubs' },
  { label: 'Tours',       icon: '🌿', color: '#2E8B57', route: '/(tabs)/tours' },
  { label: 'Dining',      icon: '🍽️', color: '#E07B39', route: '/(tabs)/dining' },
  { label: 'Shop',        icon: '🛍️', color: '#C8A2C8', route: '/(tabs)/shop' },
  { label: 'VIP',         icon: '👑', color: '#D4AF37', route: '/(tabs)/clubs' },
  { label: 'Events',      icon: '🎵', color: '#8B5CF6', route: '/(tabs)/' },
];

const ALL_ITEMS = [
  { id: 1, type: 'club',   name: 'ONYX',                      area: 'Sandton, JHB',      rating: 4.9, img: 'https://picsum.photos/seed/onyx3/400/300',    route: '/club-detail'   },
  { id: 2, type: 'club',   name: 'COCO',                      area: 'V&A Waterfront',    rating: 4.8, img: 'https://picsum.photos/seed/coco3/400/300',     route: '/club-detail'   },
  { id: 3, type: 'tour',   name: 'Cape Winelands Helicopter', area: 'Cape Town',         rating: 4.9, img: 'https://picsum.photos/seed/heli3/400/300',     route: '/tour-detail'   },
  { id: 4, type: 'dining', name: 'Marble Restaurant',         area: 'Rosebank, JHB',    rating: 4.9, img: 'https://picsum.photos/seed/marble4/400/300',   route: '/restaurant-detail' },
  { id: 5, type: 'tour',   name: 'Garden Route Safari',       area: 'Eastern Cape',     rating: 4.8, img: 'https://picsum.photos/seed/safari3/400/300',   route: '/tour-detail'   },
  { id: 6, type: 'dining', name: 'Norocco',                   area: 'Cape Town',        rating: 4.8, img: 'https://picsum.photos/seed/norocco3/400/300',  route: '/restaurant-detail' },
  { id: 7, type: 'club',   name: 'KONG',                      area: 'Cape Town CBD',    rating: 4.6, img: 'https://picsum.photos/seed/kong2/400/300',     route: '/club-detail'   },
  { id: 8, type: 'club',   name: 'ZONE 6',                    area: 'Soweto, JHB',      rating: 4.7, img: 'https://picsum.photos/seed/zone7/400/300',     route: '/club-detail'   },
];

export default function SearchScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');

  const results = query.length >= 2
    ? ALL_ITEMS.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.area.toLowerCase().includes(query.toLowerCase()))
    : [];

  const typeBadgeColor = (type: string) => {
    if (type === 'club') return '#B8860B';
    if (type === 'tour') return '#2E8B57';
    return '#E07B39';
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={tc.text} />
          </TouchableOpacity>
          <View style={[styles.searchBar, { backgroundColor: tc.authInputBg, borderColor: tc.authBorder }]}>
            <Feather name="search" size={16} color={tc.text3} />
            <TextInput
              ref={inputRef}
              style={[styles.searchInput, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
              placeholder="Search clubs, tours, dining..."
              placeholderTextColor={tc.text3}
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Feather name="x" size={16} color={tc.text3} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>
        {query.length < 2 ? (
          <>
            {RECENT.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Recent Searches</Text>
                  <TouchableOpacity>
                    <Text style={[styles.clearTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recentList}>
                  {RECENT.map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.recentItem, { borderBottomColor: tc.border }]}
                      onPress={() => setQuery(r)}
                    >
                      <View style={[styles.recentIcon, { backgroundColor: tc.chipBg }]}>
                        <Feather name="clock" size={14} color={tc.text3} />
                      </View>
                      <Text style={[styles.recentTxt, { color: tc.text, fontFamily: 'Inter_400Regular' }]}>{r}</Text>
                      <Feather name="chevron-right" size={14} color={tc.text3} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Browse Categories</Text>
              <View style={styles.catGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.label}
                    style={[styles.catCard, { backgroundColor: cat.color + '14', borderColor: cat.color + '35' }]}
                    onPress={() => router.push(cat.route as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.catIcon}>{cat.icon}</Text>
                    <Text style={[styles.catLabel, { color: cat.color, fontFamily: 'Poppins_600SemiBold' }]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : results.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="search" size={42} color={tc.text3} />
            <Text style={[styles.emptyTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>No results found</Text>
            <Text style={[styles.emptySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Try a different search term</Text>
          </View>
        ) : (
          <View style={styles.results}>
            <Text style={[styles.resultsCount, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{results.length} results for "{query}"</Text>
            {results.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.resultCard, { backgroundColor: tc.card, borderColor: tc.border }]}
                onPress={() => router.push({ pathname: item.route as any, params: { id: item.id, name: item.name } })}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.img }} style={styles.resultImg} contentFit="cover" />
                <View style={styles.resultInfo}>
                  <View style={[styles.typeBadge, { backgroundColor: typeBadgeColor(item.type) + '20' }]}>
                    <Text style={[styles.typeBadgeTxt, { color: typeBadgeColor(item.type), fontFamily: 'Poppins_600SemiBold' }]}>{item.type.toUpperCase()}</Text>
                  </View>
                  <Text style={[styles.resultName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{item.name}</Text>
                  <View style={styles.resultRow}>
                    <Feather name="map-pin" size={11} color={tc.text3} />
                    <Text style={[styles.resultArea, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{item.area}</Text>
                    <View style={styles.ratingRow}>
                      <Feather name="star" size={11} color={GOLD} />
                      <Text style={[styles.ratingTxt, { color: GOLD, fontFamily: 'Poppins_600SemiBold' }]}>{item.rating}</Text>
                    </View>
                  </View>
                </View>
                <Feather name="chevron-right" size={16} color={tc.text3} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: 15 },
  section: { padding: 16, paddingBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16 },
  clearTxt: { fontSize: 13 },
  recentList: {},
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  recentIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  recentTxt: { flex: 1, fontSize: 15 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  catCard: { width: '30%', alignItems: 'center', paddingVertical: 18, borderRadius: 14, borderWidth: 1, gap: 6 },
  catIcon: { fontSize: 24 },
  catLabel: { fontSize: 12 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 20 },
  emptySub: { fontSize: 14 },
  results: { padding: 16, gap: 10 },
  resultsCount: { fontSize: 13, marginBottom: 4 },
  resultCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, overflow: 'hidden', paddingRight: 12 },
  resultImg: { width: 80, height: 80 },
  resultInfo: { flex: 1, padding: 10 },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, marginBottom: 4 },
  typeBadgeTxt: { fontSize: 9, letterSpacing: 0.8 },
  resultName: { fontSize: 14, marginBottom: 4 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultArea: { fontSize: 12, flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingTxt: { fontSize: 11 },
});
