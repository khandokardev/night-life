import { useTC } from '@/hooks/useTheme';
import type { NotifPrefs } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Modal, StyleSheet, Switch, Text, TouchableOpacity, View,
} from 'react-native';

type Props = {
  visible: boolean;
  prefs: NotifPrefs;
  onSave: (next: NotifPrefs) => void;
  onClose: () => void;
};

const ROWS: { key: keyof NotifPrefs; icon: string; label: string; sub: string }[] = [
  { key: 'app',           icon: 'bell',     label: 'App Notifications',  sub: 'All in-app alerts and activity' },
  { key: 'promotions',    icon: 'tag',      label: 'Promotion Alerts',   sub: 'Deals, offers and marketing' },
  { key: 'bookingUpdates',icon: 'calendar', label: 'Booking Updates',    sub: 'Confirmations and reminders' },
];

export default function NotificationPrefsModal({ visible, prefs, onSave, onClose }: Props) {
  const tc = useTC();
  const [local, setLocal] = useState<NotifPrefs>(prefs);

  useEffect(() => { if (visible) setLocal(prefs); }, [visible, prefs]);

  const toggle = (key: keyof NotifPrefs) =>
    setLocal(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => { onSave(local); onClose(); };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={[styles.card, { backgroundColor: tc.card, borderColor: tc.border }]}>

            {/* Header */}
            <View style={styles.headerRow}>
              <View style={[styles.iconBadge, { backgroundColor: tc.accent + '18' }]}>
                <Feather name="bell" size={20} color={tc.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Notification Settings</Text>
                <Text style={[styles.subtitle, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Choose what you want to hear about</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: tc.inputBg }]}>
                <Feather name="x" size={16} color={tc.text2} />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: tc.border }]} />

            {/* Toggle rows */}
            <View style={styles.rows}>
              {ROWS.map(({ key, icon, label, sub }) => (
                <View key={key} style={[styles.row, { borderColor: tc.border }]}>
                  <View style={[styles.rowIcon, { backgroundColor: local[key] ? tc.accent + '15' : tc.inputBg }]}>
                    <Feather name={icon as any} size={17} color={local[key] ? tc.accent : tc.text3} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{label}</Text>
                    <Text style={[styles.rowSub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{sub}</Text>
                  </View>
                  <Switch
                    value={local[key]}
                    onValueChange={() => toggle(key)}
                    trackColor={{
                      false: tc.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
                      true:  tc.accent + '70',
                    }}
                    thumbColor={local[key] ? tc.accent : tc.isDark ? '#555' : '#ccc'}
                  />
                </View>
              ))}
            </View>

            {/* Master switch note */}
            {!local.app && (
              <View style={[styles.noteBanner, { backgroundColor: tc.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderColor: tc.border }]}>
                <Feather name="info" size={13} color={tc.text3} />
                <Text style={[styles.noteTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
                  App Notifications are off — all alerts are muted
                </Text>
              </View>
            )}

            {/* Save */}
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn} activeOpacity={0.88}>
              <LinearGradient
                colors={tc.accentGradColors}
                style={styles.saveBtnGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.saveTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                  Save Preferences
                </Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.80)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 18 },
  iconBadge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, marginBottom: 2 },
  subtitle: { fontSize: 12, lineHeight: 17 },
  closeBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 16 },
  rows: { gap: 10, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  rowIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 13, marginBottom: 1 },
  rowSub: { fontSize: 11, lineHeight: 15 },
  noteBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, borderWidth: 1, padding: 10, marginBottom: 14 },
  noteTxt: { flex: 1, fontSize: 11, lineHeight: 15 },
  saveBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  saveBtnGrad: { paddingVertical: 15, alignItems: 'center', borderRadius: 14 },
  saveTxt: { fontSize: 14, letterSpacing: 0.3 },
});
