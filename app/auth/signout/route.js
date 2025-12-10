import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const supabase = await createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  // 清除所有路由的缓存
  revalidatePath('/', 'layout')
  revalidatePath('/account', 'page')

  const response = NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })

  // 清除所有 Supabase cookies
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')

  return response
}