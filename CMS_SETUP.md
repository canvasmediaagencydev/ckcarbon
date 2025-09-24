# Blog CMS Setup Guide

This guide will help you set up the blog CMS system for your CKCarbon website.

## Prerequisites

1. **Supabase Project**: You need a Supabase project with environment variables set up.
2. **Environment Variables**: Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

1. **Run SQL Schema**: Go to your Supabase SQL Editor and run the contents of `supabase/schema.sql`:

```sql
-- Copy and paste the entire contents of supabase/schema.sql
-- This will create the blogs, categories, and blog_categories tables
```

2. **Verify Tables**: After running the schema, you should see these tables in your Supabase dashboard:
   - `blogs`
   - `categories`
   - `blog_categories`

## CMS Features

### Admin Dashboard
- Access the CMS at: `/admin`
- View all blog posts at: `/admin/blogs`
- Create new posts at: `/admin/blogs/new`
- Edit existing posts at: `/admin/blogs/[id]/edit`

### Blog Management
- **Create**: Write new blog posts with rich text editor
- **Edit**: Modify existing posts
- **Categories**: Organize posts by categories
- **Tags**: Add tags for better organization
- **SEO**: Meta titles and descriptions
- **Status**: Draft, Published, or Archived
- **Featured Images**: Add images to posts

### TipTap Editor Features
- Rich text formatting (bold, italic, strikethrough)
- Headings (H1, H2, H3)
- Lists (ordered and unordered)
- Blockquotes and code blocks
- Text alignment
- Links and images
- Undo/redo functionality
- Character count

## Integration with Frontend

The blog section on your homepage will automatically:
- Fetch published blog posts from Supabase
- Display them with the existing design
- Fall back to demo content if no posts exist
- Show loading states while fetching data

## Getting Started

1. **Set up environment variables** in `.env.local`
2. **Run the database schema** in Supabase SQL Editor
3. **Start the development server**: `npm run dev`
4. **Visit the admin dashboard**: `http://localhost:3000/admin`
5. **Create your first blog post**!

## Default Categories

The setup includes these default categories:
- Technology
- Business
- Sustainability
- News

You can add more categories through the admin interface.

## File Structure

```
src/
├── app/
│   └── admin/              # CMS admin pages
│       ├── layout.tsx      # Admin layout
│       ├── page.tsx        # Dashboard
│       └── blogs/          # Blog management
├── components/
│   ├── TipTapEditor.tsx    # Rich text editor
│   └── BlogSection.tsx     # Updated blog section
└── lib/
    ├── supabase.ts         # Supabase client
    └── blog.ts             # Blog service functions
```

## Customization

You can customize:
- **Styling**: Modify Tailwind classes in components
- **Categories**: Add/edit through admin or directly in database
- **Blog layout**: Update `BlogSection.tsx` for frontend display
- **Editor features**: Extend `TipTapEditor.tsx` with more TipTap extensions

## Security Notes

- The current setup uses the public anon key for simplicity
- For production, consider implementing proper authentication
- Set up Row Level Security (RLS) policies in Supabase for better security
- Restrict admin access with authentication middleware

## Troubleshooting

1. **"No blog posts found"**: Check your Supabase connection and ensure the schema was created
2. **Editor not loading**: Verify TipTap packages are installed correctly
3. **Images not displaying**: Ensure image URLs are accessible and CORS is configured
4. **Database errors**: Check your Supabase environment variables and connection