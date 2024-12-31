// 图表实例
let vacationChart, offshoreChart, attendanceChart;

// 初始化函数
async function init() {
    initCharts();
    setupEventListeners();
    await loadData();
}

// 初始化图表
function initCharts() {
    // 初始化休假统计图表
    vacationChart = echarts.init(document.getElementById('vacationChart'));
    
    // 初始化出海状态图表
    offshoreChart = echarts.init(document.getElementById('offshoreChart'));
    
    // 初始化在场状态图表
    attendanceChart = echarts.init(document.getElementById('attendanceChart'));
}

// 设置事件监听器
function setupEventListeners() {
    window.addEventListener('resize', () => {
        vacationChart.resize();
        offshoreChart.resize();
        attendanceChart.resize();
    });

    document.getElementById('yearSelect').addEventListener('change', loadData);
    document.getElementById('exportData').addEventListener('click', exportToExcel);
}

// 加载数据
async function loadData() {
    try {
        const year = document.getElementById('yearSelect').value;
        
        // 获取休假统计数据
        const vacationStats = await API.getVacationStats(year);
        updateVacationChart(vacationStats);
        
        // 获取出海状态数据
        const offshoreStats = await API.getOffshoreStats();
        updateOffshoreChart(offshoreStats);
        
        // 更新表格数据
        updatePersonnelTable();
        
    } catch (error) {
        console.error('Error loading data:', error);
        alert('加载数据失败，请稍后重试');
    }
}

// 更新休假统计图表
function updateVacationChart(data) {
    const option = {
        title: {
            text: '年度休假统计'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: data.months
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '休假天数',
            type: 'bar',
            data: data.values
        }]
    };
    
    vacationChart.setOption(option);
}

// 更新出海状态图表
function updateOffshoreChart(data) {
    const option = {
        title: {
            text: '出海状态分布'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [{
            type: 'pie',
            radius: '60%',
            data: data.map(item => ({
                name: item.status,
                value: item.count
            }))
        }]
    };
    
    offshoreChart.setOption(option);
}

// 更新人员表格
async function updatePersonnelTable() {
    const tbody = document.querySelector('#personnelTable tbody');
    const data = await API.getPersonnelList();
    
    tbody.innerHTML = data.map(person => `
        <tr>
            <td>${person.name}</td>
            <td>${person.department}</td>
            <td>${person.vacationDays}</td>
            <td>${person.offshoreDays}</td>
            <td>${person.businessTripDays}</td>
            <td>${person.currentStatus}</td>
        </tr>
    `).join('');
}

// 导出数据到Excel
function exportToExcel() {
    // 实现导出功能
    alert('导出功能开发中...');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', init); 