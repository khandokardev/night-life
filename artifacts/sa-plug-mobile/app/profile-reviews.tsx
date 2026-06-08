import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const STATIC_REVIEWS = [
  { venue: 'ONYX Sandton',        category: 'Club',   rating: 5, date: '20 May 2026', text: 'Incredible atmosphere and world-class service. The VIP section was immaculate. Will definitely be back.' },
  { venue: 'Marble Restaurant',   category: 'Dining', rating: 4, date: '14 May 2026', text: 'Outstanding food and beautiful décor. The wagyu was perfectly cooked. Slightly long wait for dessert but worth it.' },
  { venue: 'Helicopter City Tour', category: 'Tour',  rating: 5, date: '3 May 2026',  text: 'Mind-blowing views of Joburg. The pilot was incredibly knowledgeable. 100% must-do experience.' },
];

function StarRow({ rating }: { rating: number }) {
  const tc = useTC();
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Feather key={i} name="star" size={12} color={i <= rating ? GOLD : tc.muted} />
      ))}
    </View>
  );
}

export default function ProfileReviewsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { reviews, isLoggedIn } = useApp();

  const userReviews = reviews.map(r => ({
    venue: r.itemKey,
    category: 'Purchase',
    rating: r.rating,
    date: r.date,
    text: r.text,
    isLive: true,
  }));

  const allReviews = [
    ...userReviews,
    ...STATIC_REVIEWS.map(r => ({ ...r, isLive: false })),
  ];

  const totalReviews = allReviews.length;
  const avgRating = totalReviews > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>My Reviews</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30, gap: 12 }}>

        {/* Summary card */}
        <View style={[styles.summaryCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>{totalReviews}</Text>
            <Text style={[styles.summaryLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Total Reviews</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: tc.border }]} />
          <View style={styles.summaryItem}>
            <View style={styles.summaryRatingRow}>
              <Text style={[styles.summaryVal, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>{avgRating}</Text>
              <Feather name="star" size={14} color={GOLD} style={{ marginTop: 2 }} />
            </View>
            <Text style={[styles.summaryLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Avg Rating</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: tc.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>{userReviews.length}</Text>
            <Text style={[styles.summaryLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>My Writes</Text>
          </View>
        </View>

        {/* Gate for non-logged-in users */}
        {!isLoggedIn && (
          <View style={[styles.gateCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Feather name="lock" size={24} color={tc.text3} />
            <Text style={[styles.gateTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              Sign in to see and write reviews
            </Text>
            <TouchableOpacity
              style={[styles.gateBtn, { backgroundColor: tc.accent }]}
              onPress={() => router.push('/(auth)/sign-in')}
              activeOpacity={0.85}
            >
              <Text style={[styles.gateBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Review cards */}
        {allReviews.map((rv, i) => (
          <View key={i} style={[styles.card, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, { backgroundColor: rv.isLive ? `${tc.accent}18` : `${GOLD}18` }]}>
                <Feather name="star" size={16} color={rv.isLive ? tc.accent : GOLD} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.venueName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{rv.venue}</Text>
                <Text style={[styles.categoryTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
                  {rv.category} · {rv.date}
                  {rv.isLive && (
                    <Text style={{ color: tc.accent }}> · Verified</Text>
                  )}
                </Text>
              </View>
              <StarRow rating={rv.rating} />
            </View>
            <Text style={[styles.reviewText, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{rv.text}</Text>
          </View>
        ))}

        {allReviews.length === 0 && (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Feather name="star" size={28} color={tc.text3} />
            </View>
            <Text style={[styles.emptyTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>No reviews yet</Text>
            <Text style={[styles.emptySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
              Complete a booking or purchase to unlock reviews
            </Text>
          </View>
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

  summaryCard: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center', marginBottom: 4 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  summaryVal: { fontSize: 20 },
  summaryLabel: { fontSize: 11, marginTop: 2 },
  divider: { width: 1, height: 32, opacity: 0.5 },

  gateCard: { borderRadius: 16, borderWidth: 1, padding: 20, alignItems: 'center', gap: 12 },
  gateTxt: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  gateBtn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 10 },
  gateBtnTxt: { fontSize: 13 },

  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  venueName: { fontSize: 14, marginBottom: 2 },
  categoryTxt: { fontSize: 12 },
  starRow: { flexDirection: 'row', gap: 2, paddingTop: 2 },
  reviewText: { fontSize: 13, lineHeight: 20 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 14 },
  emptyIcon: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emptyTitle: { fontSize: 17 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 24 },
});
