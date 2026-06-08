import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import NotificationPrefsModal from '@/components/NotificationPrefsModal';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Switch, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const ITEMS = [
  { key: 'bookings' as const, label: 'Booking Confirmations', sub: 'Get notified about your reservations', icon: 'calendar' },
  { key: 'deals'    as const, label: 'Flash Deals & Offers',  sub: 'Never miss a limited-time deal',      icon: 'zap' },
  { key: 'events'   as const, label: 'Upcoming Events',       sub: 'Events happening near you',            icon: 'map-pin' },
  { key: 'messages' as const, label: 'Messages',              sub: 'SA PLUG and venue messages',           icon: 'message-circle' },
  { key: 'promo'    as const, label: 'Promotions',            sub: 'Marketing and promotional content',    icon: 'tag' },
  { key: 'vip'      as const, label: 'VIP Alerts',            sub: 'Exclusive member-only notifications',  icon: 'star' },
] as const;

type LocalKey = 'bookings' | 'deals' | 'events' | 'messages' | 'promo' | 'vip';

export default function ProfileNotificationsScreen() {
  const tc     = useTC();
  const insets = useSafeAreaInsets();
  const { notifPrefs, updateNotifPrefs } = useApp();

  const [local, setLocal] = useState<Record<LocalKey, boolean>>({
    bookings: true, deals: true, events: true, messages: true, promo: false, vip: true,
  });
  const [showPrefsModal, setShowPrefsModal] = useState(false);

  const toggleLocal = (key: LocalKey) =>
    setLocal(prev => ({ ...prev, [key]: !prev[key] }));

  const allOn  = notifPrefs.app && notifPrefs.promotions && notifPrefs.bookingUpdates;
  const anyOff = !notifPrefs.app || !notifPrefs.promotions || !notifPrefs.bookingUpdates;

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Notifications</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30, gap: 10 }}>

        {/* Preference summary card */}
        <TouchableOpacity
          onPress={() => setShowPrefsModal(true)}
          style={[styles.prefCard, { backgroundColor: tc.card, borderColor: tc.border }]}
          activeOpacity={0.85}
        >
          <View style={[styles.prefIconWrap, { backgroundColor: tc.accent + '18' }]}>
            <Feather name="sliders" size={20} color={tc.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.prefTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Notification Preferences</Text>
            <Text style={[styles.prefSub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
              {allOn ? 'All channels enabled' : anyOff ? 'Some channels disabled' : 'Configured'}
            </Text>
          </View>
          <View style={styles.prefPills}>
            {notifPrefs.app           && <View style={[styles.pill, { backgroundColor: tc.accent + '20' }]}><Text style={[styles.pillTxt, { color: tc.accent }]}>App</Text></View>}
            {notifPrefs.promotions    && <View style={[styles.pill, { backgroundColor: tc.accent + '20' }]}><Text style={[styles.pillTxt, { color: tc.accent }]}>Promo</Text></View>}
            {notifPrefs.bookingUpdates && <View style={[styles.pill, { backgroundColor: tc.accent + '20' }]}><Text style={[styles.pillTxt, { color: tc.accent }]}>Bookings</Text></View>}
          </View>
          <Feather name="chevron-right" size={18} color={tc.text3} />
        </TouchableOpacity>

        {/* Edit Preferences button */}
        <TouchableOpacity onPress={() => setShowPrefsModal(true)} style={styles.editBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={tc.accentGradColors}
            style={styles.editBtnGrad}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Feather name="bell" size={16} color={tc.isDark ? '#000' : '#fff'} />
            <Text style={[styles.editBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
              Edit Notification Preferences
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Per-channel switches */}
        <Text style={[styles.sectionHead, { color: tc.text3, fontFamily: 'Poppins_700Bold' }]}>CHANNEL SETTINGS</Text>
        {ITEMS.map(({ key, label, sub, icon }) => (
          <View key={key} style={[styles.item, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <View style={[styles.iconWrap, { backgroundColor: local[key] ? tc.accent + '12' : tc.inputBg }]}>
              <Feather name={icon as any} size={18} color={local[key] ? tc.accent : tc.text3} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{label}</Text>
              <Text style={[styles.itemSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{sub}</Text>
            </View>
            <Switch
              value={local[key]}
              onValueChange={() => toggleLocal(key)}
              trackColor={{
                false: tc.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                true:  tc.accent + '80',
              }}
              thumbColor={local[key] ? tc.accent : tc.isDark ? '#555' : '#ccc'}
            />
          </View>
        ))}
      </ScrollView>

      <NotificationPrefsModal
        visible={showPrefsModal}
        prefs={notifPrefs}
        onSave={updateNotifPrefs}
        onClose={() => setShowPrefsModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },

  prefCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  prefIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  prefTitle: { fontSize: 14, marginBottom: 2 },
  prefSub: { fontSize: 11 },
  prefPills: { flexDirection: 'row', gap: 4, flexShrink: 1, flexWrap: 'wrap' },
  pill: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  pillTxt: { fontSize: 10, fontFamily: 'Inter_500Medium' },

  editBtn: { borderRadius: 14, overflow: 'hidden' },
  editBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  editBtnTxt: { fontSize: 14 },

  sectionHead: { fontSize: 11, letterSpacing: 1, marginTop: 4, marginBottom: 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemLabel: { fontSize: 14, marginBottom: 2 },
  itemSub: { fontSize: 12 },
});
