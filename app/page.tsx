import Link from 'next/link'

import SubscribeButton from '@/components/SubscribeButton'
import { createClient } from '@/utils/supabase/server'

// 需要按请求实时获取登录态/订阅信息，避免静态缓存
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let subscriptionStatus: string | null = null

  if (user) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!error && data) {
        subscriptionStatus = data.status as string | null
      }
    } catch (error) {
      console.warn('Failed to read subscription status', error)
    }
  }

  const isSubscribed = ['active', 'trialing', 'paid'].includes(
    (subscriptionStatus || '').toLowerCase()
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                我的应用
              </span>
            </div>
            {user ? (
              <Link
                href="/account"
                className="px-6 py-2 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
              >
                账户
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 账户状态条 */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {isSubscribed ? (
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl px-4 py-3 shadow-lg">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20">✓</span>
              <div>
                <p className="font-semibold">您是 Pro 订阅用户</p>
                <p className="text-sm text-white/80">无限对话权益已启用，感谢支持！</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-xl border border-amber-200 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700">!</span>
                <div>
                  <p className="font-semibold text-amber-800">当前为免费用户</p>
                  <p className="text-sm text-amber-700">
                    免费额度单次 7 轮，升级 Pro 解锁无限对话和优先响应。
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <SubscribeButton label="升级为 Pro" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Hero 区域 */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              欢迎来到
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                现代化用户管理系统
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              基于 Next.js 和 Supabase 构建的安全、快速、可扩展的用户认证和资料管理平台
            </p>

            {/* CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-lg"
              >
                立即开始 →
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all text-lg"
              >
                了解更多
              </a>
            </div>
          </div>

          {/* 特性展示 */}
          <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 特性 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">安全认证</h3>
              <p className="text-gray-600">
                企业级安全标准,采用 Supabase 提供的加密认证和会话管理
              </p>
            </div>

            {/* 特性 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="h-16 w-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">极速响应</h3>
              <p className="text-gray-600">
                基于 Next.js 16 构建,服务端渲染带来闪电般的加载速度
              </p>
            </div>

            {/* 特性 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="h-16 w-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">个性化管理</h3>
              <p className="text-gray-600">
                完整的用户资料管理,支持头像上传和个人信息自定义
              </p>
            </div>
          </div>

          {/* Pricing 表格 */}
          <div id="pricing" className="mt-24">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">
                Pricing
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">升级获取无限对话</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                未登录用户每次最多 3 轮，免费账号 7 轮，订阅后解锁无限提问与优先响应。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 免费卡片 */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">免费体验</h3>
                  <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    登录即可
                  </span>
                </div>
                <p className="text-gray-600 mb-6">
                  轻量试用，适合刚开始体验产品的用户。
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-6">
                  $0
                  <span className="text-base font-medium text-gray-500"> / forever</span>
                </p>
                <ul className="space-y-3 mb-8 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span> 未登录：单次会话 3 轮
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span> 登录后：单次会话 7 轮
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span> 基础用户资料管理
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span> 邮箱/第三方登录
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="block text-center w-full px-5 py-3 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  登录试用
                </Link>
              </div>

              {/* 订阅卡片 */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-1 shadow-2xl">
                <div className="bg-white rounded-2xl p-8 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Pro 订阅</h3>
                    <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                      最佳价值
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">无限提问，优先响应，适合重度使用者。</p>
                  <p className="text-4xl font-bold text-gray-900 mb-6">
                    $7
                    <span className="text-base font-medium text-gray-500"> / 月</span>
                  </p>
                  <ul className="space-y-3 mb-8 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span> 无限对话轮次
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span> 优先队列 & 更快响应
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span> 订阅状态自动同步
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span> 随时在账单门户管理/取消
                    </li>
                  </ul>
                  <SubscribeButton
                    label={isSubscribed ? '已订阅' : '立即订阅'}
                    disabled={isSubscribed}
                  />
                  {isSubscribed && (
                    <p className="text-xs text-green-600 mt-3">
                      您的订阅已激活，无限对话权益已开启。
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="mt-24 pt-12 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              采用现代化技术栈 • Next.js 16 • React 19 • Supabase • Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
