// ================================================================
// AI 助手逻辑
// ================================================================

const aiResponse = document.getElementById('aiResponse');
const aiAskBtn = document.getElementById('aiAskBtn');
const aiQuestion = document.getElementById('aiQuestion');

async function callFreeAI(question) {
    const url = 'https://api.chatanywhere.tech/v1/chat/completions';
    const headers = { 'Content-Type': 'application/json' };
    const body = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: '你是一个猫咪护理专家，回答关于猫咪的问题，语气温暖专业。' },
            { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 600
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API错误 (${response.status}): ${errText}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}

aiAskBtn.addEventListener('click', async function() {
    const question = aiQuestion.value.trim();
    if (!question) {
        aiResponse.innerHTML = '❓ 请输入你想咨询的问题。';
        return;
    }
    aiResponse.innerHTML = '⏳ 正在思考...';
    try {
        const answer = await callFreeAI(question);
        aiResponse.innerHTML = `🤖 ${answer}`;
    } catch (error) {
        console.error(error);
        aiResponse.innerHTML = `❌ 请求失败: ${error.message}`;
    }
});

// 回车发送
aiQuestion.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        aiAskBtn.click();
    }
});
