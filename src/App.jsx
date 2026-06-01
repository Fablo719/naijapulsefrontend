import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Layout from "./components/layout";
import AdminRoute from './pages/AdminRoute';
import SinglePost from "./pages/SinglePosts";
//import Ourstories from "./pages/OurStories";
import LandingPage from "./pages/LandingPage";
import AdminPosts from "./pages/AdminPosts";
import AdminUsers from "./pages/AdminUsers";
import ResetPassword from "./pages/ResetPassword"; // ✅ UNCOMMENT THIS LINE
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePosts";
import Profile from "./pages/Profile";
import Cookies from "universal-cookie";
import PostDetail from "./pages/PostDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const cookies = new Cookies();
  const isAuth = cookies.get("token");
  
  return (
    <>
      <Navbar />
      
      <Routes>
        {/* Public Routes - No authentication required */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} /> {/* ✅ Use this route */}
        
        {/* Protected Routes - Authentication required */}
        <Route path="/home" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stories" element={<Home />} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        
        {/* Admin Routes - Protected by AdminRoute (requires admin role) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/Administrator/Dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;