import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Menu = ({ onSelectCategory }) => {
  const handleCategoryClick = (category) => {
    onSelectCategory(category);
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
    <div className="col-lg-2 col-xl-2 col-sm-12 col-md-12 mb-4 menu">
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
        <div key={index} className="dropdown show p-2 rounded mb-0">
          {item.subItems ? (
            <button
              className="btn btn-secondary col-12 dropdown-toggle"
              type="button" // Required for buttons to clarify their role
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
              className="btn btn-secondary col-12"
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
    </div>
  );
};



export default Menu;