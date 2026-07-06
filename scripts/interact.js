// ================================================================
// 互动区逻辑（投票 + 上传 + 评论）
// ================================================================

// ---------- 渲染投票和上传 ----------
function renderVoteAndUpload() {
    renderVotes();
    renderUploads();
    updatePopularCat();
}

// ---------- 投票 ----------
function renderVotes() {
    const voteGrid = document.getElementById('voteGrid');
    if (!voteGrid) return;
    
    const catsData = window.cats || cats;
    const today = new Date().toDateString();
    const userKey = window.currentUser || currentUser || 'anonymous';
    const voteRec = window.voteRecords || voteRecords;
    const userVotes = voteRec[userKey] || {};

    let html = '';
    const sorted = [...catsData].sort((a, b) => b.votes - a.votes);
    sorted.forEach(cat => {
        const hasVoted = userVotes[cat.id] === today;
        html += `
            <div class="vote-item">
                <img class="avatar" src="${cat.img}" alt="${cat.name}">
                <div class="info">
                    <div class="name">${cat.name}</div>
                    <div class="votes">❤️ <span>${cat.votes}</span> 票</div>
                </div>
                <button class="vote-btn ${hasVoted ? 'voted' : ''}" data-id="${cat.id}" ${hasVoted ? 'disabled' : ''}>
                    ${hasVoted ? '✅ 已投票' : '+1 投票'}
                </button>
            </div>
        `;
    });
    voteGrid.innerHTML = html;

    // 投票事件
    document.querySelectorAll('.vote-item .vote-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const catsData = window.cats || cats;
            const cat = catsData.find(c => c.id === id);
            if (!cat) return;

            const userKey = window.currentUser || currentUser || 'anonymous';
            const today = new Date().toDateString();
            const voteRec = window.voteRecords || voteRecords;
            if (!voteRec[userKey]) voteRec[userKey] = {};
            if (voteRec[userKey][id] === today) {
                alert('你今天已经给这只猫投过票了！');
                return;
            }

            for (let key in voteRec[userKey]) {
                if (voteRec[userKey][key] === today) {
                    alert('你今天已经投过票了，每人每天只有一票！');
                    return;
                }
            }

            cat.votes += 1;
            voteRec[userKey][id] = today;
            if (typeof window.saveData === 'function') window.saveData();
            renderVoteAndUpload();
        });
    });
}

