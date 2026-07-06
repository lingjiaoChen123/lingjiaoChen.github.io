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

    // 登录
    document.getElementById('loginBtn').addEventListener('click', function() {
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value.trim();
        // 管理员账号（不显示在界面上）
        if (user === 'admin' && pass === 'admin123') {
            currentRole = 'admin';
            currentUser = user;
            isLoggedIn = true;
            enterApp();
        } else if (user && pass) {
            // 普通用户：检查是否已注册（模拟）
            const users = JSON.parse(localStorage.getItem('cat_users') || '{}');
            if (users[user] && users[user] === pass) {
                currentRole = 'user';
                currentUser = user;
                isLoggedIn = true;
                enterApp();
            } else if (!users[user]) {
                // 自动注册
                users[user] = pass;
                localStorage.setItem('cat_users', JSON.stringify(users));
                currentRole = 'user';
                currentUser = user;
                isLoggedIn = true;
                enterApp();
            } else {
                alert('密码错误！');
            }
        } else {
            alert('请输入账号和密码');
        }
    });

    // 注册
    document.getElementById('registerBtn').addEventListener('click', function() {
        const name = document.getElementById('regName').value.trim();
        const user = document.getElementById('regUser').value.trim();
        const pass = document.getElementById('regPass').value.trim();
        if (name && user && pass) {
            const users = JSON.parse(localStorage.getItem('cat_users') || '{}');
            if (users[user]) {
                alert('账号已存在，请直接登录');
                return;
            }
            users[user] = pass;
            localStorage.setItem('cat_users', JSON.stringify(users));
            alert('注册成功！请登录');
            document.querySelector('.auth-tab[data-tab="login"]').click();
            document.getElementById('loginUser').value = user;
            document.getElementById('loginPass').value = pass;
        } else {
            alert('请完整填写注册信息');
        }
    });

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('确定要退出登录吗？')) {
            isLoggedIn = false;
            currentUser = '';
            currentRole = 'user';
            document.getElementById('mainApp').style.display = 'none';
            document.getElementById('authPanel').style.display = 'flex';
            // 清空密码框
            document.getElementById('loginPass').value = '';
        }
    });
});

// 登录成功后调用
function enterApp() {
    loadData();
    document.getElementById('authPanel').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    document.getElementById('roleTag').textContent = currentRole === 'admin' ? '管理员' : '普通用户';
    // 触发各模块渲染
    if (typeof renderCats === 'function') renderCats();
    if (typeof renderVoteAndUpload === 'function') renderVoteAndUpload();
    if (typeof setupCarousel === 'function') setupCarousel();
    // 更新人气猫
    if (typeof updatePopularCat === 'function') updatePopularCat();
}
