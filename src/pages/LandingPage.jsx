import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary">MyBlog</a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create">Write</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">
            Share Your Ideas With The World 🌍
          </h1>
          <p className="lead mt-3">
            Create, read and explore amazing blog posts from different writers.
          </p>
          <Link to="/create" className="btn btn-light btn-lg mt-3">
            Start composing
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5"> Posts</h2>

          <div className="row">
            {[1, 2, 3].map((post) => (
              <div key={post} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Sample Blog {post}</h5>
                    <p className="card-text">
                      This is a short preview of your blog post content.
                    </p>
                    <Link to={`/post/${post}`} className="btn btn-primary btn-sm">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-light text-center py-3 border-top">
        <p className="mb-0">© 2026 NaijaPulse. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default LandingPage;