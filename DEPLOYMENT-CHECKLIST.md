# 万国觉醒AI短剧脚本服务器 - 部署检查清单

## 📦 文件清单
确保以下文件已上传到GitHub：

### 必需文件
- [ ] `rok-ai-server-enhanced.js` - 主服务器文件
- [ ] `package.json` - 依赖配置文件
- [ ] `README.md` - 详细说明文档
- [ ] `.env.example` - 环境变量示例
- [ ] `.gitignore` - Git忽略文件

### 启动脚本
- [ ] `start-enhanced-server.bat` - Windows启动脚本
- [ ] `start.sh` - Linux/macOS启动脚本

### 部署配置文件
- [ ] `Dockerfile` - Docker镜像配置
- [ ] `docker-compose.yml` - Docker Compose配置
- [ ] `ecosystem.config.js` - PM2进程管理配置
- [ ] `railway.json` - Railway平台配置
- [ ] `render.yaml` - Render平台配置
- [ ] `heroku.yml` - Heroku平台配置
- [ ] `Procfile` - Heroku进程文件

### 文档文件
- [ ] `QUICK-START.md` - 快速开始指南
- [ ] `DEPLOYMENT-CHECKLIST.md` - 本检查清单

## ⚙️ 配置步骤

### 第一步：获取DeepSeek API密钥
1. [ ] 访问 https://platform.deepseek.com/api_keys
2. [ ] 注册/登录账号
3. [ ] 创建新的API密钥
4. [ ] 复制密钥（以 `sk-` 开头）

### 第二步：选择部署平台
选择以下任一平台：

#### A. Railway.app（推荐，免费）
1. [ ] 访问 https://railway.app
2. [ ] 注册账号
3. [ ] 点击 "New Project" → "Deploy from GitHub"
4. [ ] 选择您的仓库
5. [ ] 设置环境变量：
   - `DEEPSEEK_API_KEY` = 您的密钥
   - `ALLOWED_ORIGINS` = https://mebiussuper1-ai.github.io
6. [ ] 等待部署完成
7. [ ] 获取服务器地址（格式：`https://xxx.up.railway.app`）

#### B. Render.com（免费）
1. [ ] 访问 https://render.com
2. [ ] 注册账号
3. [ ] 点击 "New" → "Web Service"
4. [ ] 连接GitHub仓库
5. [ ] 配置：
   - **Name**: rok-ai-server
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node rok-ai-server-enhanced.js`
6. [ ] 设置环境变量
7. [ ] 点击 "Create Web Service"

#### C. 本地/自有服务器
1. [ ] 安装 Node.js v16+
2. [ ] 复制 `.env.example` 为 `.env`
3. [ ] 修改 `.env` 中的配置
4. [ ] 运行 `npm install`
5. [ ] 运行 `npm start` 或相应启动脚本

### 第三步：配置前端连接
1. [ ] 获取后端服务器地址
   - Railway: `https://xxx.up.railway.app`
   - Render: `https://xxx.onrender.com`
   - 本地: `http://localhost:3001`

2. [ ] 修改前端 `config.js` 文件：
   ```javascript
   const CONFIG = {
       API_BASE_URL: 'https://xxx.up.railway.app/api',
       // ...
   };
   ```

3. [ ] 将更新后的前端文件上传到GitHub Pages

### 第四步：测试连接
1. [ ] 访问后端健康检查：
   ```
   https://xxx.up.railway.app/api/health
   ```
   应返回：
   ```json
   { "status": "ok", "deepseek_configured": true }
   ```

2. [ ] 访问前端页面
3. [ ] 点击 "测试API连接" 按钮
4. [ ] 验证显示 "✅ 连接成功"

## 🧪 功能测试

### 测试创意生成
1. [ ] 在前端输入创意要求
2. [ ] 点击 "开始实时搜索并生成创意"
3. [ ] 验证是否显示3个创意卡片

### 测试脚本生成
1. [ ] 选择一个创意卡片
2. [ ] 点击 "基于选定创意生成脚本"
3. [ ] 验证是否生成3个脚本

### 测试备用数据功能
1. [ ] 暂时关闭DeepSeek API密钥
2. [ ] 重复上述测试
3. [ ] 验证是否使用智能备用数据

## 🔒 安全配置

### 生产环境安全检查
- [ ] 使用强密码的API密钥
- [ ] 设置 `ALLOWED_ORIGINS` 限制域名
- [ ] 启用 `NODE_ENV=production`
- [ ] 配置适当的日志级别
- [ ] 定期更新API密钥

### 监控配置
- [ ] 设置服务器健康检查
- [ ] 配置错误告警
- [ ] 定期查看服务器日志
- [ ] 监控API使用额度

## 📊 性能优化

### 针对不同流量
- **低流量**：使用免费层即可
- **中等流量**：考虑升级到付费计划
- **高流量**：使用PM2集群模式 + 负载均衡

### 缓存策略
- [ ] 考虑实现结果缓存
- [ ] 设置合理的缓存时间
- [ ] 定期清理缓存

## 🚨 故障排除

### 常见问题
1. **API连接失败**
   - [ ] 检查服务器是否运行
   - [ ] 验证API密钥是否正确
   - [ ] 检查网络连接

2. **CORS错误**
   - [ ] 确认 `ALLOWED_ORIGINS` 包含前端域名
   - [ ] 检查浏览器控制台错误信息

3. **服务器无响应**
   - [ ] 查看服务器日志
   - [ ] 检查端口是否被占用
   - [ ] 验证依赖是否安装

4. **AI生成质量差**
   - [ ] 调整AI温度参数
   - [ ] 优化提示词
   - [ ] 检查搜索结果的准确性

### 调试工具
- [ ] 使用 `LOG_LEVEL=debug` 获取详细日志
- [ ] 使用Postman测试API端点
- [ ] 检查云平台的日志功能

## 📈 维护计划

### 日常维护
- [ ] 每周检查服务器状态
- [ ] 每月更新依赖
- [ ] 定期备份配置文件

### 长期优化
- [ ] 考虑添加用户认证
- [ ] 实现脚本保存功能
- [ ] 添加更多AI模型支持
- [ ] 优化搜索算法

## 📞 支持资源

### 文档
- [完整部署指南](DEPLOYMENT-GUIDE.md)
- [服务器配置文档](SERVER-DEPLOYMENT.md)
- [快速开始指南](QUICK-START.md)
- [API文档](README.md#api-端点)

### 测试服务器
```
测试地址: https://rok-ai-test.up.railway.app/api
健康检查: https://rok-ai-test.up.railway.app/api/health
```

### 获取帮助
- GitHub Issues: 在仓库中创建Issue
- 提供：错误信息 + 日志 + 部署环境

---
## ✅ 部署完成标志

当以下所有项目都完成时，部署成功：

1. [ ] 后端服务器正常运行
2. [ ] 前端正确连接后端
3. [ ] 创意生成功能正常
4. [ ] 脚本生成功能正常
5. [ ] 备用数据功能正常
6. [ ] 所有API端点可访问
7. [ ] 没有CORS错误
8. [ ] 响应时间可接受（<5秒）

**恭喜！您的万国觉醒AI短剧脚本工作流已完全部署！** 🎉

---
*部署检查清单 v2.0.0 | 最后更新：2026-03-31*