import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verify admin status from localStorage and token
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('AdminRoute - Token:', token ? 'Present' : 'Missing');
        console.log('AdminRoute - User:', storedUser);
        console.log('AdminRoute - User role:', storedUser.role);
        
        if (!token) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // Check if user has admin role
        if (storedUser.role === 'admin') {
          setIsAuthenticated(true);
          setIsAdmin(true);
          setUser(storedUser);
        } else {
          setIsAuthenticated(true);
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Admin verification error:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsLoading(false);
      }
    };
    
    verifyAdmin();
  }, []);

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Verifying admin access...</p>
      </div>
    );
  }
  
  // Not authenticated
  if (!isAuthenticated) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" replace />;
  }
  
  // Not admin
  if (!isAdmin) {
    toast.error('Unauthorized access. Admin privileges required.');
    return <Navigate to="/home" replace />;
  }
  
  // Admin authenticated, render child routes
  return <Outlet />;
};

export default AdminRoute;