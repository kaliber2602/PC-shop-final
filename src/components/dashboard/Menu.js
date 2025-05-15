import React from 'react';
import { FaUserCog, FaMoneyBillWave, FaBox,  FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import './Menu.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Menu = ({ onSelectOption }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        alert('Logged out');
        navigate("/");
    };

    return (
        <div className="menu-container">
            <div className='menu-header container-fluid d-flex'>
                <div className='logo-container'>
                    <img src={"/logo.png"} alt="Logo" />
                </div>
                <div className='Shop-name'>
                    <h1>GearZone</h1>
                    <h2>Admin Dashboard</h2>
                </div>
            </div>
            <div className='menu-body'>
                <ul className="menu-list">
                    <li className="menu-item" onClick={() => onSelectOption("Account Management")}>
                        <FaUserCog className="menu-icon" /> Account Management
                    </li>
                    <li className="menu-item" onClick={() => onSelectOption("Revenue Management")}>
                        <FaMoneyBillWave className="menu-icon" /> Revenue Management
                    </li>
                    <li className="menu-item" onClick={() => onSelectOption("Product List")}>
                        <FaBox className="menu-icon" /> Product List
                    </li>
                    <li className="menu-item" onClick={() => onSelectOption("Order Management")}>
                        <FaBox className="menu-icon" /> Order Management
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