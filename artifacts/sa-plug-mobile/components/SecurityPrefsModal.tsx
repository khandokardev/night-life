import { useTC } from '@/hooks/useTheme';
import type { SecurityPrefs } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Modal, StyleSheet, Switch, Text, TouchableOpacity, View,
} from 'react-native';

type Props = {
  visible: boolean;
  prefs: SecurityPrefs;
  onSave: (next: SecurityPrefs) => void;
  onClose: () => void;
};

const ROWS: { key: keyof SecurityPrefs; icon: string; label: string; sub: string; warn?: string }[] = [
  {
    key: 'savePassword',
    icon: 'key',
    label: 'Save Password',
    sub: 'Store credentials for faster sign-in on this device',
    warn: 'Only enable on trusted personal devices',
  },
  {
    key: 'rememberDevice',
    icon: 'smartphone',
    label: 'Remember This Device',
    sub: 'Skip verification steps on future logins from here',
  },
];

export default function SecurityPrefsModal({ visible, prefs, onSave, onClose }: Props) {
  const tc = useTC();
  const [local, setLocal] = useState<SecurityPrefs>(prefs);

  useEffect(() => { if (visible) setLocal(prefs); }, [visible, prefs]);

  const toggle = (key: keyof SecurityPrefs) =>
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
                <Feather name="shield" size={20} color={tc.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Login & Security</Text>
                <Text style={[styles.subtitle, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Manage how you sign in on this device</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: tc.inputBg }]}>
                <Feather name="x" size={16} color={tc.text2} />
              </TouchableOpacity>
            </View>

            <View style={[styles.divider, { backgroundColor: tc.border }]} />

            {/* Toggle rows */}
            <View style={styles.rows}>
              {ROWS.map(({ key, icon, label, sub, warn }) => (
                <View key={key} style={[styles.rowWrap, { borderColor: tc.border, backgroundColor: tc.inputBg }]}>
                  <View style={styles.rowTop}>
                    <View style={[styles.rowIcon, { backgroundColor: local[key] ? tc.accent + '15' : tc.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
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
                  {warn && local[key] && (
                    <View style={[styles.warnRow, { borderTopColor: tc.border }]}>
                      <Feather name="alert-triangle" size={11} color="#F59E0B" />
                      <Text style={[styles.warnTxt, { fontFamily: 'Inter_400Regular' }]}>{warn}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Trust note */}
            <View style={[styles.trustBanner, { backgroundColor: tc.accent + '0D', borderColor: tc.accent + '25' }]}>
              <Feather name="lock" size={13} color={tc.accent} />
              <Text style={[styles.trustTxt, { color: tc.accent, fontFamily: 'Inter_400Regular' }]}>
                Your credentials are stored encrypted on this device only
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={onClose} style={[styles.cancelBtn, { borderColor: tc.border, backgroundColor: tc.inputBg }]} activeOpacity={0.8}>
                <Text style={[styles.cancelTxt, { color: tc.text2, fontFamily: 'Poppins_600SemiBold' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn} activeOpacity={0.88}>
                <LinearGradient
                  colors={tc.accentGradColors}
                  style={styles.saveBtnGrad}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.saveTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

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
  rowWrap: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rowIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 13, marginBottom: 1 },
  rowSub: { fontSize: 11, lineHeight: 15 },
  warnRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth },
  warnTxt: { fontSize: 11, color: '#F59E0B', flex: 1, lineHeight: 15 },
  trustBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, borderWidth: 1, padding: 10, marginBottom: 16 },
  trustTxt: { flex: 1, fontSize: 11, lineHeight: 15 },
  btnRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  cancelTxt: { fontSize: 13 },
  saveBtn: { flex: 1.4, borderRadius: 14, overflow: 'hidden' },
  saveBtnGrad: { paddingVertical: 14, alignItems: 'center', borderRadius: 14 },
  saveTxt: { fontSize: 14, letterSpacing: 0.3 },
});
