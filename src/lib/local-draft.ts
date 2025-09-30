// Local Draft Manager for blog posts with image preview support

export interface LocalImage {
  id: string
  file: File
  preview: string // blob URL for preview
  placeholder: string // placeholder ID used in content
  uploaded?: boolean
  finalUrl?: string // final Supabase URL after upload
}

export interface LocalDraft {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any // TipTap JSON content
  featuredImage?: LocalImage
  contentImages: LocalImage[] // images used in content
  metadata: {
    tags: string[]
    categoryIds: string[]
    metaTitle: string
    metaDescription: string
    status: 'draft' | 'published' | 'archived'
  }
  timestamp: number
  isAutoSave: boolean
}

const STORAGE_KEY = 'ckcarbon_blog_drafts'
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds

export class LocalDraftManager {
  private static instance: LocalDraftManager
  private autoSaveTimer?: NodeJS.Timeout

  static getInstance(): LocalDraftManager {
    if (!this.instance) {
      this.instance = new LocalDraftManager()
    }
    return this.instance
  }

  /**
   * Check if running in browser
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  /**
   * Generate unique ID for draft/image
   */
  static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Create blob URL for file preview
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  /**
   * Cleanup blob URL
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  }

  /**
   * Save draft to localStorage
   */
  saveDraft(draft: LocalDraft): void {
    if (!this.isBrowser()) return

    try {
      const drafts = this.getAllDrafts()
      const existingIndex = drafts.findIndex(d => d.id === draft.id)

      draft.timestamp = Date.now()

      if (existingIndex >= 0) {
        drafts[existingIndex] = draft
      } else {
        drafts.push(draft)
      }

      // Keep only last 10 drafts
      if (drafts.length > 10) {
        drafts.splice(0, drafts.length - 10)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }

  /**
   * Get draft by ID
   */
  getDraft(id: string): LocalDraft | null {
    if (!this.isBrowser()) return null

    const drafts = this.getAllDrafts()
    return drafts.find(d => d.id === id) || null
  }

  /**
   * Get all drafts
   */
  getAllDrafts(): LocalDraft[] {
    if (!this.isBrowser()) return []

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load drafts:', error)
      return []
    }
  }

  /**
   * Delete draft
   */
  deleteDraft(id: string): void {
    if (!this.isBrowser()) return

    try {
      const drafts = this.getAllDrafts()
      const filtered = drafts.filter(d => d.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))

      // Cleanup blob URLs for images
      const draft = drafts.find(d => d.id === id)
      if (draft) {
        draft.contentImages.forEach(img => {
          if (img.preview) {
            LocalDraftManager.revokePreviewUrl(img.preview)
          }
        })
        if (draft.featuredImage?.preview) {
          LocalDraftManager.revokePreviewUrl(draft.featuredImage.preview)
        }
      }
    } catch (error) {
      console.error('Failed to delete draft:', error)
    }
  }

  /**
   * Create local image object
   */
  createLocalImage(file: File): LocalImage {
    return {
      id: LocalDraftManager.generateId(),
      file,
      preview: LocalDraftManager.createPreviewUrl(file),
      placeholder: `local-image-${LocalDraftManager.generateId()}`,
      uploaded: false
    }
  }

  /**
   * Add image to draft
   */
  addImageToDraft(draftId: string, image: LocalImage, type: 'content' | 'featured' = 'content'): void {
    const draft = this.getDraft(draftId)
    if (!draft) return

    if (type === 'featured') {
      // Cleanup old featured image
      if (draft.featuredImage?.preview) {
        LocalDraftManager.revokePreviewUrl(draft.featuredImage.preview)
      }
      draft.featuredImage = image
    } else {
      draft.contentImages.push(image)
    }

    this.saveDraft(draft)
  }

