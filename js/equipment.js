// 图表实例
let powerChart;

// 初始化函数
async function init() {
    initCharts();
    setupEventListeners();
    await loadData();
    startRealTimeUpdates();
}

// 初始化图表
function initCharts() {
    powerChart = echarts.init(document.getElementById('powerChart'));
    
    // 配置发电量图表
    const powerOption = {
        title: {
            text: '实时发电量监控'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: '发电量(kW)',
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: '发电量',
            type: 'line',
            smooth: true,
            data: [],
            areaStyle: {
                opacity: 0.1
            },
            lineStyle: {
                width: 2
            }
        }]
    };
    
    powerChart.setOption(powerOption);
}

// 设置事件监听器
function setupEventListeners() {
    // 窗口大小改变时重绘图表
    window.addEventListener('resize', () => {
        powerChart.resize();
    });

    // 筛选器事件
    document.getElementById('areaFilter').addEventListener('change', filterTurbines);
    document.getElementById('statusFilter').addEventListener('change', filterTurbines);
    document.getElementById('searchTurbine').addEventListener('input', filterTurbines);

    // 告警按钮点击事件
    document.getElementById('alarmBtn').addEventListener('click', showAlerts);
}

// 加载数据
async function loadData() {
    try {
        // 加载机组列表
        const turbines = await API.getTurbineList();
        updateTurbineList(turbines);

        // 加载告警信息
        const alerts = await API.getAlerts();
        updateAlertsList(alerts);

        // 更新实时数据
        const realtimeData = await API.getRealtimeData();
        updatePowerChart(realtimeData);
    } catch (error) {
        console.error('Error loading data:', error);
        alert('加载数据失败，请稍后重试');
    }
}

// 更新机组列表
function updateTurbineList(turbines) {
    const tbody = document.getElementById('turbineList');
    tbody.innerHTML = turbines.map(turbine => `
        <tr>
            <td>${turbine.id}</td>
            <td>${turbine.area}</td>
            <td>
                <span class="turbine-status turbine-${turbine.status.toLowerCase()}">
                    ${getStatusText(turbine.status)}
                </span>
            </td>
            <td>${turbine.power} kW</td>
            <td>${turbine.windSpeed} m/s</td>
            <td>${formatDuration(turbine.runningTime)}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="viewTurbineDetails(${turbine.id})">
                    详情
                </button>
            </td>
        </tr>
    `).join('');
}

// 更新告警列表
function updateAlertsList(alerts) {
    const container = document.querySelector('.alerts-list');
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item" onclick="viewAlertDetails(${alert.id})">
            <div class="alert-icon ${alert.level}">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-info">
                    <span>${alert.turbineId}</span>
                    <span>${formatDate(alert.time)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 更新发电量图表
function updatePowerChart(data) {
    const option = powerChart.getOption();
    option.series[0].data = data;
    powerChart.setOption(option);
}

// 开始实时更新
function startRealTimeUpdates() {
    setInterval(async () => {
        const realtimeData = await API.getRealtimeData();
        updatePowerChart(realtimeData);
    }, 5000);
}

// 查看机组详情
function viewTurbineDetails(id) {
    // 实现查看机组详情的功能
    alert('查看机组详情功能开发中...');
}

// 查看告警详情
function viewAlertDetails(id) {
    // 实现查看告警详情的功能
    alert('查看告警详情功能开发中...');
}

// 工具函数
function getStatusText(status) {
    const statusMap = {
        RUNNING: '运行中',
        MAINTENANCE: '维护中',
        ERROR: '故障'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString('zh-CN');
}

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}小时${mins}分钟`;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', init); 