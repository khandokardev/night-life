import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Alert, Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

export default function ProfileScreen() {
  const tc = useTC();
  const { theme, toggleTheme, isLoggedIn, user, updateUser } = useApp();
  const vipGold = tc.isDark ? GOLD : tc.accent;
  const insets = useSafeAreaInsets();

  if (!isLoggedIn) {
    return (
      <View style={[s.root, { backgroundColor: tc.bg }]}>
        <View style={[s.headerBar, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
          <View style={{ width: 36 }} />
          <Text style={[s.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Profile</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={s.guestWrap}>
          <View style={[s.guestIconWrap, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Feather name="user" size={42} color={tc.text3} />
          </View>
          <Text style={[s.guestTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>You're a Guest</Text>
          <Text style={[s.guestSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            Sign in to access your profile, bookings, saved venues, and exclusive member features.
          </Text>
          <TouchableOpacity
            style={[s.guestBtnWrap, { overflow: 'hidden', borderRadius: 16 }]}
            onPress={() => router.push('/(auth)/sign-in')}
            activeOpacity={0.85}
          >
            <LinearGradient colors={tc.accentGradColors} style={s.guestBtn} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Text style={[s.guestBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.guestOutlineBtn, { borderColor: tc.accent }]}
            onPress={() => router.push('/(auth)/sign-up')}
            activeOpacity={0.85}
          >
            <Text style={[s.guestOutlineTxt, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.guestOutlineBtn, { borderColor: tc.border, marginTop: 0 }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={15} color={tc.text2} />
            <Text style={[s.guestOutlineTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.backHomeBtn}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.7}
          >
            <Feather name="home" size={14} color={tc.text3} />
            <Text style={[s.backHomeTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const pickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow photo library access to change your profile picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        updateUser({ avatar: result.assets[0].uri });
      }
    } catch {
      Alert.alert('Error', 'Could not open photo library. Please try again.');
    }
  };

  const MENU = [
    { icon: 'calendar',     label: 'My Bookings',     route: '/profile-bookings' },
    { icon: 'clipboard',    label: 'My Reservation',  route: '/reservations'     },
    { icon: 'heart',        label: 'Saved Venues',    route: '/profile-saved' },
    { icon: 'shopping-bag', label: 'Saved Products',  route: '/profile-saved-products' },
    { icon: 'credit-card',  label: 'Payment Methods', route: '/profile-payment' },
    { icon: 'bell',         label: 'Notifications',   route: '/profile-notifications' },
    { icon: 'star',         label: 'VIP Membership',  route: '/profile-vip' },
    { icon: 'settings',     label: 'Settings',        route: '/profile-settings' },
    { icon: 'help-circle',  label: 'Help & Support',  route: '/profile-help' },
  ];

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      {/* Header bar */}
      <View style={[s.headerBar, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Profile</Text>
        <TouchableOpacity
          style={[s.editIconBtn, { backgroundColor: tc.card, borderColor: tc.border }]}
          onPress={() => router.push('/profile-edit')}
          activeOpacity={0.8}
        >
          <Feather name="edit-2" size={15} color={vipGold} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        {/* Hero / Avatar section */}
        <View style={[s.heroSection, {
          backgroundColor: tc.isDark
            ? undefined
            : 'rgba(108,79,187,0.04)',
        }]}>
          <View style={s.avatarWrap}>
            <TouchableOpacity onPress={pickAvatar} activeOpacity={0.85} style={[s.avatarBorder, { borderColor: vipGold, shadowColor: vipGold }]}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={s.avatar} contentFit="cover" />
              ) : (
                <View style={[s.avatarFallback, { backgroundColor: tc.isDark ? '#1A1500' : tc.accent + '18' }]}>
                  <Text style={[s.avatarInitial, { color: vipGold, fontFamily: 'Poppins_900Black' }]}>
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.cameraBtn, { backgroundColor: vipGold }]}
              onPress={pickAvatar}
              activeOpacity={0.85}
            >
              <Feather name="camera" size={11} color={tc.isDark ? '#000' : '#fff'} />
            </TouchableOpacity>
          </View>

          <Text style={[s.heroName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{user?.name || 'VIP Member'}</Text>
          <Text style={[s.heroEmail, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            {user?.email || user?.phone || 'SA PLUG Member'}
          </Text>

          <View style={[s.vipPill, { borderColor: vipGold, backgroundColor: `${vipGold}12` }]}>
            <Feather name="award" size={12} color={vipGold} />
            <Text style={[s.vipPillTxt, { color: vipGold, fontFamily: 'Poppins_700Bold' }]}>VIP Member</Text>
          </View>

          <View style={s.starRow}>
            <Feather name="star" size={11} color={GOLD} />
            <Text style={[s.starTxt, { color: vipGold, fontFamily: 'Inter_400Regular' }]}>4.9 Top Member</Text>
          </View>
        </View>

        {/* VIP Membership card */}
        <View style={{ paddingHorizontal: 16, marginBottom: 14 }}>
          <View style={[s.vipCard, { borderColor: `${vipGold}44`, backgroundColor: tc.isDark ? `${GOLD}0E` : `${tc.accent}08` }]}>
            <View style={s.vipCardTop}>
              <View>
                <Text style={[s.vipStatusLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>MEMBERSHIP STATUS</Text>
                <Text style={[s.vipStatusValue, { color: vipGold, fontFamily: 'Poppins_700Bold' }]}>GOLD VIP{'\n'}MEMBER</Text>
              </View>
              <Feather name="award" size={24} color={vipGold} />
            </View>
            <View style={s.vipCardMid}>
              <Text style={[s.vipMidTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Member since 2022</Text>
              <Text style={[s.vipPoints, { color: vipGold, fontFamily: 'Poppins_700Bold' }]}>12,450 pts</Text>
            </View>
            <TouchableOpacity
              style={[s.upgradeBtn, { borderColor: vipGold }]}
              onPress={() => router.push('/profile-vip')}
              activeOpacity={0.85}
            >
              <Text style={[s.upgradeTxt, { color: vipGold, fontFamily: 'Poppins_700Bold' }]}>UPGRADE TO PLATINUM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats row — 3 separate cards */}
        <View style={s.statsRow}>
          {[
            { val: '47', label: 'Bookings', route: '/profile-bookings' },
            { val: '23', label: 'Reviews',  route: '/profile-reviews' },
            { val: '18', label: 'Saved',    route: '/profile-saved' },
          ].map(st => (
            <TouchableOpacity
              key={st.label}
              style={[s.statCard, { backgroundColor: tc.card, borderColor: tc.border }]}
              onPress={() => router.push(st.route as any)}
              activeOpacity={0.75}
            >
              <Text style={[s.statVal, { color: vipGold, fontFamily: 'Poppins_700Bold' }]}>{st.val}</Text>
              <Text style={[s.statLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{st.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu — individual bordered cards */}
        <View style={s.menuList}>
          {MENU.map(item => (
            <TouchableOpacity
              key={item.label}
              style={[s.menuCard, { backgroundColor: tc.card, borderColor: tc.border }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.75}
            >
              <Feather name={item.icon as any} size={18} color={vipGold} />
              <Text style={[s.menuLabel, { color: tc.text, fontFamily: 'Inter_400Regular', flex: 1 }]}>{item.label}</Text>
              <Feather name="chevron-right" size={16} color={tc.text3} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={[s.signOutBtn, { borderColor: 'rgba(239,68,68,0.35)', backgroundColor: 'rgba(239,68,68,0.05)' }]}
          onPress={() => router.replace('/(auth)/sign-in')}
          activeOpacity={0.85}
        >
          <Feather name="log-out" size={17} color="#EF4444" />
          <Text style={[s.signOutTxt, { fontFamily: 'Poppins_700Bold' }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[s.versionTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
          SA PLUG v1.0.0 · Made with ♥ in SA
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  editIconBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  heroSection: { paddingTop: 30, paddingBottom: 24, alignItems: 'center', overflow: 'hidden', position: 'relative', marginBottom: 4 },

  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatarBorder: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, overflow: 'hidden', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  avatar: { width: 90, height: 90 },
  avatarFallback: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 38 },
  cameraBtn: { position: 'absolute', bottom: 1, right: 1, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },

  heroName: { fontSize: 24, marginBottom: 5 },
  heroEmail: { fontSize: 12, marginBottom: 12, textAlign: 'center', paddingHorizontal: 24 },

  vipPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, marginBottom: 6 },
  vipPillTxt: { fontSize: 12 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  starTxt: { fontSize: 12 },

  vipCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  vipCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  vipStatusLabel: { fontSize: 10, letterSpacing: 0.5, marginBottom: 3 },
  vipStatusValue: { fontSize: 15 },
  vipCardMid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  vipMidTxt: { fontSize: 12 },
  vipPoints: { fontSize: 13 },
  upgradeBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  upgradeTxt: { fontSize: 12, letterSpacing: 0.5 },

  statsRow: { marginHorizontal: 16, flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: { flex: 1, borderRadius: 16, borderWidth: 1, alignItems: 'center', paddingVertical: 16 },
  statVal: { fontSize: 22, marginBottom: 2 },
  statLabel: { fontSize: 12 },

  menuList: { marginHorizontal: 16, gap: 8, marginBottom: 12 },
  menuCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  menuIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 14 },

  toggle: { width: 44, height: 24, borderRadius: 12, position: 'relative' },
  toggleThumb: { position: 'absolute', top: 3, width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff' },

  signOutBtn: { marginHorizontal: 16, borderWidth: 1, borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 },
  signOutTxt: { fontSize: 14, color: '#EF4444' },

  versionTxt: { textAlign: 'center', fontSize: 12, marginTop: 4, marginBottom: 8 },

  guestWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  guestIconWrap: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  guestTitle: { fontSize: 24, textAlign: 'center' },
  guestSub: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  guestBtnWrap: { width: '100%' },
  guestBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  guestBtnTxt: { fontSize: 15 },
  guestOutlineBtn: { width: '100%', borderWidth: 1.5, borderRadius: 16, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  guestOutlineTxt: { fontSize: 14 },
  backHomeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingVertical: 10, paddingHorizontal: 20 },
  backHomeTxt: { fontSize: 13 },
});
