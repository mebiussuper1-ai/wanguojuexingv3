# 万国觉醒AI短剧脚本服务器 - Docker镜像
# 使用Node.js 18 Alpine作为基础镜像（轻量级）

FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装生产依赖
RUN npm install --production

# 复制应用程序文件
COPY . .

# 创建非root用户运行应用（安全最佳实践）
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 更改文件所有权
RUN chown -R nodejs:nodejs /app

# 切换到非root用户
USER nodejs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# 启动命令
CMD ["node", "rok-ai-server-enhanced.js"]

# 环境变量默认值
ENV PORT=3001 \
    NODE_ENV=production \
    LOG_LEVEL=info

# 标签
LABEL maintainer="万国觉醒AI工作流团队" \
      version="2.0.0" \
      description="万国觉醒AI短剧脚本服务器 - 支持实时搜索和DeepSeek AI生成"