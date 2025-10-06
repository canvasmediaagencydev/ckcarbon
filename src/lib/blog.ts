import { supabase } from './supabase'
import { StorageService } from './storage'

export type Blog = {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: any // TipTap JSON content
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at: string
  updated_at: string
  author_id?: string
  meta_title?: string
  meta_description?: string
  tags: string[]
}

export type CreateBlogData = {
  title: string
  slug: string
  excerpt?: string
  content: any
  featured_image?: string
  status?: 'draft' | 'published' | 'archived'
  published_at?: string
  meta_title?: string
  meta_description?: string
  tags?: string[]
}

export type UpdateBlogData = Partial<CreateBlogData>

// Blog CRUD operations
export class BlogService {
  static async getAllBlogs(status?: 'draft' | 'published' | 'archived') {
    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error

    return (data || []) as Blog[]
  }

  static async getBlogBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Blog
  }

  static async getBlogById(id: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Blog
  }

  static async createBlog(blogData: CreateBlogData) {
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .insert([{
        ...blogData,
        published_at: blogData.status === 'published' ? new Date().toISOString() : null
      }])
      .select()
      .single()

    if (blogError) throw blogError
    return blog as Blog
  }

  static async updateBlog(id: string, updateData: UpdateBlogData) {
    // Update published_at when changing to published status
    if (updateData.status === 'published' && !updateData.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single()

    if (blogError) throw blogError
    return blog as Blog
  }

  static async deleteBlog(id: string) {
    try {
      // Delete all images in the blog folder from Storage first
      console.log(`Deleting images for blog ${id}...`)
      const storageResult = await StorageService.deleteBlogFolder(id)

      if (!storageResult.success) {
        console.warn(`Failed to delete images for blog ${id}:`, storageResult.error)
        // Continue with blog deletion even if image deletion fails
        // to prevent orphaned database records
      } else {
        console.log(`Successfully deleted images for blog ${id}`)
      }

      // Delete the blog from database
      console.log(`Deleting blog ${id} from database...`)
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)

      if (error) {
        console.error(`Failed to delete blog ${id}:`, error)
        throw error
      }

      console.log(`Successfully deleted blog ${id}`)
      return true
    } catch (error) {
      console.error(`Error in deleteBlog for ${id}:`, error)
      throw error
    }
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  static async isSlugUnique(slug: string, excludeId?: string) {
    let query = supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) throw error
    return data.length === 0
  }
}