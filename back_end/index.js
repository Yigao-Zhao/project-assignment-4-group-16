const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Node.js Backend!');
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'This is data from Node.js Backend.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});