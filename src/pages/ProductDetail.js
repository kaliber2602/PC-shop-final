import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import DetailBody from "../components/DetailBody"
const ProductDetail = ({ isLoggedIn, setIsLoggedIn }) => {
    const { id } = useParams();

    // DS san pham => se lay tu json-server
    // Khởi tạo state để lưu products
        const [products, setProducts] = useState([]);
    
        // Hàm fetch dữ liệu
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
                    category: product.category
                }));
                return formattedProducts;
            } catch (error) {
                console.error("Lỗi khi fetch products:", error);
                return [];
            }
        }
    
        // Sử dụng useEffect để gọi getProducts khi component mount
        useEffect(() => {
            getProducts().then(fetchedProducts => {
                setProducts(fetchedProducts); // Cập nhật state
            });
        }, []); // Mảng rỗng nghĩa là chỉ chạy một lần khi component mount
    


    const product = products.find((product) => product.id === parseInt(id));


    return (
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            {product ? (
                <DetailBody product={product} />
            ) : (
                <p>Product not found.</p>
            )}
            <Footer />
        </>
    );
}

export default ProductDetail;