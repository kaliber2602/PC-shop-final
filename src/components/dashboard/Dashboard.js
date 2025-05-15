import React, { useState } from 'react';
import Menu from "./Menu";
import AccountManagement from "./AccountManagement";
import RevenueManagement from "./RevenueManagement";
import ProductList from "./ProductList";
import OrderManagement from "./OrderManagement";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Dashboard = () => {
    const [selectedOption, setSelectedOption] = useState("Account Management");

    // Mock data for Account Management
    const accounts = [
        { id: 1, name: "Admin1", email: "admin1@example.com", role: "Admin", status: "Active" },
        { id: 2, name: "User1", email: "user1@example.com", role: "User", status: "Inactive" },
    ];

    const accountColumns = [
        { name: "Name", selector: row => row.name, sortable: true },
        { name: "Email", selector: row => row.email, sortable: true },
        { name: "Role", selector: row => row.role, sortable: true },
        { name: "Status", selector: row => row.status, sortable: true },
    ];

    // Mock data for Revenue Management
    const revenueData = [
        { month: "January", revenue: "$5000" },
        { month: "February", revenue: "$7000" },
    ];

    const revenueColumns = [
        { name: "Month", selector: row => row.month, sortable: true },
        { name: "Revenue", selector: row => row.revenue, sortable: true },
    ];

    // Function to render content based on the selected menu option
    const renderContent = () => {
        switch (selectedOption) {
            case "Account Management":
                return <AccountManagement accounts={accounts} accountColumns={accountColumns} />;
            case "Revenue Management":
                return <RevenueManagement revenueData={revenueData} revenueColumns={revenueColumns} />;
            case "Product List":
                return <ProductList />;
            case "Order Management":
                return <OrderManagement />;
            default:
                return <h2>Welcome to the Admin Dashboard</h2>;
        }
    };

    return (
        <div className="container-fluid overflow-hidden mt-3">
            <div className="row">
                {/* Menu Container */}
                <div className="col-md-4 col-lg-4 col-xl-4 col-sm-4">
                    <Menu onSelectOption={setSelectedOption} />
                </div>

                {/* Content Container */}
                <div className="col-md-8 col-lg-8 col-xl-8  col-sm-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;