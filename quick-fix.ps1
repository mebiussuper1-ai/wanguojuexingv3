# 快速修复脚本 - 切换到Render.com部署
# 使用方法: 在PowerShell中运行 .\quick-fix.ps1

Write-Host "🚀 万国觉醒AI项目快速修复脚本" -ForegroundColor Green
Write-Host "=" * 60

# 1. 检查当前配置
Write-Host "🔍 检查当前配置..." -ForegroundColor Yellow

$configFile = "config.js"
if (Test-Path $configFile) {
    $content = Get-Content $configFile -Raw
    if ($content -match "wanguojuexingv3-7lnv\.vercel\.app") {
        Write-Host "✅ 当前配置指向Vercel" -ForegroundColor Green
    } elseif ($content -match "rok-ai-server\.onrender\.com") {
        Write-Host "✅ 当前配置已指向Render.com" -ForegroundColor Green
    } else {
        Write-Host "❌ 无法识别当前API地址" -ForegroundColor Red
    }
}

# 2. 询问用户是否切换到Render.com
Write-Host ""
Write-Host "🔄 是否切换到Render.com部署？" -ForegroundColor Yellow
Write-Host "Vercel可能因以下原因失败：" -ForegroundColor Yellow
Write-Host "  • Serverless Functions不适合Express服务器" -ForegroundColor Yellow
Write-Host "  • 网络出口限制可能阻止百度百科访问" -ForegroundColor Yellow
Write-Host "  • 环境变量配置复杂" -ForegroundColor Yellow
Write-Host "  • 免费额度限制较多" -ForegroundColor Yellow
Write-Host ""
Write-Host "Render.com优势：" -ForegroundColor Green
Write-Host "  • 专门用于Web应用部署" -ForegroundColor Green
Write-Host "  • 750小时/月免费额度" -ForegroundColor Green
Write-Host "  • 配置简单（已有render.yaml）" -ForegroundColor Green
Write-Host "  • 更稳定可靠" -ForegroundColor Green

$choice = Read-Host "切换到Render.com? (Y/N)"

if ($choice -ne 'Y' -and $choice -ne 'y') {
    Write-Host "❌ 用户取消操作" -ForegroundColor Red
    exit
}

# 3. 获取Render.com域名
Write-Host ""
Write-Host "📝 请输入Render.com服务域名：" -ForegroundColor Yellow
Write-Host "  示例: https://rok-ai-server.onrender.com" -ForegroundColor Yellow
Write-Host "  注意: 不要包含末尾的斜杠" -ForegroundColor Yellow
$renderDomain = Read-Host "Render域名"

if (-not $renderDomain) {
    $renderDomain = "https://rok-ai-server.onrender.com"
    Write-Host "使用默认域名: $renderDomain" -ForegroundColor Yellow
}

# 4. 更新配置文件
Write-Host ""
Write-Host "🔄 更新配置文件..." -ForegroundColor Yellow

# 更新config.js
if (Test-Path $configFile) {
    $newConfig = $content -replace "https://wanguojuexingv3-7lnv\.vercel\.app", $renderDomain
    Set-Content $configFile -Value $newConfig -Encoding UTF8
    Write-Host "✅ 更新 config.js" -ForegroundColor Green
}

# 5. 查找并更新所有HTML/JS文件
Write-Host "🔍 查找需要更新的文件..." -ForegroundColor Yellow

$files = Get-ChildItem -Path . -Include *.html, *.js -Exclude node_modules, config.js -Recurse -ErrorAction SilentlyContinue
$updatedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -and ($content -match "wanguojuexingv3-7lnv\.vercel\.app" -or $content -match "mebiussuper1-ai\.github\.io")) {
        try {
            $newContent = $content -replace "https://wanguojuexingv3-7lnv\.vercel\.app", $renderDomain
            $newContent = $newContent -replace "https://mebiussuper1-ai\.github\.io/wanguojuexingv3", $renderDomain
            Set-Content $file.FullName -Value $newContent -Encoding UTF8
            Write-Host "✅ 更新 $($file.Name)" -ForegroundColor Green
            $updatedCount++
        } catch {
            Write-Host "❌ 更新失败 $($file.Name): $_" -ForegroundColor Red
        }
    }
}

# 6. 显示结果
Write-Host ""
Write-Host "=" * 60
Write-Host "📊 修复完成总结" -ForegroundColor Green
Write-Host ""
Write-Host "✅ 更新的文件数量: $updatedCount" -ForegroundColor Green
Write-Host "✅ 新API地址: $renderDomain/api" -ForegroundColor Green
Write-Host ""

# 7. 下一步操作指南
Write-Host "🚀 下一步操作:" -ForegroundColor Cyan
Write-Host "1. 访问 https://render.com" -ForegroundColor Cyan
Write-Host "2. 注册账号（推荐GitHub登录）" -ForegroundColor Cyan
Write-Host "3. 点击 'New +' → 'Web Service'" -ForegroundColor Cyan
Write-Host "4. 连接GitHub仓库: wanguojuexingv3" -ForegroundColor Cyan
Write-Host "5. 设置环境变量 DEEPSEEK_API_KEY" -ForegroundColor Cyan
Write-Host "6. 点击 'Create Web Service'" -ForegroundColor Cyan
Write-Host "7. 等待部署完成（5-10分钟）" -ForegroundColor Cyan
Write-Host "8. 测试API: $renderDomain/api/health" -ForegroundColor Cyan
Write-Host ""

# 8. 测试命令
Write-Host "🧪 部署后测试命令:" -ForegroundColor Yellow
Write-Host "```powershell" -ForegroundColor Gray
Write-Host "# 测试健康检查" -ForegroundColor Gray
Write-Host "Invoke-WebRequest -Uri '$renderDomain/api/health' -Method Get" -ForegroundColor Gray
Write-Host ""
Write-Host "# 测试创意生成" -ForegroundColor Gray
Write-Host "`$body = @{requirement='万国觉醒凯撒'} | ConvertTo-Json" -ForegroundColor Gray
Write-Host "Invoke-WebRequest -Uri '$renderDomain/api/generate-ideas' -Method Post -Body `$body -ContentType 'application/json'" -ForegroundColor Gray
Write-Host "```" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 修复脚本执行完成！" -ForegroundColor Green
Write-Host "请按照上述步骤部署到Render.com" -ForegroundColor Green
Write-Host "如有问题，请提供具体错误信息" -ForegroundColor Green