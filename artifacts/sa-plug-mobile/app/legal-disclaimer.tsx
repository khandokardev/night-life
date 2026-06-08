import { DISCLAIMER } from '@/constants/legalContent';
import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

export default function LegalDisclaimerScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{DISCLAIMER.title}</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        <Text style={[styles.date, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{DISCLAIMER.date}</Text>
        <View style={[styles.noticeBanner, { backgroundColor: tc.accent + '08', borderColor: tc.accent + '28' }]}>
          <Feather name="info" size={16} color={tc.accent} />
          <Text style={[styles.noticeText, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            SA Plug operates as a booking and lifestyle platform connecting users with independent venue partners and experience operators across South Africa.
          </Text>
        </View>
        <Text style={[styles.intro, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{DISCLAIMER.intro}</Text>
        {DISCLAIMER.sections.map((sec, i) => (
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
  date: { fontSize: 12, marginBottom: 12 },
  noticeBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 14 },
  noticeText: { fontSize: 12, lineHeight: 18, flex: 1 },
  intro: { fontSize: 13, lineHeight: 22, marginBottom: 20 },
  section: { marginBottom: 20 },
  heading: { fontSize: 14, marginBottom: 6 },
  body: { fontSize: 13, lineHeight: 22 },
});
