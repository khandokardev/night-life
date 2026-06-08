---
name: SA PLUG Auth System
description: Auth design — no demo credentials, OTP flow accepts any 6-digit code, guest mode, AppContext auth API, and guest-blocking patterns.
---

## Auth design (no backend — pure AsyncStorage)

**Demo credentials removed.** No seeded accounts. `getAccounts()` returns raw AsyncStorage data only.
**OTP:** accepts any 6-digit code — no client-side comparison.

## AppContext auth API
- `isLoggedIn` / `isGuest` — auth state flags
- `user: AuthUser | null` — `{ name, email?, phone? }`, persisted to `sa_plug_auth` AsyncStorage key
- `pendingUser` — set before navigating to OTP; consumed by OTP screen to `authenticate()` after code verified
- `login(email, password)` — checks `sa_plug_accounts` AsyncStorage array, resolves to `{ ok, user?, error? }`
- `register(data)` — pushes to `sa_plug_accounts`, checks email uniqueness
- `authenticate(user)` — sets isLoggedIn, persists user
- `loginAsGuest()` — isGuest=true, isLoggedIn=false, user={name:'Guest'}
- `logout()` — clears state + AsyncStorage auth key

## OTP routing pattern
Navigate with params: `router.push({ pathname: '/(auth)/otp', params: { mode: 'signup'|'login'|'forgot', identifier: 'email or phone' } })`
After any 6-digit code verified: mode=forgot → /set-password; else → authenticate(pendingUser) → /(tabs)

## Social login
All social buttons call `Alert.alert('${provider} Login', '...not available...')`

## Guest blocking — two-tier system

### Inline guest screen (full tab replacement)
- `profile.tsx` — if `!isLoggedIn` renders full guest screen with Log In / Create Account / theme toggle
- `chat.tsx` — if `!isLoggedIn` renders "Members Only" screen with Log In / Create Account buttons

### LoginGateModal (action gate — stays on screen)
Pattern: `import { LoginGateModal } from '@/components/LoginGateModal'` + `import { useLoginGate } from '@/hooks/useLoginGate'`
Hook: `const { gateVisible, closeGate, guard } = useLoginGate();`
Usage: `guard(() => someAction())` — shows modal if `!isLoggedIn`, executes action if logged in.
Modal: add `<LoginGateModal visible={gateVisible} onClose={closeGate} />` inside root View as last child.

Applied to:
- `tour-detail.tsx` — toggleWishlist + handleBook
- `restaurant-detail.tsx` — handleBook
- `shop-detail.tsx` — toggleWishlist
- `club-detail.tsx` — handleProceed (proceed to payment)
- `(tabs)/dining.tsx` — featured + grid toggleWishlist
- `(tabs)/tours.tsx` — featured + list toggleWishlist

### Cart/checkout gate (pre-existing, unchanged)
- `cart.tsx` — `handleCheckout()` checks `isLoggedIn`
- `checkout-details.tsx` — `useEffect` + `handleContinue()` check `isLoggedIn`
