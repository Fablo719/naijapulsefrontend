import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminPosts.css";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
       "https://naijapulse.vercel.app/api/v1/posts/admin/posts",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(data.posts || []);
    } catch (err) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(
        `https://naijapulse.vercel.app/api/v1/posts/admin/post/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.postTitle
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      post.postCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPosts = posts.length;

  
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="spinner-border" role="status" />
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-posts-container">
      {/* Header */}
      <div className="admin-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2>Post Management</h2>
            <p> 📊Total Posts: {totalPosts}</p>
          </div>
          {/* <button className="btn btn-dark rounded-pill px-4 py-2">
            + Create New Post
          </button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="d-flex gap-3 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "300px" }}
          />

          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ maxWidth: "200px" }}
          >
            <option>All Categories</option>
            <option>technology</option>
            <option>politics</option>
            <option>sport</option>
            <option>security</option>
            <option>education</option>
            <option>health</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>POST</th>
                <th>CATEGORY</th>
                <th>AUTHOR</th>
                <th>DATE</th>
                <th className="text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post._id}>
                    <td>
                      <div className="post-title">{post.postTitle}</div>
                      <div className="post-excerpt">
                        {post.postContent?.slice(0, 80)}...
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">
                        {post.postCategory === "creativity" ? "💡" : "💻"}
                        {post.postCategory || "General"}
                      </span>
                    </td>
                    <td>{post.authorName || post.createdBy || post.username || "Unknown"}</td>
                    <td>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-danger btn-sm px-3"
                        onClick={() => deletePost(post._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;