import { Alert, Linking, Platform } from 'react-native';

/**
 * Open a map app to navigate to the given address/query.
 *
 * - Native iOS: tries apple maps first (maps:?q=...), falls back to Google Maps URL.
 * - Native Android: uses geo:// intent, falls back to Google Maps URL.
 * - Web: opens maps.google.com in a new tab.
 */
export async function openMap(query: string): Promise<void> {
  const encoded = encodeURIComponent(query);
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  const nativeUrl =
    Platform.OS === 'ios' ? `maps:?q=${encoded}` : `geo:0,0?q=${encoded}`;

  if (Platform.OS !== 'web') {
    try {
      const supported = await Linking.canOpenURL(nativeUrl);
      if (supported) {
        await Linking.openURL(nativeUrl);
        return;
      }
    } catch {}
    try {
      await Linking.openURL(googleUrl);
    } catch {
      Alert.alert('Location', query, [{ text: 'OK' }]);
    }
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).open(googleUrl, '_blank');
  } catch {
    Alert.alert('Location', query, [{ text: 'OK' }]);
  }
}

/**
 * Open a phone dialer reliably across platforms.
 *
 * - Native: Linking.openURL('tel:...') with canOpenURL check + Alert fallback.
 * - Web: window.location.href = 'tel:...' which works in mobile browsers and
 *   inside iframes (avoids the window.open popup-blocker that affects Linking on web).
 *   Falls back to an Alert showing the number to copy if the browser can't dial.
 */
export async function openCall(phoneNumber: string): Promise<void> {
  const url = `tel:${phoneNumber}`;

  if (Platform.OS !== 'web') {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Call Venue', `Dial this number:\n${phoneNumber}`, [{ text: 'OK' }]);
      }
    } catch {
      Alert.alert('Call Venue', `Dial this number:\n${phoneNumber}`, [{ text: 'OK' }]);
    }
    return;
  }

  try {
    window.location.href = url;
  } catch {
    // ignore — on desktop this throws, handled below
  }
  setTimeout(() => {
    Alert.alert('Call Venue', `Dial this number:\n${phoneNumber}`, [{ text: 'OK' }]);
  }, 300);
}

/**
 * Open an email client reliably across platforms.
 */
export async function openEmail(address: string): Promise<void> {
  const url = `mailto:${address}`;

  if (Platform.OS !== 'web') {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Email', address, [{ text: 'OK' }]);
      }
    } catch {
      Alert.alert('Email', address, [{ text: 'OK' }]);
    }
    return;
  }

  try {
    window.location.href = url;
  } catch {
    Alert.alert('Email', address, [{ text: 'OK' }]);
  }
}
