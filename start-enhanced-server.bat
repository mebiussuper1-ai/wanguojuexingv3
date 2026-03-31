@echo off
echo ========================================
echo 万国觉醒AI短剧脚本服务器（增强版）
echo 生产环境启动脚本 v2.0.0
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
echo ✅ 检测到npm版本：
npm --version
echo.

REM 检查package.json是否存在
if not exist "package.json" (
    echo ❌ 未找到package.json文件
    pause
    exit /b 1
)

echo ✅ 找到服务器配置文件
echo.

REM 检查环境变量文件
if exist ".env" (
    echo 🔧 发现 .env 文件，已加载环境变量
) else (
    echo ℹ️ 未找到 .env 文件，使用默认配置
)

echo  端口: %PORT% (默认: 3001)
echo  环境: %NODE_ENV% (默认: development)
if defined DEEPSEEK_API_KEY (
    echo  DeepSeek密钥: 已设置
) else (
    echo  DeepSeek密钥: ❌ 未设置（将使用备用数据）
)
echo.

REM 检查依赖是否已安装
if not exist "node_modules" (
    echo 📦 检测到未安装依赖，正在安装...
    echo 这可能需要几分钟时间，请稍候...
    echo.
    
    npm install
    
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败，请检查网络连接
        echo 尝试使用国内镜像：npm config set registry https://registry.npmmirror.com
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ 依赖安装完成
) else (
    echo ℹ️ 检测到已安装依赖
    
    REM 检查核心依赖
    set DEPENDENCIES=express cors axios cheerio
    for %%d in (%DEPENDENCIES%) do (
        if not exist "node_modules\%%d" (
            echo 📦 需要安装 %%d 依赖...
            npm install %%d
        )
    )
    
    echo ✅ 所有依赖已就绪
)

echo.

REM 设置默认环境变量
if not defined NODE_ENV set NODE_ENV=production
if not defined PORT set PORT=3001

echo 🚀 启动万国觉醒AI短剧脚本服务器...
echo.
echo 📊 服务器信息：
echo   环境模式:    %NODE_ENV%
echo   监听端口:    %PORT%
echo   服务器地址:  http://localhost:%PORT%
echo   API健康检查: http://localhost:%PORT%/api/health
echo.
echo 🎯 功能特性：
echo   • 实时联网搜索万国觉醒内容
echo   • DeepSeek AI智能生成
echo   • 智能降级机制（API不可用时自动切换）
echo   • 详细日志输出
echo   • 生产环境优化
echo.
echo 🌐 部署方式：
echo   • 直接运行:   双击此文件
echo   • PM2管理:    npm run pm2:start
echo   • Docker:     npm run docker:compose
echo   • Railway:    railway up
echo.
echo 🔧 管理命令：
echo   查看日志:     查看控制台输出
echo   停止服务:     Ctrl+C
echo.
echo ========================================
echo 服务器启动中...
echo ========================================
echo.

REM 检查端口是否被占用
netstat -ano | findstr ":%PORT%" >nul
if %errorlevel% equ 0 (
    echo ⚠️  警告：端口 %PORT% 已被占用
    echo 尝试使用其他端口...
    set /a PORT=%PORT%+1
    echo 改用端口: %PORT%
    echo.
)

REM 启动服务器
node rok-ai-server-enhanced.js

echo.
echo ========================================
echo 服务器已停止
echo ========================================
pause