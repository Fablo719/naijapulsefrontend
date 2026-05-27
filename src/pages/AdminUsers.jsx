import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminUsers.css";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
    active: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!user || user.role !== "admin") {
      toast.error("Unauthorized access. Admin privileges required.");
      navigate("/home");
      return;
    }
    
    setCurrentUser(user);
    setIsAdmin(true);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://naijapulse.vercel.app/api/v1/users/getUsers",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const allUsers = response.data.users || [];
      setUsers(allUsers);
      setFilteredUsers(allUsers);

      // Calculate stats
      const admins = allUsers.filter(user => user.role === "admin").length;
      const regularUsers = allUsers.filter(user => user.role === "user").length;
      const active = allUsers.filter(user => user.status === "active").length;

      setStats({
        total: allUsers.length,
        admins,
        users: regularUsers,
        active
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to access this page.");
        navigate("/home");
      } else {
        toast.error("Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    // Prevent admin from deleting themselves
    if (selectedUser._id === currentUser._id) {
      toast.error("You cannot delete your own account");
      setShowDeleteModal(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://naijapulse.vercel.app/api/v1/users/deleteUser/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success(`${selectedUser.firstName} ${selectedUser.lastName} has been deleted`);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://naijapulse.vercel.app/api/v1/users/updateUserRole/${selectedUser._id}`,
        { role: selectedUser.role === "admin" ? "user" : "admin" }, // Toggle role
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success(`Role updated successfully`);
      setShowRoleModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>User Management</h1>
          <p>Manage and moderate all NaijaPulse users</p>
        </div>
        <button className="create-user-btn" onClick={() => navigate("/register")}>
          + Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-info">
            <h3>{stats.admins}</h3>
            <p>Admins</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <h3>{stats.users}</h3>
            <p>Regular Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.active}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">👥</span>
            <h3>No users found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="user-info">
                    <div className="user-avatar">
                      <span>{getInitials(user.firstName, user.lastName)}</span>
                    </div>
                    <div className="user-details">
                      <h4>{user.firstName} {user.lastName}</h4>
                      {user._id === currentUser?._id && (
                        <span className="current-user-badge">You</span>
                      )}
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role === "admin" ? "admin" : "user"}`}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn role-btn"
                      onClick={() => openRoleModal(user)}
                      title="Change Role"
                      disabled={user._id === currentUser?._id}
                    >
                      👑
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDeleteModal(true);
                      }}
                      title="Delete User"
                      disabled={user._id === currentUser?._id}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete User</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?</p>
              <p className="warning-text">⚠️ This action cannot be undone. All user data will be permanently removed.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteUser}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change User Role</h3>
              <button className="modal-close" onClick={() => setShowRoleModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Change role for <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong></p>
              <p>Current role: <strong>{selectedUser?.role === "admin" ? "Administrator" : "Regular User"}</strong></p>
              <p className="info-text">
                ⚠️ Admins have full access to all platform features and user management.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowRoleModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdateRole}>
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;