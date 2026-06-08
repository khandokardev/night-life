import { useTC } from '@/hooks/useTheme';
import { type Notification, type NotifType, useNotifications } from '@/context/NotificationsContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<NotifType, { label: string; icon: string; tint: string }> = {
  promotion:   { label: 'Promotion',   icon: 'tag',        tint: '#D4AF37' },
  membership:  { label: 'Membership',  icon: 'award',      tint: '#D4AF37' },
  booking:     { label: 'Booking',     icon: 'calendar',   tint: '#22c55e' },
  order:       { label: 'Order',       icon: 'package',    tint: '#38bdf8' },
  event:       { label: 'Event',       icon: 'music',      tint: '#c084fc' },
  app_update:  { label: 'App Update',  icon: 'smartphone', tint: '#fb923c' },
  new_service: { label: 'New Service', icon: 'star',       tint: '#4ade80' },
  account:     { label: 'Account',     icon: 'shield',     tint: '#ef4444' },
};

type Filter = 'all' | 'unread' | 'booking' | 'promotion' | 'event';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'unread',    label: 'Unread' },
  { key: 'booking',   label: 'Bookings' },
  { key: 'promotion', label: 'Promos' },
  { key: 'event',     label: 'Events' },
];

const GROUP_ORDER = ['Today', 'Yesterday', 'This Week', 'Earlier'];

function fmtTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function getGroup(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return 'This Week';
  return 'Earlier';
}

