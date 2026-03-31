# 万国觉醒AI短剧脚本工作流 - 网络部署指南

## 📋 概述

本指南将帮助您将万国觉醒AI短剧脚本工作流部署到网络环境，实现前端（GitHub Pages）与后端（API服务器）的分离部署。

## 🎯 部署架构

```
前端 (GitHub Pages)
    ↓ HTTP请求
后端 API 服务器 (云服务器/VPS/PaaS)
    ↓ 调用
DeepSeek AI API
    ↓ 实时搜索
互联网资源
```

## 🚀 快速部署步骤

### 第一步：准备文件

1. 从 `E:\软件\网页补充` 目录获取以下文件：
   - `config.js` - 配置文件
   - `rok-ai-script-workflow-fixed.html` - 主工作流页面（网络部署版）
   - `test-buttons-fixed.html` - 测试页面
   - 其他相关HTML/CSS/JS文件

2. 将这些文件上传到您的GitHub仓库

### 第二步：配置前端

1. 打开 `config.js` 文件
2. 修改 `API_BASE_URL` 为您的后端服务器地址：
   ```javascript
   // 修改这一行
   API_BASE_URL: 'https://your-api-domain.com/api',
   
   // 改为您的实际地址，例如：
   // API_BASE_URL: 'https://api.yourdomain.com/api',
   // 或本地开发：'http://localhost:3001/api'
   ```

### 第三步：部署后端服务器

选择以下任一方案部署后端：

#### 方案A：使用本地服务器（开发/测试）

1. 使用提供的 `rok-ai-server-enhanced.js` 作为后端
2. 确保已安装Node.js和依赖：
   ```bash
   npm install express cors axios cheerio
   ```
3. 启动服务器：
   ```bash
   node rok-ai-server-enhanced.js
   ```
4. 服务器将在 `http://localhost:3001` 运行

#### 方案B：部署到云服务器/VPS

1. 将服务器文件上传到云服务器
2. 安装Node.js和PM2（进程管理）：
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   sudo npm install -g pm2
   ```
3. 安装依赖并启动：
   ```bash
   npm install
   pm2 start rok-ai-server-enhanced.js --name "rok-ai-server"
   pm2 save
   pm2 startup
   ```
4. 配置Nginx反向代理（可选）：
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

#### 方案C：使用PaaS平台（推荐）

**Railway.app**（推荐）：
1. 注册Railway账号
2. 导入GitHub仓库
3. 设置环境变量：
   - `PORT` = 3001
   - `DEEPSEEK_API_KEY` = 您的DeepSeek API密钥
4. 部署完成，获取分配的域名

**Render.com**：
1. 注册Render账号
2. 创建Web Service
3. 连接GitHub仓库
4. 配置：
   - Build Command: `npm install`
   - Start Command: `node rok-ai-server-enhanced.js`
5. 部署完成，获取`.onrender.com`域名

### 第四步：配置CORS（跨域资源共享）

确保后端服务器允许GitHub Pages域名的跨域请求：

在 `rok-ai-server-enhanced.js` 中添加：
```javascript
app.use(cors({
    origin: [
        'https://yourusername.github.io',  // 您的GitHub Pages域名
        'http://localhost:3000',           // 本地开发
        'https://yourdomain.com'           // 自定义域名
    ],
    credentials: true
}));
```

### 第五步：测试部署

1. 访问您的前端页面：
   ```
   https://yourusername.github.io/wanguojuexingv3/rok-ai-script-workflow-fixed.html
   ```

2. 点击"测试API连接"按钮验证后端连接

3. 如果连接失败，检查：
   - 后端服务器是否运行
   - `config.js`中的API地址是否正确
   - 防火墙/安全组是否允许端口访问
   - CORS配置是否正确

## 🔧 故障排除

### 问题1：API连接失败，显示"服务器未运行"

**可能原因**：
- 后端服务器未启动
- API地址配置错误
- 端口被防火墙阻止

**解决方案**：
1. 检查后端服务器状态：`pm2 list` 或查看服务日志
2. 验证API地址是否能直接访问：`curl https://your-api-domain.com/api/health`
3. 检查防火墙设置，开放3001端口

### 问题2：CORS错误（跨域问题）

**解决方案**：
1. 在后端服务器启用CORS：
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```
2. 或指定允许的域名：
   ```javascript
   app.use(cors({
       origin: 'https://yourusername.github.io'
   }));
   ```

### 问题3：DeepSeek API密钥无效

**解决方案**：
1. 确保后端服务器设置了正确的API密钥：
   ```javascript
   const DEEPSEEK_API_KEY = 'sk-your-actual-api-key';
   ```
2. 检查API密钥是否过期或有使用限制

### 问题4：GitHub Pages缓存问题

**解决方案**：
1. 强制刷新浏览器：Ctrl+F5
2. 清除浏览器缓存
3. 在GitHub仓库设置中重新部署Pages

## 📁 文件结构说明

```
├── config.js                    # 配置文件
├── rok-ai-script-workflow-fixed.html  # 主工作流页面
├── test-buttons-fixed.html      # 测试页面
├── rok-ai-server-enhanced.js    # 后端服务器代码
├── package-enhanced.json        # 后端依赖配置
├── start-enhanced-server.bat    # Windows启动脚本
└── 其他相关文件
```

## 🌐 域名配置（可选）

### 自定义域名
1. 在域名注册商处添加CNAME记录：
   ```
   CNAME api.yourdomain.com → your-railway-app.up.railway.app
   ```
2. 在PaaS平台配置自定义域名
3. 更新`config.js`中的API地址

### SSL证书（HTTPS）
- Railway/Render自动提供SSL证书
- 自建服务器可使用Let's Encrypt：
  ```bash
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d api.yourdomain.com
  ```

## 📊 监控与维护

### 后端监控
1. 使用PM2监控Node.js进程：
   ```bash
   pm2 monit
   pm2 logs
   ```
2. 设置告警：监控服务器CPU、内存、磁盘使用率
3. 日志轮转：配置logrotate防止日志文件过大

### 性能优化
1. 启用Gzip压缩：
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```
2. 设置请求超时：
   ```javascript
   server.timeout = 30000; // 30秒
   ```
3. 限制请求频率防止滥用

## 🔐 安全建议

1. **API密钥保护**：
   - 不要在前端暴露API密钥
   - 使用环境变量存储敏感信息
   - 定期轮换API密钥

2. **输入验证**：
   ```javascript
   // 在后端验证用户输入
   if (!requirement || requirement.length > 1000) {
       return res.status(400).json({ error: '输入无效' });
   }
   ```

3. **速率限制**：
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15分钟
       max: 100 // 每个IP限制100个请求
   });
   app.use('/api/', limiter);
   ```

## 📞 获取帮助

如果遇到问题，请提供以下信息：
1. 错误消息截图
2. 浏览器控制台输出
3. 后端服务器日志
4. 您的部署环境（GitHub Pages + 后端平台）

**联系方式**：
- GitHub Issues：在仓库中创建Issue
- 邮件：您的联系邮箱

## 🎉 部署完成

恭喜！您的万国觉醒AI短剧脚本工作流现已完全部署到网络环境。用户可以：
1. 访问前端页面输入创意要求
2. 系统实时搜索万国觉醒相关内容
3. 使用DeepSeek AI生成创意和脚本
4. 导出完整的短剧脚本

**下一步优化**：
- 添加用户认证系统
- 实现脚本保存和分享功能
- 添加更多AI模型选择
- 集成社交媒体发布功能

---
*最后更新：2026-03-31 | 版本：2.0.0*