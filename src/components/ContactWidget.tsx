"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPhone, FaFacebookMessenger } from 'react-icons/fa';
import { SiLine } from 'react-icons/si';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    console.log('Widget toggled:', !isOpen); // Debug log
  };

  const contactOptions = [
    {
      id: 'line',
      icon: SiLine,
      label: 'Line',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      href: 'https://line.me/ti/p/@yourline'
    },
    {
      id: 'messenger',
      icon: FaFacebookMessenger,
      label: 'Messenger',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      href: 'https://m.me/yourpage'
    },
    {
      id: 'phone',
      icon: FaPhone,
      label: 'Phone',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      href: 'tel:+1234567890'
    },
  ];

  return (
    <div className="fixed right-6 bottom-6" style={{ zIndex: 9999 }}>
      {/* Contact Options */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-20 right-0 flex flex-col space-y-3">
            {contactOptions.map((option, index) => (
              <motion.a
                key={option.id}
                href={option.href}
                target={option.href.startsWith('http') ? '_blank' : '_self'}
                rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-all duration-300 ${option.color} ${option.hoverColor}`}
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
                <option.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={toggleWidget}
        className={`relative w-16 h-16 rounded-full text-white shadow-lg transition-all duration-300 flex items-center justify-center ${
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
              <FaTimes className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <FaComments className="w-7 h-7" />
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