import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Menu = ({ onSelectCategory, onPriceFilter, onSortPrice }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleCategoryClick = (category) => {
    onSelectCategory(category);
  };

  const handlePriceFilter = () => {
    onPriceFilter({ min: minPrice, max: maxPrice });
  };

  const handleSortPrice = (order) => {
    onSortPrice(order);
  };

  const menuItems = [
    { title: "PC & Laptop", subItems: ["PC", "Laptop"] },
    {
      title: "PC Components",
      subItems: [
        "CPU",
        "GPU (Graphics Card)",
        "RAM",
        "SSD & HDD (Storage)",
        "PSU (Power Supply Unit)",
        "Motherboard",
        "Cooling Solutions",
      ],
    },
    { title: "Monitors" },
    {
      title: "Mechanical Keyboards & Accessories",
      subItems: ["Mechanical Keyboards", "Keycap Sets"],
    },
    {
      title: "Mice & Mousepads",
      subItems: ["Gaming Mice", "Mousepads"],
    },
    {
      title: "Headphones & Speakers",
      subItems: ["Headphones", "Speakers"],
    },
    {
      title: "Chairs & Desks",
      subItems: ["Chairs", "Desks"],
    },
    {
      title: "Other Accessories",
      subItems: [
        "Cables & Adapters",
        "Hubs & Docking Stations",
        "LED Lighting",
        "Stands & Mounts",
      ],
    },
  ];

  return (
    <div className="col-lg-2 col-xl-2 col-sm-12 col-md-12 mb-4 menu" style={{ backgroundColor: "white" }}>
      <h1
        className="p-1 text-center"
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#32383D",
          padding: "1rem",
          textShadow:
            "1px 1px 2px rgba(0, 0, 0, 0.3), -1px -1px 2px rgba(255, 255, 255, 0.8)",
        }}
      >
        <b>GearZone</b>
      </h1>

      {menuItems.map((item, index) => (
        <div key={index} className="dropdown show p-2 mb-0">
          {item.subItems ? (
            <button
              className="btn  col-12 dropdown-toggle"
              type="button"
              id={`dropdownMenuLink-${index}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {item.title}
              <span className="ms-2">
                <i className="bi bi-chevron-down"></i>
              </span>
            </button>
          ) : (
            <button
              className="btn  col-12"
              onClick={() => handleCategoryClick(item.title)}
              style={{
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {item.title}
            </button>
          )}

          {item.subItems && (
            <div className="dropdown-menu" aria-labelledby={`dropdownMenuLink-${index}`}>
              {item.subItems.map((subItem, subIndex) => (
                <button
                  key={subIndex}
                  className="dropdown-item"
                  onClick={() => handleCategoryClick(subItem)}
                >
                  {subItem}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Price Filter */}
      <div className="p-3 mt-3" style={{ backgroundColor: "white" }}>
        <h5 className="text-center">Filter by Price</h5>
        <div className="mb-2">
          <label htmlFor="minPrice" className="form-label">
            Min Price:
          </label>
          <input
            type="number"
            id="minPrice"
            className="form-control"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="maxPrice" className="form-label">
            Max Price:
          </label>
          <input
            type="number"
            id="maxPrice"
            className="form-control"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handlePriceFilter}>
          Apply Filter
        </button>
      </div>

      {/* Price Sorting */}
      <div className="p-3 mt-3" style={{ backgroundColor: "white" }}>
        <h5 className="text-center">Sort by Price</h5>
        <button
          className="btn btn-outline-primary w-100 mb-2"
          onClick={() => handleSortPrice("low-to-high")}
        >
          Low to High
        </button>
        <button
          className="btn btn-outline-primary w-100"
          onClick={() => handleSortPrice("high-to-low")}
        >
          High to Low
        </button>
      </div>

      {/* Bottleneck Calculator */}
      <div className="p-3 mt-3" style={{ backgroundColor: "white" }}>
        <h5 className="text-center">Tools</h5>
        <a
          href="https://pc-builds.com/bottleneck-calculator/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary w-100"
        >
          Bottleneck Calculator
        </a>
      </div>
    </div>
  );
};

export default Menu;