import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const OrderList = ({ isLoggedIn, setIsLoggedIn }) => {
    const [orders, setOrders] = useState([]); // State lưu danh sách đơn hàng
    const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn để chỉnh sửa
    const [showModal, setShowModal] = useState(false); // Hiển thị modal
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const userId = parseInt(localStorage.getItem("userId"), 10) || 1;

    // Fetch danh sách đơn hàng (mock data hoặc API)
    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost/PC-shop-final-main/backend/getOrderList.php?user_id=${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.statusText}`);
            }
            const data = await response.json();
            
            // Check if data is array
            if (!Array.isArray(data)) {
                console.error("Invalid response format:", data);
                setOrders([]);
                return;
            }
    
            // Map the data to ensure all required fields are present
            const formattedOrders = data.map(order => ({
                order_detail_id: order.order_detail_id,
                title: order.title || 'Unknown Product',
                price: parseFloat(order.price) || 0,
                quantity: parseInt(order.quantity) || 0,
                total_price: parseFloat(order.total_price) || 0,
                order_date: order.order_date || '',
                expect_date: order.expect_date || '',
                status: order.status || 'Pending',
                address: order.address || ''
            }));
    
            setOrders(formattedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        }
    }, [userId]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleEditClick = (order) => {
        setSelectedOrder(order); // Chọn đơn hàng để chỉnh sửa
        setShowModal(true); // Hiển thị modal
    };

    const handleDeleteOrder = async (orderDetailId) => {
        if (!window.confirm("Are you sure you want to delete this order detail?")) return;
    
        try {
            const response = await fetch("http://localhost/PC-shop-final-main/backend/deleteOrder.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ order_detail_id: orderDetailId }), // Gửi order_detail_id
            });
    
            const data = await response.json();
    
            if (data.success) {
                // alert("Order detail deleted successfully!");
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order.order_detail_id !== orderDetailId)
                );
            } else {
                console.error("Error:", data.error);
                alert("Failed to delete order detail: " + data.error);
            }
        } catch (error) {
            console.error("Error deleting order detail:", error);
            alert("An error occurred while deleting the order detail.");
        }
    };

    const handleSaveChanges = () => {
        // Lưu thay đổi đơn hàng
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === selectedOrder.id
                    ? {
                          ...selectedOrder,
                          totalPrice: selectedOrder.pricePerUnit * selectedOrder.quantity, // Cập nhật tổng tiền
                      }
                    : order
            )
        );
        setShowModal(false); // Đóng modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Đóng modal
    };

    const handleInputChange = (field, value) => {
        setSelectedOrder((prevOrder) => ({
            ...prevOrder,
            [field]: field === "quantity" ? Math.max(1, value) : value, // Giới hạn số lượng tối thiểu là 1
        }));
    };

    // Calculate pagination values
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Handle page changes
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate pagination range
    const getPaginationGroup = () => {
        let start = Math.max(currentPage - 2, 1);
        let end = Math.min(start + 4, totalPages);

        if (end - start < 4) {
            start = Math.max(end - 4, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <>
            {/* Header */}
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            {/* Nội dung chính */}
            <div className="container mt-4">
                <h2 className="text-center mb-4">Order List</h2>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>Product Name</th>
                                <th>Price per Unit</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Order Date</th>
                                <th>Expected Date</th>
                                <th>Status</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(currentOrders) && currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <tr key={order.order_detail_id}>
                                        <td>{order.title}</td>
                                        <td>${parseFloat(order.price).toFixed(2)}</td>
                                        <td>{order.quantity}</td>
                                        <td>${parseFloat(order.total_price).toFixed(2)}</td>
                                        <td>{order.order_date}</td>
                                        <td>{order.expect_date}</td>
                                        <td>{order.status}</td>
                                        <td>{order.address}</td>
                                        <td>
                                            <div title={order.status === 'Completed' ? "Cannot delete completed orders" : ""}>
                                                <button
                                                    className={`btn btn-sm ${order.status === 'Completed' ? 'btn-secondary' : 'btn-danger'}`}
                                                    onClick={() => handleDeleteOrder(order.order_detail_id)}
                                                    disabled={order.status === 'Completed'}
                                                    style={{
                                                        opacity: order.status === 'Completed' ? 0.65 : 1,
                                                        cursor: order.status === 'Completed' ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        {/* First Page Button */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(1)}
                            >
                                <FaAngleDoubleLeft />
                            </button>
                        </li>

                        {/* Previous Button */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage - 1)}
                            >
                                <FaAngleLeft />
                            </button>
                        </li>

                        {/* Page Numbers */}
                        {getPaginationGroup().map(pageNumber => (
                            <li 
                                key={pageNumber}
                                className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => paginate(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            </li>
                        ))}

                        {/* Next Button */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                            >
                                <FaAngleRight />
                            </button>
                        </li>

                        {/* Last Page Button */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(totalPages)}
                            >
                                <FaAngleDoubleRight />
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Modal for editing order */}
                {showModal && selectedOrder && (
                    <div
                        className="modal show d-block"
                        tabIndex="-1"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "100vw",
                            height: "auto",
                            zIndex: 1050,
                        }}
                    >
                        <div className="modal-dialog" style={{ maxWidth: "500px", width: "100%" }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Order</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={selectedOrder.quantity}
                                                min="1" 
                                                onChange={(e) =>
                                                    handleInputChange("quantity", Number(e.target.value))
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedOrder.address}
                                                onChange={(e) =>
                                                    handleInputChange("address", e.target.value)
                                                }
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSaveChanges}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default OrderList;