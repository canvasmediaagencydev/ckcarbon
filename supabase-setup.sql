-- =====================================================
-- Supabase Setup Scripts for CKCarbon Blog System
-- =====================================================

-- Enable RLS on blogs table
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blogs table
-- Allow all operations for now (you can restrict later based on authentication)
CREATE POLICY "Allow all operations on blogs" ON blogs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Alternative: More restrictive policies (uncomment if you want to use authentication)
-- CREATE POLICY "Allow read access to published blogs" ON blogs
--     FOR SELECT
--     USING (status = 'published' OR auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated users to manage blogs" ON blogs
--     FOR ALL
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);

-- =====================================================
-- Storage Policies for 'blog' bucket
-- =====================================================

-- Note: storage.objects RLS is managed by Supabase automatically
-- We only need to create policies for our specific bucket

-- Create bucket if it doesn't exist (skip if already created)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('blog', 'blog', true)
-- ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on blog bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for blog images" ON storage.objects;

-- Allow all operations on blog bucket (permissive for development)
CREATE POLICY "Allow all operations on blog bucket" ON storage.objects
    FOR ALL
    USING (bucket_id = 'blog')
    WITH CHECK (bucket_id = 'blog');

-- Alternative: More restrictive storage policies (uncomment if needed)
-- CREATE POLICY "Allow public read access to blog images" ON storage.objects
--     FOR SELECT
--     USING (bucket_id = 'blog');

-- CREATE POLICY "Allow authenticated users to upload blog images" ON storage.objects
--     FOR INSERT
--     TO authenticated
--     WITH CHECK (bucket_id = 'blog');

-- CREATE POLICY "Allow authenticated users to update blog images" ON storage.objects
--     FOR UPDATE
--     TO authenticated
--     USING (bucket_id = 'blog')
--     WITH CHECK (bucket_id = 'blog');

-- CREATE POLICY "Allow authenticated users to delete blog images" ON storage.objects
--     FOR DELETE
--     TO authenticated
--     USING (bucket_id = 'blog');

-- =====================================================
-- Categories table (if exists)
-- =====================================================

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow all operations on categories
CREATE POLICY "Allow all operations on categories" ON categories
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- Blog Categories Junction table (if exists)
-- =====================================================

-- Enable RLS on blog_categories table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_categories') THEN
        ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Allow all operations on blog_categories" ON blog_categories
            FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;
END
$$;