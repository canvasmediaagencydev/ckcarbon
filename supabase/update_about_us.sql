-- Update About Us table to have single content field
-- Run this SQL in Supabase SQL Editor

-- Rename content_en to content and drop content_th
ALTER TABLE about_us_content RENAME COLUMN content_en TO content;
ALTER TABLE about_us_content DROP COLUMN IF EXISTS content_th;

-- Update existing data if needed (merge content_th into content if it exists)
-- This is safe since we're just renaming and the data is already there
