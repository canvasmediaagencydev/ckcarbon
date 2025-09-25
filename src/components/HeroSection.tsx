"use client";

import { FaCheckCircle, FaChartBar, FaLeaf, FaChevronDown } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <motion.div
            className="text-white space-y-8"
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="space-y-4"
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl mt-9 md:mt-0 font-bold leading-tight"
                initial={{ opacity: 0, y: -50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                LOGO
                <br />
                <span className="text-green-200">CK CARBON</span>
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-lg sm:text-xl text-green-100 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Quis ipsum
              suspendisse ultrices gravida. Risus commodo viverra maecenas
              accumsan lacus vel facilisis.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <motion.button
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative lg:ml-8"
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl transform rotate-0 scale-105 opacity-20"
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
                className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center space-x-4"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaCheckCircle className="w-6 h-6 text-green-800" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold">Carbon Tracking</h3>
                      <p className="text-green-100 text-sm">Monitor your carbon footprint</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChartBar className="w-6 h-6 text-green-800" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold">Smart Analytics</h3>
                      <p className="text-green-100 text-sm">Data-driven insights</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaLeaf className="w-6 h-6 text-green-800" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold">Eco Solutions</h3>
                      <p className="text-green-100 text-sm">Sustainable recommendations</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
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
          <FaChevronDown className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
