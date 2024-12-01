const API_BASE_URL = 'http://localhost:5005/api/cart';

// get cart
export const fetchCart = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
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
    
        // return cartItems 
        return data.cartItems || [];
};

// add product to cart
export const addItemToCart = async (userId, cartId, productId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            userId,
            productId,
            quantity,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart.');
    }

    return await response.json();
};

// update cart quantity
export const updateCartItemQuantity = async (userId, cartId, productId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. Please log in.');
    }
	
    const response = await fetch(API_BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            userId,
            cartId,
            productId,
            quantity,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart item.');
    }

    return await response.json();
};


// delete cart product
export const removeItemFromCart = async (userId, cartId, productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            userId,
            cartId,
            productId,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item from cart.');
    }

    return await response.json();
};


