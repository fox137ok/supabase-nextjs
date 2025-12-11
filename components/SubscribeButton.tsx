'use client'

import { useState } from 'react'

type SubscribeButtonProps = {
  label?: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export default function SubscribeButton({
  label = '立即订阅',
  variant = 'primary',
  disabled = false,
}: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (disabled) return
    setLoading(true)
    try {
      const response = await fetch('/api/creem/checkout', {
        method: 'POST',
      })

      if (response.status === 401) {
        window.location.href = '/login?redirect=/'
        return
      }

      const data = await response.json()
      const redirectUrl = data?.url || data?.checkout_url

      if (redirectUrl) {
        window.location.href = redirectUrl
        return
      }

      alert('无法创建支付链接，请稍后再试。')
    } catch (error) {
      console.error('Checkout error', error)
      alert('创建支付链接失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  const baseClass =
    variant === 'primary'
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || disabled}
      className={`w-full px-5 py-3 font-semibold rounded-lg shadow-md transition-all ${baseClass} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {loading ? '跳转中...' : label}
    </button>
  )
}
