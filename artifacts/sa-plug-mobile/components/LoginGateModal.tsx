import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LoginGateModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function LoginGateModal({ visible, onClose, title, message }: LoginGateModalProps) {
  const tc = useTC();

  const handleLogin = () => {
    onClose();
    router.push('/(auth)/sign-in');
  };

  const handleSignUp = () => {
    onClose();
    router.push('/(auth)/sign-up');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={s.overlay}>
        <View style={[s.sheet, { backgroundColor: tc.card, borderColor: tc.border }]}>
          <View style={[s.iconWrap, { backgroundColor: `${tc.accent}18`, borderColor: `${tc.accent}35` }]}>
            <Feather name="lock" size={28} color={tc.accent} />
          </View>

          <Text style={[s.title, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
            {title ?? 'Members Only'}
          </Text>
          <Text style={[s.body, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            {message ?? 'Sign in or create a free account to access this feature.'}
          </Text>

          <TouchableOpacity style={s.btnWrap} onPress={handleLogin} activeOpacity={0.85}>
            <LinearGradient
              colors={tc.accentGradColors}
              style={s.btn}
              start={{ x: 0.07, y: 0 }}
              end={{ x: 0.93, y: 1 }}
            >
              <Text style={[s.btnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                Log In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.outlineBtn, { borderColor: tc.accent }]}
            onPress={handleSignUp}
            activeOpacity={0.85}
          >
            <Text style={[s.outlineTxt, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
            <Text style={[s.cancelTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, marginBottom: 10, textAlign: 'center' },
  body: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  btnWrap: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 10 },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
  },
  btnTxt: { fontSize: 15, letterSpacing: 0.3 },
  outlineBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  outlineTxt: { fontSize: 14 },
  cancelBtn: { paddingVertical: 10 },
  cancelTxt: { fontSize: 13 },
});
