import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { openCall, openEmail } from '@/utils/linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const FAQS = [
  { q: 'How do I cancel a booking?', a: 'Go to My Reservations, tap on the booking, and select Cancel Booking. Cancellations made 24h+ in advance receive an 80% refund.' },
  { q: 'How does VIP bottle service work?', a: 'When you book a VIP table, you can pre-order bottles from our menu. Your dedicated host will deliver them to your table upon arrival.' },
  { q: 'Can I transfer my booking?', a: 'Yes! Tap View Details on your booking and use the Share QR Code option to transfer to another person.' },
  { q: 'How do I earn points?', a: 'You earn 1 point per R1 spent on bookings. Bonus points are awarded for reviews, referrals, and special promotions.' },
  { q: 'What promo codes are available?', a: 'Use SAPVIP10 for 10% off, PLUG20 for R200 off, or GOLD15 for 15% off your next booking.' },
  { q: 'What is the cancellation policy?', a: 'Cancellations 24h+ before receive 80% refund. Within 24h, a 20% cancellation fee applies. No-shows receive no refund.' },
];

export default function ProfileHelpScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Help & Support</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30 }}>
        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Frequently Asked Questions</Text>
        <View style={{ gap: 8, marginBottom: 24 }}>
          {FAQS.map((faq, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setOpen(open === i ? null : i)}
              style={[styles.faqItem, { backgroundColor: tc.card, borderColor: open === i ? tc.accent : tc.border }]}
              activeOpacity={0.85}
            >
              <View style={styles.faqTop}>
                <Text style={[styles.faqQ, { color: tc.text, fontFamily: 'Poppins_600SemiBold', flex: 1 }]}>{faq.q}</Text>
                <Feather name={open === i ? 'chevron-up' : 'chevron-down'} size={16} color={tc.text2} />
              </View>
              {open === i && (
                <Text style={[styles.faqA, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{faq.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Still Need Help?</Text>
        <TouchableOpacity
          onPress={() => router.push('/chat')}
          style={styles.chatBtn}
          activeOpacity={0.88}
        >
          <LinearGradient colors={tc.accentGradColors} style={styles.chatGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
            <Feather name="message-circle" size={20} color={tc.isDark ? '#000' : '#fff'} />
            <Text style={[styles.chatTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Chat with SA PLUG Support</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={[styles.contactCard, { backgroundColor: tc.card, borderColor: tc.border }]}>
          {[
            { icon: 'mail', label: 'Email', value: 'support@saplug.co.za', action: () => openEmail('support@saplug.co.za') },
            { icon: 'phone', label: 'WhatsApp', value: '+27 10 123 4567', action: () => openCall('+27101234567') },
            { icon: 'clock', label: 'Hours', value: 'Mon–Sun, 8AM–2AM', action: null as (() => void) | null },
          ].map((c, i) => (
            <TouchableOpacity
              key={i}
              disabled={!c.action}
              style={[styles.contactRow, i < 2 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: tc.border }]}
              onPress={() => c.action && c.action()}
              activeOpacity={c.action ? 0.8 : 1}
            >
              <View style={[styles.contactIcon, { backgroundColor: tc.accent + '12' }]}>
                <Feather name={c.icon as any} size={16} color={tc.accent} />
              </View>
              <View>
                <Text style={[styles.contactLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{c.label}</Text>
                <Text style={[styles.contactValue, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{c.value}</Text>
              </View>
              {c.action && <Feather name="chevron-right" size={16} color={tc.text3} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.creditWrap}>
          <Text style={[styles.creditTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>SA PLUG v1.0.0</Text>
          <View style={[styles.creditDot, { backgroundColor: tc.text3 }]} />
          <Text style={[styles.creditTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Developed by </Text>
          <Text style={[styles.creditLink, { color: tc.accent, fontFamily: 'Poppins_600SemiBold' }]}>Rtm Core</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18 },
  sectionTitle: { fontSize: 15, marginBottom: 12 },
  faqItem: { borderRadius: 14, padding: 14, borderWidth: 1 },
  faqTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  faqQ: { fontSize: 14, lineHeight: 20 },
  faqA: { fontSize: 13, lineHeight: 20, marginTop: 10 },
  chatBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  chatGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14 },
  chatTxt: { fontSize: 15 },
  contactCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  contactIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { fontSize: 11, marginBottom: 2 },
  contactValue: { fontSize: 14 },
  creditWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 4, marginTop: 28, marginBottom: 8 },
  creditDot: { width: 3, height: 3, borderRadius: 1.5 },
  creditTxt: { fontSize: 12 },
  creditLink: { fontSize: 12 },
});
