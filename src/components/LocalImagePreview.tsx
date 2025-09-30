'use client'

import { useState, useEffect } from 'react'
import { LocalImage } from '@/lib/local-draft'
import { FaTimes, FaUpload, FaCheck, FaSpinner } from 'react-icons/fa'

interface LocalImagePreviewProps {
  image: LocalImage
  onRemove?: () => void
  onUpload?: (image: LocalImage) => Promise<void>
  showUploadButton?: boolean
  className?: string
}

export default function LocalImagePreview({
  image,
  onRemove,
  onUpload,
  showUploadButton = false,
  className = ''
}: LocalImagePreviewProps) {
  const [uploading, setUploading] = useState(false)

  // Initialize preview URL immediately
  const getPreviewUrl = () => {
    if (image.uploaded && image.finalUrl) {
      return image.finalUrl
    } else if (image.preview) {
      return image.preview
    }
    return ''
  }

  const [previewUrl, setPreviewUrl] = useState<string>(getPreviewUrl())

  useEffect(() => {
    const url = getPreviewUrl()
    setPreviewUrl(url)
  }, [image])

  const handleUpload = async () => {
    if (!onUpload || uploading) return

    try {
      setUploading(true)
      await onUpload(image)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-32 object-cover"
            onError={() => setPreviewUrl('')}
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-1">📷</div>
              <div className="text-xs">Loading...</div>
            </div>
          </div>
        )}

        {/* Upload Status Overlay */}
        {image.uploaded && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-full p-2">
              <FaCheck className="text-green-500" size={16} />
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-full p-2">
              <FaSpinner className="animate-spin text-blue-500" size={16} />
            </div>
          </div>
        )}

        {/* Remove Button */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Remove image"
          >
            <FaTimes size={12} />
          </button>
        )}

        {/* Upload Button */}
        {showUploadButton && !image.uploaded && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 disabled:opacity-50"
            title="Upload to server"
          >
            <FaUpload size={12} />
          </button>
        )}
      </div>

      {/* Image Info */}
      <div className="mt-2 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span className="truncate" title={image.file.name}>
            {image.file.name}
          </span>
          <span>{formatFileSize(image.file.size)}</span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className={`px-1 py-0.5 rounded text-xs ${
            image.uploaded
              ? 'bg-green-100 text-green-700'
              : uploading
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {image.uploaded ? 'Uploaded' : uploading ? 'Uploading...' : 'Local'}
          </span>

          {image.file.type && (
            <span className="text-xs text-gray-400">
              {image.file.type.split('/')[1].toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Gallery component for multiple images
interface LocalImageGalleryProps {
  images: LocalImage[]
  onRemoveImage?: (imageId: string) => void
  onUploadImage?: (image: LocalImage) => Promise<void>
  showUploadButtons?: boolean
  className?: string
}

export function LocalImageGallery({
  images,
  onRemoveImage,
  onUploadImage,
  showUploadButtons = false,
  className = ''
}: LocalImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-2">📷</div>
        <p>No images yet</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {images.map((image) => (
        <LocalImagePreview
          key={image.id}
          image={image}
          onRemove={onRemoveImage ? () => onRemoveImage(image.id) : undefined}
          onUpload={onUploadImage}
          showUploadButton={showUploadButtons}
        />
      ))}
    </div>
  )
}

// Hook for managing local images
export function useLocalImages() {
  const [images, setImages] = useState<LocalImage[]>([])

  const addImage = (file: File): LocalImage => {
    const newImage: LocalImage = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      placeholder: `placeholder-${Date.now()}`,
      uploaded: false
    }

    setImages(prev => [...prev, newImage])
    return newImage
  }

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === imageId)
      if (image?.preview) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter(img => img.id !== imageId)
    })
  }

  const updateImage = (imageId: string, updates: Partial<LocalImage>) => {
    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, ...updates } : img
    ))
  }

  const clearImages = () => {
    images.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview)
      }
    })
    setImages([])
  }

  return {
    images,
    addImage,
    removeImage,
    updateImage,
    clearImages
  }
}