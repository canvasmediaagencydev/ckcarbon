"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaShoppingCart, FaShare, FaHeart, FaStar, FaCheck, FaTruck, FaShieldAlt, FaArrowLeft, FaExpand, FaCompress, FaBox, FaUser } from 'react-icons/fa'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import ShareButtons from '@/components/ShareButtons'

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  button_text: string
  display_order: number
  is_active: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/#products')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const shareUrl = `https://www.ckcarbon.co.th/products/${params.id}`;
  const shareTitle = product?.name || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Like Blog */}
      <div className="relative pt-20 sm:pt-32 pb-16 sm:pb-24 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-72 sm:h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-32 h-32 sm:w-72 sm:h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-16 sm:-bottom-32 left-10 sm:left-20 w-32 h-32 sm:w-72 sm:h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6 mt-10 sm:mb-8">
            <button
              onClick={() => router.push('/#products')}
              className="inline-flex items-center text-green-100 hover:text-white transition-all duration-300 group"
            >
              <FaArrowLeft className="mr-2 sm:mr-3 w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span className="text-base sm:text-lg font-medium">Back to Products</span>
            </button>
          </div>

          <div className="text-center max-w-4xl mx-auto">
           
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              {product.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
            {/* Product Content */}
            <article className="flex-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-12 border border-gray-100">
                {/* Featured Image */}
                <div className="relative h-48 sm:h-64 lg:h-96 mb-6 sm:mb-8 lg:mb-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gray-50">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 800px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-400 text-center">
                        <FaBox className="text-5xl mx-auto mb-3" />
                        <p className="text-sm">Product Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Fullscreen Button */}
                  {product.image_url && (
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <FaExpand className="text-gray-600 text-sm" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="prose prose-base sm:prose-lg max-w-none">
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      {product.description}
                    </p>
                  </div>
                </div>



                {/* CTA Section */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Order?</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Contact us for bulk pricing and technical specifications.</p>
                  <motion.button
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-xl sm:rounded-2xl hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaShoppingCart className="mr-2 sm:mr-3 w-4 h-4" />
                    {product.button_text}
                  </motion.button>
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mt-4">
                    <span>✓ Free Consultation</span>
                    <span>✓ Bulk Pricing</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-80">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Share Section */}
                <ShareButtons url={shareUrl} title={shareTitle} />



                {/* Company Info CTA */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About CK Carbon</h3>
                  <p className="text-green-100 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    Leading the industry in sustainable carbon production and advanced water treatment solutions.
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-green-600 rounded-xl sm:rounded-2xl hover:bg-green-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                  >
                    Learn More About Us
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {isFullscreen && product.image_url && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={product.image_url}
              alt={product.name}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FaCompress className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
