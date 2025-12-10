import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 错误图标 */}
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* 错误信息 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">出错了</h1>
          <p className="text-gray-600 mb-6">
            抱歉,处理你的请求时出现了问题。这可能是由于:
          </p>

          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm text-gray-700">邮箱或密码不正确</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm text-gray-700">数据库表尚未创建</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm text-gray-700">网络连接问题</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm text-gray-700">服务暂时不可用</span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              返回登录页
            </Link>

            <Link
              href="/"
              className="block w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all"
            >
              返回首页
            </Link>
          </div>
        </div>

        {/* 帮助提示 */}
        <div className="text-sm text-gray-600">
          <p>需要帮助? 请检查:</p>
          <ul className="mt-2 space-y-1">
            <li>• Supabase 项目是否正确配置</li>
            <li>• 数据库表是否已创建</li>
            <li>• 环境变量是否正确设置</li>
          </ul>
        </div>
      </div>
    </div>
  )
}