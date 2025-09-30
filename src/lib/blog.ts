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
  categories?: Category[]
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
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
  category_ids?: string[]
}

export type UpdateBlogData = Partial<CreateBlogData>

// Blog CRUD operations
export class BlogService {
  static async getAllBlogs(status?: 'draft' | 'published' | 'archived') {
    let query = supabase
      .from('blogs')
      .select(`
        *,
        categories:blog_categories(
          category:categories(*)
        )
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error

    if (!data) return []

    return data.map((blog: any) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featured_image: blog.featured_image,
      status: blog.status,
      published_at: blog.published_at,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
      author_id: blog.author_id,
      meta_title: blog.meta_title,
      meta_description: blog.meta_description,
      tags: blog.tags,
      categories: blog.categories?.map((bc: any) => bc.category) || []
    })) as Blog[]
  }

  static async getBlogBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        categories:blog_categories(
          category:categories(*)
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error

    return {
      id: (data as any).id,
      title: (data as any).title,
      slug: (data as any).slug,
      excerpt: (data as any).excerpt,
      content: (data as any).content,
      featured_image: (data as any).featured_image,
      status: (data as any).status,
      published_at: (data as any).published_at,
      created_at: (data as any).created_at,
      updated_at: (data as any).updated_at,
      author_id: (data as any).author_id,
      meta_title: (data as any).meta_title,
      meta_description: (data as any).meta_description,
      tags: (data as any).tags,
      categories: (data as any).categories?.map((bc: any) => bc.category) || []
    } as Blog
  }

  static async getBlogById(id: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select(`
        *,
        categories:blog_categories(
          category:categories(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      id: (data as any).id,
      title: (data as any).title,
      slug: (data as any).slug,
      excerpt: (data as any).excerpt,
      content: (data as any).content,
      featured_image: (data as any).featured_image,
      status: (data as any).status,
      published_at: (data as any).published_at,
      created_at: (data as any).created_at,
      updated_at: (data as any).updated_at,
      author_id: (data as any).author_id,
      meta_title: (data as any).meta_title,
      meta_description: (data as any).meta_description,
      tags: (data as any).tags,
      categories: (data as any).categories?.map((bc: any) => bc.category) || []
    } as Blog
  }

  static async createBlog(blogData: CreateBlogData) {
    const { category_ids, ...blogFields } = blogData

    // Insert blog
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .insert([{
        ...blogFields,
        published_at: blogData.status === 'published' ? new Date().toISOString() : null
      }])
      .select()
      .single()

    if (blogError) throw blogError

    // Insert blog-category relationships
    if (category_ids && category_ids.length > 0) {
      const { error: relationError } = await supabase
        .from('blog_categories')
        .insert(
          category_ids.map(category_id => ({
            blog_id: blog.id,
            category_id
          }))        )

      if (relationError) throw relationError
    }

    return blog as Blog
  }

  static async updateBlog(id: string, updateData: UpdateBlogData) {
    const { category_ids, ...blogFields } = updateData

    // Update published_at when changing to published status
    if (updateData.status === 'published' && !updateData.published_at) {
      blogFields.published_at = new Date().toISOString()
    }

    // Update blog
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .update(blogFields as any)
      .eq('id', id)
      .select()
      .single()

    if (blogError) throw blogError

    // Update blog-category relationships if provided
    if (category_ids !== undefined) {
      // Delete existing relationships
      await supabase
        .from('blog_categories')
        .delete()
        .eq('blog_id', id)

      // Insert new relationships
      if (category_ids.length > 0) {
        const { error: relationError } = await supabase
          .from('blog_categories')
          .insert(
            category_ids.map(category_id => ({
              blog_id: id,
              category_id
            }))          )

        if (relationError) throw relationError
      }
    }

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

// Category operations
export class CategoryService {
  static async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Category[]
  }

  static async createCategory(name: string, slug: string, description?: string) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, description } as any])
      .select()
      .single()

    if (error) throw error
    return data as Category
  }

  static async updateCategory(id: string, name: string, slug: string, description?: string) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug, description } as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Category
  }

  static async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}