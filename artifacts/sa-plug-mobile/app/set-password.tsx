import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

export default function SetPasswordScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showN, setShowN] = useState(false);
  const [showC, setShowC] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const strength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  const handleSave = () => {
    if (newPw.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setDone(true);
    setTimeout(() => router.replace('/(auth)/sign-in'), 1500);
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.topPad, { paddingTop: insets.top + WEB_TOP }]} />

      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: tc.accent + '15' }]}>
          <Feather name="lock" size={28} color={tc.accent} />
        </View>
        <Text style={[styles.title, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Set New Password</Text>
        <Text style={[styles.subtitle, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
          Create a strong new password for your SA PLUG account.
        </Text>

        <View style={{ gap: 14, marginTop: 24, marginBottom: 16 }}>
          {[
            { label: 'New Password', value: newPw, set: setNewPw, show: showN, setShow: setShowN },
            { label: 'Confirm Password', value: confirm, set: setConfirm, show: showC, setShow: setShowC },
          ].map(({ label, value, set, show, setShow }) => (
            <View key={label}>
              <Text style={[styles.fieldLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
              <View style={[styles.inputWrap, { backgroundColor: tc.card, borderColor: tc.border }]}>
                <Feather name="lock" size={15} color={tc.accent} />
                <TextInput
                  value={value}
                  onChangeText={set}
                  secureTextEntry={!show}
                  placeholderTextColor={tc.muted}
                  style={[styles.inputField, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
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
                {strengthLabels[strength]}
              </Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorWrap}>
              <Feather name="alert-circle" size={14} color="#ef4444" />
              <Text style={[styles.errorTxt, { fontFamily: 'Inter_400Regular' }]}>{error}</Text>
            </View>
          ) : null}

          {done && (
            <View style={styles.successWrap}>
              <Feather name="check-circle" size={14} color="#22c55e" />
              <Text style={[styles.successTxt, { fontFamily: 'Poppins_600SemiBold' }]}>Password updated!</Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleSave} activeOpacity={0.88} style={styles.saveBtn}>
          <LinearGradient colors={tc.accentGradColors} style={styles.saveBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
            <Feather name="check" size={18} color={tc.isDark ? '#000' : '#fff'} />
            <Text style={[styles.saveBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Set Password</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topPad: {},
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  iconWrap: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  fieldLabel: { fontSize: 12, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, borderWidth: 1 },
  inputField: { flex: 1, fontSize: 14, paddingVertical: 14 },
  strengthBars: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  strengthBar: { flex: 1, height: 5, borderRadius: 3 },
  strengthLabel: { fontSize: 12 },
  errorWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ef444412', borderRadius: 10, padding: 10 },
  errorTxt: { color: '#ef4444', fontSize: 13 },
  successWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 10, padding: 10 },
  successTxt: { color: '#22c55e', fontSize: 13 },
  saveBtn: { borderRadius: 14, overflow: 'hidden' },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  saveBtnTxt: { fontSize: 15 },
});
