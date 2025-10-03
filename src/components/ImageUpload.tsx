"use client"

import { useState, useRef } from 'react'
import { FaUpload, FaTrash, FaSpinner } from 'react-icons/fa'
import { uploadImage, deleteImage } from '@/lib/uploadImage'
import Image from 'next/image'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (url: string) => void
  folder?: string
  aspectRatio?: string
  maxSizeMB?: number
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  folder = 'images',
  aspectRatio = '1/1',
  maxSizeMB = 2
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Upload to Supabase
      const publicUrl = await uploadImage(file, folder)

      // Clean up object URL
      URL.revokeObjectURL(objectUrl)

      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image. Please try again.')
      setPreviewUrl(currentImageUrl || '')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!previewUrl) return

    try {
      // Only delete if it's a Supabase URL
      if (previewUrl.includes('supabase')) {
        await deleteImage(previewUrl)
      }

      setPreviewUrl('')
      onImageUploaded('')

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete image')
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      {previewUrl ? (
        <div className="relative">
          <div
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300"
            style={{ aspectRatio }}
          >
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain"
              onError={() => {
                setError('Failed to load image')
                setPreviewUrl('')
              }}
            />
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
            title="Remove image"
          >
            <FaTrash />
          </button>
        </div>
      ) : (
        /* Upload area */
        <div
          className="relative w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors cursor-pointer"
          style={{ aspectRatio }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <FaUpload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 text-center">
              Click to upload image
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Max {maxSizeMB}MB • JPG, PNG, WebP
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload button (when has preview) */}
      {previewUrl && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <FaUpload />
              <span>Change Image</span>
            </>
          )}
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500">
        Images are stored in Supabase Storage and automatically optimized.
      </p>
    </div>
  )
}
