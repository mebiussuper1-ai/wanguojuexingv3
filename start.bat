@echo off
chcp 65001 >nul
title 万国觉醒AI短剧脚本工作流 - 服务器启动

echo ================================================
echo     万国觉醒AI短剧脚本工作流 - 网络部署版
echo ================================================
echo.
echo 选择启动方式：
echo.
echo   [1] 一键启动（自动安装依赖 + 启动服务器）
echo   [2] 仅启动服务器（依赖已安装）
echo   [3] 仅安装依赖
echo   [4] 退出
echo.

set /p choice="请输入选择 (1-4): "

if "%choice%"=="1" goto option1
if "%choice%"=="2" goto option2
if "%choice%"=="3" goto option3
if "%choice%"=="4" goto option4

echo 无效选择，请重新运行。
pause
exit

:option1
echo.
echo 正在检查依赖安装...
if not exist "node_modules" (
    echo 依赖未安装，开始安装...
    call npm install
) else (
    echo 依赖已安装，跳过安装步骤。
)

echo.
echo 启动服务器...
echo 服务器将运行在：http://localhost:3001
echo 按 Ctrl+C 停止服务器
echo.
node rok-ai-server-enhanced.js
goto end

:option2
echo.
echo 启动服务器...
echo 服务器将运行在：http://localhost:3001
echo 按 Ctrl+C 停止服务器
echo.
node rok-ai-server-enhanced.js
goto end

:option3
echo.
echo 安装依赖...
call npm install
echo.
echo 依赖安装完成。
echo 请重新运行并选择选项1或2启动服务器。
pause
goto end

:option4
echo.
echo 退出。
goto end

:end
echo.
pause