// ─── Notification card ────────────────────────────────────────────────────────
function NotifCard({ notif, onPress }: { notif: Notification; onPress: () => void }) {
  const tc = useTC();
  const cfg = TYPE_CONFIG[notif.type];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[
        styles.card,
        { backgroundColor: notif.read ? tc.card : tc.card, borderColor: notif.read ? tc.border : `${cfg.tint}30` },
        !notif.read && { borderLeftWidth: 3, borderLeftColor: cfg.tint },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${cfg.tint}1A` }]}>
        <Feather name={cfg.icon as any} size={17} color={cfg.tint} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.cardTitle,
              { color: tc.text, fontFamily: notif.read ? 'Inter_500Medium' : 'Poppins_600SemiBold', flex: 1 },
            ]}
          >
            {notif.title}
          </Text>
          <Text style={[styles.timeText, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
            {fmtTime(notif.timestamp)}
          </Text>
        </View>
        <Text numberOfLines={2} style={[styles.cardBodyText, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
          {notif.body}
        </Text>
        <View style={[styles.typePill, { backgroundColor: `${cfg.tint}15` }]}>
          <Text style={[styles.typePillTxt, { color: cfg.tint, fontFamily: 'Inter_500Medium' }]}>
            {cfg.label}
          </Text>
        </View>
      </View>

      {!notif.read && (
        <View style={[styles.unreadDot, { backgroundColor: cfg.tint }]} />
      )}
    </TouchableOpacity>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ filter }: { filter: Filter }) {
  const tc = useTC();
  const messages: Record<Filter, { icon: string; title: string; sub: string }> = {
    all:       { icon: 'bell-off',  title: 'No notifications yet',   sub: 'When we have updates for you,\nthey\'ll appear here.' },
    unread:    { icon: 'check',     title: 'All caught up!',          sub: 'You\'ve read all your notifications.' },
    booking:   { icon: 'calendar',  title: 'No booking updates',      sub: 'Booking confirmations and reminders\nwill appear here.' },
    promotion: { icon: 'tag',       title: 'No promotions right now', sub: 'Exclusive offers and deals\nwill appear here.' },
    event:     { icon: 'music',     title: 'No event reminders',      sub: 'Event alerts for your saved venues\nwill appear here.' },
  };
  const m = messages[filter];

  return (
    <View style={styles.emptyWrap}>
      <View style={[styles.emptyIcon, { backgroundColor: tc.card, borderColor: tc.border }]}>
        <Feather name={m.icon as any} size={32} color={tc.text3} />
      </View>
      <Text style={[styles.emptyTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{m.title}</Text>
      <Text style={[styles.emptySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{m.sub}</Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function NotificationsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markAsRead, markAllRead, clearRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all')    return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  const groups = useMemo(() => {
    const map: Record<string, Notification[]> = {};
    filtered.forEach(n => {
      const g = getGroup(n.timestamp);
      if (!map[g]) map[g] = [];
      map[g].push(n);
    });
    return GROUP_ORDER.filter(g => map[g]).map(g => ({ title: g, data: map[g] }));
  }, [filtered]);

  const hasRead = notifications.some(n => n.read);

  const handlePress = (n: Notification) => {
    markAsRead(n.id);
    if (n.route) router.push(n.route as any);
  };

  const filterCount = (key: Filter) => {
    if (key === 'all')    return notifications.length;
    if (key === 'unread') return unreadCount;
    return notifications.filter(n => n.type === key).length;
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: tc.accent }]}>
              <Text style={[styles.unreadBadgeTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn} activeOpacity={0.7}>
            <Text style={[styles.markAllTxt, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 88 }} />
        )}
      </View>

      {/* ── Filter bar ── */}
      <View style={[styles.filterBarWrap, { backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map(f => {
            const count = filterCount(f.key);
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  active
                    ? { backgroundColor: tc.accent }
                    : { backgroundColor: tc.card, borderColor: tc.border, borderWidth: 1 },
                ]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterLabel,
                  { color: active ? (tc.isDark ? '#000' : '#fff') : tc.text2, fontFamily: 'Inter_500Medium' },
                ]}>
                  {f.label}
                </Text>
                {count > 0 && (
                  <View style={[
                    styles.filterCount,
                    { backgroundColor: active ? (tc.isDark ? '#00000030' : '#ffffff30') : `${tc.accent}20` },
                  ]}>
                    <Text style={[
                      styles.filterCountTxt,
                      { color: active ? (tc.isDark ? '#000' : '#fff') : tc.accent, fontFamily: 'Poppins_700Bold' },
                    ]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── List ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 30, paddingTop: 8 }}
      >
        {groups.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          groups.map(group => (
            <View key={group.title}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: tc.text3, fontFamily: 'Inter_500Medium' }]}>
                  {group.title}
                </Text>
                <View style={[styles.sectionLine, { backgroundColor: tc.border }]} />
              </View>
              {group.data.map(n => (
                <NotifCard key={n.id} notif={n} onPress={() => handlePress(n)} />
              ))}
            </View>
          ))
        )}

        {/* ── Footer actions ── */}
        {notifications.length > 0 && (
          <View style={styles.footerRow}>
            {hasRead && (
              <TouchableOpacity
                onPress={clearRead}
                style={[styles.footerBtn, { backgroundColor: tc.card, borderColor: tc.border }]}
                activeOpacity={0.8}
              >
                <Feather name="trash-2" size={14} color={tc.text3} />
                <Text style={[styles.footerBtnTxt, { color: tc.text3, fontFamily: 'Inter_500Medium' }]}>
                  Clear read
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={clearAll}
              style={[styles.footerBtn, { backgroundColor: '#ef444408', borderColor: '#ef444430' }]}
              activeOpacity={0.8}
            >
              <Feather name="x-circle" size={14} color="#ef4444" />
              <Text style={[styles.footerBtnTxt, { color: '#ef4444', fontFamily: 'Inter_500Medium' }]}>
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18 },
  unreadBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center',
  },
  unreadBadgeTxt: { fontSize: 10 },
  markAllBtn: { paddingVertical: 6, paddingLeft: 8 },
  markAllTxt: { fontSize: 13 },

  // Filter bar
  filterBarWrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  filterContent: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
  },
  filterLabel: { fontSize: 13 },
  filterCount: {
    minWidth: 18, height: 18, borderRadius: 9,
    paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center',
  },
  filterCountTxt: { fontSize: 10 },

  // Section headers
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6,
  },
  sectionTitle: { fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: StyleSheet.hairlineWidth },

  // Notification card
  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: 14, marginBottom: 8,
    padding: 14, borderRadius: 16,
    borderWidth: 1, gap: 12,
  },
  iconCircle: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  cardBody: { flex: 1, gap: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  cardTitle: { fontSize: 14, lineHeight: 19 },
  timeText: { fontSize: 11, marginTop: 2, flexShrink: 0 },
  cardBodyText: { fontSize: 13, lineHeight: 18 },
  typePill: {
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, marginTop: 2,
  },
  typePillTxt: { fontSize: 10, letterSpacing: 0.3 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    marginTop: 4, flexShrink: 0,
  },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40, gap: 14 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  emptyTitle: { fontSize: 18, textAlign: 'center' },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 21 },

  // Footer
  footerRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingTop: 16 },
  footerBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
  },
  footerBtnTxt: { fontSize: 13 },
});
