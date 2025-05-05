import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import logo from "./Logo.png";
import "./Header.css";

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [visibleResults, setVisibleResults] = useState(10); // Number of visible results
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);


  async function getProducts() {
    try {
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

  const handleSearchClick = () => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length > 0) {
      const results = products.filter((product) =>
        product.title.toLowerCase().includes(query)
      );
      setFilteredResults(results);
      setVisibleResults(10); // Reset visible results to 10
      setShowOverlay(results.length > 0);
    }
  };

  const handleSelectProduct = (id) => {
    navigate(`/product-detail/${id}`);
    setShowOverlay(false);
  };
  const logout = () => {
    localStorage.removeItem("userId"); // Xóa userId khỏi localStorage
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    alert("Log out successfully");
    navigate("/"); // Chuyển hướng về trang chủ
  };
  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout(); // Gọi hàm logout
    } else {
      navigate("/Login"); // Chuyển hướng đến trang đăng nhập
    }
  };

  // Lazy loading: Load more results when scrolling
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleResults((prev) => Math.min(prev + 10, filteredResults.length));
    }
  };

  return (
    <>
      <style>{`
        header {
          width: 100vw !important;
          margin: 0 !important;
          padding: 10px 0 !important;
        }

        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(7, 70, 137, 0.5);
          z-index: 200;
        }

        .search-results-container {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 10px;
          border-radius: 5px;
          max-height: 400px;
          overflow-y: auto;
        }
      `}</style>

      <header
        style={{
          top: 0,
          padding: "10px 16px",
          background: "#F0F0F2",
          zIndex: 100,
        }}
        className=" d-flex"
      >
        <div className="container shadow ">
          <div className="row w-100">
            <div className="logo_container col-lg-1 col-xl-1 col-md-2 col-sm-2 p-3">
              <NavLink className="nav-link" to="/">
                <img src={logo} className="logo_image" alt="Logo" />
              </NavLink>
            </div>

            <div className="Search_box col-lg-6 col-xl-6 col-md-8 col-sm-8 d-flex container-fluid p-2">
              <input
                className="Search_bar col-lg-10 col-xl-10 col-md-8 col-sm-8 p-2"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="Search_button col-lg-2 col-xl-2 col-md-4 col-sm-4 p-2"
                onClick={handleSearchClick}
              >
                Search
              </button>
            </div>

            <div className="navbar_container col-lg-5 col-xl-5 col-md-2 col-sm-2 d-flex flex-row-reverse">
              <nav className="navbar navbar-expand-lg ">
                <div className="container-fluid">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>

                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/">
                          <b>Home</b>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/about">
                          <b>About</b>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/product-category">
                          <b>Services</b>
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/contact">
                          <b>Contact</b>
                        </NavLink>
                      </li>
                      {isLoggedIn && ( 
                        <li className="nav-item">
                          <NavLink
                            className="nav-link"
                            to={`/orders/${localStorage.getItem("userId")}`} 
                          >
                            <b>Order</b>
                          </NavLink>
                        </li>
                      )}
                      <li className="nav-item">
                        <button
                          className={`nav-link bg-transparent border-0 ${isLoggedIn ? "text-danger" : ""
                            }`}
                          onClick={handleAuthClick}
                        >
                          <b>{isLoggedIn ? "Logout" : "Login"}</b>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {showOverlay && (
        <div className="search-overlay" onClick={() => setShowOverlay(false)}>
          <div
            className="search-results-container"
            onClick={(e) => e.stopPropagation()}
            onScroll={handleScroll} // Attach scroll event
          >
            <ul className="list-group">
              {filteredResults.slice(0, visibleResults).map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex align-items-center"
                  onClick={() => handleSelectProduct(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="suggestion-image me-2"
                  />
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}