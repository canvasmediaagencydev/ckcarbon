"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

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

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [displayedTestimonials, setDisplayedTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (data) {
        setTestimonials(data);
        setDisplayedTestimonials(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <motion.section
      ref={ref}
      id="testimonials"
      className="relative py-12 sm:py-16 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-green-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          variants={fadeInVariants}
        >
          <motion.div
            className="inline-flex items-center space-x-2 sm:space-x-4 mb-6 sm:mb-8"
            variants={fadeInVariants}
          >
            <div className="h-1 w-12 sm:w-20 bg-gradient-to-r from-transparent to-green-500"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 px-2">
              What Our <span className="text-green-600">Customers</span> Say
            </h2>
            <div className="h-1 w-12 sm:w-20 bg-gradient-to-l from-transparent to-green-500"></div>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4"
            variants={fadeInVariants}
          >
            Real experiences from our valued partners who trust CK Carbon for their filtration needs
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="mb-12 sm:mb-16"
          variants={fadeInVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Quote Mark */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-2xl sm:text-3xl text-green-200 font-serif">"</div>

                {/* Star Rating */}
                <div className="flex space-x-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <p className="text-gray-700 mb-5 sm:mb-6 leading-relaxed text-xs sm:text-sm italic">
                  {testimonial.content}
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {testimonial.author_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                      {testimonial.author_name}
                    </h4>
                    <p className="text-green-600 font-medium text-[10px] sm:text-xs">
                      {testimonial.author_position}
                    </p>
                    <p className="text-gray-500 text-[10px] sm:text-xs">
                      {testimonial.author_company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More Button */}
          {testimonials.length > 3 && (
            <motion.div
              className="text-center mt-8 sm:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/testimonials">
                <motion.button
                  className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View More Testimonials
                  <FaArrowRight className="ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="text-center"
          variants={fadeInVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600 text-sm sm:text-base">Happy Customers</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">20+</div>
              <div className="text-gray-600 text-sm sm:text-base">Years Experience</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">99%</div>
              <div className="text-gray-600 text-sm sm:text-base">Satisfaction Rate</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
