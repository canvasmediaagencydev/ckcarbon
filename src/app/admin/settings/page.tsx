"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FaSave, FaImage, FaFont } from 'react-icons/fa'
import ImageUpload from '@/components/ImageUpload'

interface NavbarLogoSettings {
  type: 'text' | 'image'
  text: string
  image_url: string | null
}

interface HeroSectionSettings {
  logo_type: 'text' | 'image'
  logo_text: string
  logo_image_url: string | null
  description: string
}

export default function SettingsPage() {
  const [navbarLogo, setNavbarLogo] = useState<NavbarLogoSettings>({
    type: 'text',
    text: 'LOGO\nCK CARBON',
    image_url: null
  })

  const [heroSection, setHeroSection] = useState<HeroSectionSettings>({
    logo_type: 'text',
    logo_text: 'LOGO\nCK CARBON',
    logo_image_url: null,
    description: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Fetch settings from database
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)

      // Fetch navbar logo
      const { data: navbarData, error: navbarError } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'navbar_logo')
        .single()

      if (navbarError) throw navbarError
      if (navbarData) {
        setNavbarLogo(navbarData.setting_value as NavbarLogoSettings)
      }

      // Fetch hero section
      const { data: heroData, error: heroError } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_section')
        .single()

      if (heroError) throw heroError
      if (heroData) {
        setHeroSection(heroData.setting_value as HeroSectionSettings)
      }

    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      setMessage(null)

      // Update navbar logo
      const { error: navbarError } = await supabase
        .from('site_settings')
        .update({ setting_value: navbarLogo })
        .eq('setting_key', 'navbar_logo')

      if (navbarError) throw navbarError

      // Update hero section
      const { error: heroError } = await supabase
        .from('site_settings')
        .update({ setting_value: heroSection })
        .eq('setting_key', 'hero_section')

      if (heroError) throw heroError

      setMessage({ type: 'success', text: 'Settings saved successfully!' })

      // Reload the page after 1 second to see changes
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Site Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage navbar logo and hero section content</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border-green-300'
            : 'bg-red-50 text-red-700 border-red-300'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Navbar Logo Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-slate-700">
          Navbar Logo
        </h2>

        <div className="space-y-6">
          {/* Logo Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Logo Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setNavbarLogo({ ...navbarLogo, type: 'text' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  navbarLogo.type === 'text'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <FaFont />
                <span>Text</span>
              </button>
              <button
                type="button"
                onClick={() => setNavbarLogo({ ...navbarLogo, type: 'image' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  navbarLogo.type === 'image'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <FaImage />
                <span>Image</span>
              </button>
            </div>
          </div>

          {/* Text Input */}
          {navbarLogo.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Logo Text (use \n for line break)
              </label>
              <textarea
                value={navbarLogo.text}
                onChange={(e) => setNavbarLogo({ ...navbarLogo, text: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="LOGO\nCK CARBON"
              />
            </div>
          )}

          {/* Image Upload */}
          {navbarLogo.type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Logo Image
              </label>
              <ImageUpload
                currentImageUrl={navbarLogo.image_url || ''}
                onImageUploaded={(url) => setNavbarLogo({ ...navbarLogo, image_url: url })}
                folder="logos"
                aspectRatio="16/9"
                maxSizeMB={1}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hero Section Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          Hero Section
        </h2>

        <div className="space-y-6">
          {/* Logo Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Logo Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setHeroSection({ ...heroSection, logo_type: 'text' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  heroSection.logo_type === 'text'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <FaFont />
                <span>Text</span>
              </button>
              <button
                type="button"
                onClick={() => setHeroSection({ ...heroSection, logo_type: 'image' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  heroSection.logo_type === 'image'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <FaImage />
                <span>Image</span>
              </button>
            </div>
          </div>

          {/* Text Input */}
          {heroSection.logo_type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Logo Text (use \n for line break)
              </label>
              <textarea
                value={heroSection.logo_text}
                onChange={(e) => setHeroSection({ ...heroSection, logo_text: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="LOGO\nCK CARBON"
              />
            </div>
          )}

          {/* Image Upload */}
          {heroSection.logo_type === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Logo Image
              </label>
              <ImageUpload
                currentImageUrl={heroSection.logo_image_url || ''}
                onImageUploaded={(url) => setHeroSection({ ...heroSection, logo_image_url: url })}
                folder="logos"
                aspectRatio="16/9"
                maxSizeMB={1}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Description
            </label>
            <textarea
              value={heroSection.description}
              onChange={(e) => setHeroSection({ ...heroSection, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="Enter hero section description..."
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
        >
          <FaSave />
          <span className="font-medium">{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  )
}
