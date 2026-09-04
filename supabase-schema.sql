-- ============================================
-- GAMEVION Database Schema
-- Region: ap-northeast-1 (Tokyo)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. KATEGORI GAME
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  developer TEXT NOT NULL,
  image_url TEXT,
  icon_url TEXT,
  badge TEXT, -- BEST SELLER, HOT, POPULER, TRENDING
  badge_color TEXT DEFAULT 'emerald', -- emerald, violet, white
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PRODUK (Nominal/Item per game)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "5 Diamond", "85 Diamond", "Membership Mingguan"
  price INTEGER NOT NULL, -- dalam Rupiah
  tag TEXT, -- LARIS, HEMAT, POPULER
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. METODE PEMBAYARAN
-- ============================================
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- QRIS, GoPay, DANA, OVO, dll
  description TEXT, -- "Semua e-wallet & m-banking"
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. NOMOR WHATSAPP / KONTAK
-- ============================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL, -- "CS Utama", "Support", "Sales"
  phone_number TEXT NOT NULL, -- 6281234567890
  wa_link TEXT, -- https://wa.me/6281234567890
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. PESANAN / ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice TEXT UNIQUE NOT NULL, -- GVN-84021
  category_id UUID REFERENCES categories(id),
  product_id UUID REFERENCES products(id),
  game_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  account_id TEXT NOT NULL, -- User ID / Character ID game
  account_zone TEXT, -- Zone ID (untuk ML)
  payment_method TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Diproses', 'Berhasil', 'Gagal')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. SETTINGS / KONTEN LANDING PAGE
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- "hero_title", "promo_code", "wa_number", dll
  value TEXT,
  type TEXT DEFAULT 'text', -- text, number, boolean, json
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. BANNER / PROMO
-- ============================================
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT DEFAULT 'Lihat Paket',
  cta_link TEXT,
  code TEXT, -- kode promo
  discount_type TEXT, -- percent, fixed
  discount_value INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_invoice ON orders(invoice);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_categories_updated
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_settings_updated
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read access for landing page
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read payment_methods" ON payment_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);

-- Admin full access (using service_role key)
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access payment_methods" ON payment_methods FOR ALL USING (true);
CREATE POLICY "Admin full access contacts" ON contacts FOR ALL USING (true);
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (true);
CREATE POLICY "Admin full access banners" ON banners FOR ALL USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Categories
INSERT INTO categories (name, slug, developer, image_url, icon_url, badge, badge_color, sort_order) VALUES
('Mobile Legends', 'mobile-legends', 'Moonton', '/images/602df167-7ace-40bc-bf94-069fdea17603.png', '/images/65bfc705-5c40-4680-a896-abc1cb7bb978.svg', 'BEST SELLER', 'emerald', 1),
('Free Fire', 'free-fire', 'Garena', '/images/849e27b6-18a9-49b0-a8fb-d94761a7285b.png', NULL, 'HOT', 'violet', 2),
('PUBG Mobile', 'pubg-mobile', 'Level Infinite', '/images/12af396c-da57-4a23-b13b-16c4d480adc2.png', NULL, NULL, NULL, 3),
('Genshin Impact', 'genshin-impact', 'HoYoverse', '/images/4a402c7a-ca2f-4433-b935-16b26e740ab9.png', NULL, 'POPULER', 'white', 4),
('Magic Chess: Go Go', 'magic-chess-go-go', 'Moonton', '/images/90841904-8491-403e-a9f5-c8f53b796a8d.png', NULL, NULL, NULL, 5),
('Call of Duty Mobile', 'call-of-duty-mobile', 'Activision', '/images/e8937151-775d-48a3-9abe-c4d7aa28cb03.png', NULL, 'TRENDING', 'emerald', 6);

