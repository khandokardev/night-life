import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const ALL_SAVED = [
  { id: 1,  type: 'club',       name: 'ONYX SANDTON',     area: 'Sandton',      rating: 4.8, img: 'https://picsum.photos/seed/onyx-saved/800/400' },
  { id: 3,  type: 'club',       name: 'COCO SANDTON',     area: 'Sandton',      rating: 4.7, img: 'https://picsum.photos/seed/coco-saved/800/400' },
  { id: 6,  type: 'club',       name: 'ZONE 6 VENUE',     area: 'Soweto',       rating: 4.6, img: 'https://picsum.photos/seed/zone6-saved/800/400' },
  { id: 1,  type: 'restaurant', name: 'Marble Restaurant', area: 'Sandton',     rating: 4.8, img: 'https://picsum.photos/seed/marble-saved/800/400' },
  { id: 0,  type: 'restaurant', name: 'Rooftop by Luma',  area: 'Sandton City', rating: 4.7, img: 'https://picsum.photos/seed/rooftop-saved/800/400' },
];

export default function ProfileSavedScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(ALL_SAVED);

  const handleUnsave = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
          Saved Venues {items.length > 0 ? `(${items.length})` : ''}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30, gap: 10 }}>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Feather name="heart" size={36} color={tc.text3} />
            </View>
            <Text style={[styles.emptyTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>No saved venues</Text>
            <Text style={[styles.emptySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
              Bookmark clubs and restaurants to find them here
            </Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={[styles.exploreBtn, { backgroundColor: tc.accent }]}>
              <Text style={[styles.exploreBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Explore Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => router.push({
                pathname: item.type === 'restaurant' ? '/restaurant-detail' : '/club-detail',
                params: { id: String(item.id), name: item.name },
              })}
              style={[styles.card, { backgroundColor: tc.card, borderColor: tc.border }]}
              activeOpacity={0.88}
            >
              <Image source={{ uri: item.img }} style={styles.thumb} contentFit="cover" />
              <View style={{ flex: 1, padding: 12 }}>
                <View style={[styles.typeBadge, { backgroundColor: tc.accent + '15' }]}>
                  <Text style={[styles.typeTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>
                    {item.type === 'club' ? 'Nightclub' : 'Restaurant'}
                  </Text>
                </View>
                <Text style={[styles.name, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{item.name}</Text>
                <Text style={[styles.area, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{item.area}</Text>
                <View style={styles.ratingRow}>
                  <Feather name="star" size={12} color={GOLD} />
                  <Text style={[styles.ratingTxt, { color: GOLD, fontFamily: 'Poppins_600SemiBold' }]}>{item.rating}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.heartBtn}
                activeOpacity={0.8}
                onPress={() => handleUnsave(i)}
              >
                <Feather name="heart" size={20} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 14 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emptyTitle: { fontSize: 18 },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  exploreBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, marginTop: 6 },
  exploreBtnTxt: { fontSize: 14 },
  card: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, overflow: 'hidden', alignItems: 'center' },
  thumb: { width: 90, height: 90 },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, marginBottom: 5 },
  typeTxt: { fontSize: 10, letterSpacing: 0.3 },
  name: { fontSize: 14, marginBottom: 2 },
  area: { fontSize: 12, marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt: { fontSize: 12 },
  heartBtn: { padding: 16 },
});
