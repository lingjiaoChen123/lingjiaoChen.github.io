// ================================================================
// 主应用初始化
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    // 加载数据
    loadData();

    // 导航切换
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            const pageId = this.dataset.page;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
            document.getElementById(pageId).classList.add('active-page');
            // 切换到互动区时刷新
            if (pageId === 'pageInteract' && isLoggedIn) {
                renderVoteAndUpload();
            }
            if (pageId === 'pageCats' && isLoggedIn) {
                renderCats();
            }
        });
    });

    // 如果之前已登录（刷新页面恢复），但这里简单处理
    // 实际登录状态由 auth.js 管理
});

// 暴露全局函数供其他脚本调用
window.renderCats = renderCats;
window.renderVoteAndUpload = renderVoteAndUpload;
window.updatePopularCat = updatePopularCat;
window.setupCarousel = setupCarousel;
window.showAdoptModal = showAdoptModal;
