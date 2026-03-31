// 万国觉醒AI短剧脚本工作流 - 配置文件
// 用户可以根据自己的部署情况修改这些配置

const CONFIG = {
    // API 服务器地址
    // 本地开发: 'http://localhost:3001/api'
    // 生产环境: 'https://your-api-domain.com/api'
    // 请将 your-api-domain.com 替换为你的实际后端服务器地址
    API_BASE_URL: 'https://your-api-domain.com/api',
    
    // 是否启用调试模式
    ENABLE_DEBUG: true,
    
    // DeepSeek API 密钥（前端仅用于显示，实际调用在后端）
    DEEPSEEK_API_KEY: 'sk-7fdb436ed0264313bf9d3dfe76a01169',
    
    // 默认生成脚本数量
    DEFAULT_SCRIPT_COUNT: 3,
    
    // 备用数据启用（当API不可用时）
    ENABLE_FALLBACK: true,
    
    // 版本信息
    VERSION: '2.0.0'
};

// 导出配置（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// 全局访问
window.ROK_CONFIG = CONFIG;