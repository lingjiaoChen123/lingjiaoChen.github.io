// ================================================================
// 主应用初始化
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🐾 校园流浪猫守护平台 v1.0');
    
    // 加载数据
    if (typeof window.loadData === 'function') {
        window.loadData();
    } else {
        console.warn('loadData 未定义，使用全局函数');
        if (typeof loadData === 'function') loadData();
    }

    // 导航切换
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            const pageId = this.dataset.page;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
            document.getElementById(pageId).classList.add('active-page');
            
            // 切换到互动区时刷新
            if (pageId === 'pageInteract') {
                const isLoggedIn = window.isLoggedIn || isLoggedIn;
                if (isLoggedIn && typeof window.renderVoteAndUpload === 'function') {
                    window.renderVoteAndUpload();
                }
            }
            if (pageId === 'pageCats') {
                const isLoggedIn = window.isLoggedIn || isLoggedIn;
                if (isLoggedIn && typeof window.renderCats === 'function') {
                    window.renderCats();
                }
            }
        });
    });

    // 如果已登录（刷新页面时自动恢复）
    // 由 auth.js 的 enterApp 处理
});

// 暴露函数供其他脚本调用
console.log('✅ App 初始化完成');
