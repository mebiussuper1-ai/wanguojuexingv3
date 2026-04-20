# Vercel 部署指南

## 🚀 快速部署步骤

### 第1步：提交代码到GitHub
```bash
# 在项目目录中执行
git add .
git commit -m "修复Vercel配置冲突"
git push origin main
```

### 第2步：在Vercel中设置环境变量
1. 访问 https://vercel.com
2. 登录后进入 `wanguojuexingv3` 项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DEEPSEEK_API_KEY` | `sk-你的真实密钥` | **必须**，从DeepSeek平台获取 |
| `NODE_ENV` | `production` | 可选，生产环境 |
| `ALLOWED_ORIGINS` | `*` | 可选，允许所有域名 |

### 第3步：触发部署
1. Vercel会自动检测GitHub推送并部署
2. 或手动在Vercel控制台点击 **Redeploy**

## ⚙️ 配置说明

### 项目结构
```
wanguojuexingv3/
├── api/index.js              # Serverless Function入口
├── vercel.json              # Vercel配置文件
├── rok-ai-server-enhanced.js # Express服务器
├── *.html, *.css, *.js      # 静态前端文件
└── package.json             # 依赖配置
```

### Vercel配置 (vercel.json)
- **无builds数组**：Vercel自动检测API目录
- **functions配置**：定义Serverless Function参数
- **routes配置**：路由规则，API请求到函数，其他到静态文件

### API端点
- `GET /api/test-simple` - 简单测试（无依赖）
- `GET /api/health` - 健康检查
- `POST /api/generate-ideas` - 生成创意
- `POST /api/generate-batch-scripts` - 生成脚本
- `POST /api/test-search` - 测试搜索

## 🧪 测试部署

### 基础测试
```bash
# 测试静态文件
curl https://wanguojuexingv3-7lnv.vercel.app/

# 测试简单API
curl https://wanguojuexingv3-7lnv.vercel.app/api/test-simple

# 测试健康检查
curl https://wanguojuexingv3-7lnv.vercel.app/api/health
```

### 功能测试
```bash
# 测试创意生成
curl -X POST https://wanguojuexingv3-7lnv.vercel.app/api/generate-ideas \
  -H "Content-Type: application/json" \
  -d '{"requirement": "万国觉醒凯撒"}'

# 测试搜索
curl -X POST https://wanguojuexingv3-7lnv.vercel.app/api/test-search \
  -H "Content-Type: application/json" \
  -d '{"query": "万国觉醒"}'
```

## 🔧 故障排除

### 常见错误

#### 1. "函数属性不能与构建属性同时使用"
**原因**：vercel.json中同时使用了`builds`和`functions`
**解决**：已修复，只保留`functions`配置

#### 2. "Module not found: Can't find module 'express'"
**原因**：依赖安装失败
**解决**：检查package.json格式，确保依赖正确

#### 3. "Function timed out"
**原因**：函数执行超过60秒
**解决**：代码已优化，搜索有超时处理

#### 4. CORS错误
**原因**：前端域名不在允许列表中
**解决**：代码已添加两个Vercel域名到CORS允许列表

### 查看日志
1. Vercel项目 → **Deployments** → 点击部署 → **View Logs**
2. Vercel项目 → **Functions** → api/index.js → **Logs**

## 📊 监控

### 健康检查
- 定期访问 `/api/health` 检查服务器状态
- 监控DeepSeek API密钥状态

### 性能指标
- Vercel控制台 → **Functions** → 查看调用次数、延迟、错误率
- 确保响应时间 < 5秒

## 🔄 重新部署

### 自动部署
- 推送代码到GitHub main分支自动触发

### 手动部署
1. Vercel控制台 → **Deployments**
2. 点击 **Redeploy**
3. 或 **Settings** → **General** → **Redeploy**

## 🆘 紧急联系

### 如果部署持续失败
1. **切换到Render.com**：已有完整render.yaml配置
2. **切换到Railway**：已有railway.json配置
3. **本地测试**：先确认代码在本地运行正常

### 获取帮助
1. 提供Vercel部署日志截图
2. 提供错误信息详情
3. 提供测试命令的输出

---

*部署指南 v1.1 | 最后更新：2026-04-20*