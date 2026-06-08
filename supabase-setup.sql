-- ============================================================
--  SA PLUG — Complete Database Setup for Supabase
--  Run this entire script in: Supabase → SQL Editor → New query
--  Safe to run multiple times (uses IF NOT EXISTS / IF NOT EXIST guards)
-- ============================================================


-- ── 1. USERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL PRIMARY KEY,
  email               TEXT UNIQUE,
  phone               TEXT,
  name                TEXT NOT NULL,
  avatar              TEXT,
  password_hash       TEXT,
  role                TEXT NOT NULL DEFAULT 'user',
  suspended           BOOLEAN NOT NULL DEFAULT false,
  banned_at           TIMESTAMP,
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  last_login_at       TIMESTAMP,
  login_count         INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 2. REFRESH TOKENS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 3. CATEGORIES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  icon       TEXT NOT NULL,
  "order"    INTEGER NOT NULL DEFAULT 0,
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 4. CLUBS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clubs (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT,
  images         TEXT[],
  price          NUMERIC,
  address        TEXT,
  maps_url       TEXT,
  phone          TEXT,
  contact_email  TEXT,
  is_trending    BOOLEAN NOT NULL DEFAULT false,
  is_featured    BOOLEAN NOT NULL DEFAULT false,
  is_popular     BOOLEAN NOT NULL DEFAULT false,
  available      BOOLEAN NOT NULL DEFAULT true,
  tags           TEXT[],
  category_id    INTEGER,
  dress_code     TEXT,
  opening_hours  TEXT,
  min_spend      NUMERIC,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 5. RESTAURANTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id                    SERIAL PRIMARY KEY,
  name                  TEXT NOT NULL,
  description           TEXT,
  images                TEXT[],
  price                 NUMERIC,
  address               TEXT,
  maps_url              TEXT,
  phone                 TEXT,
  contact_email         TEXT,
  is_trending           BOOLEAN NOT NULL DEFAULT false,
  is_featured           BOOLEAN NOT NULL DEFAULT false,
  is_popular            BOOLEAN NOT NULL DEFAULT false,
  available             BOOLEAN NOT NULL DEFAULT true,
  tags                  TEXT[],
  category_id           INTEGER,
  cuisine               TEXT,
  opening_hours         TEXT,
  dress_code            TEXT,
  reservation_required  BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 6. TOURS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tours (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  images          TEXT[],
  price           NUMERIC,
  address         TEXT,
  maps_url        TEXT,
  phone           TEXT,
  contact_email   TEXT,
  is_trending     BOOLEAN NOT NULL DEFAULT false,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_popular      BOOLEAN NOT NULL DEFAULT false,
  available       BOOLEAN NOT NULL DEFAULT true,
  tags            TEXT[],
  category_id     INTEGER,
  duration        TEXT,
  includes        TEXT[],
  max_group_size  INTEGER,
  meeting_point   TEXT,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 7. PRODUCTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT,
  images         TEXT[],
  price          NUMERIC,
  address        TEXT,
  maps_url       TEXT,
  phone          TEXT,
  contact_email  TEXT,
  is_trending    BOOLEAN NOT NULL DEFAULT false,
  is_featured    BOOLEAN NOT NULL DEFAULT false,
  is_popular     BOOLEAN NOT NULL DEFAULT false,
  available      BOOLEAN NOT NULL DEFAULT true,
  tags           TEXT[],
  category_id    INTEGER,
  sku            TEXT,
  stock          INTEGER NOT NULL DEFAULT 0,
  brand          TEXT,
  sizes          TEXT[],
  colours        TEXT[],
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 8. EVENTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  description    TEXT,
  images         TEXT[],
  price          NUMERIC,
  address        TEXT,
  maps_url       TEXT,
  phone          TEXT,
  contact_email  TEXT,
  is_trending    BOOLEAN NOT NULL DEFAULT false,
  is_featured    BOOLEAN NOT NULL DEFAULT false,
  is_popular     BOOLEAN NOT NULL DEFAULT false,
  available      BOOLEAN NOT NULL DEFAULT true,
  tags           TEXT[],
  category_id    INTEGER,
  event_date     TEXT,
  event_time     TEXT,
  venue          TEXT,
  dress_code     TEXT,
  lineup         TEXT[],
  ticket_url     TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 9. BOOKINGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_type  TEXT NOT NULL,
  ref_id        INTEGER NOT NULL,
  ref_name      TEXT NOT NULL,
  date          TEXT NOT NULL,
  time          TEXT NOT NULL,
  guests        INTEGER NOT NULL DEFAULT 1,
  status        TEXT NOT NULL DEFAULT 'pending',
  qr_code       TEXT,
  total_amount  NUMERIC,
  notes         TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 10. SAVED ITEMS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_items (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ref_type   TEXT NOT NULL,
  ref_id     INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 11. REVIEWS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id  INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  ref_type    TEXT NOT NULL,
  ref_id      INTEGER NOT NULL,
  rating      INTEGER NOT NULL,
  body        TEXT,
  approved    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 12. NOTIFICATIONS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL DEFAULT 'system',
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 13. CHAT MESSAGES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender     TEXT NOT NULL DEFAULT 'user',
  body       TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 14. TRANSACTIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id                       SERIAL PRIMARY KEY,
  user_id                  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id               INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  amount                   INTEGER NOT NULL,
  currency                 TEXT NOT NULL DEFAULT 'zar',
  status                   TEXT NOT NULL DEFAULT 'pending',
  metadata                 JSONB,
  created_at               TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 15. PROMOTIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promotions (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  body        TEXT,
  image_url   TEXT,
  type        TEXT NOT NULL DEFAULT 'banner',
  target_all  BOOLEAN NOT NULL DEFAULT true,
  active      BOOLEAN NOT NULL DEFAULT true,
  starts_at   TIMESTAMP,
  ends_at     TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ── 16. APP SETTINGS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS app_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- ============================================================
--  SEED: First admin user
--  Password below is hashed from: Bigboi10@$
--  Change the email/password after first login!
-- ============================================================
INSERT INTO users (email, name, password_hash, role, verification_status)
VALUES (
  'mahfujmlt@gmail.com',
  'SA PLUG Admin',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  'verified'
)
ON CONFLICT (email) DO NOTHING;


-- ============================================================
--  SEED: Default app settings
-- ============================================================
INSERT INTO app_settings (key, value) VALUES
  ('app_name',        'SA PLUG'),
  ('app_tagline',     'Premium Nightlife & Lifestyle'),
  ('support_email',   'support@saplug.co.za'),
  ('booking_fee_pct', '5'),
  ('currency',        'ZAR'),
  ('maintenance_mode','false')
ON CONFLICT (key) DO NOTHING;


-- ============================================================
--  SEED: Starter categories
-- ============================================================
INSERT INTO categories (name, icon, "order", active) VALUES
  ('Nightclubs',   '🌃', 1, true),
  ('Restaurants',  '🍽️', 2, true),
  ('Tours',        '🗺️', 3, true),
  ('Products',     '🛍️', 4, true),
  ('Events',       '🎉', 5, true),
  ('Live Music',   '🎵', 6, true)
ON CONFLICT DO NOTHING;


-- ============================================================
--  DONE — All 16 tables created, admin user & seed data added
-- ============================================================
