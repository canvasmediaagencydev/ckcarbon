"use client";

import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <motion.footer
      className="relative bg-slate-900 text-white overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company Info */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeInVariants}
          >
            <div className="mb-8">
              <motion.div
                className="flex items-center space-x-4 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold">
                  <span className="text-gray-400">LOGO</span>
                  <br />
                  <span className="text-green-400">CK CARBON</span>
                </div>
              </motion.div>

              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                ธ/1 ถ.บางแตด อ.บ้อง จังหวัดใหม่
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <motion.div
                  className="flex items-center space-x-3 text-gray-300"
                  whileHover={{ x: 5, color: "#10b981" }}
                >
                  <FaPhone className="w-4 h-4 text-green-400" />
                  <span>083-5794224</span>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3 text-gray-300"
                  whileHover={{ x: 5, color: "#10b981" }}
                >
                  <FaPhone className="w-4 h-4 text-green-400" />
                  <span>053-447172</span>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3 text-gray-300"
                  whileHover={{ x: 5, color: "#10b981" }}
                >
                  <FaEnvelope className="w-4 h-4 text-green-400" />
                  <span>ckcarbonservice@gmail.com</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={fadeInVariants}>
            <h3 className="text-xl font-bold text-green-400 mb-6">Contact Us</h3>
            <div className="space-y-4">
              <motion.div
                className="flex items-center space-x-3 text-gray-300"
                whileHover={{ x: 5 }}
              >
                <FaPhone className="w-4 h-4 text-green-400" />
                <div>
                  <div>083-5794224</div>
                  <div>053-447172</div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-3 text-gray-300"
                whileHover={{ x: 5 }}
              >
                <FaEnvelope className="w-4 h-4 text-green-400 mt-1" />
                <span>ckcarbonservice@gmail.com</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={fadeInVariants}>
            <h3 className="text-xl font-bold text-green-400 mb-6">Social Media</h3>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook className="w-5 h-5" />
              </motion.a>

              <motion.a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                whileHover={{ scale: 1.1, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Border and Copyright */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-700"
          variants={fadeInVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 CK Carbon Partnership. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <motion.a href="#" className="hover:text-green-400 transition-colors" whileHover={{ scale: 1.05 }}>
                Privacy Policy
              </motion.a>
              <motion.a href="#" className="hover:text-green-400 transition-colors" whileHover={{ scale: 1.05 }}>
                Terms of Service
              </motion.a>
              <motion.a href="#" className="hover:text-green-400 transition-colors" whileHover={{ scale: 1.05 }}>
                Sitemap
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-500"></div>
    </motion.footer>
  );
}