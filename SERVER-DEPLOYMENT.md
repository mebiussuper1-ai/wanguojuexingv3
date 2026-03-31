# 万国觉醒AI短剧脚本 - 后端服务器部署指南

## 🖥️ 服务器要求

- **Node.js**: v16.0.0 或更高版本
- **npm**: v7.0.0 或更高版本
- **内存**: 至少512MB RAM
- **存储**: 至少100MB可用空间
- **网络**: 稳定的互联网连接（用于DeepSeek API和实时搜索）

## 📦 服务器文件

### 必需文件
```
rok-ai-server-enhanced.js      # 主服务器文件
package-enhanced.json          # 依赖配置文件
start-enhanced-server.bat      # Windows启动脚本
```

### 可选文件
```
demo-server.js                 # 演示版本（模拟数据）
quick-demo.js                  # 快速演示版本
```

## 🚀 快速启动（本地开发）

### Windows 系统
1. 双击 `start-enhanced-server.bat`
2. 或手动运行：
   ```cmd
   node rok-ai-server-enhanced.js
   ```

### macOS/Linux 系统
```bash
# 安装依赖
npm install express cors axios cheerio

# 启动服务器
node rok-ai-server-enhanced.js
```

## 🌐 生产环境部署

### 方案A：使用PM2（推荐）

1. **安装PM2**：
   ```bash
   npm install -g pm2
   ```

2. **启动服务器**：
   ```bash
   pm2 start rok-ai-server-enhanced.js --name "rok-ai-server"
   ```

3. **设置开机自启**：
   ```bash
   pm2 save
   pm2 startup
   # 按照提示运行生成的命令
   ```

4. **常用PM2命令**：
   ```bash
   pm2 status                 # 查看状态
   pm2 logs                   # 查看日志
   pm2 restart rok-ai-server  # 重启服务
   pm2 stop rok-ai-server     # 停止服务
   pm2 delete rok-ai-server   # 删除服务
   ```

### 方案B：使用Docker

1. **创建Dockerfile**：
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3001
   CMD ["node", "rok-ai-server-enhanced.js"]
   ```

2. **构建和运行**：
   ```bash
   docker build -t rok-ai-server .
   docker run -d -p 3001:3001 --name rok-ai-server rok-ai-server
   ```

### 方案C：使用Systemd（Linux）

1. **创建服务文件** `/etc/systemd/system/rok-ai-server.service`：
   ```ini
   [Unit]
   Description=Rok AI Server
   After=network.target

   [Service]
   Type=simple
   User=nodejs
   WorkingDirectory=/opt/rok-ai-server
   ExecStart=/usr/bin/node /opt/rok-ai-server/rok-ai-server-enhanced.js
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

2. **启用并启动服务**：
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable rok-ai-server
   sudo systemctl start rok-ai-server
   sudo systemctl status rok-ai-server
   ```

## 🔧 环境配置

### 必需环境变量

在服务器上设置以下环境变量：

```bash
# DeepSeek API配置
export DEEPSEEK_API_KEY="sk-your-actual-api-key"

# 服务器配置
export PORT=3001
export NODE_ENV="production"

# CORS配置（允许的前端域名）
export ALLOWED_ORIGINS="https://yourusername.github.io,http://localhost:3000"
```

### 使用.env文件

创建 `.env` 文件：
```env
DEEPSEEK_API_KEY=sk-your-actual-api-key
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourusername.github.io,http://localhost:3000
```

在代码中加载：
```javascript
require('dotenv').config();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
```

## 🔐 安全配置

### 1. 防火墙设置

**Ubuntu/Debian**：
```bash
sudo ufw allow 3001/tcp
sudo ufw enable
```

**CentOS/RHEL**：
```bash
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

### 2. 反向代理（Nginx）

配置Nginx作为反向代理：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization';
        
        # 处理预检请求
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
            add_header Access-Control-Allow-Headers 'Content-Type, Authorization';
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # SSL配置（可选）
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
}
```

### 3. HTTPS配置（使用Let's Encrypt）

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d api.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

## 📊 监控与日志

### 日志配置

修改服务器代码添加日志：

```javascript
const fs = require('fs');
const morgan = require('morgan');

// 访问日志
const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// 应用日志
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' })
    ]
});

// 使用示例
logger.info('服务器启动成功', { port: PORT });
```

### 性能监控

使用 `node-os-utils` 监控系统资源：

```javascript
const osu = require('node-os-utils');

