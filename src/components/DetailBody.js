import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import RightSidebar from "./products/RightSidebar";
import LeftSidebar from "./products/LeftSidebar";
import Carousel from "./products/Carousel";
import "../index.css";

const DetailBody = ({ product }) => {
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
      const response = await fetch("http://localhost:3000/cartItems");
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const cartItems = await response.json();
      if (cartItems.length === 0) return 0;
      const maxId = Math.max(...cartItems.map(item => Number(item.id)));
      return maxId;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return 0;
    }
  }

  // Lấy toàn bộ danh sách cartItems để kiểm tra
  async function getCartItems() {
    try {
      const response = await fetch("http://localhost:3000/cartItems");
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const cartItems = await response.json();
      return cartItems;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  }

  // Lấy danh sách products
  async function getProducts() {
    try {
      const response = await fetch("http://localhost:3000/products/");
      const Products = await response.json();
      const formattedProducts = Products.map(product => ({
        id: Number(product.id),
        image: product.image,
        title: product.title,
        price: product.price,
        description: product.description,
        list_anh: product.list_anh,
        category: product.category,
      }));
      return formattedProducts;
    } catch (error) {
      console.error("Lỗi khi fetch products:", error);
      return [];
    }
  }

  // Gửi dữ liệu lên server
  async function postData(data) {
    try {
      const response = await fetch("http://localhost:3000/cartItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      const result = await response.json();
      console.log("Success:", result);
      setLastCartItemId(prev => prev + 1);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Khởi tạo lastCartItemId và products khi component mount
  useEffect(() => {
    getLastCartItemId().then(id => {
      setLastCartItemId(id);
    });
    getProducts().then(fetchedProducts => {
      setProducts(fetchedProducts);
    });
  }, []);

  // Hàm thêm vào giỏ hàng với kiểm tra tồn tại
  const addToCart = async (productId, productImage, productTitle, productPrice, quantity) => {
    const cartItems = await getCartItems();

    const existProduct = cartItems.some(item => Number(item.product_id) === Number(productId));

    if (existProduct) {
      alert("Already have this item in cart");
      return;
    }
    const lastId = await getLastCartItemId();
    const newId = lastId + 1;
    const totalPrice = quantity * parseFloat(productPrice);
    const data = {
      id: newId.toString(),
      user_id: userId,
      product_id: productId,
      image: "/" + productImage,
      title: productTitle,
      price: parseFloat(productPrice),
      quantity: quantity,
      totalPrice: totalPrice,
    };
    await postData(data);
    alert("Added products to the cart");
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