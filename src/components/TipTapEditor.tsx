'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { useCallback, useEffect, useState } from 'react'
import ImageUploader from './ImageUploader'
import { LocalImage, LocalDraftManager } from '@/lib/local-draft'
import { LocalImageGallery } from './LocalImagePreview'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo,
  FaTable,
  FaTimes
} from 'react-icons/fa'

interface TipTapEditorProps {
  content: any
  onChange: (content: any) => void
  placeholder?: string
  editable?: boolean
  blogId?: string // เพิ่ม blogId สำหรับการอัพโหลดรูป
  onImageUploadRequested?: () => Promise<string | null> // callback สำหรับสร้าง blog ID เมื่อต้องการอัพโหลดรูป
  mode?: 'local' | 'upload' // local = preview mode, upload = immediate upload
  onLocalImagesChange?: (images: LocalImage[]) => void // callback สำหรับ local images
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = 'Start writing your blog post...',
  editable = true,
  blogId,
  onImageUploadRequested,
  mode = 'local',
  onLocalImagesChange
}: TipTapEditorProps) {
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [currentBlogId, setCurrentBlogId] = useState<string | null>(blogId || null)
  const [localImages, setLocalImages] = useState<LocalImage[]>([])
  const [showImageGallery, setShowImageGallery] = useState(false)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'tiptap-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'tiptap-list-item',
          },
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      CharacterCount,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || '',
    editable,
    autofocus: false,
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange(json)
    },
    onCreate: ({ editor }) => {
      if (content) {
        editor.commands.setContent(content, { emitUpdate: false })
      }
    },
  })

  // Update editor content when prop changes (with debouncing to prevent conflicts)
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.getJSON()
      const isContentDifferent = JSON.stringify(currentContent) !== JSON.stringify(content)

      if (isContentDifferent && !editor.isFocused) {
        editor.commands.setContent(content, { emitUpdate: false })
      }
    }
  }, [editor, content])

  const handleAddImage = useCallback(async () => {
    if (mode === 'local') {
      // Local mode: use preview
      setShowImageUploader(true)
    } else {
      // Upload mode: behave like before
      if (currentBlogId) {
        setShowImageUploader(true)
      } else if (onImageUploadRequested) {
        const newBlogId = await onImageUploadRequested()
        if (newBlogId) {
          setCurrentBlogId(newBlogId)
          setShowImageUploader(true)
        }
      } else {
        setShowImageDialog(true)
      }
    }
  }, [mode, currentBlogId, onImageUploadRequested])

  const handleImageSubmit = () => {
    if (imageUrl.trim() && editor) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run()
      setImageUrl('')
      setShowImageDialog(false)
    }
  }

  const handleAddLink = useCallback(() => {
    const { from, to } = editor?.state.selection || { from: 0, to: 0 }
    const text = editor?.state.doc.textBetween(from, to, '')
    setLinkText(text || '')

    const previousUrl = editor?.getAttributes('link').href
    setLinkUrl(previousUrl || '')
    setShowLinkDialog(true)
  }, [editor])

  const handleLinkSubmit = () => {
    if (!editor) return

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setShowLinkDialog(false)
      return
    }

    if (linkUrl.trim()) {
      // If we have selected text, just add link to selection
      if (editor.state.selection.from !== editor.state.selection.to) {
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run()
      } else {
        // If no text selected, insert link with text
        const text = linkText.trim() || linkUrl.trim()
        editor.chain().focus().insertContent(`<a href="${linkUrl.trim()}">${text}</a>`).run()
      }
    }

    setLinkUrl('')
    setLinkText('')
    setShowLinkDialog(false)
  }

  const handleAddTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const handleImageUploaded = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleLocalImageSelected = (image: LocalImage) => {
    if (editor) {
      // Add image to local images list
      const updatedImages = [...localImages, image]
      setLocalImages(updatedImages)
      onLocalImagesChange?.(updatedImages)

      // Insert the actual blob URL in the editor for preview
      editor.chain().focus().setImage({
        src: image.preview
      }).run()
    }
  }

  const handleRemoveLocalImage = (imageId: string) => {
    const updatedImages = localImages.filter(img => img.id !== imageId)
    setLocalImages(updatedImages)
    onLocalImagesChange?.(updatedImages)

    // Find and remove corresponding image from editor content
    // This would require traversing the editor's JSON structure
    // For now, we'll leave the placeholder in content
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-4 min-h-[300px] flex items-center justify-center bg-gray-50">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {editable && (
        <div className="flex flex-wrap gap-1 p-3 border-b border-gray-200 bg-gray-50">
          {/* Text formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaBold size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaItalic size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('underline') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaUnderline size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('strike') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaStrikethrough size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            H1
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            H2
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bulletList') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaListUl size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('orderedList') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaListOl size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('blockquote') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaQuoteLeft size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('codeBlock') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaCode size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaAlignLeft size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaAlignCenter size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaAlignRight size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Media */}
          <button
            onClick={handleAddLink}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('link') ? 'bg-gray-300' : ''
            }`}
            type="button"
            title="Add Link"
          >
            <FaLink size={14} />
          </button>

          <button
            onClick={handleAddImage}
            className="p-2 rounded hover:bg-gray-200"
            type="button"
            title="Add Image"
          >
            <FaImage size={14} />
          </button>

          <button
            onClick={handleAddTable}
            className="p-2 rounded hover:bg-gray-200"
            type="button"
            title="Insert Table"
          >
            <FaTable size={14} />
          </button>

          {mode === 'local' && localImages.length > 0 && (
            <button
              onClick={() => setShowImageGallery(true)}
              className="p-2 rounded hover:bg-gray-200 relative"
              type="button"
              title="View Local Images"
            >
              <FaImage size={14} />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {localImages.length}
              </span>
            </button>
          )}

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* History */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200"
            disabled={!editor.can().chain().focus().undo().run()}
            type="button"
          >
            <FaUndo size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200"
            disabled={!editor.can().chain().focus().redo().run()}
            type="button"
          >
            <FaRedo size={14} />
          </button>
        </div>
      )}

      <div className="p-4 min-h-[300px] bg-white editor-container">
        <EditorContent
          editor={editor}
          className="prose max-w-none focus:outline-none tiptap-editor"
        />
      </div>

      {editable && editor.storage.characterCount && (
        <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
          <span>{editor.storage.characterCount.characters()} characters</span>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Image</h3>
            <input
              type="url"
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleImageSubmit()}
            />
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => {
                  setImageUrl('')
                  setShowImageDialog(false)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleImageSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!imageUrl.trim()}
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Link</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Link text (optional)..."
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="url"
                placeholder="Enter URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleLinkSubmit()}
              />
            </div>
            <div className="flex space-x-3 justify-end mt-4">
              <button
                onClick={() => {
                  setLinkUrl('')
                  setLinkText('')
                  setShowLinkDialog(false)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Uploader */}
      {showImageUploader && (
        <ImageUploader
          blogId={mode === 'upload' ? (currentBlogId || undefined) : undefined}
          mode={mode === 'local' ? 'preview' : 'upload'}
          title={mode === 'local' ? 'Select Image' : 'Upload Image'}
          onImageUploaded={mode === 'upload' ? handleImageUploaded : undefined}
          onImageSelected={mode === 'local' ? handleLocalImageSelected : undefined}
          onClose={() => setShowImageUploader(false)}
        />
      )}

      {/* Local Image Gallery */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Local Images ({localImages.length})</h3>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <LocalImageGallery
              images={localImages}
              onRemoveImage={handleRemoveLocalImage}
              showUploadButtons={false}
            />

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowImageGallery(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}