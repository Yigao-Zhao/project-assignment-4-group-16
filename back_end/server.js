require('dotenv').config(); // Load environment variables
const express = require('express');
const db = require('./config/mysql'); // MySQL configuration
const redis = require('./config/redis'); // Redis configuration

const app = express();
const port = 5001;

// Middleware for parsing JSON
app.use(express.json());

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const userRoutes = require('./routes/userRoutes'); // 引入登录路由
app.use('/api/user', userRoutes); // 使用登录路由