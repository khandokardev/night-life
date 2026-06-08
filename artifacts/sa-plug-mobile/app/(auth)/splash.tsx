import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { GOLD } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import {
  Animated, Dimensions, Easing, Platform,
  StatusBar, StyleSheet, Text, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const BG_IMAGE = 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=1600&fit=crop&q=85';

const DURATION = 2400;

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(150),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: DURATION,
      delay: 300,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, DURATION + 400);

    return () => clearTimeout(timer);
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.72],
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background cityscape */}
      <Image
        source={{ uri: BG_IMAGE }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* Warm amber dark overlay — dark sky top, glowing city bottom */}
      <LinearGradient
        colors={[
          'rgba(4,3,2,0.92)',
          'rgba(8,5,2,0.70)',
          'rgba(14,9,2,0.38)',
          'rgba(20,12,2,0.55)',
          'rgba(6,4,1,0.88)',
        ]}
        locations={[0, 0.22, 0.48, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Center content */}
      <View style={s.center}>
        {/* Logo */}
        <Animated.View style={[
          s.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}>
          {/* Glow halo behind logo */}
          <View style={s.glow} />
          <Image
            source={require('../../assets/images/logo.png')}
            style={s.logoImg}
            contentFit="contain"
          />
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: taglineOpacity, alignItems: 'center', marginTop: 20 }}>
          <View style={s.taglineRow}>
            <View style={s.taglineLine} />
            <Text style={s.taglineTxt}>CONNECT</Text>
            <View style={s.taglineDot} />
            <Text style={s.taglineTxt}>EXPERIENCE</Text>
            <View style={s.taglineLine} />
          </View>
        </Animated.View>
      </View>

      {/* Progress bar — anchored near bottom */}
      <View style={[s.barWrap, { bottom: insets.bottom + (Platform.OS === 'web' ? 54 : 40) }]}>
        <View style={s.barTrack}>
          <Animated.View style={[s.barFill, { width: barWidth }]} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#060400',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: GOLD,
    opacity: 0.07,
  },
  logoImg: {
    width: 220,
    height: 184,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taglineLine: {
    width: 22,
    height: 1,
    backgroundColor: `${GOLD}70`,
  },
  taglineDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
    opacity: 0.8,
  },
  taglineTxt: {
    color: GOLD,
    fontSize: 11,
    letterSpacing: 4,
    fontFamily: 'Inter_500Medium',
    opacity: 0.85,
  },
  barWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  barTrack: {
    width: width * 0.72,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
