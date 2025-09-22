"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';

export default function TestimonialsSection() {
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

  const testimonials = [
    {
      id: 1,
      content: "CK Carbon's activated carbon has transformed our water purification process. The quality is exceptional and consistent, making it our go-to choice for industrial applications.",
      author: "Somchai Phanichkul",
      position: "Production Manager",
      company: "AquaTech Solutions",
      rating: 5,
      image: "/image/testimonials/customer-1.jpg"
    },
    {
      id: 2,
      content: "Outstanding service and premium quality products. Their activated carbon solutions have significantly improved our filtration efficiency and reduced maintenance costs.",
      author: "Preecha Wongsakul",
      position: "Quality Control Director",
      company: "Pure Water Industries",
      rating: 5,
      image: "/image/testimonials/customer-2.jpg"
    },
    {
      id: 3,
      content: "Reliable partnership with CK Carbon for over 3 years. Their commitment to quality and timely delivery makes them an invaluable supplier for our operations.",
      author: "Niran Jitpakdee",
      position: "Procurement Manager",
      company: "Industrial Filtration Co.",
      rating: 5,
      image: "/image/testimonials/customer-3.jpg"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <motion.section
      ref={ref}
      id="testimonials"
      className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          variants={fadeInVariants}
        >
          <motion.div
            className="inline-flex items-center space-x-4 mb-8"
            variants={fadeInVariants}
          >
            <div className="h-1 w-20 bg-gradient-to-r from-transparent to-green-500"></div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              What Our <span className="text-green-600">Customers</span> Say
            </h2>
            <div className="h-1 w-20 bg-gradient-to-l from-transparent to-green-500"></div>
          </motion.div>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            variants={fadeInVariants}
          >
            Real experiences from our valued partners who trust CK Carbon for their filtration needs
          </motion.p>
        </motion.div>

        {/* Main Testimonial Showcase */}
        <motion.div
          className="relative mb-16"
          variants={fadeInVariants}
        >
          {/* Large Featured Testimonial */}
          <motion.div
            className="bg-white rounded-3xl p-12 shadow-2xl relative overflow-hidden max-w-4xl mx-auto"
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-full blur-3xl opacity-30" />

            {/* Quote Marks */}
            <div className="absolute top-8 left-8 text-6xl text-green-200 font-serif">"</div>
            <div className="absolute bottom-8 right-8 text-6xl text-green-200 font-serif rotate-180">"</div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Star Rating */}
              <div className="flex justify-center space-x-1 mb-8">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <FaStar className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              {/* Testimonial Text */}
              <motion.p
                className="text-2xl lg:text-3xl text-gray-700 leading-relaxed mb-12 font-light italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {testimonials[currentSlide].content}
              </motion.p>

              {/* Author Info */}
              <motion.div
                className="flex items-center justify-center space-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white text-2xl font-bold">
                      {testimonials[currentSlide].author.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>

                {/* Author Details */}
                <div className="text-left">
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonials[currentSlide].author}
                  </h4>
                  <p className="text-green-600 font-medium">
                    {testimonials[currentSlide].position}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {testimonials[currentSlide].company}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-8 mt-12">
            <motion.button
              onClick={prevSlide}
              className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all hover:shadow-xl border-2 border-green-100"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaArrowLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-green-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextSlide}
              className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all hover:shadow-xl border-2 border-green-100"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="text-center"
          variants={fadeInVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
              <div className="text-gray-600">Years Experience</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}