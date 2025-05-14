import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Rating } from "react-simple-star-rating";
import { Toast } from "bootstrap/dist/js/bootstrap.bundle.min";

const Card = ({ product, isLoggedIn }) => {
const [lastCartItemId, setLastCartItemId] = useState(0);
const userId = parseInt(localStorage.getItem("userId"), 10) || 1;

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

  // Khởi tạo lastCartItemId khi component mount
  useEffect(() => {
    if (!userId) {
      console.warn("No userId found. Skipping cart initialization.");
      return;
    }

    getLastCartItemId().then(id => {
      setLastCartItemId(id);
    });
  }, [userId]);

  // Gửi dữ liệu lên server

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