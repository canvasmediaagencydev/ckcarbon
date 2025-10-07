'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaBlog, FaPlus, FaCog, FaInfoCircle, FaIndustry, FaBox, FaComments, FaHome, FaSignOutAlt, FaUser, FaEnvelope, FaMoon, FaSun } from 'react-icons/fa'
import { createClient } from '@/lib/supabase-client'
import { DarkModeProvider, useDarkMode } from '@/contexts/DarkModeContext'

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setLoading(false)
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // If on login page, don't show the admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Modern Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <span className="text-white font-bold text-xl">CK</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CK Carbon</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Admin Panel</p>
                </div>
              </Link>
            </div>

            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium"
              >
                <FaHome size={16} />
                <span>View Site</span>
              </Link>

              <Link
                href="/admin/blogs/new"
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
              >
                <FaPlus size={16} />
                <span>New Blog</span>
              </Link>

              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                </button>

                {userEmail && (
                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <FaUser size={14} />
                    <span className="text-sm font-medium">{userEmail}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50 font-medium disabled:cursor-not-allowed"
                >
                  <FaSignOutAlt size={16} />
                  <span>{loading ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-screen shadow-sm">
          <nav className="p-6">
            <ul className="space-y-2">
              {/* Site Content Management */}
              <li className="px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Content Management
              </li>

              {[
                { href: '/admin/settings', icon: FaCog, label: 'Settings' },
                { href: '/admin/about-us', icon: FaInfoCircle, label: 'About Us' },
                { href: '/admin/oem-services', icon: FaIndustry, label: 'OEM Services' },
                { href: '/admin/products', icon: FaBox, label: 'Products' },
                { href: '/admin/testimonials', icon: FaComments, label: 'Testimonials' },
                { href: '/admin/footer-contact', icon: FaEnvelope, label: 'Footer & Contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}

              {/* Blog Management */}
              <li className="px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-8">
                Blog Management
              </li>

              <li>
                <Link
                  href="/admin/blogs"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive('/admin/blogs')
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400'
                  }`}
                >
                  <FaBlog size={18} />
                  <span>Blog Posts</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-screen-2xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DarkModeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </DarkModeProvider>
  )
}