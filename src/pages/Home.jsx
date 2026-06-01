import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const API_URL = "https://naijapulse.vercel.app/api/v1";

    const categories = [
        { id: 'all', name: 'All', icon: '🌐' },
        { id: 'technology', name: 'Technology', icon: '💻' },
        { id: 'politics', name: 'Politics', icon: '🏛️' },
        { id: 'sport', name: 'Sport', icon: '⚽' },
        { id: 'security', name: 'Security', icon: '🛡️' },
        { id: 'education', name: 'Education', icon: '📖' },
        { id: 'health', name: 'Health', icon: '❤️' }
    ];

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(user);
        fetchPosts();
    }, []);

    useEffect(() => {
        let filtered = [...posts];
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(post => post.postCategory === selectedCategory);
        }
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFilteredPosts(filtered);
    }, [posts, selectedCategory]);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) { setLoading(false); return; }
            const response = await axios.get(`${API_URL}/posts/getAllPosts`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const postsData = response.data.posts || [];
            setPosts(postsData);
            setFilteredPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const q = searchInput.trim();
        if (!q) return;
        setIsSearching(true);
        setSearchQuery(q);
        try {
            const response = await axios.get(`${API_URL}/posts/search?q=${encodeURIComponent(q)}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            console.log("Search API response:", response.data);
            const results =
                response.data.posts ||
                response.data.data ||
                response.data.results ||
                (Array.isArray(response.data) ? response.data : []);
            console.log("Parsed results count:", results.length);

            if (results.length > 0) {
                setSearchResults(results);
            } else {
                // Fallback: filter already-loaded posts client-side
                const lower = q.toLowerCase();
                const clientResults = posts.filter(p =>
                    p.postTitle?.toLowerCase().includes(lower) ||
                    p.postContent?.toLowerCase().includes(lower) ||
                    p.authorName?.toLowerCase().includes(lower) ||
                    p.postCategory?.toLowerCase().includes(lower)
                );
                console.log("Client-side fallback results:", clientResults.length);
                setSearchResults(clientResults);
            }
        } catch (error) {
            console.error("Search API failed, falling back to client-side:", error.response?.data || error.message);
            // Fallback: filter already-loaded posts client-side
            const lower = q.toLowerCase();
            const clientResults = posts.filter(p =>
                p.postTitle?.toLowerCase().includes(lower) ||
                p.postContent?.toLowerCase().includes(lower) ||
                p.authorName?.toLowerCase().includes(lower) ||
                p.postCategory?.toLowerCase().includes(lower)
            );
            console.log("Client-side fallback results:", clientResults.length);
            setSearchResults(clientResults);
        } finally {
            setIsSearching(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            await fetchPosts();
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setSearchResults([]);
    };

    const userName = currentUser?.name ||
        `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'Guest';

    const isShowingSearch = searchQuery.length > 0;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading stories...</p>
            </div>
        );
    }

    return (
        <>
            {/* ── HEADER BOX ── */}
            <nav className="premium-navbar">
                <div className="nav-container">
                    <button className="menu-btn" onClick={() => setShowOffcanvas(true)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>

                    <div className="logo" onClick={() => navigate('/home')}>
                        <span className="logo-icon">₦</span>
                        <span className="logo-text">NaijaPulse Forum</span>
                    </div>

                    <div className="nav-stats-line">
                        <span>Welcome,&nbsp;</span>
                        <span className="nav-username" onClick={() => navigate('/profile')}>{userName}</span>
                        <span className="nav-sep"> • </span>
                        <button className="nav-link" onClick={() => navigate('/profile')}>Edit Profile</button>
                        <span className="nav-sep"> • </span>
                        <button className="nav-link" onClick={() => navigate('/home')}>Home</button>
                        {currentUser?.role === 'admin' && (
                            <>
                                <span className="nav-sep"> • </span>
                                <button className="nav-link" onClick={() => navigate('/Administrator/Dashboard')}>Admin</button>
                            </>
                        )}
                        <span className="nav-sep"> • </span>
                        <button className="compose-btn" onClick={() => navigate('/createpost')}>+ New Post</button>
                        <span className="nav-sep"> • </span>
                        <button className="nav-link" onClick={handleLogout}>Logout</button>
                    </div>

                    {/* Search bar */}
                    <form className="nav-search-row" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit" disabled={isSearching}>
                            {isSearching ? '...' : 'Search'}
                        </button>
                    </form>
                </div>
            </nav>

            {/* ── SIDEBAR ── */}
            <div className={`premium-sidebar ${showOffcanvas ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span style={{ fontSize: 18 }}>₦</span>
                        <span style={{ color: '#7ec87e', fontSize: 15, fontWeight: 'bold', marginLeft: 5 }}>NaijaPulse</span>
                    </div>
                    <button className="close-btn" onClick={() => setShowOffcanvas(false)}>✕</button>
                </div>
                <div className="sidebar-user">
                    <img
                        src={`https://ui-avatars.com/api/?name=${userName}&background=000000&color=fff&size=80&bold=true`}
                        alt="profile"
                    />
                    <h4>{userName}</h4>
                    <p>{currentUser?.email || 'Not signed in'}</p>
                </div>
                <div className="sidebar-menu">
                    <button onClick={() => { navigate('/home'); setShowOffcanvas(false); }}><span>🏠</span> Home</button>
                    <button onClick={() => { navigate('/profile'); setShowOffcanvas(false); }}><span>👤</span> Profile</button>
                    {currentUser?.role === 'admin' && (
                        <button onClick={() => { navigate('/Administrator/Dashboard'); setShowOffcanvas(false); }}>
                            <span>👨‍💼</span> Admin Dashboard
                        </button>
                    )}
                    <button onClick={handleLogout} className="logout-btn"><span>🚪</span> Logout</button>
                </div>
            </div>
            {showOffcanvas && <div className="sidebar-overlay" onClick={() => setShowOffcanvas(false)}></div>}

            {/* ── MAIN ── */}
            <main className="main-content">
                <div className="content-container">

                    {/* ── SEARCH RESULTS VIEW ── */}
                    {isShowingSearch ? (
                        <>
                            <div className="search-header">
                                <span>
                                    {isSearching
                                        ? 'Searching...'
                                        : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                                </span>
                                <button onClick={clearSearch}>✕ Clear</button>
                            </div>

                            {searchResults.length > 0 ? (
                                <div className="posts-feed">
                                    {searchResults.map(post => (
                                        <PostCard key={post._id} post={post} handleLike={handleLike}
                                            currentUser={currentUser} onPostUpdate={fetchPosts} API_URL={API_URL} />
                                    ))}
                                </div>
                            ) : !isSearching ? (
                                <div className="empty-search">
                                    <span>🔍</span>
                                    <h3>No results found</h3>
                                    <p>Try a different search term</p>
                                    <button onClick={clearSearch}>Back to Home</button>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        /* ── NORMAL FEED VIEW ── */
                        <>
                            <div className="categories-section">
                                <div className="categories-header">
                                    <h2>NaijaPulse Topics</h2>
                                </div>
                                <div className="categories-list">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                                            onClick={() => setSelectedCategory(cat.id)}
                                        >
                                            <span>{cat.icon}</span>
                                            <span>{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {filteredPosts.length > 0 ? (
                                <div className="posts-feed">
                                    {filteredPosts.map(post => (
                                        <PostCard key={post._id} post={post} handleLike={handleLike}
                                            currentUser={currentUser} onPostUpdate={fetchPosts} API_URL={API_URL} />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <span>📭</span>
                                    <h3>No posts in this category</h3>
                                    <p>Be the first to share a story!</p>
                                    <button onClick={() => navigate('/createpost')}>Create a Post</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

const PostCard = ({ post, handleLike, currentUser, onPostUpdate, API_URL }) => {
    const navigate = useNavigate();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [localComments, setLocalComments] = useState(post.comments || []);
    const [likingCommentId, setLikingCommentId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    useEffect(() => { setLocalComments(post.comments || []); }, [post.comments]);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        try {
            const response = await axios.post(
                `${API_URL}/posts/${post._id}/comment`,
                { comment: commentText },
                { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
            );
            if (response.data.success) { await onPostUpdate(); setCommentText(''); }
        } catch (error) { console.error("Error adding comment:", error); }
    };

    const handleLikeComment = async (commentId) => {
        setLikingCommentId(commentId);
        try {
            await axios.post(`${API_URL}/posts/${post._id}/comment/${commentId}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            await onPostUpdate();
        } catch (error) { console.error("Error liking comment:", error); }
        finally { setLikingCommentId(null); }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        setDeletingCommentId(commentId);
        try {
            await axios.delete(`${API_URL}/posts/${post._id}/comment/${commentId}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            await onPostUpdate();
        } catch (error) { console.error("Error deleting comment:", error); }
        finally { setDeletingCommentId(null); }
    };

    const canDeleteComment = (comment) => {
        const cu = currentUser?._id?.toString();
        const co = comment.userId?._id?.toString() || comment.userId?.toString();
        return (cu && cu === co) || (cu && cu === post.authorId?.toString()) || currentUser?.role === 'admin';
    };

    const isCommentLiked = (comment) =>
        comment.likes?.some(id => id?.toString() === currentUser?._id?.toString());

    return (
        <article className="post-card-modern">
            <div className="post-content">
                <h3
                    className="post-title clickable-title"
                    onClick={() => navigate(`/post/${post._id}`)}
                >
                    » {post.postTitle}
                </h3>

                {showComments && (
                    <div className="comments-section">
                        <div className="add-comment">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <button onClick={handleAddComment}>Post</button>
                        </div>
                        {localComments.length === 0 ? (
                            <div className="no-comments"><p>No comments yet.</p></div>
                        ) : (
                            localComments.map((comment) => {
                                const commentId = comment._id;
                                const commentUser = comment.userId || {};
                                const uName = commentUser.name || comment.userName || 'User';
                                return (
                                    <div key={commentId} className="comment">
                                        <img src={`https://ui-avatars.com/api/?name=${uName}&background=000000&color=fff&size=32&bold=true`} alt={uName} />
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <strong>{uName}</strong>
                                                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p>{comment.comment}</p>
                                            <div className="comment-actions">
                                                <button
                                                    className={`comment-like-btn ${isCommentLiked(comment) ? 'active' : ''}`}
                                                    onClick={() => handleLikeComment(commentId)}
                                                    disabled={likingCommentId === commentId}
                                                >
                                                    {likingCommentId === commentId ? <span className="small-spinner"></span> : <>❤️ {comment.likes?.length || 0}</>}
                                                </button>
                                                {canDeleteComment(comment) && (
                                                    <button
                                                        className="comment-delete-btn"
                                                        onClick={() => handleDeleteComment(commentId)}
                                                        disabled={deletingCommentId === commentId}
                                                    >
                                                        {deletingCommentId === commentId ? <span className="small-spinner"></span> : '🗑️ Delete'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </article>
    );
};

export default Home;