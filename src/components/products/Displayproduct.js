import React, { useState, useEffect } from "react";
import Card from "./Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Pagination from "react-bootstrap/Pagination";

const Displayproduct = ({ selectedCategory, priceFilter, sortOrder, isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  
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

 

  // Filter products by category and price
  let filteredProducts = products
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter(
      (product) =>
        product.price >= priceFilter.min && product.price <= priceFilter.max
    );

  // Sort products by price
  if (sortOrder === "low-to-high") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-to-low") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const items = [];
    const range = 2;
    let startPage = Math.max(1, currentPage - range);
    let endPage = Math.min(totalPages, currentPage + range);

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          {1}
        </Pagination.Item>
      );
      if (startPage > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" />);
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div
      className="col-lg-10 col-xl-10 col-sm-12 col-md-12 mb-4 d-flex flex-column mt-3"
      style={{ backgroundColor: "white", zIndex: 10 }}
    >
      <div className="d-flex flex-column flex-grow-1">
        <div className="row flex-grow-1 mb-3">
          {currentProducts.map((product) => (
            <div
              className="col-lg-3 col-xl-3 col-md-3 col-sm-6 mb-4"
              key={product.id}
            >
              <Card product={product} isLoggedIn={isLoggedIn} />
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center mt-auto">
          <Pagination>
            <Pagination.Prev
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
            />
            {renderPaginationItems()}
            <Pagination.Next
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Displayproduct;