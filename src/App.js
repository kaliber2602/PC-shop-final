import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/Login&register/Login";
import Reset from "./components/Login&register/Reset";
import Register from "./components/Login&register/Register";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import CartPopup from "./components/Cart_popup.js";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Dashboard from "./components/dashboard/Dashboard.js";
import OrderList from "./components/OrderList"; // Import OrderList
import { storage } from './utils/storage';
import { message } from 'antd';

const AppRoutes = ({ isLoggedIn, setIsLoggedIn, handleLoginSuccess }) => {
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (location.state?.showWelcome) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      {showWelcome && alert("👋 Welcome back!")}

      <Routes>
        <Route
          path="/"
          element={
            <Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/about"
          element={
            <About isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/contact"
          element={
            <Contact isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/product-category"
          element={
            <ProductCategory
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/reset" element={<Reset />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/product-detail/:id"
          element={
            <ProductDetail
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/orders/:customerId"
          element={
            <OrderList
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn} // Truyền thêm setIsLoggedIn
            />
          }
        />
      </Routes>
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const userId = storage.get("userId");
        setIsLoggedIn(!!userId);
      } catch (error) {
        console.warn("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  useEffect(() => {
    // Check for payment status in URL
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    
    if (status === 'success') {
      message.success('Payment successful!');
      // Clear status from URL
      window.history.replaceState({}, '', '/orders');
    } else if (status === 'cancelled') {
      message.info('Payment was cancelled');
      // Clear status from URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <ScrollToTopButton />
      <ScrollToTop />
      <AppRoutes
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        handleLoginSuccess={handleLoginSuccess}
      />
      <CartPopup isLoggedIn={isLoggedIn} />
    </Router>
  );
}

export default App;