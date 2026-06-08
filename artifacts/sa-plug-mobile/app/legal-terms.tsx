import { TERMS } from '@/constants/legalContent';
import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

export default function LegalTermsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{TERMS.title}</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        <Text style={[styles.date, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{TERMS.date}</Text>
        <Text style={[styles.intro, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{TERMS.intro}</Text>
        {TERMS.sections.map((sec, i) => (
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
  section: { marginBottom: 20 },
  heading: { fontSize: 14, marginBottom: 6 },
  body: { fontSize: 13, lineHeight: 22 },
});
