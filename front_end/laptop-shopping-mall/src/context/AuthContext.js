/* eslint-disable */
import React, { createContext, useState, useContext,useEffect } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // check whether authentic or not
    const [userId, setUserId] = useState(null); // save userId
    const [userName, setUserName] = useState(null); // save userId
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
        setUserId(id); // set userId when log in
		localStorage.setItem('id', JSON.stringify(id));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserId(null); // remove userId when log out
		setUserName(null);
        localStorage.removeItem('token'); // delete token
        localStorage.removeItem('id'); // delete userId
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);