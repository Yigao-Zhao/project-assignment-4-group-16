import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CartProvider } from "./context/CartContext"; // 引入 CartProvider
import ProductDashboard from "./pages/ProductDashboard";
import ProductDetail from "./pages/ProductDetail";

const App = () => {
    return (
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProductDashboard />} />
            <Route path="/ProductDetail" element={<ProductDetail />} />
          </Routes>
        </Router>
      </CartProvider>
    );
  };
  
function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5005/api/data') 
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