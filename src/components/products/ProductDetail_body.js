import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure Bootstrap JS is included

const ProductDetail_body = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="item col-xl-8 col-lg-8 col-md-12 col-sm-12 p-4">
      <div className="row">
        {/* Product Image Section */}
        <div className="col-md-5">
          {/* Bootstrap Carousel */}
          <div id="carouselExampleIndicators" className="carousel slide col-12 p-3" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img className="d-block w-100" src="item_info/torras1.jpg" alt="First slide" />
              </div>
              <div className="carousel-item">
                <img className="d-block w-100" src="item_info/torras2.jpg" alt="Second slide" />
              </div>
              <div className="carousel-item">
                <img className="d-block w-100" src="item_info/torras3.jpg" alt="Third slide" />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="mt-3 d-flex align-items-center">
            <span className="me-2">Chia sẻ:</span>
            <a className="Vo8Ebs" href="https://www.messenger.com/" target="_blank" rel="noopener noreferrer">
              <img src="item_info/messenger_logo.webp" alt="Messenger" width="32" />
            </a>
            <a className="Vo8Ebs" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <img src="item_info/facebook_logo.webp" alt="Facebook" width="32" />
            </a>
            <a className="Vo8Ebs" href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer">
              <img src="item_info/pinterest_logo.jpg" alt="Pinterest" width="32" />
            </a>
          </div>

          {/* Like Button */}
          <div className="mt-3 d-flex align-items-center">
            <button className="btn btn-light border">
              <i className="fa fa-heart text-danger"></i> Đã thích (86)
            </button>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="container col-md-7">
          <h3>TORRAS Power Cloud</h3>
          <p>PD 65W | White | Power Station</p>
          <p>
            <span className="text-danger h1">$50.00</span>
            <small><del>$60.00</del></small>
            <span className="text-success"> (-24%)</span>
          </p>

          {/* Quantity Input */}
          <p>
            <strong>Quantity:</strong>
            <input
              type="number"
              value={quantity}
              min="1"
              className="form-control-inline w-25 ms-2"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </p>

          {/* Action Buttons */}
          <button className="btn btn-danger me-2">Buy Now</button>
          <button className="btn btn-dark">Add to cart</button>
        </div>

        {/* Product Description */}
        <div className="h2 col-12 mt-4">About this item</div>
        <div className="h3 col-12">PRODUCT DESCRIPTION - TORRAS Power Cloud</div>
        <pre className="col-12">
          {`Product Features:
          - Advanced cooling technology that maintains stable temperatures for devices, preventing overheating and improving performance.
          - Compact and sleek design, easy to carry and use anywhere.
          - Ultra-quiet operation, providing a smooth and comfortable experience without noise.
          - Widely compatible with various devices such as smartphones, tablets, laptops, gaming consoles, and other electronics.
          - Energy-efficient, minimizing power consumption while maintaining excellent cooling performance.

          Product Specifications:
          - Name: TORRAS Power Cloud
          - Model: TORRAS Power Cloud Cooling Device
          - Operating Voltage: 5V
          - Cooling Speed: Super fast, immediate effectiveness
          - Storage Type: Cooling device
          - Dimensions: 150mm x 75mm x 50mm
          - Weight: 350g (approx.)
          - Certifications: CE, FCC, RoHS
          - Color: White, Black
          - Compatible with: Smartphones, tablets, gaming consoles, laptops, and other electronic devices.

          Package Includes:
          - 1 * TORRAS Power Cloud
          - 1 * User manual
          - 1 * Connecting cable
          
          Note:
          - The actual color of the item may vary slightly from the images shown on the website due to factors such as screen brightness and lighting conditions.
          - Please allow slight measurement deviations due to manual measurements.`}
        </pre>
      </div>
    </div>
  );
};

export default ProductDetail_body;
