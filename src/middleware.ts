import { updateSession } from '@/utils/supabase/middleware'

export const middleware = updateSession

export const config = {
  matcher: [
    '/admin/:path*'
]
}
