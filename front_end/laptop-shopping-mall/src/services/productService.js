const API_BASE_URL = 'http://localhost:5005/api/product';

export const fetchProducts =async()=>{
    const token = localStorage.getItem('token'); 
    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
        method:'GET',
        headers: {
            Authorization:`Bearer ${token}`,
        },
    });

    if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products.');
    }

    return await response.json(); 
};