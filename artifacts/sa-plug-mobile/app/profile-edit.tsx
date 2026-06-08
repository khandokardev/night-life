import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Platform, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

export default function ProfileEditScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useApp();

  const [name, setName]   = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio]     = useState('');
  const [avatar, setAvatar] = useState<string | null | undefined>(user?.avatar);
  const [saved, setSaved] = useState(false);

  const initials = (name || user?.name || 'U').trim().charAt(0).toUpperCase();
  const borderColor = tc.isDark ? GOLD : tc.accent;
  const activeTxt   = tc.isDark ? '#000' : '#fff';

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow photo library access to change your profile picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setAvatar(uri);
        updateUser({ avatar: uri });
      }
    } catch {
      Alert.alert('Error', 'Could not open photo library. Please try again.');
    }
  };

  const handleSave = () => {
    updateUser({ name: name.trim() || user?.name, email: email.trim() || undefined, phone: phone.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const FIELDS = [
    { label: 'Full Name',     value: name,  set: setName,  icon: 'user',  kb: 'default'       as const },
    { label: 'Email Address', value: email, set: setEmail, icon: 'mail',  kb: 'email-address' as const },
    { label: 'Phone Number',  value: phone, set: setPhone, icon: 'phone', kb: 'phone-pad'     as const },
  ];

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>

        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={{ position: 'relative' }}>
            <View style={[styles.avatarRing, { borderColor }]}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImg} contentFit="cover" />
              ) : (
                <View style={[styles.avatarInner, { backgroundColor: tc.isDark ? '#1A1500' : tc.accent + '18' }]}>
                  <Text style={[styles.avatarLetter, { color: borderColor, fontFamily: 'Poppins_900Black' }]}>{initials}</Text>
                </View>
              )}
            </View>
            <View style={[styles.cameraBtn, { backgroundColor: borderColor }]}>
              <Feather name="camera" size={14} color={activeTxt} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <Text style={[styles.changePhotoTxt, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 14, marginBottom: 14 }}>
          {FIELDS.map(({ label, value, set, icon, kb }) => (
            <View key={label}>
              <Text style={[styles.fieldLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
              <View style={[styles.inputWrap, { backgroundColor: tc.card, borderColor: tc.border }]}>
                <Feather name={icon as any} size={15} color={tc.accent} />
                <TextInput
                  value={value}
                  onChangeText={set}
                  keyboardType={kb}
                  style={[styles.inputField, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
                  placeholderTextColor={tc.muted}
                />
                <Feather name="edit-3" size={13} color={tc.muted} />
              </View>
            </View>
          ))}

          <View>
            <Text style={[styles.fieldLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              style={[styles.bioInput, { backgroundColor: tc.card, borderColor: tc.border, color: tc.text, fontFamily: 'Inter_400Regular' }]}
              placeholderTextColor={tc.muted}
            />
          </View>
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Feather name="check-circle" size={16} color="#22c55e" />
            <Text style={[styles.successTxt, { fontFamily: 'Poppins_600SemiBold' }]}>Profile saved successfully!</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleSave} activeOpacity={0.88} style={styles.saveBtn}>
          <LinearGradient colors={tc.accentGradColors} style={styles.saveBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
            <Text style={[styles.saveBtnTxt, { color: activeTxt, fontFamily: 'Poppins_700Bold' }]}>Save Changes</Text>
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
  avatarSection: { alignItems: 'center', paddingVertical: 24, gap: 10 },
  avatarRing: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: 100, height: 100 },
  avatarInner: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontSize: 40 },
  cameraBtn: { position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  changePhotoTxt: { fontSize: 13 },
  fieldLabel: { fontSize: 12, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4, borderWidth: 1 },
  inputField: { flex: 1, fontSize: 14, paddingVertical: 12 },
  bioInput: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, borderWidth: 1, minHeight: 80, textAlignVertical: 'top' },
  successBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', borderRadius: 12, padding: 12, marginBottom: 14 },
  successTxt: { color: '#22c55e', fontSize: 13 },
  saveBtn: { borderRadius: 14, overflow: 'hidden' },
  saveBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  saveBtnTxt: { fontSize: 15 },
});
