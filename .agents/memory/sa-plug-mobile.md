---
name: SA PLUG Mobile App
description: Implementation patterns, color system, and architecture decisions for the SA PLUG Expo mobile app.
---

# SA PLUG Mobile App

## Web Reference
- Source of truth: `artifacts/mockup-sandbox/src/components/mockups/sa-plug/App.tsx` (4494 lines)
- Always compare mobile screens against the web reference for any new work.

## Stack
- Expo Router (file-based routing), TypeScript
- `useTC()` from `@/hooks/useTheme` for ALL colors — never hardcode colors except `GOLD=#D4AF37`
- `GOLD` from `@/constants/colors`
- `useApp()` from `@/context/AppContext` for `addToCart`, `cartCount`, `wishlistIds`, `toggleWishlist`, `theme`, `toggleTheme`, `reviews`, `hasCompletedCheckout`, `addReview`, `markCheckoutComplete`, `getItemReviews`
- `router.push('/route-name')` for navigation, `router.back()` to go back
- `expo-linear-gradient` for gold gradient buttons
- `expo-image` for images, `expo-haptics` for haptic feedback

## Color System (`useTC()`)
All colors come from `tc.*`:
- `tc.bg`, `tc.bg2`, `tc.headerBg`, `tc.navBg`, `tc.card`, `tc.card2`
- `tc.text`, `tc.text2`, `tc.text3`, `tc.muted`
- `tc.border`, `tc.border2`
- `tc.accent` (gold), `tc.accentTeal`, `tc.accentGrad` (string), `tc.accentGradColors` (array for LinearGradient), `tc.accentShadow`
- `tc.chipActiveBg`, `tc.chipActiveColor`, `tc.chipBg`, `tc.chipColor`
- `tc.inputBg`
- Auth-specific: `tc.authSheet`, `tc.authText`, `tc.authSub`, `tc.authInputBg`, `tc.authBorder`, `tc.authIcon`, `tc.authTabBg`, `tc.authTabBd`, `tc.authTabActive`, `tc.authTabActTxt`, `tc.authTabInTxt`, `tc.authSocialBg`, `tc.authSocialBd`, `tc.authSocialText`
- `tc.isDark` (boolean) — use for text color on gold buttons: `tc.isDark ? '#000' : '#fff'`

## Web/Mobile offset
- `WEB_TOP = Platform.OS === 'web' ? 67 : 0` — add to `paddingTop` of fixed headers
- `WEB_BOT = Platform.OS === 'web' ? 34 : 0` — add to bottom padding for CTAs

## Image placeholders
- `https://picsum.photos/seed/<uniqueSeed>/WxH` for all placeholder images
- Shop products use EMOJI icons (not photos) — matching web reference exactly

## Auth Flow Order
onboarding → welcome → sign-in / sign-up
- Onboarding navigates to `/(auth)/welcome`, NOT directly to sign-in

## Key Design Patterns
- **Sheet layout** (sign-in): `View height=SCREEN_HEIGHT*0.38` for image + `KeyboardAvoidingView borderTopLeftRadius:32 marginTop:-32` for sheet
- **Sign-up header**: 3 overlapping circle photos (height:176, circles 90x90, marginLeft:-20 for overlap)
- **Hero sections**: full-width ImageBackground with gradient overlay, text at bottom
- **Gold gradient buttons**: `<LinearGradient colors={tc.accentGradColors} start={{x:0.07,y:0}} end={{x:0.93,y:1}}>`
- **Cards**: `borderRadius:16`, `borderWidth:1`, `borderColor:tc.border`

## Shop Screen
- SHOP_PRODUCTS uses emoji icons (👕🧢🍾🥃🎁 etc), NOT photos
- Categories: All/Merchandise/Drinks/Packages/Accessories
- 3-column grid (`numColumns={3}`)
- Has banner slider (gradient bg + emoji), Flash Sale button, Featured Product section
- `key={cat}` on FlatList forces re-render when category changes

## Routes Registered
Auth: `/onboarding`, `/welcome`, `/sign-in`, `/sign-up`
Tabs: `/(tabs)` (home), `/(tabs)/clubs`, `/(tabs)/tours`, `/(tabs)/dining`, `/(tabs)/shop`
Detail: `/club-detail`, `/tour-detail`, `/restaurant-detail`, `/shop-detail?id=<id>`
Cart/Checkout: `/cart`, `/checkout-details`, `/checkout-payment`, `/checkout-confirmed`
Profile: `/profile`, `/profile-edit`, `/profile-bookings`, `/profile-saved`, `/profile-payment`, `/profile-password`, `/profile-privacy`, `/profile-notifications`, `/profile-settings`, `/profile-help`, `/profile-vip`
Other: `/deals`, `/search`, `/reservations`, `/booking-detail`, `/chat`, `/set-password`
Legal: `/legal-terms`, `/legal-privacy`, `/legal-refund`, `/legal-payment`, `/legal-disclaimer`

**Why:** The `/checkout` route does NOT exist — cart navigates to `/checkout-details`.
