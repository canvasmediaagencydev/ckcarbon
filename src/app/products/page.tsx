"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaShoppingCart, FaSearch, FaBox, FaArrowRight } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  button_text: string
  display_order: number
  is_active: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')



  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="relative pt-20 sm:pt-32 pb-16 sm:pb-24 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-72 sm:h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-32 h-32 sm:w-72 sm:h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-16 sm:-bottom-32 left-10 sm:left-20 w-32 h-32 sm:w-72 sm:h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              Our Products
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-green-100 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4">
              Discover our premium activated carbon solutions designed for water treatment and industrial applications.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>


          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group h-full"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50 flex-shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FaBox className="text-4xl text-gray-300" />
                        </div>
                      )}
                      

                    </div>

                    {/* Product Info */}
                    <div className="p-4 sm:p-6 flex flex-col flex-1">


                      {/* Product Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {product.description}
                      </p>



                      {/* CTA Button */}
                      <Link href={`/products/${product.id}`}>
                        <motion.button
                          className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 group flex-shrink-0"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>View Details</span>
                          <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Need Help Choosing the Right Product?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Our technical experts are ready to help you find the perfect activated carbon solution for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart className="inline mr-2" />
              Get Quote
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-colors border-2 border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Expert
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  )
}
