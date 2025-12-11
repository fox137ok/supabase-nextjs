'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type UserMenuProps = {
  email?: string | null
  isSubscribed: boolean
}

export default function UserMenu({ email, isSubscribed }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow ${
          isSubscribed
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        {isSubscribed ? (
          <>
            <span className="text-lg">👑</span>
            <span>PRO</span>
          </>
        ) : (
          <>
            <span className="text-lg">🙂</span>
            <span>免费用户</span>
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-2">
              <span className="text-lg">{isSubscribed ? '👑' : '🎟️'}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{email || '用户'}</p>
                <p className="text-xs text-purple-700 font-semibold">
                  {isSubscribed ? 'PRO 会员' : '免费用户'}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2 text-sm text-gray-800">
            <MenuItem href="/account" label="个人资料" icon="👤" onClick={() => setOpen(false)} />
            <MenuItem href="/account" label="订单/订阅" icon="📄" onClick={() => setOpen(false)} />
            {!isSubscribed && (
              <MenuItem
                href="#pricing"
                label="升级到 PRO"
                icon="⚡"
                accent
                onClick={() => setOpen(false)}
              />
            )}
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 border-t border-gray-100"
            >
              ↩︎ 退出登录
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function MenuItem({
  href,
  label,
  icon,
  accent,
  onClick,
}: {
  href: string
  label: string
  icon: string
  accent?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-50 ${
        accent ? 'text-purple-700 font-semibold' : 'text-gray-800'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
