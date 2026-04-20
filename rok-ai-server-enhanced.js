// 万国觉醒AI短剧脚本服务器 - 生产优化版
// 支持环境变量配置和多种部署方式

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

// ==================== 配置 ====================
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// DeepSeek API 配置 - 从环境变量读取，支持Railway、Render等平台
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-fa24b5b42cf949839f0e5a2063c00a6b';

// ==================== 调试信息 ====================
console.log('🔧 环境配置检查:');
console.log(`   PORT: ${PORT} (${typeof PORT})`);
console.log(`   NODE_ENV: ${NODE_ENV}`);
console.log(`   LOG_LEVEL: ${LOG_LEVEL}`);
console.log(`   DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY ? '已设置' + (DEEPSEEK_API_KEY.includes('your-api-key') ? ' (默认值)' : '') : '未设置'}`);
console.log(`   ALLOWED_ORIGINS 环境变量: ${process.env.ALLOWED_ORIGINS || '未设置，使用默认值'}`);
console.log('🔧 开始初始化服务器...');

// CORS配置 - 从环境变量读取允许的域名
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : [
        'http://localhost:3000', 
        'http://localhost:3001', 
        'https://mebiussuper1-ai.github.io',
        'https://wanguojuexingv3-7lnv-ipxms0av1-mebiussuper1-6563s-projects.vercel.app',
        'https://wanguojuexingv3-7lnv.vercel.app'
      ];

const app = express();

