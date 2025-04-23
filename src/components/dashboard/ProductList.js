import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDropzone } from 'react-dropzone';

const ProductList = () => {
    const [products, setProducts] = useState([
        {
            id: "1",
            image: "Products/ProMounts Large Universal Tabletop TV Brackets (VESA 800x400) AMSF6401-02.jpg",
            title: "ProMounts Large Universal Tabletop TV Brackets (VESA 800x400) AMSF6401-02",
            price: "50.99",
            description: "ProMounts Tabletop TV Stand brackets features...",
            list_anh: [
                "Products/ProMounts Large Universal Tabletop TV Brackets (VESA 800x400) AMSF6401-02_0.jpg",
                "Products/ProMounts Large Universal Tabletop TV Brackets (VESA 800x400) AMSF6401-02_1.jpg",
                "Products/ProMounts Large Universal Tabletop TV Brackets (VESA 800x400) AMSF6401-02_2.jpg"
            ],
            category: "Stands & Mounts"
        },
    ]);

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

    // Handle adding a new product
    const handleAddProduct = () => {
        if (!newProduct.title || !newProduct.price || !newProduct.category || !newProduct.description || !newProduct.image) {
            alert("All fields are required!");
            return;
        }

        const newId = (products.length > 0 ? Math.max(...products.map(product => parseInt(product.id))) : 0) + 1;

        const productToAdd = {
            ...newProduct,
            id: newId.toString(),
        };

        setProducts([...products, productToAdd]);
        setNewProduct({ id: "", image: "", title: "", price: "", description: "", category: "", list_anh: [] });
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
    const handleDeleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter(product => product.id !== id));
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
                            <button className="btn btn-success w-100" onClick={handleAddProduct}>
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
                            {products.map((product) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="modal show d-block" tabIndex="-1"  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                    position: "fixed", 
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100vw",
                    height: "100vh",
                    zIndex: 1050,
                  }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setEditingProduct(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Title"
                                    value={editingProduct.title}
                                    onChange={(e) =>
                                        setEditingProduct({ ...editingProduct, title: e.target.value })
                                    }
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Price"
                                    value={editingProduct.price}
                                    onChange={(e) =>
                                        setEditingProduct({ ...editingProduct, price: e.target.value })
                                    }
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Category"
                                    value={editingProduct.category}
                                    onChange={(e) =>
                                        setEditingProduct({ ...editingProduct, category: e.target.value })
                                    }
                                />
                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Description"
                                    rows="3"
                                    value={editingProduct.description}
                                    onChange={(e) =>
                                        setEditingProduct({ ...editingProduct, description: e.target.value })
                                    }
                                ></textarea>
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
                                {editingProduct.image && (
                                    <div className="mt-3">
                                        <img
                                            src={editingProduct.image}
                                            alt="Main"
                                            className="img-thumbnail"
                                            style={{ width: "200px", height: "auto" }}
                                        />
                                    </div>
                                )}
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
                                <div className="row mt-3">
                                    {editingProduct.list_anh.map((image, index) => (
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
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setEditingProduct(null)}
                                >
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveEdit}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;