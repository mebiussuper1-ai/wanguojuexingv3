# 万国觉醒AI短剧脚本工作流 - 网络部署指南

## 🚀 快速部署

### 系统要求
- **Node.js** v16+（推荐v18+）
- **npm** 包管理器
- **网络端口** 3001（可自定义）
- **DeepSeek API密钥**（已配置：sk-7fdb436ed0264313bf9d3dfe76a01169）

### 一键部署步骤

1. **上传文件**到服务器
2. **安装依赖**：
   ```bash
   npm install
   ```
   或使用一键安装脚本（Windows）：
   ```bash
   start-enhanced-server.bat
   ```

3. **启动服务器**：
   ```bash
   node rok-ai-server-enhanced.js
   ```

4. **访问应用**：
   - 主界面：`http://您的服务器IP:3001/`
   - 工作流：`http://您的服务器IP:3001/rok-ai-script-workflow.html`
   - API健康检查：`http://您的服务器IP:3001/api/health`

## 🔧 网络配置

### 修改API地址
默认配置为本地开发环境，网络部署需要修改：

1. **修改前端API地址**（`rok-ai-script-workflow.html`第658行）：
   ```javascript
   // 原配置（本地开发）
   const API_BASE_URL = 'http://localhost:3001/api';
   
   // 改为（网络部署）
   const API_BASE_URL = 'http://您的服务器IP:3001/api';
   // 或使用域名
   const API_BASE_URL = 'http://您的域名.com/api';
   ```

2. **修改服务器端口**（可选，`rok-ai-server-enhanced.js`第7行）：
   ```javascript
   const PORT = 3001; // 可改为80、443或其他端口
   ```

### 防火墙配置
根据服务器操作系统配置防火墙：

**Windows（管理员PowerShell）**：
```powershell
New-NetFirewallRule -DisplayName "万国觉醒AI端口" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

**Linux（Ubuntu/Debian）**：
```bash
sudo ufw allow 3001/tcp
sudo ufw reload
```

**CentOS/RHEL**：
```bash
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

### 使用PM2持久化运行（推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start rok-ai-server-enhanced.js --name "万国觉醒AI"

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs 万国觉醒AI
```

## 🌐 域名与反向代理

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name 您的域名.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Apache配置示例
```apache
<VirtualHost *:80>
    ServerName 您的域名.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    <Proxy *>
        Require all granted
    </Proxy>
</VirtualHost>
```

### 启用HTTPS（Let's Encrypt）
```bash
# 使用certbot获取SSL证书
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 您的域名.com

# 自动续期
sudo certbot renew --dry-run
```

## 📊 性能优化

### 1. 调整服务器参数
在