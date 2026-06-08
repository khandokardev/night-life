import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather, MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const TABS = [
  { name: 'index',  label: 'Home',   icon: (c: string) => <MCI name="home"                   size={22} color={c} /> },
  { name: 'clubs',  label: 'Clubs',  icon: (c: string) => <MCI name="glass-wine"              size={22} color={c} /> },
  { name: 'tours',  label: 'Tours',  icon: (c: string) => <MCI name="palm-tree"               size={22} color={c} /> },
  { name: 'dining', label: 'Dining', icon: (c: string) => <MCI name="silverware-fork-knife"   size={22} color={c} /> },
  { name: 'shop',   label: 'Shop',   icon: (c: string) => <MCI name="shopping-outline"        size={22} color={c} /> },
];

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  return (
    <View style={[
      styles.tabBar,
      {
        backgroundColor: tc.navBg,
        borderTopColor: tc.border,
        paddingBottom: isWeb ? 8 : insets.bottom || 8,
        height: isWeb ? 72 : 60 + (insets.bottom || 8),
      },
    ]}>
      {TABS.map((tab, index) => {
        const focused = state.index === index;
        const color = focused ? tc.accent : tc.text3;
        return (
          <Pressable
            key={tab.name}
            style={styles.tabItem}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: state.routes[index].key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate({ name: state.routes[index].name, merge: true });
              }
            }}
            android_ripple={null}
          >
            {focused && <View style={[styles.activeBar, { backgroundColor: tc.accent }]} />}
            {tab.icon(color)}
            <Text style={[styles.tabLabel, { color, fontFamily: focused ? 'Poppins_600SemiBold' : 'Poppins_400Regular' }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function FloatingCartBar() {
  const tc = useTC();
  const { cart, cartCount } = useApp();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const anim = useRef(new Animated.Value(0)).current;

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tabBarH = isWeb ? 72 : 60 + (insets.bottom || 8);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: cartCount > 0 ? 1 : 0,
      tension: 80,
      friction: 12,
      useNativeDriver: false,
    }).start();
  }, [cartCount]);

  return (
    <Animated.View
      pointerEvents={cartCount > 0 ? 'auto' : 'none'}
      style={[
        styles.cartBar,
        {
          bottom: tabBarH + 10,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [90, 0] }) }],
        },
      ]}
    >
      <View style={[styles.cartBarInner, { backgroundColor: tc.accent }]}>
        <View style={styles.cartBarLeft}>
          <View style={styles.cartIconWrap}>
            <Feather name="shopping-bag" size={22} color={tc.isDark ? '#1a1000' : '#fff'} />
            <View style={[styles.cartBadge, {
              backgroundColor: tc.isDark ? '#111' : '#fff',
              borderColor: tc.isDark ? GOLD : tc.accent,
            }]}>
              <Text style={[styles.cartBadgeTxt, { color: tc.isDark ? '#fff' : tc.accent }]}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          </View>
          <View style={{ gap: 1 }}>
            <Text style={[styles.cartCountTxt, { color: tc.isDark ? '#1a1000' : 'rgba(255,255,255,0.80)' }]}>
              {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'} · SUBTOTAL
            </Text>
            <Text style={[styles.cartSubtotal, { color: tc.isDark ? '#1a1000' : '#fff' }]}>
              R{subtotal.toLocaleString()}
            </Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.cartBarBtn,
            { backgroundColor: tc.isDark ? '#111' : 'rgba(0,0,0,0.22)', opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.push('/cart')}
          android_ripple={null}
        >
          <Text style={styles.cartBarBtnTxt}>View Cart →</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export default function TabLayout() {
  const { isLoggedIn, isGuest } = useApp();

  useEffect(() => {
    if (!isLoggedIn && !isGuest) {
      router.replace('/(auth)/welcome');
    }
  }, [isLoggedIn, isGuest]);

  if (!isLoggedIn && !isGuest) return null;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="clubs" />
        <Tabs.Screen name="tours" />
        <Tabs.Screen name="dining" />
        <Tabs.Screen name="shop" />
      </Tabs>
      <FloatingCartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingBottom: 2,
    overflow: 'visible',
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  activeBar: {
    position: 'absolute',
    top: -8,
    width: 28,
    height: 3,
    borderRadius: 2,
  },

  cartBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 999,
  },
  cartBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cartIconWrap: {
    position: 'relative',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
  },
  cartBadgeTxt: {
    fontSize: 9,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 11,
  },
  cartCountTxt: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.4,
  },
  cartSubtotal: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 22,
  },
  cartBarBtn: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBarBtnTxt: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.2,
  },
});
