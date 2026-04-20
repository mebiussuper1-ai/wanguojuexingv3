# Vercel 部署检查清单

## 1. 检查 Vercel 项目状态

1. 访问 https://vercel.com
2. 登录您的账号
3. 进入 `wanguojuexingv3` 项目
4. 检查以下内容：

### 部署状态
- ✅ **Latest Deployment**: 应显示 "Ready"（绿色）
- ❌ 如果显示 "Failed"（红色），点击查看错误日志

### 环境变量
进入 **Settings** → **Environment Variables**，确认：
- `DEEPSEEK_API_KEY`: 您的真实API密钥（以 `sk-` 开头）
- `NODE_ENV`: `production`（可选）
- `ALLOWED_ORIGINS`: 可不设置，代码已有默认值

### 域名配置
进入 **Domains**，确认：
- `wanguojuexingv3-7lnv.vercel.app` 已存在
- `wanguojuexingv3-7lnv-ipxms0av1-mebiussuper1-6563s-projects.vercel.app` 已存在

## 2. 检查部署日志

如果部署失败，查看日志：

1. 点击 **Deployments** 标签页
2. 点击最新的部署
3. 查看 **Build Logs** 和 **Function Logs**

常见错误及解决方案：

### 错误1: Module not found
```
Error: Cannot find module 'express'
```
**解决方案**：Vercel 自动安装依赖失败，检查 `package.json` 格式

### 错误2: Process exited with status 1
```
Process exited with status 1
```
**解决方案**：检查 `api/index.js` 语法错误

### 错误3: Function timed out
```
Function invocation timed out
```
**解决方案**：在 `vercel.json` 中增加 `maxDuration`

## 3. 手动重新部署

如果部署失败或需要更新：

1. 进入 **Deployments** 标签页
2. 找到最新的部署
3. 点击 **Redeploy** 按钮
4. 或进入 **Settings** → **General** → **Redeploy**

## 4. 测试部署结果

### 测试静态文件
```
curl https://wanguojuexingv3-7lnv.vercel.app/
```
应返回 HTML 页面

### 测试API健康检查
```
curl https://wanguojuexingv3-7lnv.vercel.app/api/health
```
应返回 JSON：
```json
{"status":"ok","service":"万国觉醒AI短剧脚本服务器(增强版)"...}
```

### 测试API功能
```
curl -X POST https://wanguojuexingv3-7lnv.vercel.app/api/generate-ideas \
  -H "Content-Type: application/json" \
  -d '{"requirement": "测试"}'
```

## 5. 浏览器测试

1. 访问 https://wanguojuexingv3-7lnv.vercel.app
2. 按 **F12** 打开开发者工具
3. 检查 **Console** 标签页是否有错误
4. 检查 **Network** 标签页的API请求状态

## 6. 联网搜索问题诊断

如果API工作但搜索失败：

### 测试搜索端点
```
curl -X POST https://wanguojuexingv3-7lnv.vercel.app/api/test-search \
  -H "Content-Type: application/json" \
  -d '{"query": "万国觉醒"}'
```

### 可能原因
1. **百度百科屏蔽Vercel IP**：Serverless Functions 的出口IP可能被屏蔽
2. **请求超时**：搜索函数超过15秒超时
3. **网络限制**：Vercel 函数网络出口限制

### 解决方案
1. 代码已有备用数据机制，搜索失败时返回基础游戏信息
2. 增加搜索超时时间
3. 使用代理或更换搜索源

## 7. 紧急修复方案

如果Vercel持续失败，切换到其他平台：

### 方案A: Render.com
1. 访问 https://render.com
2. 导入GitHub仓库
3. 使用现有 `render.yaml` 配置
4. 设置环境变量
5. 部署

### 方案B: Railway
1. 访问 https://railway.app  
2. 导入GitHub仓库
3. 使用现有 `railway.json` 配置
4. 设置环境变量
5. 部署

## 8. 联系支持

如果所有方案都失败：

1. **Vercel 支持**: https://vercel.com/support
2. **提供信息**：
   - 项目URL
   - 错误截图
   - 部署日志
   - 复现步骤

## 9. 验证成功标志

✅ 静态页面可访问
✅ API健康检查返回 `{"status":"ok"}`
✅ 前端能调用API生成创意
✅ 控制台无CORS错误
✅ 响应时间合理（<5秒）

---

*部署检查指南 v1.0 | 最后更新：2026-04-20*