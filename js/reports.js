// 当前选中的报告类型
let currentReportType = 'equipment';

// 初始化函数
function init() {
    console.log('工作汇报页面初始化');
    setupEventListeners();
    loadReports('all'); // 默认加载所有报告
}

// 设置事件监听器
function setupEvent 