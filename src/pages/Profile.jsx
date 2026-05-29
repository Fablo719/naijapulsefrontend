import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    postTitle: "",
    postContent: "",
    postImage: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const userRes = await axios.get(
        "https://naijapulse.vercel.app/api/v1/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const currentUser = userRes.data.user;
      if (!currentUser) {
        console.error("User missing in response:", userRes.data);
        setLoading(false);
        return;
      }

      const userId = currentUser._id || currentUser.id;
      if (!userId) {
        console.error("User ID missing in response:", currentUser);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      await fetchUserPosts(userId, token);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId, token) => {
    try {
      const postRes = await axios.get(
        `https://naijapulse.vercel.app/api/v1/posts/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserPosts(postRes.data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Failed to load posts");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://naijapulse.vercel.app/api/v1/posts/${postId}`, // ✅ Fixed URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserPosts(userPosts.filter(post => post._id !== postId));
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditForm({
      postTitle: post.postTitle,
      postContent: post.postContent,
      postImage: post.postImage || ""
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    
    if (!editForm.postTitle.trim() || !editForm.postContent.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // ✅ FIXED: Correct API endpoint
      const response = await axios.put(
        `https://naijapulse.vercel.app/api/v1/posts/${editingPost._id}`,
        {
          postTitle: editForm.postTitle,
          postContent: editForm.postContent,
          postImage: editForm.postImage
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserPosts(userPosts.map(post => 
        post._id === editingPost._id ? response.data.post : post
      ));
      
      setEditingPost(null);
      toast.success("Post updated successfully!");
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error(err.response?.data?.message || "Failed to update post");
    }
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditForm({
      postTitle: "",
      postContent: "",
      postImage: ""
    });
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "U";
  const formatDate = (date) => new Date(date).toLocaleDateString();

  // Rest of your component remains the same...
  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="custom-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container py-4">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* PROFILE HEADER */}
        <div className="profile-header-card">
          <div className="card-body">
            <div className="profile-header-content">
              <div className="profile-avatar">
                <h3>{getInitial(user?.name)}</h3>
              </div>

              <div className="profile-info">
                <h4 className="user-name">{user?.name}</h4>
                <div className="user-email-wrapper">
                  <svg className="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="user-email">{user?.email}</span>
                </div>
                <div className="user-stats">
                  <div className="stat-badge">
                    <span className="stat-number">{userPosts.length}</span>
                    <span className="stat-label">{userPosts.length === 1 ? "Post" : "Posts"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editingPost && (
          <div className="modal-overlay" onClick={cancelEdit}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Post</h3>
                <button className="close-btn" onClick={cancelEdit}>×</button>
              </div>
              <form onSubmit={handleUpdatePost}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="postTitle"
                    value={editForm.postTitle}
                    onChange={handleEditChange}
                    placeholder="Post title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    name="postContent"
                    value={editForm.postContent}
                    onChange={handleEditChange}
                    placeholder="Post content"
                    rows="6"
                    required
                  />
                </div>
                {/* <div className="form-group">
                  <label>Image URL (optional)</label>
                  <input
                    type="text"
                    name="postImage"
                    value={editForm.postImage}
                    onChange={handleEditChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div> */}
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* POSTS SECTION */}
        <div className="posts-section">
          <div className="posts-header">
            <h5 className="posts-title">My Posts</h5>
            <div className="title-underline"></div>
          </div>

          {userPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-text">No posts yet</p>
              <p className="empty-subtext">Start creating your first post!</p>
            </div>
          ) : (
            <div className="posts-grid">
              {userPosts.map((post) => (
                <div key={post._id} className="post-card">
                  {post.postImage && (
                    <div className="post-image-wrapper">
                      <img
                        src={post.postImage}
                        alt={post.postTitle}
                        className="post-image"
                      />
                      <div className="post-image-overlay"></div>
                    </div>
                  )}
                  <div className="post-card-body">
                    <h6 className="post-title">{post.postTitle}</h6>
                    <div className="post-date">
                      <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(post.createdAt)}
                    </div>
                    <p className="post-content-preview">
                      {post.postContent?.slice(0, 100)}
                      {post.postContent?.length > 100 && "..."}
                    </p>
                    
                    <div className="post-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditClick(post)}
                      >
                        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                          <path d="M4 20h16" />
                        </svg>
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 7h16" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
                          <path d="M9 3h6" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;