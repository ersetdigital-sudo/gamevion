-- Disable RLS untuk semua tabel (biar API bisa akses)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;

-- Grant full access ke anon role
GRANT ALL ON categories TO anon;
GRANT ALL ON products TO anon;
GRANT ALL ON payment_methods TO anon;
GRANT ALL ON contacts TO anon;
GRANT ALL ON orders TO anon;
GRANT ALL ON settings TO anon;
GRANT ALL ON banners TO anon;

-- Grant full access ke authenticated role
GRANT ALL ON categories TO authenticated;
GRANT ALL ON products TO authenticated;
GRANT ALL ON payment_methods TO authenticated;
GRANT ALL ON contacts TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON settings TO authenticated;
GRANT ALL ON banners TO authenticated;