// ---------- 上传 ----------
function renderUploads() {
    const uploadSection = document.getElementById('uploadSection');
    if (!uploadSection) return;
    
    const catsData = window.cats || cats;
    const uploadsData = window.uploads || uploads;
    const commentsData = window.comments || comments;
    const currentUserVal = window.currentUser || currentUser || '匿名';
    const currentRoleVal = window.currentRole || currentRole;
    
    let html = '';
    catsData.forEach(cat => {
        const catUploads = uploadsData[cat.id] || [];
        let galleryHtml = '';
        if (catUploads.length === 0) {
            galleryHtml = `<div class="empty-gallery">暂无上传内容，快来分享吧！</div>`;
        } else {
            catUploads.forEach((item, index) => {
                const tag = item.type === 'image' ? '📷 照片' : '✏️ 手绘';
                galleryHtml += `
                    <div class="media-item">
                        <img src="${item.data}" alt="${item.name}">
                        <span class="tag">${tag}</span>
                        ${currentUserVal === item.user || currentRoleVal === 'admin' ? `<button class="delete-btn" data-catid="${cat.id}" data-index="${index}">×</button>` : ''}
                    </div>
                `;
            });
        }

        // 评论
        const catComments = commentsData[cat.id] || [];
        let commentHtml = '';
        if (catComments.length === 0) {
            commentHtml = `<div class="comment-empty">还没有评论，来说点什么吧~</div>`;
        } else {
            catComments.forEach(comment => {
                const repliesHtml = (comment.replies || []).map(reply => `
                    <div class="reply-item">
                        <div class="reply-meta">
                            <span class="reply-user">${reply.user}</span>
                            <span class="reply-time">${reply.time}</span>
                        </div>
                        <div class="reply-text">${reply.text}</div>
                    </div>
                `).join('');
                commentHtml += `
                    <div class="comment-item" id="comment-${comment.id}">
                        <div class="comment-meta">
                            <span class="comment-user">${comment.user}</span>
                            <span class="comment-time">${comment.time}</span>
                            <button class="reply-btn" data-commentid="${comment.id}" data-catid="${cat.id}">回复</button>
                        </div>
                        <div class="comment-text">${comment.text}</div>
                        ${repliesHtml ? `<div class="replies">${repliesHtml}</div>` : ''}
                    </div>
                `;
            });
        }

        html += `
            <div class="upload-card">
                <div class="cat-header">
                    <img class="avatar" src="${cat.img}" alt="${cat.name}">
                    <span class="name">${cat.name}</span>
                </div>
                <div class="upload-area">
                    <label for="upload-image-${cat.id}">📷 上传照片</label>
                    <input type="file" id="upload-image-${cat.id}" accept="image/*" data-catid="${cat.id}" data-type="image">
                    <label for="upload-drawing-${cat.id}">✏️ 上传手绘</label>
                    <input type="file" id="upload-drawing-${cat.id}" accept="image/*" data-catid="${cat.id}" data-type="drawing">
                    <span style="font-size:12px;color:#999;align-self:center;">支持 jpg/png</span>
                </div>
                <div class="gallery" id="gallery-${cat.id}">
                    ${galleryHtml}
                </div>
                <!-- 评论区域 -->
                <div class="comment-section">
                    <div class="comment-input-row">
                        <textarea placeholder="说点什么..." id="comment-input-${cat.id}" rows="1"></textarea>
                        <button class="send-btn" data-catid="${cat.id}">发送</button>
                    </div>
                    <div class="comment-list" id="comment-list-${cat.id}">
                        ${commentHtml}
                    </div>
                </div>
            </div>
        `;
    });
    uploadSection.innerHTML = html;

    // 文件上传事件
    document.querySelectorAll('.upload-area input[type="file"]').forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const catId = parseInt(this.dataset.catid);
            const type = this.dataset.type;
            const reader = new FileReader();
            reader.onload = function(ev) {
                const base64 = ev.target.result;
                const uploadsData = window.uploads || uploads;
                if (!uploadsData[catId]) uploadsData[catId] = [];
                uploadsData[catId].push({
                    type: type,
                    data: base64,
                    name: file.name,
                    user: window.currentUser || currentUser || '匿名',
                    time: new Date().toLocaleString()
                });
                if (typeof window.saveData === 'function') window.saveData();
                renderUploads();
                document.getElementById(`upload-${type}-${catId}`).value = '';
            };
            reader.readAsDataURL(file);
        });
    });

    // 删除上传
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const catId = parseInt(this.dataset.catid);
            const index = parseInt(this.dataset.index);
            if (confirm('确定要删除这条内容吗？')) {
                const uploadsData = window.uploads || uploads;
                if (uploadsData[catId] && uploadsData[catId].length > index) {
                    uploadsData[catId].splice(index, 1);
                    if (typeof window.saveData === 'function') window.saveData();
                    renderUploads();
                }
            }
        });
    });

    // 发送评论
    document.querySelectorAll('.send-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const catId = parseInt(this.dataset.catid);
            const input = document.getElementById(`comment-input-${catId}`);
            const text = input.value.trim();
            if (!text) {
                alert('请输入评论内容');
                return;
            }
            const commentsData = window.comments || comments;
            if (!commentsData[catId]) commentsData[catId] = [];
            commentsData[catId].push({
                id: typeof window.generateId === 'function' ? window.generateId() : Date.now().toString(36),
                user: window.currentUser || currentUser || '匿名',
                text: text,
                time: new Date().toLocaleString(),
                replies: []
            });
            input.value = '';
            if (typeof window.saveData === 'function') window.saveData();
            renderUploads();
            const list = document.getElementById(`comment-list-${catId}`);
            if (list) list.scrollTop = list.scrollHeight;
        });
    });

    // 回复评论
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const catId = parseInt(this.dataset.catid);
            const commentId = this.dataset.commentid;
            const replyText = prompt('输入回复内容：');
            if (replyText && replyText.trim()) {
                const commentsData = window.comments || comments;
                const catComments = commentsData[catId] || [];
                const comment = catComments.find(c => c.id === commentId);
                if (comment) {
                    if (!comment.replies) comment.replies = [];
                    comment.replies.push({
                        user: window.currentUser || currentUser || '匿名',
                        text: replyText.trim(),
                        time: new Date().toLocaleString()
                    });
                    if (typeof window.saveData === 'function') window.saveData();
                    renderUploads();
                }
            }
        });
    });

    // 评论输入框回车发送
    document.querySelectorAll('.comment-input-row textarea').forEach(textarea => {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const catId = parseInt(this.id.split('-')[2]);
                const btn = document.querySelector(`.send-btn[data-catid="${catId}"]`);
                if (btn) btn.click();
            }
        });
    });
}

// ---------- 更新人气猫 ----------
function updatePopularCat() {
    const display = document.getElementById('popularCatDisplay');
    if (!display) return;
    const catsData = window.cats || cats;
    if (catsData.length === 0) return;
    const top = catsData.reduce((a, b) => a.votes > b.votes ? a : b);
    const userKey = window.currentUser || currentUser || 'anonymous';
    const today = new Date().toDateString();
    const voteRec = window.voteRecords || voteRecords;
    const userVotes = voteRec[userKey] || {};
    let votedCount = 0;
    for (let key in userVotes) {
        if (userVotes[key] === today) votedCount++;
    }
    display.textContent = `🏆 人气猫: ${top.name} (${top.votes}票) · 今日已投: ${votedCount}/1`;
}

// 暴露全局
window.renderVoteAndUpload = renderVoteAndUpload;
window.updatePopularCat = updatePopularCat;
window.renderVotes = renderVotes;
window.renderUploads = renderUploads;
