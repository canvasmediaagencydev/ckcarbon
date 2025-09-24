"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaUser, FaArrowLeft } from 'react-icons/fa';
import { BlogService, Blog } from '@/lib/blog';
import Navbar from '@/components/Navbar';

export default function BlogPostPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogData = await BlogService.getBlogBySlug(slug);
      setBlog(blogData);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Extract text from TipTap content
  const getContentText = (content: any): string => {
    if (!content || !content.content) return '';

    let text = '';
    const extractText = (nodes: any[]): void => {
      nodes.forEach(node => {
        if (node.type === 'text') {
          text += node.text || '';
        } else if (node.content) {
          extractText(node.content);
        }
        text += ' ';
      });
    };

    extractText(content.content);
    return text.trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">📄</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <div className="relative pt-24 pb-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-green-100 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>

          {/* Categories */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {blog.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-green-100 mb-6 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-green-100">
            <div className="flex items-center space-x-2">
              <FaUser className="w-4 h-4" />
              <span>CKCarbon Team</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="w-4 h-4" />
              <span>{formatDate(blog.published_at || blog.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          {/* Featured Image */}
          {blog.featured_image && (
            <div className="relative h-64 lg:h-96 mb-8 rounded-xl overflow-hidden">
              <Image
                src={blog.featured_image}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {getContentText(blog.content) ? (
              <div className="space-y-4">
                {getContentText(blog.content).split('\n').filter(p => p.trim()).map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed text-lg">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {blog.excerpt || "This blog post content is being updated. Please check back later for the full article."}
                </p>

                {/* Add some relevant content based on title */}
                {blog.title.toLowerCase().includes("sustainable") && (
                  <>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Our sustainable production process transforms waste coconut shells into high-quality activated carbon,
                      creating value while protecting the environment.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      This innovative approach not only reduces agricultural waste but also produces premium carbon filtration materials
                      that exceed industry standards for purity and effectiveness.
                    </p>
                  </>
                )}

                {blog.title.toLowerCase().includes("water") && (
                  <>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Water purification technology is evolving rapidly, with carbon filtration leading the charge in innovative solutions.
                      Our latest research shows significant improvements in efficiency and cost-effectiveness.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      At CK Carbon, we're at the forefront of developing advanced activated carbon solutions that deliver superior water treatment results
                      across various industries.
                    </p>
                  </>
                )}

                {blog.title.toLowerCase().includes("industrial") && (
                  <>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Industrial water treatment requires specialized solutions. Our activated carbon products have proven effective
                      across various industries, delivering measurable results in efficiency and cost savings.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      From pharmaceutical manufacturing to food processing, our carbon filtration systems provide reliable,
                      consistent performance that meets stringent industry regulations.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" />
              Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}