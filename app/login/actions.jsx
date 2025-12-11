'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

function resolveOrigin(headersList) {
  // Prefer forwarded host in Vercel/Edge, then origin header, finally host.
  const forwarded = headersList.get('x-forwarded-host')
  if (forwarded) return `https://${forwarded}`

  const origin = headersList.get('origin')
  if (origin) return origin

  const host = headersList.get('host')
  if (host) return `https://${host}`

  return 'http://localhost:3000'
}

export async function signInWithGithub() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = resolveOrigin(headersList)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url) // 重定向到 GitHub OAuth 页面
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = resolveOrigin(headersList)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url) // 重定向到 Google OAuth 页面
  }
}
