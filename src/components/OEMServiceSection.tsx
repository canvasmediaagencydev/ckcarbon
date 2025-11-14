"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface OEMService {
  id: string
  title: string
  icon?: string
  image_url: string
  display_order: number
}

export default function OEMServiceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState<OEMService[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('oem_services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching OEM services:', error);
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <motion.section
      ref={ref}
      id="oem"
      className="relative py-20 lg:py-32 bg-gray-50 overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInVariants}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
            variants={fadeInVariants}
          >
            <span className="text-green-600">OEM</span> Service
          </motion.h2>
        </motion.div>

        {/* Services Carousel */}
        <motion.div
          className="relative max-w-6xl mx-auto"
          variants={fadeInVariants}
        >
          {/* Desktop View - Show all cards in grid */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
              <div className="grid grid-cols-5 gap-0">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-50 p-6 text-center border-r border-gray-200 last:border-r-0 hover:bg-white transition-colors group"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Image Container */}
                    <motion.div
                      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.image_url ? (
                        <div className="relative w-full h-full p-2">
                          <Image
                            src={service.image_url}
                            alt={service.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </motion.div>

                    {/* Service Info */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900 leading-tight">
                        {service.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Carousel View */}
          <div className="lg:hidden relative">
            {/* Navigation Arrows */}
            <motion.button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaArrowLeft className="w-3 h-3" />
            </motion.button>

            <motion.button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaArrowRight className="w-3 h-3" />
            </motion.button>

            {/* Services Cards Container */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-lg mx-8">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    className="w-full flex-shrink-0 bg-gray-50 p-8 text-center hover:bg-white transition-colors group"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    {/* Image Container */}
                    <motion.div
                      className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.image_url ? (
                        <div className="relative w-full h-full p-2">
                          <Image
                            src={service.image_url}
                            alt={service.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </motion.div>

                    {/* Service Info */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {service.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dots Indicator for Mobile */}
            <div className="flex justify-center mt-6 space-x-2">
              {services.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Button */}
        <motion.div
          className="text-center mt-16"
          variants={fadeInVariants}
        >
          <motion.button
            className="bg-green-600 text-white font-semibold px-12 py-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg text-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
              y: -2
            }}
            whileTap={{ scale: 0.95 }}
          >
            ติดต่อสอบถาม
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}