"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import ImageUpload from '@/components/ImageUpload'

interface OEMService {
  id: string
  title: string
  icon?: string
  image_url: string
  display_order: number
  is_active: boolean
}

export default function OEMServicesPage() {
  const [services, setServices] = useState<OEMService[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    image_url: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('oem_services')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setServices(data || [])

    } catch (error) {
      console.error('Error fetching services:', error)
      setMessage({ type: 'error', text: 'Failed to load services' })
    } finally {
      setLoading(false)
    }
  }

  const startAdd = () => {
    setFormData({ title: '', image_url: '' })
    setIsAdding(true)
    setEditingId(null)
  }

  const startEdit = (service: OEMService) => {
    setFormData({ title: service.title, image_url: service.image_url })
    setEditingId(service.id)
    setIsAdding(false)
  }

  const cancelEdit = () => {
    setFormData({ title: '', image_url: '' })
    setEditingId(null)
    setIsAdding(false)
  }

  const addService = async () => {
    try {
      const maxOrder = services.length > 0 ? Math.max(...services.map(s => s.display_order)) : 0

      const { error } = await supabase
        .from('oem_services')
        .insert([{
          title: formData.title,
          image_url: formData.image_url,
          display_order: maxOrder + 1
        }])

      if (error) throw error

      setMessage({ type: 'success', text: 'Service added successfully!' })
      fetchServices()
      cancelEdit()

    } catch (error) {
      console.error('Error adding service:', error)
      setMessage({ type: 'error', text: 'Failed to add service' })
    }
  }

  const updateService = async () => {
    if (!editingId) return

    try {
      const { error } = await supabase
        .from('oem_services')
        .update({
          title: formData.title,
          image_url: formData.image_url
        })
        .eq('id', editingId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Service updated successfully!' })
      fetchServices()
      cancelEdit()

    } catch (error) {
      console.error('Error updating service:', error)
      setMessage({ type: 'error', text: 'Failed to update service' })
    }
  }

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const { error } = await supabase
        .from('oem_services')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Service deleted successfully!' })
      fetchServices()

    } catch (error) {
      console.error('Error deleting service:', error)
      setMessage({ type: 'error', text: 'Failed to delete service' })
    }
  }

  const moveService = async (id: string, direction: 'up' | 'down') => {
    const index = services.findIndex(s => s.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === services.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const currentService = services[index]
    const targetService = services[targetIndex]

    try {
      // Swap display_order
      const { error: error1 } = await supabase
        .from('oem_services')
        .update({ display_order: targetService.display_order })
        .eq('id', currentService.id)

      const { error: error2 } = await supabase
        .from('oem_services')
        .update({ display_order: currentService.display_order })
        .eq('id', targetService.id)

      if (error1 || error2) throw error1 || error2

      fetchServices()

    } catch (error) {
      console.error('Error moving service:', error)
      setMessage({ type: 'error', text: 'Failed to reorder service' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading services...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OEM Services</h1>
          <p className="text-gray-600 mt-2">Manage OEM service providers</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaPlus />
          <span>Add Service</span>
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
            {isAdding ? 'Add New Service' : 'Edit Service'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="บจก. ชื่อบริษัท"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                folder="oem"
                aspectRatio="1/1"
                maxSizeMB={1}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <button
                onClick={isAdding ? addService : updateService}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaSave />
                <span>{isAdding ? 'Add' : 'Save'}</span>
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

      {/* Services List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Services List</h2>

          {services.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No services found. Add your first service!</p>
          ) : (
            <div className="space-y-2">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 font-mono">#{service.display_order}</span>
                    {/* Service Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{service.image_url}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Move Up */}
                    <button
                      onClick={() => moveService(service.id, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <FaArrowUp />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveService(service.id, 'down')}
                      disabled={index === services.length - 1}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <FaArrowDown />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => startEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteService(service.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
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
