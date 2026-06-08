import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const BOOKINGS = [
  { id: 1, venue: 'ONYX SANDTON',    date: '24 May 2026 · 10PM', status: 'CONFIRMED', color: '#22c55e' },
  { id: 2, venue: 'Helicopter Tour', date: '25 May 2026 · 9AM',  status: 'CONFIRMED', color: '#22c55e' },
  { id: 3, venue: 'COCO SANDTON',    date: '31 May 2026 · 11PM', status: 'PENDING',   color: '#f59e0b' },
  { id: 4, venue: 'Safari Experience',date: '15 Jun 2026 · 6AM', status: 'UPCOMING',  color: '#3b82f6' },
  { id: 5, venue: 'Marble Restaurant',date: '20 Jun 2026 · 7PM', status: 'UPCOMING',  color: '#3b82f6' },
];

export default function ProfileBookingsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>My Bookings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30, gap: 10 }}>
        {BOOKINGS.map((b, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => router.push({ pathname: '/booking-detail', params: { id: String(b.id), venue: b.venue, date: b.date, status: b.status } })}
            style={[styles.card, { backgroundColor: tc.card, borderColor: tc.border }]}
            activeOpacity={0.88}
          >
            <View style={[styles.iconWrap, { backgroundColor: b.color + '20' }]}>
              <Feather name="calendar" size={18} color={b.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.venueName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{b.venue}</Text>
              <Text style={[styles.dateTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{b.date}</Text>
            </View>
            <View style={styles.right}>
              <View style={[styles.statusBadge, { backgroundColor: b.color + '20' }]}>
                <Text style={[styles.statusTxt, { color: b.color, fontFamily: 'Poppins_600SemiBold' }]}>{b.status}</Text>
              </View>
              <Feather name="grid" size={16} color={tc.text3} style={{ marginTop: 6, alignSelf: 'center' }} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  venueName: { fontSize: 14, marginBottom: 2 },
  dateTxt: { fontSize: 12 },
  right: { alignItems: 'flex-end' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusTxt: { fontSize: 10 },
});
