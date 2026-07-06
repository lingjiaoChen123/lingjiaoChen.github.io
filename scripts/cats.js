// ================================================================
// 猫咪档案库逻辑
// ================================================================

function renderCats() {
    const catListEl = document.getElementById('catList');
    if (!catListEl) {
        console.warn('catList 元素未找到');
        return;
    }
    
    // 使用全局 cats
    const catsData = window.cats || cats;
    
    let html = '';
    catsData.forEach(cat => {
        const feedbackList = ((window.feedbacks || feedbacks)[cat.id] || []).map(f => `<div>• ${f}</div>`).join('');
        html += `
            <div class="cat-card" data-catid="${cat.id}">
                <img src="${cat.img}" alt="${cat.name}">
                <div class="info">
                    <span class="name">${cat.name} (${cat.gender})</span>
                    <span class="tag">${cat.neutered}</span>
                </div>
                <div class="detail">性格: ${cat.personality}  · 爱好: ${cat.hobby}</div>
                <div class="actions">
                    <button class="feedback-toggle" data-id="${cat.id}">💬 反馈</button>
                    <button class="adopt-btn" data-id="${cat.id}">🏠 领养</button>
                    ${window.currentRole === 'admin' || currentRole === 'admin' ? `<span style="font-size:11px;background:#d6c4b0;padding:0 10px;border-radius:40px;">📩 ${((window.feedbacks || feedbacks)[cat.id] || []).length}条</span>` : ''}
                </div>
                <div class="feedback-box" id="feedback-${cat.id}" style="display:none;">
                    <textarea placeholder="添加关于 ${cat.name} 的反馈..." rows="2"></textarea>
                    <button class="submit-feedback" data-id="${cat.id}">提交反馈</button>
                    <div class="feedback-list">${feedbackList}</div>
                </div>
            </div>
        `;
    });
    catListEl.innerHTML = html;

    // 反馈按钮切换
    document.querySelectorAll('.feedback-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const area = document.getElementById(`feedback-${id}`);
            if (area) area.style.display = area.style.display === 'none' ? 'block' : 'none';
        });
    });

    // 提交反馈
    document.querySelectorAll('.submit-feedback').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const area = document.getElementById(`feedback-${id}`);
            const textarea = area.querySelector('textarea');
            const val = textarea.value.trim();
            if (val) {
                const fb = window.feedbacks || feedbacks;
                if (!fb[id]) fb[id] = [];
                fb[id].push(val);
                textarea.value = '';
                if (typeof window.saveData === 'function') window.saveData();
                renderCats();
                const role = window.currentRole || currentRole;
                if (role === 'admin') alert('📬 管理员收到新反馈');
            } else {
                alert('请输入反馈内容');
            }
        });
    });

    // 领养按钮
    document.querySelectorAll('.adopt-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const catsData = window.cats || cats;
            const cat = catsData.find(c => c.id === id);
            if (!cat) return;
            showAdoptModal(cat);
        });
    });
}

// 领养单模态
function showAdoptModal(cat) {
    const container = document.getElementById('adoptModalContainer');
    container.innerHTML = `
        <div class="modal-overlay" id="adoptOverlay">
            <div class="modal-box">
                <h3>📋 领养申请表 - ${cat.name}</h3>
                <input type="text" placeholder="你的姓名" id="adoptName">
                <input type="text" placeholder="联系电话" id="adoptPhone">
                <input type="text" placeholder="住址 (校区/宿舍)" id="adoptAddr">
                <textarea placeholder="领养理由..." rows="2" id="adoptReason"></textarea>
                <div class="modal-actions">
                    <button class="btn-submit" id="submitAdopt">提交申请</button>
                    <button class="btn-cancel" id="closeAdopt">取消</button>
                </div>
                <div style="margin-top:6px;font-size:12px;color:#6b5f4e;">📩 提交后管理员将收到领养信息</div>
            </div>
        </div>
    `;
    document.getElementById('submitAdopt').addEventListener('click', function() {
        const name = document.getElementById('adoptName').value.trim();
        const phone = document.getElementById('adoptPhone').value.trim();
        const addr = document.getElementById('adoptAddr').value.trim();
        const reason = document.getElementById('adoptReason').value.trim();
        if (name && phone && addr && reason) {
            alert(`✅ 领养申请已提交给管理员！ (${cat.name})`);
            container.innerHTML = '';
            const role = window.currentRole || currentRole;
            if (role === 'admin') {
                alert('📋 管理员收到新的领养申请');
            }
        } else {
            alert('请完整填写领养单');
        }
    });
    document.getElementById('closeAdopt').addEventListener('click', function() {
        container.innerHTML = '';
    });
    document.getElementById('adoptOverlay').addEventListener('click', function(e) {
        if (e.target === this) container.innerHTML = '';
    });
}

// 暴露全局
window.renderCats = renderCats;
window.showAdoptModal = showAdoptModal;
