// cartWorker.js
let lastCartData = null;
let userId = null;

this.onmessage = (e) => {
  if (e.data && e.data.userId) {
    userId = e.data.userId;
  }
};

const fetchCartItems = async () => {
  try {
    if (!userId) {
      throw new Error("userId is missing");
    }
    const response = await fetch(`http://localhost:3000/cartItems?user_id=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch cart items");
    const json = await response.json();
    return json;
  } catch (error) {
    return { error: error.message };
  }
};

const compareCartItems = (newData, oldData) => {
  return JSON.stringify(newData) !== JSON.stringify(oldData);
};

setInterval(async () => {
  const newCartData = await fetchCartItems();
  if (newCartData.error) {
    this.postMessage({ error: newCartData.error });
  } else if (lastCartData === null || compareCartItems(newCartData, lastCartData)) {
    lastCartData = newCartData;
    this.postMessage({ cartItems: newCartData });
  }
}, 250);