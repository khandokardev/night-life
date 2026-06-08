import { REFUND } from '@/constants/legalContent';
import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const TIERS = [
  { label: '12h+ before booking', refund: '80%', fee: '20%', color: '#22c55e' },
  { label: 'Within 12h of booking', refund: '0%', fee: '100%', color: '#f59e0b' },
  { label: 'No-show', refund: '0%', fee: '100%', color: '#ef4444' },
];

export default function LegalRefundScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{REFUND.title}</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        <Text style={[styles.date, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{REFUND.date}</Text>
        <Text style={[styles.intro, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{REFUND.intro}</Text>

        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Cancellation At a Glance</Text>
        <View style={{ gap: 8, marginBottom: 22 }}>
          {TIERS.map((t, i) => (
            <View key={i} style={[styles.tierCard, { backgroundColor: t.color + '10', borderColor: t.color + '30' }]}>
              <Text style={[styles.tierLabel, { color: t.color, fontFamily: 'Poppins_700Bold' }]}>{t.label}</Text>
              <View style={styles.tierRow}>
                <Text style={[styles.tierKey, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Refund: </Text>
                <Text style={[styles.tierVal, { color: t.color, fontFamily: 'Poppins_700Bold' }]}>{t.refund}</Text>
                <Text style={[styles.tierKey, { color: tc.text2, fontFamily: 'Inter_400Regular', marginLeft: 16 }]}>Fee: </Text>
                <Text style={[styles.tierVal, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{t.fee}</Text>
              </View>
            </View>
          ))}
        </View>

        {REFUND.sections.map((sec, i) => (
          <View key={i} style={styles.section}>
            <Text style={[styles.heading, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{sec.heading}</Text>
            <Text style={[styles.body, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{sec.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  title: { fontSize: 16 },
  date: { fontSize: 12, marginBottom: 10 },
  intro: { fontSize: 13, lineHeight: 22, marginBottom: 20 },
  sectionTitle: { fontSize: 14, marginBottom: 10 },
  tierCard: { borderRadius: 12, padding: 14, borderWidth: 1 },
  tierLabel: { fontSize: 14, marginBottom: 6 },
  tierRow: { flexDirection: 'row', alignItems: 'center' },
  tierKey: { fontSize: 13 },
  tierVal: { fontSize: 14 },
  section: { marginBottom: 20 },
  heading: { fontSize: 14, marginBottom: 6 },
  body: { fontSize: 13, lineHeight: 22 },
});