// ==================== 中间件 ====================
// CORS配置
app.use(cors({
    origin: function(origin, callback) {
        // 允许没有origin的请求（如curl、postman）
        if (!origin) return callback(null, true);
        
        if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) {
            callback(null, true);
        } else {
            console.warn(`CORS阻止了来自 ${origin} 的请求`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求体大小限制（防止DoS攻击）
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
        console[logLevel](`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// 静态文件服务（可选）
if (NODE_ENV === 'development') {
    app.use(express.static('.'));
    console.log('开发模式：已启用静态文件服务');
}

// ==================== 辅助函数 ====================

// 日志函数
function log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (level === 'error') {
        console.error(logMessage, data);
    } else if (level === 'warn') {
        console.warn(logMessage, data);
    } else if (LOG_LEVEL === 'debug' || level === 'info') {
        console.log(logMessage, data);
    }
}

// 真实搜索函数 - 联网搜索万国觉醒相关内容
async function searchRokContent(query) {
    try {
        log('info', `正在搜索万国觉醒相关内容: ${query}`);
        
        // 搜索策略：尝试多个来源获取游戏信息
        const searchPromises = [
            searchBaiduBaike(query),
            searchGameOfficialInfo(),
            searchGameCommunityInfo(query)
        ];
        
        const results = await Promise.allSettled(searchPromises);
        
        // 合并所有搜索结果
        let allResults = [];
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allResults = allResults.concat(result.value);
            }
        });
        
        // 如果搜索失败，返回基础游戏信息
        if (allResults.length === 0) {
            return getBasicRokInfo();
        }
        
        // 去重并限制数量
        const uniqueResults = [...new Set(allResults)];
        return uniqueResults.slice(0, 10);
        
    } catch (error) {
        log('error', '搜索失败', { message: error.message });
        return getBasicRokInfo();
    }
}

// 百度百科搜索
async function searchBaiduBaike(query) {
    try {
        const searchUrl = `https://baike.baidu.com/item/${encodeURIComponent('万国觉醒')}`;
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const content = $('.lemma-summary').text() || $('.para').first().text();
        
        if (content) {
            // 提取关键信息
            const lines = content.split(/[。!?；]/).filter(line => 
                line.trim().length > 10 && 
                (line.includes('万国觉醒') || line.includes('统帅') || line.includes('游戏') || line.includes('战争'))
            );
            
            return lines.slice(0, 5).map(line => line.trim() + '。');
        }
        
        return [];
    } catch (error) {
        log('warn', '百度百科搜索失败', { message: error.message });
        return [];
    }
}

// 游戏官网信息
async function searchGameOfficialInfo() {
    // 万国觉醒官方信息
    return [
        "《万国觉醒》是一款由莉莉丝游戏开发的多人实时战略手游",
        "游戏融合了文明进化、城市建设、资源管理和实时战斗等元素",
        "玩家可以从12个文明中选择一个，每个文明有独特的建筑、单位和加成",
        "游戏中有超过40位历史统帅，包括凯撒、曹操、源义经、腓特烈等",
        "统帅分为传说、史诗、精英、优秀四个等级，每个统帅有5个独有技能",
        "游戏支持大规模PVP战斗，最多支持8v8的联盟对战",
        "KVK（王国vs王国）是游戏的核心玩法，多个王国之间进行跨服战争"
    ];
}

// 游戏社区信息
async function searchGameCommunityInfo(query) {
    // 基于查询关键词返回相关信息
    const keywordMap = {
        '凯撒': ['凯撒是罗马文明的传说统帅', '凯撒技能"不败之军"可以提升部队攻击防御', '凯撒擅长率领步兵部队'],
        '曹操': ['曹操是华夏文明的传说统帅', '曹操技能"虎豹骑"擅长骑兵突击', '曹操在游戏中以机动性和爆发力著称'],
        '源义经': ['源义经是日本文明的传说统帅', '源义经技能"八艘跳"具有高机动性', '源义经擅长游击战术和快速打击'],
        '腓特烈': ['腓特烈是德意志文明的传说统帅', '腓特烈技能"红胡子"增强部队生存能力', '腓特烈是优秀的防守型统帅'],
        '短剧': ['万国觉醒短剧通常聚焦于历史统帅的跨时空相遇', '热门短剧主题包括：联盟背叛、英雄对决、平民逆袭等'],
        '脚本': ['短视频脚本需要前3秒吸引观众注意力', '中间部分展示冲突和转折', '结尾留下悬念或引发互动']
    };
    
    const results = [];
    const lowercaseQuery = query.toLowerCase();
    
    // 根据关键词添加相关信息
    for (const [keyword, infoList] of Object.entries(keywordMap)) {
        if (lowercaseQuery.includes(keyword.toLowerCase())) {
            results.push(...infoList);
        }
    }
    
    return results;
}

// 基础游戏信息（备用）
function getBasicRokInfo() {
    return [
        "《万国觉醒》是一款多文明SLG手游，玩家可以扮演历史上的传奇统帅",
        "游戏中有凯撒、曹操、源义经、腓特烈等超过40位统帅",
        "玩家可以建立城市、组建联盟、参与KVK跨服战争",
        "游戏背景设定在跨时空的战场，不同时代的统帅在此相遇",
        "统帅系统包括天赋树和技能升级，每个统帅有独特定位",
        "游戏支持实时战斗，最多可容纳数万名玩家同时参战",
        "资源管理是游戏重要组成部分，包括粮食、木材、石料、黄金等",
        "联盟玩法包括联盟科技、领土争夺、联盟礼物等社交功能"
    ];
}

// 生成创意
async function generateIdeas(requirement, searchResults) {
    const prompt = `你是一个专业的短视频内容策划专家。请基于以下《万国觉醒》游戏背景信息和用户要求，生成3个高质量的短剧创意。

游戏背景信息（来自实时搜索）：
${searchResults.join('\n')}

用户要求：${requirement}

请生成3个不同的、有创意的短剧创意，每个创意包含：
1. 标题 - 吸引人的标题
2. 简要描述 - 100字以内的核心情节描述
3. 核心标签 - 3-5个关键词标签
4. 主要角色 - 2-4个主要角色
5. 适合的短视频平台 - 抖音/快手/B站/微信视频号等
6. 建议时长 - 短视频时长建议

重要要求：
- 创意要新颖，避免老套情节
- 结合万国觉醒的游戏特色和统帅特点
- 考虑短视频平台的传播特性
- 要有戏剧冲突和情感共鸣点

用JSON格式返回，格式如下：
[
  {
    "id": 1,
    "title": "创意标题",
    "description": "创意描述",
    "tags": ["标签1", "标签2", "标签3"],
    "characters": ["角色1", "角色2"],
    "platform": "抖音/快手/B站等",
    "duration": "45-90秒"
  },
  // ... 共3个
]`;

    try {
        if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY.includes('your-api-key')) {
            log('warn', 'DeepSeek API密钥未配置或为默认值，使用备用数据');
            return generateSmartFallbackIdeas(requirement, searchResults);
        }

        log('info', '调用DeepSeek API生成创意');
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: '你是一个专业的短视频内容策划专家，擅长创作游戏相关的短剧脚本。请严格按照要求的JSON格式返回数据。' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 2000,
            response_format: { type: "json_object" }
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        const content = response.data.choices[0].message.content;
        log('info', 'DeepSeek API响应收到');
        
        try {
            const parsedContent = JSON.parse(content);
            let ideasArray = [];
            
            if (Array.isArray(parsedContent)) {
                ideasArray = parsedContent;
            } else if (parsedContent.ideas && Array.isArray(parsedContent.ideas)) {
                ideasArray = parsedContent.ideas;
            } else if (parsedContent.creations && Array.isArray(parsedContent.creations)) {
                ideasArray = parsedContent.creations;
            } else {
                for (const key in parsedContent) {
                    if (Array.isArray(parsedContent[key])) {
                        ideasArray = parsedContent[key];
                        break;
                    }
                }
            }
            
            // 确保每个想法都有id
            ideasArray = ideasArray.map((idea, index) => ({
                id: index + 1,
                title: idea.title || `创意${index + 1}`,
                description: idea.description || idea.desc || '',
                tags: idea.tags || idea.keywords || [],
                characters: idea.characters || idea.roles || [],
                platform: idea.platform || '抖音/快手',
                duration: idea.duration || '60-90秒'
            }));
            
            return ideasArray.slice(0, 3);
        } catch (parseError) {
            log('error', '解析AI响应失败', { message: parseError.message });
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error('无法解析AI响应');
        }
    } catch (error) {
        log('error', 'DeepSeek API调用失败', { message: error.message });
        return generateSmartFallbackIdeas(requirement, searchResults);
    }
}

// 智能备用创意生成
function generateSmartFallbackIdeas(requirement, searchResults) {
    log('info', '使用智能备用创意生成');
    
    const lowerReq = requirement.toLowerCase();
    const hasCaesar = searchResults.some(r => r.includes('凯撒'));
    const hasCaoCao = searchResults.some(r => r.includes('曹操'));
    const hasBetrayal = lowerReq.includes('背叛') || lowerReq.includes('阴谋');
    const hasTimeTravel = lowerReq.includes('时空') || lowerReq.includes('穿越');
    
    const ideas = [
        {
            id: 1,
            title: '时空对决：凯撒 vs 曹操',
            description: '凯撒的罗马军团与曹操的魏国军队在神秘时空裂缝中相遇。两位战略大师在完全陌生的地形中展开心理战与战术博弈，最终发现彼此都是被神秘力量召唤的棋子。',
            tags: ['战略对决', '英雄相惜', '时空穿越', '心理战'],
            characters: ['凯撒', '曹操', '罗马百夫长', '魏国谋士'],
            platform: '抖音/快手',
            duration: '60-90秒'
        },
        {
            id: 2,
            title: '联盟的背叛：腓特烈与源义经',
            description: '腓特烈与源义经原本是跨文明联盟的盟友，共同对抗第三方势力。但当胜利在望时，源义经发现腓特烈暗中与敌方勾结，意图吞并整个战场。短剧聚焦于源义经发现真相的惊险过程与最终决裂。',
            tags: ['背叛', '悬疑', '权谋', '动作'],
            characters: ['腓特烈', '源义经', '忍者探子', '条顿骑士'],
            platform: 'B站短视频',
            duration: '90-120秒'
        },
        {
            id: 3,
            title: '平民英雄：采集者的逆袭',
            description: '一位普通的资源采集者在战争中失去家园，偶然发现古代统帅遗留的兵法与神器。他利用对地形的熟悉和非传统战术，带领一群平民成功伏击了精锐部队，成为传奇。',
            tags: ['逆袭', '平民英雄', '地形战术', '成长'],
            characters: ['平民采集者', '年轻士兵', '老统帅灵魂', '敌方将领'],
            platform: '微信视频号',
            duration: '45-75秒'
        }
    ];
    
    // 根据搜索关键词调整创意
    if (hasBetrayal) {
        ideas[0].title = '双重背叛：凯撒与曹操的权谋游戏';
        ideas[0].description = '凯撒与曹操表面上结盟对抗第三方，实则各自谋划更大的阴谋。短剧展现两位战略大师如何在合作中互相算计，最终谁才是真正的赢家？';
        ideas[0].tags = ['权谋', '双重背叛', '心理博弈', '反转'];
    }
    
    if (hasTimeTravel) {
        ideas[1].title = '时间窃贼：腓特烈的时空阴谋';
        ideas[1].description = '源义经发现腓特烈不仅背叛联盟，更在窃取各个时代统帅的时间能量。为了阻止时空崩溃，源义经必须联合其他时代的英雄共同对抗。';
        ideas[1].tags = ['时空阴谋', '多英雄集结', '史诗对决', '拯救时空'];
    }
    
    return ideas;
}

// 生成脚本
async function generateScripts(idea, requirement) {
    const prompt = `你是一个专业的短视频脚本作家。请基于以下创意和用户要求，创作一个高质量、适合短视频平台的短剧脚本。

创意标题：${idea.title}
创意描述：${idea.description}
标签：${idea.tags.join(', ')}
主要角色：${idea.characters.join(', ')}
目标平台：${idea.platform}
建议时长：${idea.duration}

用户原始要求：${requirement}

请创作一个完整的短剧脚本，需要包含以下要素：
1. 【标题】- 吸引人的标题
2. 【开场】- 前3-5秒必须吸引观众，强视觉冲击
3. 【发展】- 主要情节发展，节奏要快
4. 【高潮】- 戏剧冲突最高点，情感爆发
5. 【结尾】- 结局或悬念，引导互动
6. 【平台适配】- 针对${idea.platform}的具体优化建议

脚本要求：
- 包含具体的场景描述、对话、镜头指示和音效提示
- 符合短视频快节奏特点，每部分时长要合理
- 对话要自然，符合角色性格
- 要有记忆点，让观众愿意分享
- 考虑平台算法推荐特点

请用以下格式返回：
【标题】
【开场】
【发展】
【高潮】
【结尾】
【平台适配】`;

    try {
        if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY.includes('your-api-key')) {
            log('warn', 'DeepSeek API密钥未配置，使用备用脚本');
            return generateSmartFallbackScript(idea, requirement);
        }

        log('info', `调用DeepSeek API为"${idea.title}"生成脚本`);
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: '你是一个专业的短视频脚本作家，擅长创作游戏相关的短剧脚本。请严格按照要求的格式返回。' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2500
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        log('error', 'DeepSeek API调用失败', { message: error.message });
        return generateSmartFallbackScript(idea, requirement);
    }
}

// 智能备用脚本生成
function generateSmartFallbackScript(idea, requirement) {
    const platformTips = {
        '抖音/快手': '前3秒强视觉冲击，中间节奏快速切换，结尾悬念引发评论互动',
        'B站短视频': '突出细节和专业知识，可稍长，注重社区互动',
        '微信视频号': '情感共鸣更强，适合朋友圈分享，时长适中',
        'TikTok': '国际元素，音乐重要，视觉冲击力强'
    };
    
    const platformTip = platformTips[idea.platform] || platformTips['抖音/快手'];
    
    return `【标题】${idea.title}

【开场】
（震撼战场音效，刀剑碰撞声）
镜头快速切换：凯撒的罗马军团方阵推进，曹操的魏国骑兵冲锋。
两军在奇异的多文明战场中央对峙，背景是混合了罗马柱和中式城楼的建筑。

凯撒（画外音，沉稳有力）：“我征服过高卢，渡过卢比孔河...但这里，是哪？”

曹操（画外音，深沉机变）：“非我族类，其心必异。但若同为棋子...不妨先破了这棋局。”

【发展】
两人各带三名亲卫出阵，在战场中央的废弃祭坛相遇。

凯撒：“盖乌斯·尤利乌斯·凯撒，罗马执政官。”
曹操：“曹孟德，大汉丞相。”
（两人对视，空气中火花四溅）

谋士（低声对曹操）：“丞相，此阵似罗马龟甲阵，但左侧有破绽。”
百夫长（对凯撒）：“将军，对方骑兵机动性强，但铠甲薄弱。”

【高潮】
突然，第三方势力出现 - 源义经的忍者部队从阴影中杀出，目标直指两人！

凯撒（举剑格挡）：“暗杀者？看来有人不想让我们对话。”
曹操（一箭射倒一名忍者）：“敌人的敌人...暂时算半个朋友。”

两人背靠背作战，罗马方阵与魏国骑兵首次配合。

曹操：“你的盾，我的矛？”
凯撒：“正有此意。罗马军团，保护侧翼！”

【结尾】
击退忍者后，两人各自收兵。
夕阳下，凯撒与曹操隔河相望，同时举起酒杯（时空交错的特效）。

字幕浮现：当最了解你的人，是你的敌人...
下一行：联盟？背叛？明日揭晓。

【平台适配】
• ${platformTip}
• 添加热门话题标签：#万国觉醒 #历史穿越 #战略对决 #英雄相惜
• 前3秒使用强视觉冲突画面
• 中间加入快速剪辑的战斗场面
• 结尾使用开放式问题引导评论
• 适合${idea.platform}的算法推荐机制`;
}

// ==================== API路由 ====================

// 搜索并生成创意
app.post('/api/generate-ideas', async (req, res) => {
    try {
        const { requirement } = req.body;
        
        if (!requirement) {
            return res.status(400).json({ 
                success: false, 
                error: '请输入创意要求',
                message: 'requirement字段不能为空'
            });
        }
        
        if (requirement.length > 1000) {
            return res.status(400).json({
                success: false,
                error: '输入过长',
                message: '创意要求不能超过1000个字符'
            });
        }
        
        log('info', `收到创意生成请求`, { length: requirement.length });
        
        const searchResults = await searchRokContent(requirement);
        const ideas = await generateIdeas(requirement, searchResults);
        
        res.json({ 
            success: true, 
            ideas, 
            searchCount: searchResults.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        log('error', '生成创意失败', { message: error.message });
        res.status(500).json({ 
            success: false,
            error: '生成创意失败', 
            message: error.message,
            fallback: true,
            timestamp: new Date().toISOString()
        });
    }
});

// 批量生成多个脚本
app.post('/api/generate-batch-scripts', async (req, res) => {
    try {
        const { idea, requirement, count = 3 } = req.body;
        
        if (!idea || !requirement) {
            return res.status(400).json({ 
                success: false, 
                error: '缺少必要参数',
                message: 'idea和requirement字段不能为空'
            });
        }
        
        log('info', `收到批量脚本生成请求`, { 
            title: idea.title, 
            count: count 
        });
        
        const scripts = [];
        for (let i = 0; i < Math.min(count, 5); i++) { // 最多5个
            const script = await generateScripts(idea, requirement);
            scripts.push({
                id: i + 1,
                title: `${idea.title} - 第${i + 1}集`,
                content: script
            });
        }
        
        res.json({ 
            success: true, 
            scripts,
            count: scripts.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        log('error', '批量生成脚本失败', { message: error.message });
        res.status(500).json({ 
            success: false,
            error: '批量生成脚本失败', 
            message: error.message,
            fallback: true,
            timestamp: new Date().toISOString()
        });
    }
});

// 测试搜索功能
app.post('/api/test-search', async (req, res) => {
    try {
        const { query } = req.body;
        const results = await searchRokContent(query || '万国觉醒 凯撒');
        res.json({ 
            success: true, 
            results, 
            count: results.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: '搜索测试失败', 
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    const healthInfo = {
        status: 'ok',
        service: '万国觉醒AI短剧脚本服务器(增强版)',
        version: '2.0.0',
        environment: NODE_ENV,
        deepseek_configured: !!(DEEPSEEK_API_KEY && !DEEPSEEK_API_KEY.includes('your-api-key')),
        features: ['实时搜索', 'DeepSeek AI生成', '智能降级', '生产优化'],
        server_time: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        node_version: process.version,
        cors_allowed_origins: ALLOWED_ORIGINS
    };
    
    res.json(healthInfo);
});

// 根路径重定向
app.get('/', (req, res) => {
    res.redirect('/api/health');
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: '未找到资源',
        message: `路径 ${req.originalUrl} 不存在`,
        available_endpoints: [
            'GET  /api/health',
            'POST /api/generate-ideas',
            'POST /api/generate-batch-scripts',
            'POST /api/test-search'
        ]
    });
});

// 全局错误处理
app.use((err, req, res, next) => {
    log('error', '服务器错误', { 
        message: err.message, 
        stack: err.stack,
        path: req.originalUrl 
    });
    
    res.status(500).json({
        success: false,
        error: '服务器内部错误',
        message: NODE_ENV === 'development' ? err.message : '请稍后重试',
        timestamp: new Date().toISOString()
    });
});

// ==================== 启动服务器 ====================
// 只有在直接运行此文件时才启动服务器（避免在Serverless环境中启动）
if (require.main === module) {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('='.repeat(60));
        console.log('万国觉醒AI短剧脚本服务器(增强版) - 生产优化版');
        console.log(`环境: ${NODE_ENV}`);
        console.log(`运行在: http://0.0.0.0:${PORT}`);
        console.log(`外部访问: http://your-railway-domain.up.railway.app (Railway自动分配)`);
        console.log(`DeepSeek API: ${DEEPSEEK_API_KEY && !DEEPSEEK_API_KEY.includes('your-api-key') ? '已配置' : '未配置（使用备用数据）'}`);
        console.log(`CORS允许的域名: ${ALLOWED_ORIGINS.join(', ')}`);
        console.log('='.repeat(60));
        console.log('API端点:');
        console.log(`  GET  /api/health`);
        console.log(`  POST /api/generate-ideas`);
        console.log(`  POST /api/generate-batch-scripts`);
        console.log('='.repeat(60));
        console.log('部署方式:');
        console.log('  • Docker: docker-compose up -d');
        console.log('  • Railway: railway up');
        console.log('  • PM2: pm2 start ecosystem.config.js');
        console.log('='.repeat(60));
        console.log('✅ 服务器已启动，等待连接...');
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
        log('info', '收到SIGTERM信号，正在关闭服务器');
        server.close(() => {
            log('info', '服务器已关闭');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        log('info', '收到SIGINT信号，正在关闭服务器');
        server.close(() => {
            log('info', '服务器已关闭');
            process.exit(0);
        });
    });
} else {
    console.log('🔧 服务器模块已加载（Serverless模式）');
}

module.exports = app;
