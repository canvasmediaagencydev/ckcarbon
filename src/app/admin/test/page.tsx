'use client'

import { useState } from 'react'
import { SupabaseTest } from '@/lib/supabase-test'
import { FaPlay, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa'

export default function SupabaseTestPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runTests = async () => {
    setTesting(true)
    setResults(null)

    try {
      const testResults = await SupabaseTest.runAllTests()
      setResults(testResults)
    } catch (error) {
      console.error('Test error:', error)
      setResults({ error: 'Test failed to run' })
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <div className="w-5 h-5" />
    return status ? (
      <FaCheck className="text-green-500" size={16} />
    ) : (
      <FaTimes className="text-red-500" size={16} />
    )
  }

  const getStatusColor = (status: boolean | undefined) => {
    if (status === undefined) return 'text-gray-500'
    return status ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Supabase Connection Test</h1>
        <p className="text-gray-600 mt-2">Test your Supabase database and storage configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Connection Tests</h2>
          <button
            onClick={runTests}
            disabled={testing}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {testing ? (
              <FaSpinner className="animate-spin" size={16} />
            ) : (
              <FaPlay size={16} />
            )}
            <span>{testing ? 'Running Tests...' : 'Run Tests'}</span>
          </button>
        </div>

        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                {getStatusIcon(results.connection)}
                <div>
                  <h3 className={`font-medium ${getStatusColor(results.connection)}`}>
                    Database Connection
                  </h3>
                  <p className="text-sm text-gray-500">
                    Basic connection to blogs table
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                {getStatusIcon(results.storage)}
                <div>
                  <h3 className={`font-medium ${getStatusColor(results.storage)}`}>
                    Storage Connection
                  </h3>
                  <p className="text-sm text-gray-500">
                    Connection to 'blog' storage bucket
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                {getStatusIcon(results.blogCreation)}
                <div>
                  <h3 className={`font-medium ${getStatusColor(results.blogCreation)}`}>
                    Blog Creation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Test blog CRUD operations
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                {getStatusIcon(results.imageUpload)}
                <div>
                  <h3 className={`font-medium ${getStatusColor(results.imageUpload)}`}>
                    Image Upload
                  </h3>
                  <p className="text-sm text-gray-500">
                    Test storage upload/delete
                  </p>
                </div>
              </div>
            </div>

            {results.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-800 mb-2">Test Error</h3>
                <p className="text-red-600">{results.error}</p>
              </div>
            )}

            {!Object.values(results).every(Boolean) && !results.error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Some Tests Failed</h3>
                <p className="text-yellow-700 mb-3">
                  Check the browser console for detailed error messages.
                </p>
                <div className="text-sm text-yellow-600">
                  <p><strong>Common issues:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>RLS (Row Level Security) policies not configured</li>
                    <li>Storage bucket 'blog' doesn't exist or not public</li>
                    <li>Missing environment variables in .env.local</li>
                    <li>Incorrect Supabase URL or API key</li>
                  </ul>
                </div>
              </div>
            )}

            {Object.values(results).every(Boolean) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">All Tests Passed! 🎉</h3>
                <p className="text-green-700">
                  Your Supabase configuration is working correctly. You can now use the blog system.
                </p>
              </div>
            )}
          </div>
        )}

        {!results && !testing && (
          <div className="text-center py-12 text-gray-500">
            <FaPlay size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Click "Run Tests" to check your Supabase configuration</p>
          </div>
        )}
      </div>

      <div className="bg-green-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-green-800 mb-3">Setup Instructions</h3>
        <div className="text-sm text-green-700 space-y-2">
          <p><strong>If tests fail:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Check your <code>.env.local</code> file has correct Supabase credentials</li>
            <li>Go to Supabase Dashboard → SQL Editor</li>
            <li>Run the SQL commands from <code>supabase-setup.sql</code></li>
            <li>Create the 'blog' storage bucket and make it public</li>
            <li>Run tests again</li>
          </ol>
          <p className="mt-3">
            <strong>Need help?</strong> Check <code>SUPABASE_SETUP.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  )
}