'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BlogService, CategoryService, Category } from '@/lib/blog'
import TipTapEditor from '@/components/TipTapEditor'
import { LocalImage, LocalDraftManager } from '@/lib/local-draft'
import { StorageService } from '@/lib/storage'
import { FaSave, FaEye, FaImages } from 'react-icons/fa'
import ImageUpload from '@/components/ImageUpload'

export default function NewBlogPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [localImages, setLocalImages] = useState<LocalImage[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: null,
    featured_image: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    meta_title: '',
    meta_description: '',
    tags: [] as string[],
    category_ids: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleTitleChange = (title: string) => {
    const slug = BlogService.generateSlug(title)
    setFormData(prev => ({ ...prev, title, slug }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      category_ids: checked
        ? [...prev.category_ids, categoryId]
        : prev.category_ids.filter(id => id !== categoryId)
    }))
  }

  // Upload local images to Supabase and get URL mapping
  const uploadLocalImages = async (blogId: string): Promise<Record<string, string>> => {
    if (localImages.length === 0) return {}

    setUploadingImages(true)
    const imageUrlMap: Record<string, string> = {}

    try {
      // Upload all images concurrently
      const uploadPromises = localImages.map(async (image) => {
        const result = await StorageService.uploadImage(image.file, blogId)
        if (result.success && result.url) {
          imageUrlMap[image.placeholder] = result.url
        }
        return result
      })

      await Promise.all(uploadPromises)
      return imageUrlMap
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title || !formData.content) {
      alert('Please fill in the title and content')
      return
    }

    try {
      setLoading(true)

      // Step 1: Create blog post
      const blog = await BlogService.createBlog({
        ...formData,
        status
      })

      // Step 2: Upload local images if any
      let finalContent: any = formData.content
      if (localImages.length > 0) {
        const imageUrlMap = await uploadLocalImages(blog.id)

        // Step 3: Replace placeholders in content with real URLs
        const draftManager = LocalDraftManager.getInstance()
        finalContent = draftManager.replacePlaceholdersInContent(formData.content, imageUrlMap, localImages)

        // Step 4: Update blog with final content
        await BlogService.updateBlog(blog.id, {
          content: finalContent
        })
      }

      // Cleanup local images
      localImages.forEach(image => {
        if (image.preview) {
          LocalDraftManager.revokePreviewUrl(image.preview)
        }
      })

      router.push('/admin/blogs')
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Error saving blog post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-gray-600 mt-2">Create a new blog post</p>
        </div>
        <div className="flex items-center space-x-3">
          {localImages.length > 0 && (
            <span className="flex items-center text-sm text-gray-600">
              <FaImages size={14} className="mr-1" />
              {localImages.length} local image{localImages.length > 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading || uploadingImages}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            <FaSave size={16} />
            <span>{uploadingImages ? 'Uploading...' : 'Save Draft'}</span>
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={loading || uploadingImages}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaEye size={16} />
            <span>{uploadingImages ? 'Uploading...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Slug */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="blog-post-slug"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the blog post"
                />
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Content *
            </label>
            <TipTapEditor
              content={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              mode="local"
              onLocalImagesChange={setLocalImages}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
            <ImageUpload
              currentImageUrl={formData.featured_image}
              onImageUploaded={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
              folder="blogs"
              aspectRatio="16/9"
              maxSizeMB={2}
            />
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.category_ids.includes(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SEO title"
                />
              </div>
              <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SEO description"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}