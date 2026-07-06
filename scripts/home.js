// ================================================================
// 首页逻辑（轮播）
// ================================================================

const carouselImages = [
    'https://placecats.com/800/450?random=5',
    'https://placecats.com/800/450?random=6',
    'https://placecats.com/800/450?random=7'
];
let carouselInterval = null;

function setupCarousel() {
    const img = document.getElementById('carouselImg');
    if (!img) return;
    let idx = 0;
    img.src = carouselImages[0];
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        idx = (idx + 1) % carouselImages.length;
        img.src = carouselImages[idx];
    }, 3000);
}

// 页面加载时初始化轮播
document.addEventListener('DOMContentLoaded', function() {
    // 如果已经登录，轮播会在 enterApp 中启动
});
