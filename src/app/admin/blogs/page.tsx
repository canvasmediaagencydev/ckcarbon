'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlogService, Blog } from '@/lib/blog'
import { FaPlus, FaEdit, FaTrash, FaEye, FaBlog } from 'react-icons/fa'

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  useEffect(() => {
    fetchBlogs()
  }, [filter])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const data = await BlogService.getAllBlogs(filter === 'all' ? undefined : filter)
      setBlogs(data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?\n\nThis will also delete all associated images and cannot be undone.')) {
      try {
        setLoading(true)
        await BlogService.deleteBlog(id)
        await fetchBlogs() // Refresh the list
        alert('Blog post and associated images deleted successfully')
      } catch (error) {
        console.error('Error deleting blog:', error)
        alert('Failed to delete blog post. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Blog Posts</h1>
            <p className="text-slate-600 mt-2">Manage and organize your blog content</p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
          >
            <FaPlus size={16} />
            <span>New Blog Post</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-slate-500 mt-4 font-medium">Loading blog posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBlog className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No blog posts found</h3>
            <p className="text-slate-600 mb-6">Get started by creating your first blog post</p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
            >
              <FaPlus size={16} />
              <span>Create Blog Post</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Blog Post
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {blog.title}
                        </div>
                        <div className="text-sm text-slate-500 font-mono">
                          /{blog.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          blog.status
                        )}`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        {blog.status === 'published' && (
                          <button
                            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <FaEye size={14} />
                          </button>
                        )}
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}