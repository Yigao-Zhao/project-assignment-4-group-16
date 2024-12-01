const API_BASE_URL = 'http://localhost:5005/api/order';

export const paymentOrder = async (userId, item, cardDetails) => {
    const token = localStorage.getItem('token');
   

    const response = await fetch(`${API_BASE_URL}/order/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            userId,
            item,
            cardDetails,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart.');
    }

    return await response.json();
};

// get cart
export const fetchOrder = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/order/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cart.');
    }

    const data = await response.json();
    console.log(data)
        //return cartItems 
    return data.OrderItems || [];
};