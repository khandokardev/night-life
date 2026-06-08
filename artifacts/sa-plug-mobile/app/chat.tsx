import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

type Msg = { id: string; text: string; from: 'user' | 'concierge'; time: string };

const INIT_MSGS: Msg[] = [
  { id: '1', text: 'Welcome to SA PLUG Concierge! 🌟 I\'m here to help with reservations, recommendations, and anything you need to make your night unforgettable.', from: 'concierge', time: '09:00' },
  { id: '2', text: 'How can I assist you today?', from: 'concierge', time: '09:00' },
];

const QUICK_REPLIES = ['Book a table tonight', 'VIP club recommendations', 'Best tours this week', 'What\'s trending?'];

const BOT_REPLIES = [
  'I\'d be happy to help you book a table! Which restaurant are you interested in, and for how many guests?',
  'Our top VIP clubs tonight include ONYX in Sandton and COCO at the V&A Waterfront. Both offer premium bottle service. Shall I check availability?',
  'This week\'s top tours include the Cape Winelands Helicopter Tour and the Garden Route Safari. Both are booking fast!',
  'Right now, #Amapiano nights at ZONE 6 and the Gold Rush Gala at V&A are trending. Would you like more details?',
];

function now() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ChatScreen() {
  const tc = useTC();
  const { isLoggedIn } = useApp();
  const insets = useSafeAreaInsets();

  const [msgs, setMsgs] = useState<Msg[]>(INIT_MSGS);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  if (!isLoggedIn) {
    return (
      <View style={[styles.root, { backgroundColor: tc.bg }]}>
        <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={22} color={tc.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={[styles.conciergeAvatar, { backgroundColor: tc.accent }]}>
                <Text style={[styles.conciergeAvatarTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>SP</Text>
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>SA PLUG Concierge</Text>
                <Text style={[styles.onlineTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Members Only</Text>
              </View>
            </View>
            <View style={{ width: 36 }} />
          </View>
        </View>
        <View style={styles.guestWrap}>
          <View style={[styles.guestIconWrap, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Feather name="message-circle" size={40} color={tc.text3} />
          </View>
          <Text style={[styles.guestTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
            Members Only
          </Text>
          <Text style={[styles.guestSub, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            Our 24/7 concierge service is exclusively available to SA PLUG members. Sign in to chat with your personal assistant.
          </Text>
          <TouchableOpacity
            style={[styles.guestBtnWrap, { overflow: 'hidden', borderRadius: 16 }]}
            onPress={() => router.push('/(auth)/sign-in')}
            activeOpacity={0.85}
          >
            <LinearGradient colors={tc.accentGradColors} style={styles.guestBtn} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Text style={[styles.guestBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Log In to Chat</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.guestOutlineBtn, { borderColor: tc.accent }]}
            onPress={() => router.push('/(auth)/sign-up')}
            activeOpacity={0.85}
          >
            <Text style={[styles.guestOutlineTxt, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const sendMsg = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now().toString(), text: text.trim(), from: 'user', time: now() };
    const botReply: Msg = {
      id: (Date.now() + 1).toString(),
      text: BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
      from: 'concierge',
      time: now(),
    };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, botReply]);
      listRef.current?.scrollToEnd({ animated: true });
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: tc.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={tc.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={[styles.conciergeAvatar, { backgroundColor: tc.accent }]}>
              <Text style={[styles.conciergeAvatarTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>SP</Text>
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>SA PLUG Concierge</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={[styles.onlineTxt, { color: '#22C55E', fontFamily: 'Inter_400Regular' }]}>Online</Text>
              </View>
            </View>
          </View>
          <View style={{ width: 36 }} />
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 8, gap: 12 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.msgRow, item.from === 'user' && styles.msgRowRight]}>
            {item.from === 'concierge' && (
              <View style={[styles.msgAvatar, { backgroundColor: tc.accent }]}>
                <Text style={[styles.msgAvatarTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>SP</Text>
              </View>
            )}
            <View style={[
              styles.bubble,
              item.from === 'user'
                ? { backgroundColor: tc.accent, borderBottomRightRadius: 4 }
                : { backgroundColor: tc.card, borderColor: tc.border, borderWidth: 1, borderBottomLeftRadius: 4 },
            ]}>
              <Text style={[styles.bubbleTxt, { color: item.from === 'user' ? (tc.isDark ? '#000' : '#fff') : tc.text, fontFamily: 'Inter_400Regular' }]}>
                {item.text}
              </Text>
              <Text style={[styles.timeTxt, { color: item.from === 'user' ? (tc.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)') : tc.text3, fontFamily: 'Inter_400Regular' }]}>
                {item.time}
              </Text>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.welcomeCard}>
            <LinearGradient colors={tc.accentGradColors} style={styles.welcomeGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Feather name="message-circle" size={24} color={tc.isDark ? '#000' : '#fff'} />
              <Text style={[styles.welcomeTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>24/7 Premium Concierge</Text>
              <Text style={[styles.welcomeSub, { color: tc.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' }]}>Your personal SA PLUG assistant</Text>
            </LinearGradient>
          </View>
        }
      />

      {/* Quick Replies */}
      <View style={styles.quickReplies}>
        <FlatList
          data={QUICK_REPLIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={q => q}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: tc.chipBg, borderColor: tc.border }]}
              onPress={() => sendMsg(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.quickBtnTxt, { color: tc.chipColor, fontFamily: 'Inter_400Regular' }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input */}
      <View style={[styles.inputRow, { backgroundColor: tc.headerBg, borderTopColor: tc.border, paddingBottom: insets.bottom + WEB_BOT + 8 }]}>
        <View style={[styles.inputWrap, { backgroundColor: tc.authInputBg, borderColor: tc.authBorder }]}>
          <TextInput
            style={[styles.input, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
            placeholder="Message SA PLUG concierge..."
            placeholderTextColor={tc.text3}
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => sendMsg(input)}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.45 }]}
          onPress={() => sendMsg(input)}
          disabled={!input.trim()}
          activeOpacity={0.85}
        >
          <LinearGradient colors={tc.accentGradColors} style={styles.sendBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
            <Feather name="send" size={16} color={tc.isDark ? '#000' : '#fff'} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  conciergeAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  conciergeAvatarTxt: { fontSize: 13 },
  headerTitle: { fontSize: 15 },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  onlineTxt: { fontSize: 11 },
  welcomeCard: { marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  welcomeGrad: { padding: 16, alignItems: 'center', gap: 6 },
  welcomeTxt: { fontSize: 15 },
  welcomeSub: { fontSize: 13 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' },
  msgRowRight: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgAvatarTxt: { fontSize: 10 },
  bubble: { padding: 12, borderRadius: 16, maxWidth: '100%' },
  bubbleTxt: { fontSize: 14, lineHeight: 21 },
  timeTxt: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  quickReplies: { paddingVertical: 8 },
  quickBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  quickBtnTxt: { fontSize: 13 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 12, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  inputWrap: { flex: 1, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100 },
  input: { fontSize: 15, maxHeight: 80 },
  sendBtn: { borderRadius: 22, overflow: 'hidden' },
  sendBtnGrad: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },

  guestWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 14 },
  guestIconWrap: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  guestTitle: { fontSize: 22, textAlign: 'center' },
  guestSub: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 4 },
  guestBtnWrap: { width: '100%' },
  guestBtn: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  guestBtnTxt: { fontSize: 15 },
  guestOutlineBtn: { width: '100%', borderWidth: 1.5, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  guestOutlineTxt: { fontSize: 14 },
});