-- Products: Mobile Legends
INSERT INTO products (category_id, name, price, tag, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '5 Diamond', 1500, NULL, 1),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '12 Diamond', 3400, NULL, 2),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '28 Diamond', 7900, NULL, 3),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '44 Diamond', 12300, 'LARIS', 4),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '59 Diamond', 16500, NULL, 5),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '85 Diamond', 23500, NULL, 6),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '170 Diamond', 46500, 'HEMAT', 7),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '240 Diamond', 65000, NULL, 8),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '296 Diamond', 80000, NULL, 9),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '568 Diamond', 152000, NULL, 10),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), '875 Diamond', 233000, NULL, 11),
((SELECT id FROM categories WHERE slug = 'mobile-legends'), 'Weekly Diamond Pass', 28000, 'POPULER', 12);

-- Products: Free Fire
INSERT INTO products (category_id, name, price, tag, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'free-fire'), '5 Diamond', 1400, NULL, 1),
((SELECT id FROM categories WHERE slug = 'free-fire'), '12 Diamond', 2600, NULL, 2),
((SELECT id FROM categories WHERE slug = 'free-fire'), '50 Diamond', 8300, NULL, 3),
((SELECT id FROM categories WHERE slug = 'free-fire'), '70 Diamond', 10500, 'LARIS', 4),
((SELECT id FROM categories WHERE slug = 'free-fire'), '100 Diamond', 14500, NULL, 5),
((SELECT id FROM categories WHERE slug = 'free-fire'), '140 Diamond', 20000, NULL, 6),
((SELECT id FROM categories WHERE slug = 'free-fire'), '355 Diamond', 49500, 'HEMAT', 7),
((SELECT id FROM categories WHERE slug = 'free-fire'), '720 Diamond', 99000, NULL, 8),
((SELECT id FROM categories WHERE slug = 'free-fire'), '1.450 Diamond', 196000, NULL, 9),
((SELECT id FROM categories WHERE slug = 'free-fire'), 'Membership Mingguan', 29000, NULL, 10),
((SELECT id FROM categories WHERE slug = 'free-fire'), 'Membership Bulanan', 89000, 'POPULER', 11),
((SELECT id FROM categories WHERE slug = 'free-fire'), 'Level Up Pass', 15000, NULL, 12);

-- Products: PUBG Mobile
INSERT INTO products (category_id, name, price, tag, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'pubg-mobile'), '60 UC', 13500, NULL, 1),
((SELECT id FROM categories WHERE slug = 'pubg-mobile'), '325 UC', 65000, 'LARIS', 2),
((SELECT id FROM categories WHERE slug = 'pubg-mobile'), '660 UC', 149000, NULL, 3),
((SELECT id FROM categories WHERE slug = 'pubg-mobile'), '1800 UC', 349000, 'HEMAT', 4),
((SELECT id FROM categories WHERE slug = 'pubg-mobile'), '3850 UC', 699000, NULL, 5),
((SELECT id FROM categories WHERE slug = 'pubg-mobile'), '8100 UC', 1399000, NULL, 6);

-- Products: Genshin Impact
INSERT INTO products (category_id, name, price, tag, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'genshin-impact'), '60 Genesis Crystals', 15000, NULL, 1),
((SELECT id FROM categories WHERE slug = 'genshin-impact'), '300 Genesis Crystals', 75000, NULL, 2),
((SELECT id FROM categories WHERE slug = 'genshin-impact'), '980 Genesis Crystals', 230000, 'LARIS', 3),
((SELECT id FROM categories WHERE slug = 'genshin-impact'), '1980 Genesis Crystals', 460000, 'HEMAT', 4),
((SELECT id FROM categories WHERE slug = 'genshin-impact'), '3280 Genesis Crystals', 750000, NULL, 5),
((SELECT id FROM categories WHERE slug = 'genshin-impact'), '6480 Genesis Crystals', 1499000, NULL, 6),
((SELECT id FROM categories WHERE slug = 'genshin-impact'), 'Blessing of the Welkin Moon', 75000, 'POPULER', 7);

