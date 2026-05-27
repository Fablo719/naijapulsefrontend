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
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${API_URL}/posts/getAllPosts`,
                {
                    headers: { "Authorization": `Bearer ${token}` }
                }
            );
            
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
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const response = await axios.get(
                `${API_URL}/posts/search?q=${searchQuery}`,
                {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                }
            );
            setSearchResults(response.data.posts || []);
        } catch (error) {
            console.error("Error searching posts:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(
                `${API_URL}/posts/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
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
        setSearchQuery('');
        setSearchResults([]);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading amazing stories...</p>
            </div>
        );
    }

    return (
        <>
            <nav className="premium-navbar">
                <div className="nav-container">
                    <div className="nav-left">
                        <button className="menu-btn" onClick={() => setShowOffcanvas(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div className="logo" onClick={() => navigate('/home')}>
                            <span className="logo-icon">🚨</span>
                            <span className="logo-text">NaijaPulse</span>
                        </div>
                    </div>

                    <div className="nav-right">
                        <button className="compose-btn" onClick={() => navigate('/createpost')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span>Compose</span>
                        </button>
                        <div className="user-avatar" onClick={() => setShowOffcanvas(true)}>
                            <img 
                                src={`https://ui-avatars.com/api/?name=${currentUser?.name || currentUser?.firstName || 'User'}&background=000000&color=fff&size=40&bold=true`} 
                                alt="avatar" 
                            />
                        </div>
                    </div>
                </div>
            </nav>

            <div className={`premium-sidebar ${showOffcanvas ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">🚨</span>
                        <span className="logo-text">NaijaPulse</span>
                    </div>
                    <button className="close-btn" onClick={() => setShowOffcanvas(false)}>✕</button>
                </div>
                
                <div className="sidebar-user">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${currentUser?.name || currentUser?.firstName || 'User'}&background=000000&color=fff&size=80&bold=true`} 
                        alt="profile" 
                    />
                    <h4>{currentUser?.name || `${currentUser?.firstName} ${currentUser?.lastName}` || 'Guest User'}</h4>
                    <p>{currentUser?.email || 'Not signed in'}</p>
                </div>

                <div className="sidebar-menu">
                    <button onClick={() => { navigate('/home'); setShowOffcanvas(false); }}>
                        <span>🏠</span> Home
                    </button>
                    <button onClick={() => { navigate('/profile'); setShowOffcanvas(false); }}>
                        <span>👤</span> Profile
                    </button>
                    {currentUser?.role === "admin" && (
                        <button onClick={() => { navigate('/Administrator/Dashboard'); setShowOffcanvas(false); }}>
                            <span>👨‍💼</span> Admin's Dashboard
                        </button>
                    )}
                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span> Logout
                    </button>
                </div>
            </div>

            {showOffcanvas && <div className="sidebar-overlay" onClick={() => setShowOffcanvas(false)}></div>}

            <main className="main-content">
                <div className="content-container">
                    {searchQuery && searchResults.length > 0 ? (
                        <>
                            <div className="search-header">
                                <h2>Search Results for "{searchQuery}"</h2>
                                <button onClick={clearSearch}>Clear Search</button>
                            </div>
                            <div className="posts-feed">
                                {searchResults.map(post => (
                                    <PostCard 
                                        key={post._id} 
                                        post={post} 
                                        handleLike={handleLike} 
                                        currentUser={currentUser}
                                        onPostUpdate={fetchPosts}
                                        API_URL={API_URL}
                                    />
                                ))}
                            </div>
                        </>
                    ) : searchQuery ? (
                        <div className="empty-search">
                            <span>🔍</span>
                            <h3>No results found</h3>
                            <p>Try searching for something else</p>
                            <button onClick={clearSearch}>Clear Search</button>
                        </div>
                    ) : (
                        <>
                            <div className="categories-section">
                                <div className="categories-header">
                                    <h2>Trending</h2>
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
                                        <PostCard 
                                            key={post._id} 
                                            post={post} 
                                            handleLike={handleLike} 
                                            currentUser={currentUser}
                                            onPostUpdate={fetchPosts}
                                            API_URL={API_URL}
                                        />
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
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [localComments, setLocalComments] = useState(post.comments || []);
    const [expanded, setExpanded] = useState(false);
    const [likingCommentId, setLikingCommentId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

    useEffect(() => { 
        setLocalComments(post.comments || []); 
    }, [post.comments]);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        try {
            const response = await axios.post(
                `${API_URL}/posts/${post._id}/comment`,
                { comment: commentText },
                { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
            );
            if (response.data.success) {
                await onPostUpdate();
                setCommentText('');
            }
        } catch (error) { 
            console.error("Error adding comment:", error);
        }
    };

    const handleLikeComment = async (commentId) => {
        setLikingCommentId(commentId);
        try {
            await axios.post(
                `${API_URL}/posts/${post._id}/comment/${commentId}/like`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );
            await onPostUpdate();
        } catch (error) {
            console.error("Error liking comment:", error);
        } finally {
            setLikingCommentId(null);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        
        setDeletingCommentId(commentId);
        try {
            await axios.delete(
                `${API_URL}/posts/${post._id}/comment/${commentId}`,
                { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
            );
            await onPostUpdate();
        } catch (error) {
            console.error("Error deleting comment:", error);
        } finally {
            setDeletingCommentId(null);
        }
    };

    const isLiked = post.likes?.some(id => id?.toString() === currentUser?._id?.toString());
    const trendingScore = (post.likes?.length || 0) + (post.comments?.length || 0);

    const getCategoryIcon = (category) => {
        const icons = {
            technology: '💻',
            politics: '🏛️',
            sport: '⚽',
            security: '🛡️',
            education: '📖',
            health: '❤️'
        };
        return icons[category] || '📄';
    };

    const canDeleteComment = (comment) => {
        const currentUserId = currentUser?._id?.toString();
        const commentUserId = comment.userId?._id?.toString() || comment.userId?.toString();
        const postAuthorId = post.authorId?.toString();
        
        return (
            (currentUserId && currentUserId === commentUserId) ||
            (currentUserId && currentUserId === postAuthorId) ||
            currentUser?.role === "admin"
        );
    };

    const isCommentLiked = (comment) => {
        return comment.likes?.some(id => id?.toString() === currentUser?._id?.toString());
    };

    return (
        <article className="post-card-modern">
            {post.postImage && (
                <div className="post-image">
                    <img src={post.postImage} alt={post.postTitle} />
                </div>
            )}
            <div className="post-content">
                <div className="post-meta">
                    <div className="author-info">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${post.authorName}&background=000000&color=fff&size=32&bold=true`} 
                            alt={post.authorName} 
                        />
                        <div>
                            <span className="author-name">{post.authorName}</span>
                            <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <span className="category-badge">
                        {getCategoryIcon(post.postCategory)} {post.postCategory}
                    </span>
                    {trendingScore > 10 && (
                        <span className="trending-badge">🔥 Trending</span>
                    )}
                </div>

                <h3 className="post-title">{post.postTitle}</h3>
                
                <p className="post-excerpt">
                    {expanded ? post.postContent : post.postContent?.slice(0, 180)}
                    {post.postContent?.length > 180 && (
                        <button className="read-more" onClick={() => setExpanded(!expanded)}>
                            {expanded ? 'Show less' : '...Read more'}
                        </button>
                    )}
                </p>

                <div className="post-stats">
                    <button 
                        className={`stat-btn like-btn ${isLiked ? 'active' : ''}`} 
                        onClick={() => handleLike(post._id)}
                    >
                        <svg 
                            width="18" 
                            height="18" 
                            viewBox="0 0 24 24" 
                            fill={isLiked ? "currentColor" : "none"} 
                            stroke="currentColor"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>{post.likes?.length || 0}</span>
                    </button>
                    <button 
                        className="stat-btn comment-btn" 
                        onClick={() => setShowComments(!showComments)}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2"/>
                        </svg>
                        <span>{localComments.length}</span>
                    </button>
                </div>

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
                            <div className="no-comments">
                                <p>No comments yet. Be the first to comment!</p>
                            </div>
                        ) : (
                            localComments.map((comment) => {
                                const commentId = comment._id;
                                const commentUser = comment.userId || {};
                                const userName = commentUser.name || comment.userName || 'User';
                                const userAvatar = commentUser.name || userName;
                                
                                return (
                                    <div key={commentId} className="comment">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${userAvatar}&background=000000&color=fff&size=32&bold=true`} 
                                            alt={userName} 
                                        />
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <strong>{userName}</strong>
                                                <span className="comment-date">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p>{comment.comment}</p>
                                            <div className="comment-actions">
                                                <button 
                                                    className={`comment-like-btn ${isCommentLiked(comment) ? 'active' : ''}`}
                                                    onClick={() => handleLikeComment(commentId)}
                                                    disabled={likingCommentId === commentId}
                                                >
                                                    {likingCommentId === commentId ? (
                                                        <span className="small-spinner"></span>
                                                    ) : (
                                                        <>❤️ {comment.likes?.length || 0}</>
                                                    )}
                                                </button>
                                                
                                                {canDeleteComment(comment) && (
                                                    <button 
                                                        className="comment-delete-btn"
                                                        onClick={() => handleDeleteComment(commentId)}
                                                        disabled={deletingCommentId === commentId}
                                                    >
                                                        {deletingCommentId === commentId ? (
                                                            <span className="small-spinner"></span>
                                                        ) : (
                                                            '🗑️ Delete'
                                                        )}
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