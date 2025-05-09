import React, { useState, useEffect, memo, useCallback } from "react";
import { Badge, Button, Table, Typography, Space, Modal, Input } from "antd";
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './Cart_popup.css';
import { storage } from '../utils/storage';

const { Title } = Typography;

const Cart_popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState('');

  const userId = parseInt(storage.get("userId"), 10) || null;

  const processImage = (image) => {
    return image.startsWith("/") ? image : `/${image}`;
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const fetchCartItems = useCallback(async () => {
    if (!userId) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost/PC-shop-final-main/backend/getCartItems.php?user_id=${userId}`);
      const json = await response.json();
      if (!Array.isArray(json.cartItems)) {
        throw new Error("Expected an array of cart items");
      }
      setCartItems(json.cartItems);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError(error.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCartItems();

    const worker = new Worker(new URL("./cartWorker.js", import.meta.url));
    worker.postMessage({ userId });
    worker.onmessage = (e) => {
      if (!e || !e.data) {
        setError("Invalid message from worker");
        return;
      }
      if (e.data.error) {
        setError(e.data.error);
      } else if (e.data.cartItems && Array.isArray(e.data.cartItems)) {
        setCartItems(e.data.cartItems);
      }
    };

    return () => worker.terminate();
  }, [fetchCartItems, userId]);

  const increaseQuantity = async (record) => {
    setLoading(true);
    setError(null);
    const newQuantity = record.quantity + 1;
    const updatedItem = {
        ...record,
        quantity: newQuantity,
        total_price: parseFloat((record.price * newQuantity).toFixed(2)),
    };

    try {
        const response = await fetch(`http://localhost/PC-shop-final-main/backend/updateCartItem.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedItem),
        });
        if (!response.ok) throw new Error("Failed to update quantity");
        setCartItems(prevItems =>
            prevItems.map(item => (item.id === record.id ? updatedItem : item))
        );
    } catch (error) {
        console.error("Error increasing quantity:", error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

const decreaseQuantity = async (record) => {
  if (record.quantity <= 1) return;
  setLoading(true);
  setError(null);
  const newQuantity = record.quantity - 1;
  const updatedItem = {
      ...record,
      quantity: newQuantity,
      total_price: parseFloat((record.price * newQuantity).toFixed(2)),
  };

  try {
      const response = await fetch(`http://localhost/PC-shop-final-main/backend/updateCartItem.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedItem),
      });
      if (!response.ok) throw new Error("Failed to update quantity");
      setCartItems(prevItems =>
          prevItems.map(item => (item.id === record.id ? updatedItem : item))
      );
  } catch (error) {
      console.error("Error decreasing quantity:", error);
      setError(error.message);
  } finally {
      setLoading(false);
  }
};

const removeItem = async (record) => {
  setLoading(true);
  setError(null);
  try {
      const response = await fetch(`http://localhost/PC-shop-final-main/backend/deleteCartItem.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: record.id }),
      });
      if (!response.ok) throw new Error("Failed to delete item");
      setCartItems(prevItems => prevItems.filter(item => item.id !== record.id));
  } catch (error) {
      console.error("Error deleting item:", error);
      setError(error.message);
  } finally {
      setLoading(false);
  }
};

const showModal = () => {
  setShowAddressModal(true);
};

const handleCancel = () => {
  setShowAddressModal(false);
  setAddress('');
};

const handleCheckout = async () => {
    if (!userId) {
        alert("Please login to checkout");
        return;
    }

    if (!cartItems.length) {
        alert("Your cart is empty");
        return;
    }

    if (!address.trim()) {
        alert("Please enter delivery address");
        return;
    }

    setLoading(true);

    try {
        const formattedCartItems = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            total_price: parseFloat((item.price * item.quantity).toFixed(2))
        }));

        const response = await fetch('http://localhost/PC-shop-final-main/backend/checkout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                cart_items: formattedCartItems,
                address: address
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert("Checkout successful!");
            setCartItems([]); // Clear cart
            setShowAddressModal(false); // Close address modal
            setIsOpen(false); // Close cart popup
            setAddress(''); // Reset address
        } else {
            throw new Error(data.error || "Checkout failed");
        }
    } catch (error) {
        console.error("Error during checkout:", error);
        alert(error.message || "An error occurred during checkout");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    return () => {
        // Cleanup when component unmounts
        setShowAddressModal(false);
        setIsOpen(false);
    };
}, []);

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          <img style={{ width: "20px" }} src={processImage(record.image)} alt={record.title} />
          {text}
        </Space>
      ),
      width: "60%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      width: "10%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "15%",
      render: (text, record) => (
        <Space>
          <Button type="text" icon={<MinusOutlined />} onClick={() => decreaseQuantity(record)} disabled={record.quantity <= 1 || loading} />
          <span>{text}</span>
          <Button type="text" icon={<PlusOutlined />} onClick={() => increaseQuantity(record)} disabled={loading} />
        </Space>
      ),
    },
    {
      title: "Total Price",
      key: "totalPrice",
      width: "10%",
      render: (_, record) => (
        <span>${(record.price * record.quantity).toFixed(2)}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "5%",
      render: (_, record) => (
        <Button type="text" icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />} onClick={() => removeItem(record)} disabled={loading} />
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
  };

  return (
    <div className="cart-container">
      <div id="cart-popup" className="cart-popup col-lg-8 col-xl-8 col-md-6 col-sm-12" onClick={toggleCart}>
        <Badge count={cartItems.length}>
          <ShoppingCartOutlined className="cart-icon" />
        </Badge>
      </div>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <Title level={5}>Shopping Cart</Title>
            <button className="close-btn" onClick={toggleCart}>×</button>
          </div>
          <div className="cart-items">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              <Table
                rowSelection={{ type: "checkbox", ...rowSelection }}
                columns={columns}
                dataSource={cartItems}
                rowKey="id"
                pagination={false}
                bordered
                scroll={{ x: 600 }}
              />
            )}
          </div>
          {cartItems.length > 0 && !loading && !error && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>
                  ${cartItems.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0).toFixed(2)}
                </span>
              </div>
              <Button
                type="primary"
                className="checkout-btn"
                style={{ backgroundColor: "#4285f4", borderColor: "#4285f4" }}
                onClick={showModal}
                disabled={loading || cartItems.length === 0}>
                Checkout
              </Button>
            </div>
          )}
        </div>
      )}

      <Modal
        title="Delivery Address"
        open={showAddressModal}
        onOk={handleCheckout}
        onCancel={handleCancel}
        okText="Confirm Checkout"
        cancelText="Cancel"
        confirmLoading={loading}
        maskClosable={false}
        destroyOnClose={true}
      >
        <div style={{ marginBottom: '16px' }}>
          <p>Please enter your delivery address:</p>
          <Input.TextArea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            rows={4}
            disabled={loading}
          />
        </div>
      </Modal>
    </div>
  );
};

export default memo(Cart_popup);
