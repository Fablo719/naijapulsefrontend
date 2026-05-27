import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePosts.css";
// 🔥 IMAGE COMPRESS FUNCTION (unchanged)
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const maxWidth = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          resolve(blob);
        },
        "image/jpeg",
        0.7
      );
    };
  });
};

const CreatePost = () => {
  const navigate = useNavigate();

  const API_URL = "https://naijapulse.vercel.app/api/v1";

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postCategory, setPostCategory] = useState("technology");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    { id: "technology", name: "Technology", icon: "💻", description: "Cutting-edge tech & innovation" },
    { id: "politics", name: "Politics", icon: "🏛️", description: "Political insights & governance" },
    { id: "sport", name: "Sport", icon: "⚽", description: "Sports news & updates" },
    { id: "security", name: "Security", icon: "🛡️", description: "Protection of life & property" },
    { id: "education", name: "Education", icon: "📖", description: "Learning & knowledge" },
    { id: "health", name: "Health", icon: "❤️", description: "Wellness & healthcare" }
  ];

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      const compressed = await compressImage(file);
      const preview = URL.createObjectURL(compressed);
      setImagePreview(preview);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(compressed);
    } catch (err) {
      console.error(err);
      toast.error("Image processing failed");
    }
  };

  const sendPost = async () => {
    if (!postTitle.trim()) return toast.error("Enter title");
    if (!postContent.trim()) return toast.error("Enter content");

    setIsLoading(true);

    // ✅ FIX 1: Better token extraction with error checking
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Login required");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    // ✅ FIX 2: Safely parse user data
    let user = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        user = JSON.parse(userStr);
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
    }

    if (!user) {
      toast.error("User data not found. Please login again.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    // ✅ FIX 3: Get author ID from multiple possible fields
    const authorId = user.id || user._id || user.userId;
    const authorName = user.name || user.fullName || 
                      (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) ||
                      "Anonymous";

    if (!authorId) {
      toast.error("User ID not found. Please login again.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const payload = {
      postTitle: postTitle.trim(),
      postContent: postContent.trim(),
      postCategory,
      postImage: postImage || null,
      authorId: authorId,
      authorName: authorName
    };

    console.log("Sending payload:", { ...payload, postImage: postImage ? "present" : null });
    console.log("Using token:", token.substring(0, 20) + "...");

    try {
      // ✅ FIX 4: Ensure token is properly formatted
      const response = await axios.post(
        `${API_URL}/posts/createPost`,
        payload,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        toast.success("Post published 🎉");
        setTimeout(() => navigate("/home"), 1200);
      } else {
        toast.error(response.data.message || "Failed to publish");
      }
    } catch (err) {
      console.error("Full error:", err);
      
      // ✅ FIX 5: Better error handling
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(err.response?.data?.message || err.message || "Error publishing post");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <ToastContainer />

      <div className="post-container">
        <div className="post-header">
          <button onClick={() => navigate(-1)}>←</button>
          <h3>Create New Post</h3>
        </div>

        <div className="post-card">
          {/* CATEGORY */}
          <div className="category-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={postCategory === cat.id ? "active" : ""}
                onClick={() => setPostCategory(cat.id)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* TITLE */}
          <input
            type="text"
            placeholder="Title..."
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />

          {/* CONTENT */}
          <textarea
            placeholder="Write your story..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          {/* IMAGE */}
          {!imagePreview ? (
            <>
              <input type="file" id="postImage" hidden onChange={handleImage} />
              <button onClick={() => document.getElementById("postImage").click()}>
                Upload Image
              </button>
            </>
          ) : (
            <div>
              <img src={imagePreview} alt="preview" width="100%" />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setPostImage("");
                  document.getElementById("postImage").value = "";
                }}
              >
                Remove
              </button>
            </div>
          )}

          {/* SUBMIT */}
          <button disabled={isLoading} onClick={sendPost}>
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;