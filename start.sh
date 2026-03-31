#!/bin/bash

# 万国觉醒AI短剧脚本服务器 - Linux启动脚本
# 适用于：Ubuntu/Debian/CentOS/macOS等系统

set -e  # 遇到错误立即退出

echo "========================================"
echo "万国觉醒AI短剧脚本服务器（增强版）"
echo "生产环境启动脚本 v2.0.0"
echo "========================================"
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到Node.js，请先安装Node.js"
    echo ""
    echo "安装指南："
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm"
    echo "  CentOS/RHEL:   sudo yum install nodejs npm"
    echo "  macOS:         brew install node"
    echo "  或从官网下载:  https://nodejs.org/"
    echo ""
    exit 1
fi

echo "✅ 检测到Node.js版本："
node --version
echo "✅ 检测到npm版本："
npm --version
echo ""

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 未找到package.json文件"
    exit 1
fi

echo "✅ 找到服务器配置文件"
echo ""

# 检查环境变量
echo "🔧 环境变量检查："
if [ -f ".env" ]; then
    echo "  发现 .env 文件，已加载环境变量"
    export $(grep -v '^#' .env | xargs)
else
    echo "  未找到 .env 文件，使用默认配置"
fi

echo "  PORT: ${PORT:-3001}"
echo "  NODE_ENV: ${NODE_ENV:-development}"
if [ -n "$DEEPSEEK_API_KEY" ]; then
    echo "  DEEPSEEK_API_KEY: 已设置（长度: ${#DEEPSEEK_API_KEY}）"
else
    echo "  DEEPSEEK_API_KEY: ❌ 未设置（将使用备用数据）"
fi
echo ""

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 检测到未安装依赖，正在安装..."
    echo "这可能需要几分钟时间，请稍候..."
    echo ""
    
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请检查网络连接"
        echo "尝试使用国内镜像：npm config set registry https://registry.npmmirror.com"
        exit 1
    fi
    
    echo ""
    echo "✅ 依赖安装完成"
else
    echo "ℹ️ 检测到已安装依赖"
    
    # 检查核心依赖
    REQUIRED_DEPS=("express" "cors" "axios" "cheerio")
    for dep in "${REQUIRED_DEPS[@]}"; do
        if [ ! -d "node_modules/$dep" ]; then
            echo "📦 需要安装 $dep 依赖..."
            npm install $dep
        fi
    done
    
    echo "✅ 所有依赖已就绪"
fi

echo ""

# 设置生产环境变量
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV="production"
fi

# 启动服务器
echo "🚀 启动万国觉醒AI短剧脚本服务器..."
echo ""
echo "📊 服务器信息："
echo "  环境模式:    ${NODE_ENV}"
echo "  监听端口:    ${PORT:-3001}"
echo "  服务器地址:  http://localhost:${PORT:-3001}"
echo "  API健康检查: http://localhost:${PORT:-3001}/api/health"
echo ""
echo "🎯 功能特性："
echo "  • 实时联网搜索万国觉醒内容"
echo "  • DeepSeek AI智能生成"
echo "  • 智能降级机制（API不可用时自动切换）"
echo "  • 详细日志输出"
echo "  • 生产环境优化"
echo ""
echo "🌐 部署方式："
echo "  • 直接运行:   ./start.sh"
echo "  • PM2管理:    npm run pm2:start"
echo "  • Docker:     npm run docker:compose"
echo "  • Railway:    railway up"
echo ""
echo "🔧 管理命令："
echo "  查看日志:     tail -f 日志文件"
echo "  停止服务:     Ctrl+C"
echo "  后台运行:     nohup ./start.sh &"
echo ""
echo "========================================"
echo "服务器启动中..."
echo "========================================"
echo ""

# 检查端口是否被占用
PORT_TO_USE=${PORT:-3001}
if lsof -Pi :$PORT_TO_USE -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告：端口 $PORT_TO_USE 已被占用"
    echo "尝试使用其他端口..."
    export PORT=$((PORT_TO_USE + 1))
    echo "改用端口: $PORT"
    echo ""
fi

# 启动服务器
exec node rok-ai-server-enhanced.js