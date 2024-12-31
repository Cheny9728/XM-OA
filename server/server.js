const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// 中间件
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// 数据库连接配置
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wind_power_system'
});

// 连接数据库
db.connect((err) => {
    if (err) {
        console.error('数据库连接错误详情:', {
            code: err.code,
            errno: err.errno,
            sqlMessage: err.sqlMessage,
            sqlState: err.sqlState
        });
        return;
    }
    console.log('数据库连接成功');
});

// JWT密钥
const JWT_SECRET = 'your_jwt_secret';

// 登录接口
app.post('/api/login', async (req, res) => {
    console.log('收到登录请求');
    console.log('请求体:', req.body);
    
    const { username, password } = req.body;
    
    try {
        // 查询用户
        const [rows] = await db.promise().query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        console.log('数据库查询结果:', rows);

        if (rows.length === 0) {
            console.log('用户不存在');
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        const user = rows[0];
        
        // 打印密码信息进行调试
        console.log('输入的密码:', password);
        console.log('数据库中的密码哈希:', user.password);
        
        // 使用同步方法验证密码
        const isValidPassword = bcrypt.compareSync(password, user.password);
        console.log({
            inputPassword: password,
            hashedPassword: user.password,
            bcryptVersion: bcrypt.version,
            validationResult: isValidPassword
        });

        if (!isValidPassword) {
            console.log('密码错误');
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 生成 token
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('登录过程中发生错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        message: '服务器错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 处理未找到的路由
app.use((req, res) => {
    res.status(404).json({ message: '接口不存在' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});

// 服务器错误处理
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`端口 ${PORT} 已被占用`);
    } else {
        console.error('服务器启动错误:', error);
    }
}); 