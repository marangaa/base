import { updateSession } from '@/utils/supabase/middleware'

export const middleware = updateSession

// Temporarily disable the middleware by removing the '/admin/:path*' matcher
export const config = {
  matcher: [
    '/admin/:path*'  // Commented out to disable middleware for admin routes
  ]
}