import { Platform, Share } from 'react-native';

/**
 * Share text content. Works on web and native.
 */
export async function shareContent(opts: { title: string; message: string }) {
  try {
    await Share.share({ title: opts.title, message: opts.message });
  } catch {
    // user dismissed — not an error
  }
}

/**
 * Share a booking QR code image + text summary.
 * Native: downloads QR → native share sheet with image file.
 * Web: falls back to text share (browsers restrict image sharing from URLs).
 */
export async function shareQR(opts: {
  qrUrl: string;
  refCode: string;
  title: string;
  message: string;
}) {
  if (Platform.OS === 'web') {
    await shareContent({ title: opts.title, message: opts.message });
    return;
  }
  try {
    const FileSystem = await import('expo-file-system/legacy');
    const Sharing   = await import('expo-sharing');
    const localPath = `${FileSystem.cacheDirectory}saplug-qr-${opts.refCode}.png`;
    const { status } = await FileSystem.downloadAsync(opts.qrUrl, localPath);
    if (status !== 200) throw new Error('QR download failed');
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(localPath, {
        mimeType: 'image/png',
        dialogTitle: opts.title,
        UTI: 'public.png',
      });
    } else {
      await shareContent({ title: opts.title, message: opts.message });
    }
  } catch {
    await shareContent({ title: opts.title, message: opts.message });
  }
}
