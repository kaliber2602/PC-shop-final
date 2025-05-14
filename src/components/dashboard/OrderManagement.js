import React, { useState, useEffect } from "react";
import { message } from "antd";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    // Add new states for search
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('customer'); // 'customer' or 'product'

    // Add pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10; // Same as ProductList

    // Fetch orders from database
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost/PC-shop-final-main/backend/getAllOrders.php');
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch orders');
            }
                
            const formattedOrders = data.orders.map(order => ({
                id: order.order_id,
                order_detail_id: order.order_detail_id,
                productName: order.title,
                quantity: parseInt(order.quantity),
                totalPrice: parseFloat(order.total_price),
                buyerId: order.user_id,
                buyerName: `${order.first_name} ${order.last_name}`,
                address: order.address,
                status: order.status,
                orderDate: order.order_date,
                expectDate: order.expect_date
            }));

            setOrders(formattedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Failed to load orders');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update order status
    const handleStatusChange = async (orderId, newStatus) => {
        const isConfirmed = window.confirm(`Are you sure you want to change the order status to ${newStatus}?`);
        
        if (!isConfirmed) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost/PC-shop-final-main/backend/updateOrderStatus.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    status: newStatus
                })
            });

            const data = await response.json();
            if (data.success) {
                message.success('Order status updated successfully');
                await fetchOrders(); // Refresh orders list
            } else {
                throw new Error(data.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Failed to update order status');
        } finally {
            setLoading(false);
        }
    };

    // Delete order
    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await fetch('http://localhost/PC-shop-final-main/backend/deleteOrder.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id: orderId })
            });

            const data = await response.json();
            if (data.success) {
                message.success('Order deleted successfully');
                fetchOrders(); // Refresh orders list
            } else {
                throw new Error(data.error || 'Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            message.error('Failed to delete order');
        }
    };

    // Filtered orders based on search query and search type
    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        if (!searchTerm) return true; // Show all orders when no search term

        if (searchBy === 'customer') {
            return order.buyerName.toLowerCase().includes(searchLower);
        } else {
            return order.productName.toLowerCase().includes(searchLower);
        }
    });

    // Add pagination calculation functions
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // Add pagination handler
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Add pagination range calculation
    const getPaginationRange = () => {
        const totalNodes = 5; // Number of pagination buttons to show
        const start = Math.max(1, currentPage - Math.floor(totalNodes / 2));
        const end = Math.min(totalPages, start + totalNodes - 1);

        // Adjust start if end exceeds totalPages
        const adjustedStart = Math.max(1, end - totalNodes + 1);

        return Array.from(
            { length: end - adjustedStart + 1 }, 
            (_, index) => adjustedStart + index
        );
    };

    // Update table JSX to show real data
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Order Management</h2>
            
            {/* Search Bar */}
            <div className="row mb-3">
                <div className="col-md-6 offset-md-3">
                    <div className="input-group">
                        <select 
                            className="form-select flex-grow-0"
                            style={{ maxWidth: '200px' }}
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                        >
                            <option value="customer">Search by Customer</option>
                            <option value="product">Search by Product</option>
                        </select>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`Search by ${searchBy === 'customer' ? 'customer name' : 'product name'}`}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                // Optional: Reset any pagination if you add it later
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Order Date</th>
                            <th>Expected Date</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order) => (
                                <tr key={order.order_detail_id}>
                                    <td>{order.id}</td>
                                    <td>{order.buyerName}</td>
                                    <td>{order.productName}</td>
                                    <td>{order.quantity}</td>
                                    <td>${order.totalPrice.toFixed(2)}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.expectDate}</td>
                                    <td>{order.address}</td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipping">Shipping</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteOrder(order.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    {searchTerm 
                                        ? `No orders found matching "${searchTerm}"`
                                        : 'No orders available'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Pagination */}
            {filteredOrders.length > 0 && (
                <div className="d-flex justify-content-center mt-3">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(1)}
                                    disabled={currentPage === 1}
                                >
                                    First
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>

                            {getPaginationRange().map((pageNumber) => (
                                <li
                                    key={pageNumber}
                                    className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    Last
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;