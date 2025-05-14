import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import DetailBody from "../components/DetailBody"
const ProductDetail = ({ isLoggedIn, setIsLoggedIn }) => {
    const { id } = useParams();
    // Khởi tạo state để lưu products
        const [products, setProducts] = useState([]);
    
        // Hàm fetch dữ liệu
        
          
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
    
    
    


        const product = products.find((product) => String(product.id) === id);


    return (
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            {product ? (
                <DetailBody product={product} isLoggedIn={isLoggedIn} />
            ) : (
                <p>Product not found.</p>
            )}
            <Footer />
        </>
    );
}

export default ProductDetail;