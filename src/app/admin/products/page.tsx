"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowUp, FaArrowDown, FaImage } from 'react-icons/fa'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  display_order: number
  is_active: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: 'รายละเอียดสินค้า',
    image_url: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setProducts(data || [])

    } catch (error) {
      console.error('Error fetching products:', error)
      setMessage({ type: 'error', text: 'Failed to load products' })
    } finally {
      setLoading(false)
    }
  }

  const startAdd = () => {
    setFormData({
      name: '',
      description: 'รายละเอียดสินค้า',
      image_url: ''
    })
    setIsAdding(true)
    setEditingId(null)
  }

  const startEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      image_url: product.image_url
    })
    setEditingId(product.id)
    setIsAdding(false)
  }

  const cancelEdit = () => {
    setFormData({
      name: '',
      description: 'รายละเอียดสินค้า',
      image_url: ''
    })
    setEditingId(null)
    setIsAdding(false)
  }

  const addProduct = async () => {
    try {
      const maxOrder = products.length > 0 ? Math.max(...products.map(p => p.display_order)) : 0

      const { error } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          description: formData.description,
          image_url: formData.image_url,
          display_order: maxOrder + 1
        }])

      if (error) throw error

      setMessage({ type: 'success', text: 'Product added successfully!' })
      fetchProducts()
      cancelEdit()

    } catch (error) {
      console.error('Error adding product:', error)
      setMessage({ type: 'error', text: 'Failed to add product' })
    }
  }

  const updateProduct = async () => {
    if (!editingId) return

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          image_url: formData.image_url
        })
        .eq('id', editingId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Product updated successfully!' })
      fetchProducts()
      cancelEdit()

    } catch (error) {
      console.error('Error updating product:', error)
      setMessage({ type: 'error', text: 'Failed to update product' })
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Product deleted successfully!' })
      fetchProducts()

    } catch (error) {
      console.error('Error deleting product:', error)
      setMessage({ type: 'error', text: 'Failed to delete product' })
    }
  }

  const moveProduct = async (id: string, direction: 'up' | 'down') => {
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === products.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const currentProduct = products[index]
    const targetProduct = products[targetIndex]

    try {
      // Swap display_order
      const { error: error1 } = await supabase
        .from('products')
        .update({ display_order: targetProduct.display_order })
        .eq('id', currentProduct.id)

      const { error: error2 } = await supabase
        .from('products')
        .update({ display_order: currentProduct.display_order })
        .eq('id', targetProduct.id)

      if (error1 || error2) throw error1 || error2

      fetchProducts()

    } catch (error) {
      console.error('Error moving product:', error)
      setMessage({ type: 'error', text: 'Failed to reorder product' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-green-100 dark:border-green-800 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent dark:text-white">
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage product catalog</p>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <FaPlus />
          <span className="font-medium">Add Product</span>
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-xl shadow-lg border ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white dark:bg-slate-800 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></span>
            {isAdding ? 'Add New Product' : 'Edit Product'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="Activate carbon ID 900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="รายละเอียดสินค้า"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Image
                </label>
                <ImageUpload
                  currentImageUrl={formData.image_url}
                  onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                  folder="products"
                  aspectRatio="4/3"
                  maxSizeMB={2}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-6">
            <button
              onClick={isAdding ? addProduct : updateProduct}
              disabled={!formData.name || !formData.image_url}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FaSave />
              <span>{isAdding ? 'Add Product' : 'Save Changes'}</span>
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center space-x-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white dark:bg-slate-800 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-8 hover:shadow-xl transition-shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></span>
          Products List
        </h2>

          {products.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No products found. Add your first product!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>
                    )}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      #{product.display_order}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">{product.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => moveProduct(product.id, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <FaArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => moveProduct(product.id, 'down')}
                        disabled={index === products.length - 1}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <FaArrowDown size={12} />
                      </button>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded"
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
  )
}
