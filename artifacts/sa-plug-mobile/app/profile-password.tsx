import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

export default function ProfilePasswordScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showC, setShowC] = useState(false);
  const [showN, setShowN] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [saved, setSaved] = useState(false);

  const strength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  const FIELDS = [
    { label: 'Current Password', value: current, set: setCurrent, show: showC, setShow: setShowC },
    { label: 'New Password', value: newPw, set: setNewPw, show: showN, setShow: setShowN },
    { label: 'Confirm New Password', value: confirm, set: setConfirm, show: showCf, setShow: setShowCf },
  ];

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Change Password</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        <View style={{ gap: 14, marginBottom: 16 }}>
          {FIELDS.map(({ label, value, set, show, setShow }) => (
            <View key={label}>
              <Text style={[styles.fieldLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
              <View style={[styles.inputWrap, { backgroundColor: tc.card, borderColor: tc.border }]}>
                <Feather name="lock" size={15} color={tc.accent} />
                <TextInput
                  value={value}
                  onChangeText={set}
                  secureTextEntry={!show}
                  style={[styles.inputField, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
                  placeholderTextColor={tc.muted}
                />
                <TouchableOpacity onPress={() => setShow(!show)}>
                  <Feather name={show ? 'eye-off' : 'eye'} size={16} color={tc.muted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {newPw.length > 0 && (
            <View>
              <View style={styles.strengthBars}>
                {[1, 2, 3].map(i => (
                  <View key={i} style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColors[strength] : tc.border }]} />
                ))}
              </View>
              <Text style={[styles.strengthLabel, { color: strengthColors[strength], fontFamily: 'Poppins_600SemiBold' }]}>
                Password Strength: {strengthLabels[strength]}
              </Text>
            </View>
          )}

          <View style={[styles.reqCard, { backgroundColor: tc.accent + '08', borderColor: tc.accent + '28' }]}>
            <Text style={[styles.reqTitle, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>Password Requirements</Text>
            {['At least 8 characters', 'One uppercase letter', 'One number or symbol'].map((req, i) => (
              <View key={i} style={styles.reqRow}>
                <Feather name="check" size={10} color={tc.accent} />
                <Text style={[styles.reqTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Feather name="check-circle" size={16} color="#22c55e" />
            <Text style={[styles.successTxt, { fontFamily: 'Poppins_600SemiBold' }]}>Password changed successfully!</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
          activeOpacity={0.88}
          style={styles.saveBtn}
        >
          <LinearGradient colors={tc.accentGradColors} style={styles.saveBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
            <Text style={[styles.saveBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Update Password</Text>
          </LinearGradient>
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
  fieldLabel: { fontSize: 12, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1 },
  inputField: { flex: 1, fontSize: 14, paddingVertical: 14 },
  strengthBars: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  strengthBar: { flex: 1, height: 5, borderRadius: 3 },
  strengthLabel: { fontSize: 12 },
  reqCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  reqTitle: { fontSize: 12, marginBottom: 8 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  reqTxt: { fontSize: 11 },
  successBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', borderRadius: 12, padding: 12, marginBottom: 14 },
  successTxt: { color: '#22c55e', fontSize: 13 },
  saveBtn: { borderRadius: 14, overflow: 'hidden' },
  saveBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  saveBtnTxt: { fontSize: 15 },
});
