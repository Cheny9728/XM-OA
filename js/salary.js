// 初始化函数
function initSalary() {
    console.log('薪酬管理页面初始化');
    loadInitialData(); // 加载初始数据
    // 不再在这里设置事件监听器，改为直接使用onclick
}

// 切换标签页
function switchTab(tabId) {
    console.log('切换到标签页:', tabId);
    
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
            content.style.display = 'block';
        } else {
            content.classList.remove('active');
            content.style.display = 'none';
        }
    });

    // 加载对应数据
    if (tabId === 'performance') {
        loadPerformanceData();
    } else if (tabId === 'allowance') {
        searchAllowance();
    }
}

// 加载初始数据
function loadInitialData() {
    const now = new Date();
    
    // 设置默认月份为当前月份
    const performanceMonth = document.getElementById('performance-month');
    if (performanceMonth) {
        performanceMonth.value = now.toISOString().slice(0, 7);
    }
    
    // 设置补贴查询的默认年月
    const allowanceYear = document.getElementById('allowance-year');
    const allowanceMonth = document.getElementById('allowance-month');
    
    if (allowanceYear) {
        allowanceYear.value = now.getFullYear().toString();
    }
    if (allowanceMonth) {
        allowanceMonth.value = (now.getMonth() + 1).toString();
    }
    
    // 加载默认数据
    loadPerformanceData();
}

// 处理文件上传
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        // 这里应该调用实际的API
        console.log('上传文件:', file.name);
        alert('文件上传成功（模拟）');
    } catch (error) {
        console.error('上传文件失败:', error);
        alert('上传失败: ' + error.message);
    }
}

// 查询绩效数据
async function searchPerformance() {
    const month = document.getElementById('performance-month').value;
    if (!month) {
        alert('请选择月份');
        return;
    }
    loadPerformanceData();
}

// 加载绩效数据
async function loadPerformanceData() {
    try {
        // 模拟数据
        const data = {
            summary: {
                score: 95,
                trend: '+2.5%',
                grade: 'A',
                description: '优秀',
                rank: '5/32',
                rankTrend: '上升2名'
            },
            details: [
                {
                    project: '工作质量',
                    weight: 30,
                    score: 95,
                    evaluator: '张经理',
                    evaluateTime: '2024-03-15',
                    comment: '表现优秀'
                },
                {
                    project: '工作效率',
                    weight: 25,
                    score: 92,
                    evaluator: '李主管',
                    evaluateTime: '2024-03-15',
                    comment: '完成及时'
                }
            ]
        };
        
        updatePerformanceSummary(data.summary);
        updatePerformanceTable(data.details);
    } catch (error) {
        console.error('加载绩效数据失败:', error);
        alert('加载失败: ' + error.message);
    }
}

// 查询补贴数据
async function searchAllowance() {
    const year = document.getElementById('allowance-year').value;
    const month = document.getElementById('allowance-month').value;
    
    if (!month) {
        alert('请选择月份');
        return;
    }

    try {
        // 模拟数据
        const data = {
            summary: {
                basic: 2500,
                overtime: 800,
                special: 1200,
                total: 4500
            },
            details: [
                {
                    type: '基本补贴',
                    amount: 2500,
                    date: `${year}-${month.padStart(2, '0')}-15`,
                    description: '月度基本补贴',
                    status: 'paid'
                },
                {
                    type: '加班补贴',
                    amount: 800,
                    date: `${year}-${month.padStart(2, '0')}-15`,
                    description: '周末加班',
                    status: 'paid'
                },
                {
                    type: '特殊补贴',
                    amount: 1200,
                    date: `${year}-${month.padStart(2, '0')}-15`,
                    description: '项目奖励',
                    status: 'processing'
                }
            ]
        };
        
        updateAllowanceSummary(data.summary);
        updateAllowanceTable(data.details);
    } catch (error) {
        console.error('加载补贴数据失败:', error);
        alert('加载失败: ' + error.message);
    }
}

// 更新绩效汇总信息
function updatePerformanceSummary(summary) {
    document.querySelector('.performance-summary .score').textContent = summary.score;
    document.querySelector('.performance-summary .trend').textContent = summary.trend;
    document.querySelector('.performance-summary .grade').textContent = summary.grade;
    document.querySelector('.performance-summary .description').textContent = summary.description;
    document.querySelector('.performance-summary .rank').textContent = summary.rank;
}

// 更新绩效表格
function updatePerformanceTable(data) {
    const tbody = document.querySelector('#performance-table tbody');
    if (!tbody) {
        console.error('找不到绩效表格');
        return;
    }
    
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.project}</td>
            <td>${item.weight}%</td>
            <td>${item.score}</td>
            <td>${item.evaluator}</td>
            <td>${formatDate(item.evaluateTime)}</td>
            <td>${item.comment || '-'}</td>
        </tr>
    `).join('');
}

// 更新补贴汇总信息
function updateAllowanceSummary(summary) {
    const cards = document.querySelectorAll('.allowance-summary .summary-card');
    cards[0].querySelector('.amount').textContent = `¥${summary.basic}`;
    cards[1].querySelector('.amount').textContent = `¥${summary.overtime}`;
    cards[2].querySelector('.amount').textContent = `¥${summary.special}`;
    cards[3].querySelector('.amount').textContent = `¥${summary.total}`;
}

// 更新补贴表格
function updateAllowanceTable(data) {
    const tbody = document.querySelector('#allowance-table tbody');
    if (!tbody) {
        console.error('找不到补贴表格');
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.type}</td>
            <td>¥${item.amount.toFixed(2)}</td>
            <td>${formatDate(item.date)}</td>
            <td>${item.description}</td>
            <td><span class="tag ${getStatusClass(item.status)}">${getStatusText(item.status)}</span></td>
        </tr>
    `).join('');
}

// 辅助函数
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('zh-CN');
}

function getStatusClass(status) {
    const statusMap = {
        'pending': 'tag-warning',
        'paid': 'tag-success',
        'processing': 'tag-info'
    };
    return statusMap[status] || 'tag-default';
}

function getStatusText(status) {
    const statusMap = {
        'pending': '待发放',
        'paid': '已发放',
        'processing': '处理中'
    };
    return statusMap[status] || status;
}

// 导出初始化函数
window.initSalary = initSalary; 