import { supabase } from './supabase'

export async function uploadImage(file: File, folder: string = 'images'): Promise<string> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = url.split('/storage/v1/object/public/images/')
    if (urlParts.length < 2) return

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('images')
      .remove([filePath])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}
