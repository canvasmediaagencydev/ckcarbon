"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';

export default function ProductsSection() {
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

  const products = [
    {
      id: 1,
      name: "Activate carbon ID 900",
      image: "/image/products/4a03710ab414fa64bbc2fc55b1eb492ac310335e.jpg",
      description: "รายละเอียดสินค้า",
      buttonText: "สั่งซื้อเลย!"
    },
    {
      id: 2,
      name: "Manganese Pyrolusite",
      image: "/image/products/c6dc0261bda52f1ce1477d1b5021973e950a7bb4.jpg",
      description: "รายละเอียดสินค้า",
      buttonText: "สั่งซื้อเลย!"
    },
    {
      id: 3,
      name: "Magnanese Zeolite",
      image: "/image/products/e8368ee26094b84d2f16e8ef47bcedba10f8bc36.jpg",
      description: "รายละเอียดสินค้า",
      buttonText: "สั่งซื้อเลย!"
    }
  ];


  return (
    <motion.section
      ref={ref}
      id="products"
      className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
              Our <span className="text-green-600">Products</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-l from-transparent to-green-500"></div>
          </motion.div>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            variants={fadeInVariants}
          >
            Premium activated carbon solutions for water filtration and purification
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="relative"
          variants={fadeInVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Product Image */}
                <motion.div
                  className="relative h-64 mb-8 rounded-2xl overflow-hidden bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay Badge */}
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Premium
                  </div>
                </motion.div>

                {/* Product Info */}
                <div className="relative z-10 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {product.name}
                    </h3>

                    {/* Price Badge */}
                    <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                      <span>{product.description}</span>
                      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Order Button */}
                  <motion.button
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    <span className="text-lg">{product.buttonText}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </motion.button>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </motion.section>
  );
}