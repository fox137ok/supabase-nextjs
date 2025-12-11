import { Webhook } from '@creem_io/nextjs'

import { createAdminClient } from '@/utils/supabase/admin'

export const runtime = 'nodejs'

async function upsertSubscription({
  userId,
  status,
  subscriptionId,
  customerId,
  productId,
  currentPeriodEnd,
}: {
  userId: string
  status: string
  subscriptionId?: string | null
  customerId?: string | null
  productId?: string | null
  currentPeriodEnd?: string | null
}) {
  try {
    const supabaseAdmin = createAdminClient()
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .upsert(
        {
          user_id: userId,
          creem_subscription_id: subscriptionId,
          creem_customer_id: customerId,
          creem_product_id: productId,
          status,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('Failed to upsert subscription', error)
    }
  } catch (error) {
    console.error('Supabase admin client unavailable', error)
  }
}

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onGrantAccess: async ({ customer, subscription, product, metadata, reason }) => {
    const userId =
      (metadata?.referenceId as string | undefined) ||
      (metadata?.userId as string | undefined)

    if (!userId) {
      console.warn('Creem webhook missing user reference for grant access')
      return
    }

    await upsertSubscription({
      userId,
      status: subscription?.status || reason || 'active',
      subscriptionId: subscription?.id,
      customerId: customer?.id,
      productId: product?.id || process.env.CREEM_PRODUCT_ID,
      currentPeriodEnd: subscription?.currentPeriodEnd || subscription?.expiresAt || null,
    })
  },
  onRevokeAccess: async ({ customer, subscription, metadata, reason }) => {
    const userId =
      (metadata?.referenceId as string | undefined) ||
      (metadata?.userId as string | undefined)

    if (!userId) {
      console.warn('Creem webhook missing user reference for revoke access')
      return
    }

    await upsertSubscription({
      userId,
      status: subscription?.status || reason || 'expired',
      subscriptionId: subscription?.id,
      customerId: customer?.id,
      productId: process.env.CREEM_PRODUCT_ID,
      currentPeriodEnd: subscription?.currentPeriodEnd || subscription?.expiresAt || null,
    })
  },
})
