// API基础URL（修改为本地模拟）
const BASE_URL = 'http://localhost:3001/api';

// API请求工具类
class API {
    static async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return await response.json();
    }

    // 获取模拟数据
    static getMockData(endpoint) {
        const mockData = {
            '/salary/performance': {
                months: ['1月', '2月', '3月', '4月', '5月', '6月'],
                values: [95, 88, 92, 85, 90, 93]
            },
            '/personnel/vacation': {
                totalDays: 15,
                usedDays: 8,
                records: [
                    { startDate: '2024-01-15', endDate: '2024-01-20', days: 5, status: 'approved' },
                    { startDate: '2024-03-10', endDate: '2024-03-13', days: 3, status: 'pending' }
                ]
            },
            '/reports/list': [
                {
                    id: 1,
                    title: "1号机组月度维护报告",
                    type: "equipment",
                    author: "张工",
                    submitTime: "2024-03-15 14:30",
                    status: "pending"
                },
                {
                    id: 2,
                    title: "海上风电场巡检报告",
                    type: "offshore",
                    author: "李工",
                    submitTime: "2024-03-14 09:15",
                    status: "approved"
                }
            ],
            '/equipment/status': {
                total: 48,
                running: 42,
                maintenance: 4,
                error: 2
            }
        };

        return mockData[endpoint] || {};
    }

    // 薪酬相关API
    static async getPerformanceEvaluation(month) {
        return await this.request(`/salary/performance/${month}`);
    }

    static async getBusinessTripAllowance(userId, startDate, endDate) {
        return await this.request(`/salary/allowance/business-trip`, {
            method: 'POST',
            body: JSON.stringify({ userId, startDate, endDate })
        });
    }

    // 人员状态相关API
    static async getVacationStats(year) {
        return await this.request(`/personnel/vacation/${year}`);
    }

    static async getOffshoreStats() {
        return await this.request('/personnel/offshore-status');
    }

    // 工作汇报相关API
    static async submitWorkReport(reportData) {
        return await this.request('/reports/submit', {
            method: 'POST',
            body: JSON.stringify(reportData)
        });
    }

    // 机组状态相关API
    static async getEquipmentStatus() {
        return await this.request('/equipment/status');
    }

    static async getDefectHistory() {
        return await this.request('/equipment/defects/history');
    }

    static async getTurbineList() {
        // 模拟数据
        return [
            {
                id: "T001",
                area: "A区",
                status: "RUNNING",
                power: 1500,
                windSpeed: 6.5,
                runningTime: 3600
            },
            {
                id: "T002",
                area: "A区",
                status: "MAINTENANCE",
                power: 0,
                windSpeed: 5.8,
                runningTime: 2400
            },
            // 添加更多模拟数据...
        ];
    }

    static async getAlerts() {
        // 模拟数据
        return [
            {
                id: 1,
                level: "critical",
                title: "机组过速告警",
                turbineId: "T001",
                time: new Date().toISOString()
            },
            {
                id: 2,
                level: "warning",
                title: "温度过高预警",
                turbineId: "T003",
                time: new Date().toISOString()
            },
            // 添加更多模拟数据...
        ];
    }

    static async getRealtimeData() {
        // 生成模拟的实时发电量数据
        const now = new Date();
        const data = [];
        for (let i = 0; i < 24; i++) {
            data.push([
                new Date(now - (24-i) * 3600 * 1000),
                Math.round(1000 + Math.random() * 500)
            ]);
        }
        return data;
    }
} 