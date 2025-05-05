import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const OrderList = ({ isLoggedIn, setIsLoggedIn }) => {
    const [orders, setOrders] = useState([]); // State lưu danh sách đơn hàng
    const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn để chỉnh sửa
    const [showModal, setShowModal] = useState(false); // Hiển thị modal

    useEffect(() => {
        // Fetch danh sách đơn hàng (mock data hoặc API)
        const fetchOrders = async () => {
            const mockOrders = [
                {
                    id: 1,
                    productName: "Gaming Laptop",
                    pricePerUnit: 1500,
                    quantity: 2,
                    totalPrice: 3000,
                    status: "Processing",
                    address: "123 Main St, City A",
                },
                {
                    id: 2,
                    productName: "Mechanical Keyboard",
                    pricePerUnit: 75,
                    quantity: 1,
                    totalPrice: 75,
                    status: "Shipping",
                    address: "456 Elm St, City B",
                },
                {
                    id: 3,
                    productName: "Gaming Mouse",
                    pricePerUnit: 40,
                    quantity: 3,
                    totalPrice: 120,
                    status: "Completed",
                    address: "789 Pine St, City C",
                },
            ];
            setOrders(mockOrders);
        };

        fetchOrders();
    }, []);

    const handleEditClick = (order) => {
        setSelectedOrder(order); // Chọn đơn hàng để chỉnh sửa
        setShowModal(true); // Hiển thị modal
    };

    const handleDeleteClick = (orderId) => {
        // Xóa đơn hàng khỏi danh sách
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
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
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Price per Unit</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.productName}</td>
                                    <td>${order.pricePerUnit.toFixed(2)}</td>
                                    <td>{order.quantity}</td>
                                    <td>${order.totalPrice.toFixed(2)}</td>
                                    <td>{order.status}</td>
                                    <td>{order.address}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEditClick(order)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteClick(order.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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