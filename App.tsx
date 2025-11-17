import React, { useEffect, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import type { AppContextType } from './types';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrderPage from './pages/TrackOrderPage';


const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = React.useContext(AppContext) as AppContextType;
    return isLoggedIn ? <>{children}</> : <Navigate to="/admin/login" />;
};

const AppContent: React.FC = () => {
    const { isLoading, error, fetchInitialData } = useContext(AppContext) as AppContextType;

    useEffect(() => {
        fetchInitialData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-white text-black">جاري تحميل البيانات...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen bg-white text-red-500">{error}</div>;
    }
    
    return (
         <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:productId" element={<ProductDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="track-order" element={<TrackOrderPage />} />
            <Route path="track-order/:orderId" element={<TrackOrderPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } 
          />
           <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        </Routes>
    )
}


function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}

export default App;