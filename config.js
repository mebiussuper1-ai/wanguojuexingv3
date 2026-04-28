// 万国觉醒AI短剧脚本工作流 - 配置文件
// 配置会根据部署环境自动适配

const CONFIG = {
    // API 服务器地址 - 自动根据当前环境确定
    // 在 Vercel 上使用相对路径，在 GitHub Pages 上使用 Vercel 域名
    API_BASE_URL: (function() {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // Vercel 环境 - 使用相对路径（同源请求，无 CORS 问题）
        if (hostname.includes('vercel.app')) {
            return '/api';
        }
        
        // GitHub Pages 环境
        if (hostname.includes('github.io')) {
            return 'https://wanguojuexingv3-six.vercel.app/api';
        }
        
        // 本地开发环境
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3001/api';
        }
        
        // 默认使用相对路径
        return '/api';
    })(),
    
    // 是否启用调试模式
    ENABLE_DEBUG: true,
    
    // DeepSeek API 密钥（前端仅用于显示，实际调用在后端）
    DEEPSEEK_API_KEY: 'sk-fa24b5b42cf949839f0e5a2063c00a6b',
    
    // 默认生成脚本数量
    DEFAULT_SCRIPT_COUNT: 3,
    
    // 备用数据启用（当API不可用时）
    ENABLE_FALLBACK: true,
    
    // 版本信息
    VERSION: '2.1.0'
};

// 导出配置（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// 全局访问
window.ROK_CONFIG = CONFIG;
