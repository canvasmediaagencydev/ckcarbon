"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaBox, FaArrowLeft, FaArrowRight, FaCogs, FaIndustry } from 'react-icons/fa';

export default function OEMServiceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const services = [
    {
      icon: <FaBox className="w-10 h-10 text-green-600" />,
      title: "บจก. วิโมน เทรดดิ้ง"
    },
    {
      icon: <FaCogs className="w-10 h-10 text-green-600" />,
      title: "บจก. โซลู่ยู เทคโนโลยี"
    },
    {
      icon: <FaBox className="w-10 h-10 text-green-600" />,
      title: "บจก. วอเตอร์เฟิลเตอร์ เซรีไทย"
    },
    {
      icon: <FaIndustry className="w-10 h-10 text-green-600" />,
      title: "บจก. สยาม-เคซีเทค"
    },
    {
      icon: <FaBox className="w-10 h-10 text-green-600" />,
      title: "บจก. เวสโกร แมนูแฟคเจอริ่ง"
    }
  ];

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

          <motion.p
            className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed"
            variants={fadeInVariants}
          >
            has its roots in a family business that once thrived in the coconut industry. In 2004, our founder envisioned the potential of transforming coconut shells into high-quality activated carbon. From that vision, CK Carbon Partnership was officially established, specializing in the production and supply of premium water filtration media, trusted by both households and industries.
          </motion.p>
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
                    {/* Icon Container */}
                    <motion.div
                      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaBox className="w-6 h-6 text-green-600" />
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
                    {/* Icon Container */}
                    <motion.div
                      className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-shadow"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.icon}
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