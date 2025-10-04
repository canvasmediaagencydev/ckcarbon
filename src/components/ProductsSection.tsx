"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  button_text: string
  display_order: number
}

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };


  return (
    <motion.section
      ref={ref}
      id="products"
      className="relative py-12 sm:py-16 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden"
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
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          variants={fadeInVariants}
        >
          <motion.div
            className="inline-flex items-center space-x-2 sm:space-x-4 mb-6 sm:mb-8"
            variants={fadeInVariants}
          >
            <div className="h-1 w-12 sm:w-20 bg-gradient-to-r from-transparent to-green-500"></div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Our <span className="text-green-600">Products</span>
            </h2>
            <div className="h-1 w-12 sm:w-20 bg-gradient-to-l from-transparent to-green-500"></div>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => router.push(`/products/${product.id}`)}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Product Image */}
                <motion.div
                  className="relative h-48 sm:h-56 lg:h-64 mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}

                  {/* Overlay Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-600 text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold">
                    Premium
                  </div>
                </motion.div>

                {/* Product Info */}
                <div className="relative z-10 space-y-4 sm:space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                   {/* Order Button */}
                   <motion.button
                     className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl text-sm sm:text-base"
                     whileHover={{
                       scale: 1.02,
                       boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)"
                     }}
                     whileTap={{ scale: 0.98 }}
                     onClick={(e) => {
                       e.stopPropagation();
                       router.push(`/products/${product.id}`);
                     }}
                   >
                     <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                     <span className="text-base sm:text-lg">{product.button_text}</span>
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