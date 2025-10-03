-- ============================================
-- CMS Tables Migration for Homepage Content Management
-- Run this AFTER the main schema.sql
-- ============================================

-- Site Settings Table (Navbar & Hero Section)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for site_settings
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('navbar_logo', '{
    "type": "text",
    "text": "LOGO\nCK CARBON",
    "image_url": null
  }'::jsonb),
  ('hero_section', '{
    "logo_type": "text",
    "logo_text": "LOGO\nCK CARBON",
    "logo_image_url": null,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis."
  }'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- About Us Content Table
CREATE TABLE IF NOT EXISTS about_us_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_en TEXT NOT NULL,
  content_th TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for about_us_content
DROP TRIGGER IF EXISTS update_about_us_content_updated_at ON about_us_content;
CREATE TRIGGER update_about_us_content_updated_at
    BEFORE UPDATE ON about_us_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default about us content
INSERT INTO about_us_content (content_en, content_th) VALUES
  (
    'has its roots in a family business that once thrived in the coconut industry. In 2004, our founder envisioned the potential of transforming coconut shells into high-quality activated carbon. From that vision, CK Carbon Partnership was officially established, specializing in the production and supply of premium water filtration media, trusted by both households and industries.',
    'เริ่มต้นจากรากฐานครอบครัวที่เคยทำธุรกิจเกี่ยวกับมะพร้าว คุณพ่อของเรามองเห็นคุณค่าและโอกาสในการต่อยอดจาก "กะลามะพร้าว" สู่การผลิตถ่านกัมมันต์ (Activated Carbon) ตั้งแต่ปี 2004 เป็นต้นมา ก่อนจะก่อตั้ง หจก. ซีเคคาร์บอน อย่างเป็นทางการ เพื่อดำเนินธุรกิจด้านการผลิตและจัดจำหน่ายสารกรองน้ำคุณภาพสูง ที่ตอบโจทย์ทั้งภาคครัวเรือนและอุตสาหกรรม'
  )
ON CONFLICT DO NOTHING;

-- OEM Services Table
CREATE TABLE IF NOT EXISTS oem_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT DEFAULT 'FaBox',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for oem_services
DROP TRIGGER IF EXISTS update_oem_services_updated_at ON oem_services;
CREATE TRIGGER update_oem_services_updated_at
    BEFORE UPDATE ON oem_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_oem_services_order ON oem_services(display_order);

-- Insert default OEM services
INSERT INTO oem_services (title, icon, display_order)
SELECT * FROM (VALUES
  ('บจก. วิโมน เทรดดิ้ง', 'FaBox', 1),
  ('บจก. โซลู่ยู เทคโนโลยี', 'FaCogs', 2),
  ('บจก. วอเตอร์เฟิลเตอร์ เซรีไทย', 'FaBox', 3),
  ('บจก. สยาม-เคซีเทค', 'FaIndustry', 4),
  ('บจก. เวสโกร แมนูแฟคเจอริ่ง', 'FaBox', 5)
) AS v(title, icon, display_order)
WHERE NOT EXISTS (SELECT 1 FROM oem_services);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  button_text TEXT DEFAULT 'สั่งซื้อเลย!',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_products_order ON products(display_order);

-- Insert default products
INSERT INTO products (name, description, image_url, display_order)
SELECT * FROM (VALUES
  ('Activate carbon ID 900', 'รายละเอียดสินค้า', '/image/products/4a03710ab414fa64bbc2fc55b1eb492ac310335e.jpg', 1),
  ('Manganese Pyrolusite', 'รายละเอียดสินค้า', '/image/products/c6dc0261bda52f1ce1477d1b5021973e950a7bb4.jpg', 2),
  ('Magnanese Zeolite', 'รายละเอียดสินค้า', '/image/products/e8368ee26094b84d2f16e8ef47bcedba10f8bc36.jpg', 3)
) AS v(name, description, image_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM products);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_position TEXT NOT NULL,
  author_company TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for testimonials
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(display_order);

-- Insert default testimonials
INSERT INTO testimonials (content, author_name, author_position, author_company, rating, display_order)
SELECT * FROM (VALUES
  (
    'CK Carbon''s activated carbon has transformed our water purification process. The quality is exceptional and consistent, making it our go-to choice for industrial applications.',
    'Somchai Phanichkul',
    'Production Manager',
    'AquaTech Solutions',
    5,
    1
  ),
  (
    'Outstanding service and premium quality products. Their activated carbon solutions have significantly improved our filtration efficiency and reduced maintenance costs.',
    'Preecha Wongsakul',
    'Quality Control Director',
    'Pure Water Industries',
    5,
    2
  ),
  (
    'Reliable partnership with CK Carbon for over 3 years. Their commitment to quality and timely delivery makes them an invaluable supplier for our operations.',
    'Niran Jitpakdee',
    'Procurement Manager',
    'Industrial Filtration Co.',
    5,
    3
  ),
  (
    'CK Carbon consistently delivers high-quality activated carbon that meets our strict specifications. Their technical support team is exceptional and always ready to help.',
    'Wanida Suksawat',
    'Technical Manager',
    'Clean Tech Solutions',
    5,
    4
  ),
  (
    'Working with CK Carbon has been a game-changer for our water treatment facility. Their products have improved our efficiency while reducing operational costs significantly.',
    'Akira Tanaka',
    'Operations Director',
    'Asian Water Systems',
    5,
    5
  ),
  (
    'The quality of their activated carbon is unmatched in the industry. CK Carbon has been our trusted partner for sustainable water treatment solutions.',
    'Maria Santos',
    'Environmental Engineer',
    'Eco Water Corp',
    5,
    6
  )
) AS v(content, author_name, author_position, author_company, rating, display_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
