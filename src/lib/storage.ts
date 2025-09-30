import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export class StorageService {
  private static BUCKET_NAME = 'blog'

  /**
   * Upload image to Supabase Storage
   */
  static async uploadImage(
    file: File,
    blogId: string,
    fileName?: string
  ): Promise<UploadResult> {
    try {
      // Generate filename if not provided
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileExtension = file.name.split('.').pop()
      const finalFileName = fileName || `image-${timestamp}.${fileExtension}`

      // Create file path: blog-id/filename
      const filePath = `${blogId}/${finalFileName}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Replace if file already exists
        })

      if (error) {
        console.error('Upload error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath)

      return {
        success: true,
        url: urlData.publicUrl
      }
    } catch (error) {
      console.error('Upload exception:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Delete image from Supabase Storage
   */
  static async deleteImage(
    blogId: string,
    fileName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const filePath = `${blogId}/${fileName}`

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath])

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * List all images for a specific blog
   */
  static async listBlogImages(blogId: string) {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(blogId, {
          limit: 100,
          offset: 0
        })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('List images error:', error)
      return []
    }
  }

  /**
   * Get public URL for an image
   */
  static getImageUrl(blogId: string, fileName: string): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(`${blogId}/${fileName}`)

    return data.publicUrl
  }

  /**
   * Delete entire blog folder (all images for a blog)
   */
  static async deleteBlogFolder(blogId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // List all files in the blog folder
      const files = await this.listBlogImages(blogId)

      if (files.length === 0) {
        return { success: true } // No files to delete
      }

      // Create array of file paths to delete
      const filePaths = files.map(file => `${blogId}/${file.name}`)

      // Delete all files in the folder
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove(filePaths)

      if (error) {
        console.error('Delete folder error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      console.log(`Deleted ${files.length} images from blog ${blogId}`)
      return { success: true }
    } catch (error) {
      console.error('Delete blog folder exception:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Clean up unused images for a blog (images that are not referenced in content)
   */
  static async cleanupUnusedImages(blogId: string, blogContent: any): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
    try {
      // Get all images in the blog folder
      const files = await this.listBlogImages(blogId)

      if (files.length === 0) {
        return { success: true, deletedCount: 0 }
      }

      // Extract image URLs from blog content
      const usedImageUrls = this.extractImageUrlsFromContent(blogContent)
      const usedFilenames = usedImageUrls
        .map(url => url.split('/').pop()) // Get filename from URL
        .filter(Boolean)

      // Find unused files
      const unusedFiles = files.filter(file => !usedFilenames.includes(file.name))

      if (unusedFiles.length === 0) {
        return { success: true, deletedCount: 0 }
      }

      // Delete unused files
      const filePaths = unusedFiles.map(file => `${blogId}/${file.name}`)
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove(filePaths)

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      console.log(`Cleaned up ${unusedFiles.length} unused images from blog ${blogId}`)
      return { success: true, deletedCount: unusedFiles.length }
    } catch (error) {
      console.error('Cleanup unused images error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Extract image URLs from TipTap content
   */
  private static extractImageUrlsFromContent(content: any): string[] {
    const imageUrls: string[] = []

    const traverse = (node: any) => {
      if (node.type === 'image' && node.attrs?.src) {
        imageUrls.push(node.attrs.src)
      }

      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse)
      }
    }

    if (content) {
      traverse(content)
    }

    return imageUrls
  }

  /**
   * Generate a unique filename
   */
  static generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const extension = originalName.split('.').pop()
    return `${timestamp}-${random}.${extension}`
  }
}