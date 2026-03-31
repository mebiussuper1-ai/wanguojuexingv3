# 将后端服务器文件上传到GitHub指南

## 📋 前提条件
- 已有GitHub账号
- 已有仓库：`mebiussuper1-ai/wanguojuexingv3`
- 已安装Git或使用GitHub网页版

## 🖥️ 方法一：使用Git命令行（推荐）

### 步骤1：克隆你的仓库
```bash
# 打开命令行，进入你想存放代码的目录
cd 你的目录

# 克隆仓库（如果还没有）
git clone https://github.com/mebiussuper1-ai/wanguojuexingv3.git
cd wanguojuexingv3
```

### 步骤2：创建后端目录
```bash
# 在仓库中创建"backend"目录
mkdir backend

# 或使用其他名称，如"server"、"api-server"等
```

### 步骤3：复制文件
将 `E:\软件\网页补充\后端服务器` 目录中的所有文件复制到刚刚创建的 `backend` 目录中。

### 步骤4：提交到GitHub
```bash
# 添加所有文件
git add backend/

# 提交更改
git commit -m "添加万国觉醒AI短剧脚本后端服务器"

# 推送到GitHub
git push origin main
```

## 🌐 方法二：使用GitHub网页版

### 步骤1：访问仓库
1. 打开 https://github.com/mebiussuper1-ai/wanguojuexingv3
2. 确保你在正确的仓库中

### 步骤2：创建新目录
1. 点击 "Add file" → "Create new file"
2. 在文件名输入框中输入：`backend/README.md`
   - 输入 `backend/` 会自动创建目录
3. 在文件内容中输入：`# 后端服务器目录`
4. 点击 "Commit new file"

### 步骤3：上传文件
1. 进入刚刚创建的 `backend` 目录
2. 点击 "Add file" → "Upload files"
3. 将 `E:\软件\网页补充\后端服务器` 中的所有文件拖到上传区域
4. 点击 "Commit changes"

## 📁 建议的目录结构
上传后，你的仓库结构应该类似这样：
```
wanguojuexingv3/
├── index.html                    # 你的主页
├── rok-ai-script-workflow.html   # 主工作流页面
├── test-buttons.html            # 测试页面
├── config.js                    # 前端配置文件
├── backend/                     # 后端服务器目录（新添加）
│   ├── rok-ai-server-enhanced.js
│   ├── package.json
│   ├── start.sh
│   ├── start-enhanced-server.bat
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── railway.json
│   ├── render.yaml
│   ├── README.md
│   └── ...（其他文件）
└── ...（其他前端文件）
```

## 🔧 验证上传
上传完成后，访问你的仓库页面，确认：
1. `backend/` 目录已创建
2. 所有16个文件都在 `backend/` 目录中
3. 文件大小和数量正确

## ⚠️ 注意事项

### 1. 不要上传敏感信息
- **不要**上传 `.env` 文件（如果已创建）
- **不要**上传 `node_modules/` 目录
- **不要**上传包含API密钥的文件

### 2. Git忽略规则
`.gitignore` 文件已包含，会自动忽略：
- `node_modules/`
- `.env`
- 日志文件
- 临时文件

### 3. 文件权限
- `start.sh` 在Linux/macOS需要执行权限
- 上传后，如果需要，运行：`chmod +x backend/start.sh`

## 🚀 上传后立即部署
文件上传到GitHub后，你可以立即部署：

### Railway部署
1. 访问 https://railway.app
2. 点击 "New Project" → "Deploy from GitHub"
3. 选择 `mebiussuper1-ai/wanguojuexingv3`
4. 选择部署目录：`/backend`
5. 设置环境变量，部署

### Render部署
1. 访问 https://render.com
2. 创建Web Service
3. 连接GitHub仓库
4. 设置根目录：`/backend`
5. 配置环境变量，部署

## 📞 遇到问题？

### 常见问题1：文件太多，上传失败
**解决方案**：
- 分批上传文件
- 使用Git命令行而不是网页版
- 确保网络连接稳定

### 常见问题2：目录结构错误
**解决方案**：
- 删除错误的目录
- 重新创建正确的目录结构
- 重新上传文件

### 常见问题3：.gitignore不生效
**解决方案**：
- 检查 `.gitignore` 文件是否在正确位置
- 运行 `git rm -r --cached node_modules`（如果已误上传）
- 重新提交

## ✅ 上传完成标志
- [ ] 所有16个文件都在GitHub仓库中
- [ ] 文件位于 `backend/` 目录下
- [ ] 可以通过GitHub网页查看文件内容
- [ ] 没有敏感信息被上传
- [ ] 目录结构正确

## 🎯 下一步
上传完成后，立即开始部署：
1. 选择部署平台（Railway/Render）
2. 配置环境变量
3. 连接GitHub仓库
4. 开始部署
5. 获取服务器地址
6. 更新前端配置

---
*上传指南 v1.0 | 最后更新：2026-03-31*

**提示**：建议使用方法一（Git命令行），更可靠且支持大文件上传。