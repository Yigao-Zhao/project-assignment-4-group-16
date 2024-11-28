require('dotenv').config(); // Load environment variables
const express = require('express');
const db = require('./config/mysql'); // MySQL configuration
//const redis = require('./config/redis'); // Redis configuration
const cors = require('cors');
const app = express();
const path = require('path');
const port = 5005;

// Middleware for parsing JSON
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes'); 
app.use('/api/user', userRoutes); 

const productRoutes = require('./routes/productRoutes'); 
app.use('/api/product', productRoutes); 

const cartRoutes = require('./routes/cartRoutes'); 
app.use('/api/cart', cartRoutes); 

const orderRoutes = require('./routes/orderRoutes'); 
app.use('/api/order', orderRoutes); 


app.use('/images', express.static(path.join(__dirname, '..', 'front_end', 'laptop-shopping-mall', 'public', 'image')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
