import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/home", name: "Home", icon: "bi-house-door" },
    { path: "/profile", name: "Profile", icon: "bi-person-circle" },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
        <div className="container">
          {/* Logo */}
          <span 
            className="fw-bold fs-4 cursor-pointer" 
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            NaijaPulse 🇳🇬
          </span>

          {/* Mobile Menu Button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="bi bi-list fs-2"></i>
          </button>

          {/* Desktop Navigation */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="d-flex gap-3 ms-auto align-items-center">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  className={`btn btn-link text-decoration-none ${
                    location.pathname === item.path ? "fw-bold text-success" : "text-dark"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Admin Panel - Only show for admin users */}
              {currentUser?.role === "admin" && (
                <button
                  className="btn btn-link text-decoration-none text-danger"
                  onClick={() => navigate("/Administrator/Dashboard")}
                >
                  Admin Panel
                </button>
              )}

              {/* User Info & Logout */}
              <div className="d-flex align-items-center gap-3 ms-3">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${
                      currentUser?.name || "User"
                    }&background=198754&color=fff&size=32&bold=true`}
                    alt="profile"
                    className="rounded-circle"
                    style={{ width: "32px", height: "32px" }}
                  />
                  <div className="d-none d-lg-block">
                    <small className="d-block fw-bold">{currentUser?.name || "User"}</small>
                    <small className="text-muted">{currentUser?.email || "Not signed in"}</small>
                  </div>
                </div>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Write Button - Desktop */}
          <button
            className="btn btn-success rounded-pill px-4 d-flex align-items-center gap-2 ms-3"
            onClick={() => navigate("/createpost")}
          >
            <i className="bi bi-pencil-square"></i> 
            <span>Write</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Offcanvas style but without offcanvas library) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ 
              zIndex: 1040, 
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(2px)"
            }}
          ></div>
          
          {/* Mobile Menu Panel */}
          <div
            className="position-fixed start-0 top-0 bg-white shadow-lg"
            style={{ 
              width: "280px", 
              height: "100vh", 
              zIndex: 1045,
              transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s ease-in-out"
            }}
          >
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">NaijaParrot 🦜</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsMobileMenuOpen(false)}
              ></button>
            </div>
            
            <div className="p-3">
              {/* User Profile Section */}
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    currentUser?.name || "User"
                  }&background=198754&color=fff&size=48&bold=true`}
                  alt="profile"
                  className="rounded-circle"
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
                <div className="flex-grow-1">
                  <p className="mb-0 fw-bold text-truncate">{currentUser?.name || "User"}</p>
                  <small className="text-muted text-truncate d-block">
                    {currentUser?.email || "Not signed in"}
                  </small>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="list-group list-group-flush">
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center gap-3 ${
                      location.pathname === item.path ? "active bg-light" : ""
                    }`}
                    onClick={() => navigate(item.path)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className={`bi ${item.icon} fs-5 text-success`}></i>
                    <span className="fw-medium">{item.name}</span>
                  </button>
                ))}
                
                {/* Admin Panel - Mobile */}
                {currentUser?.role === "admin" && (
                  <button
                    className="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center gap-3 text-danger"
                    onClick={() => navigate("/Administrator/Dashboard")}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="bi bi-shield-lock fs-5"></i>
                    <span className="fw-medium">Admin Panel</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Logout Button */}
            <div className="position-absolute bottom-0 start-0 w-100 p-3 border-top bg-white">
              <button
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i> 
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Write Button - Mobile Floating */}
      <button
        className="btn btn-success rounded-circle shadow-lg d-md-none position-fixed"
        style={{ 
          bottom: "20px", 
          right: "20px", 
          width: "56px", 
          height: "56px",
          zIndex: 1000
        }}
        onClick={() => navigate("/createpost")}
      >
        <i className="bi bi-pencil-square fs-5"></i>
      </button>

      {/* Main Content */}
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;