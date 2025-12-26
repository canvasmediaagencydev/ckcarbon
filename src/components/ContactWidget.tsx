"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaFacebook } from 'react-icons/fa';
import { SiLine } from 'react-icons/si';

interface ContactOption {
  id: string;
  label: string;
  url: string;
  icon: 'facebook' | 'line';
  color: string;
  hoverColor: string;
}

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions: ContactOption[] = [
    {
      id: 'facebook',
      label: 'Facebook Page',
      url: 'https://www.facebook.com/profile.php?id=61579905567779',
      icon: 'facebook',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      id: 'line',
      label: 'LINE',
      url: 'https://lin.ee/7CshrfP',
      icon: 'line',
      color: 'bg-[#00B900]',
      hoverColor: 'hover:bg-[#00A000]'
    }
  ];

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    console.log('Widget toggled:', !isOpen); // Debug log
  };

  const getIconComponent = (iconType: 'facebook' | 'line') => {
    switch (iconType) {
      case 'line':
        return SiLine;
      case 'facebook':
        return FaFacebook;
      default:
        return FaComments;
    }
  };

  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6" style={{ zIndex: 9999 }}>
      {/* Contact Options */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 sm:bottom-20 right-0 flex flex-col space-y-2 sm:space-y-3">
            {contactOptions.map((option, index) => {
              const IconComponent = getIconComponent(option.icon);
              return (
                <motion.a
                  key={option.id}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white shadow-lg transition-all duration-300 ${option.color} ${option.hoverColor}`}
                  initial={{ opacity: 0, x: 50, scale: 0 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  title={option.label}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={toggleWidget}
        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-600 hover:bg-green-700'
        }`}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isOpen ? 45 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ zIndex: 10000 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <FaComments className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse Animation Ring */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-400 opacity-30"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}
    </div>
  );
}