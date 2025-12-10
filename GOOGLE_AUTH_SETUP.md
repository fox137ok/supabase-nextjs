# Google OAuth 登录集成指南

## ✅ 已完成的代码集成

我已经为你完成了 Google OAuth 登录的集成工作：

1. ✅ 创建了 Google OAuth 登录的 Server Action ([app/login/actions.jsx](app/login/actions.jsx#L68-L91))
2. ✅ 添加了 Google 登录按钮 ([app/login/page.jsx](app/login/page.jsx))
3. ✅ 使用官方 Google 品牌色彩的 Logo
4. ✅ 优化了第三方登录按钮布局

## 🎨 登录页面更新

现在登录页面包含：
- ✨ 邮箱/密码登录
- ✨ Google OAuth 登录（白色按钮 + 彩色 Logo）
- ✨ GitHub OAuth 登录（黑色按钮）
- ✨ 统一的视觉风格

## 📋 Supabase 配置检查清单

由于你已经在 Supabase 配置好了 Google OAuth，请确认以下设置：

### 1. Google Cloud Console 配置

在 https://console.cloud.google.com：

1. **创建 OAuth 2.0 客户端**：
   - 转到 "APIs & Services" → "Credentials"
   - 点击 "Create Credentials" → "OAuth client ID"
   - 应用类型：Web application
   - 名称：`你的应用名称`

2. **配置授权来源**：
   - 已授权的 JavaScript 来源：
     - `http://localhost:3000` (开发环境)
     - `https://你的域名.com` (生产环境)

3. **配置重定向 URI**：
   - 已授权的重定向 URI：
     - `https://你的项目ID.supabase.co/auth/v1/callback`

4. **获取凭据**：
   - 复制 **Client ID**
   - 复制 **Client Secret**

### 2. Supabase Dashboard 配置

1. 登录 https://supabase.com/dashboard
2. 选择你的项目
3. 导航到 **Authentication** → **Providers**
4. 找到 **Google** 并启用
5. 填入 Google OAuth 凭据：
   - **Client ID**: 从 Google Cloud Console 获取
   - **Client Secret**: 从 Google Cloud Console 获取
6. 配置 **Redirect URLs**（应该已自动填充）：
   - `http://localhost:3000/auth/callback`
   - `https://你的域名.com/auth/callback`

### 3. 环境变量

确认 `.env.local` 包含：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
```

## 🚀 测试 Google 登录

### 步骤 1: 启动开发服务器

```bash
npm run dev
```

### 步骤 2: 访问登录页

打开浏览器访问: http://localhost:3000/login

### 步骤 3: 点击 Google 登录

1. 点击 "使用 Google 登录" 按钮
2. 选择 Google 账户
3. 授权应用访问你的信息
4. 自动返回应用并登录
5. 跳转到 `/account` 页面

## 🔍 登录流程说明

```
用户点击 Google 登录按钮
    ↓
Server Action (signInWithGoogle) 调用 Supabase OAuth
    ↓
重定向到 Google 授权页面
    ↓
用户选择 Google 账户并授权
    ↓
Google 回调到 /auth/callback
    ↓
exchangeCodeForSession 交换授权码
    ↓
重定向到 /account 页面
    ↓
用户登录成功! ✅
```

## 🎯 代码说明

### Server Action ([app/login/actions.jsx](app/login/actions.jsx#L68-L91))

```javascript
export async function signInWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',  // 获取 refresh token
        prompt: 'consent',       // 强制显示授权页面
      },
    },
  })

  if (error) {
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }
}
```

**参数说明**：
- `access_type: 'offline'`: 允许应用获取刷新令牌，用于长期访问
- `prompt: 'consent'`: 每次登录都显示授权页面（可选）

### Google 登录按钮 ([app/login/page.jsx](app/login/page.jsx))

```jsx
<form action={signInWithGoogle}>
  <button type="submit" className="...">
    {/* Google 官方彩色 Logo */}
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" .../>  {/* 蓝色 */}
      <path fill="#34A853" .../>  {/* 绿色 */}
      <path fill="#FBBC05" .../>  {/* 黄色 */}
      <path fill="#EA4335" .../>  {/* 红色 */}
    </svg>
    使用 Google 登录
  </button>
</form>
```

## 🛠️ 故障排查

### 问题 1: 点击按钮后没有反应
**解决方案**:
- 检查浏览器控制台是否有错误
- 确认 Supabase 中 Google Provider 已启用
- 验证环境变量是否正确

### 问题 2: Google 授权页面显示错误
**解决方案**:
- 检查 Google Cloud Console 中的重定向 URI 是否正确
- 确认 Client ID 和 Secret 已正确填入 Supabase
- 验证 OAuth 同意屏幕是否已配置

### 问题 3: 授权后返回错误页面
**解决方案**:
- 检查 `/auth/callback/route.js` 是否正确创建
- 查看服务器日志是否有错误信息
- 确认回调 URL 与 Supabase 配置一致

### 问题 4: "This app is blocked"
**解决方案**:
- Google OAuth 需要完成应用验证（生产环境）
- 开发时，可以添加测试用户到 Google Cloud Console
- 或者使用 "继续使用（不安全）" 链接（仅开发环境）

## 📊 多 OAuth 提供商对比

| 提供商 | 按钮颜色 | Logo | 特点 |
|--------|---------|------|------|
| Google | 白色边框 | 彩色 | 广泛使用，高信任度 |
| GitHub | 黑色 | 白色 | 开发者友好 |

## 🎨 UI 设计特点

1. **Google 按钮**：
   - 白色背景 + 灰色边框
   - 官方彩色 Logo
   - 符合 Google 品牌规范

2. **GitHub 按钮**：
   - 深灰色背景
   - 白色 Logo
   - 符合 GitHub 品牌规范

3. **统一间距**：
   - 按钮之间 12px 间距
   - 与邮箱登录区域分隔线区分

## ✨ 扩展建议

### 添加更多 OAuth 提供商

你可以使用相同的模式添加其他提供商：

```javascript
// actions.jsx
export async function signInWithMicrosoft() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',  // Microsoft
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) redirect('/error')
  if (data.url) redirect(data.url)
}
```

### 支持的其他提供商

Supabase 支持的 OAuth 提供商包括：
- ✅ Google
- ✅ GitHub
- Facebook
- Twitter / X
- LinkedIn
- Microsoft / Azure
- Apple
- Discord
- Slack
- Spotify
- 等等...

## 🔐 安全注意事项

1. **环境变量保护**：
   - 永远不要将 `.env.local` 提交到 Git
   - 生产环境使用环境变量管理服务

2. **OAuth 作用域**：
   - 只请求必要的权限
   - Google 默认提供：email, profile

3. **HTTPS 要求**：
   - 生产环境必须使用 HTTPS
   - 开发环境可以使用 HTTP

## 🎉 测试清单

- [ ] Google 登录按钮正确显示
- [ ] 点击按钮跳转到 Google 授权页面
- [ ] 选择账户后正确返回应用
- [ ] 登录成功后跳转到账户页面
- [ ] 账户页面显示正确的用户信息
- [ ] 退出登录功能正常工作
- [ ] 重新登录另一个 Google 账户

现在可以测试 Google 登录功能了！🚀
