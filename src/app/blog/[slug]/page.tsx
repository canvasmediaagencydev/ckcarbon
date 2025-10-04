import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { FaClock, FaUser, FaArrowLeft, FaTag } from 'react-icons/fa';
import { BlogService, Blog } from '@/lib/blog';
import ShareButtons from '@/components/ShareButtons';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const blog = await BlogService.getBlogBySlug(slug);

    if (!blog) {
      return {
        title: 'Blog Post Not Found | CK Carbon',
        description: 'The blog post you are looking for could not be found.'
      };
    }

    const baseUrl = 'https://ckcarbon.vercel.app';
    const url = `${baseUrl}/blog/${slug}`;

    return {
      title: `${blog.title} | CK Carbon`,
      description: blog.excerpt || 'Discover insights in sustainable carbon production and water treatment technology from CK Carbon.',
      openGraph: {
        title: blog.title,
        description: blog.excerpt || 'Discover insights in sustainable carbon production and water treatment technology from CK Carbon.',
        url: url,
        siteName: 'CK Carbon',
        images: [
          {
            url: blog.featured_image || '/image/blog/1da17c29368f288d871238be12d2be2862e4b92c.jpg',
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt || 'Discover insights in sustainable carbon production and water treatment technology from CK Carbon.',
        images: [blog.featured_image || '/image/blog/1da17c29368f288d871238be12d2be2862e4b92c.jpg'],
      },
    };
  } catch (error) {
    return {
      title: 'CK Carbon Blog',
      description: 'Discover insights in sustainable carbon production and water treatment technology from CK Carbon.'
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  let blog: Blog | null = null;
  let error: string | null = null;

  try {
    blog = await BlogService.getBlogBySlug(slug);
    if (!blog) {
      error = 'Blog post not found';
    }
  } catch (err) {
    console.error('Error fetching blog:', err);
    error = 'Blog post not found';
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const shareUrl = `https://ckcarbon.vercel.app/blog/${slug}`;
  const shareTitle = blog?.title || '';

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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      {/* Hero Section */}
      <div className="relative pt-20 sm:pt-32 pb-16 sm:pb-24 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-72 sm:h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-32 h-32 sm:w-72 sm:h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-16 sm:-bottom-32 left-10 sm:left-20 w-32 h-32 sm:w-72 sm:h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6 mt-10 sm:mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-green-100 hover:text-white transition-all duration-300 group"
            >
              <FaArrowLeft className="mr-2 sm:mr-3 w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span className="text-base sm:text-lg font-medium">Back to Blog</span>
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Categories */}
            {blog.categories && blog.categories.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {blog.categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/80 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-lg sm:text-xl lg:text-2xl text-green-100 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-4">
                {blog.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-green-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm text-green-200">Written by</div>
                  <div className="font-semibold text-sm sm:text-base">CKCarbon Team</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm text-green-200">Published</div>
                  <div className="font-semibold text-sm sm:text-base">{formatDate(blog.published_at || blog.created_at)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
            {/* Article Content */}
            <article className="flex-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-12 border border-gray-100">
                {/* Featured Image */}
                {blog.featured_image && (
                  <div className="relative h-48 sm:h-64 lg:h-96 mb-6 sm:mb-8 lg:mb-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={blog.featured_image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 800px"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-base sm:prose-lg max-w-none">
                  <div className="space-y-4 sm:space-y-6">

                    {/* ALWAYS show excerpt if available */}
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      {blog.excerpt || "Discover our latest insights in sustainable carbon production and water treatment technology."}
                    </p>

                    {/* ALWAYS show these 3 paragraphs */}
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      At CK Carbon, we are committed to providing innovative activated carbon solutions that meet the evolving needs
                      of various industries while maintaining our dedication to environmental sustainability.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      Our expertise in carbon production and water treatment technology allows us to deliver high-quality products
                      that exceed industry standards and provide exceptional value to our customers.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                      Through continuous research and development, we continue to advance the field of activated carbon applications,
                      ensuring our solutions remain at the forefront of the industry.
                    </p>

                  </div>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Related Topics</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                        >
                          <FaTag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back to Blog CTA */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Explore More Insights</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Discover more articles about sustainable technology and environmental solutions.</p>
                  <Link
                    href="/blog"
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-xl sm:rounded-2xl hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                  >
                    <FaArrowLeft className="mr-2 sm:mr-3 w-4 h-4" />
                    View All Articles
                  </Link>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-80">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Share Section */}
                <ShareButtons url={shareUrl} title={shareTitle} />

                {/* Company Info CTA */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About CK Carbon</h3>
                  <p className="text-green-100 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    Leading the industry in sustainable carbon production and advanced water treatment solutions.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-green-600 rounded-xl sm:rounded-2xl hover:bg-green-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                  >
                    Learn More About Us
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
