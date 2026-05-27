import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css"; // We'll create this CSS file

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load current user from localStorage (check both possible keys)
    const user = JSON.parse(localStorage.getItem("user")) || 
                 JSON.parse(localStorage.getItem("currentUser")) || 
                 null;
    setCurrentUser(user);
    
    // Load post
    loadPost();
  }, [postId]);

  const loadPost = () => {
    setIsLoading(true);
    // Try to get posts from localStorage
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const foundPost = posts.find(p => p.id === parseInt(postId) || p._id === postId);
    
    if (foundPost) {
      setPost(foundPost);
      setComments(foundPost.comments || []);
    } else {
      // If no post found, maybe redirect to home
      navigate("/home");
    }
    setIsLoading(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Please login to comment");
      navigate("/login");
      return;
    }
    
    if (!newComment.trim()) {
      alert("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    // Create comment object with proper user data
    const comment = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      //userEmail: currentUser.email,
      content: newComment,
      date: new Date().toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric",
        year: "numeric"
      }),
      time: new Date().toLocaleTimeString(),
      createdAt: new Date().toISOString()
    };

    console.log("Adding comment:", comment); // Debug log

    // Update comments
    const updatedComments = [...comments, comment];
    
    // Update post in localStorage
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const updatedPosts = posts.map(p => {
      if (p.id === parseInt(postId)) {
        return { ...p, comments: updatedComments };
      }
      return p;
    });
    
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    
    // Update state
    setComments(updatedComments);
    setNewComment("");
    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric",
        year: "numeric"
      });
    } catch (error) {
      return dateString;
    }
  };

  const getUserInitial = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h3>Post not found</h3>
        <Link to="/home" className="btn btn-dark mt-3">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="container py-4">
        {/* Back button */}
        <button 
          className="back-to-home-btn mb-4"
          onClick={() => navigate("/home")}
        >
          ← Back to Home
        </button>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Author info */}
            <div className="author-section mb-4">
              <div className="author-avatar">
                <span className="avatar-initial">
                  {getUserInitial(post.authorName)}
                </span>
              </div>
              <div className="author-info">
                <Link to={`/profile/${post.authorId}`} className="author-name">
                  {post.authorName}
                </Link>
                <div className="post-meta">
                  {formatDate(post.date || post.createdAt)} · 
                  {post.reads || Math.ceil((post.content?.length || 0) / 1000)} min read
                </div>
              </div>
            </div>

            {/* Post title and content */}
            <h1 className="post-title">{post.title}</h1>
            
            {post.excerpt && (
              <div className="post-excerpt">
                <p className="lead">{post.excerpt}</p>
              </div>
            )}
            
            <div className="post-content">
              <p>{post.content}</p>
            </div>

            {/* Comments section */}
            <div className="comments-section">
              <h3 className="comments-title">
                Comments ({comments.length})
              </h3>

              {/* Add comment form */}
              {currentUser ? (
                <form onSubmit={handleAddComment} className="add-comment-form">
                  <div className="comment-input-wrapper">
                    <div className="comment-avatar">
                      <span className="avatar-initial-small">
                        {getUserInitial(currentUser.name || currentUser.firstName)}
                      </span>
                    </div>
                    <div className="comment-input-group">
                      <textarea
                        className="comment-textarea"
                        rows="3"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isSubmitting}
                      ></textarea>
                      <button 
                        type="submit" 
                        className="submit-comment-btn"
                        disabled={isSubmitting || !newComment.trim()}
                      >
                        {isSubmitting ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="login-prompt">
                  <p>
                    <Link to="/login" className="login-link">Login</Link> to leave a comment
                  </p>
                </div>
              )}

              {/* Comments list */}
              {comments.length > 0 ? (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-avatar">
                        <span className="avatar-initial-small">
                          {getUserInitial(comment.userName)}
                        </span>
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <Link to={`/profile/${comment.userId}`} className="comment-author">
                            {comment.userName}
                          </Link>
                          <span className="comment-date">{comment.date}</span>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-comments">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;