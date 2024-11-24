import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserDashboard from '../pages/User/UserDashboard';
import PrivateRoute from './PrivateRoute';
import ProductList from '../pages/ProductList/ProductDashboard';
import Payment from '../pages/Payment/Payment';
import TopBar from '../assets/TopBar';
import ProductDetail from '../pages/ProductDetail/productDetail';
import Registration from '../pages/Registration/Registration';

const AppRoutes = () => (
    <Router>
        <TopBar />
        <div style={{ marginTop: '50px', padding: '16px' }}> 
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/login" element={<Login />} />
				<Route path="/productDetail" element={<ProductDetail />} />
                <Route path="/registration" element={<Registration />} />
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
                <Route
                    path="/payment"
                    element={
                        <PrivateRoute>
                            <Payment />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    </Router>
);

export default AppRoutes;