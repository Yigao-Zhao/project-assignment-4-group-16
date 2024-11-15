import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';


ReactDOM.render(
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>,
    document.getElementById('root')
);