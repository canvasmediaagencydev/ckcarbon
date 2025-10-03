'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBlog, FaList, FaPlus, FaTags, FaFlask, FaCog, FaInfoCircle, FaIndustry, FaBox, FaComments, FaHome } from 'react-icons/fa'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-white font-bold text-lg">CK</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">CK Carbon</h1>
                  <p className="text-xs text-gray-500">Content Management</p>
                </div>
              </Link>
            </div>
            <nav className="flex items-center space-x-3">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors px-3 py-2 rounded-lg hover:bg-green-50"
              >
                <FaHome size={16} />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <Link
                href="/admin/blogs/new"
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <FaPlus size={16} />
                <span className="hidden sm:inline">New Blog</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white/60 backdrop-blur-sm shadow-sm min-h-[calc(100vh-80px)] border-r border-gray-100">
          <nav className="p-4">
            <ul className="space-y-1">
              {/* Site Content Management */}
              <li className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Site Content
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive('/admin/settings')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  <FaCog size={18} />
                  <span className="font-medium">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/about-us"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive('/admin/about-us')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  <FaInfoCircle size={18} />
                  <span className="font-medium">About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/oem-services"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive('/admin/oem-services')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  <FaIndustry size={18} />
                  <span className="font-medium">OEM Services</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive('/admin/products')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  <FaBox size={18} />
                  <span className="font-medium">Products</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/testimonials"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive('/admin/testimonials')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  <FaComments size={18} />
                  <span className="font-medium">Testimonials</span>
                </Link>
              </li>

              {/* Blog Management */}
              <li className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6">
                Blog
              </li>
              <li>
                <Link
                  href="/admin/blogs"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive('/admin/blogs')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  <FaBlog size={18} />
                  <span className="font-medium">Blog Posts</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categories"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive('/admin/categories')
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                  <FaTags size={18} />
                  <span className="font-medium">Categories</span>
                </Link>
              </li>

              {/* Development */}
              <li className="border-t border-gray-200 pt-2 mt-6">
                <Link
                  href="/admin/test"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive('/admin/test')
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                >
                  <FaFlask size={18} />
                  <span className="font-medium">Supabase Test</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}