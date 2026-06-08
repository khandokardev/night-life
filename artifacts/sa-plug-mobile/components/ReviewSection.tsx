import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GOLD } from '@/constants/colors';

type StaticReview = {
  id: number;
  user?: string;
  name?: string;
  rating: number;
  text: string;
  date?: string;
};

type Props = {
  itemKey: string;
  staticReviews?: StaticReview[];
};

export default function ReviewSection({ itemKey, staticReviews = [] }: Props) {
  const tc = useTC();
  const { isLoggedIn, hasCompletedCheckout, user, addReview, getItemReviews } = useApp();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const userReviews = getItemReviews(itemKey);
  const canReview = isLoggedIn && hasCompletedCheckout;

  const handleSubmit = () => {
    if (rating === 0 || !reviewText.trim()) return;
    addReview({
      itemKey,
      userName: user?.name ?? 'Member',
      rating,
      text: reviewText.trim(),
      date: 'Just now',
    });
    setRating(0);
    setReviewText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <View>
      {userReviews.length > 0 && (
        <View style={{ gap: 10, marginBottom: 12 }}>
          {userReviews.map(rv => (
            <View key={rv.id} style={[styles.card, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <View style={styles.cardTop}>
                <View style={[styles.avatar, { backgroundColor: tc.accent }]}>
                  <Text style={[styles.avatarTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>{rv.userName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.username, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{rv.userName}</Text>
                  <Text style={[styles.date, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{rv.date}</Text>
                </View>
                <View style={styles.stars}>
                  {Array.from({ length: rv.rating }, (_, i) => <Feather key={i} name="star" size={12} color={GOLD} />)}
                </View>
              </View>
              <Text style={[styles.reviewTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{rv.text}</Text>
            </View>
          ))}
        </View>
      )}

      {staticReviews.length > 0 && (
        <View style={{ gap: 10, marginBottom: 16 }}>
          {staticReviews.map(rv => (
            <View key={rv.id} style={[styles.card, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <View style={styles.cardTop}>
                <View style={[styles.avatar, { backgroundColor: tc.accent }]}>
                  <Text style={[styles.avatarTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>{(rv.user ?? rv.name ?? 'M')[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.username, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{rv.user ?? rv.name ?? 'Member'}</Text>
                  {rv.date && <Text style={[styles.date, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{rv.date}</Text>}
                </View>
                <View style={styles.stars}>
                  {Array.from({ length: rv.rating }, (_, i) => <Feather key={i} name="star" size={12} color={GOLD} />)}
                </View>
              </View>
              <Text style={[styles.reviewTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{rv.text}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.writeCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
        <Text style={[styles.writeTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Write a Review</Text>

        {!isLoggedIn && (
          <View style={styles.gateBox}>
            <Feather name="lock" size={22} color={tc.text3} />
            <Text style={[styles.gateTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              Sign in to leave a review
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

        {isLoggedIn && !hasCompletedCheckout && (
          <View style={styles.gateBox}>
            <Feather name="shopping-bag" size={22} color={tc.text3} />
            <Text style={[styles.gateTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              Complete a booking or purchase to unlock reviews
            </Text>
          </View>
        )}

        {canReview && !submitted && (
          <View>
            <Text style={[styles.ratingLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Your rating</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.7}>
                  <Feather name="star" size={30} color={s <= rating ? GOLD : tc.border} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: tc.inputBg ?? tc.bg, borderColor: rating > 0 ? tc.border : tc.border, color: tc.text, fontFamily: 'Inter_400Regular' }]}
              placeholder="Share your experience…"
              placeholderTextColor={tc.text3}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: tc.accent, opacity: rating === 0 || !reviewText.trim() ? 0.45 : 1 }]}
              onPress={handleSubmit}
              disabled={rating === 0 || !reviewText.trim()}
              activeOpacity={0.85}
            >
              <Text style={[styles.submitTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        )}

        {canReview && submitted && (
          <View style={styles.gateBox}>
            <Feather name="check-circle" size={22} color="#22c55e" />
            <Text style={[styles.gateTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              Thank you! Your review has been posted.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 13 },
  username: { fontSize: 13 },
  date: { fontSize: 11, marginTop: 1 },
  stars: { flexDirection: 'row', gap: 2 },
  reviewTxt: { fontSize: 13, lineHeight: 20 },
  writeCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 4 },
  writeTitle: { fontSize: 15, marginBottom: 12 },
  gateBox: { alignItems: 'center', gap: 10, paddingVertical: 10 },
  gateTxt: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  gateBtn: { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 10, marginTop: 4 },
  gateBtnTxt: { fontSize: 13 },
  ratingLabel: { fontSize: 13, marginBottom: 8 },
  starRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 13, minHeight: 84, marginBottom: 12 },
  submitBtn: { borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  submitTxt: { fontSize: 14 },
});
