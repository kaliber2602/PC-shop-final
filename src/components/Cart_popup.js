import React, { useState, useEffect, memo, useCallback } from "react";
import { Badge, Button, Table, Typography, Space, Modal, Input, message } from "antd";
import { ShoppingCartOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './Cart_popup.css';
import { storage } from '../utils/storage';

const { Title } = Typography;

const Cart_popup = ({ isLoggedIn }) => {
  const [userId, setUserId] = useState(() => {
    const storedUserId = storage.get("userId");
    return storedUserId ? parseInt(storedUserId, 10) : null;
  });
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserId = storage.get("userId");
      setUserId(storedUserId ? parseInt(storedUserId, 10) : null);
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      console.log("No userId found in storage");
      setCartItems([]);
      return;
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }
  }, [isLoggedIn]);

  const processImage = (image) => {
    return image.startsWith("/") ? image : `/${image}`;
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const fetchCartItems = useCallback(async () => {
    const currentUserId = storage.get("userId");
    if (!currentUserId) {
        setCartItems([]);
        setError("User not logged in");
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`http://localhost/PC-shop-final-main/backend/getCartItems.php?user_id=${currentUserId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cart items: ${response.statusText}`);
        }
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
}, []);

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

  useEffect(() => {
    if (!isLoggedIn || !userId) {
      setCartItems([]);
      return;
    }
    fetchCartItems();
  }, [isLoggedIn, userId, fetchCartItems]);

  useEffect(() => {
    if (!isLoggedIn || !userId) return;
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
  }, [isLoggedIn, userId]);

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
    if (!isLoggedIn || !userId) {
        message.error("Please login to checkout");
        return;
    }

    if (selectedItems.length === 0) {
        message.error("Please select items to checkout");
        return;
    }

    if (!address.trim()) {
        message.error("Please enter delivery address");
        return;
    }

    setLoading(true);

    try {
        const formattedCartItems = selectedItems.map(item => ({
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
                address: address,
                selected_item_ids: selectedItems.map(item => item.id)
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || "Checkout failed");
            } catch (e) {
                throw new Error("Server error: " + errorText);
            }
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || "Checkout failed");
        }

        return {
            success: true,
            orderId: data.order_id
        };
    } catch (error) {
        console.error("Error during checkout:", error);
        message.error(error.message || "An error occurred during checkout");
        throw error;
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

const handlePaymentConfirmation = async (orderId) => {
  if (!userId) {
    message.error("Please login to continue");
    return;
  }

  try {
    setLoading(true); // Set loading khi bắt đầu xử lý
    const response = await fetch('http://localhost/PC-shop-final-main/backend/updatePaymentStatus.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        user_id: userId,
        selected_item_ids: selectedItems.map(item => item.id)
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to process order');
    }

    // Remove purchased items from cart
    setCartItems(prevItems => 
      prevItems.filter(item => !selectedItems.find(selected => selected.id === item.id))
    );
    
    // Reset all states
    setSelectedItems([]);
    setShowPaymentModal(false);
    setPaymentInfo(null);
    setShowAddressModal(false);
    setIsOpen(false);
    setLoading(false); // Set loading về false sau khi hoàn tất

    // Navigate to orders page with userId
    navigate(`/orders/${userId}`);
    message.success('Order completed successfully!');

  } catch (error) {
    console.error('Error processing order:', error);
    message.error(error.message);
    setLoading(false); // Set loading về false khi có lỗi
  }
};

const handlePayment = async (totalAmount, orderId) => {
  try {
    setLoading(true);
    const response = await fetch('http://localhost/PC-shop-final-main/backend/create_payment.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderCode: orderId,
        amount: totalAmount,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Payment initialization failed');
    }

    // Thay vì chuyển hướng, hiển thị modal payment với thông tin QR
    setPaymentInfo(data.paymentInfo);
    setShowPaymentModal(true);
    setShowAddressModal(false);

  } catch (error) {
    console.error('Payment error:', error);
    message.error('Payment failed: ' + (error.message || 'Unknown error occurred'));
  } finally {
    setLoading(false);
  }
};

// Thêm hàm xử lý đóng modal payment
const handleClosePaymentModal = () => {
  setShowPaymentModal(false);
  setPaymentInfo(null);
  setShowAddressModal(false);
  setIsOpen(false);
  setLoading(false);
  // Không xóa items khỏi cart khi đóng modal
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
      setSelectedItems(selectedRows);
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
            {!isLoggedIn ? (
              <div className="text-center p-3">
                <p className="empty-cart">Please login to view your cart</p>
                <Button 
                  type="primary" 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/login');
                  }}
                >
                  Login
                </Button>
              </div>
            ) : loading ? (
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
          {cartItems.length > 0 && !loading && !error && userId && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>
                  {selectedItems.length > 0 
                    ? selectedItems.reduce((sum, item) => sum + (parseFloat(item.total_price)*25000 || 0), 0).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })
                    : cartItems.reduce((sum, item) => sum + (parseFloat(item.total_price)*25000 || 0), 0).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                </span>
              </div>
              <Button
                type={selectedItems.length > 0 ? "primary" : "default"} // Thay đổi type dựa trên số lượng items được chọn
                className="checkout-btn"
                onClick={() => {
                  if (!userId) {
                    alert("Please login to checkout");
                    return;
                  }
                  if (selectedItems.length === 0) {
                    alert("Please select items to checkout");
                    return;
                  }
                  setShowAddressModal(true);
                }}
                disabled={loading || cartItems.length === 0 || selectedItems.length === 0}
              >
                Checkout Selected Items ({selectedItems.length})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Address Modal */}
      <Modal
        title="Delivery Address"
        open={showAddressModal}
        onOk={async () => {
          if (!address.trim()) {
            alert("Please enter delivery address");
            return;
          }

          try {
            setLoading(true);
            const totalAmount = selectedItems.reduce(
              (sum, item) => sum + parseFloat(item.price * item.quantity),
              0
            );

            const orderResponse = await handleCheckout();
            
            if (orderResponse?.success && orderResponse?.orderId) {
              await handlePayment((totalAmount * 25000), orderResponse.orderId);
            } else {
              throw new Error('Failed to create order');
            }
          } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed: ' + error.message);
          } finally {
            setLoading(false);
          }
        }}
        onCancel={handleCancel}
        okText="Proceed to Payment"
        cancelText="Cancel"
        confirmLoading={loading}
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        className="address-modal"
        width={500}
      >
        <div style={{ marginBottom: '16px' }}>
          <p>Please enter your delivery address:</p>
          <Input.TextArea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            rows={4}
            disabled={loading}
            autoFocus
          />
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal
        title="Payment Information"
        open={showPaymentModal}
        onCancel={handleClosePaymentModal}
        footer={[
          <Button key="cancel" onClick={handleClosePaymentModal}>
            Cancel
          </Button>,
          <Button
            type="primary"
            onClick={async () => {
              try {
                setLoading(true);
                await handlePaymentConfirmation(paymentInfo.content.replace('GZO', ''));
                message.success('Order placed successfully!');
                navigate(`/orders/${userId}`);
              } catch (error) {
                message.error('Failed to process order: ' + error.message);
              }
            }}
            loading={loading}
          >
            Complete Order
          </Button>,
        ]}
        width={800}
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        className="payment-modal"
      >
        {paymentInfo && (
          <div className="payment-info">
            {/* Left column - QR Code */}
            <div className="qr-section">
              <img 
                src={paymentInfo.qrCode || '#'} 
                alt="Payment QR Code"
                style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
                className="mb-3"
                onError={(e) => {
                    console.error('Error loading QR code:', e);
                    console.log('QR URL:', paymentInfo.qrCode);
                }}
              />
              {console.log('QR URL:', paymentInfo.qrCode)}
              <p className="mb-0 text-muted">Scan QR code to pay</p>
            </div>

            {/* Right column - Payment Details */}
            <div className="payment-details">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td className="fw-bold" style={{width: "35%"}}>Bank Name:</td>
                    <td>{paymentInfo.bankName}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Account Number:</td>
                    <td>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{paymentInfo.accountNumber}</span>
                        <Button 
                          size="small" 
                          type="primary"
                          onClick={() => {
                            navigator.clipboard.writeText(paymentInfo.accountNumber);
                            alert('Copied to clipboard!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Account Name:</td>
                    <td>{paymentInfo.accountName}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Amount:</td>
                    <td className="text-danger fw-bold">
                      {paymentInfo.amount.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Content:</td>
                    <td>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{paymentInfo.content}</span>
                        <Button 
                          size="small" 
                          type="primary"
                          onClick={() => {
                            navigator.clipboard.writeText(paymentInfo.content);
                            alert('Copied to clipboard!');
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="payment-note mt-3">
                <p className="text-info">
                  <i className="fas fa-info-circle me-2"></i>
                  After completing the transfer, please click the button above to confirm
                </p>
                <p className="text-danger mb-2">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  Please make the transfer with exactly the amount and content above
                </p>
                <p className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  The order will be automatically confirmed after we receive your payment
                </p>
                {/* {console.log('QR URL after:', paymentInfo.qrCode)} */}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default memo(Cart_popup);
