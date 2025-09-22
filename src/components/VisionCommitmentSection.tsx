"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function VisionCommitmentSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };


  const commitments = [
    {
      number: "01",
      title: "Deliver products with quality that matches their value, accessible to everyone"
    },
    {
      number: "02",
      title: ".. Continuously improve and innovate for sustainable product quality"
    },
    {
      number: "03",
      title: "Provide fast and  sincere service"
    }
  ];

  return (
    <motion.section
      ref={ref}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vision Section */}
        <motion.div
          className="text-center mb-20"
          variants={fadeInVariants}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-white mb-12"
            variants={fadeInVariants}
          >
            Vision <span className="text-gray-400 mx-4">|</span> <span className="text-green-400">วิสัยทัศน์</span>
          </motion.h2>

          {/* Quote Card */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            variants={fadeInVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl relative">

              {/* Quote Content */}
              <div className="text-gray-800 text-lg lg:text-xl leading-relaxed font-medium">
                <span className="text-3xl text-green-600">" </span>To become a{" "}
                <span className="text-green-600 font-bold">leading provider</span>{" "}
                of premium{" "}
                <span className="text-green-600 font-bold">activated carbon</span>,{" "}
                elevating water purification standards and contributing to a sustainable future.
                 <span className="text-3xl text-green-600">" </span>
              </div>


            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-16 h-16 bg-green-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.div
              className="absolute -bottom-8 -left-8 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </motion.div>

        {/* Commitment Section */}
        <motion.div
          className="text-center"
          variants={fadeInVariants}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-white mb-16"
            variants={fadeInVariants}
          >
            Commitment <span className="text-gray-400 mx-4">|</span> <span className="text-green-400">ความมุ่งมั่น</span>
          </motion.h2>

          {/* Commitment Circles */}
          <div className="relative">
            {/* Desktop Layout - Overlapping Circles */}
            <div className="hidden lg:flex justify-center items-center relative">
              {commitments.map((commitment, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    marginLeft: index > 0 ? '-40px' : '0',
                    zIndex: commitments.length - index
                  }}
                >
                  <div className="w-72 h-72 rounded-full border-2 border-green-400 bg-gray-800/80 backdrop-blur-sm flex flex-col relative overflow-hidden">
                    {/* Circle Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-full" />

                    {/* Number - Fixed position */}
                    <div className="absolute top-16 left-0 right-0 text-center text-4xl font-bold text-green-400 z-10">
                      {commitment.number}
                    </div>

                    {/* Content - Fixed position */}
                    <div className="absolute top-28 left-0 right-0 text-center text-white leading-snug z-10 text-sm px-6">
                      {commitment.title}
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 bg-green-500/10 rounded-full opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Layout - Stacked Cards */}
            <div className="lg:hidden space-y-8">
              {commitments.map((commitment, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-4">
                      {commitment.number}
                    </div>
                    <div className="text-white leading-relaxed">
                      {commitment.title}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Connection Lines (Desktop Only) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 800 400">
                <motion.path
                  d="M200,200 Q400,150 600,200"
                  stroke="rgba(34, 197, 94, 0.3)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 2, delay: 1 }}
                />
                <motion.path
                  d="M600,200 Q650,250 700,200"
                  stroke="rgba(34, 197, 94, 0.3)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 2, delay: 1.5 }}
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full opacity-30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}
    </motion.section>
  );
}