-- Products: Magic Chess Go Go
INSERT INTO products (category_id, name, price, tag, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'magic-chess-go-go'), '5 Diamond', 1500, NULL, 1),
((SELECT id FROM categories WHERE slug = 'magic-chess-go-go'), '12 Diamond', 3400, NULL, 2),
((SELECT id FROM categories WHERE slug = 'magic-chess-go-go'), '28 Diamond', 7900, NULL, 3),
((SELECT id FROM categories WHERE slug = 'magic-chess-go-go'), '59 Diamond', 16500, NULL, 4),
((SELECT id FROM categories WHERE slug = 'magic-chess-go-go'), '85 Diamond', 23500, 'LARIS', 5),
((SELECT id FROM categories WHERE slug = 'magic-chess-go-go'), '170 Diamond', 46500, 'HEMAT', 6);

-- Products: Call of Duty Mobile
INSERT INTO products (category_id, name, price, tag, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'call-of-duty-mobile'), '80 CP', 12000, NULL, 1),
((SELECT id FROM categories WHERE slug = 'call-of-duty-mobile'), '420 CP', 58000, 'LARIS', 2),
((SELECT id FROM categories WHERE slug = 'call-of-duty-mobile'), '880 CP', 115000, NULL, 3),
((SELECT id FROM categories WHERE slug = 'call-of-duty-mobile'), '2400 CP', 299000, 'HEMAT', 4),
((SELECT id FROM categories WHERE slug = 'call-of-duty-mobile'), '5200 CP', 599000, NULL, 5);

-- Payment Methods
INSERT INTO payment_methods (name, description, is_active, sort_order) VALUES
('QRIS', 'Semua e-wallet & m-banking', true, 1),
('GoPay', 'Saldo GoPay', true, 2),
('DANA', 'Saldo DANA', true, 3),
('OVO', 'Saldo OVO', true, 4),
('ShopeePay', 'Saldo ShopeePay', true, 5),
('BCA Virtual Account', 'Transfer bank', true, 6),
('Mandiri Virtual Account', 'Transfer bank', true, 7),
('Alfamart', 'Bayar di kasir', true, 8),
('Indomaret', 'Bayar di kasir', true, 9);

-- Contacts
INSERT INTO contacts (label, phone_number, wa_link, is_active) VALUES
('CS Utama', '6281234567890', 'https://wa.me/6281234567890', true),
('Support', '6281234567891', 'https://wa.me/6281234567891', true);

-- Settings
INSERT INTO settings (key, value, type) VALUES
('site_name', 'GAMEVION', 'text'),
('site_tagline', 'Top Up Game Instan, Aman & 24 Jam', 'text'),
('hero_title_1', 'BUNDLE DIAMOND', 'text'),
('hero_subtitle_1', 'HARGA GAK NAIK', 'text'),
('hero_desc_1', 'Beli sekarang, harga segini terus sampai Minggu malam.', 'text'),
('wa/cs_number', '6281234567890', 'text'),
('email_support', 'support@gamevion.net', 'text'),
('stats_topup', '1.2 jt+', 'text'),
('stats_rating', '4.9/5', 'text'),
('stats_games', '6', 'text'),
('stats_support', '24/7', 'text');

-- Banners
INSERT INTO banners (title, subtitle, description, cta_text, code, discount_type, discount_value, is_active, sort_order) VALUES
('DEAL MINGGU INI', 'BUNDLE DIAMOND', 'HARGA GAK NAIK', 'Lihat Paket', NULL, NULL, NULL, true, 1),
('SEPTEMBER ISI ULANG', 'MAKIN UNTUNG', 'Kode promo spesial, berlaku 1-30 September 2026', 'Pakai Kodenya', 'GVNSEP26', 'fixed', 5000, true, 2),
('EVENT KOMUNITAS', 'TEBAK SKOR MPL', 'MENANG DIAMOND', 'Ikut Event', NULL, NULL, NULL, true, 3);