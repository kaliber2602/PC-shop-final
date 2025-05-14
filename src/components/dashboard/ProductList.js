import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDropzone } from "react-dropzone";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        id: "",
        image: "",
        title: "",
        price: "",
        description: "",
        category: "",
        list_anh: [],
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20; // Số lượng sản phẩm trên mỗi trang

    // Fetch products from the backend
    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost/PC-shop-final-main/backend/getProducts.php");
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtered products based on search query
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Tính toán sản phẩm hiển thị trên trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Tổng số trang
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Hàm thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Tính toán các nút phân trang hiển thị (giới hạn 5 nút)
    const getPaginationRange = () => {
        const totalNodes = 5; // Số lượng nút phân trang hiển thị
        const start = Math.max(1, currentPage - Math.floor(totalNodes / 2));
        const end = Math.min(totalPages, start + totalNodes - 1);

        // Điều chỉnh lại start nếu end vượt quá totalPages
        const adjustedStart = Math.max(1, end - totalNodes + 1);

        return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
    };

    // Handle adding a new product
    const handleAddProduct = async () => {
        if (!newProduct.title || !newProduct.price || !newProduct.category || !newProduct.description || !newProduct.image) {
            alert("All fields are required!");
            return;
        }
        try {
            const response = await fetch("http://localhost/PC-shop-final-main/backend/addProducts.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });

            const result = await response.json();
            if (result.success) {
                alert("Product added successfully!");
                fetchProducts(); // Refresh the product list
                setNewProduct({ id: "", image: "", title: "", price: "", description: "", category: "", list_anh: [] });
            } else {
                alert("Failed to add product: " + result.error);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            alert("An error occurred while adding the product.");
        }
    };

    // Handle editing a product
    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    const handleSaveEdit = () => {
        setProducts(products.map(product => product.id === editingProduct.id ? editingProduct : product));
        setEditingProduct(null);
    };

    // Handle deleting a product
    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch("http://localhost/PC-shop-final-main/backend/deleteProduct.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id }),
                });
    
                const result = await response.json();
                if (result.success) {
                    alert("Product deleted successfully!");
                    fetchProducts(); // Làm mới danh sách sản phẩm
                } else {
                    alert("Failed to delete product: " + result.error);
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("An error occurred while deleting the product.");
            }
        }
    };

    // Handle file drop for the main image
    const onDropMainImage = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const filePath = `Products/${acceptedFiles[0].name}`;
            setNewProduct({ ...newProduct, image: filePath });
        }
    };

    // Handle file drop for additional images
    const onDropAdditionalImages = (acceptedFiles) => {
        const uploadedImages = acceptedFiles.map((file) => {
            const filePath = `Products/${file.name}`;
            return filePath;
        });
        setNewProduct({ ...newProduct, list_anh: [...newProduct.list_anh, ...uploadedImages] });
    };

    const { getRootProps: getMainImageRootProps, getInputProps: getMainImageInputProps } = useDropzone({ onDrop: onDropMainImage, maxFiles: 1 });
    const { getRootProps: getAdditionalImagesRootProps, getInputProps: getAdditionalImagesInputProps } = useDropzone({ onDrop: onDropAdditionalImages });

    return (
        <div className="col-12">
            <div className="card">
                <div className="card-header bg-primary text-white text-center">
                    <h2 className="mb-0">Product List</h2>
                </div>
                <div className="card-body">
                    {/* Move Search Bar here */}
                    <div className="row mb-4">
                        <div className="col-md-6 offset-md-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Product Name or Category"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add Product Form */}
                    <h4>Add New Product</h4>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={newProduct.title}
                                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Price"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Category"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            />
                        </div>
                        <div className="col-md-12 mt-3">
                            <textarea
                                className="form-control"
                                placeholder="Description"
                                rows="3"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="col-md-12 mt-3">
                            {/* Dropzone for Main Image */}
                            <h5>Upload Main Image</h5>
                            <div
                                {...getMainImageRootProps()}
                                className="border border-primary p-3 text-center"
                                style={{ cursor: "pointer" }}
                            >
                                <input {...getMainImageInputProps()} />
                                <p>Drag and drop the main image here, or click to select a file</p>
                            </div>
                            {newProduct.image && (
                                <div className="mt-3">
                                    <img
                                        src={newProduct.image}
                                        alt="Main"
                                        className="img-thumbnail"
                                        style={{ width: "200px", height: "auto" }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="col-md-12 mt-3">
                            {/* Dropzone for Additional Images */}
                            <h5>Upload Additional Images</h5>
                            <div
                                {...getAdditionalImagesRootProps()}
                                className="border border-primary p-3 text-center"
                                style={{ cursor: "pointer" }}
                            >
                                <input {...getAdditionalImagesInputProps()} />
                                <p>Drag and drop additional images here, or click to select files</p>
                            </div>
                            {/* Preview Uploaded Additional Images */}
                            <div className="row mt-3">
                                {newProduct.list_anh.map((image, index) => (
                                    <div className="col-md-3 mb-3" key={index}>
                                        <img
                                            src={image}
                                            alt={`Uploaded ${index}`}
                                            className="img-thumbnail"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-12 mt-3">
                            <button className="btn btn-success  w-50 p-3" onClick={handleAddProduct}>
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* Product Table */}
                    <h4>Products</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Main Image</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                style={{ width: "100px", height: "auto" }}
                                            />
                                        </td>
                                        <td>{product.title}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.description}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No products found matching your search
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-3">
                        <nav>
                            <ul className="pagination">
                                {/* Nút Previous */}
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(1)}
                                        disabled={currentPage === 1}
                                    >
                                        First
                                    </button>
                                </li>
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>

                                {/* Hiển thị các nút phân trang */}
                                {getPaginationRange().map((pageNumber) => (
                                    <li
                                        key={pageNumber}
                                        className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    </li>
                                ))}

                                {/* Nút Next */}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Last
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;