// ================================================================
// 数据管理
// ================================================================

// 猫咪数据
let cats = [
    { id: 1, name: '小橘', gender: '♂', neutered: '已绝育', personality: '粘人', hobby: '晒太阳',
        img: 'https://placecats.com/300/200?random=2', votes: 12 },
    { id: 2, name: '奶牛', gender: '♀', neutered: '未绝育', personality: '高冷', hobby: '爬树',
        img: 'https://placecats.com/300/200?random=3', votes: 8 },
    { id: 3, name: '小黑', gender: '♂', neutered: '已绝育', personality: '胆小', hobby: '钻箱子',
        img: 'https://placecats.com/300/200?random=4', votes: 5 },
];

// 反馈数据
let feedbacks = { 1: [], 2: [], 3: [] };

// 互动区上传数据
let uploads = { 1: [], 2: [], 3: [] };

// 投票记录：{ userId: { catId: date } }
let voteRecords = {};

// 评论数据：{ catId: [ { id, user, text, time, replies: [ { user, text, time } ] } ] }
let comments = { 1: [], 2: [], 3: [] };

// 当前用户
let currentUser = '';
let currentRole = 'user';
let isLoggedIn = false;

// ================================================================
// localStorage 读写
// ================================================================
function loadData() {
    try {
        const saved = localStorage.getItem('cat_platform_data');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.uploads) uploads = data.uploads;
            if (data.voteRecords) voteRecords = data.voteRecords;
            if (data.feedbacks) feedbacks = data.feedbacks;
            if (data.cats) cats = data.cats;
            if (data.comments) comments = data.comments;
        }
    } catch (e) {
        console.warn('加载数据失败', e);
    }
}

function saveData() {
    try {
        localStorage.setItem('cat_platform_data', JSON.stringify({
            uploads,
            voteRecords,
            feedbacks,
            cats,
            comments
        }));
    } catch (e) {
        console.warn('保存数据失败', e);
    }
}

// 生成短ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

// 暴露全局
window.cats = cats;
window.feedbacks = feedbacks;
window.uploads = uploads;
window.voteRecords = voteRecords;
window.comments = comments;
window.currentUser = currentUser;
window.currentRole = currentRole;
window.isLoggedIn = isLoggedIn;
window.loadData = loadData;
window.saveData = saveData;
window.generateId = generateId;
