import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Reset = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = form.current.email.value;
    try {
      const response = await fetch(`http://localhost:3000/users?email=${email}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const users = await response.json();

      if (users.length === 0) {
        alert("No account found with this email!");
        setLoading(false);
        return;
      }
      
      const user = users[0];
      const password = user.password;

      const templateParams = {
        name: user.user_name,
        email: email,
        password: password,
      };

      emailjs.send(
        "service_1no4qpi",
        "template_vo3kk0d",
        templateParams,
        {
          publicKey: "lOjokhuzil0qZUyCu",
        }
      );

      alert("Password has been sent to your email!");
      form.current.reset();
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to send password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // Gradient nền
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Hiệu ứng bóng
          width: "100%",
          maxWidth: "400px", // Giới hạn chiều rộng tối đa
        }}
      >
        <form id="reset-form" ref={form} onSubmit={sendEmail}>
          <h3
            style={{
              textAlign: "center",
              marginBottom: "30px",
              color: "#333",
              fontWeight: "bold",
              fontFamily: "'Arial', sans-serif",
            }}
          >
            Reset Your Password
          </h3>
          <div className="mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              name="email"
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease", // Hiệu ứng khi focus
              }}
              onFocus={(e) => (e.target.style.borderColor = "#007bff")}
              onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            style={{
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              backgroundColor: loading ? "#6c757d" : "#007bff",
              border: "none",
              transition: "background-color 0.3s ease, transform 0.2s ease", // Hiệu ứng hover
            }}
            onMouseEnter={(e) =>
              !loading && (e.target.style.backgroundColor = "#0056b3")
            }
            onMouseLeave={(e) =>
              !loading && (e.target.style.backgroundColor = "#007bff")
            }
            onMouseDown={(e) => !loading && (e.target.style.transform = "scale(0.98)")}
            onMouseUp={(e) => !loading && (e.target.style.transform = "scale(1)")}
          >
            {loading ? "Sending..." : "Send Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reset;