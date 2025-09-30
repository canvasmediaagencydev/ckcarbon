import Link from 'next/link'
import { FaBlog, FaList, FaPlus, FaTags, FaFlask } from 'react-icons/fa'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-900">
                CKCarbon CMS
              </Link>
            </div>
            <nav className="flex space-x-6">
              <Link
                href="/admin/blogs"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <FaList size={16} />
                <span>All Blogs</span>
              </Link>
              <Link
                href="/admin/blogs/new"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <FaPlus size={16} />
                <span>New Blog</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-80px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/blogs"
                  className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
                >
                  <FaBlog size={18} />
                  <span>Blog Posts</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categories"
                  className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
                >
                  <FaTags size={18} />
                  <span>Categories</span>
                </Link>
              </li>
              <li className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  href="/admin/test"
                  className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-100"
                >
                  <FaFlask size={18} />
                  <span>Supabase Test</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}