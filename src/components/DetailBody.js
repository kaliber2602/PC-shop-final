import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import RightSidebar from "./products/RightSidebar";
import LeftSidebar from "./products/LeftSidebar";
import Carousel from "./products/Carousel";
import "../index.css";

const DetailBody = ({ product, isLoggedIn }) => {
  const userId = parseInt(localStorage.getItem("userId"), 10) || 1;
  const [products, setProducts] = useState([]);
  const images = product.list_anh || [];
  const [quantity, setQuantity] = useState(1);
  const [lastCartItemId, setLastCartItemId] = useState(0);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value < 1 ? 1 : value);
  };

  // Lấy ID lớn nhất từ danh sách cartItems
  async function getLastCartItemId() {
    try {
        const response = await fetch("http://localhost/PC-shop-final-main/backend/getLastCartItemId.php");
        if (!response.ok) throw new Error("Failed to fetch last cart item ID");
        const data = await response.json();
        return data.lastId || 0;
    } catch (error) {
        console.error("Error fetching last cart item ID:", error);
        return 0;
    }
}

  // Lấy toàn bộ danh sách cartItems để kiểm tra
  async function getCartItems() {
    if (!userId) {
      console.warn("No userId found. Returning an empty cart.");
      return []; // Nếu không có userId, trả về mảng rỗng
    }
  
    try {
      const response = await fetch(`http://localhost/PC-shop-final-main/backend/getCartItems.php?user_id=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const data = await response.json();
      return data.cartItems || [];
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  }

  // Lấy danh sách products
  async function getProducts() {
    try {
        // Lấy dữ liệu từ API PHP thay vì từ JSON
        const response = await fetch("http://localhost/PC-shop-final-main/backend/getProducts.php");
        const fetchedProducts = await response.json();
        setProducts(fetchedProducts);
    } catch (error) {
        console.error("Lỗi khi fetch products:", error);
    }
}

  useEffect(() => {
      getProducts();
  }, []);


  // Khởi tạo lastCartItemId và products khi component mount
  useEffect(() => {
    if (!userId) {
      setProducts([]); // Nếu không có userId, đặt danh sách sản phẩm thành rỗng
      return;
    }
  
    getLastCartItemId().then(id => {
      setLastCartItemId(id);
    });
  
    getProducts().then(fetchedProducts => {
      setProducts(fetchedProducts);
    });
  }, [userId]);

  // Hàm thêm vào giỏ hàng với kiểm tra tồn tại
  const addToCart = async (productId, productImage, productTitle, productPrice, quantity) => {
    if (!isLoggedIn) {
      alert("Please login to add items to your cart");
      return;
    }
  
    try {
      const cartItems = await getCartItems();
  
      const existingCartItem = cartItems.find(item => Number(item.product_id) === Number(productId));
  
      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;
        const updatedTotalPrice = parseFloat((updatedQuantity * productPrice).toFixed(2));
  
        const updateData = {
          id: existingCartItem.id,
          quantity: updatedQuantity,
          total_price: updatedTotalPrice,
        };
  
        const response = await fetch("http://localhost/PC-shop-final-main/backend/updateCartItem.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });
  
        if (!response.ok) throw new Error("Failed to update cart item");
        alert("Updated product quantity in the cart");
      } else {
        const totalPrice = parseFloat((quantity * productPrice).toFixed(2));
        const newData = {
          user_id: userId,
          product_id: productId,
          quantity: quantity,
          total_price: totalPrice,
        };
  
        const response = await fetch("http://localhost/PC-shop-final-main/backend/addToCart.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        });
  
        if (!response.ok) throw new Error("Failed to add product to cart");
        alert("Added product to the cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred while adding the product to the cart.");
    }
  };


  return (
    <section className="container-fluid">
      <div className="row">
        {/* Left Sidebar */}
        <LeftSidebar />

        <div className="item col-xl-8 col-lg-8 col-md-12 col-sm-12 p-4">
          <div className="row">
            <div className="col-md-5">
              <Carousel images={images} />
              <div className="mt-3 d-flex align-items-center">
                <span className="me-2">Chia sẻ:</span>
                <a href="https://www.messenger.com/" target="_blank" rel="noopener noreferrer">
                  <img src="/item_info/messenger_logo.webp" alt="Messenger" width="32" />
                </a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <img src="/item_info/facebook_logo.webp" alt="Facebook" width="32" />
                </a>
                <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer">
                  <img src="/item_info/pinterest_logo.jpg" alt="Pinterest" width="32" />
                </a>
              </div>
            </div>

            <div className="container col-md-7">
              <h3>{product.title}</h3>
              <p><strong>Category:</strong> {product.category}</p>
              <p>
                <span className="text-danger h1">${product.price}</span>
              </p>

              <div className="d-flex align-items-center mb-3">
                                <strong className="me-2">Quantity:</strong>
                
                                <button
                                    className="btn btn-outline-secondary px-3"
                                    onClick={decreaseQty}
                                >−</button>
                                <input
                                    type="number"
                                    value={quantity}
                                    min="1"
                                    className="form-control mx-2 text-center"
                                    style={{ width: "80px" }}
                                    onChange={handleQuantityChange}
                                />
                                <button
                                    className="btn btn-outline-secondary px-3"
                                    onClick={increaseQty}
                                >+</button>

              </div>
              <button
                className="btn btn-dark"
                onClick={() => addToCart(product.id, product.image, product.title, product.price, quantity)}
              >
                Add to cart
              </button>
            </div>

            {/* Quantity Selector */}
            
                                
                            


            <div className="content-wrapper d-flex flex-column" style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "calc(100vh - 100px)",
            }}>
              <h1 className="item-title" style={{ marginBottom: "10px" }}>About this item</h1>
              <h2 className="item-subtitle" style={{ marginBottom: "10px" }}>PRODUCT DESCRIPTION</h2>
              <pre className="item-description" style={{
                flexGrow: 1,
                maxHeight: "400px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}>
                {product.description}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </section>
  );
};

export default DetailBody;