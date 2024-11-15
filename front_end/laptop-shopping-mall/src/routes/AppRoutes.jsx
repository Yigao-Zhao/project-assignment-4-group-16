import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserDashboard from '../pages/User/UserDashboard';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/admin"
                element={
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/user"
                element={
                    <PrivateRoute>
                        <UserDashboard />
                    </PrivateRoute>
                }
            />
        </Routes>
    </Router>
);

export default AppRoutes;