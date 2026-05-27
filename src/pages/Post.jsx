import React from "react";

function Post() {
  return (
    <div>
      <h1>Create a Post</h1>
      <div className="card p-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" placeholder="Post title" />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea className="form-control" rows="5" placeholder="Write your thoughts..."></textarea>
        </div>
        <button className="btn btn-success">Submit Post</button>
      </div>
    </div>
  );
}

export default Post;