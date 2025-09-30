// Test Supabase connection and setup
import { supabase } from './supabase'

export class SupabaseTest {
  /**
   * Test database connection
   */
  static async testConnection() {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('count')
        .limit(1)

      if (error) {
        console.error('❌ Database connection failed:', error.message)
        return false
      }

      console.log('✅ Database connection successful')
      return true
    } catch (error) {
      console.error('❌ Database connection error:', error)
      return false
    }
  }

  /**
   * Test storage connection
   */
  static async testStorage() {
    try {
      const { data, error } = await supabase.storage
        .from('blog')
        .list('', { limit: 1 })

      if (error) {
        console.error('❌ Storage connection failed:', error.message)
        if (error.message.includes('not found')) {
          console.log('💡 Bucket "blog" might not exist. Create it in Supabase Dashboard.')
        }
        return false
      }

      console.log('✅ Storage connection successful')
      return true
    } catch (error) {
      console.error('❌ Storage connection error:', error)
      return false
    }
  }

  /**
   * Test creating a blog (to check RLS policies)
   */
  static async testBlogCreation() {
    try {
      const testBlog = {
        title: 'Test Blog',
        slug: 'test-blog-' + Date.now(),
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test content' }] }] },
        status: 'draft' as const
      }

      const { data, error } = await supabase
        .from('blogs')
        .insert(testBlog)
        .select()
        .single()

      if (error) {
        console.error('❌ Blog creation failed:', error.message)
        if (error.message.includes('row-level security policy')) {
          console.log('💡 RLS policy issue. Check SUPABASE_SETUP.md for solutions.')
        }
        return false
      }

      console.log('✅ Blog creation successful')

      // Clean up test blog
      await supabase.from('blogs').delete().eq('id', data.id)
      console.log('🧹 Test blog cleaned up')

      return true
    } catch (error) {
      console.error('❌ Blog creation error:', error)
      return false
    }
  }

  /**
   * Test file upload to storage
   */
  static async testImageUpload() {
    try {
      // Create a minimal test image (1x1 pixel PNG)
      const testImageData = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
        0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222,
        0, 0, 0, 12, 73, 68, 65, 84, 8, 153, 99, 248, 15, 0, 0, 1, 0, 1,
        126, 221, 204, 204, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
      ])

      const testFile = new File([testImageData], 'test-image.png', { type: 'image/png' })
      const testPath = `test-folder/test-image-${Date.now()}.png`

      const { data, error } = await supabase.storage
        .from('blog')
        .upload(testPath, testFile)

      if (error) {
        console.error('❌ Image upload failed:', error.message)
        if (error.message.includes('row-level security policy')) {
          console.log('💡 Storage RLS policy issue. Check SUPABASE_SETUP.md for solutions.')
        }
        return false
      }

      console.log('✅ Image upload successful')

      // Clean up test image
      await supabase.storage.from('blog').remove([testPath])
      console.log('🧹 Test image cleaned up')

      return true
    } catch (error) {
      console.error('❌ Image upload error:', error)
      return false
    }
  }

  /**
   * Run all tests
   */
  static async runAllTests() {
    console.log('🧪 Starting Supabase tests...\n')

    const results = {
      connection: await this.testConnection(),
      storage: await this.testStorage(),
      blogCreation: await this.testBlogCreation(),
      imageUpload: await this.testImageUpload()
    }

    console.log('\n📊 Test Results:')
    console.log('Database Connection:', results.connection ? '✅' : '❌')
    console.log('Storage Connection:', results.storage ? '✅' : '❌')
    console.log('Blog Creation:', results.blogCreation ? '✅' : '❌')
    console.log('Image Upload:', results.imageUpload ? '✅' : '❌')

    const allPassed = Object.values(results).every(Boolean)

    if (allPassed) {
      console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.')
    } else {
      console.log('\n⚠️  Some tests failed. Check SUPABASE_SETUP.md for troubleshooting.')
    }

    return results
  }
}