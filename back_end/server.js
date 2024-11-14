const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',     
    user: 'root',          
    password: 'root',      
    database: 'laptop_shopping'    
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL!');
});

app.get('/api/data', (req, res) => {
    connection.query('SELECT username FROM user LIMIT 1', (err, results) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }

        const message = results.length > 0 ? results[0].username : 'No data found';
        res.json({ message });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});