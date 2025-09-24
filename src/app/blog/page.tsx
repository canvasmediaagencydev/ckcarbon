"use client";

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaUser, FaTag, FaSearch, FaArrowRight } from 'react-icons/fa';
import { BlogService, CategoryService, Blog, Category } from '@/lib/blog';
import Navbar from '@/components/Navbar';

export default function BlogPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogData, categoryData] = await Promise.all([
        BlogService.getAllBlogs('published'),
        CategoryService.getAllCategories()
      ]);

      setBlogPosts(blogData);
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs based on search and category
  const filteredBlogs = blogPosts.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory ||
                           blog.categories?.some(cat => cat.id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        ref={ref}
        className="relative pt-32 pb-24 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-32 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="flex items-center justify-center mb-6"
              variants={fadeInVariants}
            >
              <div className="w-12 h-1 bg-green-400 rounded-full mr-4"></div>
              <span className="text-green-200 text-lg font-medium tracking-wider uppercase">Insights & Innovation</span>
              <div className="w-12 h-1 bg-green-400 rounded-full ml-4"></div>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              variants={fadeInVariants}
            >
              Our Blog
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-green-100 mb-8 leading-relaxed max-w-3xl mx-auto"
              variants={fadeInVariants}
            >
              Discover the latest insights in water treatment technology, sustainable carbon production, and industry innovations that are shaping the future of environmental solutions.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
              variants={staggerContainer}
            >
              <motion.div className="text-center" variants={cardVariants}>
                <div className="text-3xl font-bold text-green-200 mb-1">{blogPosts.length}</div>
                <div className="text-green-100 text-sm uppercase tracking-wide">Articles</div>
              </motion.div>
              <motion.div className="text-center" variants={cardVariants}>
                <div className="text-3xl font-bold text-green-200 mb-1">{categories.length}</div>
                <div className="text-green-100 text-sm uppercase tracking-wide">Categories</div>
              </motion.div>
              <motion.div className="text-center" variants={cardVariants}>
                <div className="text-3xl font-bold text-green-200 mb-1">5+</div>
                <div className="text-green-100 text-sm uppercase tracking-wide">Years Experience</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Search and Filters Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gray-50 rounded-3xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-2xl bg-white shadow-md focus:ring-2 focus:ring-green-500 focus:shadow-lg outline-none transition-all text-lg"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-6 py-4 border-0 rounded-2xl bg-white shadow-md focus:ring-2 focus:ring-green-500 focus:shadow-lg outline-none transition-all text-lg"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={resetFilters}
                    className="px-6 py-4 text-green-600 hover:text-white hover:bg-green-600 rounded-2xl border border-green-200 hover:border-green-600 transition-all duration-300 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-6 text-center text-gray-600">
              <span className="text-2xl font-bold text-green-600">{filteredBlogs.length}</span>
              <span className="ml-2">article{filteredBlogs.length !== 1 ? 's' : ''} found</span>
              {searchTerm && <span className="ml-1">matching "{searchTerm}"</span>}
              {selectedCategory && <span className="ml-1">in {categories.find(c => c.id === selectedCategory)?.name}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-6 text-xl">Loading articles...</p>
            </div>
          ) : currentPosts.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                {currentPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    variants={cardVariants}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={post.featured_image || "/image/blog/1da17c29368f288d871238be12d2be2862e4b92c.jpg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />

                          {/* Category Badge */}
                          {post.categories && post.categories.length > 0 && (
                            <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                              {post.categories[0].name}
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                          <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h2>

                          <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                            {post.excerpt || "Discover more about this topic in our detailed article."}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <FaUser className="w-4 h-4 text-green-600" />
                                <span>CKCarbon Team</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FaClock className="w-4 h-4 text-green-600" />
                                <span>{formatDate(post.published_at || post.created_at)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700 transition-colors"
                                >
                                  <FaTag className="w-2 h-2 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Read More Button */}
                          <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                            <span>Read Article</span>
                            <FaArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex justify-center items-center space-x-2 mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 hover:border-green-200 transition-colors font-medium"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-3 rounded-xl transition-colors font-medium ${
                        currentPage === page
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'border border-gray-200 hover:bg-green-50 hover:border-green-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 hover:border-green-200 transition-colors font-medium"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            >
              <div className="text-8xl text-gray-300 mb-6">📝</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Articles Found</h3>
              <p className="text-gray-600 mb-8 text-xl max-w-md mx-auto">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "We're working on creating amazing content for you. Check back soon!"}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={resetFilters}
                  className="px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}