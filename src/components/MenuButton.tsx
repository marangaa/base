'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useIsAdmin } from '@/hooks/useIsAdmin'

export default function MenuButton() {
  const { isAdmin, isLoading } = useIsAdmin()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="fixed top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {!isLoading && isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin</Link>
            </DropdownMenuItem>
          )}
          
          {user ? (
            <>
              <DropdownMenuItem disabled>
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/login">Sign in</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}