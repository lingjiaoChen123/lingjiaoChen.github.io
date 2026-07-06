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
        if (user === 'admin' && pass === '123456') {
            currentRole = 'admin';
            currentUser = user;
            isLoggedIn = true;
            enterApp();
        } else if (user && pass) {
            currentRole = 'user';
            currentUser = user;
            isLoggedIn = true;
            enterApp();
        } else {
            alert('请输入账号和密码');
        }
    });

    // 注册
    document.getElementById('registerBtn').addEventListener
