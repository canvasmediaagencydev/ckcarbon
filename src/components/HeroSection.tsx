"use client";

import { FaCheckCircle, FaChartBar, FaLeaf, FaChevronDown } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface HeroSectionSettings {
  logo_type: 'text' | 'image'
  logo_text: string
  logo_image_url: string | null
  description: string
}

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [heroSettings, setHeroSettings] = useState<HeroSectionSettings>({
    logo_type: 'text',
    logo_text: 'LOGO\nCK CARBON',
    logo_image_url: null,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
  });

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_section')
        .single();

      if (error) throw error;
      if (data) {
        setHeroSettings(data.setting_value as HeroSectionSettings);
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/image/herobg.svg')"
        }}
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          <motion.div
            className="text-white space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="space-y-3 sm:space-y-4"
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {heroSettings.logo_type === 'image' && heroSettings.logo_image_url ? (
                <motion.div
                  className="relative h-24 sm:h-32 md:h-40 w-full max-w-md mt-16 sm:mt-12 md:mt-0"
                  initial={{ opacity: 0, y: -50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Image
                    src={heroSettings.logo_image_url}
                    alt="Hero Logo"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              ) : (
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-16 sm:mt-12 md:mt-0 font-bold leading-tight"
                  initial={{ opacity: 0, y: -50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {heroSettings.logo_text.split('\n').map((line, i) => (
                    <div key={i}>
                      {i === 0 ? line : <span className="text-green-200">{line}</span>}
                      {i < heroSettings.logo_text.split('\n').length - 1 && <br />}
                    </div>
                  ))}
                </motion.h1>
              )}
            </motion.div>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-green-100 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {heroSettings.description}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                className="bg-white text-green-700 font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg text-sm sm:text-base"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <motion.button
                className="border-2 border-white text-white font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-white hover:text-green-700 transition-colors text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative lg:ml-8 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl sm:rounded-2xl transform rotate-0 scale-105 opacity-20"
                animate={{
                  rotate: [6, 8, 6],
                  scale: [1.05, 1.08, 1.05]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.div
                className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <div className="space-y-4 sm:space-y-6">
                  <motion.div
                    className="flex items-center space-x-3 sm:space-x-4"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-800" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Carbon Tracking</h3>
                      <p className="text-green-100 text-xs sm:text-sm">Monitor your carbon footprint</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-3 sm:space-x-4"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChartBar className="w-5 h-5 sm:w-6 sm:h-6 text-green-800" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Smart Analytics</h3>
                      <p className="text-green-100 text-xs sm:text-sm">Data-driven insights</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-3 sm:space-x-4"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaLeaf className="w-5 h-5 sm:w-6 sm:h-6 text-green-800" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Eco Solutions</h3>
                      <p className="text-green-100 text-xs sm:text-sm">Sustainable recommendations</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-12 sm:bottom-20 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, -10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