// 定期检查系统状态
setInterval(async () => {
    const cpuUsage = await osu.cpu.usage();
    const memInfo = await osu.mem.info();
    
    if (cpuUsage > 90 || memInfo.usedMemPercentage > 90) {
        logger.warn('系统资源使用率过高', { cpuUsage, memory: memInfo.usedMemPercentage });
    }
}, 60000); // 每分钟检查一次
```

## 🔄 更新与维护

### 更新服务器代码

```bash
# 1. 停止服务
pm2 stop rok-ai-server

# 2. 更新代码
git pull origin main
# 或手动上传新文件

# 3. 安装新依赖
npm install

# 4. 重启服务
pm2 restart rok-ai-server
```

### 数据库备份（如果使用数据库）

```bash
# 创建备份脚本 backup.sh
#!/bin/bash
BACKUP_DIR="/backups/rok-ai-server"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份日志文件
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz ./logs/

# 备份配置文件
cp config.js $BACKUP_DIR/config_$DATE.js

# 保留最近7天的备份
find $BACKUP_DIR -type f -mtime +7 -delete
```

## 🚨 故障排除

### 常见问题1：端口已被占用

**解决方案**：
```bash
# 查找占用端口的进程
sudo lsof -i :3001

# 杀死进程
sudo kill -9 <PID>

# 或更改服务器端口
export PORT=3002
```

### 常见问题2：内存泄漏

**解决方案**：
1. 使用 `--max-old-space-size` 限制内存：
   ```bash
   node --max-old-space-size=512 rok-ai-server-enhanced.js
   ```
2. 定期重启服务：
   ```bash
   # 每天凌晨3点重启
   0 3 * * * pm2 restart rok-ai-server
   ```

### 常见问题3：DeepSeek API调用失败

**解决方案**：
1. 检查API密钥是否有效
2. 检查网络连接：
   ```bash
   curl -X POST https://api.deepseek.com/v1/chat/completions \
     -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"test"}]}'
   ```
3. 实现重试机制：
   ```javascript
   async function callDeepSeekWithRetry(prompt, retries = 3) {
       for (let i = 0; i < retries; i++) {
           try {
               return await callDeepSeekAPI(prompt);
           } catch (error) {
               if (i === retries - 1) throw error;
               await sleep(1000 * (i + 1)); // 指数退避
           }
       }
   }
   ```

### 常见问题4：CORS错误

**解决方案**：
1. 确保CORS中间件正确配置：
   ```javascript
   app.use(cors({
       origin: function(origin, callback) {
           const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
           if (!origin || allowedOrigins.indexOf(origin) !== -1) {
               callback(null, true);
           } else {
               callback(new Error('Not allowed by CORS'));
           }
       }
   }));
   ```
2. 检查前端请求是否包含正确的Origin头

## 📈 性能优化建议

### 1. 启用压缩
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. 设置缓存
```javascript
app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=300'); // 5分钟缓存
    next();
});
```

### 3. 连接池优化
```javascript
const axios = require('axios');
const apiClient = axios.create({
    baseURL: 'https://api.deepseek.com',
    timeout: 30000,
    maxRedirects: 5,
    maxContentLength: 50 * 1024 * 1024, // 50MB
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true })
});
```

### 4. 负载均衡（高流量场景）

使用PM2集群模式：
```bash
pm2 start rok-ai-server-enhanced.js -i max --name "rok-ai-cluster"
```

配置Nginx负载均衡：
```nginx
upstream rok_ai_servers {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    location / {
        proxy_pass http://rok_ai_servers;
    }
}
```

## 📞 技术支持

### 获取日志
```bash
# PM2日志
pm2 logs rok-ai-server --lines 100

# 系统日志
sudo journalctl -u rok-ai-server -n 50

# 错误日志
tail -f ./logs/error.log
```

### 诊断工具
```bash
# 检查服务器状态
curl http://localhost:3001/api/health

# 检查响应时间
time curl -s http://localhost:3001/api/health > /dev/null

# 压力测试（安装siege）
siege -c 10 -t 30S http://localhost:3001/api/health
```

### 联系支持
如果问题无法解决，请提供：
1. 服务器日志文件
2. 错误截图
3. 服务器配置信息
4. 复现步骤

---
*部署指南版本：2.0.0 | 最后更新：2026-03-31*