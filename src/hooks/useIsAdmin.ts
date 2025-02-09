'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      const supabase = createClient()
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setIsAdmin(false)
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single()

        setIsAdmin(profile?.role === 'admin')
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [])

  return { isAdmin, isLoading }
}
