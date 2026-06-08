import { useApp } from '@/context/AppContext';
import { GOLD } from '@/constants/colors';

export function useTC() {
  const { theme } = useApp();
  const d = theme === 'dark';
  return {
    isDark: d,
    bg:              d ? '#000000' : '#F7F4F0',
    bg2:             d ? '#0D0D0D' : '#FFFFFF',
    bg3:             d ? '#111111' : '#F0ECF7',
    card:            d ? '#0D0D0D' : '#FFFFFF',
    card2:           d ? '#111111' : '#F4F1FA',
    text:            d ? '#FFFFFF' : '#1A1A2E',
    text2:           d ? '#B3B3B3' : '#4B5563',
    text3:           d ? '#777777' : '#9CA3AF',
    muted:           d ? '#555555' : '#D1D5DB',
    border:          d ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)',
    border2:         d ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)',
    headerBg:        d ? 'rgba(0,0,0,0.92)' : 'rgba(247,244,240,0.95)',
    navBg:           d ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.97)',
    inputBg:         d ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    overlay:         d ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)',
    tagBg:           d ? 'rgba(255,255,255,0.07)' : 'rgba(108,79,187,0.07)',
    gold10:          'rgba(212,175,55,0.1)',
    gold20:          'rgba(212,175,55,0.2)',
    accent:          d ? GOLD      : '#6C4FBB',
    accentGradColors: d ? [GOLD, '#C9A000'] as [string,string] : ['#45C4B0', '#6C4FBB'] as [string,string],
    accentShadow:    d ? 'rgba(212,175,55,0.35)' : 'rgba(108,79,187,0.22)',
    accentTeal:      d ? GOLD      : '#4ECDC4',
    chipBg:          d ? 'rgba(255,255,255,0.07)' : 'rgba(108,79,187,0.07)',
    chipColor:       d ? '#777777' : '#6C4FBB',
    chipActiveBg:    d ? GOLD      : '#4ECDC4',
    chipActiveColor: d ? '#000000' : '#FFFFFF',
    authSheet:       d ? '#0D0D0D' : '#FFFFFF',
    authText:        d ? '#FFFFFF' : '#1A1A2E',
    authSub:         d ? '#999999' : '#6B7280',
    authInputBg:     d ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    authBorder:      d ? 'rgba(255,255,255,0.15)' : '#E5E7EB',
    authIcon:        d ? '#888888' : '#9CA3AF',
    authDivider:     d ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
    authDivText:     d ? '#666666' : '#9CA3AF',
    authSocialBg:    d ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
    authSocialBd:    d ? 'rgba(255,255,255,0.1)'  : '#E5E7EB',
    authSocialText:  d ? '#999999' : '#6B7280',
    authTabBg:       d ? 'rgba(255,255,255,0.05)' : '#F3F0F9',
    authTabBd:       d ? 'rgba(255,255,255,0.1)'  : '#E0D9F5',
    authTabActive:   d ? GOLD : '#6C4FBB',
    authTabActTxt:   d ? '#000000' : '#FFFFFF',
    authTabInTxt:    d ? '#777777' : '#9CA3AF',
  };
}

export { useTC as useTheme };
