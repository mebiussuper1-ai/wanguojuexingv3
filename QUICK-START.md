# 万国觉醒AI短剧脚本服务器 - 快速开始指南

## ⚡ 5分钟快速部署

### 方式1：Railway.app（推荐，免费）
1. 访问 [Railway.app](https://railway.app)
2. 点击 "New Project" → "Deploy from GitHub"
3. 选择您的仓库（包含本后端服务器文件）
4. 设置环境变量：
   - `DEEPSEEK_API_KEY` = 您的DeepSeek API密钥
   - `ALLOWED_ORIGINS` = https://mebiussuper1-ai.github.io
5. 部署完成！获取您的服务器地址

### 方式2：Render.com（免费）
1. 访问 [Render.com](https://render.com)
2. 点击 "New" → "Web Service"
3. 连接您的GitHub仓库
4. 配置：
   - **Name**: rok-ai-server
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node rok-ai-server-enhanced.js`
5. 设置环境变量
6. 点击 "Create Web Service"

### 方式3：本地运行（开发测试）
```bash
# 克隆或下载代码
git clone https://github.com/mebiussuper1-ai/wanguojuexingv3.git
cd wanguojuexingv3

# 进入后端目录
cd 后端服务器

# 安装依赖
npm install

# 启动服务器（Windows）
start-enhanced-server.bat

# 或 Linux/macOS
chmod +x start.sh
./start.sh
```

### 方式4：Docker（任何环境）
```bash
# 构建镜像
docker build -t rok-ai-server .

# 运行容器
docker run -p 3001:3001 -e DEEPSEEK_API_KEY=your-key rok-ai-server

# 或使用docker-compose
docker-compose up -d
```

## 🔑 配置API密钥

### 获取DeepSeek API密钥
1. 访问 [DeepSeek官网](https://platform.deepseek.com/)
2. 注册/登录账号
3. 在API Keys页面创建新密钥
4. 复制您的API密钥

### 设置环境变量
创建 `.env` 文件：
```env
# 服务器配置
PORT=3001
NODE_ENV=production

# DeepSeek API
DEEPSEEK_API_KEY=sk-your-actual-api-key

# 允许的前端域名（GitHub Pages）
ALLOWED_ORIGINS=https://mebiussuper1-ai.github.io

# 日志级别
LOG_LEVEL=info
```

## 📡 连接前端

### 修改前端配置
在您的前端代码中，修改 `config.js`：
```javascript
const CONFIG = {
    // 改为您的后端服务器地址
    API_BASE_URL: 'https://your-app.up.railway.app/api',
    // 或本地开发: 'http://localhost:3001/api'
    // ...
};
```

### 验证连接
访问您的后端健康检查接口：
```
https://your-app.up.railway.app/api/health
```
应返回：
```json
{
  "status": "ok",
  "service": "万国觉醒AI短剧脚本服务器(增强版)",
  "deepseek_configured": true
}
```

## 🧪 测试API功能

### 测试创意生成
```bash
curl -X POST https://your-app.up.railway.app/api/generate-ideas \
  -H "Content-Type: application/json" \
  -d '{"requirement": "创作一个关于凯撒与曹操对决的短剧"}'
```

### 测试批量脚本生成
```bash
curl -X POST https://your-app.up.railway.app/api/generate-batch-scripts \
  -H "Content-Type: application/json" \
  -d '{
    "idea": {
      "title": "时空对决：凯撒 vs 曹操",
      "description": "...",
      "tags": ["战略对决", "英雄相惜"],
      "characters": ["凯撒", "曹操"],
      "platform": "抖音/快手",
      "duration": "60-90秒"
    },
    "requirement": "创作一个关于凯撒与曹操对决的短剧",
    "count": 2
  }'
```

## 🚨 故障排除

### 问题：API连接失败
**检查步骤：**
1. 确保后端服务器正在运行
2. 检查端口是否正确
3. 验证API密钥是否有效
4. 查看服务器日志

### 问题：CORS错误
**解决方案：**
确保 `ALLOWED_ORIGINS` 包含您的前端域名：
```env
ALLOWED_ORIGINS=https://mebiussuper1-ai.github.io,http://localhost:3000
```

### 问题：DeepSeek API调用失败
**可能原因：**
1. API密钥无效或过期
2. 额度用完
3. 网络问题

**解决方案：**
1. 检查DeepSeek账户余额
2. 更新API密钥
3. 服务器会自动使用备用数据

## 📈 生产环境优化

### 使用PM2（推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.js --env production

# 查看状态
pm2 status

# 查看日志
pm2 logs
```

### 配置域名和HTTPS
1. 在云平台配置自定义域名
2. 启用自动SSL证书
3. 更新前端配置中的API地址

### 监控和日志
- 使用云平台的日志功能
- 配置错误告警
- 定期检查服务器状态

## 📞 获取帮助

### 文档
- [完整部署指南](DEPLOYMENT-GUIDE.md)
- [服务器配置文档](SERVER-DEPLOYMENT.md)
- [API文档](README.md#api-端点)

### 测试服务器
您可以使用我们的测试服务器（仅供测试）：
```
API地址: https://rok-ai-test.up.railway.app/api
健康检查: https://rok-ai-test.up.railway.app/api/health
```

### 联系支持
如有问题，请提供：
1. 错误信息截图
2. 服务器日志
3. 您的部署环境

---
*快速开始指南 v2.0.0 | 最后更新：2026-03-31*