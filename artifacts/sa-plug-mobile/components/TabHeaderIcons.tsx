import { useApp } from '@/context/AppContext';
import { useNotifications } from '@/context/NotificationsContext';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTC } from '@/hooks/useTheme';

export default function TabHeaderIcons() {
  const tc = useTC();
  const { cartCount, user } = useApp();
  const { unreadCount } = useNotifications();

  return (
    <View style={s.row}>
      <TouchableOpacity style={[s.btn, { backgroundColor: tc.card }]} onPress={() => router.push('/search')} activeOpacity={0.8}>
        <Feather name="search" size={17} color={tc.text} />
      </TouchableOpacity>

      <TouchableOpacity style={[s.btn, { backgroundColor: tc.card }]} onPress={() => router.push('/notifications')} activeOpacity={0.8}>
        <Feather name="bell" size={17} color={tc.text} />
        {unreadCount > 0 && (
          <View style={[s.badge, { backgroundColor: '#EF4444' }]}>
            <Text style={[s.badgeTxt, { color: '#fff' }]}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[s.btn, { backgroundColor: tc.card }]} onPress={() => router.push('/cart')} activeOpacity={0.8}>
        <Feather name="shopping-cart" size={19} color={tc.text} />
        {cartCount > 0 && (
          <View style={[s.badge, { backgroundColor: tc.accent }]}>
            <Text style={[s.badgeTxt, { color: tc.isDark ? '#000' : '#fff' }]}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.avatar, { backgroundColor: `${tc.accent}20`, borderColor: tc.accent }]}
        onPress={() => router.push('/profile')}
        activeOpacity={0.8}
      >
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={s.avatarImg} contentFit="cover" />
        ) : (
          <Feather name="user" size={16} color={tc.accent} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: {
    position: 'absolute', top: -3, right: -3,
    minWidth: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeTxt: { fontSize: 8, fontWeight: '700' },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, overflow: 'hidden' },
  avatarImg: { width: 34, height: 34 },
});
