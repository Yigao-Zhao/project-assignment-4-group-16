const API_BASE_URL = 'http://localhost:5005/api/cart';

// 获取用户的购物车
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
    
        // 返回 cartItems 数组
        return data.cartItems || [];
};

// 添加商品到购物车
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

// 更新购物车商品数量
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


// 删除购物车中的商品
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


