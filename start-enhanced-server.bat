@echo off
echo ========================================
echo 万国觉醒AI短剧脚本服务器（增强版）启动脚本
echo 包含：实时搜索 + DeepSeek AI + 详细日志
echo ========================================
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ 检测到Node.js版本：
node --version

echo.

REM 检查增强版package.json是否存在
if not exist "package-enhanced.json" (
    echo ❌ 未找到package-enhanced.json文件
    pause
    exit /b 1
)

echo ✅ 找到增强版服务器配置文件
echo ℹ️ 已集成用户DeepSeek API密钥: sk-7fdb436ed0264313bf9d3dfe76a01169
echo.

REM 检查依赖是否已安装
if not exist "node_modules" (
    echo 📦 检测到未安装依赖，正在安装增强版依赖...
    echo 这可能需要几分钟时间，请稍候...
    echo.
    
    REM 临时重命名package.json
    if exist "package.json" (
        ren package.json package.bak
    )
    
    copy package-enhanced.json package.json >nul
    
    npm install
    
    REM 恢复原package.json
    if exist "package.bak" (
        del package.json
        ren package.bak package.json
    )
    
    echo.
    echo ✅ 增强版依赖安装完成
) else (
    echo ℹ️ 检测到已安装依赖，检查是否为增强版...
    REM 简单检查是否安装了cheerio
    dir node_modules | find "cheerio" >nul
    if %errorlevel% neq 0 (
        echo 📦 需要安装cheerio依赖...
        if exist "package.json" (
            ren package.json package.bak2
        )
        copy package-enhanced.json package.json >nul
        npm install cheerio
        if exist "package.bak2" (
            del package.json
            ren package.bak2 package.json
        )
        echo ✅ cheerio依赖安装完成
    ) else (
        echo ✅ 增强版依赖已安装
    )
)

echo.

REM 启动增强版服务器
echo 🚀 启动万国觉醒AI短剧脚本服务器（增强版）...
echo 服务器将运行在：http://localhost:3000
echo 功能特性：
echo   • 实时联网搜索万国觉醒内容
echo   • DeepSeek AI智能生成（已配置API密钥）
echo   • 智能降级机制
echo   • 详细日志输出
echo.
echo 请勿关闭此窗口
echo 按Ctrl+C停止服务器
echo.

node rok-ai-server-enhanced.js

pause