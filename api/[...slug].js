// Vercel Catch-All Serverless Function
// 处理所有 /api/* 路由，包装 Express 应用

console.log('🚀 Vercel Serverless Function 启动中...');
console.log('='.repeat(60));

try {
  // 记录环境信息
  console.log('🔧 环境变量检查:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || '未设置'}`);
  console.log(`   VERCEL: ${process.env.VERCEL ? '是' : '否'}`);
  console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV || '未设置'}`);
  console.log(`   VERCEL_URL: ${process.env.VERCEL_URL || '未设置'}`);
  console.log(`   DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? '已设置' : '未设置'}`);
  
  // 检查关键依赖
  console.log('🔧 检查依赖...');
  const express = require('express');
  console.log('✅ Express 加载成功');
  
  // 导入 Express 应用
  console.log('🔧 导入主应用...');
  const app = require('../rok-ai-server-enhanced.js');
  console.log('✅ 应用导入成功');
  
  // Vercel 特定配置
  if (process.env.VERCEL) {
    console.log('🔧 Vercel 环境检测到，已启用生产模式');
    console.log(`   项目URL: ${process.env.VERCEL_URL}`);
    console.log(`   环境: ${process.env.VERCEL_ENV}`);
    console.log(`   Git分支: ${process.env.VERCEL_GIT_COMMIT_REF}`);
  }
  
  console.log('='.repeat(60));
  console.log('✅ Vercel Serverless Function 启动完成');
  
  // 导出处理函数
  module.exports = (req, res) => {
    try {
      console.log(`📥 请求: ${req.method} ${req.url}`);
      console.log(`   User-Agent: ${req.headers['user-agent'] || '未设置'}`);
      console.log(`   Origin: ${req.headers['origin'] || '未设置'}`);
      
      // 添加 CORS 响应头 - 允许所有来源
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Max-Age', '86400');
      
      // 处理预检请求
      if (req.method === 'OPTIONS') {
        console.log('🔧 处理 OPTIONS 预检请求');
        return res.status(200).end();
      }
      
      // Vercel catch-all 函数会把 URL 转换成 /api/health -> /health
      // 我们需要确保 Express 应用接收到正确带 /api 前缀的路由
      const originalUrl = req.url;
      if (!originalUrl.startsWith('/api/')) {
        req.url = '/api' + (originalUrl === '/' ? '' : originalUrl);
        console.log(`🔧 重写请求路径: ${originalUrl} -> ${req.url}`);
      } else {
        console.log(`🔧 请求路径已包含 /api 前缀: ${originalUrl}`);
      }
      
      // 将请求传递给 Express 应用
      return app(req, res);
      
    } catch (handlerError) {
      console.error('❌ 请求处理错误:', handlerError.message);
      console.error('堆栈:', handlerError.stack);
      
      res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: '请求处理失败',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    }
  };
  
} catch (initError) {
  console.error('❌ Serverless Function 初始化失败:');
  console.error('错误信息:', initError.message);
  console.error('堆栈:', initError.stack);
  console.error('当前目录:', process.cwd());
  console.error('文件列表:', require('fs').readdirSync('.'));
  
  // 导出错误处理函数
  module.exports = (req, res) => {
    console.error(`❌ 收到请求但服务器初始化失败: ${req.method} ${req.url}`);
    
    res.status(500).json({
      success: false,
      error: '服务器初始化失败',
      message: initError.message,
      timestamp: new Date().toISOString(),
      tip: '请检查Vercel日志和依赖配置'
    });
  };
}
