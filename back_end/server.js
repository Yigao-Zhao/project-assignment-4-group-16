require('dotenv').config(); // Load environment variables
const express = require('express');
const db = require('./config/mysql'); // MySQL configuration
//const redis = require('./config/redis'); // Redis configuration
const cors = require('cors');
const app = express();
const port = 5001;

// Middleware for parsing JSON
app.use(express.json());
app.use(cors());
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const userRoutes = require('./routes/userRoutes'); 
app.use('/api/user', userRoutes); 