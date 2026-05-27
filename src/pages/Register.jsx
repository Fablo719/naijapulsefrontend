import { useFormik } from "formik";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        
        console.log("Attempting to register with:", values);

        const response = await axios.post(
          "https://naijapulse.vercel.app/api/v1/users/register",
          {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        console.log("Registration response:", response.data);

        if (response.data.success) {
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }
          localStorage.setItem("user", JSON.stringify(response.data.user));
          
          toast.success(response.data.message || "Account created successfully! 🎉");
          
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          toast.error(response.data.message || "Registration failed");
        }
        
      } catch (err) {
        console.error("Registration error details:", err);
        
        if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);
          
          if (err.response.data.message) {
            toast.error(err.response.data.message);
          } else if (err.response.data.error) {
            toast.error(err.response.data.error);
          } else {
            toast.error("Registration failed. Please check your details.");
          }
        } else if (err.request) {
          console.error("No response received:", err.request);
          toast.error("Cannot connect to server. Please check if backend is running.");
        } else {
          console.error("Error message:", err.message);
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="auth-wrapper">      
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top Navbar */}
      <div className="auth-navbar">
        <div className="brand-left">
          <span className="brand-icon">🚨</span>
          <span className="brand-name">NaijaPulse</span> {/* Fixed: Changed from NaijaParrot to NaijaPulse */}
        </div>
        <div className="brand-right">
          <Link to="/login" className="nav-link">Sign in</Link>
        </div>
      </div>

      {/* Centered Card */}
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create account</h1>
            <p>Join our community of storytellers</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="auth-form">
            <div className="input-group">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <input
                type="text"
                className="auth-input"
                placeholder="First Name"
                {...formik.getFieldProps("firstName")}
                autoComplete="given-name"
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <input
                type="text"
                className="auth-input"
                placeholder="Last Name"
                {...formik.getFieldProps("lastName")}
                autoComplete="family-name"
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <input
                type="email"
                className="auth-input"
                placeholder="Email address"
                {...formik.getFieldProps("email")}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H17V6C17 3.2 14.8 1 12 1C9.2 1 7 3.2 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.3 10.3 2.9 12 2.9C13.7 2.9 15.1 4.3 15.1 6V8Z" fill="currentColor"/>
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Password"
                {...formik.getFieldProps("password")}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C5.6 5 1 12 1 12C1 12 5.6 19 12 19C18.4 19 23 12 23 12C23 12 18.4 5 12 5Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C5.6 5 1 12 1 12C1 12 5.6 19 12 19C18.4 19 23 12 23 12C23 12 18.4 5 12 5Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="register-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;