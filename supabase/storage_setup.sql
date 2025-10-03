-- Supabase Storage Setup
-- Run this in Supabase SQL Editor to enable public access to images bucket

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to images bucket
CREATE POLICY "Public Access for Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy: Allow authenticated users to upload to images bucket
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Policy: Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
