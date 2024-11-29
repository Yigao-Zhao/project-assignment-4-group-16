import CryptoJS from "crypto-js";

const API_BASE_URL = 'http://localhost:5005/api/user';
export const login = async (email, password) => {
	
	password = CryptoJS.SHA256(password).toString();
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return data;
};