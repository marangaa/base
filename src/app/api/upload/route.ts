import { createClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

const supabase = createClient()

function sanitizeFilename(filename: string): string {
  // Remove special characters and replace spaces with underscores
  return filename
    .replace(/[^a-zA-Z0-9-_\.]/g, '_')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Generate a unique, sanitized filename
    const timestamp = Date.now()
    const originalName = file.name
    const sanitizedName = sanitizeFilename(file.name)
    const storageKey = `${timestamp}_${sanitizedName}`

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('documents')
      .upload(storageKey, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (storageError) {
      console.error('Storage error:', storageError)
      throw storageError
    }

    // Check for duplicate file
    const { data: existingDoc } = await supabase
      .from('documents')
      .select('id, filename')
      .eq('filename', originalName)
      .single();

    if (existingDoc) {
      // Delete the newly uploaded file since we found a duplicate
      await supabase.storage.from('documents').remove([storageKey]);
      return NextResponse.json({ 
        message: 'Document already exists',
        document: existingDoc,
        isDuplicate: true
      });
    }

    // Create database entry
    const { data: dbData, error: dbError } = await supabase
      .from('documents')
      .insert([
        {
          filename: originalName, // Store original filename for display
          storage_url: storageData.path,
          status: 'uploaded'
        }
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    return NextResponse.json({ 
      message: 'Upload successful',
      document: dbData
    })

  } catch (error: unknown) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}