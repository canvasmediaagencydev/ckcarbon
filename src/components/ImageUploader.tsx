'use client'

import { useState, useRef } from 'react'
import { StorageService } from '@/lib/storage'
import { LocalImage, LocalDraftManager } from '@/lib/local-draft'
import LocalImagePreview from './LocalImagePreview'
import { FaUpload, FaSpinner, FaTimes, FaEye } from 'react-icons/fa'

interface ImageUploaderProps {
  blogId?: string // Optional - if not provided, works in preview mode
  onImageUploaded?: (url: string) => void // Callback for immediate upload
  onImageSelected?: (image: LocalImage) => void // Callback for preview mode
  onClose: () => void
  mode?: 'upload' | 'preview' // upload = immediate upload, preview = local preview
  title?: string
}

export default function ImageUploader({
  blogId,
  onImageUploaded,
  onImageSelected,
  onClose,
  mode = 'upload',
  title = 'Upload Image'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<LocalImage | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setError(null)

    if (mode === 'preview') {
      // Preview mode: create local image and show preview
      const localImage = LocalDraftManager.getInstance().createLocalImage(file)
      setSelectedImage(localImage)
    } else {
      // Upload mode: immediately upload to server
      if (!blogId) {
        setError('Blog ID is required for upload mode')
        return
      }

      setUploading(true)

      try {
        const result = await StorageService.uploadImage(file, blogId)

        if (result.success && result.url && onImageUploaded) {
          onImageUploaded(result.url)
          onClose()
        } else {
          setError(result.error || 'Upload failed')
        }
      } catch (err) {
        setError('Upload failed. Please try again.')
        console.error('Upload error:', err)
      } finally {
        setUploading(false)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUseImage = () => {
    if (selectedImage && onImageSelected) {
      onImageSelected(selectedImage)
      onClose()
    }
  }

  const handleSelectAnother = () => {
    if (selectedImage?.preview) {
      LocalDraftManager.revokePreviewUrl(selectedImage.preview)
    }
    setSelectedImage(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={uploading}
          >
            <FaTimes size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {selectedImage ? (
          // Preview Mode - Show selected image
          <div className="space-y-4">
            <LocalImagePreview
              image={selectedImage}
              className="w-full"
            />

            <div className="flex space-x-3">
              <button
                onClick={handleSelectAnother}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Select Another
              </button>
              <button
                onClick={handleUseImage}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaEye className="inline mr-2" size={14} />
                Use Image
              </button>
            </div>
          </div>
        ) : (
          // Upload/Select Mode
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : uploading
                ? 'border-gray-300 bg-gray-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && !selectedImage && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              disabled={uploading}
            />

            <div className="flex flex-col items-center space-y-3">
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin text-blue-500" size={24} />
                  <p className="text-sm text-gray-600">
                    {mode === 'upload' ? 'Uploading...' : 'Processing...'}
                  </p>
                </>
              ) : (
                <>
                  <FaUpload className="text-gray-400" size={24} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Click to {mode === 'upload' ? 'upload' : 'select'} or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!selectedImage && (
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
