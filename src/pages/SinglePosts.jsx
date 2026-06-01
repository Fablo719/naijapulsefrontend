import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SinglePosts.css";

const API_URL = "https://naijapulse.vercel.app/api/v1";

/* ── shared navbar (same as Home) ── */
const Navbar = ({ currentUser, onLogout, navigate }) => {
    const [searchInput, setSearchInput] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);

    const userName = currentUser?.name ||
        `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'Guest';

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/home?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    return (
        <>
            <nav className="sp-navbar">
                <div className="sp-nav-inner">
                    <button className="sp-menu-btn" onClick={() => setShowSidebar(true)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <div className="sp-logo" onClick={() => navigate('/home')}>
                        <span>₦</span>
                        <span className="sp-logo-text">NaijaPulse Forum</span>
                    </div>
                    <div className="sp-nav-links">
                        <span>Welcome,&nbsp;</span>
                        <span className="sp-nav-username" onClick={() => navigate('/profile')}>{userName}</span>
                        <span className="sp-sep"> • </span>
                        <button className="sp-nav-link" onClick={() => navigate('/profile')}>Edit Profile</button>
                        <span className="sp-sep"> • </span>
                        <button className="sp-nav-link" onClick={() => navigate('/home')}>Home</button>
                        {currentUser?.role === 'admin' && (
                            <>
                                <span className="sp-sep"> • </span>
                                <button className="sp-nav-link" onClick={() => navigate('/Administrator/Dashboard')}>Admin</button>
                            </>
                        )}
                        <span className="sp-sep"> • </span>
                        <button className="sp-compose-btn" onClick={() => navigate('/createpost')}>+ New Post</button>
                        <span className="sp-sep"> • </span>
                        <button className="sp-nav-link" onClick={onLogout}>Logout</button>
                    </div>
                    <form className="sp-search-row" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`sp-sidebar ${showSidebar ? 'active' : ''}`}>
                <div className="sp-sidebar-header">
                    <span style={{ color: '#7ec87e', fontWeight: 'bold' }}>₦ NaijaPulse</span>
                    <button className="sp-close-btn" onClick={() => setShowSidebar(false)}>✕</button>
                </div>
                <div className="sp-sidebar-user">
                    <img src={`https://ui-avatars.com/api/?name=${userName}&background=000000&color=fff&size=80&bold=true`} alt="profile" />
                    <h4>{userName}</h4>
                    <p>{currentUser?.email || ''}</p>
                </div>
                <div className="sp-sidebar-menu">
                    <button onClick={() => { navigate('/home'); setShowSidebar(false); }}>🏠 Home</button>
                    <button onClick={() => { navigate('/profile'); setShowSidebar(false); }}>👤 Profile</button>
                    {currentUser?.role === 'admin' && (
                        <button onClick={() => { navigate('/Administrator/Dashboard'); setShowSidebar(false); }}>👨‍💼 Admin</button>
                    )}
                    <button className="sp-logout-btn" onClick={onLogout}>🚪 Logout</button>
                </div>
            </div>
            {showSidebar && <div className="sp-overlay" onClick={() => setShowSidebar(false)}></div>}
        </>
    );
};

/* ── parse [quote]...[/quote] blocks ── */
const parseComment = (text) => {
    if (!text) return { quote: null, body: '' };
    const match = text.match(/\[quote\s+author=([^\s\]]+)(?:\s+post=[^\]]+)?\]([\s\S]*?)\[\/quote\]/i);
    if (match) {
        return {
            quote: { author: match[1], text: match[2].trim() },
            body: text.replace(match[0], '').trim()
        };
    }
    return { quote: null, body: text };
};

