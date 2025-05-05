import React, { useState } from "react";

const OrderManagement = () => {
    // Mock data for orders
    const [orders, setOrders] = useState([
        {
            id: 1,
            productName: "Gaming Laptop",
            quantity: 2,
            totalPrice: 3000,
            buyerId: "U123",
            address: "123 Main St, City A",
            status: "Processing",
        },
        {
            id: 2,
            productName: "Mechanical Keyboard",
            quantity: 1,
            totalPrice: 150,
            buyerId: "U456",
            address: "456 Elm St, City B",
            status: "Shipping",
        },
        {
            id: 3,
            productName: "Gaming Mouse",
            quantity: 3,
            totalPrice: 120,
            buyerId: "U789",
            address: "789 Pine St, City C",
            status: "Completed",
        },
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null); // State for the selected order
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const handleEditClick = (order) => {
        setSelectedOrder(order); // Set the selected order
        setShowModal(true); // Show the modal
    };

    const handleSaveChanges = () => {
        // Save changes to the orders list
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === selectedOrder.id ? selectedOrder : order
            )
        );
        setShowModal(false); // Close modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close modal
    };

    const handleInputChange = (field, value) => {
        setSelectedOrder((prevOrder) => {
            const updatedOrder = { ...prevOrder, [field]: value };

            // Giới hạn số lượng thấp nhất là 1
            if (field === "quantity") {
                const pricePerUnit = prevOrder.totalPrice / prevOrder.quantity;
                updatedOrder.quantity = Math.max(1, value); // Đảm bảo số lượng không nhỏ hơn 1
                updatedOrder.totalPrice = pricePerUnit * updatedOrder.quantity;
            }

            return updatedOrder;
        });
    };

    const handleDeleteOrder = (orderId) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Order Management</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Price per Unit</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Buyer ID</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.productName}</td>
                                <td>${(order.totalPrice / order.quantity).toFixed(2)}</td>
                                <td>{order.quantity}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>{order.buyerId}</td>
                                <td>{order.address}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={order.status}
                                        onChange={(e) =>
                                            setOrders((prevOrders) =>
                                                prevOrders.map((o) =>
                                                    o.id === order.id
                                                        ? { ...o, status: e.target.value }
                                                        : o
                                                )
                                            )
                                        }
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipping">Shipping</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEditClick(order)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteOrder(order.id)}
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
            {selectedOrder && showModal && (
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
                                    onClick={handleCloseModal} // Đóng modal khi nhấn nút X
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedOrder.productName}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={selectedOrder.quantity}
                                            min="1"
                                            onChange={(e) =>
                                                handleInputChange("quantity", Math.max(1, Number(e.target.value)))
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
                                    <div className="mb-3">
                                        <label className="form-label">Total Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={selectedOrder.totalPrice.toFixed(2)}
                                            disabled
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
    );
};

export default OrderManagement;