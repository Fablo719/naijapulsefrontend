import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };


};

export default Navbar;