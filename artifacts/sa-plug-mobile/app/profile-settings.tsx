import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import SecurityPrefsModal from '@/components/SecurityPrefsModal';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal, Platform, ScrollView, StyleSheet, Switch, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const LANGS = [
  { code: 'en', label: 'English', flag: '🇿🇦', native: 'English' },
  { code: 'zu', label: 'Zulu', flag: '🇿🇦', native: 'isiZulu' },
  { code: 'xh', label: 'Xhosa', flag: '🇿🇦', native: 'isiXhosa' },
  { code: 'af', label: 'Afrikaans', flag: '🇿🇦', native: 'Afrikaans' },
  { code: 'st', label: 'Sotho', flag: '🇿🇦', native: 'Sesotho' },
];

export default function ProfileSettingsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme, securityPrefs, updateSecurityPrefs } = useApp();
  const [lang, setLang] = useState('en');
  const [showLang, setShowLang] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'password' | 'confirm'>('password');
  const [deletePw, setDeletePw] = useState('');
  const [showPw, setShowPw] = useState(false);

  const currentLang = LANGS.find(l => l.code === lang) || LANGS[0];

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30, gap: 10 }}>
        <View style={[styles.row, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <Feather name={theme === 'dark' ? 'moon' : 'sun'} size={18} color={tc.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Appearance</Text>
            <Text style={[styles.rowSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Text>
          </View>
          <Switch
            value={theme === 'light'}
            onValueChange={toggleTheme}
            trackColor={{ false: tc.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', true: tc.accent + '80' }}
            thumbColor={theme === 'light' ? tc.accent : '#fff'}
          />
        </View>

        <View style={[styles.langWrap, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <TouchableOpacity onPress={() => setShowLang(s => !s)} style={styles.langRow} activeOpacity={0.8}>
            <Feather name="globe" size={18} color={tc.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Language</Text>
              <Text style={[styles.rowSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{currentLang.flag} {currentLang.label}</Text>
            </View>
            <Feather name={showLang ? 'chevron-up' : 'chevron-down'} size={16} color={tc.text2} />
          </TouchableOpacity>
          {showLang && (
            <View style={[styles.langList, { borderTopColor: tc.border }]}>
              {LANGS.map(l => (
                <TouchableOpacity
                  key={l.code}
                  onPress={() => { setLang(l.code); setShowLang(false); }}
                  style={[styles.langOption, { backgroundColor: lang === l.code ? tc.accent + '12' : 'transparent', borderBottomColor: tc.border }]}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 18 }}>{l.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.langLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{l.label}</Text>
                    <Text style={[styles.langNative, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{l.native}</Text>
                  </View>
                  {lang === l.code && <Feather name="check" size={14} color={tc.accent} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={[styles.sectionHead, { color: tc.text3, fontFamily: 'Poppins_700Bold' }]}>ACCOUNT</Text>

        {/* Login & Security row — opens popup */}
        <TouchableOpacity
          onPress={() => setShowSecurity(true)}
          style={[styles.row, { backgroundColor: tc.card, borderColor: tc.border }]}
          activeOpacity={0.8}
        >
          <Feather name="shield" size={16} color={tc.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Login & Security</Text>
            <Text style={[styles.rowSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
              {securityPrefs.rememberDevice || securityPrefs.savePassword
                ? 'Configured — tap to review'
                : 'Save password, remember device'}
            </Text>
          </View>
          <View style={styles.secStatus}>
            {securityPrefs.savePassword   && <View style={[styles.secDot, { backgroundColor: tc.accent }]} />}
            {securityPrefs.rememberDevice && <View style={[styles.secDot, { backgroundColor: tc.accent }]} />}
          </View>
          <Feather name="chevron-right" size={16} color={tc.text3} />
        </TouchableOpacity>

        {[
          { label: 'Edit Profile', sub: 'Name, photo, bio', icon: 'user', route: '/profile-edit' },
          { label: 'Change Password', sub: 'Update your password', icon: 'key', route: '/profile-password' },
          { label: 'Privacy Settings', sub: 'Data and visibility', icon: 'shield', route: '/profile-privacy' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => router.push(item.route as any)}
            style={[styles.row, { backgroundColor: tc.card, borderColor: tc.border }]}
            activeOpacity={0.8}
          >
            <Feather name={item.icon as any} size={16} color={tc.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{item.label}</Text>
              <Text style={[styles.rowSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{item.sub}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={tc.text3} />
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionHead, { color: tc.text3, fontFamily: 'Poppins_700Bold' }]}>ABOUT</Text>
        <View style={[styles.aboutCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutKey, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>App Version</Text>
            <Text style={[styles.aboutVal, { color: tc.text, fontFamily: 'Inter_500Medium' }]}>SA PLUG v1.0.0</Text>
          </View>
          <View style={[styles.aboutDivider, { backgroundColor: tc.border }]} />
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutKey, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Platform</Text>
            <Text style={[styles.aboutVal, { color: tc.text, fontFamily: 'Inter_500Medium' }]}>iOS &amp; Android</Text>
          </View>
          <View style={[styles.aboutDivider, { backgroundColor: tc.border }]} />
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutKey, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Developed by</Text>
            <Text style={[styles.aboutVal, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>Rtm Core</Text>
          </View>
          <View style={[styles.aboutDivider, { backgroundColor: tc.border }]} />
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutKey, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Website</Text>
            <Text style={[styles.aboutVal, { color: tc.accent, fontFamily: 'Inter_500Medium' }]}>rtmcore.com</Text>
          </View>
        </View>

        <Text style={[styles.sectionHead, { color: tc.text3, fontFamily: 'Poppins_700Bold' }]}>LEGAL</Text>
        {[
          { label: 'Terms & Conditions', sub: 'App usage rules & policies', route: '/legal-terms' },
          { label: 'Privacy Policy', sub: 'How we handle your data (POPIA)', route: '/legal-privacy' },
          { label: 'Refund Policy', sub: 'Cancellations and refunds', route: '/legal-refund' },
          { label: 'Payment Terms', sub: 'Accepted methods & disputes', route: '/legal-payment' },
          { label: 'Partner Disclaimer', sub: 'Venue independence notice', route: '/legal-disclaimer' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => router.push(item.route as any)}
            style={[styles.row, { backgroundColor: tc.card, borderColor: tc.border }]}
            activeOpacity={0.8}
          >
            <Feather name="shield" size={16} color={tc.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowLabel, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{item.label}</Text>
              <Text style={[styles.rowSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{item.sub}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={tc.text3} />
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionHead, { color: tc.text3, fontFamily: 'Poppins_700Bold' }]}>DANGER ZONE</Text>
        <TouchableOpacity
          onPress={() => setShowDelete(true)}
          style={[styles.row, { backgroundColor: '#ef444408', borderColor: '#ef444420' }]}
          activeOpacity={0.8}
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: '#ef4444', fontFamily: 'Poppins_600SemiBold' }]}>Delete Account</Text>
            <Text style={[styles.rowSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Permanently remove your account and all data</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#ef444460" />
        </TouchableOpacity>
      </ScrollView>

      <SecurityPrefsModal
        visible={showSecurity}
        prefs={securityPrefs}
        onSave={updateSecurityPrefs}
        onClose={() => setShowSecurity(false)}
      />

      <Modal visible={showDelete} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
            {deleteStep === 'password' ? (
              <>
                <View style={styles.delIcon}>
                  <Feather name="lock" size={26} color="#ef4444" />
                </View>
                <Text style={[styles.modalTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Confirm Your Identity</Text>
                <Text style={[styles.modalSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Enter your password to continue with account deletion</Text>
                <View style={[styles.pwInput, { backgroundColor: tc.inputBg, borderColor: tc.border }]}>
                  <Feather name="lock" size={16} color={tc.muted} />
                  <TextInput
                    value={deletePw}
                    onChangeText={setDeletePw}
                    placeholder="Enter your password"
                    placeholderTextColor={tc.muted}
                    secureTextEntry={!showPw}
                    style={[styles.pwField, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
                  />
                  <TouchableOpacity onPress={() => setShowPw(p => !p)}>
                    <Feather name={showPw ? 'eye-off' : 'eye'} size={16} color={tc.muted} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBtns}>
                  <TouchableOpacity onPress={() => setShowDelete(false)} style={[styles.cancelBtn, { borderColor: tc.border, backgroundColor: tc.inputBg }]} activeOpacity={0.8}>
                    <Text style={[styles.cancelTxt, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { if (deletePw.length >= 4) setDeleteStep('confirm'); }} style={[styles.continueBtn, { backgroundColor: deletePw.length >= 4 ? 'rgba(239,68,68,0.85)' : tc.inputBg }]} activeOpacity={0.8}>
                    <Text style={[styles.continueTxt, { color: deletePw.length >= 4 ? '#fff' : tc.muted, fontFamily: 'Poppins_600SemiBold' }]}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.delIcon2}>
                  <Feather name="trash-2" size={30} color="#ef4444" />
                </View>
                <Text style={[styles.modalTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Delete Account?</Text>
                <Text style={[styles.modalSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
                  This will permanently delete your account, bookings, and all personal data. This action{' '}
                  <Text style={{ color: '#ef4444', fontFamily: 'Poppins_600SemiBold' }}>cannot be undone</Text>.
                </Text>
                <View style={styles.lostBanner}>
                  <Text style={[styles.lostTxt, { fontFamily: 'Poppins_600SemiBold' }]}>⚠️ 12,450 loyalty points will be lost forever</Text>
                </View>
                <View style={styles.modalBtns}>
                  <TouchableOpacity onPress={() => { setDeleteStep('password'); setDeletePw(''); setShowDelete(false); }} style={[styles.cancelBtn, { borderColor: tc.border, backgroundColor: tc.inputBg }]} activeOpacity={0.8}>
                    <Text style={[styles.cancelTxt, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>Keep Account</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setShowDelete(false); router.replace('/(auth)/sign-in'); }} style={styles.deleteBtn} activeOpacity={0.8}>
                    <Text style={[styles.deleteTxt, { fontFamily: 'Poppins_700Bold' }]}>Delete Forever</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1 },
  rowLabel: { fontSize: 14, marginBottom: 1 },
  rowSub: { fontSize: 12 },
  langWrap: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  langList: { borderTopWidth: StyleSheet.hairlineWidth },
  langOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  langLabel: { fontSize: 14 },
  langNative: { fontSize: 11 },
  sectionHead: { fontSize: 11, letterSpacing: 1, marginTop: 4, marginBottom: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { borderRadius: 24, padding: 24, borderWidth: 1, width: '100%', maxWidth: 380 },
  delIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#ef444415', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  delIcon2: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ef444415', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, textAlign: 'center', marginBottom: 8 },
  modalSub: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  pwInput: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1, marginBottom: 16 },
  pwField: { flex: 1, fontSize: 14, paddingVertical: 12 },
  lostBanner: { backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', borderRadius: 10, padding: 12, marginBottom: 16 },
  lostTxt: { color: '#ef4444', fontSize: 12, textAlign: 'center' },
  modalBtns: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  cancelTxt: { fontSize: 14 },
  continueBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  continueTxt: { fontSize: 14 },
  deleteBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#ef4444' },
  deleteTxt: { color: '#fff', fontSize: 14 },
  secStatus: { flexDirection: 'row', gap: 4, alignItems: 'center', marginRight: 4 },
  secDot: { width: 6, height: 6, borderRadius: 3 },
  aboutCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  aboutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  aboutDivider: { height: StyleSheet.hairlineWidth, marginHorizontal: 14 },
  aboutKey: { fontSize: 13 },
  aboutVal: { fontSize: 13 },
});