  /**
   * Remove image from draft
   */
  removeImageFromDraft(draftId: string, imageId: string): void {
    const draft = this.getDraft(draftId)
    if (!draft) return

    // Remove from content images
    const imageIndex = draft.contentImages.findIndex(img => img.id === imageId)
    if (imageIndex >= 0) {
      const image = draft.contentImages[imageIndex]
      if (image.preview) {
        LocalDraftManager.revokePreviewUrl(image.preview)
      }
      draft.contentImages.splice(imageIndex, 1)
    }

    // Remove from featured image
    if (draft.featuredImage?.id === imageId) {
      if (draft.featuredImage.preview) {
        LocalDraftManager.revokePreviewUrl(draft.featuredImage.preview)
      }
      draft.featuredImage = undefined
    }

    this.saveDraft(draft)
  }

  /**
   * Get placeholder URL for content
   */
  getPlaceholderUrl(imageId: string): string {
    return `data:image/placeholder;id=${imageId}`
  }

  /**
   * Replace placeholders in content with real URLs
   * Now expects localImages array to create blob -> placeholder mapping
   */
  replacePlaceholdersInContent(content: any, imageMap: Record<string, string>, localImages: LocalImage[] = []): any {
    if (!content || typeof content !== 'object') return content

    if (Array.isArray(content)) {
      return content.map(item => this.replacePlaceholdersInContent(item, imageMap, localImages))
    }

    const result = { ...content }

    // Replace image src in TipTap content
    if (result.type === 'image' && result.attrs?.src) {
      const currentSrc = result.attrs.src

      // If it's a blob URL, find the corresponding placeholder and replace with final URL
      if (currentSrc.startsWith('blob:')) {
        const localImage = localImages.find(img => img.preview === currentSrc)
        if (localImage && imageMap[localImage.placeholder]) {
          result.attrs.src = imageMap[localImage.placeholder]
        }
      } else {
        // Fallback to old placeholder URL approach
        const placeholderId = this.extractPlaceholderId(currentSrc)
        if (placeholderId && imageMap[placeholderId]) {
          result.attrs.src = imageMap[placeholderId]
        }
      }
    }

    // Process nested content
    if (result.content) {
      result.content = this.replacePlaceholdersInContent(result.content, imageMap, localImages)
    }

    return result
  }

  /**
   * Extract placeholder ID from data URL
   */
  private extractPlaceholderId(src: string): string | null {
    const match = src.match(/data:image\/placeholder;id=([^&]+)/)
    return match ? match[1] : null
  }

  /**
   * Start auto-save for a draft
   */
  startAutoSave(draftId: string, getDraftData: () => Partial<LocalDraft>): void {
    this.stopAutoSave()

    this.autoSaveTimer = setInterval(() => {
      const draft = this.getDraft(draftId)
      if (draft) {
        const updatedData = getDraftData()
        const updatedDraft: LocalDraft = {
          ...draft,
          ...updatedData,
          isAutoSave: true
        }
        this.saveDraft(updatedDraft)
      }
    }, AUTO_SAVE_INTERVAL)
  }

  /**
   * Stop auto-save
   */
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = undefined
    }
  }

  /**
   * Create empty draft
   */
  createEmptyDraft(): LocalDraft {
    return {
      id: LocalDraftManager.generateId(),
      title: '',
      slug: '',
      excerpt: '',
      content: null,
      contentImages: [],
      metadata: {
        tags: [],
        categoryIds: [],
        metaTitle: '',
        metaDescription: '',
        status: 'draft'
      },
      timestamp: Date.now(),
      isAutoSave: false
    }
  }

  /**
   * Get draft statistics
   */
  getDraftStats(draftId: string): { imageCount: number; lastSaved: Date | null } {
    const draft = this.getDraft(draftId)
    if (!draft) return { imageCount: 0, lastSaved: null }

    const imageCount = draft.contentImages.length + (draft.featuredImage ? 1 : 0)
    const lastSaved = draft.timestamp ? new Date(draft.timestamp) : null

    return { imageCount, lastSaved }
  }
}