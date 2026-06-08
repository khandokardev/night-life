import { Alert, Platform } from 'react-native';

export interface QRDataOpts {
  ref: string;
  venue: string;
  date?: string;
  time?: string;
  guests?: string;
  type?: string;
}

export function buildQRData(opts: QRDataOpts): string {
  const parts = [
    `APP:SAPLUG`,
    `REF:${opts.ref}`,
    `VENUE:${opts.venue}`,
    opts.date   ? `DATE:${opts.date}`  : '',
    opts.time   ? `TIME:${opts.time}`  : '',
    opts.guests ? `PAX:${opts.guests}` : '',
    opts.type   ? `TYPE:${opts.type}`  : '',
  ].filter(Boolean);
  return parts.join('|');
}

export function buildQRUrl(data: string): string {
  return (
    `https://api.qrserver.com/v1/create-qr-code/` +
    `?size=400x400` +
    `&data=${encodeURIComponent(data)}` +
    `&margin=20` +
    `&bgcolor=ffffff` +
    `&color=1A1A1A` +
    `&ecc=M`
  );
}

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4,  Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function parseBookingDateTime(dateStr: string, timeStr: string): Date | null {
  const clean = dateStr.replace(/^[A-Za-z]+,\s*/, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length < 3) return null;

  const day   = parseInt(parts[0], 10);
  const month = MONTHS[parts[1]];
  const year  = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;

  const timeParts = timeStr.trim().split(/[:\s]+/);
  let hours      = parseInt(timeParts[0] ?? '0', 10);
  const minutes  = parseInt(timeParts[1] ?? '0', 10);
  const meridiem = (timeParts[2] ?? '').toLowerCase();
  if (meridiem === 'pm' && hours !== 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;
  if (isNaN(hours) || isNaN(minutes)) return null;

  return new Date(year, month, day, hours, minutes);
}

/**
 * Save a QR code on web via canvas → data-URL → <a download>.
 * Falls back to opening in a new tab if CORS or canvas fails.
 * Returns true when a download was triggered, false when new-tab fallback used.
 */
export async function saveQRWeb(qrUrl: string, refCode: string): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth  || 400;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) { fallback(); return; }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          if (!blob) { fallback(); return; }
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const a = document.createElement('a');
            a.href     = dataUrl;
            a.download = `sa-plug-qr-${refCode}.png`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => document.body.removeChild(a), 500);
            resolve(true);
          };
          reader.onerror = () => { fallback(); };
          reader.readAsDataURL(blob);
        }, 'image/png');
      } catch {
        fallback();
      }
    };

    img.onerror = () => { fallback(); };

    function fallback() {
      const opened = window.open(qrUrl, '_blank', 'noopener,noreferrer');
      resolve(!!opened);
    }

    img.src = qrUrl;
  });
}

/**
 * Save QR code to device gallery (native) or trigger download (web).
 * Shows its own Alerts for permission denial and errors.
 * Returns 'saved' | 'denied' | 'error'.
 */
export async function saveQR(
  qrUrl: string,
  refCode: string,
): Promise<'saved' | 'denied' | 'error'> {
  if (Platform.OS === 'web') {
    const ok = await saveQRWeb(qrUrl, refCode);
    if (!ok) {
      Alert.alert('QR Code', 'Opened in a new tab — long-press the image to save it.');
    } else {
      Alert.alert('QR Saved!', 'Your QR code download has started.');
    }
    return ok ? 'saved' : 'error';
  }

  try {
    const [MediaLibrary, FileSystem] = await Promise.all([
      import('expo-media-library'),
      import('expo-file-system/legacy'),
    ]);

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'SA PLUG needs photo library access to save your QR code. Please enable it in Settings.',
        [{ text: 'OK', style: 'cancel' }],
      );
      return 'denied';
    }

    const filename  = `saplug-qr-${refCode}.png`;
    const localPath = `${FileSystem.cacheDirectory}${filename}`;

    const { status: dlStatus } = await FileSystem.downloadAsync(qrUrl, localPath);
    if (dlStatus !== 200) throw new Error(`QR download failed with HTTP ${dlStatus}`);

    await MediaLibrary.saveToLibraryAsync(localPath);

    Alert.alert(
      'QR Code Saved!',
      'Your entry QR code has been saved to your gallery.',
      [{ text: 'Great!', style: 'cancel' }],
    );
    return 'saved';
  } catch (err) {
    console.warn('[SA PLUG] QR save error:', err);
    Alert.alert(
      'Save Failed',
      'Could not save the QR code. Check your connection and try again.',
      [{ text: 'OK', style: 'cancel' }],
    );
    return 'error';
  }
}

/**
 * Add a booking event to the device's native calendar.
 * Native (Android / iOS): creates the event directly via expo-calendar.
 * Web: opens Google Calendar in a new tab.
 */
export async function openCalendar(opts: {
  title: string;
  dateStr: string;
  timeStr: string;
  refCode: string;
  venue: string;
}): Promise<void> {
  const start = parseBookingDateTime(opts.dateStr, opts.timeStr);
  if (!start) {
    Alert.alert('Error', 'Could not read the booking date. Please check your booking details.');
    return;
  }
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  if (Platform.OS === 'web') {
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const url = [
      'https://calendar.google.com/calendar/render?action=TEMPLATE',
      `&text=${encodeURIComponent(opts.title)}`,
      `&dates=${fmt(start)}/${fmt(end)}`,
      `&details=${encodeURIComponent(`Booking Ref: ${opts.refCode}\nSA PLUG VIP Experience`)}`,
      `&location=${encodeURIComponent(opts.venue)}`,
    ].join('');
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) Alert.alert('Add to Calendar', 'Pop-up blocked. Open this link:\n' + url);
    return;
  }

  try {
    const Calendar = await import('expo-calendar');

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Calendar Access Required',
        'SA PLUG needs calendar access to add your booking event. Please enable it in Settings.',
        [{ text: 'OK', style: 'cancel' }],
      );
      return;
    }

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const target    = calendars.find(c => c.allowsModifications) ?? null;

    if (!target) {
      Alert.alert(
        'No Writable Calendar',
        'No editable calendar was found on this device. Please add a calendar account first.',
        [{ text: 'OK', style: 'cancel' }],
      );
      return;
    }

    await Calendar.createEventAsync(target.id, {
      title:    opts.title,
      startDate: start,
      endDate:   end,
      location:  opts.venue,
      notes:     `Booking Ref: ${opts.refCode}\nSA PLUG VIP Experience`,
      alarms:    [{ relativeOffset: -60 }],
      timeZone:  Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    Alert.alert(
      'Added to Calendar!',
      `"${opts.title}" has been added to your calendar with a 1-hour reminder.`,
      [{ text: 'Done', style: 'cancel' }],
    );
  } catch (err) {
    console.warn('[SA PLUG] Calendar error:', err);
    Alert.alert(
      'Calendar Error',
      'Could not add the event to your calendar. Please try again.',
      [{ text: 'OK', style: 'cancel' }],
    );
  }
}
