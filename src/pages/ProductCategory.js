import React from "react";
import Header from "../components/Header";
import ProductCategoryBody from "../components/products/ProductCategoryBody";
import Footer from "../components/Footer";
import '../index.css';

const ProductCategory = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <ProductCategoryBody />
      <Footer />
    </>
  );
};

export default ProductCategory;
