"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex-shrink-0">
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-green-600' : 'text-white'
              }`}>
                LOGO
                <br />
                <span className={`transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-green-200'
                }`}>CK CARBON</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="ml-10 flex items-baseline space-x-8">
              <motion.a
                href="#about"
                className={`px-3 py-2 text-lg font-semibold transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600'
                    : 'text-white hover:text-green-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About Us
              </motion.a>
              <motion.a
                href="#oem"
                className={`px-3 py-2 text-lg font-semibold transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600'
                    : 'text-white hover:text-green-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OEM Service
              </motion.a>
              <motion.a
                href="#products"
                className={`px-3 py-2 text-lg font-semibold transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600'
                    : 'text-white hover:text-green-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Products
              </motion.a>
              <motion.a
                href="#testimonials"
                className={`px-3 py-2 text-lg font-semibold transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600'
                    : 'text-white hover:text-green-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Customer Testimonials
              </motion.a>
              <motion.a
                href="#blog"
                className={`px-3 py-2 text-lg font-semibold transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-green-600'
                    : 'text-white hover:text-green-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Blog
              </motion.a>
            </div>
          </motion.div>

          <div className="md:hidden">
            <motion.button
              onClick={toggleMenu}
              className={`focus:outline-none p-2 transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-green-600 focus:text-green-600'
                  : 'text-white hover:text-green-200 focus:text-green-200'
              }`}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: isMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t">
                <motion.a
                  href="#about"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 text-lg font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  About Us
                </motion.a>
                <motion.a
                  href="#oem"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 text-lg font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ x: 10 }}
                >
                  OEM Service
                </motion.a>
                <motion.a
                  href="#products"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 text-lg font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 10 }}
                >
                  Products
                </motion.a>
                <motion.a
                  href="#testimonials"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 text-lg font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ x: 10 }}
                >
                  Customer Testimonials
                </motion.a>
                <motion.a
                  href="#blog"
                  className="text-gray-700 hover:text-green-600 block px-3 py-2 text-lg font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ x: 10 }}
                >
                  Blog
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}