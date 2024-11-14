import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5001/api/data') 
            .then(response => {
                setData(response.data.message);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>React Frontend</h1>
            <p>Backend says: {data}</p>
        </div>
    );
}

export default App;