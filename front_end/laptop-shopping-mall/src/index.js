import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';


// 获取根节点
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染应用
root.render(
    <React.StrictMode>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    </React.StrictMode>
);