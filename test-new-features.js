const axios = require('axios');
const API_BASE = 'http://localhost:3002/api';

async function testNewFeatures() {
    console.log('=== 测试新功能 ===\n');
    
    try {
        // 1. 测试健康检查
        console.log('1. 测试健康检查...');
        const health = await axios.get(`${API_BASE}/health`);
        console.log('✅ 健康检查成功:', health.data.status);
        
        // 2. 测试知识库API
        console.log('\n2. 测试知识库API...');
        
        // 2.1 获取知识文件（初始应为空）
        const knowledgeRes = await axios.get(`${API_BASE}/knowledge`);
        console.log(`✅ 获取知识文件成功: ${knowledgeRes.data.files.length} 个文件`);
        
        // 2.2 上传知识文件
        const uploadRes = await axios.post(`${API_BASE}/knowledge`, {
            filename: '万国觉醒游戏背景',
            content: `《万国觉醒》是一款多文明即时策略手游。
            
主要文明：
1. 罗马 - 统帅：凯撒，特色：步兵强化
2. 中国 - 统帅：曹操，特色：骑兵强化  
3. 日本 - 统帅：源义经，特色：机动性高
4. 德意志 - 统帅：腓特烈，特色：防御强大

游戏特色：
- 多文明选择，每个文明有独特加成
- 实时战斗，策略性强
- 联盟系统，多人合作
- 统帅系统，收集历史名将`
        });
        console.log(`✅ 上传知识文件成功: ${uploadRes.data.filename}`);
        
        // 2.3 再次获取知识文件
        const knowledgeRes2 = await axios.get(`${API_BASE}/knowledge`);
        console.log(`✅ 现在有 ${knowledgeRes2.data.files.length} 个知识文件`);
        
        // 3. 测试创意管理API
        console.log('\n3. 测试创意管理API...');
        
        // 3.1 获取保存的创意（初始应为空）
        const ideasRes = await axios.get(`${API_BASE}/ideas`);
        console.log(`✅ 获取保存的创意成功: ${ideasRes.data.ideas.length} 个创意`);
        
        // 3.2 保存创意
        const saveIdeaRes = await axios.post(`${API_BASE}/ideas`, {
            title: '凯撒与曹操的时空对决',
            description: '罗马的凯撒与三国的曹操在异时空相遇，两位战略大师展开智慧与勇气的较量。',
            tags: ['跨时空', '战略对决', '历史英雄'],
            characters: ['凯撒', '曹操', '双方谋士'],
            platform: '抖音/快手',
            style: '史诗战争',
            targetAudience: '历史爱好者、策略游戏玩家',
            duration: '60-90秒',
            content: '这是一个跨时空对决的创意，结合万国觉醒的游戏特色。'
        });
        console.log(`✅ 保存创意成功: ${saveIdeaRes.data.idea.title}`);
        
        // 3.3 再次获取创意
        const ideasRes2 = await axios.get(`${API_BASE}/ideas`);
        console.log(`✅ 现在有 ${ideasRes2.data.ideas.length} 个保存的创意`);
        
        // 4. 测试创意生成（现在应该包含知识库内容）
        console.log('\n4. 测试创意生成（包含知识库内容）...');
        const generateRes = await axios.post(`${API_BASE}/generate-ideas`, {
            requirement: '凯撒与曹操的联盟与背叛'
        });
        console.log(`✅ 生成创意成功: ${generateRes.data.ideas.length} 个创意`);
        console.log('第一个创意标题:', generateRes.data.ideas[0].title);
        
        // 5. 测试批量脚本生成
        console.log('\n5. 测试批量脚本生成...');
        const scriptRes = await axios.post(`${API_BASE}/generate-batch-scripts`, {
            idea: generateRes.data.ideas[0],
            requirement: '凯撒与曹操的联盟与背叛',
            count: 2
        });
        console.log(`✅ 批量脚本生成成功: ${scriptRes.data.scripts.length} 个脚本`);
        
        console.log('\n=== 所有测试通过 ===');
        console.log('新功能已成功集成！');
        
    } catch (error) {
        console.error('\n❌ 测试失败:');
        if (error.response) {
            console.error('状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        } else {
            console.error('错误信息:', error.message);
        }
        process.exit(1);
    }
}

// 如果服务器未运行，提示用户
testNewFeatures().catch(error => {
    console.error('测试执行失败:', error.message);
    console.log('\n请确保服务器已启动:');
    console.log('1. 停止现有服务器 (Ctrl+C)');
    console.log('2. 运行: node rok-ai-server-enhanced.js');
    console.log('3. 重新运行此测试');
});