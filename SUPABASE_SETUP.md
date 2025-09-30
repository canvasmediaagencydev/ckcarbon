# Supabase Setup for CKCarbon Blog System

## การแก้ไขปัญหา Row-Level Security (RLS)

เมื่อเจอ error "new row violates row-level security policy" ให้ทำตามขั้นตอนต่อไปนี้:

## 1. เข้าไปที่ Supabase Dashboard

1. ไปที่ [https://supabase.com](https://supabase.com)
2. เข้าสู่ระบบและเลือกโปรเจคของคุณ
3. ไปที่ **SQL Editor** ในเมนูด้านซ้าย

## 2. รัน SQL Scripts

คัดลอกและรันโค้ดจากไฟล์ `supabase-setup.sql` ใน SQL Editor:

```sql
-- ใส่โค้ดทั้งหมดจาก supabase-setup.sql ที่นี่
```

หรือรันทีละส่วน:

### สำหรับ Blogs Table:

```sql
-- Enable RLS และสร้าง policy สำหรับ blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on blogs" ON blogs
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

### สำหรับ Storage:

**⚠️ หมายเหตุ:** ไม่ต้องรัน `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;` เพราะ Supabase จัดการให้อัตโนมัติ

```sql
-- ลบ policy เก่า (ถ้ามี)
DROP POLICY IF EXISTS "Allow all operations on blog bucket" ON storage.objects;

-- สร้าง policy สำหรับ blog bucket
CREATE POLICY "Allow all operations on blog bucket" ON storage.objects
    FOR ALL
    USING (bucket_id = 'blog')
    WITH CHECK (bucket_id = 'blog');
```

**หรือ** ใช้ Supabase Dashboard:
1. ไปที่ **Storage** → **Policies**
2. คลิก **New Policy** สำหรับ `objects` table
3. เลือก **Get started quickly** → **Allow all**
4. ตั้งชื่อ: `Allow all operations on blog bucket`
5. เพิ่ม condition: `bucket_id = 'blog'`

## 3. ตรวจสอบ Database Schema

ตรวจสอบว่ามี tables ที่จำเป็นแล้ว:

### Blogs Table:

```sql
CREATE TABLE blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content JSONB,
    featured_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID,
    meta_title TEXT,
    meta_description TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Index สำหรับ performance
CREATE INDEX blogs_slug_idx ON blogs(slug);
CREATE INDEX blogs_status_idx ON blogs(status);
CREATE INDEX blogs_published_at_idx ON blogs(published_at);
```

### Categories Table (ถ้าต้องการ):

```sql
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table สำหรับ many-to-many relationship
CREATE TABLE blog_categories (
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, category_id)
);
```

## 4. ตรวจสอบ Storage Bucket

ไปที่ **Storage** > **Buckets** และตรวจสอบว่า:

1. มี bucket ชื่อ `blog` แล้ว
2. Bucket เป็น **Public** (สำหรับดูรูปภาพ)
3. มี **Policy** ที่อนุญาตให้ upload/delete ได้

## 5. Environment Variables

ตรวจสอบว่าไฟล์ `.env.local` มี:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 6. ทดสอบการเชื่อมต่อ

รันคำสั่งนี้เพื่อทดสอบ:

```bash
npm run dev
```

แล้วไปที่:
- `/admin/blogs` - ดูรายการ blogs
- `/admin/blogs/new` - สร้าง blog ใหม่
- ทดสอบอัพโหลดรูปภาพ

## 7. การแก้ไขปัญหาเพิ่มเติม

### Error: "must be owner of table objects"

ถ้าได้ error นี้ เมื่อพยายามรัน `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`

**วิธีแก้ไข:**
1. **ไม่ต้องรัน ALTER TABLE command** - Supabase จัดการ RLS ให้อัตโนมัติ
2. **ใช้ Supabase Dashboard แทน:**
   - ไปที่ **Storage** → **Policies**
   - สร้าง policy ใหม่สำหรับ `objects` table
   - ตั้งค่าให้อนุญาต operations สำหรับ `bucket_id = 'blog'`

### หากยังมีปัญหา RLS:

1. **ตรวจสอบ policies ที่มีอยู่**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'blogs';
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

2. **ลบ policies เก่า** (ถ้าจำเป็น):
   ```sql
   DROP POLICY IF EXISTS "policy_name" ON blogs;
   DROP POLICY IF EXISTS "policy_name" ON storage.objects;
   ```

3. **ปิด RLS ชั่วคราว** (ไม่แนะนำสำหรับ production):
   ```sql
   ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
   ```

   **หมายเหตุ:** ไม่สามารถปิด RLS สำหรับ `storage.objects` ได้

## Security Notes

**สำหรับ Development:**
- Policies ปัจจุบันอนุญาตให้ทำทุกอย่างได้ (ง่ายสำหรับการทดสอบ)

**สำหรับ Production:**
- ควรใช้ authentication และจำกัด policies ให้เข้มงวดขึ้น
- ตัวอย่าง policies ที่เข้มงวดมีใน `supabase-setup.sql` (commented out)