# 万国觉醒AI短剧脚本 - 后端服务器

## 📋 简介

这是一个为万国觉醒AI短剧脚本工作流提供的后端API服务器。支持实时搜索万国觉醒相关内容，并使用DeepSeek AI生成创意和短剧脚本。

## 🚀 快速开始

### 环境要求
- Node.js v16.0.0 或更高版本
- npm v7.0.0 或更高版本
- 稳定的互联网连接

### 安装与运行

#### Windows 系统
1. 双击 `start-enhanced-server.bat`
2. 或手动运行：
   ```cmd
   npm install
   node rok-ai-server-enhanced.js
   ```

#### Linux/macOS 系统
1. 给启动脚本添加执行权限：
   ```bash
   chmod +x start.sh
   ```
2. 运行启动脚本：
   ```bash
   ./start.sh
   ```
3. 或手动运行：
   ```bash
   npm install
   node rok-ai-server-enhanced.js
   ```

### 验证安装
服务器启动后，访问以下地址验证：
- 健康检查：http://localhost:3001/api/health
- 应返回：`{"status":"ok","service":"万国觉醒AI短剧脚本服务器(增强版)"}`

## 🌐 API 端点

### POST `/api/generate-ideas`
生成创意想法
```json
{
  "requirement": "创作一个关于凯撒与曹操在跨时空战场相遇的短剧"
}
```

### POST `/api/generate-batch-scripts`
批量生成短剧脚本
```json
{
  "idea": {
    "title": "时空对决：凯撒 vs 曹操",
    "description": "..."
  },
  "requirement": "...",
  "count": 3
}
```

### GET `/api/health`
服务器健康检查

### POST `/api/test-search`
测试实时搜索功能

## ⚙️ 配置

### 环境变量
复制 `.env.example` 为 `.env` 并修改：
```env
# 服务器端口
PORT=3001

# DeepSeek API 密钥
DEEPSEEK_API_KEY=sk-your-actual-api-key

# CORS 允许的域名（逗号分隔）
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# 是否启用详细日志
LOG_LEVEL=info
```

### 修改API密钥
编辑 `rok-ai-server-enhanced.js` 文件，找到以下行并替换API密钥：
```javascript
const DEEPSEEK_API_KEY = 'sk-7fdb436ed0264313bf9d3dfe76a01169';
```

## 🐳 Docker 部署

### 构建镜像
```bash
docker build -t rok-ai-server .
```

### 运行容器
```bash
docker run -d -p 3001:3001 --name rok-ai-server rok-ai-server
```

### 使用环境变量
```bash
docker run -d -p 3001:3001 \
  -e DEEPSEEK_API_KEY=your-api-key \
  -e PORT=3001 \
  --name rok-ai-server rok-ai-server
```

## ☁️ 云平台部署

### Railway.app
1. 注册Railway账号
2. 导入GitHub仓库
3. 设置环境变量：
   - `PORT` = 3001
   - `DEEPSEEK_API_KEY` = 您的API密钥
4. 部署完成

### Render.com
1. 注册Render账号
2. 创建Web Service
3. 配置：
   - Build Command: `npm install`
   - Start Command: `node rok-ai-server-enhanced.js`
4. 设置环境变量

### Heroku
1. 安装Heroku CLI
2. 登录并创建应用：
   ```bash
   heroku login
   heroku create your-app-name
   ```
3. 部署：
   ```bash
   git push heroku main
   ```

## 📊 监控与日志

### 使用PM2（生产环境推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start rok-ai-server-enhanced.js --name "rok-ai-server"

# 设置开机自启
pm2 save
pm2 startup

# 查看日志
pm2 logs rok-ai-server
```

### 日志文件
- 访问日志：控制台输出
- 错误日志：控制台输出
- 建议在生产环境中配置日志轮转

## 🔧 故障排除

### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3001
# 或
netstat -ano | findstr :3001

# 更改端口
export PORT=3002
# 或修改代码
```

### 依赖安装失败
```bash
# 清除npm缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

### CORS 错误
确保前端域名在后端CORS配置中：
```javascript
app.use(cors({
    origin: ['https://your-frontend-domain.com']
}));
```

### DeepSeek API 调用失败
1. 检查API密钥是否有效
2. 检查网络连接
3. 查看DeepSeek API使用额度

## 📁 文件结构
```
├── rok-ai-server-enhanced.js    # 主服务器文件
├── package.json                 # 依赖配置
├── start-enhanced-server.bat    # Windows启动脚本
├── start.sh                     # Linux启动脚本
├── .env.example                 # 环境变量示例
├── README.md                    # 本文件
└── node_modules/                # 依赖目录（安装后生成）
```

## 📞 支持

### 常见问题
1. **服务器启动失败**：检查Node.js版本和端口占用
2. **API调用返回错误**：检查网络连接和API密钥
3. **搜索功能不工作**：检查网络连接和第三方API状态

### 获取帮助
- 查看服务器控制台输出
- 检查浏览器开发者工具网络标签
- 确保所有依赖已正确安装

## 📄 许可证

MIT License

## 🙏 致谢

- DeepSeek AI 提供强大的语言模型
- 万国觉醒游戏社区提供灵感
- 所有贡献者和用户

---
*最后更新：2026-03-31 | 版本：2.0.0*