import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const FILTER_TABS = ['All', 'Live', 'VIP', 'Upcoming'];

const ALL_EVENTS = [
  { id: 1,  date: '24', month: 'MAY', day: 'Sat', name: 'Neon Nights',          venue: 'ONYX Sandton',    live: true,  time: '9:00 PM', price: 'R150', genre: 'Amapiano'  },
  { id: 2,  date: '25', month: 'MAY', day: 'Sun', name: 'Sunset Beats',          venue: 'Zone 6 Venue',   live: true,  time: '8:30 PM', price: 'R120', genre: 'Afrobeats' },
  { id: 3,  date: '31', month: 'MAY', day: 'Sat', name: 'Friday Lights',         venue: 'Coco Sandton',   live: true,  time: '9:00 PM', price: 'R100', genre: 'Hip Hop'   },
  { id: 4,  date: '01', month: 'JUN', day: 'Sun', name: 'The Society',           venue: 'TBA',             live: false, time: '10:00 PM', price: 'R200', genre: 'R&B'      },
  { id: 5,  date: '07', month: 'JUN', day: 'Sat', name: 'Rooftop Takeover',      venue: 'Status Nightclub',live: false, time: '9:30 PM', price: 'R180', genre: 'EDM'      },
  { id: 6,  date: '14', month: 'JUN', day: 'Sat', name: 'VIP Sundays',           venue: 'ICON Soweto',    live: false, time: '8:00 PM', price: 'R250', genre: 'Amapiano'  },
  { id: 7,  date: '21', month: 'JUN', day: 'Sat', name: 'Luxe Fridays Rosebank', venue: 'Kong Rosebank',  live: false, time: '9:00 PM', price: 'R150', genre: 'Afrobeats' },
  { id: 8,  date: '28', month: 'JUN', day: 'Sat', name: 'Gqom Wave',             venue: 'Zone 6 Venue',   live: false, time: '10:30 PM', price: 'R100', genre: 'Gqom'     },
];

const GENRE_COLOR: Record<string, string> = {
  Amapiano: GOLD,
  Afrobeats: '#E08060',
  'Hip Hop': '#aaa',
  EDM: '#40C090',
  Gqom: '#50A0DC',
  'R&B': '#B070E0',
};

export default function EventsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');

  const filtered = ALL_EVENTS.filter(ev => {
    if (filter === 'Live') return ev.live;
    if (filter === 'VIP') return !ev.live;
    if (filter === 'Upcoming') return !ev.live;
    return true;
  });

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Feather name="chevron-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Upcoming Events</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Filter chips */}
      <View style={[s.filterRow, { borderBottomColor: tc.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
          {FILTER_TABS.map(tab => {
            const active = filter === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[s.chip, {
                  backgroundColor: active ? tc.accent : tc.card,
                  borderColor: active ? tc.accent : tc.border2,
                }]}
                onPress={() => setFilter(tab)}
                activeOpacity={0.75}
              >
                <Text style={[s.chipTxt, {
                  color: active ? (tc.isDark ? '#000' : '#fff') : tc.text2,
                  fontFamily: active ? 'Poppins_600SemiBold' : 'Inter_400Regular',
                }]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Event count */}
      <View style={s.countRow}>
        <Text style={[s.countTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 24 }]}
      >
        {filtered.map(ev => {
          const genreColor = GENRE_COLOR[ev.genre] ?? tc.accent;
          return (
            <TouchableOpacity
              key={ev.id}
              style={[s.card, { backgroundColor: tc.card, borderColor: tc.border }]}
              onPress={() => router.push({ pathname: '/club-detail', params: { id: String(ev.id), name: ev.venue } })}
              activeOpacity={0.85}
            >
              {/* Date column */}
              <View style={[s.dateCol, { borderRightColor: tc.border2 }]}>
                <Text style={[s.dateMon, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>{ev.month}</Text>
                <Text style={[s.dateNum, { color: tc.text, fontFamily: 'Poppins_900Black' }]}>{ev.date}</Text>
                <Text style={[s.dateDay, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{ev.day}</Text>
              </View>

              {/* Main info */}
              <View style={s.info}>
                <View style={s.topRow}>
                  <Text style={[s.eventName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]} numberOfLines={1}>
                    {ev.name}
                  </Text>
                  <View style={[s.liveBadge, {
                    backgroundColor: ev.live ? 'rgba(239,68,68,0.15)' : `${tc.accent}22`,
                    borderColor: ev.live ? 'rgba(239,68,68,0.35)' : `${tc.accent}55`,
                  }]}>
                    {ev.live && <View style={s.liveDot} />}
                    <Text style={[s.liveTxt, {
                      color: ev.live ? '#f87171' : tc.accent,
                      fontFamily: 'Poppins_700Bold',
                    }]}>
                      {ev.live ? 'LIVE' : 'VIP'}
                    </Text>
                  </View>
                </View>

                <View style={s.metaRow}>
                  <Feather name="map-pin" size={11} color={tc.text3} />
                  <Text style={[s.venue, { color: tc.text2, fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>
                    {ev.venue}
                  </Text>
                </View>

                <View style={s.bottomRow}>
                  <View style={s.timeRow}>
                    <Feather name="clock" size={11} color={tc.text3} />
                    <Text style={[s.timeTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{ev.time}</Text>
                  </View>
                  <View style={[s.genreTag, { backgroundColor: `${genreColor}18` }]}>
                    <Text style={[s.genreTxt, { color: genreColor, fontFamily: 'Inter_500Medium' }]}>{ev.genre}</Text>
                  </View>
                  <Text style={[s.price, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>{ev.price}</Text>
                </View>
              </View>

              {/* Chevron */}
              <Feather name="chevron-right" size={16} color={tc.text3} style={s.chevron} />
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={s.empty}>
            <Feather name="calendar" size={48} color={tc.text3} />
            <Text style={[s.emptyTxt, { color: tc.text2, fontFamily: 'Poppins_600SemiBold' }]}>No events found</Text>
            <Text style={[s.emptySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Try a different filter</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    letterSpacing: 0.2,
  },
  filterRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipTxt: { fontSize: 13 },
  countRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  countTxt: { fontSize: 12, letterSpacing: 0.2 },
  list: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  dateCol: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRightWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  dateMon: { fontSize: 10, letterSpacing: 1 },
  dateNum: { fontSize: 28, lineHeight: 32 },
  dateDay: { fontSize: 10 },
  info: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  eventName: { fontSize: 15, flex: 1 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  liveDot: {
    width: 5, height: 5,
    borderRadius: 3,
    backgroundColor: '#f87171',
  },
  liveTxt: { fontSize: 9, letterSpacing: 0.8 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  venue: { fontSize: 12, flex: 1 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeTxt: { fontSize: 11 },
  genreTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  genreTxt: { fontSize: 10 },
  price: { marginLeft: 'auto', fontSize: 13 },
  chevron: { marginRight: 12 },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyTxt: { fontSize: 16 },
  emptySub: { fontSize: 13 },
});
