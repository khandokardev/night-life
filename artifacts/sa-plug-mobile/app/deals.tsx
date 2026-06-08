import { useTC } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEB_TOP = Platform.OS === 'web' ? 67 : 0;

const DEALS = [
  { id: 101, name: 'VIP Table + 2 Bottles', venue: 'Onyx Sandton', orig: 6500, sale: 4500, label: 'FLASH DEAL', img: 'https://picsum.photos/seed/onyx-vip/800/400' },
  { id: 102, name: 'Safari Weekend Package', venue: 'Kruger National Park', orig: 8500, sale: 5999, label: 'WEEKEND SPECIAL', img: 'https://picsum.photos/seed/safari-deal/800/400' },
  { id: 103, name: 'Helicopter + Wine Tasting', venue: 'Cape Town', orig: 7200, sale: 5200, label: 'COMBO DEAL', img: 'https://picsum.photos/seed/heli-wine/800/400' },
  { id: 104, name: 'Yacht Half Day', venue: 'V&A Waterfront', orig: 4200, sale: 2800, label: 'LAST SPOT', img: 'https://picsum.photos/seed/yacht-deal/800/400' },
  { id: 105, name: 'Fine Dining for 2', venue: 'Marble Restaurant', orig: 3500, sale: 2200, label: 'DATE NIGHT', img: 'https://picsum.photos/seed/dining-deal/800/400' },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function DealsScreen() {
  const tc = useTC();
  const insets = useSafeAreaInsets();
  const { addToCart } = useApp();
  const [added, setAdded] = useState<number[]>([]);
  const [secs, setSecs] = useState(2 * 3600 + 45 * 60 + 30);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  const handleAdd = (deal: typeof DEALS[0]) => {
    addToCart({ id: deal.id, name: deal.name, price: deal.sale, venue: deal.venue });
    setAdded(prev => [...prev, deal.id]);
  };

  return (
    <View style={[styles.root, { backgroundColor: tc.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + WEB_TOP, backgroundColor: tc.headerBg, borderBottomColor: tc.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={tc.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>Flash Deals</Text>
          <View style={styles.timerRow}>
            <Feather name="zap" size={12} color="#f87171" />
            <Text style={[styles.timerTxt, { fontFamily: 'Poppins_700Bold' }]}>
              Ends in {pad(h)}:{pad(m)}:{pad(s)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 30, gap: 14 }}>
        {DEALS.map(deal => {
          const pct = Math.round((1 - deal.sale / deal.orig) * 100);
          const isAdded = added.includes(deal.id);
          return (
            <View key={deal.id} style={[styles.card, { backgroundColor: tc.card, borderColor: tc.border }]}>
              <View style={styles.imgWrap}>
                <Image source={{ uri: deal.img }} style={styles.img} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.imgGrad} />
                <View style={styles.badges}>
                  <View style={[styles.labelBadge, { backgroundColor: tc.accentTeal }]}>
                    <Text style={[styles.badgeTxt, { fontFamily: 'Poppins_700Bold' }]}>{deal.label}</Text>
                  </View>
                  <View style={styles.pctBadge}>
                    <Text style={[styles.badgeTxt, { fontFamily: 'Poppins_700Bold' }]}>-{pct}% OFF</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.dealName, { color: tc.text, fontFamily: 'Poppins_700Bold' }]}>{deal.name}</Text>
                <View style={styles.venueRow}>
                  <Feather name="map-pin" size={10} color={tc.text3} />
                  <Text style={[styles.venueTxt, { color: tc.text2, fontFamily: 'Inter_400Regular' }]}>{deal.venue}</Text>
                </View>
                <View style={styles.priceRow}>
                  <View>
                    <Text style={[styles.origPrice, { color: tc.text3, fontFamily: 'Inter_400Regular' }]}>R{deal.orig.toLocaleString()}</Text>
                    <Text style={[styles.salePrice, { color: tc.accent, fontFamily: 'Poppins_700Bold' }]}>R{deal.sale.toLocaleString()}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => !isAdded && handleAdd(deal)}
                    style={[styles.addBtn, isAdded
                      ? { backgroundColor: 'rgba(34,197,94,0.15)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.5)' }
                      : {}
                    ]}
                    activeOpacity={0.85}
                  >
                    {isAdded ? (
                      <>
                        <LinearGradient colors={['transparent', 'transparent']} style={StyleSheet.absoluteFill} />
                        <Feather name="check" size={14} color="#22c55e" />
                        <Text style={[styles.addBtnTxt, { color: '#22c55e', fontFamily: 'Poppins_700Bold' }]}>Added</Text>
                      </>
                    ) : (
                      <LinearGradient colors={tc.accentGradColors} style={styles.addBtnGrad} start={{ x: 0.07, y: 0 }} end={{ x: 0.93, y: 1 }}>
                        <Feather name="plus" size={14} color={tc.isDark ? '#000' : '#fff'} />
                        <Text style={[styles.addBtnTxt, { color: tc.isDark ? '#000' : '#fff', fontFamily: 'Poppins_700Bold' }]}>Add to Cart</Text>
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14, paddingTop: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  timerTxt: { color: '#f87171', fontSize: 12 },
  card: { borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  imgWrap: { height: 150, position: 'relative' },
  img: { width: '100%', height: 150 },
  imgGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  badges: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 6 },
  labelBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pctBadge: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeTxt: { color: '#fff', fontSize: 9 },
  cardBody: { padding: 14 },
  dealName: { fontSize: 15, marginBottom: 4 },
  venueRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  venueTxt: { fontSize: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  origPrice: { fontSize: 12, textDecorationLine: 'line-through' },
  salePrice: { fontSize: 20 },
  addBtn: { borderRadius: 12, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 6 },
  addBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  addBtnTxt: { fontSize: 13 },
});
