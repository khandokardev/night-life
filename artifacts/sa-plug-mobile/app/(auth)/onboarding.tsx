import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { GOLD } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions, FlatList, Platform, StyleSheet, Text,
  TouchableOpacity, View, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

const SLIDES = [
  {
    id: 1,
    img: 'https://picsum.photos/seed/saPlugClub1/800/1400',
    heading: 'Experience',
    gold: 'Luxury',
    tail: 'Nightlife',
    sub: "Exclusive access to the world's most premium venues, bottle service & unforgettable experiences.",
  },
  {
    id: 2,
    img: 'https://picsum.photos/seed/saPlugExp2/800/1400',
    heading: 'Book Premium',
    gold: 'Experiences',
    tail: '',
    sub: 'Safari, wine tours, helicopter rides, yacht experiences — all in one place.',
  },
  {
    id: 3,
    img: 'https://picsum.photos/seed/saPlugVip3/800/1400',
    heading: 'Your VIP',
    gold: 'Concierge',
    tail: '',
    sub: '24/7 luxury concierge service at your fingertips. Reserve, discover, belong.',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [activeIdx, setActiveIdx] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const next = () => {
    if (activeIdx < SLIDES.length - 1) {
      const newIdx = activeIdx + 1;
      flatRef.current?.scrollToIndex({ index: newIdx, animated: true });
      setActiveIdx(newIdx);
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  const skip = () => router.replace('/(auth)/welcome');
  const isLast = activeIdx === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={s => String(s.id)}
        style={StyleSheet.absoluteFill}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIdx(idx);
        }}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <Image
              source={{ uri: item.img }}
              style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', '#000000']}
              locations={[0, 0.45, 1]}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      />

      {/* Skip — top right only */}
      <View style={[styles.topRow, { paddingTop: insets.top + WEB_TOP + 16 }]}>
        {!isLast ? (
          <TouchableOpacity onPress={skip} style={styles.skipBtn}>
            <Text style={styles.skipTxt}>Skip</Text>
          </TouchableOpacity>
        ) : <View />}
      </View>

      {/* Bottom content */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + WEB_BOT + 40, paddingTop: height * 0.52 }]}>
        {/* Headline */}
        <View style={styles.textArea}>
          <Text style={styles.heading}>
            {SLIDES[activeIdx].heading}{'\n'}
            <Text style={styles.headingGold}>{SLIDES[activeIdx].gold}</Text>
            {SLIDES[activeIdx].tail ? (
              <Text style={styles.heading}>{'\n'}{SLIDES[activeIdx].tail}</Text>
            ) : null}
          </Text>
          <Text style={styles.sub}>{SLIDES[activeIdx].sub}</Text>
        </View>

        {/* Dots (left) + Next pill button (right) — same row */}
        <View style={styles.bottomRow}>
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  flatRef.current?.scrollToIndex({ index: i, animated: true });
                  setActiveIdx(i);
                }}
                style={[styles.dot, i === activeIdx && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={next} activeOpacity={0.85}>
            <Text style={styles.nextTxt}>{isLast ? 'Get Started' : 'Next'}</Text>
            <Feather name="chevron-right" size={18} color="#000" strokeWidth={3 as any} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  logoWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    alignItems: 'center',
    zIndex: 9,
  },
  logoImg: { width: 160, height: 134 },

  topRow: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  skipBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  skipTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },

  bottom: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    paddingHorizontal: 28,
    justifyContent: 'flex-end',
  },
  textArea: { marginBottom: 28 },
  heading: {
    fontSize: 40, fontWeight: '900', color: '#FFFFFF',
    lineHeight: 48, textTransform: 'uppercase',
    fontFamily: 'Poppins_900Black',
  },
  headingGold: {
    fontSize: 40, fontWeight: '900', color: GOLD,
    lineHeight: 48, textTransform: 'uppercase',
    fontFamily: 'Poppins_900Black',
  },
  sub: {
    fontSize: 14, color: '#B3B3B3', lineHeight: 22, marginTop: 10,
    fontFamily: 'Inter_400Regular',
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 8, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { width: 28, height: 4, borderRadius: 2, backgroundColor: GOLD },

  nextBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: GOLD,
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 50,
    shadowColor: GOLD, shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 0 },
  },
  nextTxt: { fontSize: 15, fontWeight: '800', color: '#000', fontFamily: 'Poppins_700Bold' },
});
