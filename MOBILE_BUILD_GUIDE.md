# SA PLUG — Mobile App Build Guide
# Play Store (Android) + App Store (iOS)

---

## BEFORE YOU START — What You Need

| Requirement | Where to get it | Cost |
|---|---|---|
| Node.js 20+ installed on your computer | nodejs.org | Free |
| Expo account | expo.dev | Free |
| Google Play Developer account | play.google.com/console | $25 once |
| Apple Developer account (iOS only) | developer.apple.com | $99/year |
| Your Hostinger domain live | (deploy backend first) | — |

---

## STEP 1 — Set Your Live API URL

Before building, open `eas.json` and replace `your-hostinger-domain.com` with your actual domain:

```json
"env": {
  "EXPO_PUBLIC_API_URL": "https://yourdomain.hostinger.com"
}
```

Do this in ALL three build profiles (preview, production-android, production-ios).

---

## STEP 2 — Install EAS CLI on Your Computer

```bash
npm install -g eas-cli
```

---

## STEP 3 — Login to Expo

```bash
eas login
```

Enter your expo.dev email and password.

---

## STEP 4 — Link the Project

```bash
cd artifacts/sa-plug-mobile
eas build:configure
```

This creates your EAS project ID. Copy the ID and paste it into `app.json`:
```json
"extra": {
  "eas": {
    "projectId": "PASTE-YOUR-PROJECT-ID-HERE"
  }
}
```

---

## ANDROID — Google Play Store

### Build APK (for testing / sideloading)
```bash
cd artifacts/sa-plug-mobile
eas build --platform android --profile preview
```
This gives you an `.apk` file you can install directly on any Android phone.

### Build AAB (for Play Store submission)
```bash
cd artifacts/sa-plug-mobile
eas build --platform android --profile production-android
```
This gives you an `.aab` file to upload to Google Play Console.

### Submit to Play Store automatically
```bash
eas submit --platform android --profile production-android
```
(Requires `google-play-service-account.json` — see Play Console → Setup → API access)

### Manual Play Store Upload (easier)
1. Go to play.google.com/console
2. Create new app → SA PLUG
3. Production → Create new release → Upload the `.aab` file
4. Fill in store listing (description, screenshots, etc.)
5. Submit for review

### Play Store Listing Requirements
- **App name**: SA PLUG
- **Package**: com.saplug.mobile
- **Category**: Entertainment
- **Content rating**: 18+ (alcohol, nightlife)
- **Minimum screenshots**: 2 phone screenshots (1080x1920px)
- **Feature graphic**: 1024x500px PNG
- **Privacy Policy URL**: Required — host at your domain

---

## iOS — Apple App Store

### Prerequisites
- Mac computer OR use EAS cloud build (no Mac needed)
- Apple Developer account ($99/year at developer.apple.com)
- Create your app in App Store Connect first

### Fill in your Apple details in eas.json:
```json
"submit": {
  "production-ios": {
    "ios": {
      "appleId": "your@email.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD1234EF"
    }
  }
}
```

Find your Team ID at: developer.apple.com → Account → Membership

### Build for App Store
```bash
cd artifacts/sa-plug-mobile
eas build --platform ios --profile production-ios
```

### Submit to App Store
```bash
eas submit --platform ios --profile production-ios
```

### App Store Listing Requirements
- **App name**: SA PLUG
- **Bundle ID**: com.saplug.mobile
- **Category**: Entertainment
- **Age rating**: 17+ (alcohol/nightlife content)
- **Screenshots required**: 6.7" iPhone + 6.1" iPhone sizes
- **Privacy Policy URL**: Required
- **Keywords**: nightlife, clubs, SA, luxury, bookings, events

---

## QUICK REFERENCE COMMANDS

```bash
# Test APK (Android — no store account needed)
eas build --platform android --profile preview

# Production Android (Play Store AAB)
eas build --platform android --profile production-android

# Production iOS (App Store)
eas build --platform ios --profile production-ios

# Check build status
eas build:list

# Download built file
eas build:view
```

---

## WHERE TO FIND YOUR BUILT FILES

After `eas build` completes:
1. Go to expo.dev → Projects → SA PLUG → Builds
2. Download your `.apk` (Android test) or `.aab` (Play Store) or `.ipa` (iOS)
3. Upload to your respective store console

---

## NEED HELP?

- EAS Build docs: docs.expo.dev/build/introduction
- Play Console help: support.google.com/googleplay/android-developer
- App Store Connect help: developer.apple.com/help/app-store-connect
