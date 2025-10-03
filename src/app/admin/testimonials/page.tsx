"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowUp, FaArrowDown, FaStar } from 'react-icons/fa'

interface Testimonial {
  id: string
  content: string
  author_name: string
  author_position: string
  author_company: string
  rating: number
  image_url: string | null
  display_order: number
  is_active: boolean
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const [formData, setFormData] = useState({
    content: '',
    author_name: '',
    author_position: '',
    author_company: '',
    rating: 5,
    image_url: ''
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setTestimonials(data || [])

    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setMessage({ type: 'error', text: 'Failed to load testimonials' })
    } finally {
      setLoading(false)
    }
  }

  const startAdd = () => {
    setFormData({
      content: '',
      author_name: '',
      author_position: '',
      author_company: '',
      rating: 5,
      image_url: ''
    })
    setIsAdding(true)
    setEditingId(null)
  }

  const startEdit = (testimonial: Testimonial) => {
    setFormData({
      content: testimonial.content,
      author_name: testimonial.author_name,
      author_position: testimonial.author_position,
      author_company: testimonial.author_company,
      rating: testimonial.rating,
      image_url: testimonial.image_url || ''
    })
    setEditingId(testimonial.id)
    setIsAdding(false)
  }

  const cancelEdit = () => {
    setFormData({
      content: '',
      author_name: '',
      author_position: '',
      author_company: '',
      rating: 5,
      image_url: ''
    })
    setEditingId(null)
    setIsAdding(false)
  }

  const addTestimonial = async () => {
    try {
      const maxOrder = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.display_order)) : 0

      const { error } = await supabase
        .from('testimonials')
        .insert([{
          content: formData.content,
          author_name: formData.author_name,
          author_position: formData.author_position,
          author_company: formData.author_company,
          rating: formData.rating,
          image_url: formData.image_url || null,
          display_order: maxOrder + 1
        }])

      if (error) throw error

      setMessage({ type: 'success', text: 'Testimonial added successfully!' })
      fetchTestimonials()
      cancelEdit()

    } catch (error) {
      console.error('Error adding testimonial:', error)
      setMessage({ type: 'error', text: 'Failed to add testimonial' })
    }
  }

  const updateTestimonial = async () => {
    if (!editingId) return

    try {
      const { error } = await supabase
        .from('testimonials')
        .update({
          content: formData.content,
          author_name: formData.author_name,
          author_position: formData.author_position,
          author_company: formData.author_company,
          rating: formData.rating,
          image_url: formData.image_url || null
        })
        .eq('id', editingId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Testimonial updated successfully!' })
      fetchTestimonials()
      cancelEdit()

    } catch (error) {
      console.error('Error updating testimonial:', error)
      setMessage({ type: 'error', text: 'Failed to update testimonial' })
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Testimonial deleted successfully!' })
      fetchTestimonials()

    } catch (error) {
      console.error('Error deleting testimonial:', error)
      setMessage({ type: 'error', text: 'Failed to delete testimonial' })
    }
  }

  const moveTestimonial = async (id: string, direction: 'up' | 'down') => {
    const index = testimonials.findIndex(t => t.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === testimonials.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const currentTestimonial = testimonials[index]
    const targetTestimonial = testimonials[targetIndex]

    try {
      // Swap display_order
      const { error: error1 } = await supabase
        .from('testimonials')
        .update({ display_order: targetTestimonial.display_order })
        .eq('id', currentTestimonial.id)

      const { error: error2 } = await supabase
        .from('testimonials')
        .update({ display_order: currentTestimonial.display_order })
        .eq('id', targetTestimonial.id)

      if (error1 || error2) throw error1 || error2

      fetchTestimonials()

    } catch (error) {
      console.error('Error moving testimonial:', error)
      setMessage({ type: 'error', text: 'Failed to reorder testimonial' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading testimonials...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Testimonials</h1>
          <p className="text-gray-600 mt-2">Manage customer reviews and testimonials</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isAdding ? 'Add New Testimonial' : 'Edit Testimonial'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter customer testimonial..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.author_position}
                  onChange={(e) => setFormData({ ...formData, author_position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="CEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.author_company}
                  onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <div className="flex items-center mt-2">
                  {[...Array(formData.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="/images/customer.jpg"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <button
                onClick={isAdding ? addTestimonial : updateTestimonial}
                disabled={!formData.content || !formData.author_name}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FaSave />
                <span>{isAdding ? 'Add Testimonial' : 'Save Changes'}</span>
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center space-x-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Testimonials List</h2>

          {testimonials.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No testimonials found. Add your first testimonial!</p>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-gray-400 font-mono text-sm">#{testimonial.display_order}</span>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400 text-sm" />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-700 italic mb-3">"{testimonial.content}"</p>

                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {testimonial.author_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{testimonial.author_name}</p>
                          <p className="text-xs text-green-600">{testimonial.author_position}</p>
                          <p className="text-xs text-gray-500">{testimonial.author_company}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => moveTestimonial(testimonial.id, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <FaArrowUp />
                      </button>

                      <button
                        onClick={() => moveTestimonial(testimonial.id, 'down')}
                        disabled={index === testimonials.length - 1}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <FaArrowDown />
                      </button>

                      <button
                        onClick={() => startEdit(testimonial)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
