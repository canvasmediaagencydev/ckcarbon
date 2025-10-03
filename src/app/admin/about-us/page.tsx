"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaSave } from 'react-icons/fa'

interface AboutUsContent {
  id: string
  content: string
}

export default function AboutUsPage() {
  const [content, setContent] = useState<AboutUsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('about_us_content')
        .select('*')
        .single()

      if (error) throw error
      setContent(data)

    } catch (error) {
      console.error('Error fetching content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (!content) return

    try {
      setSaving(true)
      setMessage(null)

      const { error } = await supabase
        .from('about_us_content')
        .update({
          content: content.content
        })
        .eq('id', content.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Content saved successfully!' })

      // Reload after 1 second
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (error) {
      console.error('Error saving content:', error)
      setMessage({ type: 'error', text: 'Failed to save content' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading content...</div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">No content found. Please run the migration SQL.</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About Us Content</h1>
        <p className="text-gray-600 mt-2">Manage the content displayed in the About Us section</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Content Form */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Us Content
            </label>
            <textarea
              value={content.content}
              onChange={(e) => setContent({ ...content, content: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter about us content..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your about us content in any language
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content.content}</p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveContent}
          disabled={saving}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FaSave />
          <span>{saving ? 'Saving...' : 'Save Content'}</span>
        </button>
      </div>
    </div>
  )
}
