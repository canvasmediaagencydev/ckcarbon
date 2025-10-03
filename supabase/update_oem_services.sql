-- Update OEM Services table to use images instead of icons
-- Run this SQL in Supabase SQL Editor

-- Add image_url column
ALTER TABLE oem_services ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Remove icon column (optional - can keep it for backward compatibility)
-- ALTER TABLE oem_services DROP COLUMN IF EXISTS icon;

-- Update existing records with default placeholder
UPDATE oem_services SET image_url = '/image/oem/placeholder.png' WHERE image_url IS NULL;
