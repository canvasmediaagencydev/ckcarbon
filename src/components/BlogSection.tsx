"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { FaArrowRight, FaClock, FaUser } from 'react-icons/fa';

export default function BlogSection() {
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

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Water Purification",
      excerpt: "Exploring innovative carbon filtration technologies that are revolutionizing water treatment across industries.",
      image: "/image/blog/1da17c29368f288d871238be12d2be2862e4b92c.jpg",
      author: "Dr. Somchai",
      date: "15 Mar 2024",
      category: "Technology"
    },
    {
      id: 2,
      title: "Sustainable Carbon Production",
      excerpt: "How we transform coconut shells into premium activated carbon while maintaining environmental responsibility.",
      image: "/image/blog/7e79429c236b192dd6e6f2a778f9deeb5a070773.jpg",
      author: "Preecha K.",
      date: "12 Mar 2024",
      category: "Environment"
    },
    {
      id: 3,
      title: "Industrial Water Solutions",
      excerpt: "Case studies showing how our activated carbon improves industrial water treatment efficiency and cost-effectiveness.",
      image: "/image/blog/8611762b17e5240e4d4ec414f8c251ba80b1821d.jpg",
      author: "Niran T.",
      date: "08 Mar 2024",
      category: "Industry"
    }
  ];

  return (
    <motion.section
      ref={ref}
      id="blog"
      className="relative py-20 lg:py-32 bg-white overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Top Border Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gray-300"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-16">
          {/* Left Side - Blog Title */}
          <motion.div
            className="flex-shrink-0"
            variants={fadeInVariants}
          >
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              <h2 className="text-6xl font-bold text-gray-900">
                Blog
              </h2>
            </div>
          </motion.div>

          {/* Right Side - Blog Posts */}
          <motion.div
            className="flex-1"
            variants={fadeInVariants}
          >
            <div className="space-y-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="group flex gap-6 items-center bg-white hover:bg-gray-50 rounded-2xl p-6 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200 hover:shadow-lg"
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  whileHover={{ x: 10 }}
                >
                  {/* Blog Image */}
                  <motion.div
                    className="relative w-48 h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="192px"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      {post.category}
                    </div>
                  </motion.div>

                  {/* Blog Content */}
                  <div className="flex-1 space-y-3">
                    <motion.h3
                      className="text-xl font-bold text-green-600 group-hover:text-green-700 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {post.title}
                    </motion.h3>

                    <p className="text-gray-600 leading-relaxed text-sm">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FaUser className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaClock className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <motion.button
                      className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 text-sm font-medium group-hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      See All
                      <FaArrowRight className="ml-2 w-3 h-3" />
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}