/* ── main component ── */
const SinglePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [quotingComment, setQuotingComment] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => { fetchPost(); }, [id]);

    const fetchPost = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");
            const res = await axios.get(`${API_URL}/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPost(res.data.post);
        } catch (err) {
            setError("Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            await axios.post(`${API_URL}/posts/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            fetchPost();
        } catch (err) { console.error(err); }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            let finalComment = commentText;
            if (quotingComment) {
                const qText = quotingComment.comment?.slice(0, 200);
                const qAuthor = quotingComment.userId?.firstName
                    ? `${quotingComment.userId.firstName} ${quotingComment.userId.lastName || ''}`.trim()
                    : quotingComment.userName || 'User';
                finalComment = `[quote author=${qAuthor} post=${quotingComment._id}]\n${qText}\n[/quote]\n\n${commentText}`;
            }
            await axios.post(`${API_URL}/posts/${id}/comment`,
                { comment: finalComment },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setCommentText("");
            setQuotingComment(null);
            fetchPost();
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete comment?")) return;
        try {
            await axios.delete(`${API_URL}/posts/${id}/comment/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            fetchPost();
        } catch (err) { console.error(err); }
    };

    const handleLikeComment = async (commentId) => {
        try {
            await axios.post(`${API_URL}/posts/${id}/comment/${commentId}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            fetchPost();
        } catch (err) { console.error(err); }
    };

    const getAuthorName = (obj) => {
        if (!obj) return 'Anonymous';
        if (obj.userId && typeof obj.userId === 'object') {
            const n = `${obj.userId.firstName || ''} ${obj.userId.lastName || ''}`.trim();
            return n || obj.userId.email || 'Unknown';
        }
        return obj.authorName || 'Unknown';
    };

    const getCommentAuthor = (c) => {
        if (c.userId && typeof c.userId === 'object') {
            const n = `${c.userId.firstName || ''} ${c.userId.lastName || ''}`.trim();
            return n || c.userId.email || 'Unknown';
        }
        return c.userName || 'Unknown';
    };

    const canDelete = (c) => {
        const cu = currentUser?._id?.toString();
        const co = c.userId?._id?.toString() || c.userId?.toString();
        return cu && (cu === co || cu === post?.authorId?.toString() || currentUser?.role === 'admin');
    };

    const formatTime = (d) => new Date(d).toLocaleString('en-GB', {
        hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric'
    });

    if (loading) return (
        <div className="sp-loading">
            <div className="sp-spinner"></div>
            <p>Loading post...</p>
        </div>
    );
    if (error) return <div className="sp-loading"><p style={{ color: 'red' }}>{error}</p><button onClick={() => navigate(-1)}>Go Back</button></div>;
    if (!post) return <div className="sp-loading"><p>Post not found.</p></div>;

    const hasLiked = post.likes?.some(id => id?.toString() === currentUser?._id?.toString());
    const postAuthor = getAuthorName(post);

    return (
        <div className="sp-page">
            <Navbar currentUser={currentUser} onLogout={handleLogout} navigate={navigate} />

            <div className="sp-content">

                {/* Breadcrumb / back */}
                <div className="sp-breadcrumb">
                    <button className="sp-back-link" onClick={() => navigate('/home')}>← Home</button>
                    <span className="sp-sep"> / </span>
                    <span>{post.postCategory || 'General'}</span>
                </div>

                {/* ── ORIGINAL POST BOX ── */}
                <div className="sp-thread-box">
                    {/* Box header — Nairaland style */}
                    <div className="sp-thread-header">
                        <span className="sp-thread-title">{post.postTitle}</span>
                        <span> by </span>
                        <span className="sp-thread-author">{postAuthor}</span>
                        <span className="sp-thread-time">: {formatTime(post.createdAt)}</span>
                    </div>

                    {/* Post body */}
                    <div className="sp-thread-body">
                        {post.postImage && (
                            <img src={post.postImage} alt={post.postTitle} className="sp-post-img" />
                        )}
                        <p className="sp-post-text">{post.postContent}</p>
                    </div>

                    {/* Post actions */}
                    <div className="sp-thread-actions">
                        <button
                            className={`sp-action-btn ${hasLiked ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            {hasLiked ? '❤️' : '🤍'} Like ({post.likes?.length || 0})
                        </button>
                        <span className="sp-action-stat">💬 {post.comments?.length || 0} Replies</span>
                        <button className="sp-action-btn" onClick={() => setQuotingComment(null)}>Reply</button>
                    </div>
                </div>

                {/* ── COMMENTS ── */}
                <div className="sp-comments-section">
                    {(!post.comments || post.comments.length === 0) ? (
                        <div className="sp-no-comments">No replies yet. Be the first!</div>
                    ) : (
                        post.comments.map((c, i) => {
                            const author = getCommentAuthor(c);
                            const isLiked = c.likes?.some(id => id?.toString() === currentUser?._id?.toString());
                            const { quote, body } = parseComment(c.comment);

                            return (
                                <div key={c._id} className="sp-comment-box">
                                    {/* Comment header — "Re: Title by Author: time" */}
                                    <div className="sp-comment-header">
                                        <span>
                                            <span className="sp-re-title">Re: {post.postTitle}</span>
                                            <span> by </span>
                                            <span className="sp-comment-author">{author}</span>
                                            <span className="sp-comment-time">: {formatTime(c.createdAt)}</span>
                                        </span>
                                        <span className="sp-comment-num">#{i + 1}</span>
                                    </div>

                                    {/* Comment body */}
                                    <div className="sp-comment-body">
                                        {quote && (
                                            <div className="sp-quote-block">
                                                <div className="sp-quote-author">{quote.author} wrote:</div>
                                                <div className="sp-quote-text">{quote.text}</div>
                                            </div>
                                        )}
                                        <p className="sp-comment-text">{body}</p>
                                    </div>

                                    {/* Comment actions — Quote / Likes / Like / Delete */}
                                    <div className="sp-comment-actions">
                                        <button className="sp-btn-pill" onClick={() => {
                                            setQuotingComment(c);
                                            document.getElementById('sp-reply-box')?.scrollIntoView({ behavior: 'smooth' });
                                        }}>Quote</button>
                                        <span className="sp-likes-count">{c.likes?.length || 0} Likes</span>
                                        <button
                                            className={`sp-btn-pill ${isLiked ? 'sp-liked' : ''}`}
                                            onClick={() => handleLikeComment(c._id)}
                                        >
                                            {isLiked ? '❤️ Liked' : '🤍 Like'}
                                        </button>
                                        {canDelete(c) && (
                                            <button className="sp-btn-pill sp-delete" onClick={() => handleDeleteComment(c._id)}>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ── REPLY BOX ── */}
                <div className="sp-reply-section" id="sp-reply-box">
                    <div className="sp-reply-header">Post a Reply</div>

                    {quotingComment && (
                        <div className="sp-quoting-banner">
                            <span>Quoting <strong>{getCommentAuthor(quotingComment)}</strong>: "{quotingComment.comment?.slice(0, 80)}..."</span>
                            <button onClick={() => setQuotingComment(null)}>✕ Cancel</button>
                        </div>
                    )}

                    <textarea
                        className="sp-textarea"
                        rows={5}
                        placeholder="Write your reply..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="sp-reply-footer">
                        <button
                            className="sp-post-btn"
                            onClick={handleAddComment}
                            disabled={submitting || !commentText.trim()}
                        >
                            {submitting ? 'Posting...' : 'Post Reply'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SinglePost;