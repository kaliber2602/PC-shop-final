import React from 'react';
import { FaUserCog, FaMoneyBillWave, FaBox, FaCog, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import './Menu.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Menu = () => {
    const navigate = useNavigate()
    const handleLogout = () => {
        // Logic thoát, ví dụ: xóa thông tin người dùng, chuyển hướng đến trang login, v.v.
        alert('Logged out');
        navigate("/")
    };

    return (
        <div className="menu-container">
            <div className='menu-header container-fluid d-flex'>
                <div className='logo-container'>
                    <img src={"/logo.png"} alt="Logo" />
                </div>
                <div className='Shop-name'>
                    <h1>Decor Dream</h1>
                    <h2>Admin Dashboard</h2>
                </div>
            </div>
            <div className='menu-body'>
                <ul className="menu-list">
                    <li className="menu-item">
                        <FaUserCog className="menu-icon" /> Account Management
                    </li>
                    <li className="menu-item">
                        <FaMoneyBillWave className="menu-icon" /> Revenue Management
                    </li>
                    <li className="menu-item">
                        <FaBox className="menu-icon" /> Product List
                    </li>
                    {/* Bo xung them chuc lang */}
                    <li className="menu-item">
                        <FaBox className="menu-icon" /> Order Management
                    </li>
                    
                    <li className="menu-item">
                        <FaUserAlt className="menu-icon" /> User Profile
                    </li>
                    <li className="menu-item">
                        <FaCog className="menu-icon" /> Settings
                    </li>
                </ul>
            </div>
            <div className='menu-footer'>
                <button onClick={handleLogout} className="btn-logout">
                    <FaSignOutAlt className="menu-icon" /> Log Out
                </button>
            </div>
        </div>
    );
};

export default Menu;
