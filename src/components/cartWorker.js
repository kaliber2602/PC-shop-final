// cartWorker.js
let lastCartData = null;
let userId = null;

// Nhận userId từ message
this.onmessage = (e) => {
  if (e.data && e.data.userId) {
    userId = e.data.userId;
  }
};

// Hàm lấy danh sách sản phẩm trong giỏ hàng từ API PHP
const fetchCartItems = async () => {
  try {
    if (!userId) {
      throw new Error("userId is missing");
    }
    const response = await fetch(`http://localhost/PC-shop-final-main/backend/getCartItems.php?user_id=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch cart items");
    const json = await response.json();
    if (!Array.isArray(json.cartItems)) {
      throw new Error("Invalid cart items format");
    }
    return json.cartItems;
  } catch (error) {
    return { error: error.message };
  }
};

// So sánh dữ liệu giỏ hàng mới và cũ
const compareCartItems = (newData, oldData) => {
  return JSON.stringify(newData) !== JSON.stringify(oldData);
};

// Kiểm tra và gửi dữ liệu giỏ hàng mới mỗi 250ms
setInterval(async () => {
  const newCartData = await fetchCartItems();
  if (newCartData.error) {
    this.postMessage({ error: newCartData.error });
  } else if (lastCartData === null || compareCartItems(newCartData, lastCartData)) {
    lastCartData = newCartData;
    this.postMessage({ cartItems: newCartData });
  }
}, 250);