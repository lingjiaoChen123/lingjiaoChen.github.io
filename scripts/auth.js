// ================================================================
// 登录注册逻辑
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    // 登录注册切换
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            if (this.dataset.tab === 'login') {
                document.getElementById('loginForm').classList.remove('hidden');
                document.getElementById('registerForm').classList.add('hidden');
            } else {
                document.getElementById('loginForm').classList.add('hidden');
                document.getElementById('registerForm').classList.remove('hidden');
            }
        });
    });

    document.getElementById('switchToRegister').addEventListener('click', () => {
        document.querySelector('.auth-tab[data-tab="register"]').click();
    });
    document.getElementById('switchToLogin').addEventListener('click', () => {
        document.querySelector('.auth-tab[data-tab="login"]').click();
    });

    // ===== 登录 =====
    document.getElementById('loginBtn').addEventListener('click', function() {
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value.trim();
        
        if (!user || !pass) {
            alert('请输入账号和密码');
            return;
        }

        // 读取用户数据
        let users = {};
        try {
            users = JSON.parse(localStorage.getItem('cat_users') || '{}');
        } catch (e) {
            users = {};
        }

        // 检查是否为管理员（硬编码，不显示在界面上）
        if (user === 'admin' && pass === 'admin123') {
            currentRole = 'admin';
            currentUser = user;
            isLoggedIn = true;
            // 确保数据加载
            loadData();
            enterApp();
            return;
        }

        // 普通用户登录
        if (users[user] && users[user] === pass) {
            currentRole = 'user';
            currentUser = user;
            isLoggedIn = true;
            loadData();
            enterApp();
            return;
        }

        // 如果用户不存在，自动注册并登录
        if (!users[user]) {
            users[user] = pass;
            localStorage.setItem('cat_users', JSON.stringify(users));
            currentRole = 'user';
            currentUser = user;
            isLoggedIn = true;
            loadData();
            enterApp();
            alert('✅ 新用户注册成功！自动登录');
            return;
        }

        alert('❌ 密码错误！');
    });

    // ===== 注册 =====
    document.getElementById('registerBtn').addEventListener('click', function() {
        const name = document.getElementById('regName').value.trim();
        const user = document.getElementById('regUser').value.trim();
        const pass = document.getElementById('regPass').value.trim();
        
        if (!name || !user || !pass) {
            alert('请完整填写注册信息');
            return;
        }

        let users = {};
        try {
            users = JSON.parse(localStorage.getItem('cat_users') || '{}');
        } catch (e) {
            users = {};
        }

        if (users[user]) {
            alert('❌ 账号已存在，请直接登录');
            return;
        }

        users[user] = pass;
        localStorage.setItem('cat_users', JSON.stringify(users));
        
        // 保存用户昵称
        let userProfiles = {};
        try {
            userProfiles = JSON.parse(localStorage.getItem('cat_profiles') || '{}');
        } catch (e) {
            userProfiles = {};
        }
        userProfiles[user] = name;
        localStorage.setItem('cat_profiles', JSON.stringify(userProfiles));

        alert('✅ 注册成功！请登录');
        document.querySelector('.auth-tab[data-tab="login"]').click();
        document.getElementById('loginUser').value = user;
        document.getElementById('loginPass').value = pass;
    });

    // ===== 退出登录 =====
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            isLoggedIn = false;
            currentUser = '';
            currentRole = 'user';
            document.getElementById('mainApp').style.display = 'none';
            document.getElementById('authPanel').style.display = 'flex';
            document.getElementById('loginPass').value = '';
            // 重置导航高亮
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelector('.nav-item[data-page="pageHome"]').classList.add('active');
        }
    });
});

// ===== 登录成功后进入应用 =====
function enterApp() {
    // 显示主应用
    document.getElementById('authPanel').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    document.getElementById('roleTag').textContent = currentRole === 'admin' ? '管理员' : '普通用户';
    
    // 确保首页显示
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById('pageHome').classList.add('active-page');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector('.nav-item[data-page="pageHome"]').classList.add('active');
    
    // 延迟执行渲染，确保所有DOM和函数已加载
    setTimeout(function() {
        // 渲染猫咪档案
        if (typeof renderCats === 'function') {
            renderCats();
        } else {
            console.warn('renderCats 未定义');
        }
        
        // 渲染互动区
        if (typeof renderVoteAndUpload === 'function') {
            renderVoteAndUpload();
        } else {
            console.warn('renderVoteAndUpload 未定义');
        }
        
        // 启动轮播
        if (typeof setupCarousel === 'function') {
            setupCarousel();
        } else {
            console.warn('setupCarousel 未定义');
        }
        
        // 更新人气猫
        if (typeof updatePopularCat === 'function') {
            updatePopularCat();
        }
    }, 100);
}

// 暴露 enterApp 给全局
window.enterApp = enterApp;
