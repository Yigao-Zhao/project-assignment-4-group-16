/* eslint-disable */
import React, { createContext, useState, useContext,useEffect } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 是否已认证
    const [userId, setUserId] = useState(null); // 存储 userId
    const [userName, setUserName] = useState(null); // 存储 userId
	useEffect(() => {
	    var id = localStorage.getItem('id');
		id = JSON.parse(id)
	    if (id) {
	        setIsAuthenticated(true);
	        setUserId(id);
	    }
	}, []);
	
    const login = (id,userName) => {
        setIsAuthenticated(true);
        setUserId(id); // 登录时设置 userId
		localStorage.setItem('id', JSON.stringify(id));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserId(null); // 登出时清空 userId
		setUserName(null);
        localStorage.removeItem('token'); // 清除 token
        localStorage.removeItem('id'); // 清除 userId
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);