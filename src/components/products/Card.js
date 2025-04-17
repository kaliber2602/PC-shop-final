import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Rating } from "react-simple-star-rating";
import { Toast } from "bootstrap/dist/js/bootstrap.bundle.min";

const Card = ({ product }) => {
const [lastCartItemId, setLastCartItemId] = useState(0);
const userId = parseInt(localStorage.getItem("userId"), 10) || 1;

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

  // Lấy ID lớn nhất từ danh sách cartItems
  async function getLastCartItemId() {
    try {
      const response = await fetch("http://localhost:3000/cartItems");
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const cartItems = await response.json();
      if (cartItems.length === 0) return 0; // Nếu danh sách rỗng, bắt đầu từ 0
      // Tìm ID lớn nhất (chuyển id về số nếu server trả về chuỗi)
      const maxId = Math.max(...cartItems.map(item => Number(item.id)));
      return maxId;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return 0;
    }
  }

  // Khởi tạo lastCartItemId khi component mount
  useEffect(() => {
    getLastCartItemId().then(id => {
      setLastCartItemId(id);
    });
  }, []);

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
      // Cập nhật lastCartItemId dựa trên ID vừa thêm
      setLastCartItemId(prev => prev + 1);
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
      user_id: userId.toString(),
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

  const handleRating = (rate) => console.log("Rated:", rate);
  const onPointerEnter = () => console.log("Enter");
  const onPointerLeave = () => console.log("Leave");
  const onPointerMove = (value, index) => console.log(value, index);

  return (
    <div
      className="card d-flex flex-column h-100 overflow-hidden"
      style={{ height: "400px", display: "flex", flexDirection: "column" }}
    >
      <NavLink
        to={`/product-detail/${product.id}`}
        className="nav-link"
        style={{ textDecoration: "none" }}
      >
        <div
          className="img-container"
          style={{ width: "100%", height: "250px", overflow: "hidden" }}
        >
          <img
            src={product.image}
            className="card-img-top"
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          className="card-body d-flex flex-column flex-grow-1 overflow-hidden"
          style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}
        >
          <h2
            className="text-primary text-truncate"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            <b>{product.title}</b>
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#555",
              margin: "0",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            <b>Category:</b> {product.category}
          </p>
          <h2 style={{ margin: 0 }}>
            <b>${product.price}</b>
          </h2>
        </div>
      </NavLink>

      <div
        className="card-footer d-flex justify-content-between align-items-center"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "10px",
        }}
      >
        <div className="rating-container">
          <Rating
            onClick={handleRating}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onPointerMove={onPointerMove}
            size={15}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ marginLeft: "10px" }}
          onClick={() => addToCart(product.id, product.image, product.title, product.price, 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;