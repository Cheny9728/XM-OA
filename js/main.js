// 全局变量
let currentUser = null;

// 初始化函数
function init() {
    checkAuth();
    setupEventListeners();
    loadDashboard(); // 默认加载仪表板
}

// 检查用户认证
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    document.getElementById('username').textContent = userInfo.name || '用户';
}

// 设置事件监听器
function setupEventListeners() {
    // 导航链接点击事件
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            loadPage(page);
            
            // 更新活动链接样式
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // 退出按钮事件
    document.getElementById('logout').addEventListener('click', logout);
}

// 加载页面内容
async function loadPage(pageName) {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = '<div class="loading">正在加载...</div>';
    
    try {
        // 移除之前可能存在的脚本
        document.querySelectorAll(`script[src*="${pageName}.js"]`).forEach(script => script.remove());

        // 加载页面内容
        const response = await fetch(`pages/${pageName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        
        // 创建临时容器来解析 HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // 只提取主要内容（移除任何可能的导航栏和脚本标签）
        const mainContent = temp.querySelector('.personnel-content, .reports-content, .equipment-content, .salary-content');
        if (!mainContent) {
            throw new Error('无法找到页面主要内容');
        }
        
        // 更新内容
        contentContainer.innerHTML = '';
        contentContainer.appendChild(mainContent);
        
        // 加载页面特定的 JavaScript
        const script = document.createElement('script');
        script.src = `js/${pageName}.js`;
        document.body.appendChild(script);
        
        // 更新页面标题
        document.title = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - 风电场管理系统`;
        
    } catch (error) {
        console.error('加载页面失败:', error);
        contentContainer.innerHTML = `
            <div class="error">
                <h3>加载失败</h3>
                <p>${error.message}</p>
                <button onclick="loadPage('${pageName}')" class="btn btn-primary">重试</button>
            </div>
        `;
    }
}

// 加载仪表板
function loadDashboard() {
    // 实现仪表板加载逻辑
}

// 退出登录
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = 'login.html';
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', init); 