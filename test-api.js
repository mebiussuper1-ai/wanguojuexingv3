const axios = require('axios');

async function testBatchScripts() {
    try {
        const response = await axios.post('https://wanguojuexingv3-7lnv.vercel.app/api/generate-batch-scripts', {
            idea: {
                title: '测试创意标题',
                description: '测试描述',
                platform: '抖音/快手',
                style: '史诗战争',
                targetAudience: '年轻玩家'
            },
            requirement: '万国觉醒凯撒与曹操的跨时空对决',
            count: 1
        });
        
        console.log('测试成功:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('测试失败:');
        if (error.response) {
            console.error('状态码:', error.response.status);
            console.error('响应数据:', error.response.data);
        } else {
            console.error('错误信息:', error.message);
        }
    }
}

testBatchScripts();