import React, { useState, useEffect } from "react";
import Card from "./Card";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Pagination from "react-bootstrap/Pagination";

const Displayproduct = ({ selectedCategory }) => {


    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    async function getProducts() {
        try {
            const response = await fetch("http://localhost:3000/products/");
            const Products = await response.json();
            const formattedProducts = Products.map(product => ({
                id: product.id,
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

    useEffect(() => {
        getProducts().then(fetchedProducts => {
            setProducts(fetchedProducts);
        });
    }, []);

    //category filter
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;

    // Calculate the cost
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calculate pages
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
            items.push(<Pagination.Item key={1} onClick={() => handlePageChange(1)}>{1}</Pagination.Item>);
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
            if (endPage < totalPages - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            items.push(<Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>);
        }

        return items;
    };

    return (
        <div className="col-lg-10 col-xl-10 col-sm-12 col-md-12 mb-4 d-flex flex-column mt-3" style={{ backgroundColor: "white", zIndex: 10 }}>

            <div className="d-flex flex-column flex-grow-1">
                <div className="row flex-grow-1 mb-3">
                    {currentProducts.map((product) => (
                        <div className="col-lg-3 col-xl-3 col-md-3 col-sm-6 mb-4" key={product.id}>
                            <Card
                                product={product}
                            />
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-center mt-auto">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        />
                        {renderPaginationItems()}
                        <Pagination.Next
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        />
                    </Pagination>
                </div>
            </div>
        </div>
    );
};

export default Displayproduct;
