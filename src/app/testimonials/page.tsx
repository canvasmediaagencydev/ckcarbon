"use client"

import { useState, useEffect } from 'react'
import { FaStar, FaQuoteLeft, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface Testimonial {
  id: string
  content: string
  author_name: string
  author_position: string
  author_company: string
  rating: number
  image_url: string | null
  display_order: number
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading testimonials...</p>
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
            {/* Back Button */}
            <Link href="/#testimonials">
              <motion.button
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 mb-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </motion.button>
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              Customer <span className="text-green-300">Testimonials</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-green-100 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4">
              Real experiences from our valued partners who trust CK Carbon for their filtration needs
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600 text-sm sm:text-base">Happy Customers</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">20+</div>
              <div className="text-gray-600 text-sm sm:text-base">Years Experience</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">99%</div>
              <div className="text-gray-600 text-sm sm:text-base">Satisfaction Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-8 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length === 0 ? (
            <div className="text-center py-16">
              <FaQuoteLeft className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No testimonials found</h3>
              <p className="text-gray-600">Check back soon for customer reviews</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group h-full"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col p-6 sm:p-8 relative">
                    {/* Quote Mark */}
                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-4xl sm:text-5xl text-green-200 font-serif">
                      <FaQuoteLeft className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>

                    {/* Star Rating */}
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base italic flex-1">
                      {testimonial.content}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm sm:text-base">
                          {testimonial.author_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                          {testimonial.author_name}
                        </h4>
                        <p className="text-green-600 font-medium text-xs sm:text-sm">
                          {testimonial.author_position}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                          {testimonial.author_company}
                        </p>
                      </div>
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
            Ready to Join Our Happy Customers?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Experience the quality and service that our customers rave about. Contact us today to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <motion.button
                className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button
                className="px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-colors border-2 border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Products
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
