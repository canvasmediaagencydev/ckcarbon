"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaClock, FaUser } from 'react-icons/fa';
import { BlogService, Blog } from '@/lib/blog';

export default function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [showAll, setShowAll] = useState(false);
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  // Fallback blog posts if no data from CMS
  const fallbackBlogPosts = [
    {
      id: '1',
      title: "The Future of Water Purification",
      excerpt: "Exploring innovative carbon filtration technologies that are revolutionizing water treatment across industries.",
      featured_image: "/image/blog/1da17c29368f288d871238be12d2be2862e4b92c.jpg",
      created_at: "2024-03-15T00:00:00Z",
      categories: [{ id: '1', name: "Technology", slug: "technology", created_at: "" }]
    },
    {
      id: '2',
      title: "Sustainable Carbon Production",
      excerpt: "How we transform coconut shells into premium activated carbon while maintaining environmental responsibility.",
      featured_image: "/image/blog/7e79429c236b192dd6e6f2a778f9deeb5a070773.jpg",
      created_at: "2024-03-12T00:00:00Z",
      categories: [{ id: '2', name: "Environment", slug: "environment", created_at: "" }]
    },
    {
      id: '3',
      title: "Industrial Water Solutions",
      excerpt: "Case studies showing how our activated carbon improves industrial water treatment efficiency and cost-effectiveness.",
      featured_image: "/image/blog/8611762b17e5240e4d4ec414f8c251ba80b1821d.jpg",
      created_at: "2024-03-08T00:00:00Z",
      categories: [{ id: '3', name: "Industry", slug: "industry", created_at: "" }]
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const publishedBlogs = await BlogService.getAllBlogs('published');

      if (publishedBlogs.length > 0) {
        setBlogPosts(publishedBlogs);
      } else {
        // Use fallback data if no published blogs
        setBlogPosts(fallbackBlogPosts as Blog[]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Use fallback data on error
      setBlogPosts(fallbackBlogPosts as Blog[]);
    } finally {
      setLoading(false);
    }
  };

  const displayedBlogPosts = showAll ? blogPosts : blogPosts.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

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
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">
          {/* Left Side - Blog Title */}
          <motion.div
            className="flex-shrink-0 text-center lg:text-left"
            variants={fadeInVariants}
          >
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading blog posts...</p>
                </div>
              ) : (
                <>
                  {displayedBlogPosts.map((post, index) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <motion.article
                        className="group flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center bg-white hover:bg-gray-50 rounded-2xl p-4 sm:p-6 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-200 hover:shadow-lg"
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
                        className="relative w-full sm:w-48 h-48 sm:h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={post.featured_image || "/image/blog/1da17c29368f288d871238be12d2be2862e4b92c.jpg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 192px"
                        />

                        {/* Category Badge */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                            {post.categories[0].name}
                          </div>
                        )}
                      </motion.div>

                      {/* Blog Content */}
                      <div className="flex-1 space-y-3 w-full sm:w-auto">
                        <motion.h3
                          className="text-lg sm:text-xl font-bold text-green-600 group-hover:text-green-700 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          {post.title}
                        </motion.h3>

                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base line-clamp-3">
                          {post.excerpt || "No excerpt available."}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FaUser className="w-3 h-3" />
                            <span>CKCarbon Team</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaClock className="w-3 h-3" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>

                        {/* Read More Button */}
                        <motion.button
                          className="inline-flex items-center px-3 py-2 sm:px-4 border border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 text-xs sm:text-sm font-medium group-hover:scale-105"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Read More
                          <FaArrowRight className="ml-2 w-3 h-3" />
                        </motion.button>
                      </div>
                    </motion.article>
                  </Link>
                  ))}

                  {/* View More Button */}
                  {blogPosts.length > 3 && (
                    <motion.div
                      className="text-center mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {showAll ? (
                        <motion.button
                          onClick={() => setShowAll(false)}
                          className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Less
                          <motion.div
                            className="ml-2"
                            animate={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaArrowRight className="w-4 h-4" />
                          </motion.div>
                        </motion.button>
                      ) : (
                        <Link href="/blog">
                          <motion.button
                            className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View All Posts
                            <FaArrowRight className="ml-2 w-4 h-4" />
                          </motion.button>
                        </Link>
                      )}
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}