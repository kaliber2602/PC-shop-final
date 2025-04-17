import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "./Logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ToastNotification from "./ToastNotification";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {


  const userId = parseInt(localStorage.getItem("userId"), 10) || 1;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [toast, setToast] = useState(null);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToastClose = () => {
    setToast(null);
  };

  const handleValidation = (field) => {
    const inputElement = document.getElementById(field);
    let isValid = true;

    if (field === "userName" && formData.userName.trim() === "") {
      setToast({ type: "danger", message: "Username is required!" });
      isValid = false;
    } else if (field === "password" && formData.password.trim() === "") {
      setToast({ type: "danger", message: "Password is required!" });
      isValid = false;
    }

    if (inputElement) {
      if (!isValid) {
        inputElement.classList.add("invalid-input");
        inputElement.classList.remove("valid-input");
      } else {
        inputElement.classList.remove("invalid-input");
        inputElement.classList.add("valid-input");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const fields = ["userName", "password"];
  
    fields.forEach((field) => {
      handleValidation(field);
      const inputElement = document.getElementById(field);
      if (inputElement && inputElement.classList.contains("invalid-input")) {
        hasError = true;
      }
    });
  
    if (hasError) {
      setToast({ type: "danger", message: "Please fix errors before submitting!" });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: formData.userName,
          password: formData.password,
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Lưu user_id vào localStorage
        localStorage.setItem("userId", result.id);
        localStorage.setItem("isAdmin", result.admin); // Tùy chọn: lưu quyền admin
  
        setToast({ type: "success", message: "Login successful!" });
        setTimeout(() => {
          if (result.admin) {
            navigate("/dashboard", { state: { showWelcome: true } });
          } else {
            navigate("/", { state: { showWelcome: true } });
            onLoginSuccess();
          }
        }, 1000);
      } else {
        setToast({ type: "danger", message: result.message });
      }
    } catch (error) {
      setToast({ type: "danger", message: "Error connecting to server!" });
    }
  };
  
  return (
    <div className="container-fluid bg_image">
      <div className="row">

        <form className="col-12 col-md-6 form_container d-flex flex-column align-items-center justify-content-center">
          <img src={logo} className="logo mb-4" alt="Decor Dream logo" />

          <input
            className="form-control w-75 mb-3 mx-auto shadow p-3"
            type="text"
            id="userName"
            name="userName"
            placeholder="Enter Your Username"
            value={formData.userName}
            onChange={handleChange}
            onBlur={() => handleValidation("userName")}
          />

          <input
            className="form-control w-75 mb-3 mx-auto shadow p-3"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleValidation("password")}
          />

          <button
            className="btn submit gradient-hover-effect w-75 mb-3 p-3 shadow mx-auto"
            onClick={handleSubmit}
          >
            <b className="h3">Login</b>
          </button>
          <div className="container w-75 mb-3 mx-auto" style={{ height: "100px" }}>
            <div className="row">
              <div className="forgot-password text-left col-6">
              <a href="./Reset">Forgot password?</a>
              </div>
              <div className="create-account text-right col-6" style={{ textAlign: "right" }}>
                <a href="./Register">Create new account</a>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Toast Message */}
      <div id="toast">
        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={handleToastClose}
            duration={4000}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
