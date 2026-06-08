# SA PLUG — Deployment Guide

## Files in This Repo

| File | Purpose |
|------|---------|
| `sa-plug-backend.tar.gz` | Pre-built backend for Hostinger Node.js |
| `artifacts/sa-plug-mobile/eas.json` | EAS Build config for App Store / Play Store |
| `artifacts/sa-plug-mobile/app.json` | Expo app production configuration |

---

## 1. Hostinger Node.js Deployment

### Step 1 — Upload the bundle
Upload `sa-plug-backend.tar.gz` to your Hostinger Node.js hosting and extract it.

```bash
tar -xzf sa-plug-backend.tar.gz
```

### Step 2 — Set Environment Variables in Hostinger Dashboard

Go to **Hostinger → Hosting → Node.js → Environment Variables** and set:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname` |
| `SESSION_SECRET` | 64-character random string |
| `JWT_SECRET` | 64-character random string |
| `NODE_ENV` | `production` |
| `PORT` | `8080` (Hostinger assigns this automatically) |
| `STRIPE_SECRET_KEY` | `sk_live_...` (when ready) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (when ready) |

### Step 3 — Hostinger Configuration

In Hostinger control panel:
- **Node.js version**: 20.x or 22.x
- **Entry point**: `dist/index.mjs`
- **Start command**: `node dist/index.mjs`
- **Build command**: *(leave empty — already pre-built)*

### Step 4 — Database Setup

1. Create a PostgreSQL database in Hostinger
2. Copy the `DATABASE_URL` connection string
3. The app auto-creates all tables on first start (Drizzle ORM migrations run automatically)

### Step 5 — Stripe Webhook

After deploying, in your Stripe Dashboard:
1. Go to **Developers → Webhooks → Add endpoint**
2. URL: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET`

---

## 2. Google Play Store (Android)

### Requirements
- Google Play Developer Account ($25 one-time fee)
- EAS account (free at expo.dev)

### Steps

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure project (run once)
eas build:configure

# 4. Update eas.json — set your API URL
# In artifacts/sa-plug-mobile/eas.json, change:
# "EXPO_PUBLIC_API_URL": "https://your-hostinger-domain.com"

# 5. Build Android App Bundle (AAB) for Play Store
cd artifacts/sa-plug-mobile
eas build --platform android --profile production

# 6. Submit to Play Store
eas submit --platform android --profile production
```

### Play Store Listing Requirements
- App name: **SA PLUG**
- Package: `com.saplug.mobile`
- Category: Entertainment / Lifestyle
- Content rating: 18+ (alcohol references)
- Screenshots: At least 2 phone screenshots (min 1080x1920)
- Feature graphic: 1024x500 PNG
- Privacy Policy URL: Required (host at your domain)

---

## 3. Apple App Store (iOS)

### Requirements
- Apple Developer Account ($99/year)
- Mac computer or EAS Build (cloud)

### Steps

```bash
# 1. Update app.json — add your Apple IDs
# In artifacts/sa-plug-mobile/eas.json, set:
# "appleId": "your@email.com"
# "ascAppId": "your-app-store-connect-numeric-id"
# "appleTeamId": "YOUR10CHAR"

# 2. Build for iOS
cd artifacts/sa-plug-mobile
eas build --platform ios --profile production

# 3. Submit to App Store
eas submit --platform ios --profile production
```

### App Store Listing Requirements
- App name: **SA PLUG**
- Bundle ID: `com.saplug.mobile`
- Category: Entertainment
- Age Rating: 17+ (alcohol, nightlife)
- Screenshots: 6.7" and 6.1" iPhone screenshots required
- App Preview video: Optional but recommended
- Privacy Policy URL: Required

### Required Info.plist Permissions (already in app.json)
- Camera (QR scanning)
- Photo Library (save QR codes)
- Location (find nearby venues)
- Calendar (add booking events)
- Notifications (booking confirmations)

---

## 4. Firebase Setup (Push Notifications)

1. Create project at **console.firebase.google.com**
2. Add Android app → download `google-services.json` → place in `artifacts/sa-plug-mobile/`
3. Add iOS app → download `GoogleService-Info.plist` → place in `artifacts/sa-plug-mobile/`
4. In Admin Panel → Settings → Firebase Configuration → paste your project credentials
5. Enable **Cloud Messaging** in Firebase console

---

## 5. Required API Keys Summary

| Service | Where to get | Admin Panel Setting |
|---------|-------------|---------------------|
| Stripe Secret Key | dashboard.stripe.com | Environment variable `STRIPE_SECRET_KEY` |
| Stripe Publishable Key | dashboard.stripe.com | Settings → Payment Settings |
| Stripe Webhook Secret | dashboard.stripe.com/webhooks | Environment variable `STRIPE_WEBHOOK_SECRET` |
| Firebase Project ID | console.firebase.google.com | Settings → Firebase Configuration |
| Firebase API Key | console.firebase.google.com | Settings → Firebase Configuration |
| Firebase Auth Domain | console.firebase.google.com | Settings → Firebase Configuration |

---

## 6. Seed Initial Data

To populate the database with initial content after deployment:

```bash
# In Hostinger, run this via SSH or the Hostinger terminal:
# The database is automatically seeded with SA nightlife content
# when you run the seed script (already done in development)

# Or POST to admin API to add content manually via Admin Panel
```

---

## Support

Admin Panel: `https://yourdomain.com/admin-panel/`
API Base: `https://yourdomain.com/api/`
Health Check: `https://yourdomain.com/api/healthz`
