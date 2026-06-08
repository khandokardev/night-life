import { useTC } from '@/hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

type Card = { type: string; last: string; exp: string; primary: boolean };

const INITIAL_CARDS: Card[] = [
  { type: 'Visa',       last: '4521', exp: '12/27', primary: true  },
  { type: 'Mastercard', last: '8832', exp: '06/26', primary: false },
];

function detectType(num: string): string {
  const d = num.replace(/\s/g, '');
  if (d.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'Mastercard';
  if (d.startsWith('3')) return 'Amex';
  return 'Card';
}

export default function ProfilePaymentScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();

  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [showForm, setShowForm] = useState(false);
  const [cardNum, setCardNum]   = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry]     = useState('');
  const [cvv, setCvv]           = useState('');
  const [saved, setSaved]       = useState(false);

  const vipGold = tc.isDark ? GOLD : tc.accent;

  const formatCardNum = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const handleSave = () => {
    if (!cardNum || !cardName || !expiry || !cvv) return;
    const last = cardNum.replace(/\s/g, '').slice(-4);
    const type = detectType(cardNum);
    setCards(prev => [...prev, { type, last, exp: expiry, primary: false }]);
    setSaved(true);
    setTimeout(() => {
      setShowForm(false); setSaved(false);
      setCardNum(''); setCardName(''); setExpiry(''); setCvv('');
    }, 1200);
  };

  const removeCard = (i: number) => setCards(prev => prev.filter((_, j) => j !== i));
  const setPrimary = (i: number) => setCards(prev => prev.map((c, j) => ({ ...c, primary: j === i })));

  const canSave = !!cardNum && !!cardName && !!expiry && !!cvv;

  return (
    <View style={[s.root, { backgroundColor: tc.bg }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <View style={[s.backCircle, { backgroundColor: tc.inputBg, borderColor: tc.border }]}>
            <Feather name="arrow-left" size={18} color={tc.text} />
          </View>
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}>

        {/* Security notice */}
        <View style={[s.secureNote, { backgroundColor: `${vipGold}08`, borderColor: `${vipGold}25` }]}>
          <Feather name="lock" size={14} color={vipGold} />
          <Text style={[s.secureTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
            Your payment details are encrypted and stored securely.
          </Text>
        </View>

        {/* Card list */}
        {cards.length > 0 && (
          <Text style={[s.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Saved Cards</Text>
        )}

        {cards.map((card, i) => (
          <View key={i} style={[s.cardItem, { backgroundColor: tc.card, borderColor: card.primary ? vipGold : tc.border }]}>
            {/* Card icon + type + number */}
            <View style={s.cardTop}>
              <View style={[s.cardIconWrap, { backgroundColor: card.type === 'Visa' ? '#1A1F7112' : card.type === 'Mastercard' ? '#EB001B12' : `${vipGold}12` }]}>
                <Feather name="credit-card" size={18} color={card.type === 'Visa' ? '#1A1F71' : card.type === 'Mastercard' ? '#EB001B' : vipGold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.cardTypeTxt, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
                  {card.type} •••• {card.last}
                </Text>
                <Text style={[s.cardExpTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
                  Expires {card.exp}
                </Text>
              </View>
              {card.primary && (
                <View style={[s.primaryBadge, { backgroundColor: `${GOLD}20` }]}>
                  <Text style={[s.primaryTxt, { color: GOLD, fontFamily: 'Poppins_700Bold' }]}>PRIMARY</Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={[s.cardActions, { borderTopColor: tc.border }]}>
              {!card.primary && (
                <TouchableOpacity
                  style={s.actionBtn}
                  onPress={() => setPrimary(i)}
                  activeOpacity={0.8}
                >
                  <Feather name="star" size={13} color={vipGold} />
                  <Text style={[s.actionTxt, { color: vipGold, fontFamily: 'Inter_500Medium' }]}>Set Primary</Text>
                </TouchableOpacity>
              )}
              {card.primary && <View style={s.actionBtn} />}
              <TouchableOpacity
                style={s.actionBtn}
                onPress={() => removeCard(i)}
                activeOpacity={0.8}
              >
                <Feather name="trash-2" size={13} color="#EF4444" />
                <Text style={[s.actionTxt, { color: '#EF4444', fontFamily: 'Inter_500Medium' }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add New Card button */}
        {!showForm && (
          <TouchableOpacity
            style={s.addBtnWrap}
            onPress={() => setShowForm(true)}
            activeOpacity={0.88}
          >
            <LinearGradient colors={tc.accentGradColors} style={s.addBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Feather name="plus" size={18} color={tc.isDark ? '#000' : '#fff'} />
              <Text style={[s.addBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                Add New Card
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Add card form */}
        {showForm && (
          <View style={[s.form, { backgroundColor: tc.card, borderColor: vipGold }]}>
            {/* Form header */}
            <View style={s.formHeader}>
              <Text style={[s.formTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>New Card Details</Text>
              <TouchableOpacity
                onPress={() => { setShowForm(false); setCardNum(''); setCardName(''); setExpiry(''); setCvv(''); }}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Feather name="x" size={20} color={tc.text3} />
              </TouchableOpacity>
            </View>

            {/* Card preview */}
            <LinearGradient colors={tc.accentGradColors} style={s.cardPreview} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Text style={[s.previewLabel, { fontFamily: 'Inter_400Regular' }]}>CARD NUMBER</Text>
              <Text style={[s.previewNumber, { fontFamily: 'Poppins_700Bold' }]}>
                {cardNum || '•••• •••• •••• ••••'}
              </Text>
              <View style={s.previewBottom}>
                <View>
                  <Text style={[s.previewLabel, { fontFamily: 'Inter_400Regular' }]}>CARD HOLDER</Text>
                  <Text style={[s.previewValue, { fontFamily: 'Poppins_700Bold' }]}>
                    {cardName || 'YOUR NAME'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[s.previewLabel, { fontFamily: 'Inter_400Regular' }]}>EXPIRES</Text>
                  <Text style={[s.previewValue, { fontFamily: 'Poppins_700Bold' }]}>
                    {expiry || 'MM/YY'}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Inputs */}
            {[
              { label: 'Card Number',     val: cardNum,  set: (v: string) => setCardNum(formatCardNum(v)),   kb: 'numeric' as const, ph: '0000 0000 0000 0000', secure: false },
              { label: 'Cardholder Name', val: cardName, set: (v: string) => setCardName(v.toUpperCase()),   kb: 'default' as const, ph: 'FULL NAME',            secure: false },
            ].map(f => (
              <View key={f.label} style={s.inputWrap}>
                <Text style={[s.inputLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{f.label}</Text>
                <View style={[s.inputBox, { backgroundColor: tc.inputBg, borderColor: tc.border }]}>
                  <TextInput
                    value={f.val}
                    onChangeText={f.set}
                    keyboardType={f.kb}
                    placeholder={f.ph}
                    placeholderTextColor={tc.muted}
                    secureTextEntry={f.secure}
                    style={[s.inputText, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
                  />
                </View>
              </View>
            ))}

            <View style={s.twoCol}>
              <View style={[s.inputWrap, { flex: 1 }]}>
                <Text style={[s.inputLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Expiry Date</Text>
                <View style={[s.inputBox, { backgroundColor: tc.inputBg, borderColor: tc.border }]}>
                  <TextInput
                    value={expiry}
                    onChangeText={v => setExpiry(formatExpiry(v))}
                    keyboardType="numeric"
                    placeholder="MM/YY"
                    placeholderTextColor={tc.muted}
                    style={[s.inputText, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
                  />
                </View>
              </View>
              <View style={[s.inputWrap, { width: 100 }]}>
                <Text style={[s.inputLabel, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>CVV</Text>
                <View style={[s.inputBox, { backgroundColor: tc.inputBg, borderColor: tc.border }]}>
                  <TextInput
                    value={cvv}
                    onChangeText={v => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                    keyboardType="numeric"
                    placeholder="•••"
                    placeholderTextColor={tc.muted}
                    secureTextEntry
                    style={[s.inputText, { color: tc.text, fontFamily: 'Inter_400Regular' }]}
                  />
                </View>
              </View>
            </View>

            {/* Save button */}
            <TouchableOpacity
              style={[s.saveBtnWrap, !canSave && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={!canSave}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={saved ? ['#22c55e', '#16a34a'] : tc.accentGradColors}
                style={s.saveBtnGrad}
                start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}
              >
                <Feather name={saved ? 'check' : 'lock'} size={15} color={saved ? '#fff' : (tc.isDark ? '#000' : '#fff')} />
                <Text style={[s.saveBtnTxt, { color: saved ? '#fff' : (tc.isDark ? '#000' : '#fff'), fontFamily: 'Poppins_700Bold' }]}>
                  {saved ? 'Card Saved!' : 'Save Card Securely'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={s.secureRow}>
              <Feather name="lock" size={11} color={tc.text3} />
              <Text style={[s.secureSmTxt, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>
                Your card details are encrypted and secure
              </Text>
            </View>
          </View>
        )}

        {/* Other payment options */}
        <Text style={[s.sectionTitle, { color: tc.text, fontFamily: 'Poppins_700Bold', marginTop: 20 }]}>Other Payment Options</Text>
        {[
          { icon: 'smartphone', label: 'SnapScan / Zapper', sub: 'Scan to pay at checkout' },
          { icon: 'globe',      label: 'EFT Payment',       sub: 'Instant EFT via Peach Payments' },
        ].map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[s.optionRow, { backgroundColor: tc.card, borderColor: tc.border }]}
            activeOpacity={0.8}
          >
            <View style={[s.optIconBox, { backgroundColor: `${vipGold}12` }]}>
              <Feather name={opt.icon as any} size={18} color={vipGold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.optLabel, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{opt.label}</Text>
              <Text style={[s.optSub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{opt.sub}</Text>
            </View>
            <Feather name="chevron-right" size={16} color={tc.text3} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  backCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18 },

  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20 },
  secureTxt: { flex: 1, fontSize: 12, lineHeight: 18 },

  sectionTitle: { fontSize: 15, marginBottom: 12 },

  cardItem: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  cardIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTypeTxt: { fontSize: 14, marginBottom: 3 },
  cardExpTxt: { fontSize: 12 },
  primaryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  primaryTxt: { fontSize: 9, letterSpacing: 0.5 },
  cardActions: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  actionTxt: { fontSize: 13 },

  addBtnWrap: { borderRadius: 16, overflow: 'hidden', marginBottom: 4 },
  addBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16 },
  addBtnTxt: { fontSize: 15 },

  form: { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 4 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  formTitle: { fontSize: 15 },

  cardPreview: { borderRadius: 14, padding: 18, marginBottom: 16 },
  previewLabel: { fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: 1, marginBottom: 4 },
  previewNumber: { fontSize: 17, color: '#fff', letterSpacing: 3, marginBottom: 16 },
  previewBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  previewValue: { fontSize: 12, color: '#fff' },

  inputWrap: { marginBottom: 12 },
  inputLabel: { fontSize: 12, marginBottom: 6 },
  inputBox: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14 },
  inputText: { fontSize: 14, paddingVertical: 12 },
  twoCol: { flexDirection: 'row', gap: 10 },

  saveBtnWrap: { borderRadius: 14, overflow: 'hidden', marginTop: 4, marginBottom: 10 },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  saveBtnTxt: { fontSize: 15 },

  secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  secureSmTxt: { fontSize: 11 },

  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 10 },
  optIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optLabel: { fontSize: 14, marginBottom: 2 },
  optSub: { fontSize: 12 },
});
