import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Switch, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const ITEMS = [
  { key: 'profileVisible', label: 'Profile Visibility', sub: 'Allow others to find your profile' },
  { key: 'activityStatus', label: 'Activity Status', sub: 'Show when you\'re active' },
  { key: 'locationSharing', label: 'Location Sharing', sub: 'Share location for venue discovery' },
  { key: 'dataAnalytics', label: 'Usage Analytics', sub: 'Help improve the app experience' },
  { key: 'marketingEmails', label: 'Marketing Emails', sub: 'Receive promotional content' },
  { key: 'thirdPartySharing', label: 'Third Party Data Sharing', sub: 'Share data with partner venues' },
] as const;

export default function ProfilePrivacyScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    profileVisible: true,
    activityStatus: true,
    locationSharing: false,
    dataAnalytics: true,
    marketingEmails: false,
    thirdPartySharing: false,
  });

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Privacy Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        <View style={[styles.popiaCard, { backgroundColor: tc.accent + '08', borderColor: tc.accent + '28' }]}>
          <Feather name="shield" size={18} color={tc.accent} style={{ flexShrink: 0 }} />
          <Text style={[styles.popiaTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            SA PLUG processes your data in accordance with{' '}
            <Text style={{ color: tc.accent, fontFamily: 'Poppins_600SemiBold' }}>POPIA</Text>
            {' '}regulations. You control what you share.
          </Text>
        </View>

        <View style={{ gap: 10, marginBottom: 16 }}>
          {ITEMS.map(({ key, label, sub }) => (
            <View key={key} style={[styles.item, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{label}</Text>
                <Text style={[styles.itemSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{sub}</Text>
              </View>
              <Switch
                value={settings[key]}
                onValueChange={v => setSettings(prev => ({ ...prev, [key]: v }))}
                trackColor={{ false: tc.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', true: tc.accent + '80' }}
                thumbColor={settings[key] ? tc.accent : '#fff'}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/legal-privacy')}
          style={[styles.linkRow, { backgroundColor: tc.card, borderColor: tc.border }]}
          activeOpacity={0.8}
        >
          <Feather name="shield" size={16} color={tc.accent} />
          <Text style={[styles.linkLabel, { color: tc.text, fontFamily: 'Inter_500Medium', flex: 1 }]}>Privacy Policy</Text>
          <Feather name="chevron-right" size={16} color={tc.text3} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.deleteDataBtn]} activeOpacity={0.8}>
          <Text style={[styles.deleteDataTxt, { fontFamily: 'Poppins_600SemiBold' }]}>Delete My Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  popiaCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 16 },
  popiaTxt: { fontSize: 13, lineHeight: 20, flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1 },
  itemLabel: { fontSize: 14, marginBottom: 2 },
  itemSub: { fontSize: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, marginBottom: 10 },
  linkLabel: { fontSize: 14 },
  deleteDataBtn: { paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.05)', alignItems: 'center' },
  deleteDataTxt: { color: '#ef4444', fontSize: 14 },
});
