import { Feather } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import {
  FlatList, Modal, Platform, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOLD } from '@/constants/colors';

export const COUNTRIES = [
  { code: '+93',   flag: '🇦🇫', name: 'Afghanistan',                    iso: 'AF' },
  { code: '+355',  flag: '🇦🇱', name: 'Albania',                        iso: 'AL' },
  { code: '+213',  flag: '🇩🇿', name: 'Algeria',                        iso: 'DZ' },
  { code: '+376',  flag: '🇦🇩', name: 'Andorra',                        iso: 'AD' },
  { code: '+244',  flag: '🇦🇴', name: 'Angola',                         iso: 'AO' },
  { code: '+54',   flag: '🇦🇷', name: 'Argentina',                      iso: 'AR' },
  { code: '+374',  flag: '🇦🇲', name: 'Armenia',                        iso: 'AM' },
  { code: '+61',   flag: '🇦🇺', name: 'Australia',                      iso: 'AU' },
  { code: '+43',   flag: '🇦🇹', name: 'Austria',                        iso: 'AT' },
  { code: '+994',  flag: '🇦🇿', name: 'Azerbaijan',                     iso: 'AZ' },
  { code: '+1242', flag: '🇧🇸', name: 'Bahamas',                        iso: 'BS' },
  { code: '+973',  flag: '🇧🇭', name: 'Bahrain',                        iso: 'BH' },
  { code: '+880',  flag: '🇧🇩', name: 'Bangladesh',                     iso: 'BD' },
  { code: '+1246', flag: '🇧🇧', name: 'Barbados',                       iso: 'BB' },
  { code: '+375',  flag: '🇧🇾', name: 'Belarus',                        iso: 'BY' },
  { code: '+32',   flag: '🇧🇪', name: 'Belgium',                        iso: 'BE' },
  { code: '+55',   flag: '🇧🇷', name: 'Brazil',                         iso: 'BR' },
  { code: '+359',  flag: '🇧🇬', name: 'Bulgaria',                       iso: 'BG' },
  { code: '+1',    flag: '🇨🇦', name: 'Canada',                         iso: 'CA' },
  { code: '+56',   flag: '🇨🇱', name: 'Chile',                          iso: 'CL' },
  { code: '+86',   flag: '🇨🇳', name: 'China',                          iso: 'CN' },
  { code: '+57',   flag: '🇨🇴', name: 'Colombia',                       iso: 'CO' },
  { code: '+506',  flag: '🇨🇷', name: 'Costa Rica',                     iso: 'CR' },
  { code: '+385',  flag: '🇭🇷', name: 'Croatia',                        iso: 'HR' },
  { code: '+53',   flag: '🇨🇺', name: 'Cuba',                           iso: 'CU' },
  { code: '+357',  flag: '🇨🇾', name: 'Cyprus',                         iso: 'CY' },
  { code: '+420',  flag: '🇨🇿', name: 'Czech Republic',                 iso: 'CZ' },
  { code: '+45',   flag: '🇩🇰', name: 'Denmark',                        iso: 'DK' },
  { code: '+20',   flag: '🇪🇬', name: 'Egypt',                          iso: 'EG' },
  { code: '+372',  flag: '🇪🇪', name: 'Estonia',                        iso: 'EE' },
  { code: '+268',  flag: '🇸🇿', name: 'Eswatini',                       iso: 'SZ' },
  { code: '+251',  flag: '🇪🇹', name: 'Ethiopia',                       iso: 'ET' },
  { code: '+358',  flag: '🇫🇮', name: 'Finland',                        iso: 'FI' },
  { code: '+33',   flag: '🇫🇷', name: 'France',                         iso: 'FR' },
  { code: '+995',  flag: '🇬🇪', name: 'Georgia',                        iso: 'GE' },
  { code: '+49',   flag: '🇩🇪', name: 'Germany',                        iso: 'DE' },
  { code: '+233',  flag: '🇬🇭', name: 'Ghana',                          iso: 'GH' },
  { code: '+30',   flag: '🇬🇷', name: 'Greece',                         iso: 'GR' },
  { code: '+504',  flag: '🇭🇳', name: 'Honduras',                       iso: 'HN' },
  { code: '+852',  flag: '🇭🇰', name: 'Hong Kong',                      iso: 'HK' },
  { code: '+36',   flag: '🇭🇺', name: 'Hungary',                        iso: 'HU' },
  { code: '+354',  flag: '🇮🇸', name: 'Iceland',                        iso: 'IS' },
  { code: '+91',   flag: '🇮🇳', name: 'India',                          iso: 'IN' },
  { code: '+62',   flag: '🇮🇩', name: 'Indonesia',                      iso: 'ID' },
  { code: '+98',   flag: '🇮🇷', name: 'Iran',                           iso: 'IR' },
  { code: '+964',  flag: '🇮🇶', name: 'Iraq',                           iso: 'IQ' },
  { code: '+353',  flag: '🇮🇪', name: 'Ireland',                        iso: 'IE' },
  { code: '+972',  flag: '🇮🇱', name: 'Israel',                         iso: 'IL' },
  { code: '+39',   flag: '🇮🇹', name: 'Italy',                          iso: 'IT' },
  { code: '+225',  flag: '🇨🇮', name: 'Ivory Coast',                    iso: 'CI' },
  { code: '+1876', flag: '🇯🇲', name: 'Jamaica',                        iso: 'JM' },
  { code: '+81',   flag: '🇯🇵', name: 'Japan',                          iso: 'JP' },
  { code: '+962',  flag: '🇯🇴', name: 'Jordan',                         iso: 'JO' },
  { code: '+7',    flag: '🇰🇿', name: 'Kazakhstan',                     iso: 'KZ' },
  { code: '+254',  flag: '🇰🇪', name: 'Kenya',                          iso: 'KE' },
  { code: '+965',  flag: '🇰🇼', name: 'Kuwait',                         iso: 'KW' },
  { code: '+371',  flag: '🇱🇻', name: 'Latvia',                         iso: 'LV' },
  { code: '+961',  flag: '🇱🇧', name: 'Lebanon',                        iso: 'LB' },
  { code: '+266',  flag: '🇱🇸', name: 'Lesotho',                        iso: 'LS' },
  { code: '+231',  flag: '🇱🇷', name: 'Liberia',                        iso: 'LR' },
  { code: '+370',  flag: '🇱🇹', name: 'Lithuania',                      iso: 'LT' },
  { code: '+352',  flag: '🇱🇺', name: 'Luxembourg',                     iso: 'LU' },
  { code: '+261',  flag: '🇲🇬', name: 'Madagascar',                     iso: 'MG' },
  { code: '+265',  flag: '🇲🇼', name: 'Malawi',                         iso: 'MW' },
  { code: '+60',   flag: '🇲🇾', name: 'Malaysia',                       iso: 'MY' },
  { code: '+223',  flag: '🇲🇱', name: 'Mali',                           iso: 'ML' },
  { code: '+356',  flag: '🇲🇹', name: 'Malta',                          iso: 'MT' },
  { code: '+222',  flag: '🇲🇷', name: 'Mauritania',                     iso: 'MR' },
  { code: '+230',  flag: '🇲🇺', name: 'Mauritius',                      iso: 'MU' },
  { code: '+52',   flag: '🇲🇽', name: 'Mexico',                         iso: 'MX' },
  { code: '+373',  flag: '🇲🇩', name: 'Moldova',                        iso: 'MD' },
  { code: '+377',  flag: '🇲🇨', name: 'Monaco',                         iso: 'MC' },
  { code: '+212',  flag: '🇲🇦', name: 'Morocco',                        iso: 'MA' },
  { code: '+258',  flag: '🇲🇿', name: 'Mozambique',                     iso: 'MZ' },
  { code: '+95',   flag: '🇲🇲', name: 'Myanmar',                        iso: 'MM' },
  { code: '+264',  flag: '🇳🇦', name: 'Namibia',                        iso: 'NA' },
  { code: '+977',  flag: '🇳🇵', name: 'Nepal',                          iso: 'NP' },
  { code: '+31',   flag: '🇳🇱', name: 'Netherlands',                    iso: 'NL' },
  { code: '+64',   flag: '🇳🇿', name: 'New Zealand',                    iso: 'NZ' },
  { code: '+234',  flag: '🇳🇬', name: 'Nigeria',                        iso: 'NG' },
  { code: '+47',   flag: '🇳🇴', name: 'Norway',                         iso: 'NO' },
  { code: '+968',  flag: '🇴🇲', name: 'Oman',                           iso: 'OM' },
  { code: '+92',   flag: '🇵🇰', name: 'Pakistan',                       iso: 'PK' },
  { code: '+507',  flag: '🇵🇦', name: 'Panama',                         iso: 'PA' },
  { code: '+595',  flag: '🇵🇾', name: 'Paraguay',                       iso: 'PY' },
  { code: '+51',   flag: '🇵🇪', name: 'Peru',                           iso: 'PE' },
  { code: '+63',   flag: '🇵🇭', name: 'Philippines',                    iso: 'PH' },
  { code: '+48',   flag: '🇵🇱', name: 'Poland',                         iso: 'PL' },
  { code: '+351',  flag: '🇵🇹', name: 'Portugal',                       iso: 'PT' },
  { code: '+974',  flag: '🇶🇦', name: 'Qatar',                          iso: 'QA' },
  { code: '+40',   flag: '🇷🇴', name: 'Romania',                        iso: 'RO' },
  { code: '+7',    flag: '🇷🇺', name: 'Russia',                         iso: 'RU' },
  { code: '+250',  flag: '🇷🇼', name: 'Rwanda',                         iso: 'RW' },
  { code: '+966',  flag: '🇸🇦', name: 'Saudi Arabia',                   iso: 'SA' },
  { code: '+221',  flag: '🇸🇳', name: 'Senegal',                        iso: 'SN' },
  { code: '+381',  flag: '🇷🇸', name: 'Serbia',                         iso: 'RS' },
  { code: '+232',  flag: '🇸🇱', name: 'Sierra Leone',                   iso: 'SL' },
  { code: '+65',   flag: '🇸🇬', name: 'Singapore',                      iso: 'SG' },
  { code: '+421',  flag: '🇸🇰', name: 'Slovakia',                       iso: 'SK' },
  { code: '+386',  flag: '🇸🇮', name: 'Slovenia',                       iso: 'SI' },
  { code: '+252',  flag: '🇸🇴', name: 'Somalia',                        iso: 'SO' },
  { code: '+27',   flag: '🇿🇦', name: 'South Africa',                   iso: 'ZA' },
  { code: '+82',   flag: '🇰🇷', name: 'South Korea',                    iso: 'KR' },
  { code: '+211',  flag: '🇸🇸', name: 'South Sudan',                    iso: 'SS' },
  { code: '+34',   flag: '🇪🇸', name: 'Spain',                          iso: 'ES' },
  { code: '+94',   flag: '🇱🇰', name: 'Sri Lanka',                      iso: 'LK' },
  { code: '+249',  flag: '🇸🇩', name: 'Sudan',                          iso: 'SD' },
  { code: '+46',   flag: '🇸🇪', name: 'Sweden',                         iso: 'SE' },
  { code: '+41',   flag: '🇨🇭', name: 'Switzerland',                    iso: 'CH' },
  { code: '+963',  flag: '🇸🇾', name: 'Syria',                          iso: 'SY' },
  { code: '+886',  flag: '🇹🇼', name: 'Taiwan',                         iso: 'TW' },
  { code: '+255',  flag: '🇹🇿', name: 'Tanzania',                       iso: 'TZ' },
  { code: '+66',   flag: '🇹🇭', name: 'Thailand',                       iso: 'TH' },
  { code: '+216',  flag: '🇹🇳', name: 'Tunisia',                        iso: 'TN' },
  { code: '+90',   flag: '🇹🇷', name: 'Turkey',                         iso: 'TR' },
  { code: '+256',  flag: '🇺🇬', name: 'Uganda',                         iso: 'UG' },
  { code: '+380',  flag: '🇺🇦', name: 'Ukraine',                        iso: 'UA' },
  { code: '+971',  flag: '🇦🇪', name: 'United Arab Emirates',           iso: 'AE' },
  { code: '+44',   flag: '🇬🇧', name: 'United Kingdom',                 iso: 'GB' },
  { code: '+1',    flag: '🇺🇸', name: 'United States',                  iso: 'US' },
  { code: '+598',  flag: '🇺🇾', name: 'Uruguay',                        iso: 'UY' },
  { code: '+998',  flag: '🇺🇿', name: 'Uzbekistan',                     iso: 'UZ' },
  { code: '+58',   flag: '🇻🇪', name: 'Venezuela',                      iso: 'VE' },
  { code: '+84',   flag: '🇻🇳', name: 'Vietnam',                        iso: 'VN' },
  { code: '+967',  flag: '🇾🇪', name: 'Yemen',                          iso: 'YE' },
  { code: '+260',  flag: '🇿🇲', name: 'Zambia',                         iso: 'ZM' },
  { code: '+263',  flag: '🇿🇼', name: 'Zimbabwe',                       iso: 'ZW' },
];

