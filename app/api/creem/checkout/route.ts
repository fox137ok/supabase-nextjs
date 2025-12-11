import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export const runtime = 'nodejs'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.CREEM_API_KEY
  const productId = process.env.CREEM_PRODUCT_ID
  const apiBase = process.env.CREEM_API_BASE || 'https://test-api.creem.io'
  const appUrl =
    process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!apiKey || !productId || !appUrl) {
    return NextResponse.json(
      { error: 'Missing Creem environment variables' },
      { status: 500 }
    )
  }

  const payload = {
    productId,
    successUrl: `${appUrl}/account?checkout=success`,
    cancelUrl: `${appUrl}/account?checkout=cancel`,
    referenceId: user.id,
    metadata: { referenceId: user.id },
    customer: {
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
    },
  }

  try {
    const response = await fetch(`${apiBase}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const detail = await response.text()
      return NextResponse.json(
        { error: 'Failed to create Creem checkout session', detail },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Creem checkout error', error)
    return NextResponse.json(
      { error: 'Unexpected error creating Creem checkout' },
      { status: 500 }
    )
  }
}
