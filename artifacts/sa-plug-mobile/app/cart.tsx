import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;
const WEB_BOT = Platform.OS === 'web' ? 34 : 0;

export default function CartScreen() {
  const tc = useTC();
  const { cart, cartCount, updateQty, removeFromCart, clearCart, isLoggedIn } = useApp();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Required',
        'Please log in or create an account to proceed to checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => router.push('/(auth)/sign-in') },
        ]
      );
      return;
    }
    router.push('/checkout-details');
  };
  const insets = useSafeAreaInsets();
  const [promo, setPromo] = useState('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = subtotal > 3000 ? 0 : 150;
  const total = subtotal + delivery;

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={tc.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>
            My Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </Text>
          {cartCount > 0 ? (
            <TouchableOpacity onPress={clearCart}>
              <Text style={[styles.clearTxt, { color: '#EF4444', fontFamily: 'Inter_500Medium' }]}>Clear</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 40 }} />}
        </View>
      </View>

      {cart.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: tc.card, borderColor: tc.border }]}>
            <Feather name="shopping-bag" size={42} color={tc.text3} />
          </View>
          <Text style={[styles.emptyTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Your cart is empty</Text>
          <Text style={[styles.emptySub, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>Explore clubs, tours and more</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <LinearGradient colors={tc.accentGradColors} style={styles.emptyBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
              <Text style={[styles.emptyBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Continue Exploring</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
            {cart.map(item => (
              <View key={item.id} style={[styles.cartItem, { backgroundColor: tc.card, borderColor: tc.border }]}>
                <View style={[styles.itemImg, { backgroundColor: tc.bg2 }]}>
                  <Feather name="shopping-bag" size={22} color={tc.accent} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={2}>{item.name}</Text>
                  <Text style={[styles.itemVenue, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>{item.venue}</Text>
                  <Text style={[styles.itemPrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{item.price.toLocaleString()}</Text>
                </View>
                <View style={styles.itemRight}>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
                    <Feather name="trash-2" size={16} color="#EF4444" />
                  </TouchableOpacity>
                  <View style={[styles.qtyRow, { backgroundColor: tc.bg2, borderColor: tc.border }]}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                      <Feather name="minus" size={14} color={tc.text} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyTxt, { color: tc.text, fontFamily: 'Poppins_600SemiBold' }]}>{item.qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                      <Feather name="plus" size={14} color={tc.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Order Summary */}
            <View style={[styles.summary, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <Text style={[styles.summaryTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Order Summary</Text>
              {[
                { label: 'Subtotal', val: `R${subtotal.toLocaleString()}` },
                { label: 'Delivery', val: delivery === 0 ? 'FREE' : `R${delivery}` },
              ].map(row => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{row.label}</Text>
                  <Text style={[styles.summaryVal, { color: row.label === 'Delivery' && delivery === 0 ? '#22C55E' : tc.text, fontFamily: 'Inter_500Medium' }]}>{row.val}</Text>
                </View>
              ))}
              <View style={[styles.divider, { backgroundColor: tc.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Total</Text>
                <Text style={[styles.totalVal, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{total.toLocaleString()}</Text>
              </View>
              {delivery > 0 && (
                <View style={[styles.freeShipNote, { backgroundColor: tc.gold10 }]}>
                  <Feather name="info" size={13} color={tc.accent} />
                  <Text style={[styles.freeShipTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>
                    Add R{(3000 - subtotal).toLocaleString()} more for free delivery
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={[styles.cta, { backgroundColor: tc.bg, borderTopColor: tc.border, paddingBottom: insets.bottom + WEB_BOT + 12 }]}>
            <TouchableOpacity activeOpacity={0.85} style={styles.ctaBtn} onPress={handleCheckout}>
              <LinearGradient colors={tc.accentGradColors} style={styles.ctaBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
                <Feather name="lock" size={16} color={tc.isDark ? '#000' : '#fff'} />
                <Text style={[styles.ctaBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>
                  Checkout · R{total.toLocaleString()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 },
  headerTitle: { fontSize: 18 },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  clearTxt: { fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emptyTitle: { fontSize: 22 },
  emptySub: { fontSize: 15 },
  emptyBtn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  emptyBtnGrad: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14 },
  emptyBtnTxt: { fontSize: 15 },
  cartItem: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 12, alignItems: 'flex-start' },
  itemImg: { width: 52, height: 52, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, lineHeight: 18, marginBottom: 2 },
  itemVenue: { fontSize: 11, marginBottom: 4 },
  itemPrice: { fontSize: 14 },
  itemRight: { alignItems: 'flex-end', gap: 8, marginLeft: 8 },
  removeBtn: { padding: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
  qtyBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  qtyTxt: { width: 28, textAlign: 'center', fontSize: 14 },
  summary: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  summaryTitle: { fontSize: 15, marginBottom: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14 },
  summaryVal: { fontSize: 14 },
  divider: { height: StyleSheet.hairlineWidth },
  totalLabel: { fontSize: 16 },
  totalVal: { fontSize: 18 },
  freeShipNote: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8 },
  freeShipTxt: { fontSize: 12, flex: 1 },
  cta: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingTop: 12 },
  ctaBtn: { borderRadius: 14, overflow: 'hidden' },
  ctaBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14 },
  ctaBtnTxt: { fontSize: 15 },
});
