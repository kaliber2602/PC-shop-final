import React, { useState, useEffect, memo, useCallback } from "react";
import { Badge, Button, Table, Typography, Space } from "antd";
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './Cart_popup.css';

const { Title } = Typography;

const Cart_popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = parseInt(localStorage.getItem("userId"), 10) || 1;

  const processImage = (image) => {
    return image.startsWith("/") ? image : `/${image}`;
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/cartItems?user_id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const json = await response.json();
      if (!Array.isArray(json)) {
        throw new Error("Expected an array of cart items");
      }
      setCartItems(json);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError(error.message);
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
      totalPrice: parseFloat((record.price * newQuantity).toFixed(2)),
    };

    try {
      const response = await fetch(`http://localhost:3000/cartItems/${record.id}`, {
        method: "PUT",
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
      totalPrice: parseFloat((record.price * newQuantity).toFixed(2)),
    };

    try {
      const response = await fetch(`http://localhost:3000/cartItems/${record.id}`, {
        method: "PUT",
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
      const response = await fetch(`http://localhost:3000/cartItems/${record.id}`, {
        method: "DELETE",
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
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      width: "10%",
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
                <span>${cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</span>
              </div>
              <Button type="primary" className="checkout-btn" style={{ backgroundColor: "#4285f4", borderColor: "#4285f4" }}>
                Checkout
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Cart_popup);