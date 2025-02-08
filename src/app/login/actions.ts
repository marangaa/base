'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ActionResponse } from './types'

export async function login(formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      throw new Error('Please fill in all fields')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function signup(formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      throw new Error('Please fill in all fields')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data?.user?.identities?.length === 0) {
      return { message: 'Check your email for the confirmation link' }
    }

    // Create a profile entry for the new user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ user_id: data.user?.id, role: 'user' }])

    if (profileError) {
      throw new Error('Failed to create user profile')
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}