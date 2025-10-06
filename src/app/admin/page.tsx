import Link from 'next/link'
import { FaBlog, FaPlus, FaEye, FaEdit, FaCog, FaBox, FaComments, FaInfoCircle, FaIndustry, FaEnvelope } from 'react-icons/fa'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 text-lg">Welcome back! Manage your content and website settings</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/blogs/new"
          className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl group-hover:shadow-lg transition-shadow">
              <FaPlus className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">New Blog Post</h3>
              <p className="text-slate-600 text-sm">Create content</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/blogs"
          className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl group-hover:shadow-lg transition-shadow">
              <FaBlog className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Blog Posts</h3>
              <p className="text-slate-600 text-sm">Manage articles</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/products"
          className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl group-hover:shadow-lg transition-shadow">
              <FaBox className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Products</h3>
              <p className="text-slate-600 text-sm">Manage catalog</p>
            </div>
          </div>
        </Link>

        <Link
          href="/"
          className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-gradient-to-br from-slate-500 to-slate-700 p-4 rounded-xl group-hover:shadow-lg transition-shadow">
              <FaEye className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">View Site</h3>
              <p className="text-slate-600 text-sm">Live preview</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Content Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Content */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Site Content</h2>
            <p className="text-slate-600 text-sm mt-1">Manage website pages and sections</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: '/admin/settings', icon: FaCog, label: 'Settings', color: 'from-slate-500 to-slate-700' },
                { href: '/admin/about-us', icon: FaInfoCircle, label: 'About Us', color: 'from-blue-500 to-cyan-600' },
                { href: '/admin/oem-services', icon: FaIndustry, label: 'OEM Services', color: 'from-orange-500 to-red-600' },
                { href: '/admin/testimonials', icon: FaComments, label: 'Testimonials', color: 'from-purple-500 to-pink-600' },
                { href: '/admin/footer-contact', icon: FaEnvelope, label: 'Footer & Contact', color: 'from-green-500 to-teal-600' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
                >
                  <div className={`bg-gradient-to-br ${item.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="text-white" size={16} />
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-emerald-700">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Quick Stats</h2>
            <p className="text-slate-600 text-sm mt-1">Overview of your content</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FaBlog className="text-blue-600" size={16} />
                  </div>
                  <span className="font-medium text-slate-700">Total Blog Posts</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">0</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FaBox className="text-purple-600" size={16} />
                  </div>
                  <span className="font-medium text-slate-700">Products</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">0</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaComments className="text-green-600" size={16} />
                  </div>
                  <span className="font-medium text-slate-700">Testimonials</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">0</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-700 text-sm font-medium">
                🚀 Get started by creating your first blog post!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}