export type Country = (typeof COUNTRIES)[0];
export const DEFAULT_COUNTRY = COUNTRIES.find(c => c.iso === 'ZA')!;

interface Props {
  selected: Country;
  onChange: (c: Country) => void;
}

export function CountryCodePickerModal({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.includes(q) ||
      c.iso.toLowerCase().includes(q)
    );
  }, [search]);

  const close = () => { setOpen(false); setSearch(''); };

  return (
    <>
      <TouchableOpacity
        style={s.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={s.flag}>{selected.flag}</Text>
        <Text style={s.code}>{selected.code}</Text>
        <Feather name="chevron-down" size={13} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={close}
        statusBarTranslucent
      >
        <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={close} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 24 : 12) }]}>
          {/* Handle */}
          <View style={s.handleWrap}>
            <View style={s.handle} />
          </View>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerTxt}>Select Country Code</Text>
            <TouchableOpacity style={s.closeBtn} onPress={close} activeOpacity={0.8}>
              <Feather name="x" size={15} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={s.searchWrap}>
            <Feather name="search" size={15} color="#666" style={s.searchIcon} />
            <TextInput
              style={s.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search country or dial code…"
              placeholderTextColor="#555"
              autoCorrect={false}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={c => `${c.iso}-${c.code}`}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16 }}
            ListEmptyComponent={
              <Text style={s.empty}>No countries found</Text>
            }
            renderItem={({ item: c }) => {
              const active = selected.iso === c.iso && selected.code === c.code;
              return (
                <TouchableOpacity
                  style={[s.row, active && s.rowActive]}
                  onPress={() => { onChange(c); close(); }}
                  activeOpacity={0.7}
                >
                  <Text style={s.rowFlag}>{c.flag}</Text>
                  <Text style={s.rowCode}>{c.code}</Text>
                  <Text style={s.rowName} numberOfLines={1}>{c.name}</Text>
                  {active && (
                    <View style={s.checkCircle}>
                      <Feather name="check" size={11} color="#000" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  trigger: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, minHeight: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16, flexShrink: 0,
  },
  flag: { fontSize: 20, lineHeight: 24 },
  code: { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#111', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '75%',
  },
  handleWrap: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.08)',
  },
  headerTxt: { color: '#fff', fontSize: 17, fontFamily: 'Poppins_700Bold' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
  },
  searchIcon: { marginLeft: 14 },
  searchInput: {
    flex: 1, height: 44, paddingHorizontal: 10, color: '#fff',
    fontSize: 13, fontFamily: 'Inter_400Regular',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 12,
    borderRadius: 16, marginBottom: 2,
    borderWidth: 1, borderColor: 'transparent',
  },
  rowActive: {
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderColor: 'rgba(212,175,55,0.35)',
  },
  rowFlag: { fontSize: 22, width: 36, textAlign: 'center' },
  rowCode: { width: 52, textAlign: 'right', paddingRight: 12, color: GOLD, fontSize: 12, fontWeight: '700' },
  rowName: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '500' },
  checkCircle: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  empty: { textAlign: 'center', color: '#666', fontSize: 14, paddingVertical: 32 },
});

export default CountryCodePickerModal;
